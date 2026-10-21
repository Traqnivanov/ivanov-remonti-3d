import {
  getFinePuttyAssignment,
  isEntityId,
  isSceneObjectId,
  isSurfaceId,
  isWallId,
  type EntityId,
  type Opening,
  type ProjectState,
  type SceneObject,
  type ServiceAssignment,
  type Surface,
  type SurfaceId,
  type WallId,
} from "./domain";
import { validateRadiatorSet } from "./radiator-authoring";
import { validateSceneObjects } from "./scene-object";

export const CURRENT_PROJECT_SCHEMA_VERSION = 1 as const;

export type PersistedSurfaceV1 = {
  id: string;
  kind: "wall" | "floor" | "ceiling";
  label: string;
};

export type PersistedOpeningV1 = {
  id: string;
  kind: "door" | "window";
  hostSurfaceId: string;
  widthM: number;
  heightM: number;
  offsetM: number;
  sillM?: number;
};

export type PersistedSceneObjectV1 = {
  id: string;
  kind: string;
  placement: {
    hostSurfaceId: string;
    uM: number;
    vM: number;
    normalOffsetM: number;
    rotationDeg: number;
  };
  dimensionsM: {
    widthM: number;
    heightM: number;
    depthM: number;
  };
  locked: boolean;
};

export type PersistedRoomV1 = {
  id: string;
  name: string;
  geometry: {
    widthM: number;
    lengthM: number;
    heightM: number;
  };
  surfaces: PersistedSurfaceV1[];
  openings: PersistedOpeningV1[];
  objects: PersistedSceneObjectV1[];
  materials: unknown[];
};

export type PersistedServiceAssignmentV1 = {
  id: string;
  serviceCode: string;
  label: string;
  targetEntityIds: string[];
  included: boolean;
  quantityRuleId: string;
  priceBookItemId?: string;
  unitPriceEur?: number;
  presentationMode: "highlight" | "material" | "geometry" | "xray" | "object";
  clientInfo?: {
    what: string;
    why: string;
    result: string;
    includes: string;
  };
};

export type PersistedProjectV1 = {
  schemaVersion: 1;
  projectId: string;
  rooms: PersistedRoomV1[];
  serviceAssignments: PersistedServiceAssignmentV1[];
  projectNotes: unknown[];
  presentation: Record<string, unknown>;
};

export class ProjectPersistenceError extends Error {
  constructor(
    public readonly code:
      | "INVALID_STATE"
      | "UNSUPPORTED_SCHEMA_VERSION"
      | "UNSUPPORTED_RUNTIME_SHAPE",
    message: string,
  ) {
    super(message);
    this.name = "ProjectPersistenceError";
  }
}

export function serializeProjectState(project: ProjectState): PersistedProjectV1 {
  const objectError = validateSceneObjects(project.room);
  if (objectError) invalid(objectError);
  const radiatorError = validateRadiatorSet(project.room);
  if (radiatorError) invalid(radiatorError);

  for (const assignment of project.serviceAssignments) {
    const missingTarget = assignment.targetEntityIds.find(
      (id) => !isEntityId(project, id),
    );
    if (missingTarget) {
      invalid(
        `Service assignment ${assignment.id} references missing entity ${missingTarget}.`,
      );
    }
  }

  return {
    schemaVersion: CURRENT_PROJECT_SCHEMA_VERSION,
    projectId: project.projectId,
    rooms: [
      {
        id: project.room.id,
        name: project.room.name,
        geometry: {
          widthM: project.room.widthM,
          lengthM: project.room.lengthM,
          heightM: project.room.heightM,
        },
        surfaces: project.room.surfaces.map((surface) => ({ ...surface })),
        openings: project.room.openings.map((opening) => ({ ...opening })),
        objects: project.room.objects.map((object) => ({
          id: object.id,
          kind: object.kind,
          placement: { ...object.placement },
          dimensionsM: { ...object.dimensionsM },
          locked: object.locked,
        })),
        materials: [],
      },
    ],
    serviceAssignments: project.serviceAssignments.map((assignment) => ({
      id: assignment.id,
      serviceCode: assignment.serviceCode,
      label: assignment.label,
      targetEntityIds: [...assignment.targetEntityIds],
      included: assignment.included,
      quantityRuleId: assignment.quantityRuleId,
      ...(assignment.priceBookItemId
        ? { priceBookItemId: assignment.priceBookItemId }
        : {}),
      ...(assignment.unitPriceEur === undefined
        ? {}
        : { unitPriceEur: assignment.unitPriceEur }),
      presentationMode: assignment.presentationMode,
      ...(assignment.clientInfo
        ? { clientInfo: { ...assignment.clientInfo } }
        : {}),
    })),
    projectNotes: [],
    presentation: {},
  };
}

