import { writeFile } from "node:fs/promises";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4173";
const debugBase = process.argv[3] ?? "http://127.0.0.1:9222";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createSession({ mobile = false } = {}) {
  const response = await fetch(debugBase + "/json/new?" + encodeURIComponent("about:blank"), { method: "PUT" });
  if (!response.ok) {
    throw new Error("Cannot create Chrome target: " + response.status);
  }

  const target = await response.json();
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let nextId = 0;
  const pending = new Map();
  const browserErrors = [];

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);

    if (message.id) {
      const waiter = pending.get(message.id);
      if (!waiter) return;
      pending.delete(message.id);
      if (message.error) waiter.reject(new Error(message.error.message));
      else waiter.resolve(message.result);
      return;
    }

    if (message.method === "Runtime.exceptionThrown") {
      browserErrors.push("Runtime exception: " + (message.params.exceptionDetails?.text ?? "unknown"));
    }

    if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
      const value = message.params.args
        .map((arg) => arg.value ?? arg.description ?? "")
        .join(" ");
      browserErrors.push("console.error: " + value);
    }

    if (message.method === "Log.entryAdded" && message.params.entry?.level === "error") {
      const entry = message.params.entry;
      browserErrors.push("Browser log error: " + (entry.text ?? "unknown") + (entry.url ? " @ " + entry.url : ""));
    }
  });

  function call(method, params = {}) {
    const id = ++nextId;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }

  await call("Runtime.enable");
  await call("Log.enable");
  await call("Page.enable");

  if (mobile) {
    await call("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true,
      screenWidth: 390,
      screenHeight: 844,
    });
    await call("Emulation.setTouchEmulationEnabled", {
      enabled: true,
      maxTouchPoints: 5,
    });
  }

  return {
    call,
    errors: browserErrors,
    close() { socket.close(); },
  };
}

async function evaluate(session, expression) {
  const result = await session.call("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });

  if (result.exceptionDetails) {
    throw new Error("Evaluation failed: " + (result.exceptionDetails.text ?? expression));
  }

  return result.result?.value;
}

async function waitForApp(session, url) {
  await session.call("Page.navigate", { url });

  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const ready = await evaluate(
        session,
        'document.readyState === "complete" && Boolean(document.querySelector("#app")) && Boolean(document.querySelector("#viewer canvas"))',
      );
      if (ready) {
        await delay(350);
        return;
      }
    } catch {
      // Navigation can replace the execution context between polls.
    }
    await delay(100);
  }

  throw new Error("App did not become ready: " + url);
}

async function assertEval(session, expression, message) {
  const ok = await evaluate(session, expression);
  if (!ok) throw new Error(message);
}

async function capturePage(session) {
  const result = await session.call("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
  });
  return result.data;
}

async function saveScreenshot(session, path) {
  const data = await capturePage(session);
  await writeFile(path, Buffer.from(data, "base64"));
}

async function assertMobileLayout(session, label) {
  const metrics = await evaluate(
    session,
    `(() => {
      const canvas = document.querySelector("#viewer canvas");
      const viewer = document.querySelector(".viewer-wrap");
      const toolbar = document.querySelector(".viewer-toolbar");
      if (!canvas || !viewer || !toolbar) return null;
      const viewerRect = viewer.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const toolbarRect = toolbar.getBoundingClientRect();
      const note = document.querySelector(".viewer-note");
      const noteRect = note?.getBoundingClientRect();
      const topbar = document.querySelector(".topbar");
      const topbarRect = topbar?.getBoundingClientRect();
      return {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        viewerLeft: viewerRect.left,
        viewerRight: viewerRect.right,
        viewerWidth: viewerRect.width,
        viewerHeight: viewerRect.height,
        viewerTop: viewerRect.top,
        canvasTop: canvasRect.top,
        canvasWidth: canvasRect.width,
        toolbarRight: toolbarRect.right,
        toolbarBottom: toolbarRect.bottom,
        toolbarHeight: toolbarRect.height,
        noteHeight: noteRect?.height ?? 0,
        topbarHeight: topbarRect?.height ?? 0,
      };
    })()`,
  );

  if (!metrics) throw new Error(label + ": mobile layout metrics are unavailable");
  console.log(label + " mobile metrics: " + JSON.stringify(metrics));
  if (metrics.scrollWidth > metrics.innerWidth + 1) {
    throw new Error(label + ": horizontal overflow detected (" + metrics.scrollWidth + " > " + metrics.innerWidth + ")");
  }
  if (metrics.viewerWidth < 320 || metrics.viewerLeft < -1 || metrics.viewerRight > metrics.innerWidth + 1) {
    throw new Error(label + ": viewer does not fit the mobile viewport");
  }
  if (Math.abs(metrics.canvasWidth - metrics.viewerWidth) > 1) {
    throw new Error(label + ": canvas width does not match the mobile viewer");
  }
  if (metrics.toolbarRight > metrics.innerWidth + 1) {
    throw new Error(label + ": viewer toolbar overflows the mobile viewport");
  }
  if (metrics.viewerTop > metrics.innerHeight * 0.4) {
    throw new Error(label + ": 3D viewer is pushed below the first mobile screen");
  }
  if (metrics.toolbarBottom > metrics.canvasTop + 1) {
    throw new Error(label + ": mobile viewer toolbar overlaps the 3D canvas");
  }
  if (metrics.toolbarHeight > metrics.viewerHeight * 0.22) {
    throw new Error(label + ": mobile viewer toolbar consumes too much vertical space");
  }
  if (metrics.noteHeight > metrics.viewerHeight * 0.14) {
    throw new Error(label + ": mobile viewer note consumes too much of the 3D scene");
  }

}

