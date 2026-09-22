const baseUrl = process.argv[2] ?? "http://127.0.0.1:4173";
const debugBase = process.argv[3] ?? "http://127.0.0.1:9222";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createSession() {
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

    await smokeViewerInput(session);

    await evaluate(session, 'document.querySelector("#autoCutawayBtn").click()');
    await assertEval(session, '!document.querySelector("#autoCutawayBtn").classList.contains("active")', "Work: auto cutaway did not turn off");
    await evaluate(session, 'document.querySelector("#autoCutawayBtn").click()');
    await assertEval(session, 'document.querySelector("#autoCutawayBtn").classList.contains("active")', "Work: auto cutaway did not turn back on");

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
console.log("Browser smoke passed: Work + direct Client Preview");
