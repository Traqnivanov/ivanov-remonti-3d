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
      width: 360,
      height: 800,
      deviceScaleFactor: 2,
      mobile: false,
      screenWidth: 360,
      screenHeight: 800,
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

async function waitForLogin(session, url) {
  await session.call("Page.navigate", { url });

  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const ready = await evaluate(
        session,
        'document.readyState === "complete" && Boolean(document.querySelector("#workLoginForm"))',
      );
      if (ready) {
        await delay(180);
        return;
      }
    } catch {
      // Navigation can replace the execution context between polls.
    }
    await delay(100);
  }

  throw new Error("Work login did not become ready: " + url);
}

async function authorizeQaWork(session) {
  await waitForLogin(session, baseUrl);
  await evaluate(
    session,
    'sessionStorage.setItem("ivanov-remonti:qa-authorized", "1")',
  );
  await waitForApp(session, baseUrl);
}

async function assertLoginLayout(session, label) {
  const metrics = await evaluate(
    session,
    `(() => {
      const card = document.querySelector(".work-login-card");
      const form = document.querySelector("#workLoginForm");
      const email = document.querySelector("#workLoginEmail");
      const password = document.querySelector("#workLoginPassword");
      const submit = document.querySelector("#workLoginSubmit");
      if (!card || !form || !email || !password || !submit) return null;
      const cardRect = card.getBoundingClientRect();
      const controls = [email, password, submit].map((el) => {
        const r = el.getBoundingClientRect();
        return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, height: r.height };
      });
      return {
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        cardLeft: cardRect.left,
        cardRight: cardRect.right,
        cardWidth: cardRect.width,
        controls,
        signupText: document.body.textContent.toLowerCase().includes("регистрация"),
      };
    })()`,
  );

  if (!metrics) throw new Error(label + ": login metrics are unavailable");
  if (metrics.scrollWidth > metrics.innerWidth + 1) {
    throw new Error(label + ": login has horizontal overflow");
  }
  if (metrics.cardLeft < -1 || metrics.cardRight > metrics.innerWidth + 1) {
    throw new Error(label + ": login card is clipped");
  }
  if (metrics.signupText) {
    throw new Error(label + ": public registration language leaked into private Work login");
  }
  for (const control of metrics.controls) {
    if (control.left < -1 || control.right > metrics.innerWidth + 1) {
      throw new Error(label + ": login control is clipped");
    }
    if (control.height < 44) {
      throw new Error(label + ": login control is smaller than 44px");
    }
  }
}

async function assertEval(session, expression, message) {
  const ok = await evaluate(session, expression);
  if (!ok) throw new Error(message);
}

async function waitForNextPaint(session) {
  await evaluate(
    session,
    'new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))',
  );
}

async function capturePage(session) {
  const result = await session.call("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
  });
  return result.data;
}

async function captureElement(session, selector) {
  const rect = await evaluate(
    session,
    `(() => {
      const element = document.querySelector(${JSON.stringify(selector)});
      if (!element) return null;
      const r = element.getBoundingClientRect();
      return {
        x: r.left + window.scrollX,
        y: r.top + window.scrollY,
        width: r.width,
        height: r.height,
      };
    })()`,
  );
  if (!rect || rect.width < 1 || rect.height < 1) {
    throw new Error("Cannot capture element: " + selector);
  }
  const result = await session.call("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: true,
    clip: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      scale: 1,
    },
  });
  return result.data;
}

async function saveScreenshot(session, path) {
  const data = await capturePage(session);
  await writeFile(path, Buffer.from(data, "base64"));
}

async function openProjectDialogQa(session, { openCreate = false } = {}) {
  await evaluate(
    session,
    `(async () => {
      const ui = await import("/src/work-project-ui.ts");
      const projects = [
        {
          id: "qa-project-2",
          title: "Апартамент Иванови",
          status: "active",
          schemaVersion: 1,
          workVersion: 4,
          updatedAt: "2026-09-24T18:30:00.000Z",
        },
        {
          id: "qa-project-1",
          title: "Къща — дневна",
          status: "draft",
          schemaVersion: 1,
          workVersion: 2,
          updatedAt: "2026-09-24T17:15:00.000Z",
        },
      ];
      const repository = {
        create: async () => { throw new Error("QA create must not execute"); },
        list: async () => projects,
        open: async () => { throw new Error("QA open must not execute"); },
        save: async () => { throw new Error("QA save must not execute"); },
      };
      await ui.openProjectsDialog({
        mount: document.querySelector("#app"),
        repository,
        currentSession: null,
        initialProjects: projects,
        requireSelection: false,
        onProjectReady: () => {},
      });
    })()`,
  );
  await delay(160);

  await assertEval(
    session,
    'Boolean(document.querySelector("#projectsDialog")?.open)',
    "Projects dialog did not open",
  );

  if (openCreate) {
    await evaluate(session, 'document.querySelector("#newProjectButton").click()');
    await delay(80);
    await assertEval(
      session,
      '!document.querySelector("#newProjectForm").hidden',
      "New Project form did not open",
    );
  }
}

