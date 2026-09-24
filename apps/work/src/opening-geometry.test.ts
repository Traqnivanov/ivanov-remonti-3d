import { describe, expect, it } from "vitest";
import {
  createDefaultProject,
  createOpeningProofProject,
} from "./domain";
import {
  getWallOpeningRects,
  getWallSpanM,
} from "./opening-geometry";

describe("opening geometry bridge", () => {
  it("keeps real Work default projects free of invented openings", () => {
    const project = createDefaultProject();

    expect(project.room.openings).toEqual([]);
  });

  it("provides one stable door and one stable window in the proof project", () => {
    const project = createOpeningProofProject();

    expect(project.room.openings.map((opening) => opening.id)).toEqual([
      "room-1.door-1",
      "room-1.window-1",
    ]);
    expect(project.room.openings.map((opening) => opening.kind)).toEqual([
      "door",
      "window",
    ]);
  });

  it("maps the front-wall door to exact wall coordinates", () => {
    const project = createOpeningProofProject();
    const [door] = getWallOpeningRects(project, "room-1.wall-front");

    expect(getWallSpanM(project, "room-1.wall-front")).toBeCloseTo(4.2, 8);
    expect(door).toMatchObject({
      id: "room-1.door-1",
      kind: "door",
      wallId: "room-1.wall-front",
    });
    expect(door!.startM).toBeCloseTo(0.55, 8);
    expect(door!.endM).toBeCloseTo(1.45, 8);
    expect(door!.bottomM).toBeCloseTo(0, 8);
    expect(door!.topM).toBeCloseTo(2.1, 8);
  });

  it("maps the right-wall window to exact wall coordinates", () => {
    const project = createOpeningProofProject();
    const [windowOpening] = getWallOpeningRects(
      project,
      "room-1.wall-right",
    );

    expect(getWallSpanM(project, "room-1.wall-right")).toBeCloseTo(4.8, 8);
    expect(windowOpening).toMatchObject({
      id: "room-1.window-1",
      kind: "window",
      wallId: "room-1.wall-right",
    });
    expect(windowOpening!.startM).toBeCloseTo(1.4, 8);
    expect(windowOpening!.endM).toBeCloseTo(2.6, 8);
    expect(windowOpening!.bottomM).toBeCloseTo(0.9, 8);
    expect(windowOpening!.topM).toBeCloseTo(2, 8);
  });
});
