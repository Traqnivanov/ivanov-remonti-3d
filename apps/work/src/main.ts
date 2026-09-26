import "./styles.css";
import type { Opening, SurfaceId, WallId } from "./domain";
import {
  createDefaultProject,
  createOpeningProofProject,
  getFinePuttyAssignment,
  wallIds,
} from "./domain";
import type { ProjectRepository } from "./project-repository";
import {
  applyProjectSaveFailure,
  applyProjectSaveSuccess,
  beginProjectSave,
  createProjectSession,
  loadProjectStartup,
  markProjectDirty,
  shouldWarnBeforeProjectSwitch,
  type ProjectSession,
} from "./project-session";
import {
  calculateSupportedOfferLine,
  calculateSupportedOfferLines,
  type OfferLineCalculation,
} from "./calculation";
import { RoomViewer } from "./viewer";
import { renderM2Schema } from "./m2-schema";
import { getModeCapabilities, type AppEntry } from "./capabilities";
import {
  FINE_PUTTY_ASSIGNMENT_ID,
  createInitialOfferInteraction,
  getFocusedServiceAssignmentIds,
  getHighlightedEntityIds,
  selectModelEntity,
  selectOfferService,
  shouldShowLaminateFloor,
  showWholeResult,
} from "./smart-offer-interaction";
import { createWorkSupabaseClient } from "./supabase";
import { createSupabaseProjectReadRepository } from "./supabase-project-repository";
import {
  addOpening,
  openingWallLabels,
  removeOpening,
  updateOpening,
  validateRoomResize,
  type OpeningMutationResult,
} from "./opening-authoring";
import { resolveWorkAccess } from "./work-auth";
import { renderWorkAuthUnavailable, renderWorkLogin } from "./work-login";
import {
  confirmDiscardUnsavedChanges,
  openProjectsDialog,
  renderProjectBar,
  renderProjectGate,
  renderProjectGateError,
} from "./work-project-ui";

const directClientEntry =
  new URLSearchParams(window.location.search).get("preview") === "1";
const DEV_QA_AUTH_KEY = "ivanov-remonti:qa-authorized";

let activeViewer: RoomViewer | null = null;

void bootstrapWorkEntry();

async function bootstrapWorkEntry(): Promise<void> {
  if (directClientEntry) {
    startSmartOfferApp({
      appEntry: "direct-client",
      project: createOpeningProofProject(),
      session: null,
      repository: null,
    });
    return;
  }

  if (hasDevQaWorkAccess()) {
    const session = createDevQaProjectSession();
    startSmartOfferApp({
      appEntry: "work",
      project: session.project,
      session,
      repository: null,
    });
    return;
  }

  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) throw new Error("Missing #app");

  try {
    const client = createWorkSupabaseClient();
    const access = await resolveWorkAccess(client);

    if (access.status === "authorized") {
      await startAuthorizedWork(
        app,
        client,
        access.workUser.userId,
      );
      return;
    }

    renderWorkLogin({
      mount: app,
      client,
      access,
      onAuthorized: () => {
        void bootstrapWorkEntry();
      },
    });
  } catch (error) {
    renderWorkAuthUnavailable(app, error);
  }
}

async function startAuthorizedWork(
  app: HTMLDivElement,
  client: ReturnType<typeof createWorkSupabaseClient>,
  ownerUserId: string,
): Promise<void> {
  const repository = createSupabaseProjectReadRepository(
    client,
    ownerUserId,
  );

  renderProjectGate(app);

  try {
    const startup = await loadProjectStartup(repository);

    if (startup.kind === "ready") {
      startSmartOfferApp({
        appEntry: "work",
        project: startup.session.project,
        session: startup.session,
        repository,
      });
      return;
    }

    renderProjectGate(
      app,
      startup.kind === "new-project"
        ? "Създайте първия Work проект."
        : "Изберете Work проект.",
    );

    await openProjectsDialog({
      mount: app,
      repository,
      currentSession: null,
      initialProjects:
        startup.kind === "choose-project"
          ? startup.projects
          : [],
      startInCreate: startup.kind === "new-project",
      requireSelection: true,
      onProjectReady: (session) => {
        startSmartOfferApp({
          appEntry: "work",
          project: session.project,
          session,
          repository,
        });
      },
    });
  } catch (error) {
    console.error("Work project bootstrap failed", error);
    renderProjectGateError(app, () => {
      void startAuthorizedWork(app, client, ownerUserId);
    });
  }
}