async function assertProjectDialogLayout(session, label) {
  const metrics = await evaluate(
    session,
    `(() => {
      const dialog = document.querySelector("#projectsDialog");
      const card = dialog?.querySelector(".projects-dialog-card");
      if (!dialog || !card) return null;
      const d = dialog.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      const controls = [...dialog.querySelectorAll("button, input")]
        .filter((el) => {
          const style = getComputedStyle(el);
          return style.display !== "none" && style.visibility !== "hidden";
        })
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { left: r.left, right: r.right, height: r.height };
        });
      return {
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        dialogLeft: d.left,
        dialogRight: d.right,
        dialogWidth: d.width,
        cardLeft: c.left,
        cardRight: c.right,
        controls,
      };
    })()`,
  );

  if (!metrics) throw new Error(label + ": dialog metrics unavailable");
  if (metrics.scrollWidth > metrics.innerWidth + 1) {
    throw new Error(label + ": dialog causes horizontal overflow");
  }
  if (metrics.dialogLeft < -1 || metrics.dialogRight > metrics.innerWidth + 1) {
    throw new Error(label + ": dialog is clipped by viewport");
  }
  if (metrics.cardLeft < metrics.dialogLeft - 1 || metrics.cardRight > metrics.dialogRight + 1) {
    throw new Error(label + ": dialog card escapes dialog bounds");
  }
  for (const control of metrics.controls) {
    if (control.left < -1 || control.right > metrics.innerWidth + 1) {
      throw new Error(label + ": visible dialog control is clipped");
    }
    if (metrics.innerWidth <= 360 && control.height < 44) {
      throw new Error(label + ": mobile dialog control is smaller than 44px");
    }
  }
}

async function renderProjectBarStateQa(session, saveState) {
  await evaluate(
    session,
    `(async () => {
      const ui = await import("/src/work-project-ui.ts");
      const domain = await import("/src/domain.ts");
      const saveState = ${JSON.stringify(saveState)};
      const project = domain.createDefaultProject("qa-p25c-project");
      const base = {
        projectId: project.projectId,
        title: "QA прототип",
        project,
        workVersion: 2,
        updatedAt: "2026-09-24T19:30:00.000Z",
        editRevision: saveState === "clean" ? 0 : 1,
        savedEditRevision: 0,
        savingEditRevision: saveState === "saving" ? 1 : null,
        lastError: saveState === "conflict" ? "Project changed on the server." : null,
        saveState,
      };
      ui.renderProjectBar(document.querySelector("#app"), base, {
        persistenceEnabled: true,
        canUndo: saveState === "dirty",
        canRedo: false,
        onProjects: () => {},
        onUndo: () => {},
        onRedo: () => {},
        onSave: () => {},
        onReloadLatest: () => {},
      });
    })()`,
  );
  await delay(80);
}

async function openDiscardDialogQa(session) {
  await evaluate(
    session,
    `(async () => {
      const ui = await import("/src/work-project-ui.ts");
      window.__p25cDiscardResult = "pending";
      ui.confirmDiscardUnsavedChanges(document.querySelector("#app"))
        .then((result) => { window.__p25cDiscardResult = result; });
    })()`,
  );
  await delay(120);

  await assertEval(
    session,
    'Boolean(document.querySelector("#discardChangesDialog")?.open)',
    "Discard changes dialog did not open",
  );
}

