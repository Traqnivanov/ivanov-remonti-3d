import {
  isSceneObjectId,
  isSurfaceId,
  type Room,
  type SceneObject,
  type SurfaceId,
} from "./domain";

export type SurfaceLocalBounds = {
  uSpanM: number;
  vSpanM: number;
  normalSpanM: number;
};

export function getSurfaceLocalBounds(
  room: Room,
  hostSurfaceId: SurfaceId,
): SurfaceLocalBounds {
  switch (hostSurfaceId) {
    case "room-1.wall-front":
    case "room-1.wall-back":
      return {
        uSpanM: room.widthM,
        vSpanM: room.heightM,
        normalSpanM: room.lengthM,
      };
    case "room-1.wall-left":
    case "room-1.wall-right":
      return {
        uSpanM: room.lengthM,
        vSpanM: room.heightM,
        normalSpanM: room.widthM,
      };
    case "room-1.floor":
    case "room-1.ceiling":
      return {
        uSpanM: room.widthM,
        vSpanM: room.lengthM,
        normalSpanM: room.heightM,
      };
  }
}

export function validateSceneObjects(room: Room): string | null {
  const ids = new Set<string>([
    ...room.surfaces.map((surface) => surface.id),
    ...room.openings.map((opening) => opening.id),
  ]);

  for (const object of room.objects) {
    if (ids.has(object.id)) {
      return `Scene object id must be unique across room entities: ${object.id}.`;
    }
    ids.add(object.id);

    const error = validateSceneObject(room, object);
    if (error) return error;
  }

  return null;
}

export function validateSceneObject(
  room: Room,
  object: SceneObject,
): string | null {
  if (!isSceneObjectId(object.id)) {
    return `Invalid scene object id: ${object.id}.`;
  }
  if (!object.id.startsWith(`${room.id}.object-`)) {
    return `Scene object ${object.id} belongs to a different room.`;
  }

  if (!object.kind.trim()) {
    return `Scene object ${object.id} requires a non-empty kind.`;
  }

  const hostSurfaceId = object.placement.hostSurfaceId;
  if (
    !isSurfaceId(hostSurfaceId) ||
    !room.surfaces.some((surface) => surface.id === hostSurfaceId)
  ) {
    return `Scene object ${object.id} references an unknown host surface.`;
  }

  const { widthM, heightM, depthM } = object.dimensionsM;
  if (
    !isPositiveFinite(widthM) ||
    !isPositiveFinite(heightM) ||
    !isPositiveFinite(depthM)
  ) {
    return `Scene object ${object.id} dimensions must be positive finite numbers.`;
  }

  const { uM, vM, normalOffsetM, rotationDeg } = object.placement;
  if (
    !isFiniteNumber(uM) ||
    !isFiniteNumber(vM) ||
    !isFiniteNumber(normalOffsetM) ||
    !isFiniteNumber(rotationDeg) ||
    uM < 0 ||
    vM < 0 ||
    normalOffsetM < 0
  ) {
    return `Scene object ${object.id} placement must use finite non-negative offsets and a finite rotation.`;
  }

  const bounds = getSurfaceLocalBounds(room, hostSurfaceId);
  const hostIsWall = hostSurfaceId.includes(".wall-");
  const planeWidthM = widthM;
  const planeHeightM = hostIsWall ? heightM : depthM;
  const normalSizeM = hostIsWall ? depthM : heightM;
  const angle = (rotationDeg * Math.PI) / 180;
  const cos = Math.abs(Math.cos(angle));
  const sin = Math.abs(Math.sin(angle));
  const rotatedUSpanM = cos * planeWidthM + sin * planeHeightM;
  const rotatedVSpanM = sin * planeWidthM + cos * planeHeightM;
  const epsilon = 1e-9;

  if (
    uM - rotatedUSpanM / 2 < -epsilon ||
    uM + rotatedUSpanM / 2 > bounds.uSpanM + epsilon ||
    vM - rotatedVSpanM / 2 < -epsilon ||
    vM + rotatedVSpanM / 2 > bounds.vSpanM + epsilon
  ) {
    return `Scene object ${object.id} exceeds its host surface bounds.`;
  }

  if (normalOffsetM + normalSizeM > bounds.normalSpanM + epsilon) {
    return `Scene object ${object.id} exceeds the room depth from its host surface.`;
  }

  return null;
}

function isFiniteNumber(value: number): boolean {
  return Number.isFinite(value);
}

function isPositiveFinite(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}
