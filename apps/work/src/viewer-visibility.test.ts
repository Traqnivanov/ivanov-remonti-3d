import { describe, expect, it } from "vitest";
import { createDefaultProject } from "./domain";
import {
  getAutoHiddenSurfaceIds,
  isSurfaceVisible,
} from "./viewer-visibility";

describe("viewer visibility rules", () => {
  it("auto cutaway hides the wall on the dominant camera side", () => {
    const project = createDefaultProject();

    expect(
      [...getAutoHiddenSurfaceIds(project, { x: 0, y: 2, z: 7 })],
    ).toEqual(["room-1.wall-front"]);

    expect(
      [...getAutoHiddenSurfaceIds(project, { x: 7, y: 2, z: 0 })],
    ).toEqual(["room-1.wall-right"]);

    expect(
      [...getAutoHiddenSurfaceIds(project, { x: -7, y: 2, z: 0 })],
    ).toEqual(["room-1.wall-left"]);
  });

  it("also hides the ceiling from a sufficiently high camera", () => {
    const project = createDefaultProject();
    const hidden = getAutoHiddenSurfaceIds(project, {
      x: 0,
      y: project.room.heightM * 1.5,
      z: 7,
    });

    expect(hidden.has("room-1.wall-front")).toBe(true);
    expect(hidden.has("room-1.ceiling")).toBe(true);
  });

  it("combines manual and automatic hiding without deleting model state", () => {
    const manualHidden = new Set(["room-1.wall-left"] as const);
    const autoHidden = new Set(["room-1.wall-front"] as const);

    expect(
      isSurfaceVisible("room-1.wall-left", manualHidden, autoHidden),
    ).toBe(false);
    expect(
      isSurfaceVisible("room-1.wall-front", manualHidden, autoHidden),
    ).toBe(false);
    expect(
      isSurfaceVisible("room-1.wall-right", manualHidden, autoHidden),
    ).toBe(true);
  });
});
