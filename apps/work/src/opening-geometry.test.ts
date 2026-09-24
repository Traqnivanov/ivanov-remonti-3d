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
    expect(door).toEqual({
      id: "room-1.door-1",
      kind: "door",
      wallId: "room-1.wall-front",
      startM: 0.55,
      endM: 1.45,
      bottomM: 0,
      topM: 2.1,
    });
  });

  it("maps the right-wall window to exact wall coordinates", () => {
    const project = createOpeningProofProject();
    const [windowOpening] = getWallOpeningRects(
      project,
      "room-1.wall-right",
    );

    expect(getWallSpanM(project, "room-1.wall-right")).toBeCloseTo(4.8, 8);
    expect(windowOpening).toEqual({
      id: "room-1.window-1",
      kind: "window",
      wallId: "room-1.wall-right",
      startM: 1.4,
      endM: 2.6,
      bottomM: 0.9,
      topM: 2,
    });
  });
});