function hasDevQaWorkAccess(): boolean {
  return (
    import.meta.env.DEV &&
    window.sessionStorage.getItem(DEV_QA_AUTH_KEY) === "1"
  );
}

function createDevQaProjectSession(): ProjectSession {
  const project = createOpeningProofProject("qa-prototype-room-1");

  return createProjectSession({
    id: project.projectId,
    title: "QA прототип",
    status: "draft",
    schemaVersion: 1,
    workVersion: 1,
    updatedAt: "2026-09-24T00:00:00.000Z",
    ownerUserId: "qa-owner",
    createdAt: "2026-09-24T00:00:00.000Z",
    project,
  });
}

type StartSmartOfferAppOptions = {
  appEntry: AppEntry;
  project: ReturnType<typeof createDefaultProject>;
  session: ProjectSession | null;
  repository: ProjectRepository | null;
};

function startSmartOfferApp(
  options: StartSmartOfferAppOptions,
): void {
activeViewer?.dispose();
activeViewer = null;

const project = options.project;
const appEntry = options.appEntry;
let projectSession = options.session;
const projectRepository = options.repository;
let previewMode = appEntry === "direct-client";
let offerInteraction = createInitialOfferInteraction();
let autoCutaway = true;

const appNode = document.querySelector<HTMLDivElement>("#app");
if (!appNode) throw new Error("Missing #app");
const app: HTMLDivElement = appNode;

app.innerHTML = `
  <div class="app-shell${appEntry === "work" && projectSession ? " has-project-bar" : ""}" id="shell">
    <header class="topbar">
      <div class="brand">
        <strong>IVANOV REMONTI · SMART OFFER</strong>
        <span id="brandSubtitle">Vertical Slice v1 · Work / Client Preview</span>
      </div>
      <div class="mode-switch work-only">
        <button id="workModeBtn" class="active">Work Mode</button>
        <button id="previewModeBtn">Preview as Client</button>
      </div>
      <button id="exitPreviewBtn" class="preview-exit">Назад към Work</button>
    </header>

    ${
      appEntry === "work" && projectSession
        ? `
    <div class="project-bar work-only" id="projectBar">
      <div class="project-bar-current">
        <span class="project-bar-label">Текущ проект</span>
        <strong id="projectBarTitle"></strong>
        <span id="projectBarStatus" class="project-bar-status" aria-live="polite"></span>
      </div>
      <div class="project-bar-actions">
        <button id="projectsButton" type="button">Проекти</button>
        <button id="saveProjectButton" type="button">Запази</button>
        <button id="reloadProjectButton" type="button" hidden>Зареди последната версия</button>
      </div>
    </div>
        `
        : ""
    }

    <main class="workspace">
      <aside class="panel left">
        <h2>Работен проект</h2>

        <section class="section">
          <div class="section-title">Размери на стаята</div>
          <div class="dims">
            <label>Ширина, m<input id="widthInput" type="number" min="1" step="0.1"></label>
            <label>Дължина, m<input id="lengthInput" type="number" min="1" step="0.1"></label>
            <label>Височина, m<input id="heightInput" type="number" min="1" step="0.1"></label>
          </div>
        </section>

        <section class="section work-only openings-section">
          <div class="section-title">Отвори</div>
          <div id="openingsEditor"></div>
          <div class="opening-add-actions">
            <button id="addDoorButton" type="button">Добави врата</button>
            <button id="addWindowButton" type="button">Добави прозорец</button>
          </div>
          <p id="openingsStatus" class="opening-status" role="status" aria-live="polite"></p>
        </section>

        <section class="section">
          <div class="section-title">M² схема · същата геометрия</div>
          <div id="m2Schema"></div>
        </section>

        <section class="section">
          <div class="section-title">Фина шпакловка · target</div>
          <div id="wallTargets"></div>
        </section>

        <section class="section">
          <div class="section-title">Quantity source</div>
          <div class="kpi"><span>Правило</span><strong id="finePuttyRuleId"></strong></div>
          <div class="kpi"><span>Цена</span><strong>DEV fixture</strong></div>
          <p style="color:#7688a0;font-size:11px;line-height:1.5;margin:10px 0 0">
            DEV цената е технически fixture, не production Price Book.
          </p>
        </section>
      </aside>

      <section class="viewer-wrap">
        <div id="viewer" class="viewer"></div>

        <div class="viewer-toolbar">
          <button id="resetCameraBtn">Начален изглед</button>
          <button id="autoCutawayBtn" class="active">Авто скриване</button>
          <button id="showAllBtn">Покажи всички</button>
          <button data-wall="room-1.wall-left">Лява</button>
          <button data-wall="room-1.wall-right">Дясна</button>
          <button data-wall="room-1.wall-front">Предна</button>
          <button data-wall="room-1.wall-back">Задна</button>
          <button data-wall="room-1.ceiling">Таван</button>
        </div>

        <div class="viewer-note">
          <span class="viewer-help">Влачи: завъртане · колелце: мащаб · клик: избери повърхност</span>
          <div id="selectionChip"></div>
        </div>
      </section>

      <aside class="panel right">
        <h2>Smart Offer</h2>

        <div id="offerRows"></div>

        <section class="section" id="offerDetailsSection">
          <div class="section-title">Оферта</div>
          <div class="kpi"><span>Количество</span><strong id="quantityKpi">—</strong></div>
          <div class="kpi"><span id="unitPriceLabel">Ед. цена · DEV</span><strong id="unitPriceKpi">—</strong></div>
          <div class="kpi"><span id="totalLabel">Сума · DEV</span><strong id="totalKpi">—</strong></div>
        </section>

        <div class="info-card" id="offerInfoCard">
          <h3><span class="info-glyph" aria-hidden="true">i</span> <span id="infoTitle"></span></h3>
          <b>Какво е</b><p id="infoWhat"></p>
          <b>Защо се прави</b><p id="infoWhy"></p>
          <b>Какво получавате</b><p id="infoResult"></p>
          <b>Какво включва тази позиция</b><p id="infoIncludes"></p>
        </div>

        <button id="showResultBtn" style="width:100%;margin-top:12px">Виж целия резултат</button>
      </aside>
    </main>
  </div>
`;

const viewerHost = mustGet<HTMLElement>("viewer");
const viewer = new RoomViewer({
  container: viewerHost,
  onEntitySelect: (id) => {
    offerInteraction = selectModelEntity(project, id);
    syncViewerFocus();
    renderOffer();
  },
});
activeViewer = viewer;

if (appEntry === "work" && projectSession) {
  syncProjectBar();
}

const widthInput = mustGet<HTMLInputElement>("widthInput");
const lengthInput = mustGet<HTMLInputElement>("lengthInput");
const heightInput = mustGet<HTMLInputElement>("heightInput");

widthInput.value = String(project.room.widthM);
lengthInput.value = String(project.room.lengthM);
heightInput.value = String(project.room.heightM);

for (const input of [widthInput, lengthInput, heightInput]) {
  input.addEventListener("change", updateDimensions);
}

renderOpeningEditor();
renderWallTargets();
renderM2Schema(mustGet("m2Schema"), project);
mustGet("finePuttyRuleId").textContent =
  getFinePuttyAssignment(project).quantityRuleId;
viewer.setProject(project);
syncViewerFocus();
renderOffer();
wireControls();
setPreviewMode(previewMode);

function wireControls(): void {
  mustGet("addDoorButton").addEventListener("click", () => {
    addOpeningFromWork("door");
  });
  mustGet("addWindowButton").addEventListener("click", () => {
    addOpeningFromWork("window");
  });

  mustGet("workModeBtn").addEventListener("click", () => setPreviewMode(false));
  mustGet("previewModeBtn").addEventListener("click", () => setPreviewMode(true));
  mustGet("exitPreviewBtn").addEventListener("click", () => setPreviewMode(false));

  mustGet("resetCameraBtn").addEventListener("click", () => viewer.resetCamera());

  mustGet("autoCutawayBtn").addEventListener("click", () => {
    autoCutaway = !autoCutaway;
    viewer.setAutoCutaway(autoCutaway);
    mustGet("autoCutawayBtn").classList.toggle("active", autoCutaway);
  });

  mustGet("showAllBtn").addEventListener("click", () => {
    viewer.showAll();
    autoCutaway = false;
    mustGet("autoCutawayBtn").classList.remove("active");
    document
      .querySelectorAll<HTMLButtonElement>("[data-wall]")
      .forEach((button) => button.classList.remove("active"));
  });

  document.querySelectorAll<HTMLButtonElement>("[data-wall]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.wall as SurfaceId;
      const nextHidden = !button.classList.contains("active");
      viewer.setManualVisibility(id, !nextHidden);
      button.classList.toggle("active", nextHidden);
    });
  });

  mustGet("offerRows").addEventListener("click", (event) => {
    const target = event.target;
    const button =
      target instanceof Element
        ? (target.closest("button[data-service-id]") as HTMLButtonElement | null)
        : null;
    const serviceId = button?.dataset.serviceId;
    if (!serviceId) return;

    offerInteraction = selectOfferService(serviceId);
    syncViewerFocus();
    renderOffer();
  });

  mustGet("showResultBtn").addEventListener("click", () => {
    offerInteraction = showWholeResult();
    syncViewerFocus();
    renderOffer();
  });
}