function assertScreenshotChanged(before, after, message) {
  if (!before || !after || before === after) {
    throw new Error(message);
  }
}

async function smokeViewerInput(session) {
  const rect = await evaluate(
    session,
    '(() => { const canvas = document.querySelector("#viewer canvas"); if (!canvas) return null; const r = canvas.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()',
  );

  if (!rect) throw new Error("3D canvas is missing");

  await session.call("Input.dispatchMouseEvent", {
    type: "mousePressed", x: rect.x, y: rect.y, button: "left", buttons: 1, clickCount: 1,
  });
  await session.call("Input.dispatchMouseEvent", {
    type: "mouseMoved", x: rect.x + 90, y: rect.y + 35, button: "left", buttons: 1,
  });
  await session.call("Input.dispatchMouseEvent", {
    type: "mouseReleased", x: rect.x + 90, y: rect.y + 35, button: "left", buttons: 0, clickCount: 1,
  });
  await session.call("Input.dispatchMouseEvent", {
    type: "mouseWheel", x: rect.x, y: rect.y, deltaX: 0, deltaY: -180,
  });

  await delay(250);
}


async function smokeViewerTouch(session) {
  await evaluate(
    session,
    'document.querySelector(".viewer-wrap").scrollIntoView({ block: "center", behavior: "instant" })',
  );
  await delay(120);

  const rect = await evaluate(
    session,
    '(() => { const canvas = document.querySelector("#viewer canvas"); if (!canvas) return null; const r = canvas.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()',
  );
  if (!rect) throw new Error("Mobile: 3D canvas is missing");

  const before = await capturePage(session);
  await session.call("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: rect.x, y: rect.y, radiusX: 8, radiusY: 8, force: 1, id: 1 }],
  });
  await session.call("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: rect.x + 70, y: rect.y + 28, radiusX: 8, radiusY: 8, force: 1, id: 1 }],
  });
  await session.call("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await delay(280);

  const after = await capturePage(session);
  assertScreenshotChanged(before, after, "Mobile: touch orbit did not change the rendered view");
}

async function clickLinkedWallThroughCanvas(session) {
  await evaluate(session, 'document.querySelector("#showAllBtn").click()');
  await delay(180);
  await evaluate(session, 'document.querySelector("#resetCameraBtn").click()');
  await delay(300);
  await evaluate(session, 'document.querySelector("#showResultBtn").click()');

  const canvas = await evaluate(
    session,
    '(() => { const el = document.querySelector("#viewer canvas"); const r = el.getBoundingClientRect(); return { left: r.left, top: r.top, width: r.width, height: r.height }; })()',
  );

  const candidates = [
    [0.58, 0.40],
    [0.72, 0.46],
    [0.35, 0.46],
    [0.50, 0.32],
  ];

  for (const [fx, fy] of candidates) {
    const x = canvas.left + canvas.width * fx;
    const y = canvas.top + canvas.height * fy;

    await session.call("Input.dispatchMouseEvent", {
      type: "mousePressed", x, y, button: "left", buttons: 1, clickCount: 1,
    });
    await session.call("Input.dispatchMouseEvent", {
      type: "mouseReleased", x, y, button: "left", buttons: 0, clickCount: 1,
    });
    await delay(180);

    const linked = await evaluate(
      session,
      'document.querySelector("#serviceRow").classList.contains("selected") && document.querySelector("#selectionChip").textContent.includes("Избрано:")',
    );
    if (linked) return;

    await evaluate(session, 'document.querySelector("#showResultBtn").click()');
  }

  throw new Error("Work: clicking visible 3D geometry did not resolve a linked Fine Putty wall");
}

function throwBrowserErrors(session) {
  if (session.errors.length) {
    throw new Error(session.errors.join(String.fromCharCode(10)));
  }
}