async function assertDiscardDialogLayout(session, label) {
  const metrics = await evaluate(
    session,
    `(() => {
      const dialog = document.querySelector("#discardChangesDialog");
      if (!dialog) return null;
      const r = dialog.getBoundingClientRect();
      const controls = [...dialog.querySelectorAll("button")]
        .filter((el) => {
          const style = getComputedStyle(el);
          return style.display !== "none" && style.visibility !== "hidden";
        })
        .map((el) => {
          const b = el.getBoundingClientRect();
          return { left: b.left, right: b.right, height: b.height };
        });
      return {
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        left: r.left,
        right: r.right,
        controls,
      };
    })()`,
  );

  if (!metrics) throw new Error(label + ": discard dialog metrics unavailable");
  if (metrics.scrollWidth > metrics.innerWidth + 1) {
    throw new Error(label + ": discard dialog causes horizontal overflow");
  }
  if (metrics.left < -1 || metrics.right > metrics.innerWidth + 1) {
    throw new Error(label + ": discard dialog is clipped");
  }
  for (const control of metrics.controls) {
    if (control.left < -1 || control.right > metrics.innerWidth + 1) {
      throw new Error(label + ": discard action is clipped");
    }
    if (metrics.innerWidth <= 360 && control.height < 44) {
      throw new Error(label + ": discard mobile action is smaller than 44px");
    }
  }
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
      const toolbarButtons = [...toolbar.querySelectorAll("button")].map((button) => {
        const r = button.getBoundingClientRect();
        return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
      });
      const note = document.querySelector(".viewer-note");
      const noteRect = note?.getBoundingClientRect();
      const topbar = document.querySelector(".topbar");
      const topbarRect = topbar?.getBoundingClientRect();
      const visibleButtons = [...document.querySelectorAll("button")]
        .filter((button) => {
          const style = getComputedStyle(button);
          return style.display !== "none" && style.visibility !== "hidden";
        })
        .map((button) => {
          const r = button.getBoundingClientRect();
          return { left: r.left, right: r.right };
        });
      return {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        visualViewportWidth: window.visualViewport?.width ?? window.innerWidth,
        visualViewportHeight: window.visualViewport?.height ?? window.innerHeight,
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
        toolbarButtonMaxRight: Math.max(...toolbarButtons.map((r) => r.right)),
        toolbarButtonMinLeft: Math.min(...toolbarButtons.map((r) => r.left)),
        noteHeight: noteRect?.height ?? 0,
        topbarHeight: topbarRect?.height ?? 0,
        visibleButtonMaxRight: Math.max(...visibleButtons.map((r) => r.right)),
        visibleButtonMinLeft: Math.min(...visibleButtons.map((r) => r.left)),
      };
    })()`,
  );

  if (!metrics) throw new Error(label + ": mobile layout metrics are unavailable");
  console.log(label + " mobile metrics: " + JSON.stringify(metrics));
  if (Math.abs(metrics.innerWidth - 360) > 1) {
    throw new Error(
      label + ": mobile emulation viewport is not 360 CSS px (" + metrics.innerWidth + ")",
    );
  }
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
  if (metrics.toolbarButtonMaxRight > metrics.innerWidth + 1 || metrics.toolbarButtonMinLeft < -1) {
    throw new Error(label + ": one or more mobile viewer controls are clipped");
  }
  if (metrics.visibleButtonMaxRight > metrics.innerWidth + 1 || metrics.visibleButtonMinLeft < -1) {
    throw new Error(label + ": one or more visible mobile buttons are clipped");
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
    `(() => {
      const canvas = document.querySelector("#viewer canvas");
      if (!canvas) return null;
      const r = canvas.getBoundingClientRect();
      const visibleTop = Math.max(0, r.top);
      const visibleBottom = Math.min(window.innerHeight, r.bottom);
      if (visibleBottom - visibleTop < 80) return null;
      return {
        x: r.left + r.width / 2,
        y: visibleTop + (visibleBottom - visibleTop) * 0.55,
      };
    })()`,
  );

  if (!rect) throw new Error("3D canvas has no usable visible interaction area");

  const pointerTarget = await evaluate(
    session,
    `(() => {
      const canvas = document.querySelector("#viewer canvas");
      const r = canvas.getBoundingClientRect();
      const x = ${rect.x};
      const y = ${rect.y};
      const hit = document.elementFromPoint(x, y);
      return {
        x,
        y,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        scrollY: window.scrollY,
        canvasTop: r.top,
        canvasBottom: r.bottom,
        canvasWidth: r.width,
        canvasHeight: r.height,
        hitTag: hit?.tagName ?? null,
        hitId: hit?.id ?? null,
        hitClass: hit?.className ?? null,
      };
    })()`,
  );

  console.log("Desktop viewer pointer target: " + JSON.stringify(pointerTarget));

  if (
    pointerTarget.x < 0 ||
    pointerTarget.x > pointerTarget.innerWidth ||
    pointerTarget.y < 0 ||
    pointerTarget.y > pointerTarget.innerHeight
  ) {
    throw new Error(
      "Work: viewer interaction point is outside the viewport: " +
        JSON.stringify(pointerTarget),
    );
  }

  if (pointerTarget.hitTag !== "CANVAS") {
    throw new Error(
      "Work: viewer interaction point is covered by another element: " +
        JSON.stringify(pointerTarget),
    );
  }

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

  const before = await captureElement(session, "#viewer canvas");
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

  const after = await captureElement(session, "#viewer canvas");
  assertScreenshotChanged(before, after, "Mobile: touch orbit did not change the rendered view");
}

async function clickLinkedWallThroughCanvas(session) {
  await evaluate(session, 'document.querySelector("#showAllBtn").click()');
  await delay(180);
  await evaluate(session, 'document.querySelector("#resetCameraBtn").click()');
  await delay(300);
  await evaluate(
    session,
    'document.querySelector(".viewer-wrap").scrollIntoView({ block: "center", behavior: "instant" })',
  );
  await delay(140);
  await evaluate(session, 'document.querySelector("#showResultBtn").click()');

  const canvas = await evaluate(
    session,
    `(() => {
      const el = document.querySelector("#viewer canvas");
      const r = el.getBoundingClientRect();
      const visibleLeft = Math.max(0, r.left);
      const visibleRight = Math.min(window.innerWidth, r.right);
      const visibleTop = Math.max(0, r.top);
      const visibleBottom = Math.min(window.innerHeight, r.bottom);
      return {
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
        visibleLeft,
        visibleRight,
        visibleTop,
        visibleBottom,
      };
    })()`,
  );

  const visibleWidth = canvas.visibleRight - canvas.visibleLeft;
  const visibleHeight = canvas.visibleBottom - canvas.visibleTop;
  if (visibleWidth < 120 || visibleHeight < 120) {
    throw new Error(
      "Work: 3D canvas has too little visible area for Model → Offer click QA",
    );
  }

  const scanFractions = [0.5, 0.35, 0.65, 0.2, 0.8];
  let attemptedCanvasClicks = 0;

  for (const fy of scanFractions) {
    for (const fx of scanFractions) {
      const x = canvas.visibleLeft + visibleWidth * fx;
      const y = canvas.visibleTop + visibleHeight * fy;

      const hitTarget = await evaluate(
        session,
        `(() => {
          const hit = document.elementFromPoint(${x}, ${y});
          return hit?.tagName ?? null;
        })()`,
      );
      if (hitTarget !== "CANVAS") continue;

      attemptedCanvasClicks += 1;
      await session.call("Input.dispatchMouseEvent", {
        type: "mousePressed", x, y, button: "left", buttons: 1, clickCount: 1,
      });
      await session.call("Input.dispatchMouseEvent", {
        type: "mouseReleased", x, y, button: "left", buttons: 0, clickCount: 1,
      });
      await delay(120);

      const linked = await evaluate(
        session,
        'document.querySelector("#serviceRow").classList.contains("selected") && document.querySelector("#selectionChip").textContent.includes("Избрано:")',
      );
      if (linked) return;

      await evaluate(session, 'document.querySelector("#showResultBtn").click()');
    }
  }

  throw new Error(
    "Work: clicking visible 3D geometry did not resolve a linked Fine Putty wall; canvas clicks attempted=" +
      attemptedCanvasClicks,
  );
}

function throwBrowserErrors(session) {
  if (session.errors.length) {
    throw new Error(session.errors.join(String.fromCharCode(10)));
  }
}

async function runLoginSmoke() {
  const desktop = await createSession();
  try {
    await waitForLogin(desktop, baseUrl);
    await assertLoginLayout(desktop, "Desktop login");
    await assertEval(
      desktop,
      'document.querySelector("#workLoginEmail").getAttribute("autocomplete") === "username"',
      "Desktop login: email autocomplete is not configured",
    );
    await assertEval(
      desktop,
      'document.querySelector("#workLoginPassword").getAttribute("autocomplete") === "current-password"',
      "Desktop login: password autocomplete is not configured",
    );
    await saveScreenshot(desktop, "/tmp/persistence-login-desktop.png");
    throwBrowserErrors(desktop);
  } finally {
    desktop.close();
  }

  const mobile = await createSession({ mobile: true });
  try {
    await waitForLogin(mobile, baseUrl);
    await assertLoginLayout(mobile, "Mobile login");
    await saveScreenshot(mobile, "/tmp/persistence-login-mobile.png");
    throwBrowserErrors(mobile);
  } finally {
    mobile.close();
  }
}

async function runWorkSmoke() {
  const session = await createSession();
  try {
    await authorizeQaWork(session);
    await evaluate(session, 'document.querySelector("#showAllBtn").click()');
    await delay(220);
    await saveScreenshot(session, "/tmp/p32b-openings-desktop-work.png");
    await evaluate(session, 'document.querySelector("#autoCutawayBtn").click()');
    await delay(120);
    await saveScreenshot(session, "/tmp/vertical-slice-work.png");

    await openProjectDialogQa(session, { openCreate: true });
    await assertProjectDialogLayout(session, "Desktop Projects dialog");
    await saveScreenshot(session, "/tmp/p25b-projects-dialog-desktop.png");
    await evaluate(session, 'document.querySelector("#projectsDialog").close(); document.querySelector("#projectsDialog").remove()');
    await delay(80);

    await assertEval(session, 'document.querySelector("#viewer canvas") instanceof HTMLCanvasElement', "Work: true 3D canvas is missing");
    await assertEval(session, 'getComputedStyle(document.querySelector(".panel.left")).display !== "none"', "Work: authoring panel should be visible");
    await assertEval(session, 'Boolean(document.querySelector("#projectBar")) && getComputedStyle(document.querySelector("#projectBar")).display !== "none"', "Work: project bar should be visible");
    await assertEval(session, 'document.querySelector("#projectBarStatus").textContent.includes("Запазено") && document.querySelector("#projectBarStatus").textContent.includes("v1")', "Work: clean project status is missing");
    await assertEval(
      session,
      'document.querySelector("#undoProjectButton").disabled && document.querySelector("#redoProjectButton").disabled',
      "P3.3b: Undo/Redo should start disabled on a clean untouched project",
    );
    await assertEval(session, 'document.querySelector("#quantityText").textContent.includes("m²")', "Work: quantity is not rendered");
    await assertEval(session, 'Boolean(document.querySelector("#serviceRowLaminate")) && document.querySelector("#quantityTextLaminate").textContent.includes("m²")', "Work P3.1c: Laminate offer row is missing");

    const finePuttyFocusedView = await captureElement(session, "#viewer canvas");
    await evaluate(session, 'document.querySelector("#serviceRowLaminate").click()');
    await delay(120);
    await assertEval(session, 'document.querySelector("#serviceRowLaminate").classList.contains("selected") && !document.querySelector("#serviceRow").classList.contains("selected")', "Work P3.1c: Laminate row did not become the focused offer position");
    await assertEval(session, 'document.querySelector("#selectionChip").textContent.includes("Ламинат")', "Work P3.1c: Laminate focus is not visible");
    await assertEval(session, 'document.querySelector("#quantityKpi").textContent.includes("20,16") && document.querySelector("#infoTitle").textContent.includes("Ламинат")', "Work P3.1c: Laminate quantity/Info is not synchronized");
    await waitForNextPaint(session);
    const laminateFocusedView = await captureElement(session, "#viewer canvas");
    assertScreenshotChanged(
      finePuttyFocusedView,
      laminateFocusedView,
      "Work P3.1c: Offer → Model Laminate focus did not change the model presentation",
    );
    await evaluate(session, 'document.querySelector("#serviceRow").click()');
    await assertEval(session, 'document.querySelector("#serviceRow").classList.contains("selected")', "Work P3.1c: Fine Putty focus could not be restored");

    const beforeViewerInput = await captureElement(session, "#viewer canvas");
    await smokeViewerInput(session);
    await waitForNextPaint(session);
    const afterViewerInput = await captureElement(session, "#viewer canvas");
    assertScreenshotChanged(
      beforeViewerInput,
      afterViewerInput,
      "Work: orbit/zoom input did not change the rendered view",
    );
    await assertEval(
      session,
      'document.querySelector("#projectBarStatus").textContent.includes("Запазено")',
      "Work: viewer-only interaction incorrectly dirtied project state",
    );
    await assertEval(
      session,
      'document.querySelector("#undoProjectButton").disabled && document.querySelector("#redoProjectButton").disabled',
      "P3.3b: viewer-only interaction incorrectly entered project history",
    );

    await assertEval(
      session,
      'Boolean(document.querySelector("#addGypsumPuttyButton"))',
      "P3.3c: gypsum putty add control is missing",
    );
    await evaluate(session, 'document.querySelector("#addGypsumPuttyButton").click()');
    await delay(100);
    await assertEval(
      session,
      `Boolean(document.querySelector('[data-service-id="assignment-gypsum-putty-1"]')) && document.querySelector("#infoTitle").textContent.includes("Гипсова шпакловка") && document.querySelector("#quantityKpi").textContent.includes("43,59")`,
      "P3.3c: adding gypsum putty did not create a calculated focused offer line",
    );
    await evaluate(
      session,
      `(() => { const input = document.querySelector('[data-operation-target="room-1.wall-front"]'); input.checked = false; input.dispatchEvent(new Event("change", { bubbles: true })); })()`,
    );
    await delay(80);
    await assertEval(
      session,
      `document.querySelector("#quantityKpi").textContent.includes("34,56") && !document.querySelector('[data-operation-target="room-1.wall-front"]').checked`,
      "P3.3c: exact gypsum putty wall targeting did not update net quantity",
    );
    await evaluate(session, 'document.querySelector("#undoProjectButton").click()');
    await delay(80);
    await assertEval(
      session,
      `document.querySelector("#quantityKpi").textContent.includes("43,59") && document.querySelector('[data-operation-target="room-1.wall-front"]').checked`,
      "P3.3c: Undo did not restore gypsum putty targets and quantity",
    );
    await evaluate(session, 'document.querySelector("#redoProjectButton").click()');
    await delay(80);
    await assertEval(
      session,
      `document.querySelector("#quantityKpi").textContent.includes("34,56") && !document.querySelector('[data-operation-target="room-1.wall-front"]').checked`,
      "P3.3c: Redo did not restore gypsum putty target edit",
    );
    await evaluate(session, 'document.querySelector("#removeGypsumPuttyButton").click()');
    await delay(80);
    await assertEval(
      session,
      `Boolean(document.querySelector("#addGypsumPuttyButton")) && !document.querySelector('[data-service-id="assignment-gypsum-putty-1"]')`,
      "P3.3c: removing gypsum putty did not remove the Work assignment and offer line",
    );
    await evaluate(session, 'document.querySelector("#serviceRow").click()');
    await assertEval(
      session,
      'document.querySelector("#serviceRow").classList.contains("selected")',
      "P3.3c: Fine Putty focus was not restored after the isolated gypsum proof",
    );

    await evaluate(
      session,
      '(() => { const input = document.querySelector("#widthInput"); input.value = "4.3"; input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await assertEval(
      session,
      'document.querySelector("#projectBarStatus").textContent.includes("Има промени") && document.querySelector("#projectBarStatus").textContent.includes("v1")',
      "Work: authoring change did not mark project dirty",
    );
    await assertEval(
      session,
      '!document.querySelector("#undoProjectButton").disabled && document.querySelector("#redoProjectButton").disabled',
      "P3.3b: authoring change did not enable Undo",
    );

    await assertEval(
      session,
      'document.querySelector("#finePuttyRuleId").textContent === "wall-net-area-openings-v1"',
      "P3.2d: Work UI reports the wrong Fine Putty quantity rule",
    );
    await assertEval(
      session,
      `Boolean(document.querySelector('[data-opening-id="room-1.window-1"][data-opening-field="widthM"]')) && Boolean(document.querySelector('[data-opening-id="room-1.door-1"][data-opening-field="offsetM"]'))`,
      "P3.2d: opening Work controls are missing",
    );
    await assertEval(
      session,
      'document.querySelector("#quantityText").textContent.includes("44,11")',
      "P3.2d: Fine Putty net quantity did not follow the 4.3m room-width edit",
    );
    await evaluate(
      session,
      `(() => { const input = document.querySelector('[data-opening-id="room-1.window-1"][data-opening-field="widthM"]'); input.value = "1.3"; input.dispatchEvent(new Event("change", { bubbles: true })); })()`,
    );
    await assertEval(
      session,
      'document.querySelector("#quantityText").textContent.includes("44,00")',
      "P3.2d: window-width edit did not update Fine Putty net quantity to 44,00 m²",
    );
    await assertEval(
      session,
      'document.querySelector("#projectBarStatus").textContent.includes("Има промени")',
      "P3.2d: opening edit did not keep the project dirty",
    );

    await evaluate(session, 'document.querySelector("#undoProjectButton").click()');
    await delay(120);
    await assertEval(
      session,
      `document.querySelector('[data-opening-id="room-1.window-1"][data-opening-field="widthM"]').value === "1.2" && document.querySelector("#quantityText").textContent.includes("44,11")`,
      "P3.3b: Undo did not restore the previous window width and Fine Putty quantity",
    );
    await assertEval(
      session,
      '!document.querySelector("#redoProjectButton").disabled && document.querySelector("#projectBarStatus").textContent.includes("Има промени")',
      "P3.3b: Undo did not expose Redo or preserve the earlier unsaved room-width edit",
    );

    await evaluate(session, 'document.querySelector("#redoProjectButton").click()');
    await delay(120);
    await assertEval(
      session,
      `document.querySelector('[data-opening-id="room-1.window-1"][data-opening-field="widthM"]').value === "1.3" && document.querySelector("#quantityText").textContent.includes("44,00")`,
      "P3.3b: Redo did not restore the window-width edit and recalculated quantity",
    );

    await evaluate(
      session,
      `(() => { const input = document.querySelector('[data-opening-id="room-1.door-1"][data-opening-field="offsetM"]'); input.value = "99"; input.dispatchEvent(new Event("change", { bubbles: true })); })()`,
    );
    await assertEval(
      session,
      'document.querySelector("#openingsStatus").dataset.state === "error" && document.querySelector("#openingsStatus").textContent.length > 0',
      "P3.2d: invalid opening edit was not rejected with a visible error",
    );
    await assertEval(
      session,
      `document.querySelector("#quantityText").textContent.includes("44,00") && document.querySelector('[data-opening-id="room-1.door-1"][data-opening-field="offsetM"]').value !== "99"`,
      "P3.2d: invalid opening edit mutated canonical geometry or quantity",
    );

    await evaluate(
      session,
      'document.querySelector(".openings-section").scrollIntoView({ block: "center", behavior: "instant" })',
    );
    await delay(120);
    await saveScreenshot(session, "/tmp/p32d-opening-controls-desktop.png");

    await evaluate(session, 'document.querySelector("#resetCameraBtn").click()');
    await delay(450);

    await evaluate(session, 'document.querySelector("#autoCutawayBtn").click()');
    await assertEval(session, '!document.querySelector("#autoCutawayBtn").classList.contains("active")', "Work: auto cutaway did not turn off");
    await delay(200);

    const manualBaseline = await captureElement(session, "#viewer canvas");
    await evaluate(session, "document.querySelector('[data-wall=\"room-1.wall-right\"]').click()");
    await delay(200);
    await assertEval(session, "document.querySelector('[data-wall=\"room-1.wall-right\"]').classList.contains('active')", "Work: manual wall hide did not activate");
    const wallHidden = await captureElement(session, "#viewer canvas");
    assertScreenshotChanged(
      manualBaseline,
      wallHidden,
      "Work: hiding a wall did not change the rendered view",
    );
    await evaluate(session, "document.querySelector('[data-wall=\"room-1.wall-right\"]').click()");
    await delay(200);

    const ceilingBaseline = await captureElement(session, "#viewer canvas");
    await evaluate(session, "document.querySelector('[data-wall=\"room-1.ceiling\"]').click()");
    await delay(200);
    await assertEval(session, "document.querySelector('[data-wall=\"room-1.ceiling\"]').classList.contains('active')", "Work: manual ceiling hide did not activate");
    const ceilingHidden = await captureElement(session, "#viewer canvas");
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
    const focusedView = await captureElement(session, "#viewer canvas");
    await evaluate(session, 'document.querySelector("#showResultBtn").click()');
    await assertEval(session, '!document.querySelector("#serviceRow").classList.contains("selected")', "Work: show whole result did not exit service focus");
    await delay(150);
    const wholeResultView = await captureElement(session, "#viewer canvas");
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
    await assertEval(session, 'getComputedStyle(document.querySelector("#projectBar")).display === "none"', "Work preview: project persistence controls leaked into Client mode");
    await assertEval(session, 'getComputedStyle(document.querySelector("#exitPreviewBtn")).display !== "none"', "Work preview: owner return control is missing");
    await assertEval(
      session,
      'document.querySelector("#projectBarStatus").textContent.includes("Има промени")',
      "Work preview: dirty project state was lost while persistence controls were hidden",
    );

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
    await authorizeQaWork(session);
    await assertMobileLayout(session, "Work");
    await assertEval(
      session,
      'Boolean(document.querySelector("#serviceRowLaminate")) && document.querySelector("#serviceRowLaminate").getBoundingClientRect().height >= 44',
      "Mobile Work P3.1c: Laminate row is missing or too small for touch",
    );
    await assertEval(
      session,
      '["#undoProjectButton", "#redoProjectButton"].every((selector) => document.querySelector(selector)?.getBoundingClientRect().height >= 44)',
      "Mobile P3.3b: Undo/Redo controls are below the 44px touch target",
    );
    await assertEval(
      session,
      'document.querySelector("#addGypsumPuttyButton")?.getBoundingClientRect().height >= 44',
      "Mobile P3.3c: gypsum putty add control is missing or too small",
    );
    await evaluate(session, 'document.querySelector("#addGypsumPuttyButton").click()');
    await delay(80);
    await assertEval(
      session,
      'document.querySelector("#removeGypsumPuttyButton")?.getBoundingClientRect().height >= 44 && Array.from(document.querySelectorAll("#operationAuthoring .check-row")).every((el) => el.getBoundingClientRect().height >= 44)',
      "Mobile P3.3c: gypsum putty authoring controls are below the 44px touch target",
    );
    await evaluate(
      session,
      'document.querySelector("#operationAuthoring").scrollIntoView({ block: "center", behavior: "instant" })',
    );
    await delay(100);
    await saveScreenshot(session, "/tmp/p33c-gypsum-authoring-mobile.png");
    await evaluate(session, 'document.querySelector("#removeGypsumPuttyButton").click()');
    await delay(80);
    await assertEval(
      session,
      'document.querySelectorAll(".opening-fields input, .opening-fields select, .opening-add-actions button, .opening-remove").length > 0 && Array.from(document.querySelectorAll(".opening-fields input, .opening-fields select, .opening-add-actions button, .opening-remove")).every((el) => el.getBoundingClientRect().height >= 44)',
      "Mobile P3.2d: opening controls are missing or below the 44px touch target",
    );
    await saveScreenshot(session, "/tmp/vertical-slice-mobile-work.png");
    await evaluate(
      session,
      'document.querySelector(".openings-section").scrollIntoView({ block: "start", behavior: "instant" })',
    );
    await delay(120);
    await saveScreenshot(session, "/tmp/p32d-opening-controls-mobile.png");
    await evaluate(session, 'window.scrollTo({ top: 0, behavior: "instant" })');
    await delay(80);

    await renderProjectBarStateQa(session, "dirty");
    await assertEval(
      session,
      'document.querySelector("#projectBarStatus").textContent.includes("Има промени") && !document.querySelector("#saveProjectButton").disabled',
      "Mobile P2.5c: dirty state is not visible/saveable",
    );
    await saveScreenshot(session, "/tmp/p25c-mobile-dirty.png");

    await renderProjectBarStateQa(session, "conflict");
    await assertEval(
      session,
      'document.querySelector("#projectBarStatus").textContent.includes("Конфликт") && document.querySelector("#saveProjectButton").hidden && !document.querySelector("#reloadProjectButton").hidden',
      "Mobile P2.5c: conflict recovery action is not visible",
    );
    await saveScreenshot(session, "/tmp/p25c-mobile-conflict.png");

    await openDiscardDialogQa(session);
    await assertDiscardDialogLayout(session, "Mobile discard changes");
    await saveScreenshot(session, "/tmp/p25c-mobile-discard.png");
    await evaluate(session, 'document.querySelector("#discardCancelButton").click()');
    await delay(80);
    await assertEval(
      session,
      'window.__p25cDiscardResult === false && !document.querySelector("#discardChangesDialog")',
      "Mobile P2.5c: discard cancel did not preserve the current project",
    );

    await waitForApp(session, baseUrl);
    await assertMobileLayout(session, "Work restored");

    await openProjectDialogQa(session, { openCreate: true });
    await assertProjectDialogLayout(session, "Mobile Projects dialog");
    await saveScreenshot(session, "/tmp/p25b-projects-dialog-mobile.png");
    await evaluate(session, 'document.querySelector("#projectsDialog").close(); document.querySelector("#projectsDialog").remove()');
    await delay(80);

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
    await assertEval(
      session,
      'Boolean(document.querySelector("#serviceRowLaminate")) && document.querySelector("#serviceRowLaminate").getBoundingClientRect().height >= 44',
      "Mobile Client P3.1c: Laminate row is missing or too small for touch",
    );
    await assertMobileLayout(session, "Client");
    await evaluate(session, 'document.querySelector("#showAllBtn").click()');
    await delay(220);
    await saveScreenshot(session, "/tmp/p32b-openings-mobile-client.png");
    await evaluate(session, 'document.querySelector("#autoCutawayBtn").click()');
    await delay(120);
    await saveScreenshot(session, "/tmp/vertical-slice-mobile-client.png");
    await evaluate(session, 'document.querySelector("#serviceRowLaminate").click()');
    await delay(160);
    await saveScreenshot(session, "/tmp/p31d-laminate-mobile-client.png");
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
    await assertEval(session, '!document.querySelector("#projectBar")', "Client: Work project bar is present");
    await assertEval(session, 'getComputedStyle(document.querySelector("#exitPreviewBtn")).display === "none"', "Client: owner-only return control is visible");
    await assertEval(
      session,
      'getComputedStyle(document.querySelector(".openings-section")).display === "none"',
      "Client P3.2d: opening authoring controls leaked into Client mode",
    );
    await assertEval(session, 'document.querySelector("#lineTotalText").textContent.includes("ТЕСТОВА ЦЕНА")', "Client: prototype price is not clearly marked as test price");
    await assertEval(session, 'Boolean(document.querySelector("#serviceRowLaminate"))', "Client P3.1c: Laminate offer row is missing");
    await evaluate(session, 'document.querySelector("#serviceRowLaminate").click()');
    await assertEval(session, 'document.querySelector("#serviceRowLaminate").classList.contains("selected") && document.querySelector("#infoTitle").textContent.includes("Ламинат")', "Client P3.1c: Laminate interaction is not available in read-only Client view");
    await delay(160);
    await saveScreenshot(session, "/tmp/p31d-laminate-desktop.png");
    await evaluate(session, 'document.querySelector("#serviceRow").click()');

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

await runLoginSmoke();
await runWorkSmoke();
await runDirectClientSmoke();
await runMobileWorkSmoke();
await runMobileClientSmoke();
console.log("Browser smoke passed: private login + desktop Work + desktop Client + mobile Work + mobile Owner Preview + mobile Client");