function syncProjectBar(): void {
  if (appEntry !== "work" || !projectSession) return;

  renderProjectBar(app, projectSession, {
    persistenceEnabled: projectRepository !== null,
    onProjects: () => {
      void openProjectChooser();
    },
    onSave: () => {
      void saveCurrentProject();
    },
    onReloadLatest: () => {
      void reloadLatestProject();
    },
  });
}

async function openProjectChooser(): Promise<void> {
  if (!projectRepository || !projectSession) return;

  await openProjectsDialog({
    mount: app,
    repository: projectRepository,
    currentSession: projectSession,
    requireSelection: false,
    beforeProjectChange: confirmDiscardIfNeeded,
    onProjectReady: (nextSession) => {
      startSmartOfferApp({
        appEntry: "work",
        project: nextSession.project,
        session: nextSession,
        repository: projectRepository,
      });
    },
  });
}

async function confirmDiscardIfNeeded(): Promise<boolean> {
  if (
    !projectSession ||
    !shouldWarnBeforeProjectSwitch(projectSession)
  ) {
    return true;
  }

  return confirmDiscardUnsavedChanges(app);
}

function markCurrentProjectDirty(): void {
  if (appEntry !== "work" || !projectSession) return;

  projectSession = markProjectDirty(projectSession);
  syncProjectBar();
}

