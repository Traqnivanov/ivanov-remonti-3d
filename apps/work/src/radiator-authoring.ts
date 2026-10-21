import {
  isWallId,
  wallIds,
  type Opening,
  type ProjectState,
  type Room,
  type SceneObject,
  type SceneObjectId,
  type WallId,
} from "./domain";
import { getSurfaceLocalBounds, validateSceneObjects } from "./scene-object";

export const RADIATOR_KIND = "radiator" as const;

export type RadiatorObject = SceneObject & {
  kind: typeof RADIATOR_KIND;
  placement: SceneObject["placement"] & {
    hostSurfaceId: WallId;
  };
};

export type RadiatorMutationResult =
  | {
      ok: true;
      objects: SceneObject[];
      focusId: SceneObjectId | null;
    }
  | {
      ok: false;
      message: string;
    };

export type RadiatorGeometryPatch = Partial<{
  uM: number;
  vM: number;
  widthM: number;
  heightM: number;
  depthM: number;
}>;

const DEFAULT_WIDTH_M = 1;
const DEFAULT_HEIGHT_M = 0.6;
const DEFAULT_DEPTH_M = 0.12;
const DEFAULT_BOTTOM_GAP_M = 0.12;
const DEFAULT_NORMAL_OFFSET_M = 0.04;
const SEARCH_STEP_M = 0.1;
const EPSILON = 1e-9;

export function isRadiatorObject(object: SceneObject): object is RadiatorObject {
  return object.kind === RADIATOR_KIND && isWallId(object.placement.hostSurfaceId);
}

export function getRadiatorLabel(
  project: Pick<ProjectState, "room">,
  id: SceneObjectId,
): string {
  const radiators = project.room.objects.filter(isRadiatorObject);
  const index = radiators.findIndex((object) => object.id === id);
  return index < 0 ? id : `Радиатор ${index + 1}`;
}

export function addRadiator(project: ProjectState): RadiatorMutationResult {
  const id = nextRadiatorId(project.room);
  const template: RadiatorObject = {
    id,
    kind: RADIATOR_KIND,
    placement: {
      hostSurfaceId: "room-1.wall-front",
      uM: project.room.widthM / 2,
      vM: DEFAULT_BOTTOM_GAP_M + DEFAULT_HEIGHT_M / 2,
      normalOffsetM: DEFAULT_NORMAL_OFFSET_M,
      rotationDeg: 0,
    },
    dimensionsM: {
      widthM: DEFAULT_WIDTH_M,
      heightM: DEFAULT_HEIGHT_M,
      depthM: DEFAULT_DEPTH_M,
    },
    locked: false,
  };

  const placement = findValidPlacement(project, template, wallIds);
  if (!placement) {
    return {
      ok: false,
      message: "Няма свободно валидно място за стандартен радиатор.",
    };
  }

  const object: RadiatorObject = {
    ...template,
    placement,
  };

  return {
    ok: true,
    objects: [...project.room.objects, object],
    focusId: object.id,
  };
}

export function updateRadiatorGeometry(
  project: ProjectState,
  id: SceneObjectId,
  patch: RadiatorGeometryPatch,
): RadiatorMutationResult {
  const current = findRadiator(project, id);
  if (!current) {
    return { ok: false, message: "Радиаторът вече не съществува." };
  }
  if (current.locked) {
    return { ok: false, message: "Радиаторът е заключен за редакция." };
  }

  const next: RadiatorObject = {
    ...current,
    placement: {
      ...current.placement,
      ...(patch.uM === undefined ? {} : { uM: patch.uM }),
      ...(patch.vM === undefined ? {} : { vM: patch.vM }),
      rotationDeg: 0,
    },
    dimensionsM: {
      ...current.dimensionsM,
      ...(patch.widthM === undefined ? {} : { widthM: patch.widthM }),
      ...(patch.heightM === undefined ? {} : { heightM: patch.heightM }),
      ...(patch.depthM === undefined ? {} : { depthM: patch.depthM }),
    },
  };

  return replaceRadiator(project, current.id, next);
}

export function moveRadiatorToWall(
  project: ProjectState,
  id: SceneObjectId,
  hostSurfaceId: WallId,
): RadiatorMutationResult {
  const current = findRadiator(project, id);
  if (!current) {
    return { ok: false, message: "Радиаторът вече не съществува." };
  }
  if (current.locked) {
    return { ok: false, message: "Радиаторът е заключен за редакция." };
  }

  const base: RadiatorObject = {
    ...current,
    placement: {
      ...current.placement,
      hostSurfaceId,
      rotationDeg: 0,
    },
  };
  const placement = findValidPlacement(project, base, [hostSurfaceId], id);
  if (!placement) {
    return {
      ok: false,
      message: "На избраната стена няма свободно валидно място за този радиатор.",
    };
  }

  return replaceRadiator(project, id, {
    ...base,
    placement,
  });
}