export function parseAndMigrateProjectState(raw: unknown): PersistedProjectV1 {
  if (!isRecord(raw)) invalid("Project state must be an object.");

  const version = raw.schemaVersion;
  if (!Number.isInteger(version)) invalid("Project schemaVersion must be an integer.");
  if (version !== CURRENT_PROJECT_SCHEMA_VERSION) {
    throw new ProjectPersistenceError(
      "UNSUPPORTED_SCHEMA_VERSION",
      `Unsupported project schema version: ${String(version)}.`,
    );
  }

  return migrateLegacyFinePuttyRule(validateV1(raw));
}

export function deserializeProjectState(raw: unknown): ProjectState {
  const persisted = parseAndMigrateProjectState(raw);

  if (persisted.rooms.length !== 1) {
    unsupported("Current Work runtime supports exactly one room.");
  }

  const room = persisted.rooms[0];
  if (!room) {
    unsupported("Current Work runtime persistence shape is incomplete.");
  }

  if (room.id !== "room-1") unsupported("Current Work runtime expects room-1.");
  if (room.materials.length) {
    unsupported("Current Work runtime does not yet support persisted materials.");
  }

  const surfaces = toRuntimeSurfaces(room.surfaces);
  const openings = toRuntimeOpenings(room.openings);
  const objects = toRuntimeSceneObjects(room.objects);

  const runtimeRoom = {
    id: "room-1" as const,
    name: room.name,
    widthM: room.geometry.widthM,
    lengthM: room.geometry.lengthM,
    heightM: room.geometry.heightM,
    surfaces,
    openings,
    objects,
  };

  const objectError = validateSceneObjects(runtimeRoom);
  if (objectError) invalid(objectError);
  const radiatorError = validateRadiatorSet(runtimeRoom);
  if (radiatorError) invalid(radiatorError);

  const knownEntityIds = new Set<string>([
    ...surfaces.map((surface) => surface.id),
    ...objects.map((object) => object.id),
  ]);
  const serviceAssignments = persisted.serviceAssignments.map((assignment) =>
    toRuntimeServiceAssignment(assignment, knownEntityIds),
  );
  assertUniqueAssignmentIds(serviceAssignments);

  const project: ProjectState = {
    schemaVersion: 1,
    projectId: persisted.projectId,
    room: runtimeRoom,
    serviceAssignments,
  };

  try {
    getFinePuttyAssignment(project);
  } catch {
    unsupported("Current Work runtime requires the canonical Fine Putty assignment.");
  }

  return project;
}

function migrateLegacyFinePuttyRule(
  persisted: PersistedProjectV1,
): PersistedProjectV1 {
  return {
    ...persisted,
    serviceAssignments: persisted.serviceAssignments.map((assignment) =>
      assignment.id === "assignment-fine-putty-1" &&
      assignment.serviceCode === "fine-putty" &&
      assignment.quantityRuleId === "wall-area-v1"
        ? {
            ...assignment,
            quantityRuleId: "wall-net-area-openings-v1",
          }
        : assignment,
    ),
  };
}