async function saveCurrentProject(): Promise<void> {
  if (!projectRepository || !projectSession) return;

  let saveStarted = false;

  try {
    const begun = beginProjectSave(projectSession);
    projectSession = begun.session;
    saveStarted = true;
    syncProjectBar();

    const result = await projectRepository.save(begun.input);
    projectSession = applyProjectSaveSuccess(projectSession, result);
  } catch (error) {
    if (
      saveStarted &&
      projectSession &&
      projectSession.saveState === "saving"
    ) {
      projectSession = applyProjectSaveFailure(projectSession, error);
    } else {
      console.error("Project save could not start", error);
    }
  }

  syncProjectBar();
}

async function reloadLatestProject(): Promise<void> {
  if (!projectRepository || !projectSession) return;

  const confirmed = await confirmDiscardUnsavedChanges(app);
  if (!confirmed) return;

  try {
    const opened = await projectRepository.open(
      projectSession.projectId,
    );
    const nextSession = createProjectSession(opened);

    startSmartOfferApp({
      appEntry: "work",
      project: nextSession.project,
      session: nextSession,
      repository: projectRepository,
    });
  } catch (error) {
    console.error("Reload latest project failed", error);
    projectSession = {
      ...projectSession,
      lastError: "Reload latest project failed.",
    };
    syncProjectBar();
  }
}

function setPreviewMode(enabled: boolean): void {
  if (!enabled && !currentCapabilities().canReturnToWork) return;

  previewMode = enabled;
  mustGet("shell").classList.toggle("preview-mode", previewMode);
  mustGet("shell").classList.toggle("direct-client-entry", directClientEntry);
  mustGet("workModeBtn").classList.toggle("active", !previewMode);
  mustGet("previewModeBtn").classList.toggle("active", previewMode);
  mustGet("brandSubtitle").textContent = previewMode
    ? "Интерактивна оферта"
    : "Vertical Slice v1 · Work / Client Preview";
  renderOffer();
  requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
}

