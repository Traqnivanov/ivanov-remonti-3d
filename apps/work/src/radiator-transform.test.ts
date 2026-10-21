import { describe, expect, it } from "vitest";
import { createDefaultProject, type SceneObject } from "./domain";
import type { RadiatorObject } from "./radiator-authoring";
import { getRadiatorWorldTransform } from "./radiator-transform";

describe("P3.6b radiator host-local world transform", () => {
  it("maps front and back wall-local coordinates into room world space", () => {
    const room = createDefaultProject("radiator-transform-front").room;
    const front = radiator("room-1.wall-front", 2.1, 0.42);
    const back = radiator("room-1.wall-back", 2.1, 0.42);

    expect(getRadiatorWorldTransform(room, front, 0.04)).toEqual({
      x: 0,
      y: 0.42,
      z: 2.2,
      rotationY: 0,
    });
    expect(getRadiatorWorldTransform(room, back, 0.04)).toEqual({
      x: 0,
      y: 0.42,
      z: -2.2,
      rotationY: 0,
    });
  });

  it("maps left and right wall-local coordinates consistently with wall orientation", () => {
    const room = createDefaultProject("radiator-transform-side").room;
    const left = radiator("room-1.wall-left", 1.2, 0.5);
    const right = radiator("room-1.wall-right", 1.2, 0.5);

    const leftTransform = getRadiatorWorldTransform(room, left, 0.04);
    const rightTransform = getRadiatorWorldTransform(room, right, 0.04);

    expect(leftTransform.x).toBeCloseTo(-1.94, 6);
    expect(rightTransform.x).toBeCloseTo(1.94, 6);
    expect(leftTransform.z).toBeCloseTo(1.2, 6);
    expect(rightTransform.z).toBeCloseTo(1.2, 6);
    expect(leftTransform.rotationY).toBeCloseTo(Math.PI / 2, 8);
    expect(rightTransform.rotationY).toBeCloseTo(Math.PI / 2, 8);
  });

  it("rejects a non-wall radiator host", () => {
    const room = createDefaultProject("radiator-transform-invalid").room;
    const invalid: RadiatorObject = {
      ...radiator("room-1.wall-front", 2.1, 0.42),
      placement: {
        hostSurfaceId: "room-1.floor",
        uM: 2.1,
        vM: 2.4,
        normalOffsetM: 0,
        rotationDeg: 0,
      },
    };

    expect(() => getRadiatorWorldTransform(room, invalid)).toThrow(
      "requires a wall host",
    );
  });
});

function radiator(
  hostSurfaceId:
    | "room-1.wall-front"
    | "room-1.wall-back"
    | "room-1.wall-left"
    | "room-1.wall-right",
  uM: number,
  vM: number,
): RadiatorObject {
  return {
    id: "room-1.object-radiator-1",
    kind: "radiator",
    placement: {
      hostSurfaceId,
      uM,
      vM,
      normalOffsetM: 0.04,
      rotationDeg: 0,
    },
    dimensionsM: {
      widthM: 1,
      heightM: 0.6,
      depthM: 0.12,
    },
    locked: false,
  };
}
