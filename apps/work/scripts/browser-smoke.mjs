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

async function clickViewerAt(session, xRatio, yRatio) {
  const point = await evaluate(
    session,
    `(() => {
      const canvas = document.querySelector("#viewer canvas");
      if (!canvas) return null;
      const r = canvas.getBoundingClientRect();
      return {
        x: r.left + r.width * ${xRatio},
        y: r.top + r.height * ${yRatio},
      };
    })()`,
  );

  if (!point) throw new Error("Viewer canvas is unavailable for click QA");

  await session.call("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: point.x,
    y: point.y,
    button: "left",
    clickCount: 1,
  });
  await session.call("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: point.x,
    y: point.y,
    button: "left",
    clickCount: 1,
  });
  await delay(90);
}

async function clickViewerUntil(session, predicateExpression, points, label) {
  for (const [xRatio, yRatio] of points) {
    await clickViewerAt(session, xRatio, yRatio);
    if (await evaluate(session, predicateExpression)) {
      return { xRatio, yRatio };
    }
  }

  throw new Error(label);
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

async function openAndSwitchMobileProjectQa(session) {
  await evaluate(
    session,
    `(async () => {
      const ui = await import("/src/work-project-ui.ts");
      const main = await import("/src/main.ts");
      const domain = await import("/src/domain.ts");
      const projectId = "qa-mobile-open-project";
      const project = domain.createOpeningProofProject(projectId);
      const listItem = {
        id: projectId,
        title: "QA Mobile Open",
        status: "draft",
        schemaVersion: 1,
        workVersion: 3,
        updatedAt: "2026-09-28T03:30:00.000Z",
      };
      const opened = {
        ...listItem,
        ownerUserId: "qa-owner",
        createdAt: "2026-09-28T03:00:00.000Z",
        project,
      };
      const repository = {
        create: async () => opened,
        list: async () => [listItem],
        open: async () => {
          await new Promise((resolve) => setTimeout(resolve, 40));
          return opened;
        },
        save: async () => ({
          projectId,
          workVersion: 4,
          updatedAt: "2026-09-28T03:31:00.000Z",
        }),
      };

      window.__qaMobileProjectOpened = false;
      await ui.openProjectsDialog({
        mount: document.querySelector("#app"),
        repository,
        currentSession: null,
        initialProjects: [listItem],
        requireSelection: true,
        onProjectReady: (nextSession) => {
          main.startSmartOfferApp({
            appEntry: "work",
            project: nextSession.project,
            session: nextSession,
            repository,
          });
          window.__qaMobileProjectOpened = true;
        },
      });
    })()`,
  );
  await delay(120);
  await assertEval(
    session,
    'Boolean(document.querySelector("#projectsDialog")?.open)',
    "Mobile project-open QA: chooser did not open",
  );
  await evaluate(
    session,
    'document.querySelector("#projectsList button")?.click()',
  );

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const ready = await evaluate(
      session,
      'window.__qaMobileProjectOpened === true && !document.querySelector("#projectsDialog") && Boolean(document.querySelector("#viewer canvas"))',
    );
    if (ready) break;
    await delay(100);
  }

  await assertEval(
    session,
    'window.__qaMobileProjectOpened === true && !document.querySelector("#projectsDialog") && document.querySelector("#projectBarTitle")?.textContent === "QA Mobile Open" && Boolean(document.querySelector("#viewer canvas"))',
    "Mobile project-open QA: opening a project did not hand off to a responsive Work app",
  );
  await assertMobileLayout(session, "Mobile project opened");
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
  if (metrics.toolbarHeight > metrics.viewerHeight * 0.27) {
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

async function startD15AcceptanceProject(session) {
  await evaluate(
    session,
    `(async () => {
      const main = await import("/src/main.ts");
      const domain = await import("/src/domain.ts");
      const sessionModule = await import("/src/project-session.ts");

      const primary = domain.createOpeningProofProject("qa-d15-primary");
      const secondary = domain.createDefaultProject("qa-d15-secondary");
      secondary.serviceAssignments = secondary.serviceAssignments.map(
        (assignment) => ({ ...assignment, included: false }),
      );

      const records = new Map([
        [
          primary.projectId,
          {
            id: primary.projectId,
            title: "D15 Реален поток",
            status: "active",
            schemaVersion: 1,
            workVersion: 1,
            updatedAt: "2026-10-08T18:00:00.000Z",
            ownerUserId: "qa-owner",
            createdAt: "2026-10-08T17:00:00.000Z",
            project: structuredClone(primary),
          },
        ],
        [
          secondary.projectId,
          {
            id: secondary.projectId,
            title: "D15 Втори проект",
            status: "draft",
            schemaVersion: 1,
            workVersion: 1,
            updatedAt: "2026-10-08T17:30:00.000Z",
            ownerUserId: "qa-owner",
            createdAt: "2026-10-08T17:00:00.000Z",
            project: structuredClone(secondary),
          },
        ],
      ]);

      const cloneOpened = (record) => ({
        ...record,
        project: structuredClone(record.project),
      });

      const repository = {
        create: async () => {
          throw new Error("D1.5 create is outside acceptance scope");
        },
        list: async () =>
          [...records.values()].map((record) => ({
            id: record.id,
            title: record.title,
            status: record.status,
            schemaVersion: record.schemaVersion,
            workVersion: record.workVersion,
            updatedAt: record.updatedAt,
          })),
        open: async (id) => {
          const record = records.get(id);
          if (!record) throw new Error("D1.5 project not found: " + id);
          window.__d15OpenIds.push(id);
          return cloneOpened(record);
        },
        save: async (input) => {
          const record = records.get(input.projectId);
          if (!record) throw new Error("D1.5 save project not found");
          if (record.workVersion !== input.expectedWorkVersion) {
            throw new Error("D1.5 unexpected work version");
          }
          record.project = structuredClone(input.project);
          record.workVersion += 1;
          record.updatedAt = "2026-10-08T18:30:00.000Z";
          window.__d15SaveCount += 1;
          window.__d15LastSavedProject = structuredClone(record.project);
          return {
            projectId: record.id,
            workVersion: record.workVersion,
            updatedAt: record.updatedAt,
          };
        },
      };

      window.__d15SaveCount = 0;
      window.__d15OpenIds = [];
      window.__d15Records = records;
      window.__d15Repository = repository;
      window.__d15LastSavedProject = null;

      const opened = cloneOpened(records.get(primary.projectId));
      const projectSession = sessionModule.createProjectSession(opened);
      main.startSmartOfferApp({
        appEntry: "work",
        project: opened.project,
        session: projectSession,
        repository,
      });
    })()`,
  );
  await delay(180);
  await assertEval(
    session,
    'document.querySelector("#projectBarTitle")?.textContent === "D15 Реален поток" && document.querySelector("#projectBarStatus")?.textContent.includes("Запазено")',
    "D1.5: acceptance project did not start cleanly",
  );
}

async function setD15Price(session, assignmentId, rawValue) {
  await evaluate(
    session,
    `(() => {
      const row = document.querySelector('[data-service-id="${assignmentId}"]');
      if (!row) throw new Error("Missing D1.5 offer row: ${assignmentId}");
      row.click();
      const input = document.querySelector("#unitPriceInput");
      input.value = "${rawValue}";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    })()`,
  );
  await delay(90);
}

async function runD15DesktopAcceptanceSmoke() {
  const session = await createSession();
  try {
    await session.call("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
      screenWidth: 1440,
      screenHeight: 900,
    });

    await authorizeQaWork(session);
    await startD15AcceptanceProject(session);

    await assertEval(
      session,
      'document.querySelectorAll("#offerRows .offer-row").length === 2 && document.querySelector("#quantityText")?.textContent.includes("43,59") && document.querySelector("[data-service-id=assignment-fine-putty-ceiling-1]")?.textContent.includes("20,16")',
      "D1.5: opening-aware wall quantity or separate ceiling line is missing at start",
    );

    await evaluate(
      session,
      '(() => { const input = document.querySelector("[data-service-include=assignment-paint-1]"); input.checked = true; input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(100);

    await assertEval(
      session,
      'document.querySelectorAll("#offerRows .offer-row").length === 4 && Boolean(document.querySelector("[data-service-id=assignment-paint-1]")) && Boolean(document.querySelector("[data-service-id=assignment-paint-ceiling-1]"))',
      "D1.5: Paint did not add independent wall + ceiling offer lines",
    );

    await setD15Price(session, "assignment-fine-putty-1", "6.5");
    await setD15Price(session, "assignment-fine-putty-ceiling-1", "7.5");
    await setD15Price(session, "assignment-paint-1", "4.25");
    await setD15Price(session, "assignment-paint-ceiling-1", "5.5");

    await assertEval(
      session,
      'document.querySelector("#d13OfferTotalKpi")?.textContent.includes("730,67") && document.querySelector("#d13OfferTotalStatus")?.textContent.includes("ценово попълнена") && document.querySelector("#offerTotalStatus")?.textContent.includes("имат цена")',
      "D1.5: complete multi-service EUR total is incorrect",
    );

    await evaluate(
      session,
      'document.querySelector("[data-service-id=assignment-fine-putty-1]").click()',
    );
    await delay(50);
    await assertEval(
      session,
      'document.querySelector("#unitPriceInput")?.value === "6,50" && document.querySelector("#quantityKpi")?.textContent.includes("43,59")',
      "D1.5: Fine Putty wall price/quantity are not independent",
    );
    await evaluate(
      session,
      'document.querySelector("[data-service-id=assignment-fine-putty-ceiling-1]").click()',
    );
    await delay(50);
    await assertEval(
      session,
      'document.querySelector("#unitPriceInput")?.value === "7,50" && document.querySelector("#quantityKpi")?.textContent.includes("20,16")',
      "D1.5: Fine Putty ceiling price/quantity are not independent",
    );
    await evaluate(
      session,
      'document.querySelector("[data-service-id=assignment-paint-1]").click()',
    );
    await delay(50);
    await assertEval(
      session,
      'document.querySelector("#unitPriceInput")?.value === "4,25" && document.querySelector("#quantityKpi")?.textContent.includes("43,59")',
      "D1.5: Paint wall price/quantity are not independent",
    );
    await evaluate(
      session,
      'document.querySelector("[data-service-id=assignment-paint-ceiling-1]").click()',
    );
    await delay(50);
    await assertEval(
      session,
      'document.querySelector("#unitPriceInput")?.value === "5,50" && document.querySelector("#quantityKpi")?.textContent.includes("20,16")',
      "D1.5: Paint ceiling price/quantity are not independent",
    );

    await assertEval(
      session,
      'document.querySelector("#projectBarStatus")?.textContent.includes("Има промени") && !document.querySelector("#saveProjectButton").disabled',
      "D1.5: completed offer did not remain saveable",
    );

    await evaluate(session, 'document.querySelector("#saveProjectButton").click()');
    for (let attempt = 0; attempt < 25; attempt += 1) {
      if (
        await evaluate(
          session,
          'window.__d15SaveCount === 1 && document.querySelector("#projectBarStatus")?.textContent.includes("Запазено · v2")',
        )
      ) break;
      await delay(80);
    }
    await assertEval(
      session,
      'window.__d15SaveCount === 1 && document.querySelector("#projectBarStatus")?.textContent.includes("Запазено · v2") && window.__d15LastSavedProject.serviceAssignments.find((item) => item.id === "assignment-fine-putty-1")?.unitPriceEur === 6.5 && window.__d15LastSavedProject.serviceAssignments.find((item) => item.id === "assignment-fine-putty-ceiling-1")?.unitPriceEur === 7.5 && window.__d15LastSavedProject.serviceAssignments.find((item) => item.id === "assignment-paint-1")?.unitPriceEur === 4.25 && window.__d15LastSavedProject.serviceAssignments.find((item) => item.id === "assignment-paint-ceiling-1")?.unitPriceEur === 5.5',
      "D1.5: Save did not persist independent service/scope prices",
    );

    await evaluate(session, 'document.querySelector("#projectsButton").click()');
    await delay(100);
    await evaluate(
      session,
      'Array.from(document.querySelectorAll("#projectsList .project-list-row")).find((row) => row.textContent.includes("D15 Втори проект"))?.querySelector("button")?.click()',
    );
    for (let attempt = 0; attempt < 25; attempt += 1) {
      if (
        await evaluate(
          session,
          'document.querySelector("#projectBarTitle")?.textContent === "D15 Втори проект"',
        )
      ) break;
      await delay(80);
    }
    await assertEval(
      session,
      'document.querySelector("#projectBarTitle")?.textContent === "D15 Втори проект" && document.querySelectorAll("#offerRows .offer-row").length === 0',
      "D1.5: switching away from the saved project failed",
    );

    await evaluate(session, 'document.querySelector("#projectsButton").click()');
    await delay(100);
    await evaluate(
      session,
      'Array.from(document.querySelectorAll("#projectsList .project-list-row")).find((row) => row.textContent.includes("D15 Реален поток"))?.querySelector("button")?.click()',
    );
    for (let attempt = 0; attempt < 25; attempt += 1) {
      if (
        await evaluate(
          session,
          'document.querySelector("#projectBarTitle")?.textContent === "D15 Реален поток" && document.querySelector("#projectBarStatus")?.textContent.includes("Запазено · v2")',
        )
      ) break;
      await delay(80);
    }

    await assertEval(
      session,
      'document.querySelector("#projectBarTitle")?.textContent === "D15 Реален поток" && document.querySelector("#projectBarStatus")?.textContent.includes("Запазено · v2") && document.querySelectorAll("#offerRows .offer-row").length === 4 && document.querySelector("#d13OfferTotalKpi")?.textContent.includes("730,67") && window.__d15OpenIds.includes("qa-d15-primary")',
      "D1.5: reopening did not restore the complete saved offer",
    );

    await evaluate(session, 'document.querySelector("[data-d13-tab=scope]").click()');
    await delay(60);
    await evaluate(
      session,
      'document.querySelector("#operationSummary-paint")?.click(); document.querySelector("#d14FullScopeDetails") && (document.querySelector("#d14FullScopeDetails").open = true); document.querySelector(".opening-card-summary")?.click(); document.querySelector("#m2SchemeDetails > summary")?.click()',
    );
    await delay(80);

    const overflow = await evaluate(
      session,
      `(() => {
        const left = document.querySelector(".panel.left");
        const right = document.querySelector(".panel.right");
        const viewer = document.querySelector(".viewer-wrap");
        const before = viewer.getBoundingClientRect();
        const result = {
          leftScrollable: left.scrollHeight > left.clientHeight,
          rightScrollable: right.scrollHeight > right.clientHeight,
          leftScrollbarColor: getComputedStyle(left).scrollbarColor,
          rightScrollbarColor: getComputedStyle(right).scrollbarColor,
          viewerTop: Math.round(before.top),
          viewerBottom: Math.round(before.bottom),
        };
        left.scrollTop = left.scrollHeight;
        right.scrollTop = right.scrollHeight;
        const after = viewer.getBoundingClientRect();
        result.viewerStable =
          Math.round(after.top) === result.viewerTop &&
          Math.round(after.bottom) === result.viewerBottom &&
          window.scrollY === 0;
        return result;
      })()`,
    );

    if (
      !overflow.leftScrollable ||
      !overflow.rightScrollable ||
      !overflow.viewerStable ||
      overflow.leftScrollbarColor === "auto" ||
      overflow.rightScrollbarColor === "auto"
    ) {
      throw new Error(
        "D1.5: desktop panel overflow/scroll acceptance failed: " +
          JSON.stringify(overflow),
      );
    }

    await evaluate(
      session,
      'document.querySelector(".panel.left").scrollTop = 0; document.querySelector(".panel.right").scrollTop = 0',
    );
    await delay(60);
    await saveScreenshot(session, "/tmp/d15-desktop-acceptance.png");

    await evaluate(session, 'document.querySelector("#previewModeBtn").click()');
    await delay(140);
    await assertEval(
      session,
      'document.querySelector("#shell").classList.contains("preview-mode") && getComputedStyle(document.querySelector(".panel.left")).display === "none" && getComputedStyle(document.querySelector("#unitPriceWorkControl")).display === "none" && document.querySelector("#offerTotalKpi")?.textContent.includes("730,67") && document.querySelector("#offerTotalStatus")?.textContent.includes("имат цена") && document.querySelectorAll("#offerRows .offer-row").length === 4',
      "D1.5: Owner Client Preview did not preserve the saved complete offer read-only",
    );
    await assertEval(
      session,
      'getComputedStyle(document.querySelector(".panel.right")).scrollbarColor !== "auto" && getComputedStyle(document.documentElement).scrollbarColor !== "auto"',
      "D1.5: Client Preview kept a default bright panel/page scrollbar",
    );
    await saveScreenshot(session, "/tmp/d15-client-preview.png");

    await evaluate(session, 'document.querySelector("#exitPreviewBtn").click()');
    await delay(100);
    await assertEval(
      session,
      'document.querySelector("#projectBarTitle")?.textContent === "D15 Реален поток" && document.querySelector("#projectBarStatus")?.textContent.includes("Запазено · v2") && document.querySelector("#d13OfferTotalKpi")?.textContent.includes("730,67")',
      "D1.5: returning from Client Preview did not restore saved Work state",
    );

    throwBrowserErrors(session);
  } finally {
    session.close();
  }
}

async function runWorkSmoke() {
  const session = await createSession();
  try {
    await session.call("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
      screenWidth: 1440,
      screenHeight: 900,
    });
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

    const d11Workbench = await evaluate(
      session,
      `(() => {
        const left = document.querySelector(".panel.left");
        const right = document.querySelector(".panel.right");
        const viewer = document.querySelector(".viewer-wrap");
        const services = document.querySelector("#serviceScopeControls");
        const workspace = document.querySelector(".workspace");
        return {
          pageScrollY: window.scrollY,
          bodyHeight: document.body.scrollHeight,
          documentHeight: document.documentElement.scrollHeight,
          viewportHeight: window.innerHeight,
          leftOverflowY: getComputedStyle(left).overflowY,
          rightOverflowY: getComputedStyle(right).overflowY,
          rightHasServices: right.contains(services),
          leftHasServices: left.contains(services),
          viewerTop: Math.round(viewer.getBoundingClientRect().top),
          viewerBottom: Math.round(viewer.getBoundingClientRect().bottom),
          workspaceTop: Math.round(workspace.getBoundingClientRect().top),
          workspaceBottom: Math.round(workspace.getBoundingClientRect().bottom),
        };
      })()`,
    );
    if (
      d11Workbench.pageScrollY !== 0 ||
      d11Workbench.bodyHeight > d11Workbench.viewportHeight + 2 ||
      d11Workbench.documentHeight > d11Workbench.viewportHeight + 2 ||
      !["auto", "scroll"].includes(d11Workbench.leftOverflowY) ||
      !["auto", "scroll"].includes(d11Workbench.rightOverflowY) ||
      !d11Workbench.rightHasServices ||
      d11Workbench.leftHasServices ||
      Math.abs(d11Workbench.viewerTop - d11Workbench.workspaceTop) > 1 ||
      Math.abs(d11Workbench.viewerBottom - d11Workbench.workspaceBottom) > 1
    ) {
      throw new Error(
        "D1.1: desktop Work is not a fixed three-zone workbench: " +
          JSON.stringify(d11Workbench),
      );
    }

    await evaluate(
      session,
      `(() => {
        const left = document.querySelector(".panel.left");
        const right = document.querySelector(".panel.right");
        left.scrollTop = left.scrollHeight;
        right.scrollTop = right.scrollHeight;
      })()`,
    );
    await delay(80);
    const d11AfterPanelScroll = await evaluate(
      session,
      `(() => {
        const viewer = document.querySelector(".viewer-wrap").getBoundingClientRect();
        return {
          pageScrollY: window.scrollY,
          viewerTop: Math.round(viewer.top),
          viewerBottom: Math.round(viewer.bottom),
        };
      })()`,
    );
    if (
      d11AfterPanelScroll.pageScrollY !== 0 ||
      d11AfterPanelScroll.viewerTop !== d11Workbench.viewerTop ||
      d11AfterPanelScroll.viewerBottom !== d11Workbench.viewerBottom
    ) {
      throw new Error(
        "D1.1: side-panel scrolling moved the page or 3D viewport: " +
          JSON.stringify(d11AfterPanelScroll),
      );
    }
    await evaluate(
      session,
      'document.querySelector(".panel.left").scrollTop = 0; document.querySelector(".panel.right").scrollTop = 0',
    );
    await delay(80);
    await saveScreenshot(session, "/tmp/d11-desktop-workbench.png");

    await assertEval(
      session,
      '!document.querySelector("#m2SchemeDetails").open && document.querySelector("#m2SchemaCompactSummary").textContent.includes("Стени") && document.querySelector("#m2SchemaCompactSummary").textContent.includes("Таван")',
      "D1.2: M² scheme is not secondary/collapsed with a useful compact summary on desktop",
    );
    await assertEval(
      session,
      'document.querySelectorAll(".opening-card").length >= 2 && Array.from(document.querySelectorAll(".opening-card")).every((card) => !card.open) && Array.from(document.querySelectorAll(".opening-card-summary")).every((summary) => summary.getBoundingClientRect().height >= 44)',
      "D1.2: desktop openings are not compact collapsed rows",
    );
    const d12CollapsedMetrics = await evaluate(
      session,
      `(() => {
        const left = document.querySelector(".panel.left");
        const room = document.querySelector(".room-section");
        const openings = document.querySelector(".openings-section");
        const scheme = document.querySelector("#m2SchemeDetails");
        const panelRect = left.getBoundingClientRect();
        const schemeRect = scheme.getBoundingClientRect();
        return {
          panelHeight: Math.round(panelRect.height),
          contentBottom: Math.round(schemeRect.bottom - panelRect.top + left.scrollTop),
          scrollHeight: left.scrollHeight,
          schemeHeight: Math.round(schemeRect.height),
          roomHeight: Math.round(room.getBoundingClientRect().height),
          openingsHeight: Math.round(openings.getBoundingClientRect().height),
        };
      })()`,
    );
    if (d12CollapsedMetrics.schemeHeight > 60) {
      throw new Error(
        "D1.2: collapsed M² scheme still consumes too much height: " +
          JSON.stringify(d12CollapsedMetrics),
      );
    }

    await evaluate(
      session,
      'document.querySelector(".opening-card-summary").click()',
    );
    await delay(80);
    await assertEval(
      session,
      'document.querySelector(".opening-card").open && document.querySelector(".opening-card .opening-fields")?.getBoundingClientRect().height > 0 && Array.from(document.querySelectorAll(".opening-card")).filter((card) => card.open).length === 1',
      "D1.2: opening summary did not expand exactly one editor",
    );
    await evaluate(
      session,
      'document.querySelector("#m2SchemeDetails > summary").click()',
    );
    await delay(80);
    await assertEval(
      session,
      'document.querySelector("#m2SchemeDetails").open && document.querySelector("#m2Schema")?.getBoundingClientRect().height > 0',
      "D1.2: M² scheme cannot be expanded on demand",
    );
    await evaluate(
      session,
      'document.querySelector("#m2SchemeDetails > summary").click(); document.querySelector(".opening-card-summary").click()',
    );
    await delay(80);
    await saveScreenshot(session, "/tmp/d12-left-work-panel.png");

    await assertEval(
      session,
      'document.querySelectorAll("[data-d13-tab]").length === 3 && document.querySelector("[data-d13-tab=services]").classList.contains("active") && getComputedStyle(document.querySelector("[data-d13-pane=services]")).display !== "none" && getComputedStyle(document.querySelector("[data-d13-pane=scope]")).display === "none" && getComputedStyle(document.querySelector("[data-d13-pane=price]")).display === "none"',
      "D1.3: desktop right panel did not start in the Services workspace",
    );
    await assertEval(
      session,
      'document.querySelector("#d13ServicesBadge").textContent === "6" && document.querySelector("#d13ScopeBadge").textContent === "1" && document.querySelector("#d13PriceBadge").textContent === "2" && document.querySelector("#d13OfferTotalKpi").textContent.includes("Непълна")',
      "D1.3: persistent service/scope/price counts or total state are incorrect",
    );
    await assertEval(
      session,
      'getComputedStyle(document.querySelector("#serviceScopeControls")).gridTemplateColumns.split(" ").length === 2',
      "D1.3: desktop Services workspace is not using the compact two-column service grid",
    );
    await assertEval(
      session,
      'getComputedStyle(document.querySelector("#d13ServiceFilterInput")).display !== "none"',
      "D1.3: desktop service search is missing",
    );
    await evaluate(
      session,
      '(() => { const input = document.querySelector("#d13ServiceFilterInput"); input.value = "боя"; input.dispatchEvent(new Event("input", { bubbles: true })); })()',
    );
    await delay(60);
    await assertEval(
      session,
      'document.querySelectorAll("#serviceScopeControls .service-scope-toggle").length === 1 && document.querySelector("#serviceScopeControls").textContent.includes("Боядисване") && document.querySelector("#d13ServicesBadge").textContent === "1"',
      "D1.3: service search did not filter the scalable service list",
    );
    await evaluate(
      session,
      '(() => { const input = document.querySelector("#d13ServiceFilterInput"); input.value = ""; input.dispatchEvent(new Event("input", { bubbles: true })); })()',
    );
    await delay(60);
    await assertEval(
      session,
      'document.querySelectorAll("#serviceScopeControls .service-scope-toggle").length === 6 && document.querySelector("#d13ServicesBadge").textContent === "6"',
      "D1.3: clearing service search did not restore the full list",
    );
    await saveScreenshot(session, "/tmp/d13-right-services.png");

    await evaluate(session, 'document.querySelector("[data-d13-tab=scope]").click()');
    await delay(80);
    await assertEval(
      session,
      'document.querySelector("[data-d13-tab=scope]").classList.contains("active") && getComputedStyle(document.querySelector("[data-d13-pane=scope]")).display !== "none" && getComputedStyle(document.querySelector("[data-d13-pane=services]")).display === "none" && document.querySelector("#d13ScopeEmpty").hidden && !document.querySelector("#finePuttyTargetsSection").hidden',
      "D1.3: Scope workspace did not expose the active Fine Putty scope",
    );
    await saveScreenshot(session, "/tmp/d13-right-scope.png");

    await evaluate(session, 'document.querySelector("[data-d13-tab=price]").click()');
    await delay(80);
    await assertEval(
      session,
      'document.querySelector("[data-d13-tab=price]").classList.contains("active") && getComputedStyle(document.querySelector("[data-d13-pane=price]")).display !== "none" && getComputedStyle(document.querySelector("[data-d13-pane=scope]")).display === "none" && document.querySelectorAll("#offerRows .offer-row").length === 2',
      "D1.3: Price/Info workspace did not expose the current offer lines",
    );
    const d13Sticky = await evaluate(
      session,
      `(() => {
        const right = document.querySelector(".panel.right");
        const header = document.querySelector(".d13-work-header");
        const before = Math.round(header.getBoundingClientRect().top - right.getBoundingClientRect().top);
        right.scrollTop = right.scrollHeight;
        const after = Math.round(header.getBoundingClientRect().top - right.getBoundingClientRect().top);
        return {
          before,
          after,
          rightScrollTop: right.scrollTop,
          total: document.querySelector("#d13OfferTotalKpi").textContent,
          status: document.querySelector("#d13OfferTotalStatus").textContent,
        };
      })()`,
    );
    if (
      Math.abs(d13Sticky.before) > 1 ||
      Math.abs(d13Sticky.after) > 1 ||
      !d13Sticky.total.includes("Непълна") ||
      !d13Sticky.status.includes("без цена")
    ) {
      throw new Error(
        "D1.3: persistent total/header did not remain visible while the right workspace scrolled: " +
          JSON.stringify(d13Sticky),
      );
    }
    await evaluate(
      session,
      'document.querySelector(".panel.right").scrollTop = 0',
    );
    await delay(80);
    await saveScreenshot(session, "/tmp/d13-right-price-info.png");

    await evaluate(session, 'document.querySelector("[data-d13-tab=services]").click()');
    await delay(60);

    await assertEval(
      session,
      '!document.querySelector("#serviceRowLaminate") && !document.querySelector("[data-service-include=assignment-laminate-flooring-1]").checked',
      "P3.4b scope: Laminate must not be in a new offer until explicitly selected",
    );
    await assertEval(
      session,
      'document.querySelector("#lineTotalText").textContent.includes("Цена не е въведена") && document.querySelector("#offerTotalKpi").textContent.includes("Непълна оферта") && document.querySelector("#offerTotalStatus").textContent.includes("2 позиции")',
      "P3.4b: only included services may make the offer incomplete",
    );
    await assertEval(
      session,
      'getComputedStyle(document.querySelector("#unitPriceWorkControl")).display !== "none" && getComputedStyle(document.querySelector("#unitPriceKpi")).display === "none"',
      "P3.4b: Work should expose the price input and hide the client-only price value",
    );

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

    const d14WallPoint = await clickViewerUntil(
      session,
      'document.querySelector("#selectionChip")?.textContent.includes("стена") && !document.querySelector("#d14ModelContext").hidden',
      [
        [0.50, 0.34],
        [0.42, 0.38],
        [0.58, 0.38],
        [0.35, 0.44],
        [0.65, 0.44],
        [0.50, 0.48],
      ],
      "D1.4: could not select a visible wall through the real 3D canvas",
    );
    await assertEval(
      session,
      'document.querySelector("[data-d13-tab=scope]").classList.contains("active") && document.querySelectorAll("#d14ContextServices [data-d14-service-id]").length === 1 && document.querySelector("#d14ContextServices [data-d14-service-id=assignment-fine-putty-1]")?.classList.contains("active") && !document.querySelector("#finePuttyTargetsSection").hidden && !document.querySelector("[data-service-scope-target=fine-putty-ceiling]")',
      "D1.4: single-service wall click did not route to the exact Fine Putty wall scope",
    );
    await assertEval(
      session,
      '(() => { const exact = parseFloat(document.querySelector("#d14BreakdownQuantity").textContent.replace(",", ".")); return !document.querySelector("#d14ContextBreakdown").hidden && document.querySelector("#d14BreakdownQuantityLabel").textContent === "Нето" && Number.isFinite(exact) && exact > 0 && exact < 43.59 && document.querySelector("#quantityText").textContent.includes("43,59") && document.querySelector("#d14BreakdownPrice").textContent.includes("Без цена") && document.querySelector("#d14FullScopeDetails").open === false && document.querySelector("#d14FullScopeSummary").textContent.includes("Общ обхват"); })()',
      "D1.4b: selected wall is not the leading exact-position context while the full offer scope stays unchanged",
    );
    await saveScreenshot(session, "/tmp/d14-surface-context.png");

    await evaluate(
      session,
      '(() => { const primer = document.querySelector("[data-service-include=assignment-primer-1]"); primer.checked = true; primer.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(80);
    await evaluate(
      session,
      '(() => { const paint = document.querySelector("[data-service-include=assignment-paint-1]"); paint.checked = true; paint.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(80);

    await clickViewerAt(session, d14WallPoint.xRatio, d14WallPoint.yRatio);
    await assertEval(
      session,
      'document.querySelector("#selectionChip")?.textContent.includes("стена") && document.querySelectorAll("#d14ContextServices [data-d14-service-id]").length === 3 && !document.querySelector("#d14ContextServices .active") && document.querySelector("#d13ScopeEmpty").textContent.includes("3D контекста")',
      "D1.4: multiple services on one wall were not exposed as an explicit choice",
    );
    await saveScreenshot(session, "/tmp/d14-multi-service-context.png");

    await evaluate(
      session,
      'document.querySelector("#d14ContextServices [data-d14-service-id=assignment-paint-1]").click()',
    );
    await delay(80);
    await assertEval(
      session,
      `document.querySelector("#d14ContextServices [data-d14-service-id=assignment-paint-1]").classList.contains("active") && document.querySelector("#operationSummary-paint")?.getAttribute("aria-expanded") === "true" && Boolean(document.querySelector('[data-operation-id="assignment-paint-1"][data-operation-scope="walls"]')) && !document.querySelector('[data-operation-id="assignment-paint-1"][data-operation-scope="ceiling"]') && document.querySelectorAll("#offerRows .offer-row.selected").length === 1 && document.querySelector("#offerRows .offer-row.selected")?.dataset.serviceId === "assignment-paint-1" && document.querySelector("#selectionChip")?.textContent.includes("стена")`,
      "D1.4: choosing Paint did not keep the wall selected and isolate the exact Paint wall context",
    );
    const d14PaintExactBeforeScope = await evaluate(
      session,
      'document.querySelector("#d14BreakdownQuantity").textContent',
    );
    await assertEval(
      session,
      'document.querySelector("#d14BreakdownService").textContent.includes("Боядисване") && document.querySelector("#d14BreakdownPrice").textContent.includes("Без цена") && document.querySelector("#d14FullScopeDetails").open === false && document.querySelector("#d14FullScopeSummary").textContent.includes("4 стени + таван")',
      "D1.4b: Paint exact-position card did not lead while full 4-wall+ceiling scope stayed secondary",
    );
    await saveScreenshot(session, "/tmp/d14-selected-surface-leading.png");

    await evaluate(
      session,
      'document.querySelector("#d14FullScopeSummary").click()',
    );
    await delay(60);
    await assertEval(
      session,
      'document.querySelector("#d14FullScopeDetails").open === true && document.querySelectorAll("[data-operation-target]").length === 4 && Boolean(document.querySelector(\'[data-operation-id="assignment-paint-1"][data-operation-scope="walls"]\'))',
      "D1.4b: secondary full-scope editor cannot be opened on demand",
    );
    const d14PaintExactAfterScope = await evaluate(
      session,
      'document.querySelector("#d14BreakdownQuantity").textContent',
    );
    if (d14PaintExactAfterScope !== d14PaintExactBeforeScope) {
      throw new Error(
        "D1.4b: opening the full-scope editor changed the selected-wall quantity",
      );
    }
    await evaluate(
      session,
      'document.querySelector("#d14FullScopeSummary").click()',
    );
    await delay(40);

    await evaluate(
      session,
      '(() => { const paint = document.querySelector("[data-service-include=assignment-paint-1]"); paint.checked = false; paint.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(80);
    await evaluate(
      session,
      '(() => { const primer = document.querySelector("[data-service-include=assignment-primer-1]"); primer.checked = false; primer.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(80);

    await evaluate(session, 'document.querySelector("#showAllBtn").click()');
    await delay(100);
    let d14OpeningSelected = false;
    const d14OpeningPoints = [
      [0.18, 0.42], [0.22, 0.50], [0.26, 0.58], [0.30, 0.62],
      [0.70, 0.42], [0.74, 0.48], [0.78, 0.54], [0.82, 0.60],
      [0.35, 0.38], [0.65, 0.38], [0.38, 0.55], [0.62, 0.55],
    ];
    for (const [xRatio, yRatio] of d14OpeningPoints) {
      await clickViewerAt(session, xRatio, yRatio);
      d14OpeningSelected = await evaluate(
        session,
        'document.querySelector("#selectionChip")?.textContent.includes("Врата") || document.querySelector("#selectionChip")?.textContent.includes("Прозорец")',
      );
      if (d14OpeningSelected) break;
    }
    if (!d14OpeningSelected) {
      throw new Error(
        "D1.4: real 3D opening hit-area could not be selected",
      );
    }
    await assertEval(
      session,
      'document.querySelector(".opening-card.context-selected")?.open === true && document.querySelector(".opening-card.context-selected .opening-fields")?.getBoundingClientRect().height > 0 && document.querySelector("#d14ModelContext").hidden',
      "D1.4: opening click did not route to the exact left opening editor",
    );
    await saveScreenshot(session, "/tmp/d14-opening-context.png");

    await waitForApp(session, baseUrl);
    await assertEval(
      session,
      'document.querySelector("#projectBarStatus").textContent.includes("Запазено") && document.querySelector("#undoProjectButton").disabled && document.querySelector("#redoProjectButton").disabled',
      "D1.4 QA reset did not restore a clean canonical Work project",
    );

    const finePuttyFocusedView = await captureElement(session, "#viewer canvas");
    await evaluate(
      session,
      '(() => { const input = document.querySelector("[data-service-include=assignment-laminate-flooring-1]"); input.checked = true; input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(100);
    await assertEval(
      session,
      'Boolean(document.querySelector("#serviceRowLaminate")) && document.querySelector("#offerTotalStatus").textContent.includes("3 позиции") && document.querySelector("[data-d13-tab=price]").classList.contains("active")',
      "P3.4b/D1.3: selecting Laminate did not add it to the offer or route to Price/Info",
    );
    await evaluate(session, 'document.querySelector("#serviceRowLaminate").click()');
    await delay(120);
    await assertEval(
      session,
      'document.querySelector("#serviceRowLaminate").classList.contains("selected") && document.querySelector("#quantityKpi").textContent.includes("20,16") && document.querySelector("#infoTitle").textContent.includes("Ламинат")',
      "P3.1c/P3.4b: selected Laminate is not synchronized with the offer/model",
    );
    await waitForNextPaint(session);
    const laminateFocusedView = await captureElement(session, "#viewer canvas");
    assertScreenshotChanged(
      finePuttyFocusedView,
      laminateFocusedView,
      "P3.1c/P3.4b: selected Laminate did not change model presentation",
    );
    await saveScreenshot(session, "/tmp/p31d-laminate-desktop.png");

    await evaluate(
      session,
      '(() => { const input = document.querySelector("[data-service-include=assignment-laminate-flooring-1]"); input.checked = false; input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(100);
    await assertEval(
      session,
      '!document.querySelector("#serviceRowLaminate") && document.querySelector("#offerTotalStatus").textContent.includes("2 позиции")',
      "P3.4b scope: deselected Laminate still affects the offer",
    );
    await evaluate(session, 'document.querySelector("#serviceRow").click()');

    await assertEval(
      session,
      '!document.querySelector("[data-service-include=assignment-gypsum-putty-1]").checked && !document.querySelector("[data-service-id=assignment-gypsum-putty-1]")',
      "P3.4b scope: gypsum putty must start outside the offer",
    );
    await assertEval(
      session,
      '["assignment-sanding-1", "assignment-primer-1", "assignment-paint-1"].every((id) => !document.querySelector("[data-service-include=" + id + "]").checked && !document.querySelector("[data-service-id=" + id + "]"))',
      "P3.5a: sanding, primer and paint must start outside the offer",
    );
    await evaluate(
      session,
      '(() => { const input = document.querySelector("[data-service-include=assignment-gypsum-putty-1]"); input.checked = true; input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(100);
    await assertEval(
      session,
      `Boolean(document.querySelector("[data-service-id=assignment-gypsum-putty-1]")) && document.querySelector("#infoTitle").textContent.includes("Гипсова шпакловка") && document.querySelector("#quantityKpi").textContent.includes("43,59") && document.querySelector("[data-d13-tab=scope]").classList.contains("active")`,
      "P3.3c/D1.3: adding gypsum putty did not create a focused line or route to Scope",
    );
    await assertEval(
      session,
      'document.querySelector("#gypsumPuttySummaryButton")?.getAttribute("aria-expanded") === "true"',
      "P3.3c: newly added gypsum putty did not open its editor",
    );
    await evaluate(session, 'document.querySelector("#gypsumPuttySummaryButton").click()');
    await delay(60);
    await assertEval(
      session,
      'document.querySelector("#gypsumPuttySummaryButton")?.getAttribute("aria-expanded") === "false" && !document.querySelector("[data-operation-target]")',
      "P3.3c: compact service row did not collapse its settings",
    );
    await evaluate(session, 'document.querySelector("#gypsumPuttySummaryButton").click()');
    await delay(60);
    await assertEval(
      session,
      'document.querySelector("#gypsumPuttySummaryButton")?.getAttribute("aria-expanded") === "true" && Boolean(document.querySelector("[data-operation-target]"))',
      "P3.3c: compact service row did not reopen its settings",
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
    await evaluate(
      session,
      '(() => { const input = document.querySelector("[data-service-include=assignment-gypsum-putty-1]"); input.checked = false; input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(80);
    await assertEval(
      session,
      `!document.querySelector("[data-service-id=assignment-gypsum-putty-1]") && !document.querySelector("[data-service-id=assignment-gypsum-putty-ceiling-1]") && !document.querySelector("[data-service-include=assignment-gypsum-putty-1]").checked`,
      "P3.4b scope: deselecting gypsum putty did not remove it from the offer",
    );

    await evaluate(
      session,
      '(() => { const input = document.querySelector("[data-service-include=assignment-paint-1]"); input.checked = true; input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(80);
    await assertEval(
      session,
      'Boolean(document.querySelector("[data-service-id=assignment-paint-1]")) && Boolean(document.querySelector("[data-service-id=assignment-paint-ceiling-1]")) && document.querySelector(\'[data-operation-id="assignment-paint-1"][data-operation-scope="ceiling"]\')?.checked && document.querySelector("#infoTitle").textContent.includes("Боядисване") && document.querySelector("#quantityKpi").textContent.includes("43,59") && document.querySelector("#operationSummary-paint")?.getAttribute("aria-expanded") === "true"',
      "P3.5b: Paint did not enter with walls + ceiling included by default",
    );
    await evaluate(
      session,
      '(() => { const input = document.querySelector("#unitPriceInput"); input.value = "4.25"; input.dispatchEvent(new Event("input", { bubbles: true })); input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(80);
    await assertEval(
      session,
      'document.querySelector("#totalKpi").textContent.includes("185,26")',
      "P3.5b: Paint wall EUR price did not calculate the line total",
    );
    await evaluate(
      session,
      'document.querySelector("[data-service-id=assignment-paint-ceiling-1]").click()',
    );
    await delay(60);
    await assertEval(
      session,
      'document.querySelector("#quantityKpi").textContent.includes("20,16") && document.querySelector("#infoTitle").textContent.includes("Таван")',
      "P3.5b: Paint ceiling did not expose its own 20,16 m² scope",
    );
    await evaluate(
      session,
      '(() => { const input = document.querySelector("#unitPriceInput"); input.value = "5.5"; input.dispatchEvent(new Event("input", { bubbles: true })); input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(60);
    await assertEval(
      session,
      'document.querySelector("#totalKpi").textContent.includes("110,88")',
      "P3.5b: Paint ceiling did not keep an independent EUR price",
    );
    await evaluate(
      session,
      '(() => { const input = document.querySelector(\'[data-operation-id="assignment-paint-1"][data-operation-scope="ceiling"]\'); input.checked = false; input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(80);
    await assertEval(
      session,
      '!document.querySelector("[data-service-id=assignment-paint-ceiling-1]") && Boolean(document.querySelector("[data-service-id=assignment-paint-1]")) && document.querySelector("[data-service-include=assignment-paint-1]").checked',
      "P3.5b: removing only the Paint ceiling scope also removed the wall service",
    );
    await evaluate(session, 'document.querySelector("[data-service-id=assignment-paint-1]").click()');
    await evaluate(
      session,
      `(() => { const input = document.querySelector(\'[data-operation-id="assignment-paint-1"][data-operation-target="room-1.wall-front"]\'); input.checked = false; input.dispatchEvent(new Event("change", { bubbles: true })); })()`,
    );
    await delay(80);
    await assertEval(
      session,
      'document.querySelector("#quantityKpi").textContent.includes("34,56") && document.querySelector("#totalKpi").textContent.includes("146,88")',
      "P3.5b: Paint exact wall scope did not remain independent after removing ceiling",
    );
    await evaluate(
      session,
      '(() => { const input = document.querySelector("[data-service-include=assignment-paint-1]"); input.checked = false; input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(80);
    await assertEval(
      session,
      '!document.querySelector("[data-service-id=assignment-paint-1]") && !document.querySelector("[data-service-id=assignment-paint-ceiling-1]") && !document.querySelector("[data-service-include=assignment-paint-1]").checked',
      "P3.5b: Paint still affects the offer after full service deselection",
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

    await evaluate(session, 'document.querySelector("#serviceRow").click()');
    await evaluate(
      session,
      '(() => { const input = document.querySelector("#unitPriceInput"); input.value = "6.5"; input.dispatchEvent(new Event("input", { bubbles: true })); })()',
    );
    await delay(60);
    await assertEval(
      session,
      'document.querySelector("#lineTotalText").textContent.includes("286,00") && document.querySelector("#totalKpi").textContent.includes("286,00") && document.querySelector("#offerTotalKpi").textContent.includes("Непълна оферта") && document.querySelector("#offerTotalStatus").textContent.includes("1 позиция")',
      "P3.5b: pricing Fine Putty walls must not silently price the ceiling",
    );
    await evaluate(
      session,
      'document.querySelector("#unitPriceInput").dispatchEvent(new Event("change", { bubbles: true }))',
    );
    await delay(80);
    await assertEval(
      session,
      'document.querySelector("#unitPriceInput").value === "6,50" && document.querySelector("#lineTotalText").textContent.includes("286,00")',
      "P3.4b: confirmed wall EUR price did not remain in canonical Work state",
    );

    await evaluate(session, 'document.querySelector("#undoProjectButton").click()');
    await delay(80);
    await assertEval(
      session,
      'document.querySelector("#lineTotalText").textContent.includes("Цена не е въведена") && document.querySelector("#unitPriceInput").value === ""',
      "P3.4b: Undo did not restore the missing-price state",
    );
    await evaluate(session, 'document.querySelector("#redoProjectButton").click()');
    await delay(80);
    await assertEval(
      session,
      'document.querySelector("#lineTotalText").textContent.includes("286,00") && document.querySelector("#unitPriceInput").value === "6,50"',
      "P3.4b: Redo did not restore the entered wall EUR price",
    );

    await evaluate(
      session,
      'document.querySelector("[data-service-id=assignment-fine-putty-ceiling-1]").click()',
    );
    await delay(60);
    await assertEval(
      session,
      'document.querySelector("#quantityKpi").textContent.includes("20,64") && document.querySelector("#infoTitle").textContent.includes("Таван")',
      "P3.5b: Fine Putty ceiling did not use the resized room ceiling area",
    );
    await evaluate(
      session,
      '(() => { const input = document.querySelector("#unitPriceInput"); input.value = "7"; input.dispatchEvent(new Event("input", { bubbles: true })); input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(80);
    await assertEval(
      session,
      'document.querySelector("#totalKpi").textContent.includes("144,48") && document.querySelector("#offerTotalKpi").textContent.includes("430,48") && document.querySelector("#offerTotalStatus").textContent.includes("Всички включени позиции")',
      "P3.5b: separate ceiling price did not complete Fine Putty wall + ceiling totals",
    );
    await evaluate(session, 'document.querySelector("#serviceRow").click()');

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
      'getComputedStyle(document.querySelector("#unitPriceWorkControl")).display === "none" && getComputedStyle(document.querySelector("#unitPriceKpi")).display !== "none" && document.querySelector("#unitPriceKpi").textContent.includes("6,50") && document.querySelector("#totalKpi").textContent.includes("286,00")',
      "P3.4b: Client Preview did not keep pricing read-only and visible",
    );
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

async function runM0ResponsiveReadabilitySmoke(width, screenshotPath = null) {
  const session = await createSession();
  try {
    await session.call("Emulation.setDeviceMetricsOverride", {
      width,
      height: 844,
      deviceScaleFactor: 2,
      mobile: false,
      screenWidth: width,
      screenHeight: 844,
    });
    await session.call("Emulation.setTouchEmulationEnabled", {
      enabled: true,
      maxTouchPoints: 5,
    });
    await authorizeQaWork(session);

    const metrics = await evaluate(
      session,
      `(() => {
        const workspace = document.querySelector(".workspace");
        const viewer = document.querySelector(".viewer-wrap");
        const left = document.querySelector(".panel.left");
        const right = document.querySelector(".panel.right");
        const serviceText = document.querySelector(".service-scope-toggle span");
        const sectionTitle = document.querySelector(".section-title");
        const projectTitle = document.querySelector(".project-bar-current strong");
        const viewerButton = document.querySelector(".viewer-toolbar button");
        const numberInput = document.querySelector('input[type="number"]');
        const firstService = document.querySelector(".service-scope-toggle");
        const rect = (el) => el?.getBoundingClientRect();
        const px = (el, property) => parseFloat(getComputedStyle(el)[property]);
        const viewerRect = rect(viewer);
        const leftRect = rect(left);
        const rightRect = rect(right);
        return {
          innerWidth: window.innerWidth,
          visualViewportWidth: window.visualViewport?.width ?? window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          workspaceDisplay: getComputedStyle(workspace).display,
          workspaceDirection: getComputedStyle(workspace).flexDirection,
          viewerWidth: viewerRect?.width ?? 0,
          leftWidth: leftRect?.width ?? 0,
          rightWidth: rightRect?.width ?? 0,
          leftTop: leftRect?.top ?? 0,
          viewerBottom: viewerRect?.bottom ?? 0,
          serviceFont: px(serviceText, "fontSize"),
          sectionTitleFont: px(sectionTitle, "fontSize"),
          projectTitleFont: px(projectTitle, "fontSize"),
          viewerButtonFont: px(viewerButton, "fontSize"),
          viewerButtonHeight: rect(viewerButton)?.height ?? 0,
          numberInputFont: px(numberInput, "fontSize"),
          numberInputHeight: rect(numberInput)?.height ?? 0,
          serviceHeight: rect(firstService)?.height ?? 0,
        };
      })()`,
    );

    console.log(`M0 ${width}px metrics: ${JSON.stringify(metrics)}`);

    if (Math.abs(metrics.innerWidth - width) > 1) {
      throw new Error(
        `M0 ${width}px: viewport mismatch ${metrics.innerWidth}px`,
      );
    }
    if (metrics.scrollWidth > metrics.innerWidth + 1) {
      throw new Error(
        `M0 ${width}px: horizontal overflow ${metrics.scrollWidth}px`,
      );
    }
    if (
      metrics.workspaceDisplay !== "flex" ||
      metrics.workspaceDirection !== "column"
    ) {
      throw new Error(
        `M0 ${width}px: Work is not single-column on a phone-sized viewport`,
      );
    }
    const contentWidth = Math.min(
      metrics.innerWidth,
      metrics.visualViewportWidth,
      metrics.scrollWidth,
    );
    if (
      metrics.viewerWidth < contentWidth - 2 ||
      metrics.leftWidth < contentWidth - 2 ||
      metrics.rightWidth < contentWidth - 2
    ) {
      throw new Error(
        `M0 ${width}px: one or more Work zones are still squeezed side-by-side: ${JSON.stringify(metrics)}`,
      );
    }
    if (metrics.leftTop < metrics.viewerBottom - 1) {
      throw new Error(
        `M0 ${width}px: geometry panel still overlaps/sits beside the 3D viewer`,
      );
    }
    if (
      metrics.serviceFont < 14 ||
      metrics.sectionTitleFont < 12 ||
      metrics.projectTitleFont < 16 ||
      metrics.viewerButtonFont < 13 ||
      metrics.numberInputFont < 16
    ) {
      throw new Error(
        `M0 ${width}px: text remains below the readability floor: ${JSON.stringify(metrics)}`,
      );
    }
    if (
      metrics.viewerButtonHeight < 44 ||
      metrics.numberInputHeight < 44 ||
      metrics.serviceHeight < 44
    ) {
      throw new Error(
        `M0 ${width}px: touch target remains below 44px: ${JSON.stringify(metrics)}`,
      );
    }

    if (screenshotPath) {
      await saveScreenshot(session, screenshotPath);
    }
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
      'Array.from(document.querySelectorAll(".service-scope-toggle")).length === 6 && Array.from(document.querySelectorAll(".service-scope-toggle")).every((el) => el.getBoundingClientRect().height >= 44) && !document.querySelector("#serviceRowLaminate")',
      "Mobile P3.4b scope: service check controls are missing, too small, or Laminate is included by default",
    );
    await evaluate(
      session,
      'document.querySelector("#serviceScopeControls").scrollIntoView({ block: "start", behavior: "instant" })',
    );
    await delay(100);
    await saveScreenshot(session, "/tmp/p34b-service-scope-mobile.png");
    await evaluate(
      session,
      '(() => { const input = document.querySelector("[data-service-include=assignment-fine-putty-1]"); input.checked = false; input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(80);
    await assertEval(
      session,
      'document.querySelectorAll("#offerRows .offer-row").length === 0 && document.querySelector("#offerTotalKpi").textContent.trim() === "—" && document.querySelector("#offerTotalStatus").textContent.includes("Няма избрани услуги")',
      "Mobile P3.4b scope: empty service scope is incorrectly treated as an incomplete offer",
    );
    await saveScreenshot(session, "/tmp/p34b-empty-service-scope-mobile.png");
    await evaluate(
      session,
      '(() => { const input = document.querySelector("[data-service-include=assignment-fine-putty-1]"); input.checked = true; input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(80);
    await assertEval(
      session,
      '["#undoProjectButton", "#redoProjectButton"].every((selector) => document.querySelector(selector)?.getBoundingClientRect().height >= 44)',
      "Mobile P3.3b: Undo/Redo controls are below the 44px touch target",
    );
    await assertEval(
      session,
      '["assignment-laminate-flooring-1", "assignment-gypsum-putty-1", "assignment-sanding-1", "assignment-primer-1", "assignment-paint-1"].every((id) => !document.querySelector("[data-service-include=" + id + "]").checked)',
      "Mobile P3.4b scope: optional services must start deselected",
    );
    await assertEval(
      session,
      'document.querySelector("#unitPriceInput")?.getBoundingClientRect().height >= 44 && document.querySelector("#offerTotalKpi").textContent.includes("Непълна оферта")',
      "Mobile P3.4b: price input is missing, too small, or incomplete total is not visible",
    );
    await evaluate(
      session,
      '(() => { const input = document.querySelector("#unitPriceInput"); input.value = "6.5"; input.dispatchEvent(new Event("input", { bubbles: true })); input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(80);
    await evaluate(
      session,
      'document.querySelector("#offerDetailsSection").scrollIntoView({ block: "center", behavior: "instant" })',
    );
    await delay(100);
    await saveScreenshot(session, "/tmp/p34b-dynamic-pricing-mobile.png");
    await evaluate(
      session,
      '(() => { const input = document.querySelector("[data-service-include=assignment-laminate-flooring-1]"); input.checked = true; input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(80);
    await assertEval(
      session,
      'Boolean(document.querySelector("#serviceRowLaminate")) && document.querySelector("#offerTotalKpi").textContent.includes("Непълна оферта")',
      "Mobile P3.4b scope: selected Laminate did not enter the offer",
    );
    await evaluate(session, 'document.querySelector("#serviceRowLaminate").click()');
    await delay(80);
    await saveScreenshot(session, "/tmp/p31d-laminate-mobile-client.png");
    await evaluate(
      session,
      '(() => { const input = document.querySelector("[data-service-include=assignment-laminate-flooring-1]"); input.checked = false; input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(80);
    await assertEval(
      session,
      '!document.querySelector("#serviceRowLaminate") && document.querySelector("#offerTotalKpi").textContent.includes("Непълна оферта") && document.querySelector("#offerTotalStatus").textContent.includes("283,34")',
      "Mobile P3.4b scope: deselected Laminate still blocks the completed offer",
    );

    await evaluate(
      session,
      '(() => { const input = document.querySelector("[data-service-include=assignment-gypsum-putty-1]"); input.checked = true; input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(80);
    await assertEval(
      session,
      'document.querySelector("#gypsumPuttySummaryButton")?.getBoundingClientRect().height >= 44 && Array.from(document.querySelectorAll("#operationAuthoring .check-row")).every((el) => el.getBoundingClientRect().height >= 44)',
      "Mobile P3.3c/P3.4b: gypsum putty settings are below the 44px touch target",
    );
    await evaluate(session, 'document.querySelector("#gypsumPuttySummaryButton").click()');
    await delay(80);
    await assertEval(
      session,
      'document.querySelector("#gypsumPuttySummaryButton")?.getBoundingClientRect().height >= 44 && document.querySelector("#gypsumPuttySummaryButton")?.getAttribute("aria-expanded") === "false" && !document.querySelector("#operationAuthoring .check-row")',
      "Mobile P3.3c: compact gypsum row did not collapse cleanly",
    );
    await evaluate(
      session,
      'document.querySelector("#operationAuthoring").scrollIntoView({ block: "center", behavior: "instant" })',
    );
    await delay(100);
    await saveScreenshot(session, "/tmp/p33c-gypsum-authoring-mobile.png");
    await evaluate(session, 'document.querySelector("#gypsumPuttySummaryButton").click()');
    await delay(60);
    await evaluate(
      session,
      '(() => { const input = document.querySelector("[data-service-include=assignment-gypsum-putty-1]"); input.checked = false; input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(80);

    await evaluate(
      session,
      '(() => { const input = document.querySelector("[data-service-include=assignment-paint-1]"); input.checked = true; input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
    await delay(80);
    await assertEval(
      session,
      'document.querySelector("#operationSummary-paint")?.getBoundingClientRect().height >= 44 && document.querySelector("#operationSummary-paint")?.getAttribute("aria-expanded") === "true" && Boolean(document.querySelector("[data-service-id=assignment-paint-ceiling-1]")) && document.querySelector(\'[data-operation-id="assignment-paint-1"][data-operation-scope="ceiling"]\')?.checked && Array.from(document.querySelectorAll("#operationAuthoring .check-row")).every((el) => el.getBoundingClientRect().height >= 44)',
      "Mobile P3.5b: Paint walls + default ceiling authoring is missing or below the 44px touch target",
    );
    await evaluate(
      session,
      'document.querySelector("#operationAuthoring").scrollIntoView({ block: "center", behavior: "instant" })',
    );
    await delay(100);
    await saveScreenshot(session, "/tmp/p35b-ceiling-scope-mobile.png");
    await saveScreenshot(session, "/tmp/p35a-wall-finishing-mobile.png");
    await evaluate(
      session,
      '(() => { const input = document.querySelector("[data-service-include=assignment-paint-1]"); input.checked = false; input.dispatchEvent(new Event("change", { bubbles: true })); })()',
    );
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

    await openAndSwitchMobileProjectQa(session);
    await delay(120);

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
      'getComputedStyle(document.querySelector("#unitPriceWorkControl")).display === "none" && document.querySelector("#offerTotalKpi").textContent.includes("Непълна оферта")',
      "Mobile Client P3.4b: editable pricing leaked or incomplete total is missing",
    );
    await assertEval(
      session,
      '!document.querySelector("#serviceRowLaminate")',
      "Mobile Client P3.4b scope: unselected Laminate leaked into the Client offer",
    );
    await assertMobileLayout(session, "Client");
    await evaluate(session, 'document.querySelector("#showAllBtn").click()');
    await delay(220);
    await saveScreenshot(session, "/tmp/p32b-openings-mobile-client.png");
    await evaluate(session, 'document.querySelector("#autoCutawayBtn").click()');
    await delay(120);
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
    await assertEval(session, '!document.querySelector("#projectBar")', "Client: Work project bar is present");
    await assertEval(session, 'getComputedStyle(document.querySelector("#exitPreviewBtn")).display === "none"', "Client: owner-only return control is visible");
    await assertEval(
      session,
      'getComputedStyle(document.querySelector(".openings-section")).display === "none"',
      "Client P3.2d: opening authoring controls leaked into Client mode",
    );
    await assertEval(
      session,
      'document.querySelector("#lineTotalText").textContent.includes("Цена не е въведена") && document.querySelector("#offerTotalKpi").textContent.includes("Непълна оферта")',
      "Client P3.4b: missing prices are not clearly presented as incomplete",
    );
    await assertEval(
      session,
      'getComputedStyle(document.querySelector("#unitPriceWorkControl")).display === "none" && getComputedStyle(document.querySelector("#unitPriceKpi")).display !== "none" && document.querySelector("#unitPriceKpi").textContent.includes("Цена не е въведена")',
      "Client P3.4b: price editor leaked into read-only Client mode",
    );
    await assertEval(
      session,
      '!document.querySelector("#serviceRowLaminate") && getComputedStyle(document.querySelector("#serviceScopeControls").closest(".work-only")).display === "none"',
      "Client P3.4b scope: unselected Laminate leaked into the offer or Work scope controls are visible",
    );

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
await runD15DesktopAcceptanceSmoke();
await runDirectClientSmoke();
await runMobileWorkSmoke();
await runM0ResponsiveReadabilitySmoke(390, "/tmp/m0-mobile-readable-390.png");
await runM0ResponsiveReadabilitySmoke(412, "/tmp/m0-mobile-readable-412.png");
await runM0ResponsiveReadabilitySmoke(720, "/tmp/m0-mobile-readable-wide.png");
await runMobileClientSmoke();
console.log("Browser smoke passed: private login + desktop Work + D1.5 full desktop acceptance + desktop Client + mobile Work + M0 readability 360/390/412/wide-phone + mobile Owner Preview + mobile Client");