function updateDimensions(): void {
  if (!currentCapabilities().canAuthorProject) {
    widthInput.value = String(project.room.widthM);
    lengthInput.value = String(project.room.lengthM);
    heightInput.value = String(project.room.heightM);
    return;
  }

  const width = safeDimension(widthInput.value, project.room.widthM);
  const length = safeDimension(lengthInput.value, project.room.lengthM);
  const height = safeDimension(heightInput.value, project.room.heightM);

  const changed =
    width !== project.room.widthM ||
    length !== project.room.lengthM ||
    height !== project.room.heightM;

  const openingError = validateRoomResize(project, {
    widthM: width,
    lengthM: length,
    heightM: height,
  });
  if (openingError) {
    setOpeningStatus(openingError, "error");
    widthInput.value = String(project.room.widthM);
    lengthInput.value = String(project.room.lengthM);
    heightInput.value = String(project.room.heightM);
    return;
  }

  project.room.widthM = width;
  project.room.lengthM = length;
  project.room.heightM = height;
  setOpeningStatus("", "idle");

  widthInput.value = String(width);
  lengthInput.value = String(length);
  heightInput.value = String(height);

  if (changed) {
    markCurrentProjectDirty();
  }

  renderOpeningEditor();
  renderM2Schema(mustGet("m2Schema"), project);
  viewer.setProject(project);
  syncViewerFocus();
  renderOffer();
}

function renderOpeningEditor(): void {
  const host = mustGet("openingsEditor");
  host.replaceChildren();

  if (!project.room.openings.length) {
    const empty = document.createElement("p");
    empty.className = "opening-empty";
    empty.textContent = "Няма добавени врати или прозорци.";
    host.append(empty);
    return;
  }

  project.room.openings.forEach((opening) => {
    const card = document.createElement("div");
    card.className = "opening-card";
    card.dataset.openingId = opening.id;

    const head = document.createElement("div");
    head.className = "opening-card-head";

    const title = document.createElement("strong");
    title.textContent =
      opening.kind === "door"
        ? `Врата ${openingOrdinal(opening, "door")}`
        : `Прозорец ${openingOrdinal(opening, "window")}`;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "opening-remove";
    removeButton.textContent = "Премахни";
    removeButton.addEventListener("click", () => {
      if (!currentCapabilities().canAuthorProject) return;
      applyOpeningMutation(removeOpening(project, opening.id));
    });

    head.append(title, removeButton);
    card.append(head);

    const grid = document.createElement("div");
    grid.className = "opening-fields";

    const wallSelect = document.createElement("select");
    wallSelect.dataset.openingId = opening.id;
    wallSelect.dataset.openingField = "hostSurfaceId";
    for (const wallId of wallIds) {
      const option = document.createElement("option");
      option.value = wallId;
      option.textContent = openingWallLabels[wallId];
      option.selected = wallId === opening.hostSurfaceId;
      wallSelect.append(option);
    }
    wallSelect.addEventListener("change", () => {
      if (!currentCapabilities().canAuthorProject) {
        renderOpeningEditor();
        return;
      }
      applyOpeningMutation(
        updateOpening(project, opening.id, {
          hostSurfaceId: wallSelect.value as WallId,
        }),
      );
    });
    grid.append(openingField("Стена", wallSelect));

    grid.append(
      openingNumberField(opening, "widthM", "Ширина, m", opening.widthM),
      openingNumberField(opening, "heightM", "Височина, m", opening.heightM),
      openingNumberField(opening, "offsetM", "Позиция, m", opening.offsetM),
    );

    if (opening.kind === "window") {
      grid.append(
        openingNumberField(
          opening,
          "sillM",
          "От пода, m",
          opening.sillM ?? 0,
        ),
      );
    }

    card.append(grid);
    host.append(card);
  });
}

function openingOrdinal(
  opening: Opening,
  kind: Opening["kind"],
): number {
  return (
    project.room.openings
      .filter((item) => item.kind === kind)
      .findIndex((item) => item.id === opening.id) + 1
  );
}

