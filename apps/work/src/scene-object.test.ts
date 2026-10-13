import { describe, expect, it } from "vitest";
import {
  createDefaultProject,
  type SceneObject,
} from "./domain";
import {
  getSurfaceLocalBounds,
  validateSceneObject,
  validateSceneObjects,
} from "./scene-object";

function proofRadiator(
  overrides: Partial<SceneObject> = {},
): SceneObject {
  return {
    id: "room-1.object-radiator-proof",
    kind: "radiator",
    placement: {
      hostSurfaceId: "room-1.wall-front",
      uM: 2.1,
      vM: 0.55,
      normalOffsetM: 0.05,
      rotationDeg: 0,
    },
    dimensionsM: {
      widthM: 1.2,
      heightM: 0.6,
      depthM: 0.12,
    },
    locked: false,
    ...overrides,
  };
}

describe("P3.6a scene object domain", () => {
  it("uses deterministic host-local spans for wall, floor and ceiling surfaces", () => {
    const room = createDefaultProject("scene-object-bounds").room;

    expect(getSurfaceLocalBounds(room, "room-1.wall-front")).toEqual({
      uSpanM: 4.2,
      vSpanM: 2.6,
      normalSpanM: 4.8,
    });
    expect(getSurfaceLocalBounds(room, "room-1.wall-left")).toEqual({
      uSpanM: 4.8,
      vSpanM: 2.6,
      normalSpanM: 4.2,
    });
    expect(getSurfaceLocalBounds(room, "room-1.floor")).toEqual({
      uSpanM: 4.2,
      vSpanM: 4.8,
      normalSpanM: 2.6,
    });
    expect(getSurfaceLocalBounds(room, "room-1.ceiling")).toEqual({
      uSpanM: 4.2,
      vSpanM: 4.8,
      normalSpanM: 2.6,
    });
  });

  it("accepts a wall-hosted radiator fully inside its host-local bounds", () => {
    const room = createDefaultProject("scene-object-valid").room;
    const object = proofRadiator();

    expect(validateSceneObject(room, object)).toBeNull();
  });

  it("accounts for host-plane rotation when validating bounds", () => {
    const room = createDefaultProject("scene-object-rotation").room;
    const object = proofRadiator({
      placement: {
        hostSurfaceId: "room-1.wall-front",
        uM: 0.55,
        vM: 0.55,
        normalOffsetM: 0,
        rotationDeg: 45,
      },
    });

    expect(validateSceneObject(room, object)).toContain(
      "exceeds its host surface bounds",
    );
  });

  it("rejects an object that is outside the host plane or room depth", () => {
    const room = createDefaultProject("scene-object-invalid").room;
    const outsidePlane = proofRadiator({
      placement: {
        hostSurfaceId: "room-1.wall-front",
        uM: 0.2,
        vM: 0.55,
        normalOffsetM: 0,
        rotationDeg: 0,
      },
    });
    const outsideDepth = proofRadiator({
      placement: {
        hostSurfaceId: "room-1.wall-front",
        uM: 2.1,
        vM: 0.55,
        normalOffsetM: 4.75,
        rotationDeg: 0,
      },
    });

    expect(validateSceneObject(room, outsidePlane)).toContain(
      "exceeds its host surface bounds",
    );
    expect(validateSceneObject(room, outsideDepth)).toContain(
      "exceeds the room depth",
    );
  });

  it("rejects a syntactically valid object id from another room namespace", () => {
    const room = createDefaultProject("scene-object-room-id").room;
    const object = proofRadiator({
      id: "room-2.object-radiator-proof",
    });

    expect(validateSceneObject(room, object)).toContain(
      "belongs to a different room",
    );
  });

  it("requires stable unique object ids across the room entity namespace", () => {
    const room = createDefaultProject("scene-object-ids").room;
    room.objects = [
      proofRadiator(),
      proofRadiator({
        kind: "second-proof",
      }),
    ];

    expect(validateSceneObjects(room)).toContain(
      "must be unique across room entities",
    );
  });
});
