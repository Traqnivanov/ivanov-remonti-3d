import { describe, expect, it } from "vitest";
import {
  createDefaultProject,
  createOpeningProofProject,
} from "./domain";
import {
  addOpening,
  removeOpening,
  updateOpening,
  validateRoomResize,
} from "./opening-authoring";

describe("opening authoring", () => {
  it("adds a valid door and window to an empty Work project", () => {
    const project = createDefaultProject("authoring-add");

    const door = addOpening(project, "door", "door-a");
    expect(door.ok).toBe(true);
    if (!door.ok) return;
    project.room.openings = door.openings;

    const windowResult = addOpening(project, "window", "window-a");
    expect(windowResult.ok).toBe(true);
    if (!windowResult.ok) return;

    expect(windowResult.openings.map((opening) => opening.kind)).toEqual([
      "door",
      "window",
    ]);
  });

  it("rejects an edit that pushes an opening outside its host wall", () => {
    const project = createOpeningProofProject();

    const result = updateOpening(project, "room-1.door-1", {
      offsetM: 4,
    });

    expect(result.ok).toBe(false);
  });

  it("rejects an edit that creates overlapping openings", () => {
    const project = createOpeningProofProject();
    const result = updateOpening(project, "room-1.window-1", {
      hostSurfaceId: "room-1.wall-front",
      offsetM: 0.7,
      sillM: 0.9,
    });

    expect(result.ok).toBe(false);
  });

  it("rejects moving an opening into an existing radiator", () => {
    const project = createOpeningProofProject("opening-radiator-overlap");
    project.room.objects.push({
      id: "room-1.object-radiator-1",
      kind: "radiator",
      placement: {
        hostSurfaceId: "room-1.wall-back",
        uM: 2.1,
        vM: 0.42,
        normalOffsetM: 0.04,
        rotationDeg: 0,
      },
      dimensionsM: {
        widthM: 1,
        heightM: 0.6,
        depthM: 0.12,
      },
      locked: false,
    });

    const result = updateOpening(project, "room-1.window-1", {
      hostSurfaceId: "room-1.wall-back",
      offsetM: 1.7,
      sillM: 0.1,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.message).toContain("Радиатор");
  });

  it("rejects a room resize that would invalidate an existing opening", () => {
    const project = createOpeningProofProject();

    expect(
      validateRoomResize(project, {
        widthM: 1.2,
        lengthM: project.room.lengthM,
        heightM: project.room.heightM,
      }),
    ).not.toBeNull();
  });

  it("removes only the requested opening", () => {
    const project = createOpeningProofProject();

    const result = removeOpening(project, "room-1.door-1");

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.openings.map((opening) => opening.id)).toEqual([
      "room-1.window-1",
    ]);
  });
});
