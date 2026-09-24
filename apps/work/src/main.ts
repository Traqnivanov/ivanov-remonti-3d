import "./styles.css";
import type { SurfaceId, WallId } from "./domain";
import { createDefaultProject, wallIds } from "./domain";
import type { ProjectRepository } from "./project-repository";
import {
  createProjectSession,
  loadProjectStartup,
  type ProjectSession,
} from "./project-session";
import {
  calculateFinePuttyQuantity,
  calculateLineTotalEur,
  devPriceBookItem,
} from "./calculation";
import { RoomViewer } from "./viewer";
import { renderM2Schema } from "./m2-schema";
import { getModeCapabilities, type AppEntry } from "./capabilities";
import {
  createInitialOfferInteraction,
  getHighlightedEntityIds,
  selectModelEntity,
  selectOfferService,
  showWholeResult,
} from "./smart-offer-interaction";
import { createWorkSupabaseClient } from "./supabase";
import { createSupabaseProjectReadRepository } from "./supabase-project-repository";
import { resolveWorkAccess } from "./work-auth";
import { renderWorkAuthUnavailable, renderWorkLogin } from "./work-login";
import {
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
      project: createDefaultProject(),
      session: null,
      repository: null,
    });
    return;
  }

  if (hasDevQaWorkAccess()) {
    startSmartOfferApp({
      appEntry: "work",
      project: createDefaultProject("qa-prototype-room-1"),
      session: createDevQaProjectSession(),
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
  const project = createDefaultProject("qa-prototype-room-1");

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
const projectSession = options.session;
const projectRepository = options.repository;
let previewMode = appEntry === "direct-client";
let offerInteraction = createInitialOfferInteraction();
let autoCutaway = true;

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Missing #app");

app.innerHTML = `
  <div class="app-shell" id="shell">
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
        <button id="saveProjectButton" class="primary" type="button">Запази</button>
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
          <div class="kpi"><span>Правило</span><strong>wall-area-v1</strong></div>
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

        <button id="serviceRow" class="offer-row selected">
          <strong>Фина шпакловка <span class="info-glyph" aria-label="Информация">i</span></strong>
          <div class="offer-meta">
            <span id="quantityText">—</span>
            <span id="lineTotalText" class="offer-total">—</span>
          </div>
        </button>

        <section class="section">
          <div class="section-title">Оферта</div>
          <div class="kpi"><span>Количество</span><strong id="quantityKpi">—</strong></div>
          <div class="kpi"><span id="unitPriceLabel">Ед. цена · DEV</span><strong id="unitPriceKpi">—</strong></div>
          <div class="kpi"><span id="totalLabel">Сума · DEV</span><strong id="totalKpi">—</strong></div>
        </section>

        <div class="info-card">
          <h3><span class="info-glyph" aria-hidden="true">i</span> Фина шпакловка</h3>
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
  renderProjectBar(app, projectSession, {
    projectsEnabled: projectRepository !== null,
    onProjects: () => {
      if (!projectRepository) return;

      void openProjectsDialog({
        mount: app,
        repository: projectRepository,
        currentSession: projectSession,
        requireSelection: false,
        onProjectReady: (nextSession) => {
          startSmartOfferApp({
            appEntry: "work",
            project: nextSession.project,
            session: nextSession,
            repository: projectRepository,
          });
        },
      });
    },
  });
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

renderWallTargets();
renderM2Schema(mustGet("m2Schema"), project);
viewer.setProject(project);
syncViewerFocus();
renderOffer();
wireControls();
setPreviewMode(previewMode);

function wireControls(): void {
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

  mustGet("serviceRow").addEventListener("click", () => {
    offerInteraction = selectOfferService();
    syncViewerFocus();
    renderOffer();
  });

  mustGet("showResultBtn").addEventListener("click", () => {
    offerInteraction = showWholeResult();
    syncViewerFocus();
    renderOffer();
  });
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

  project.room.widthM = width;
  project.room.lengthM = length;
  project.room.heightM = height;

  widthInput.value = String(width);
  lengthInput.value = String(length);
  heightInput.value = String(height);

  renderM2Schema(mustGet("m2Schema"), project);
  viewer.setProject(project);
  syncViewerFocus();
  renderOffer();
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
    checkbox.checked = project.serviceAssignment.targetEntityIds.includes(id);
    checkbox.addEventListener("change", () => {
      if (!currentCapabilities().canAuthorProject) {
        checkbox.checked = project.serviceAssignment.targetEntityIds.includes(id);
        return;
      }

      const targets = new Set(project.serviceAssignment.targetEntityIds);
      if (checkbox.checked) targets.add(id);
      else targets.delete(id);
      project.serviceAssignment.targetEntityIds = wallIds.filter((wallId) => targets.has(wallId));
      offerInteraction = selectOfferService();
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

  const chip = mustGet("selectionChip");
  if (offerInteraction.selectedEntity) {
    const label = project.room.surfaces.find(
      (surface) => surface.id === offerInteraction.selectedEntity,
    )?.label;
    chip.innerHTML = `<span class="focus-chip">Избрано: ${escapeHtml(
      label ?? offerInteraction.selectedEntity,
    )}</span>`;
  } else if (offerInteraction.selectedService) {
    chip.innerHTML = '<span class="focus-chip">Фокус: Фина шпакловка</span>';
  } else {
    chip.replaceChildren();
  }
}

function renderOffer(): void {
  const quantity = calculateFinePuttyQuantity(project);
  const total = calculateLineTotalEur(quantity, devPriceBookItem);

  mustGet("quantityText").textContent = `${formatNumber(quantity.value)} m²`;
  mustGet("lineTotalText").textContent = previewMode
    ? `${formatMoney(total)} € · ТЕСТОВА ЦЕНА`
    : `${formatMoney(total)} € DEV`;
  mustGet("quantityKpi").textContent = `${formatNumber(quantity.value)} m²`;
  mustGet("unitPriceLabel").textContent = previewMode ? "Ед. цена · тестова" : "Ед. цена · DEV";
  mustGet("totalLabel").textContent = previewMode ? "Сума · тестова" : "Сума · DEV";
  mustGet("unitPriceKpi").textContent = `${formatMoney(devPriceBookItem.unitPriceEur)} €/m²`;
  mustGet("totalKpi").textContent = `${formatMoney(total)} €`;

  const row = mustGet("serviceRow");
  row.classList.toggle("selected", offerInteraction.selectedService);

  const info = project.serviceAssignment.clientInfo;
  mustGet("infoWhat").textContent = info.what;
  mustGet("infoWhy").textContent = info.why;
  mustGet("infoResult").textContent = info.result;
  mustGet("infoIncludes").textContent = info.includes;
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