function openingField(
  labelText: string,
  control: HTMLElement,
): HTMLLabelElement {
  const label = document.createElement("label");
  const text = document.createElement("span");
  text.textContent = labelText;
  label.append(text, control);
  return label;
}

function openingNumberField(
  opening: Opening,
  field: "widthM" | "heightM" | "offsetM" | "sillM",
  labelText: string,
  value: number,
): HTMLLabelElement {
  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.step = "0.05";
  input.value = String(value);
  input.dataset.openingId = opening.id;
  input.dataset.openingField = field;

  input.addEventListener("change", () => {
    if (!currentCapabilities().canAuthorProject) {
      renderOpeningEditor();
      return;
    }

    const nextValue = Number.parseFloat(input.value);
    applyOpeningMutation(
      updateOpening(project, opening.id, {
        [field]: nextValue,
      }),
    );
  });

  return openingField(labelText, input);
}

function addOpeningFromWork(kind: Opening["kind"]): void {
  if (!currentCapabilities().canAuthorProject) return;

  const id = `room-1.${kind}-${crypto.randomUUID()}`;
  applyOpeningMutation(addOpening(project, kind, id));
}

function applyOpeningMutation(result: OpeningMutationResult): void {
  if (!result.ok) {
    setOpeningStatus(result.message, "error");
    renderOpeningEditor();
    return;
  }

  project.room.openings = result.openings;
  markCurrentProjectDirty();
  setOpeningStatus("", "idle");
  renderOpeningEditor();
  renderM2Schema(mustGet("m2Schema"), project);
  viewer.setProject(project);
  syncViewerFocus();
  renderOffer();
}

function setOpeningStatus(
  message: string,
  state: "idle" | "error",
): void {
  const status = mustGet("openingsStatus");
  status.textContent = message;
  status.dataset.state = state;
}

function renderWallTargets(): void {
  const targetHost = mustGet("wallTargets");
  targetHost.replaceChildren();

  const labelById: Record<WallId, string> = {
    "room-1.wall-front": "Предна стена",
    "room-1.wall-back": "Задна стена",
    "room-1.wall-left": "Лява стена",
    "room-1.wall-right": "Дясна стена",
  };

  wallIds.forEach((id) => {
    const row = document.createElement("label");
    row.className = "check-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = getFinePuttyAssignment(project).targetEntityIds.includes(id);
    checkbox.addEventListener("change", () => {
      if (!currentCapabilities().canAuthorProject) {
        checkbox.checked = getFinePuttyAssignment(project).targetEntityIds.includes(id);
        return;
      }

      const previousTargets =
        getFinePuttyAssignment(project).targetEntityIds;
      const targets = new Set(previousTargets);
      if (checkbox.checked) targets.add(id);
      else targets.delete(id);

      const nextTargets = wallIds.filter((wallId) =>
        targets.has(wallId),
      );
      const changed =
        nextTargets.length !== previousTargets.length ||
        nextTargets.some(
          (wallId, index) => wallId !== previousTargets[index],
        );

      getFinePuttyAssignment(project).targetEntityIds = nextTargets;

      if (changed) {
        markCurrentProjectDirty();
      }

      offerInteraction = selectOfferService(FINE_PUTTY_ASSIGNMENT_ID);
      syncViewerFocus();
      renderOffer();
    });

    const text = document.createElement("span");
    text.textContent = labelById[id];

    row.append(checkbox, text);
    targetHost.append(row);
  });
}

function syncViewerFocus(): void {
  viewer.setHighlightedEntities(getHighlightedEntityIds(project, offerInteraction));
  viewer.setLaminateFloorVisible(
    shouldShowLaminateFloor(project, offerInteraction),
  );

  const chip = mustGet("selectionChip");
  if (offerInteraction.selectedEntity) {
    const label = project.room.surfaces.find(
      (surface) => surface.id === offerInteraction.selectedEntity,
    )?.label;
    chip.innerHTML = `<span class="focus-chip">Избрано: ${escapeHtml(
      label ?? offerInteraction.selectedEntity,
    )}</span>`;
    return;
  }

  if (offerInteraction.selectedServiceId) {
    const assignment = project.serviceAssignments.find(
      (item) => item.id === offerInteraction.selectedServiceId,
    );
    if (assignment) {
      chip.innerHTML = `<span class="focus-chip">Фокус: ${escapeHtml(
        assignment.label,
      )}</span>`;
      return;
    }
  }

  chip.replaceChildren();
}

