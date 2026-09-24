import {
  getFinePuttyAssignment,
  surfaceIds,
  type ProjectState,
  type ServiceAssignment,
  type Surface,
  type SurfaceId,
} from "./domain";

export const CURRENT_PROJECT_SCHEMA_VERSION = 1 as const;

export type PersistedSurfaceV1 = {
  id: string;
  kind: "wall" | "floor" | "ceiling";
  label: string;
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
  openings: unknown[];
  objects: unknown[];
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
        openings: [],
        objects: [],
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

  return validateV1(raw);
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
  if (room.openings.length || room.objects.length || room.materials.length) {
    unsupported("Current Work runtime does not yet support persisted openings, objects or materials.");
  }

  const serviceAssignments = persisted.serviceAssignments.map(
    toRuntimeServiceAssignment,
  );
  assertUniqueAssignmentIds(serviceAssignments);

  const project: ProjectState = {
    schemaVersion: 1,
    projectId: persisted.projectId,
    room: {
      id: "room-1",
      name: room.name,
      widthM: room.geometry.widthM,
      lengthM: room.geometry.lengthM,
      heightM: room.geometry.heightM,
      surfaces: toRuntimeSurfaces(room.surfaces),
    },
    serviceAssignments,
  };

  try {
    getFinePuttyAssignment(project);
  } catch {
    unsupported("Current Work runtime requires the canonical Fine Putty assignment.");
  }

  return project;
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
  const geometry = expectRecord(room.geometry, `rooms[${index}].geometry`);

  return {
    id: expectNonEmptyString(room.id, `rooms[${index}].id`),
    name: expectNonEmptyString(room.name, `rooms[${index}].name`),
    geometry: {
      widthM: expectPositiveNumber(geometry.widthM, `rooms[${index}].geometry.widthM`),
      lengthM: expectPositiveNumber(
        geometry.lengthM,
        `rooms[${index}].geometry.lengthM`,
      ),
      heightM: expectPositiveNumber(
        geometry.heightM,
        `rooms[${index}].geometry.heightM`,
      ),
    },
    surfaces: expectArray(room.surfaces, `rooms[${index}].surfaces`).map(
      (surface, surfaceIndex) => validateSurface(surface, index, surfaceIndex),
    ),
    openings: [...expectArray(room.openings, `rooms[${index}].openings`)],
    objects: [...expectArray(room.objects, `rooms[${index}].objects`)],
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

function validateAssignment(raw: unknown, index: number): PersistedServiceAssignmentV1 {
  const path = `serviceAssignments[${index}]`;
  const assignment = expectRecord(raw, path);
  const mode = expectPresentationMode(assignment.presentationMode, `${path}.presentationMode`);

  const priceBookItemId =
    assignment.priceBookItemId === undefined
      ? undefined
      : expectNonEmptyString(assignment.priceBookItemId, `${path}.priceBookItemId`);

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

function toRuntimeServiceAssignment(
  assignment: PersistedServiceAssignmentV1,
): ServiceAssignment {
  const knownSurfaceIds = new Set<SurfaceId>(surfaceIds);
  const targetEntityIds = assignment.targetEntityIds.map((id) => {
    if (!knownSurfaceIds.has(id as SurfaceId)) {
      unsupported(`Unsupported service target: ${id}.`);
    }
    return id as SurfaceId;
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
