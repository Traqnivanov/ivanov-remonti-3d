import type {
  Opening,
  ProjectState,
  Room,
  WallId,
} from "./domain";

export type OpeningKind = Opening["kind"];

export type OpeningMutationResult =
  | { ok: true; openings: Opening[] }
  | { ok: false; message: string };

export const openingWallLabels: Record<WallId, string> = {
  "room-1.wall-front": "Предна стена",
  "room-1.wall-back": "Задна стена",
  "room-1.wall-left": "Лява стена",
  "room-1.wall-right": "Дясна стена",
};

const wallOrder: WallId[] = [
  "room-1.wall-front",
  "room-1.wall-back",
  "room-1.wall-left",
  "room-1.wall-right",
];

export function getRoomWallSpanM(
  room: Pick<Room, "widthM" | "lengthM">,
  wallId: WallId,
): number {
  return wallId === "room-1.wall-front" || wallId === "room-1.wall-back"
    ? room.widthM
    : room.lengthM;
}

export function validateOpeningSet(
  room: Pick<Room, "widthM" | "lengthM" | "heightM">,
  openings: Opening[],
): string | null {
  const ids = new Set<string>();
  const epsilon = 1e-9;

  for (const opening of openings) {
    if (!opening.id.trim()) return "Отворът трябва да има стабилен ID.";
    if (ids.has(opening.id)) return `Повтарящ се ID на отвор: ${opening.id}.`;
    ids.add(opening.id);

    if (!Number.isFinite(opening.widthM) || opening.widthM <= 0) {
      return "Ширината на отвора трябва да е положително число.";
    }
    if (!Number.isFinite(opening.heightM) || opening.heightM <= 0) {
      return "Височината на отвора трябва да е положително число.";
    }
    if (!Number.isFinite(opening.offsetM) || opening.offsetM < 0) {
      return "Позицията на отвора не може да е отрицателна.";
    }

    const sillM = opening.kind === "door" ? 0 : opening.sillM ?? 0;
    if (!Number.isFinite(sillM) || sillM < 0) {
      return "Височината от пода не може да е отрицателна.";
    }

    const wallSpan = getRoomWallSpanM(room, opening.hostSurfaceId);
    if (opening.offsetM + opening.widthM > wallSpan + epsilon) {
      return "Отворът излиза извън ширината на избраната стена.";
    }
    if (sillM + opening.heightM > room.heightM + epsilon) {
      return "Отворът излиза над височината на стаята.";
    }
  }

  for (let i = 0; i < openings.length; i += 1) {
    for (let j = i + 1; j < openings.length; j += 1) {
      const a = openings[i]!;
      const b = openings[j]!;
      if (a.hostSurfaceId !== b.hostSurfaceId) continue;

      const aBottom = a.kind === "door" ? 0 : a.sillM ?? 0;
      const bBottom = b.kind === "door" ? 0 : b.sillM ?? 0;
      const horizontalOverlap =
        a.offsetM < b.offsetM + b.widthM - epsilon &&
        b.offsetM < a.offsetM + a.widthM - epsilon;
      const verticalOverlap =
        aBottom < bBottom + b.heightM - epsilon &&
        bBottom < aBottom + a.heightM - epsilon;

      if (horizontalOverlap && verticalOverlap) {
        return "Два отвора не могат да се застъпват върху една и съща стена.";
      }
    }
  }

  return null;
}

export function addOpening(
  project: ProjectState,
  kind: OpeningKind,
  id: string,
): OpeningMutationResult {
  const widthM = kind === "door" ? 0.9 : 1.2;
  const heightM = kind === "door" ? 2.1 : 1.1;
  const sillM = kind === "window" ? 0.9 : undefined;

  if (heightM + (sillM ?? 0) > project.room.heightM) {
    return {
      ok: false,
      message:
        kind === "door"
          ? "Стаята е твърде ниска за стандартната начална врата."
          : "Стаята е твърде ниска за стандартния начален прозорец.",
    };
  }

  const preferredWalls: WallId[] =
    kind === "door"
      ? wallOrder
      : [
          "room-1.wall-right",
          "room-1.wall-left",
          "room-1.wall-front",
          "room-1.wall-back",
        ];

  for (const hostSurfaceId of preferredWalls) {
    const spanM = getRoomWallSpanM(project.room, hostSurfaceId);
    if (spanM < widthM) continue;

    const maxOffset = spanM - widthM;
    const candidates = [
      Math.min(0.55, maxOffset),
      Math.max(0, maxOffset / 2),
      Math.max(0, maxOffset - 0.3),
    ];

    for (const offsetM of candidates) {
      const opening: Opening = {
        id,
        kind,
        hostSurfaceId,
        widthM,
        heightM,
        offsetM,
        ...(sillM === undefined ? {} : { sillM }),
      };
      const openings = [...project.room.openings, opening];
      if (!validateOpeningSet(project.room, openings)) {
        return { ok: true, openings };
      }
    }
  }

  return {
    ok: false,
    message: "Няма свободно валидно място за този отвор.",
  };
}

export function updateOpening(
  project: ProjectState,
  openingId: string,
  patch: Partial<
    Pick<
      Opening,
      "hostSurfaceId" | "widthM" | "heightM" | "offsetM" | "sillM"
    >
  >,
): OpeningMutationResult {
  const index = project.room.openings.findIndex(
    (opening) => opening.id === openingId,
  );
  if (index < 0) {
    return { ok: false, message: "Отворът вече не съществува." };
  }

  const current = project.room.openings[index]!;
  const next: Opening = {
    ...current,
    ...patch,
    ...(current.kind === "door" ? { sillM: undefined } : {}),
  };
  const openings = project.room.openings.map((opening, openingIndex) =>
    openingIndex === index ? next : opening,
  );
  const error = validateOpeningSet(project.room, openings);

  return error ? { ok: false, message: error } : { ok: true, openings };
}

export function removeOpening(
  project: ProjectState,
  openingId: string,
): OpeningMutationResult {
  const openings = project.room.openings.filter(
    (opening) => opening.id !== openingId,
  );
  return openings.length === project.room.openings.length
    ? { ok: false, message: "Отворът вече не съществува." }
    : { ok: true, openings };
}

export function validateRoomResize(
  project: ProjectState,
  dimensions: Pick<Room, "widthM" | "lengthM" | "heightM">,
): string | null {
  return validateOpeningSet(dimensions, project.room.openings);
}