function validateV1(raw: Record<string, unknown>): PersistedProjectV1 {
  const projectId = expectNonEmptyString(raw.projectId, "projectId");
  const roomsRaw = expectArray(raw.rooms, "rooms");
  const assignmentsRaw = expectArray(raw.serviceAssignments, "serviceAssignments");
  const notes = expectArray(raw.projectNotes, "projectNotes");
  const presentation = expectRecord(raw.presentation, "presentation");

  return {
    schemaVersion: 1,
    projectId,
    rooms: roomsRaw.map((room, index) => validateRoom(room, index)),
    serviceAssignments: assignmentsRaw.map((assignment, index) =>
      validateAssignment(assignment, index),
    ),
    projectNotes: [...notes],
    presentation: { ...presentation },
  };
}

function validateRoom(raw: unknown, index: number): PersistedRoomV1 {
  const room = expectRecord(raw, `rooms[${index}]`);
  const geometryRaw = expectRecord(room.geometry, `rooms[${index}].geometry`);
  const geometry = {
    widthM: expectPositiveNumber(
      geometryRaw.widthM,
      `rooms[${index}].geometry.widthM`,
    ),
    lengthM: expectPositiveNumber(
      geometryRaw.lengthM,
      `rooms[${index}].geometry.lengthM`,
    ),
    heightM: expectPositiveNumber(
      geometryRaw.heightM,
      `rooms[${index}].geometry.heightM`,
    ),
  };
  const surfaces = expectArray(room.surfaces, `rooms[${index}].surfaces`).map(
    (surface, surfaceIndex) => validateSurface(surface, index, surfaceIndex),
  );
  const openings = expectArray(room.openings, `rooms[${index}].openings`).map(
    (opening, openingIndex) => validateOpening(opening, index, openingIndex),
  );
  const objects = expectArray(room.objects, `rooms[${index}].objects`).map(
    (object, objectIndex) => validateSceneObjectRecord(object, index, objectIndex),
  );

  validateOpeningPlacement(openings, surfaces, geometry, index);

  return {
    id: expectNonEmptyString(room.id, `rooms[${index}].id`),
    name: expectNonEmptyString(room.name, `rooms[${index}].name`),
    geometry,
    surfaces,
    openings,
    objects,
    materials: [...expectArray(room.materials, `rooms[${index}].materials`)],
  };
}

function validateSurface(raw: unknown, roomIndex: number, surfaceIndex: number): PersistedSurfaceV1 {
  const path = `rooms[${roomIndex}].surfaces[${surfaceIndex}]`;
  const surface = expectRecord(raw, path);
  const kind = expectNonEmptyString(surface.kind, `${path}.kind`);
  if (kind !== "wall" && kind !== "floor" && kind !== "ceiling") {
    invalid(`${path}.kind is invalid.`);
  }

  return {
    id: expectNonEmptyString(surface.id, `${path}.id`),
    kind,
    label: expectNonEmptyString(surface.label, `${path}.label`),
  };
}

function validateOpening(
  raw: unknown,
  roomIndex: number,
  openingIndex: number,
): PersistedOpeningV1 {
  const path = `rooms[${roomIndex}].openings[${openingIndex}]`;
  const opening = expectRecord(raw, path);
  const kind = expectNonEmptyString(opening.kind, `${path}.kind`);
  if (kind !== "door" && kind !== "window") {
    invalid(`${path}.kind must be door or window.`);
  }

  const sillM =
    opening.sillM === undefined
      ? undefined
      : expectNonNegativeNumber(opening.sillM, `${path}.sillM`);

  return {
    id: expectNonEmptyString(opening.id, `${path}.id`),
    kind,
    hostSurfaceId: expectNonEmptyString(
      opening.hostSurfaceId,
      `${path}.hostSurfaceId`,
    ),
    widthM: expectPositiveNumber(opening.widthM, `${path}.widthM`),
    heightM: expectPositiveNumber(opening.heightM, `${path}.heightM`),
    offsetM: expectNonNegativeNumber(opening.offsetM, `${path}.offsetM`),
    ...(sillM === undefined ? {} : { sillM }),
  };
}