async function runWorkSmoke() {
  const session = await createSession();
  try {
    await waitForApp(session, baseUrl);

    await assertEval(session, 'document.querySelector("#viewer canvas") instanceof HTMLCanvasElement', "Work: true 3D canvas is missing");
    await assertEval(session, 'getComputedStyle(document.querySelector(".panel.left")).display !== "none"', "Work: authoring panel should be visible");
    await assertEval(session, 'document.querySelector("#quantityText").textContent.includes("m²")', "Work: quantity is not rendered");

    const beforeViewerInput = await capturePage(session);
    await smokeViewerInput(session);
    const afterViewerInput = await capturePage(session);
    assertScreenshotChanged(
      beforeViewerInput,
      afterViewerInput,
      "Work: orbit/zoom input did not change the rendered view",
    );

    await evaluate(session, 'document.querySelector("#resetCameraBtn").click()');
    await delay(450);

    await evaluate(session, 'document.querySelector("#autoCutawayBtn").click()');
    await assertEval(session, '!document.querySelector("#autoCutawayBtn").classList.contains("active")', "Work: auto cutaway did not turn off");
    await delay(200);

    const manualBaseline = await capturePage(session);
    await evaluate(session, "document.querySelector('[data-wall=\"room-1.wall-right\"]').click()");
    await delay(200);
    await assertEval(session, "document.querySelector('[data-wall=\"room-1.wall-right\"]').classList.contains('active')", "Work: manual wall hide did not activate");
    const wallHidden = await capturePage(session);
    assertScreenshotChanged(
      manualBaseline,
      wallHidden,
      "Work: hiding a wall did not change the rendered view",
    );
    await evaluate(session, "document.querySelector('[data-wall=\"room-1.wall-right\"]').click()");
    await delay(200);

    const ceilingBaseline = await capturePage(session);
    await evaluate(session, "document.querySelector('[data-wall=\"room-1.ceiling\"]').click()");
    await delay(200);
    await assertEval(session, "document.querySelector('[data-wall=\"room-1.ceiling\"]').classList.contains('active')", "Work: manual ceiling hide did not activate");
    const ceilingHidden = await capturePage(session);
    assertScreenshotChanged(
      ceilingBaseline,
      ceilingHidden,
      "Work: hiding the ceiling did not change the rendered view",
    );
    await evaluate(session, "document.querySelector('[data-wall=\"room-1.ceiling\"]').click()");
    await delay(150);

    await evaluate(session, 'document.querySelector("#autoCutawayBtn").click()');
    await assertEval(session, 'document.querySelector("#autoCutawayBtn").classList.contains("active")', "Work: auto cutaway did not turn back on");

    const offerBefore = await evaluate(
      session,
      '({ quantity: document.querySelector("#quantityText").textContent, total: document.querySelector("#lineTotalText").textContent, info: document.querySelector("#infoWhat").textContent })',
    );
    const focusedView = await capturePage(session);
    await evaluate(session, 'document.querySelector("#showResultBtn").click()');
    await assertEval(session, '!document.querySelector("#serviceRow").classList.contains("selected")', "Work: show whole result did not exit service focus");
    await delay(150);
    const wholeResultView = await capturePage(session);
    assertScreenshotChanged(
      focusedView,
      wholeResultView,
      "Work: exiting service focus did not change the model presentation",
    );
    await evaluate(session, 'document.querySelector("#serviceRow").click()');
    await assertEval(session, 'document.querySelector("#serviceRow").classList.contains("selected")', "Work: clicking Fine Putty did not restore offer focus");
    const offerAfter = await evaluate(
      session,
      '({ quantity: document.querySelector("#quantityText").textContent, total: document.querySelector("#lineTotalText").textContent, info: document.querySelector("#infoWhat").textContent })',
    );
    if (JSON.stringify(offerAfter) !== JSON.stringify(offerBefore)) {
      throw new Error("Work: quantity/price/Info changed during presentation-only interaction");
    }

    await clickLinkedWallThroughCanvas(session);
    await assertEval(
      session,
      'document.querySelector("#serviceRow").classList.contains("selected")',
      "Work: Model → Offer did not emphasize Fine Putty after linked wall click",
    );

    await evaluate(session, 'document.querySelector("#previewModeBtn").click()');
    await assertEval(session, 'document.querySelector("#shell").classList.contains("preview-mode")', "Work: Preview as Client did not activate");
    await assertEval(session, 'getComputedStyle(document.querySelector(".panel.left")).display === "none"', "Work preview: authoring panel leaked into Client mode");
    await assertEval(session, 'getComputedStyle(document.querySelector("#exitPreviewBtn")).display !== "none"', "Work preview: owner return control is missing");

    await evaluate(session, 'document.querySelector("#exitPreviewBtn").click()');
    await assertEval(session, '!document.querySelector("#shell").classList.contains("preview-mode")', "Work: could not return from Client Preview");

    throwBrowserErrors(session);
  } finally {
    session.close();
  }
}

