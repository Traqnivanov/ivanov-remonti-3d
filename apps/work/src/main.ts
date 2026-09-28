import "./styles.css";
import type { Opening, ProjectState, SurfaceId, WallId } from "./domain";
import {
  createDefaultProject,
  createFinePuttyCeilingAssignment,
  createOpeningProofProject,
  findFinePuttyCeilingAssignment,
  getFinePuttyAssignment,
  wallIds,
  FINE_PUTTY_CEILING_ASSIGNMENT_ID,
} from "./domain";
import type { ProjectRepository } from "./project-repository";
import {
  applyProjectHistoryEdit,
  applyProjectSaveFailure,
  applyProjectSaveSuccess,
  beginProjectSave,
  createProjectSession,
  loadProjectStartup,
  shouldWarnBeforeProjectSwitch,
  type ProjectSession,
} from "./project-session";
import {
  canRedoProject,
  canUndoProject,
  commitProjectState,
  createProjectHistory,
  getCurrentProjectRevision,
  getCurrentProjectState,
  isCurrentProjectSaved,
  markProjectHistoryRevisionSaved,
  redoProjectState,
  undoProjectState,
} from "./project-history";
import {
  calculateDynamicOfferLine,
  calculateDynamicOfferSummary,
  setAssignmentUnitPriceEur,
  type DynamicOfferLineCalculation,
  type QuantityUnit,
} from "./calculation";
import { RoomViewer } from "./viewer";
import { renderM2Schema } from "./m2-schema";
import { summarizeRoomGeometry } from "./geometry";
import { getModeCapabilities, type AppEntry } from "./capabilities";
import {
  FINE_PUTTY_ASSIGNMENT_ID,
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
import {
  addOperationAssignment,
  addOperationCeilingAssignment,
  addOperationScopeAssignments,
  findOperationAssignment,
  findOperationCeilingAssignment,
  gypsumPuttyOperation,
  paintOperation,
  primerOperation,
  sandingOperation,
  setOperationTargets,
  setServiceAssignmentIncluded,
} from "./operation-authoring";
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
const authorableWallOperations = [
  gypsumPuttyOperation,
  sandingOperation,
  primerOperation,
  paintOperation,
];

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

export function startSmartOfferApp(
  options: StartSmartOfferAppOptions,
): void {
activeViewer?.dispose();
activeViewer = null;

let projectHistory = createProjectHistory(options.project);
let project = getCurrentProjectState(projectHistory);
const appEntry = options.appEntry;
let projectSession = options.session
  ? { ...options.session, project }
  : null;
const projectRepository = options.repository;
let previewMode = appEntry === "direct-client";
const initialIncludedService = project.serviceAssignments.find(
  (assignment) => assignment.included,
);
let offerInteraction = initialIncludedService
  ? selectOfferService(initialIncludedService.id)
  : showWholeResult();
let expandedOperationId: string | null = null;
let expandedOpeningId: string | null = null;
const desktopWorkbenchMedia = window.matchMedia("(min-width: 981px)");
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
        <button id="undoProjectButton" type="button" title="Отмени последната промяна">Отмени</button>
        <button id="redoProjectButton" type="button" title="Повтори отменената промяна">Повтори</button>
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

        <section class="section left-work-section room-section">
          <div class="section-title">Размери на стаята</div>
          <div class="dims">
            <label>Ширина, m<input id="widthInput" type="number" min="1" step="0.1"></label>
            <label>Дължина, m<input id="lengthInput" type="number" min="1" step="0.1"></label>
            <label>Височина, m<input id="heightInput" type="number" min="1" step="0.1"></label>
          </div>
        </section>

        <section class="section work-only openings-section left-work-section">
          <div class="left-section-head">
            <div class="section-title">Отвори</div>
            <span id="openingsCount" class="left-section-meta"></span>
          </div>
          <div id="openingsEditor"></div>
          <div class="opening-add-actions">
            <button id="addDoorButton" type="button">Добави врата</button>
            <button id="addWindowButton" type="button">Добави прозорец</button>
          </div>
          <p id="openingsStatus" class="opening-status" role="status" aria-live="polite"></p>
        </section>

        <details id="m2SchemeDetails" class="section m2-scheme-details left-work-section">
          <summary class="m2-scheme-summary">
            <span>М² схема</span>
            <span id="m2SchemaCompactSummary" class="left-section-meta"></span>
          </summary>
          <div class="m2-scheme-body">
            <div class="section-title">Същата геометрия</div>
            <div id="m2Schema"></div>
          </div>
        </details>

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
        <h2 class="workbench-zone-title work-only">Работа и оферта</h2>

        <div class="workbench-services work-only">
          <section class="section">
            <div class="section-title">Услуги за изпълнение</div>
            <div id="serviceScopeControls" class="service-scope-list"></div>
            <p class="service-scope-help">Само избраните услуги влизат в офертата и участват в общата сума.</p>
          </section>

          <section class="section" id="finePuttyTargetsSection">
            <div class="section-title">Фина шпакловка · обхват</div>
            <div id="wallTargets"></div>
          </section>

          <section class="section" id="operationSettingsSection">
            <div class="section-title">Настройки на услуга</div>
            <div id="operationAuthoring"></div>
            <p id="operationStatus" class="opening-status" role="status" aria-live="polite"></p>
          </section>
        </div>

        <h2 class="smart-offer-heading">Smart Offer</h2>
        <div id="offerRows"></div>

        <section class="offer-summary" id="offerSummarySection">
          <div class="offer-summary-row">
            <span>Общо</span>
            <strong id="offerTotalKpi">—</strong>
          </div>
          <p id="offerTotalStatus"></p>
        </section>

        <section class="section" id="offerDetailsSection">
          <div class="section-title">Оферта</div>
          <div class="kpi"><span>Количество</span><strong id="quantityKpi">—</strong></div>
          <div class="kpi price-kpi">
            <span id="unitPriceLabel">Ед. цена</span>
            <label class="price-input-wrap work-only" id="unitPriceWorkControl">
              <input
                id="unitPriceInput"
                type="text"
                inputmode="decimal"
                placeholder="Въведи цена"
                aria-label="Единична цена в евро"
              />
              <span id="unitPriceSuffix">€/m²</span>
            </label>
            <strong id="unitPriceKpi" class="client-price-value">—</strong>
          </div>
          <div class="kpi"><span id="totalLabel">Сума</span><strong id="totalKpi">—</strong></div>
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

mustGet<HTMLDetailsElement>("m2SchemeDetails").open =
  !desktopWorkbenchMedia.matches;

renderOpeningEditor();
renderServiceScopeControls();
renderWallTargets();
renderOperationAuthoring();
renderM2Schema(mustGet("m2Schema"), project);
renderLeftGeometrySummary();
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

  const unitPriceInput = mustGet<HTMLInputElement>("unitPriceInput");
  unitPriceInput.addEventListener("input", () => {
    previewSelectedServicePrice(unitPriceInput.value);
  });
  unitPriceInput.addEventListener("change", () => {
    commitSelectedServicePrice(unitPriceInput);
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
    canUndo: canUndoProject(projectHistory),
    canRedo: canRedoProject(projectHistory),
    onProjects: () => {
      void openProjectChooser();
    },
    onUndo: undoCurrentProject,
    onRedo: redoCurrentProject,
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

function commitCanonicalProject(nextProject: ProjectState): void {
  projectHistory = commitProjectState(projectHistory, nextProject);
  project = getCurrentProjectState(projectHistory);

  if (appEntry === "work" && projectSession) {
    projectSession = applyProjectHistoryEdit(
      projectSession,
      project,
      isCurrentProjectSaved(projectHistory),
    );
  }

  renderCanonicalProjectState();
}

function undoCurrentProject(): void {
  navigateProjectHistory("undo");
}

function redoCurrentProject(): void {
  navigateProjectHistory("redo");
}

function navigateProjectHistory(direction: "undo" | "redo"): void {
  if (!currentCapabilities().canAuthorProject || !projectSession) return;
  if (
    projectSession.saveState === "saving" ||
    projectSession.saveState === "conflict"
  ) {
    return;
  }

  const nextHistory =
    direction === "undo"
      ? undoProjectState(projectHistory)
      : redoProjectState(projectHistory);

  if (nextHistory === projectHistory) return;

  projectHistory = nextHistory;
  project = getCurrentProjectState(projectHistory);
  projectSession = applyProjectHistoryEdit(
    projectSession,
    project,
    isCurrentProjectSaved(projectHistory),
  );
  setOpeningStatus("", "idle");
  renderCanonicalProjectState();
}

function renderCanonicalProjectState(): void {
  widthInput.value = String(project.room.widthM);
  lengthInput.value = String(project.room.lengthM);
  heightInput.value = String(project.room.heightM);
  renderOpeningEditor();
  renderServiceScopeControls();
  renderWallTargets();
  renderOperationAuthoring();
  renderM2Schema(mustGet("m2Schema"), project);
  renderLeftGeometrySummary();
  viewer.setProject(project);
  syncViewerFocus();
  renderOffer();
  syncProjectBar();
}

async function saveCurrentProject(): Promise<void> {
  if (!projectRepository || !projectSession) return;

  let saveStarted = false;
  let savingHistoryRevision: number | null = null;

  try {
    savingHistoryRevision = getCurrentProjectRevision(projectHistory);
    const begun = beginProjectSave(projectSession);
    projectSession = begun.session;
    saveStarted = true;
    syncProjectBar();

    const result = await projectRepository.save(begun.input);
    projectSession = applyProjectSaveSuccess(projectSession, result);
    projectHistory = markProjectHistoryRevisionSaved(
      projectHistory,
      savingHistoryRevision,
    );
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

  if (!changed) {
    widthInput.value = String(project.room.widthM);
    lengthInput.value = String(project.room.lengthM);
    heightInput.value = String(project.room.heightM);
    return;
  }

  const nextProject = getCurrentProjectState(projectHistory);
  nextProject.room.widthM = width;
  nextProject.room.lengthM = length;
  nextProject.room.heightM = height;
  setOpeningStatus("", "idle");
  commitCanonicalProject(nextProject);
}

function renderOpeningEditor(): void {
  const host = mustGet("openingsEditor");
  host.replaceChildren();
  mustGet("openingsCount").textContent =
    project.room.openings.length === 0
      ? "няма"
      : `${project.room.openings.length} ${project.room.openings.length === 1 ? "отвор" : "отвора"}`;

  if (!project.room.openings.length) {
    const empty = document.createElement("p");
    empty.className = "opening-empty";
    empty.textContent = "Няма добавени врати или прозорци.";
    host.append(empty);
    return;
  }

  project.room.openings.forEach((opening) => {
    const card = document.createElement("details");
    card.className = "opening-card";
    card.dataset.openingId = opening.id;
    card.open =
      !desktopWorkbenchMedia.matches ||
      expandedOpeningId === opening.id;

    card.addEventListener("toggle", () => {
      if (!desktopWorkbenchMedia.matches) return;
      if (card.open) {
        expandedOpeningId = opening.id;
        host
          .querySelectorAll<HTMLDetailsElement>(".opening-card[open]")
          .forEach((other) => {
            if (other !== card) other.open = false;
          });
      } else if (expandedOpeningId === opening.id) {
        expandedOpeningId = null;
      }
    });

    const summary = document.createElement("summary");
    summary.className = "opening-card-summary";

    const title = document.createElement("strong");
    title.textContent =
      opening.kind === "door"
        ? `Врата ${openingOrdinal(opening, "door")}`
        : `Прозорец ${openingOrdinal(opening, "window")}`;

    const meta = document.createElement("span");
    meta.className = "opening-card-meta";
    meta.textContent =
      `${openingWallLabels[opening.hostSurfaceId]} · ${formatNumber(opening.widthM)} × ${formatNumber(opening.heightM)} m`;

    summary.append(title, meta);
    card.append(summary);

    const body = document.createElement("div");
    body.className = "opening-card-body";

    const tools = document.createElement("div");
    tools.className = "opening-card-tools";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "opening-remove";
    removeButton.textContent = "Премахни";
    removeButton.addEventListener("click", () => {
      if (!currentCapabilities().canAuthorProject) return;
      if (expandedOpeningId === opening.id) {
        expandedOpeningId = null;
      }
      applyOpeningMutation(removeOpening(project, opening.id));
    });
    tools.append(removeButton);
    body.append(tools);

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
      expandedOpeningId = opening.id;
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

    body.append(grid);
    card.append(body);
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
    expandedOpeningId = opening.id;
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
  expandedOpeningId = id;
  applyOpeningMutation(addOpening(project, kind, id));
}

function applyOpeningMutation(result: OpeningMutationResult): void {
  if (!result.ok) {
    setOpeningStatus(result.message, "error");
    renderOpeningEditor();
    return;
  }

  const nextProject = getCurrentProjectState(projectHistory);
  nextProject.room.openings = result.openings;
  setOpeningStatus("", "idle");
  commitCanonicalProject(nextProject);
}

function renderLeftGeometrySummary(): void {
  const geometry = summarizeRoomGeometry(project);
  mustGet("m2SchemaCompactSummary").textContent =
    `Стени ${formatNumber(geometry.grossWallsM2)} m² · Под/таван ${formatNumber(geometry.floorM2)} m²`;
}

function setOpeningStatus(
  message: string,
  state: "idle" | "error",
): void {
  const status = mustGet("openingsStatus");
  status.textContent = message;
  status.dataset.state = state;
}

function renderServiceScopeControls(): void {
  const host = mustGet("serviceScopeControls");
  host.replaceChildren();

  const services = [
    {
      primaryAssignmentId: FINE_PUTTY_ASSIGNMENT_ID,
      scopeAssignmentIds: [
        FINE_PUTTY_ASSIGNMENT_ID,
        FINE_PUTTY_CEILING_ASSIGNMENT_ID,
      ],
      label: "Фина шпакловка",
      kind: "fine-putty" as const,
      operationDefinition: null,
    },
    {
      primaryAssignmentId: "assignment-laminate-flooring-1",
      scopeAssignmentIds: ["assignment-laminate-flooring-1"],
      label: "Ламинат",
      kind: "single" as const,
      operationDefinition: null,
    },
    ...authorableWallOperations.map((definition) => ({
      primaryAssignmentId: definition.assignmentId,
      scopeAssignmentIds: [
        definition.assignmentId,
        definition.ceilingAssignmentId,
      ],
      label: definition.label,
      kind: "operation" as const,
      operationDefinition: definition,
    })),
  ];

  for (const service of services) {
    const included = service.scopeAssignmentIds.some(
      (assignmentId) =>
        project.serviceAssignments.find((item) => item.id === assignmentId)
          ?.included,
    );

    const toggle = document.createElement("label");
    toggle.className = "service-scope-toggle";
    toggle.classList.toggle("selected", included);
    toggle.dataset.serviceScopeId = service.primaryAssignmentId;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = included;
    checkbox.dataset.serviceInclude = service.primaryAssignmentId;
    checkbox.setAttribute(
      "aria-label",
      `Включи ${service.label} в офертата`,
    );

    const text = document.createElement("span");
    text.textContent = service.label;

    checkbox.addEventListener("change", () => {
      if (!currentCapabilities().canAuthorProject) {
        renderServiceScopeControls();
        return;
      }

      let nextProject = getCurrentProjectState(projectHistory);

      try {
        if (service.kind === "operation" && service.operationDefinition) {
          if (checkbox.checked) {
            nextProject = addOperationScopeAssignments(
              nextProject,
              service.operationDefinition,
            );
          } else {
            for (const assignmentId of service.scopeAssignmentIds) {
              if (
                nextProject.serviceAssignments.some(
                  (item) => item.id === assignmentId,
                )
              ) {
                nextProject = setServiceAssignmentIncluded(
                  nextProject,
                  assignmentId,
                  false,
                );
              }
            }
          }
        } else if (service.kind === "fine-putty") {
          nextProject = setServiceAssignmentIncluded(
            nextProject,
            FINE_PUTTY_ASSIGNMENT_ID,
            checkbox.checked,
          );

          const ceilingAssignment =
            findFinePuttyCeilingAssignment(nextProject);
          if (checkbox.checked && !ceilingAssignment) {
            nextProject = {
              ...nextProject,
              serviceAssignments: [
                ...nextProject.serviceAssignments,
                createFinePuttyCeilingAssignment(true),
              ],
            };
          } else if (ceilingAssignment) {
            nextProject = setServiceAssignmentIncluded(
              nextProject,
              FINE_PUTTY_CEILING_ASSIGNMENT_ID,
              checkbox.checked,
            );
          }
        } else {
          const assignment = nextProject.serviceAssignments.find(
            (item) => item.id === service.primaryAssignmentId,
          );
          if (!assignment) {
            renderServiceScopeControls();
            return;
          }
          nextProject = setServiceAssignmentIncluded(
            nextProject,
            service.primaryAssignmentId,
            checkbox.checked,
          );
        }

        if (checkbox.checked) {
          offerInteraction = selectOfferService(service.primaryAssignmentId);
          if (service.operationDefinition) {
            expandedOperationId = service.operationDefinition.assignmentId;
          }
        } else {
          if (
            offerInteraction.selectedServiceId &&
            service.scopeAssignmentIds.includes(
              offerInteraction.selectedServiceId,
            )
          ) {
            offerInteraction = showWholeResult();
          }
          if (
            service.operationDefinition &&
            expandedOperationId === service.operationDefinition.assignmentId
          ) {
            expandedOperationId = null;
          }
        }

        setOperationStatus("");
        commitCanonicalProject(nextProject);
      } catch (error) {
        setOperationStatus(operationErrorMessage(error), "error");
        renderServiceScopeControls();
      }
    });

    toggle.append(checkbox, text);
    host.append(toggle);
  }
}

function renderWallTargets(): void {
  const targetHost = mustGet("wallTargets");
  targetHost.replaceChildren();

  const finePutty = getFinePuttyAssignment(project);
  const ceilingAssignment = findFinePuttyCeilingAssignment(project);
  const serviceIncluded =
    finePutty.included || Boolean(ceilingAssignment?.included);

  mustGet<HTMLElement>("finePuttyTargetsSection").hidden = !serviceIncluded;
  if (!serviceIncluded) return;

  const labelById: Record<WallId, string> = {
    "room-1.wall-front": "Предна стена",
    "room-1.wall-back": "Задна стена",
    "room-1.wall-left": "Лява стена",
    "room-1.wall-right": "Дясна стена",
  };

  const wallScopeRow = document.createElement("label");
  wallScopeRow.className = "check-row";
  const wallScopeCheckbox = document.createElement("input");
  wallScopeCheckbox.type = "checkbox";
  wallScopeCheckbox.checked = finePutty.included;
  wallScopeCheckbox.dataset.serviceScopeTarget = "fine-putty-walls";
  wallScopeCheckbox.addEventListener("change", () => {
    if (!currentCapabilities().canAuthorProject) {
      renderWallTargets();
      return;
    }

    try {
      const nextProject = setServiceAssignmentIncluded(
        getCurrentProjectState(projectHistory),
        FINE_PUTTY_ASSIGNMENT_ID,
        wallScopeCheckbox.checked,
      );
      offerInteraction = wallScopeCheckbox.checked
        ? selectOfferService(FINE_PUTTY_ASSIGNMENT_ID)
        : findFinePuttyCeilingAssignment(nextProject)?.included
          ? selectOfferService(FINE_PUTTY_CEILING_ASSIGNMENT_ID)
          : showWholeResult();
      commitCanonicalProject(nextProject);
    } catch (error) {
      setOperationStatus(operationErrorMessage(error), "error");
      renderWallTargets();
    }
  });
  const wallScopeText = document.createElement("strong");
  wallScopeText.textContent = "Стени";
  wallScopeRow.append(wallScopeCheckbox, wallScopeText);
  targetHost.append(wallScopeRow);

  if (finePutty.included) {
    wallIds.forEach((id) => {
      const row = document.createElement("label");
      row.className = "check-row";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked =
        getFinePuttyAssignment(project).targetEntityIds.includes(id);
      checkbox.addEventListener("change", () => {
        if (!currentCapabilities().canAuthorProject) {
          checkbox.checked =
            getFinePuttyAssignment(project).targetEntityIds.includes(id);
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

        if (nextTargets.length === 0) {
          checkbox.checked = true;
          setOperationStatus(
            "Остави поне една стена или изключи обхвата „Стени“.",
            "error",
          );
          return;
        }

        offerInteraction = selectOfferService(FINE_PUTTY_ASSIGNMENT_ID);

        if (changed) {
          const nextProject = getCurrentProjectState(projectHistory);
          getFinePuttyAssignment(nextProject).targetEntityIds = nextTargets;
          setOperationStatus("");
          commitCanonicalProject(nextProject);
          return;
        }

        syncViewerFocus();
        renderOffer();
      });

      const text = document.createElement("span");
      text.textContent = labelById[id];

      row.append(checkbox, text);
      targetHost.append(row);
    });
  }

  const ceilingRow = document.createElement("label");
  ceilingRow.className = "check-row";
  const ceilingCheckbox = document.createElement("input");
  ceilingCheckbox.type = "checkbox";
  ceilingCheckbox.checked = Boolean(ceilingAssignment?.included);
  ceilingCheckbox.dataset.serviceScopeTarget = "fine-putty-ceiling";
  ceilingCheckbox.addEventListener("change", () => {
    if (!currentCapabilities().canAuthorProject) {
      renderWallTargets();
      return;
    }

    let nextProject = getCurrentProjectState(projectHistory);
    const currentCeiling = findFinePuttyCeilingAssignment(nextProject);

    if (ceilingCheckbox.checked && !currentCeiling) {
      nextProject = {
        ...nextProject,
        serviceAssignments: [
          ...nextProject.serviceAssignments,
          createFinePuttyCeilingAssignment(true),
        ],
      };
    } else if (currentCeiling) {
      nextProject = setServiceAssignmentIncluded(
        nextProject,
        FINE_PUTTY_CEILING_ASSIGNMENT_ID,
        ceilingCheckbox.checked,
      );
    }

    offerInteraction = ceilingCheckbox.checked
      ? selectOfferService(FINE_PUTTY_CEILING_ASSIGNMENT_ID)
      : getFinePuttyAssignment(nextProject).included
        ? selectOfferService(FINE_PUTTY_ASSIGNMENT_ID)
        : showWholeResult();
    setOperationStatus("");
    commitCanonicalProject(nextProject);
  });
  const ceilingText = document.createElement("strong");
  ceilingText.textContent = "Таван";
  ceilingRow.append(ceilingCheckbox, ceilingText);
  targetHost.append(ceilingRow);
}

function renderOperationAuthoring(): void {
  const host = mustGet("operationAuthoring");
  host.replaceChildren();

  const activeOperations = authorableWallOperations
    .map((definition) => ({
      definition,
      wallAssignment: findOperationAssignment(project, definition),
      ceilingAssignment: findOperationCeilingAssignment(project, definition),
    }))
    .filter(
      (item) =>
        item.wallAssignment?.included || item.ceilingAssignment?.included,
    );

  const settingsSection = mustGet<HTMLElement>("operationSettingsSection");
  if (activeOperations.length === 0) {
    expandedOperationId = null;
    settingsSection.hidden = true;
    return;
  }

  if (
    expandedOperationId &&
    !activeOperations.some(
      (item) => item.definition.assignmentId === expandedOperationId,
    )
  ) {
    expandedOperationId = null;
  }

  settingsSection.hidden = false;

  const labelById: Record<WallId, string> = {
    "room-1.wall-front": "Предна стена",
    "room-1.wall-back": "Задна стена",
    "room-1.wall-left": "Лява стена",
    "room-1.wall-right": "Дясна стена",
  };

  for (const {
    definition,
    wallAssignment,
    ceilingAssignment,
  } of activeOperations) {
    const displayAssignment = wallAssignment ?? ceilingAssignment;
    if (!displayAssignment) continue;

    const card = document.createElement("div");
    card.className = "operation-card";

    const summaryButton = document.createElement("button");
    summaryButton.type = "button";
    summaryButton.className = "operation-summary";
    summaryButton.dataset.operationSummary = definition.assignmentId;
    if (definition.assignmentId === gypsumPuttyOperation.assignmentId) {
      summaryButton.id = "gypsumPuttySummaryButton";
    } else {
      summaryButton.id = `operationSummary-${definition.serviceCode}`;
    }

    const expanded = expandedOperationId === definition.assignmentId;
    summaryButton.setAttribute("aria-expanded", String(expanded));

    const summaryText = document.createElement("span");
    summaryText.className = "operation-summary-text";

    const title = document.createElement("strong");
    title.textContent = displayAssignment.label;

    const summaryMeta = document.createElement("span");
    summaryMeta.className = "operation-summary-meta";
    const wallCount = wallAssignment?.included
      ? wallAssignment.targetEntityIds.filter((id) =>
          wallIds.includes(id as WallId),
        ).length
      : 0;
    const hasCeiling = Boolean(ceilingAssignment?.included);
    summaryMeta.textContent =
      wallCount > 0 && hasCeiling
        ? `${wallCount} ${wallCount === 1 ? "стена" : "стени"} + таван`
        : wallCount > 0
          ? `${wallCount} ${wallCount === 1 ? "стена" : "стени"}`
          : "Таван";

    summaryText.append(title, summaryMeta);

    const chevron = document.createElement("span");
    chevron.className = "operation-chevron";
    chevron.setAttribute("aria-hidden", "true");
    chevron.textContent = expanded ? "▴" : "▾";

    summaryButton.append(summaryText, chevron);
    summaryButton.addEventListener("click", () => {
      expandedOperationId = expanded ? null : definition.assignmentId;
      offerInteraction = wallAssignment?.included
        ? selectOfferService(definition.assignmentId)
        : selectOfferService(definition.ceilingAssignmentId);
      renderOperationAuthoring();
      syncViewerFocus();
      renderOffer();
    });

    card.append(summaryButton);

    if (!expanded) {
      host.append(card);
      continue;
    }

    const editor = document.createElement("div");
    editor.className = "operation-editor";

    const wallScopeRow = document.createElement("label");
    wallScopeRow.className = "check-row";
    const wallScopeCheckbox = document.createElement("input");
    wallScopeCheckbox.type = "checkbox";
    wallScopeCheckbox.checked = Boolean(wallAssignment?.included);
    wallScopeCheckbox.dataset.operationScope = "walls";
    wallScopeCheckbox.dataset.operationId = definition.assignmentId;
    wallScopeCheckbox.addEventListener("change", () => {
      if (!currentCapabilities().canAuthorProject) {
        renderOperationAuthoring();
        return;
      }

      let nextProject = getCurrentProjectState(projectHistory);
      try {
        const currentWall = findOperationAssignment(nextProject, definition);
        if (!currentWall && wallScopeCheckbox.checked) {
          nextProject = addOperationAssignment(nextProject, definition);
        } else if (currentWall) {
          nextProject = setServiceAssignmentIncluded(
            nextProject,
            definition.assignmentId,
            wallScopeCheckbox.checked,
          );
        }
        offerInteraction = wallScopeCheckbox.checked
          ? selectOfferService(definition.assignmentId)
          : findOperationCeilingAssignment(nextProject, definition)?.included
            ? selectOfferService(definition.ceilingAssignmentId)
            : showWholeResult();
        setOperationStatus("");
        commitCanonicalProject(nextProject);
      } catch (error) {
        setOperationStatus(operationErrorMessage(error), "error");
        renderOperationAuthoring();
      }
    });
    const wallScopeText = document.createElement("strong");
    wallScopeText.textContent = "Стени";
    wallScopeRow.append(wallScopeCheckbox, wallScopeText);
    editor.append(wallScopeRow);

    if (wallAssignment?.included) {
      for (const wallId of wallIds) {
        const row = document.createElement("label");
        row.className = "check-row";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.dataset.operationTarget = wallId;
        checkbox.dataset.operationId = definition.assignmentId;
        checkbox.checked = wallAssignment.targetEntityIds.includes(wallId);
        checkbox.addEventListener("change", () => {
          if (!currentCapabilities().canAuthorProject) {
            renderOperationAuthoring();
            return;
          }

          const currentAssignment = findOperationAssignment(
            project,
            definition,
          );
          if (!currentAssignment) return;

          const nextTargets = new Set(currentAssignment.targetEntityIds);
          if (checkbox.checked) nextTargets.add(wallId);
          else nextTargets.delete(wallId);

          try {
            const nextProject = setOperationTargets(
              getCurrentProjectState(projectHistory),
              definition,
              wallIds.filter((id) => nextTargets.has(id)),
            );
            offerInteraction = selectOfferService(definition.assignmentId);
            setOperationStatus("");
            commitCanonicalProject(nextProject);
          } catch (error) {
            setOperationStatus(operationErrorMessage(error), "error");
            renderOperationAuthoring();
          }
        });

        const text = document.createElement("span");
        text.textContent = labelById[wallId];
        row.append(checkbox, text);
        editor.append(row);
      }
    }

    const ceilingScopeRow = document.createElement("label");
    ceilingScopeRow.className = "check-row";
    const ceilingScopeCheckbox = document.createElement("input");
    ceilingScopeCheckbox.type = "checkbox";
    ceilingScopeCheckbox.checked = Boolean(ceilingAssignment?.included);
    ceilingScopeCheckbox.dataset.operationScope = "ceiling";
    ceilingScopeCheckbox.dataset.operationId = definition.assignmentId;
    ceilingScopeCheckbox.addEventListener("change", () => {
      if (!currentCapabilities().canAuthorProject) {
        renderOperationAuthoring();
        return;
      }

      let nextProject = getCurrentProjectState(projectHistory);
      try {
        if (ceilingScopeCheckbox.checked) {
          nextProject = addOperationCeilingAssignment(
            nextProject,
            definition,
            true,
          );
        } else if (
          findOperationCeilingAssignment(nextProject, definition)
        ) {
          nextProject = setServiceAssignmentIncluded(
            nextProject,
            definition.ceilingAssignmentId,
            false,
          );
        }

        offerInteraction = ceilingScopeCheckbox.checked
          ? selectOfferService(definition.ceilingAssignmentId)
          : findOperationAssignment(nextProject, definition)?.included
            ? selectOfferService(definition.assignmentId)
            : showWholeResult();
        setOperationStatus("");
        commitCanonicalProject(nextProject);
      } catch (error) {
        setOperationStatus(operationErrorMessage(error), "error");
        renderOperationAuthoring();
      }
    });
    const ceilingScopeText = document.createElement("strong");
    ceilingScopeText.textContent = "Таван";
    ceilingScopeRow.append(ceilingScopeCheckbox, ceilingScopeText);
    editor.append(ceilingScopeRow);

    const footer = document.createElement("div");
    footer.className = "operation-editor-footer";

    const meta = document.createElement("span");
    meta.className = "operation-meta";
    meta.textContent =
      "Стени: m² нето след отвори · Таван: отделни m² и цена";

    footer.append(meta);
    editor.append(footer);
    card.append(editor);
    host.append(card);
  }
}

function setOperationStatus(
  message: string,
  state: "idle" | "error" = "idle",
): void {
  const status = mustGet("operationStatus");
  status.textContent = message;
  status.dataset.state = state;
}

function operationErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Промяната не можа да се приложи.";
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

function renderOffer(
  sourceProject: ProjectState = project,
  priceInputRaw?: string,
): void {
  const summary = calculateDynamicOfferSummary(sourceProject);
  const lines = summary.lines;
  const focusedIds = new Set(
    getFocusedServiceAssignmentIds(sourceProject, offerInteraction),
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
    const lineAssignment = sourceProject.serviceAssignments.find(
      (assignment) => assignment.id === line.assignmentId,
    );
    const scopeLabel =
      lineAssignment?.quantityRuleId === "ceiling-area-v1"
        ? "Таван"
        : lineAssignment?.quantityRuleId === "wall-net-area-openings-v1"
          ? "Стени"
          : lineAssignment?.quantityRuleId === "floor-area-v1"
            ? "Под"
            : null;
    title.append(
      document.createTextNode(
        `${line.label}${scopeLabel ? ` · ${scopeLabel}` : ""} `,
      ),
    );
    const infoGlyph = document.createElement("span");
    infoGlyph.className = "info-glyph";
    infoGlyph.setAttribute("aria-label", "Информация");
    infoGlyph.textContent = "i";
    title.append(infoGlyph);

    const meta = document.createElement("div");
    meta.className = "offer-meta";

    const quantity = document.createElement("span");
    quantity.textContent =
      `${formatNumber(line.quantity.value)} ${formatQuantityUnit(line.quantity.unit)}`;

    const total = document.createElement("span");
    total.className = "offer-total";
    total.classList.toggle("missing-price", line.priceStatus === "missing");
    total.textContent =
      line.priceStatus === "missing" || line.totalEur === null
        ? "Цена не е въведена"
        : `${formatMoney(line.totalEur)} €`;

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

  renderOfferSummary(summary);

  const detailLine = resolveDynamicOfferDetailLine(sourceProject, lines);
  const details = mustGet<HTMLElement>("offerDetailsSection");
  const infoCard = mustGet<HTMLElement>("offerInfoCard");

  if (!detailLine) {
    details.hidden = true;
    infoCard.hidden = true;
    return;
  }

  details.hidden = false;
  infoCard.hidden = false;

  const unitLabel = formatQuantityUnit(detailLine.quantity.unit);
  mustGet("quantityKpi").textContent =
    `${formatNumber(detailLine.quantity.value)} ${unitLabel}`;
  mustGet("unitPriceLabel").textContent = "Ед. цена";
  mustGet("totalLabel").textContent = "Сума";
  mustGet("unitPriceSuffix").textContent = `€/${unitLabel}`;

  const unitPriceInput = mustGet<HTMLInputElement>("unitPriceInput");
  unitPriceInput.dataset.assignmentId = detailLine.assignmentId;
  unitPriceInput.value =
    priceInputRaw ??
    (detailLine.unitPriceEur === null
      ? ""
      : formatPriceInputValue(detailLine.unitPriceEur));
  unitPriceInput.setCustomValidity("");

  mustGet("unitPriceKpi").textContent =
    detailLine.unitPriceEur === null
      ? "Цена не е въведена"
      : `${formatMoney(detailLine.unitPriceEur)} €/${unitLabel}`;
  mustGet("totalKpi").textContent =
    detailLine.totalEur === null
      ? "Цена не е въведена"
      : `${formatMoney(detailLine.totalEur)} €`;

  const detailAssignment = sourceProject.serviceAssignments.find(
    (assignment) => assignment.id === detailLine.assignmentId,
  );
  const detailScopeLabel =
    detailAssignment?.quantityRuleId === "ceiling-area-v1"
      ? "Таван"
      : detailAssignment?.quantityRuleId === "wall-net-area-openings-v1"
        ? "Стени"
        : detailAssignment?.quantityRuleId === "floor-area-v1"
          ? "Под"
          : null;
  mustGet("infoTitle").textContent =
    `${detailLine.label}${detailScopeLabel ? ` · ${detailScopeLabel}` : ""}`;
  mustGet("infoWhat").textContent = detailLine.clientInfo.what;
  mustGet("infoWhy").textContent = detailLine.clientInfo.why;
  mustGet("infoResult").textContent = detailLine.clientInfo.result;
  mustGet("infoIncludes").textContent = detailLine.clientInfo.includes;
}

function renderOfferSummary(
  summary: ReturnType<typeof calculateDynamicOfferSummary>,
): void {
  const total = mustGet("offerTotalKpi");
  const status = mustGet("offerTotalStatus");

  if (summary.lines.length === 0) {
    total.textContent = "—";
    total.dataset.state = "empty";
    status.textContent = "Няма избрани услуги.";
    status.dataset.state = "empty";
    return;
  }

  if (summary.complete) {
    total.textContent = `${formatMoney(summary.pricedSubtotalEur)} €`;
    total.dataset.state = "complete";
    status.textContent = "Всички включени позиции имат цена.";
    status.dataset.state = "complete";
    return;
  }

  const missingCount = summary.missingPriceAssignmentIds.length;
  total.textContent = "Непълна оферта";
  total.dataset.state = "incomplete";
  status.textContent =
    `${missingCount} ${missingCount === 1 ? "позиция е" : "позиции са"} без цена · ` +
    `Въведено до момента: ${formatMoney(summary.pricedSubtotalEur)} €`;
  status.dataset.state = "incomplete";
}

function resolveDynamicOfferDetailLine(
  sourceProject: ProjectState,
  lines: DynamicOfferLineCalculation[],
): DynamicOfferLineCalculation | null {
  if (offerInteraction.selectedServiceId) {
    return (
      calculateDynamicOfferLine(
        sourceProject,
        offerInteraction.selectedServiceId,
      ) ?? null
    );
  }

  if (offerInteraction.selectedEntity) {
    const focusedIds = getFocusedServiceAssignmentIds(
      sourceProject,
      offerInteraction,
    );
    if (focusedIds.length !== 1) return null;
    return calculateDynamicOfferLine(sourceProject, focusedIds[0]!) ?? null;
  }

  return lines[0] ?? null;
}

function previewSelectedServicePrice(raw: string): void {
  if (!currentCapabilities().canAuthorProject) return;

  const assignmentId =
    mustGet<HTMLInputElement>("unitPriceInput").dataset.assignmentId;
  if (!assignmentId) return;

  const parsed = parseUnitPriceInput(raw);
  if (parsed === undefined) return;

  const draftProject = setAssignmentUnitPriceEur(
    project,
    assignmentId,
    parsed,
  );
  renderOffer(draftProject, raw);
}

function commitSelectedServicePrice(input: HTMLInputElement): void {
  if (!currentCapabilities().canAuthorProject) {
    renderOffer();
    return;
  }

  const assignmentId = input.dataset.assignmentId;
  if (!assignmentId) return;

  const parsed = parseUnitPriceInput(input.value);
  if (parsed === undefined) {
    input.setCustomValidity("Въведете валидна цена в евро.");
    input.reportValidity();
    renderOffer();
    return;
  }

  input.setCustomValidity("");
  const nextProject = setAssignmentUnitPriceEur(
    getCurrentProjectState(projectHistory),
    assignmentId,
    parsed,
  );
  commitCanonicalProject(nextProject);
}

function parseUnitPriceInput(raw: string): number | null | undefined {
  const trimmed = raw.trim();
  if (trimmed === "") return null;

  const value = Number(trimmed.replace(",", "."));
  if (!Number.isFinite(value) || value < 0) return undefined;
  return value;
}

function formatQuantityUnit(unit: QuantityUnit): string {
  switch (unit) {
    case "m2":
      return "m²";
    case "lm":
      return "л.м.";
    case "count":
      return "бр.";
    case "point":
      return "точка";
    case "set":
      return "комплект";
    case "fixed":
      return "общо";
  }
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

function formatPriceInputValue(value: number): string {
  return value.toFixed(2).replace(".", ",");
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