function validateSceneObjectRecord(
  raw: unknown,
  roomIndex: number,
  objectIndex: number,
): PersistedSceneObjectV1 {
  const path = `rooms[${roomIndex}].objects[${objectIndex}]`;
  const object = expectRecord(raw, path);
  const placement = expectRecord(object.placement, `${path}.placement`);
  const dimensionsM = expectRecord(object.dimensionsM, `${path}.dimensionsM`);

  return {
    id: expectNonEmptyString(object.id, `${path}.id`),
    kind: expectNonEmptyString(object.kind, `${path}.kind`),
    placement: {
      hostSurfaceId: expectNonEmptyString(
        placement.hostSurfaceId,
        `${path}.placement.hostSurfaceId`,
      ),
      uM: expectNonNegativeNumber(placement.uM, `${path}.placement.uM`),
      vM: expectNonNegativeNumber(placement.vM, `${path}.placement.vM`),
      normalOffsetM: expectNonNegativeNumber(
        placement.normalOffsetM,
        `${path}.placement.normalOffsetM`,
      ),
      rotationDeg: expectFiniteNumber(
        placement.rotationDeg,
        `${path}.placement.rotationDeg`,
      ),
    },
    dimensionsM: {
      widthM: expectPositiveNumber(
        dimensionsM.widthM,
        `${path}.dimensionsM.widthM`,
      ),
      heightM: expectPositiveNumber(
        dimensionsM.heightM,
        `${path}.dimensionsM.heightM`,
      ),
      depthM: expectPositiveNumber(
        dimensionsM.depthM,
        `${path}.dimensionsM.depthM`,
      ),
    },
    locked: expectBoolean(object.locked, `${path}.locked`),
  };
}

function validateOpeningPlacement(
  openings: PersistedOpeningV1[],
  surfaces: PersistedSurfaceV1[],
  geometry: PersistedRoomV1["geometry"],
  roomIndex: number,
): void {
  const ids = new Set<string>();
  const surfaceById = new Map(surfaces.map((surface) => [surface.id, surface]));
  const epsilon = 1e-9;

  for (const opening of openings) {
    if (ids.has(opening.id)) {
      invalid(`rooms[${roomIndex}].openings contains duplicate id ${opening.id}.`);
    }
    ids.add(opening.id);

    const host = surfaceById.get(opening.hostSurfaceId);
    if (!host || host.kind !== "wall") {
      invalid(
        `Opening ${opening.id} must reference an existing wall hostSurfaceId.`,
      );
    }

    const wallSpan = getPersistedWallSpanM(opening.hostSurfaceId, geometry);
    if (wallSpan === null) {
      invalid(
        `Opening ${opening.id} references an unsupported wall orientation.`,
      );
    }

    if (opening.offsetM + opening.widthM > wallSpan + epsilon) {
      invalid(`Opening ${opening.id} exceeds its host wall width.`);
    }

    const sillM = opening.sillM ?? 0;
    if (sillM + opening.heightM > geometry.heightM + epsilon) {
      invalid(`Opening ${opening.id} exceeds the room height.`);
    }
  }

  for (let i = 0; i < openings.length; i += 1) {
    for (let j = i + 1; j < openings.length; j += 1) {
      const a = openings[i]!;
      const b = openings[j]!;
      if (a.hostSurfaceId !== b.hostSurfaceId) continue;

      const horizontalOverlap =
        a.offsetM < b.offsetM + b.widthM - epsilon &&
        b.offsetM < a.offsetM + a.widthM - epsilon;
      const aSill = a.sillM ?? 0;
      const bSill = b.sillM ?? 0;
      const verticalOverlap =
        aSill < bSill + b.heightM - epsilon &&
        bSill < aSill + a.heightM - epsilon;

      if (horizontalOverlap && verticalOverlap) {
        invalid(
          `Openings ${a.id} and ${b.id} overlap on ${a.hostSurfaceId}.`,
        );
      }
    }
  }
}