async function runMobileWorkSmoke() {
  const session = await createSession({ mobile: true });
  try {
    await waitForApp(session, baseUrl);
    await assertMobileLayout(session, "Work");
    await saveScreenshot(session, "/tmp/vertical-slice-mobile-work.png");
    await smokeViewerTouch(session);

    await evaluate(session, 'document.querySelector("#previewModeBtn").click()');
    await delay(220);
    await assertEval(
      session,
      'document.querySelector("#shell").classList.contains("preview-mode")',
      "Mobile Owner Preview: Preview as Client did not activate",
    );
    await assertEval(
      session,
      'getComputedStyle(document.querySelector("#exitPreviewBtn")).display !== "none"',
      "Mobile Owner Preview: return-to-Work control is missing",
    );
    await assertMobileLayout(session, "Owner Preview");
    await saveScreenshot(session, "/tmp/vertical-slice-mobile-owner-preview.png");

    const ownerPreviewTopbarHeight = await evaluate(
      session,
      'document.querySelector(".topbar").getBoundingClientRect().height',
    );
    if (ownerPreviewTopbarHeight > 76) {
      throw new Error(
        "Mobile Owner Preview: header is too tall (" + ownerPreviewTopbarHeight + "px)",
      );
    }

    throwBrowserErrors(session);
  } finally {
    session.close();
  }
}

async function runMobileClientSmoke() {
  const session = await createSession({ mobile: true });
  try {
    await waitForApp(session, baseUrl + "/?preview=1");
    await assertEval(session, 'document.querySelector("#shell").classList.contains("preview-mode")', "Mobile Client: preview mode is not active");
    await assertEval(session, 'getComputedStyle(document.querySelector(".panel.left")).display === "none"', "Mobile Client: authoring panel is visible");
    await assertMobileLayout(session, "Client");
    await saveScreenshot(session, "/tmp/vertical-slice-mobile-client.png");
    await smokeViewerTouch(session);
    throwBrowserErrors(session);
  } finally {
    session.close();
  }
}

async function runDirectClientSmoke() {
  const session = await createSession();
  try {
    await waitForApp(session, baseUrl + "/?preview=1");

    await assertEval(session, 'document.querySelector("#shell").classList.contains("preview-mode")', "Client: preview mode is not active");
    await assertEval(session, 'getComputedStyle(document.querySelector(".panel.left")).display === "none"', "Client: authoring panel is visible");
    await assertEval(session, 'getComputedStyle(document.querySelector(".mode-switch")).display === "none"', "Client: Work/Preview mode switch is visible");
    await assertEval(session, 'getComputedStyle(document.querySelector("#exitPreviewBtn")).display === "none"', "Client: owner-only return control is visible");
    await assertEval(session, 'document.querySelector("#lineTotalText").textContent.includes("ТЕСТОВА ЦЕНА")', "Client: prototype price is not clearly marked as test price");

    const originalWidth = await evaluate(session, 'document.querySelector("#widthInput").value');
    await evaluate(session, '(() => { const input = document.querySelector("#widthInput"); input.value = "99"; input.dispatchEvent(new Event("change", { bubbles: true })); })()');
    const widthAfterAttempt = await evaluate(session, 'document.querySelector("#widthInput").value');
    if (widthAfterAttempt !== originalWidth) {
      throw new Error("Client: hidden dimension control mutated project state");
    }

    const originalCheckbox = await evaluate(session, 'document.querySelector("#wallTargets input").checked');
    await evaluate(session, '(() => { const input = document.querySelector("#wallTargets input"); input.checked = !input.checked; input.dispatchEvent(new Event("change", { bubbles: true })); })()');
    const checkboxAfterAttempt = await evaluate(session, 'document.querySelector("#wallTargets input").checked');
    if (checkboxAfterAttempt !== originalCheckbox) {
      throw new Error("Client: hidden wall-target control mutated service scope");
    }

    await evaluate(session, 'document.querySelector("#workModeBtn").click()');
    await assertEval(session, 'document.querySelector("#shell").classList.contains("preview-mode")', "Client: direct preview escaped into Work mode");

    await smokeViewerInput(session);
    throwBrowserErrors(session);
  } finally {
    session.close();
  }
}

await runWorkSmoke();
await runDirectClientSmoke();
await runMobileWorkSmoke();
await runMobileClientSmoke();
console.log("Browser smoke passed: desktop Work + desktop Client + mobile Work + mobile Owner Preview + mobile Client");
