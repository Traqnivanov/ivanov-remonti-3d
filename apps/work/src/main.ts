import "./styles.css";
import type { SurfaceId, WallId } from "./domain";
import { createDefaultProject, wallIds } from "./domain";
import {
  calculateFinePuttyQuantity,
  calculateLineTotalEur,
  devPriceBookItem,
} from "./calculation";
import { RoomViewer } from "./viewer";

const project = createDefaultProject();
let previewMode = false;
let selectedService = true;
let selectedEntity: SurfaceId | null = null;
let autoCutaway = true;

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Missing #app");

app.innerHTML = `
  <div class="app-shell" id="shell">
    <header class="topbar">
      <div class="brand">
        <strong>IVANOV REMONTI · SMART OFFER</strong>
        <span>Vertical Slice v1 · Work / Client Preview</span>
      </div>
      <div class="mode-switch">
        <button id="workModeBtn" class="active">Work Mode</button>
        <button id="previewModeBtn">Preview as Client</button>
      </div>
    </header>

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
          <button id="resetCameraBtn">Reset camera</button>
          <button id="autoCutawayBtn" class="active">Auto cutaway</button>
          <button id="showAllBtn">Покажи всички</button>
          <button data-wall="room-1.wall-left">Лява</button>
          <button data-wall="room-1.wall-right">Дясна</button>
          <button data-wall="room-1.wall-front">Предна</button>
          <button data-wall="room-1.wall-back">Задна</button>
          <button data-wall="room-1.ceiling">Таван</button>
        </div>

        <div class="viewer-note">
          Drag: завъртане · wheel: zoom · click: избери повърхност
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
          <div class="kpi"><span>Ед. цена · DEV</span><strong id="unitPriceKpi">—</strong></div>
          <div class="kpi"><span>Сума · DEV</span><strong id="totalKpi">—</strong></div>
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
    selectedEntity = id;
    const linked = project.serviceAssignment.targetEntityIds.includes(id as WallId);
    selectedService = linked;
    syncViewerFocus();
    renderOffer();
  },
});

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
viewer.setProject(project);
syncViewerFocus();
renderOffer();
wireControls();

function wireControls(): void {
  mustGet("workModeBtn").addEventListener("click", () => setPreviewMode(false));
  mustGet("previewModeBtn").addEventListener("click", () => setPreviewMode(true));

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
    selectedService = true;
    selectedEntity = null;
    syncViewerFocus();
    renderOffer();
  });

  mustGet("showResultBtn").addEventListener("click", () => {
    selectedService = false;
    selectedEntity = null;
    syncViewerFocus();
    renderOffer();
  });
}

function setPreviewMode(enabled: boolean): void {
  previewMode = enabled;
  mustGet("shell").classList.toggle("preview-mode", previewMode);
  mustGet("workModeBtn").classList.toggle("active", !previewMode);
  mustGet("previewModeBtn").classList.toggle("active", previewMode);
  requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
}

function updateDimensions(): void {
  const width = safeDimension(widthInput.value, project.room.widthM);
  const length = safeDimension(lengthInput.value, project.room.lengthM);
  const height = safeDimension(heightInput.value, project.room.heightM);

  project.room.widthM = width;
  project.room.lengthM = length;
  project.room.heightM = height;

  widthInput.value = String(width);
  lengthInput.value = String(length);
  heightInput.value = String(height);

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
      const targets = new Set(project.serviceAssignment.targetEntityIds);
      if (checkbox.checked) targets.add(id);
      else targets.delete(id);
      project.serviceAssignment.targetEntityIds = wallIds.filter((wallId) => targets.has(wallId));
      selectedService = true;
      selectedEntity = null;
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
  if (selectedEntity) {
    viewer.setHighlightedEntities([selectedEntity]);
  } else if (selectedService) {
    viewer.setHighlightedEntities(project.serviceAssignment.targetEntityIds);
  } else {
    viewer.setHighlightedEntities([]);
  }

  const chip = mustGet("selectionChip");
  if (selectedEntity) {
    chip.innerHTML = `<span class="focus-chip">Избрано: ${escapeHtml(selectedEntity)}</span>`;
  } else if (selectedService) {
    chip.innerHTML = '<span class="focus-chip">Фокус: Фина шпакловка</span>';
  } else {
    chip.replaceChildren();
  }
}

function renderOffer(): void {
  const quantity = calculateFinePuttyQuantity(project);
  const total = calculateLineTotalEur(quantity, devPriceBookItem);

  mustGet("quantityText").textContent = `${formatNumber(quantity.value)} m²`;
  mustGet("lineTotalText").textContent = `${formatMoney(total)} € DEV`;
  mustGet("quantityKpi").textContent = `${formatNumber(quantity.value)} m²`;
  mustGet("unitPriceKpi").textContent = `${formatMoney(devPriceBookItem.unitPriceEur)} €/m²`;
  mustGet("totalKpi").textContent = `${formatMoney(total)} €`;

  const row = mustGet("serviceRow");
  row.classList.toggle("selected", selectedService);

  const info = project.serviceAssignment.clientInfo;
  mustGet("infoWhat").textContent = info.what;
  mustGet("infoWhy").textContent = info.why;
  mustGet("infoResult").textContent = info.result;
  mustGet("infoIncludes").textContent = info.includes;
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