function getPersistedWallSpanM(
  hostSurfaceId: string,
  geometry: PersistedRoomV1["geometry"],
): number | null {
  if (
    hostSurfaceId.endsWith(".wall-front") ||
    hostSurfaceId.endsWith(".wall-back")
  ) {
    return geometry.widthM;
  }

  if (
    hostSurfaceId.endsWith(".wall-left") ||
    hostSurfaceId.endsWith(".wall-right")
  ) {
    return geometry.lengthM;
  }

  return null;
}

function validateAssignment(raw: unknown, index: number): PersistedServiceAssignmentV1 {
  const path = `serviceAssignments[${index}]`;
  const assignment = expectRecord(raw, path);
  const mode = expectPresentationMode(assignment.presentationMode, `${path}.presentationMode`);

  const priceBookItemId =
    assignment.priceBookItemId === undefined
      ? undefined
      : expectNonEmptyString(assignment.priceBookItemId, `${path}.priceBookItemId`);

  const unitPriceEur =
    assignment.unitPriceEur === undefined
      ? undefined
      : expectNonNegativeNumber(assignment.unitPriceEur, `${path}.unitPriceEur`);

  const clientInfo =
    assignment.clientInfo === undefined
      ? undefined
      : validateClientInfo(assignment.clientInfo, `${path}.clientInfo`);

  return {
    id: expectNonEmptyString(assignment.id, `${path}.id`),
    serviceCode: expectNonEmptyString(assignment.serviceCode, `${path}.serviceCode`),
    label: expectNonEmptyString(assignment.label, `${path}.label`),
    targetEntityIds: expectArray(assignment.targetEntityIds, `${path}.targetEntityIds`).map(
      (id, targetIndex) =>
        expectNonEmptyString(id, `${path}.targetEntityIds[${targetIndex}]`),
    ),
    included: expectBoolean(assignment.included, `${path}.included`),
    quantityRuleId: expectNonEmptyString(
      assignment.quantityRuleId,
      `${path}.quantityRuleId`,
    ),
    ...(priceBookItemId ? { priceBookItemId } : {}),
    ...(unitPriceEur === undefined ? {} : { unitPriceEur }),
    presentationMode: mode,
    ...(clientInfo ? { clientInfo } : {}),
  };
}

function validateClientInfo(raw: unknown, path: string) {
  const info = expectRecord(raw, path);
  return {
    what: expectNonEmptyString(info.what, `${path}.what`),
    why: expectNonEmptyString(info.why, `${path}.why`),
    result: expectNonEmptyString(info.result, `${path}.result`),
    includes: expectNonEmptyString(info.includes, `${path}.includes`),
  };
}

function toRuntimeSurfaces(surfaces: PersistedSurfaceV1[]): Surface[] {
  const expected: Record<SurfaceId, "wall" | "floor" | "ceiling"> = {
    "room-1.wall-front": "wall",
    "room-1.wall-back": "wall",
    "room-1.wall-left": "wall",
    "room-1.wall-right": "wall",
    "room-1.floor": "floor",
    "room-1.ceiling": "ceiling",
  };

  if (surfaces.length !== Object.keys(expected).length) {
    unsupported("Current Work runtime requires the six First Slice surfaces.");
  }

  const byId = new Map(surfaces.map((surface) => [surface.id, surface]));
  return (Object.keys(expected) as SurfaceId[]).map((id) => {
    const surface = byId.get(id);
    if (!surface || surface.kind !== expected[id]) {
      unsupported(`Missing or invalid runtime surface: ${id}.`);
    }
    return { id, kind: surface.kind, label: surface.label };
  });
}

