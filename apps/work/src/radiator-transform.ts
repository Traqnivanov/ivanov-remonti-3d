import { isWallId, type Room } from "./domain";
import type { RadiatorObject } from "./radiator-authoring";
import { getSurfaceLocalBounds } from "./scene-object";

export type RadiatorWorldTransform = {
  x: number;
  y: number;
  z: number;
  rotationY: number;
};

export function getRadiatorWorldTransform(
  room: Room,
  radiator: RadiatorObject,
  wallClearanceM = 0,
): RadiatorWorldTransform {
  const wallId = radiator.placement.hostSurfaceId;
  if (!isWallId(wallId)) {
    throw new Error("Radiator world transform requires a wall host.");
  }
  const bounds = getSurfaceLocalBounds(room, wallId);
  const localX = -bounds.uSpanM / 2 + radiator.placement.uM;
  const inset =
    wallClearanceM +
    radiator.placement.normalOffsetM +
    radiator.dimensionsM.depthM / 2;

  switch (wallId) {
    case "room-1.wall-front":
      return {
        x: localX,
        y: radiator.placement.vM,
        z: room.lengthM / 2 - inset,
        rotationY: 0,
      };
    case "room-1.wall-back":
      return {
        x: localX,
        y: radiator.placement.vM,
        z: -room.lengthM / 2 + inset,
        rotationY: 0,
      };
    case "room-1.wall-left":
      return {
        x: -room.widthM / 2 + inset,
        y: radiator.placement.vM,
        z: -localX,
        rotationY: Math.PI / 2,
      };
    case "room-1.wall-right":
      return {
        x: room.widthM / 2 - inset,
        y: radiator.placement.vM,
        z: -localX,
        rotationY: Math.PI / 2,
      };
  }
}