function renderOffer(): void {
  const lines = calculateSupportedOfferLines(project);
  const focusedIds = new Set(
    getFocusedServiceAssignmentIds(project, offerInteraction),
  );
  const rowHost = mustGet("offerRows");
  rowHost.replaceChildren();

  lines.forEach((line) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "offer-row";
    button.dataset.serviceId = line.assignmentId;
    button.classList.toggle("selected", focusedIds.has(line.assignmentId));

    if (line.assignmentId === FINE_PUTTY_ASSIGNMENT_ID) {
      button.id = "serviceRow";
    } else if (line.assignmentId === "assignment-laminate-flooring-1") {
      button.id = "serviceRowLaminate";
    }

    const title = document.createElement("strong");
    title.append(document.createTextNode(`${line.label} `));
    const infoGlyph = document.createElement("span");
    infoGlyph.className = "info-glyph";
    infoGlyph.setAttribute("aria-label", "Информация");
    infoGlyph.textContent = "i";
    title.append(infoGlyph);

    const meta = document.createElement("div");
    meta.className = "offer-meta";

    const quantity = document.createElement("span");
    quantity.textContent = `${formatNumber(line.quantity.value)} m²`;
    const total = document.createElement("span");
    total.className = "offer-total";
    total.textContent = previewMode
      ? `${formatMoney(line.totalEur)} € · ТЕСТОВА ЦЕНА`
      : `${formatMoney(line.totalEur)} € DEV`;

    if (line.assignmentId === FINE_PUTTY_ASSIGNMENT_ID) {
      quantity.id = "quantityText";
      total.id = "lineTotalText";
    } else if (line.assignmentId === "assignment-laminate-flooring-1") {
      quantity.id = "quantityTextLaminate";
      total.id = "lineTotalTextLaminate";
    }

    meta.append(quantity, total);
    button.append(title, meta);
    rowHost.append(button);
  });

  const detailLine = resolveOfferDetailLine(lines);
  const details = mustGet<HTMLElement>("offerDetailsSection");
  const infoCard = mustGet<HTMLElement>("offerInfoCard");

  if (!detailLine) {
    details.hidden = true;
    infoCard.hidden = true;
    return;
  }

  details.hidden = false;
  infoCard.hidden = false;

  mustGet("quantityKpi").textContent =
    `${formatNumber(detailLine.quantity.value)} m²`;
  mustGet("unitPriceLabel").textContent = previewMode
    ? "Ед. цена · тестова"
    : "Ед. цена · DEV";
  mustGet("totalLabel").textContent = previewMode
    ? "Сума · тестова"
    : "Сума · DEV";
  mustGet("unitPriceKpi").textContent =
    `${formatMoney(detailLine.price.unitPriceEur)} €/m²`;
  mustGet("totalKpi").textContent = `${formatMoney(detailLine.totalEur)} €`;

  mustGet("infoTitle").textContent = detailLine.label;
  mustGet("infoWhat").textContent = detailLine.clientInfo.what;
  mustGet("infoWhy").textContent = detailLine.clientInfo.why;
  mustGet("infoResult").textContent = detailLine.clientInfo.result;
  mustGet("infoIncludes").textContent = detailLine.clientInfo.includes;
}

function resolveOfferDetailLine(
  lines: OfferLineCalculation[],
): OfferLineCalculation | null {
  if (offerInteraction.selectedServiceId) {
    return (
      calculateSupportedOfferLine(
        project,
        offerInteraction.selectedServiceId,
      ) ?? null
    );
  }

  if (offerInteraction.selectedEntity) {
    const focusedIds = getFocusedServiceAssignmentIds(project, offerInteraction);
    if (focusedIds.length !== 1) return null;
    return calculateSupportedOfferLine(project, focusedIds[0]!) ?? null;
  }

  return lines[0] ?? null;
}

function currentCapabilities() {
  return getModeCapabilities(previewMode ? "client" : "work", appEntry);
}

function safeDimension(raw: string, fallback: number): number {
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("bg-BG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("bg-BG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function mustGet<T extends HTMLElement = HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing #${id}`);
  return element as T;
}

}