function toRuntimeOpenings(openings: PersistedOpeningV1[]): Opening[] {
  return openings.map((opening) => {
    if (!isWallId(opening.hostSurfaceId as SurfaceId)) {
      unsupported(`Unsupported runtime opening host: ${opening.hostSurfaceId}.`);
    }

    return {
      id: opening.id,
      kind: opening.kind,
      hostSurfaceId: opening.hostSurfaceId as WallId,
      widthM: opening.widthM,
      heightM: opening.heightM,
      offsetM: opening.offsetM,
      ...(opening.sillM === undefined ? {} : { sillM: opening.sillM }),
    };
  });
}

function toRuntimeSceneObjects(
  objects: PersistedSceneObjectV1[],
): SceneObject[] {
  return objects.map((object) => {
    if (!isSceneObjectId(object.id)) {
      unsupported(`Unsupported runtime scene object id: ${object.id}.`);
    }
    if (!isSurfaceId(object.placement.hostSurfaceId)) {
      unsupported(
        `Unsupported runtime scene object host: ${object.placement.hostSurfaceId}.`,
      );
    }

    return {
      id: object.id,
      kind: object.kind,
      placement: {
        hostSurfaceId: object.placement.hostSurfaceId,
        uM: object.placement.uM,
        vM: object.placement.vM,
        normalOffsetM: object.placement.normalOffsetM,
        rotationDeg: object.placement.rotationDeg,
      },
      dimensionsM: { ...object.dimensionsM },
      locked: object.locked,
    };
  });
}

function toRuntimeServiceAssignment(
  assignment: PersistedServiceAssignmentV1,
  knownEntityIds: ReadonlySet<string>,
): ServiceAssignment {
  const targetEntityIds = assignment.targetEntityIds.map((id) => {
    if (!knownEntityIds.has(id)) {
      unsupported(`Unsupported service target: ${id}.`);
    }
    return id as EntityId;
  });

  return {
    id: assignment.id,
    serviceCode: assignment.serviceCode,
    label: assignment.label,
    targetEntityIds,
    included: assignment.included,
    quantityRuleId: assignment.quantityRuleId,
    ...(assignment.priceBookItemId
      ? { priceBookItemId: assignment.priceBookItemId }
      : {}),
    ...(assignment.unitPriceEur === undefined
      ? {}
      : { unitPriceEur: assignment.unitPriceEur }),
    presentationMode: assignment.presentationMode,
    ...(assignment.clientInfo
      ? { clientInfo: { ...assignment.clientInfo } }
      : {}),
  };
}

function assertUniqueAssignmentIds(assignments: ServiceAssignment[]): void {
  const ids = new Set(assignments.map((assignment) => assignment.id));
  if (ids.size !== assignments.length) {
    unsupported("Current Work runtime requires unique service assignment IDs.");
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function expectRecord(value: unknown, path: string): Record<string, unknown> {
  if (!isRecord(value)) invalid(`${path} must be an object.`);
  return value;
}

function expectArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) invalid(`${path} must be an array.`);
  return value;
}

function expectNonEmptyString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    invalid(`${path} must be a non-empty string.`);
  }
  return value;
}

function expectPositiveNumber(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    invalid(`${path} must be a positive finite number.`);
  }
  return value;
}

function expectNonNegativeNumber(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    invalid(`${path} must be a non-negative finite number.`);
  }
  return value;
}

function expectFiniteNumber(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    invalid(`${path} must be a finite number.`);
  }
  return value;
}

function expectBoolean(value: unknown, path: string): boolean {
  if (typeof value !== "boolean") invalid(`${path} must be a boolean.`);
  return value;
}

function expectPresentationMode(
  value: unknown,
  path: string,
): PersistedServiceAssignmentV1["presentationMode"] {
  if (
    value !== "highlight" &&
    value !== "material" &&
    value !== "geometry" &&
    value !== "xray" &&
    value !== "object"
  ) {
    invalid(`${path} is invalid.`);
  }
  return value;
}

function invalid(message: string): never {
  throw new ProjectPersistenceError("INVALID_STATE", message);
}

function unsupported(message: string): never {
  throw new ProjectPersistenceError("UNSUPPORTED_RUNTIME_SHAPE", message);
}