export function setRadiatorLocked(
  project: ProjectState,
  id: SceneObjectId,
  locked: boolean,
): RadiatorMutationResult {
  const current = findRadiator(project, id);
  if (!current) {
    return { ok: false, message: "Радиаторът вече не съществува." };
  }

  return replaceRadiator(
    project,
    id,
    {
      ...current,
      locked,
    },
    false,
  );
}

export function duplicateRadiator(
  project: ProjectState,
  id: SceneObjectId,
): RadiatorMutationResult {
  const current = findRadiator(project, id);
  if (!current) {
    return { ok: false, message: "Радиаторът вече не съществува." };
  }

  const duplicate: RadiatorObject = {
    ...current,
    id: nextRadiatorId(project.room),
    placement: { ...current.placement },
    dimensionsM: { ...current.dimensionsM },
    locked: false,
  };

  const preferredWalls: WallId[] = [
    current.placement.hostSurfaceId,
    ...wallIds.filter((wallId) => wallId !== current.placement.hostSurfaceId),
  ];
  const placement = findValidPlacement(
    project,
    duplicate,
    preferredWalls,
    undefined,
    current.placement.uM,
    current.placement.vM,
  );
  if (!placement) {
    return {
      ok: false,
      message: "Няма свободно валидно място за копие на този радиатор.",
    };
  }

  const next = {
    ...duplicate,
    placement,
  };

  return {
    ok: true,
    objects: [...project.room.objects, next],
    focusId: next.id,
  };
}

export function removeRadiator(
  project: ProjectState,
  id: SceneObjectId,
): RadiatorMutationResult {
  const current = findRadiator(project, id);
  if (!current) {
    return { ok: false, message: "Радиаторът вече не съществува." };
  }

  if (
    project.serviceAssignments.some((assignment) =>
      assignment.targetEntityIds.includes(id),
    )
  ) {
    return {
      ok: false,
      message: "Радиаторът е свързан с позиция в офертата и не може да се изтрие.",
    };
  }

  return {
    ok: true,
    objects: project.room.objects.filter((object) => object.id !== id),
    focusId: null,
  };
}

export function validateRadiatorRoomResize(
  project: ProjectState,
  dimensions: Pick<Room, "widthM" | "lengthM" | "heightM">,
): string | null {
  return validateRadiatorSet(
    {
      ...project.room,
      ...dimensions,
    },
    project.room.objects,
  );
}

export function validateRadiatorOpeningOverlaps(
  openings: Opening[],
  objects: SceneObject[],
): string | null {
  for (const radiator of objects.filter(isRadiatorObject)) {
    const radiatorRect = getRadiatorRect(radiator);

    for (const opening of openings) {
      if (opening.hostSurfaceId !== radiator.placement.hostSurfaceId) continue;

      const openingBottom = opening.kind === "door" ? 0 : opening.sillM ?? 0;
      const openingRect = {
        left: opening.offsetM,
        right: opening.offsetM + opening.widthM,
        bottom: openingBottom,
        top: openingBottom + opening.heightM,
      };

      if (rectanglesOverlap(radiatorRect, openingRect)) {
        return "Радиатор не може да се застъпва с врата или прозорец.";
      }
    }
  }

  return null;
}

export function validateRadiatorSet(
  room: Room,
  objects: SceneObject[] = room.objects,
): string | null {
  const candidateRoom: Room = {
    ...room,
    objects,
  };
  const genericError = validateSceneObjects(candidateRoom);
  if (genericError) return describeSceneObjectError(genericError);

  const radiators = objects.filter(isRadiatorObject);
  for (const radiator of radiators) {
    if (!isWallId(radiator.placement.hostSurfaceId)) {
      return "Радиаторът трябва да бъде поставен върху стена.";
    }
    if (Math.abs(radiator.placement.rotationDeg) > EPSILON) {
      return "Завъртане на радиатор не е част от този етап.";
    }
  }

  const openingError = validateRadiatorOpeningOverlaps(room.openings, objects);
  if (openingError) return openingError;

  for (let i = 0; i < radiators.length; i += 1) {
    for (let j = i + 1; j < radiators.length; j += 1) {
      const a = radiators[i]!;
      const b = radiators[j]!;
      if (a.placement.hostSurfaceId !== b.placement.hostSurfaceId) continue;
      if (rectanglesOverlap(getRadiatorRect(a), getRadiatorRect(b))) {
        return "Два радиатора не могат да се застъпват върху една и съща стена.";
      }
    }
  }

  return null;
}

function findRadiator(
  project: ProjectState,
  id: SceneObjectId,
): RadiatorObject | undefined {
  const object = project.room.objects.find((item) => item.id === id);
  return object && isRadiatorObject(object) ? object : undefined;
}

