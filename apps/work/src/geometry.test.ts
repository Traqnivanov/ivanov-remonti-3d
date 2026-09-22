import { describe, expect, it } from "vitest";
import { createDefaultProject } from "./domain";
import { getWallAreaM2, summarizeRoomGeometry } from "./geometry";

describe("M² room geometry bridge", () => {
  it("matches the existing M² calculator rectangular-room formulas", () => {
    const project = createDefaultProject();
    const geometry = summarizeRoomGeometry(project);

    expect(geometry.floorM2).toBeCloseTo(20.16, 8);
    expect(geometry.ceilingM2).toBeCloseTo(20.16, 8);
    expect(geometry.perimeterM).toBeCloseTo(18, 8);
    expect(geometry.grossWallsM2).toBeCloseTo(46.8, 8);
    expect(geometry.volumeM3).toBeCloseTo(52.416, 8);
  });

  it("keeps individual wall areas addressable by stable IDs", () => {
    const project = createDefaultProject();

    expect(getWallAreaM2(project, "room-1.wall-front")).toBeCloseTo(10.92, 8);
    expect(getWallAreaM2(project, "room-1.wall-back")).toBeCloseTo(10.92, 8);
    expect(getWallAreaM2(project, "room-1.wall-left")).toBeCloseTo(12.48, 8);
    expect(getWallAreaM2(project, "room-1.wall-right")).toBeCloseTo(12.48, 8);
  });
});
