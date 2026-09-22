import type { ProjectState } from "./domain";
import { summarizeRoomGeometry } from "./geometry";

const NS = "http://www.w3.org/2000/svg";

function svgElement<K extends keyof SVGElementTagNameMap>(
  name: K,
  attrs: Record<string, string>,
): SVGElementTagNameMap[K] {
  const element = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

export function renderM2Schema(container: HTMLElement, project: ProjectState): void {
  const geometry = summarizeRoomGeometry(project);
  container.replaceChildren();

  const svg = svgElement("svg", {
    viewBox: "0 0 240 190",
    role: "img",
    "aria-label": "M² схема на помещението",
  });
  svg.classList.add("m2-schema-svg");

  const x = 52;
  const y = 38;
  const width = 136;
  const height = 104;

  svg.append(
    svgElement("rect", {
      x: String(x),
      y: String(y),
      width: String(width),
      height: String(height),
      rx: "4",
      class: "m2-room",
    }),
  );

  const labels = [
    {
      x: 120,
      y: 24,
      anchor: "middle",
      value: `С1 · ${geometry.wallAreasM2["room-1.wall-front"].toFixed(2)} m²`,
    },
    {
      x: 120,
      y: 160,
      anchor: "middle",
      value: `С2 · ${geometry.wallAreasM2["room-1.wall-back"].toFixed(2)} m²`,
    },
    {
      x: 58,
      y: 94,
      anchor: "start",
      value: `С3 · ${geometry.wallAreasM2["room-1.wall-left"].toFixed(2)} m²`,
    },
    {
      x: 182,
      y: 94,
      anchor: "end",
      value: `С4 · ${geometry.wallAreasM2["room-1.wall-right"].toFixed(2)} m²`,
    },
  ];

  labels.forEach((label) => {
    const text = svgElement("text", {
      x: String(label.x),
      y: String(label.y),
      "text-anchor": label.anchor,
      class: "m2-wall-label",
    });
    text.textContent = label.value;
    svg.append(text);
  });

  const topDim = svgElement("text", {
    x: "120",
    y: "50",
    "text-anchor": "middle",
    class: "m2-dimension",
  });
  topDim.textContent = `${geometry.widthM.toFixed(2)} m`;

  const sideDim = svgElement("text", {
    x: "120",
    y: "98",
    "text-anchor": "middle",
    class: "m2-dimension m2-dimension-main",
  });
  sideDim.textContent = `${geometry.widthM.toFixed(2)} × ${geometry.lengthM.toFixed(2)} m`;

  const heightText = svgElement("text", {
    x: "120",
    y: "116",
    "text-anchor": "middle",
    class: "m2-height",
  });
  heightText.textContent = `H ${geometry.heightM.toFixed(2)} m`;

  svg.append(topDim, sideDim, heightText);
  container.append(svg);

  const summary = document.createElement("div");
  summary.className = "m2-summary";
  summary.innerHTML = `
    <span>Стени <strong>${formatNumber(geometry.grossWallsM2)} m²</strong></span>
    <span>Под/таван <strong>${formatNumber(geometry.floorM2)} m²</strong></span>
  `;
  container.append(summary);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("bg-BG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