function replaceRadiator(
  project: ProjectState,
  id: SceneObjectId,
  next: RadiatorObject,
  validate = true,
): RadiatorMutationResult {
  const objects = project.room.objects.map((object) =>
    object.id === id ? next : object,
  );
  if (validate) {
    const error = validateRadiatorSet(project.room, objects);
    if (error) return { ok: false, message: error };
  }

  return {
    ok: true,
    objects,
    focusId: id,
  };
}

function nextRadiatorId(room: Room): SceneObjectId {
  let max = 0;
  for (const object of room.objects) {
    const match = object.id.match(
      new RegExp(`^${escapeRegExp(room.id)}\\.object-radiator-(\\d+)$`),
    );
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `${room.id}.object-radiator-${max + 1}`;
}

function findValidPlacement(
  project: ProjectState,
  template: RadiatorObject,
  candidateWalls: WallId[],
  replaceId?: SceneObjectId,
  preferredU?: number,
  preferredV?: number,
): RadiatorObject["placement"] | null {
  for (const hostSurfaceId of candidateWalls) {
    const bounds = getSurfaceLocalBounds(project.room, hostSurfaceId);
    const widthM = template.dimensionsM.widthM;
    const heightM = template.dimensionsM.heightM;
    const minU = widthM / 2;
    const maxU = bounds.uSpanM - widthM / 2;
    const minV = heightM / 2;
    const maxV = bounds.vSpanM - heightM / 2;

    if (maxU < minU - EPSILON || maxV < minV - EPSILON) continue;

    const defaultV = Math.min(
      maxV,
      Math.max(minV, DEFAULT_BOTTOM_GAP_M + heightM / 2),
    );
    const vCandidates = uniqueSortedNumbers([
      ...(preferredV === undefined ? [] : [clamp(preferredV, minV, maxV)]),
      defaultV,
      clamp(project.room.heightM / 2, minV, maxV),
    ]);
    const uCandidates = buildUCandidates(minU, maxU, preferredU);

    for (const vM of vCandidates) {
      for (const uM of uCandidates) {
        const placement: RadiatorObject["placement"] = {
          hostSurfaceId,
          uM,
          vM,
          normalOffsetM: template.placement.normalOffsetM,
          rotationDeg: 0,
        };
        const candidate: RadiatorObject = {
          ...template,
          placement,
        };
        const objects = replaceId
          ? project.room.objects.map((object) =>
              object.id === replaceId ? candidate : object,
            )
          : [...project.room.objects, candidate];

        if (!validateRadiatorSet(project.room, objects)) {
          return placement;
        }
      }
    }
  }

  return null;
}

function buildUCandidates(
  minU: number,
  maxU: number,
  preferredU?: number,
): number[] {
  const center = (minU + maxU) / 2;
  const values = [
    ...(preferredU === undefined ? [] : [clamp(preferredU, minU, maxU)]),
    center,
  ];

  for (
    let value = minU;
    value <= maxU + EPSILON;
    value += SEARCH_STEP_M
  ) {
    values.push(Math.min(maxU, Number(value.toFixed(4))));
  }

  return uniqueSortedNumbers(values, preferredU ?? center);
}

function uniqueSortedNumbers(values: number[], anchor = values[0] ?? 0): number[] {
  return [...new Set(values.map((value) => Number(value.toFixed(4))))].sort(
    (a, b) => Math.abs(a - anchor) - Math.abs(b - anchor) || a - b,
  );
}

function getRadiatorRect(radiator: RadiatorObject) {
  return {
    left: radiator.placement.uM - radiator.dimensionsM.widthM / 2,
    right: radiator.placement.uM + radiator.dimensionsM.widthM / 2,
    bottom: radiator.placement.vM - radiator.dimensionsM.heightM / 2,
    top: radiator.placement.vM + radiator.dimensionsM.heightM / 2,
  };
}

function rectanglesOverlap(
  a: { left: number; right: number; bottom: number; top: number },
  b: { left: number; right: number; bottom: number; top: number },
): boolean {
  return (
    a.left < b.right - EPSILON &&
    b.left < a.right - EPSILON &&
    a.bottom < b.top - EPSILON &&
    b.bottom < a.top - EPSILON
  );
}

function describeSceneObjectError(error: string): string {
  if (error.includes("exceeds its host surface bounds")) {
    return "Радиаторът излиза извън границите на избраната стена.";
  }
  if (error.includes("exceeds the room depth")) {
    return "Радиаторът излиза извън дълбочината на помещението.";
  }
  if (error.includes("dimensions must be positive")) {
    return "Размерите на радиатора трябва да са положителни числа.";
  }
  if (error.includes("placement must use finite")) {
    return "Позицията на радиатора е невалидна.";
  }
  return error;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function escapeRegExp(value: string): string {
  return value.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}
