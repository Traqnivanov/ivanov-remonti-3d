import { describe, expect, it } from "vitest";
import { createDefaultProject, createOpeningProofProject } from "./domain";
import {
  getOpeningAreaM2,
  getWallAreaM2,
  getWallNetAreaM2,
  getWallOpeningAreaM2,
  summarizeRoomGeometry,
} from "./geometry";

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

  it("keeps individual gross wall areas addressable by stable IDs", () => {
    const project = createDefaultProject();

    expect(getWallAreaM2(project, "room-1.wall-front")).toBeCloseTo(10.92, 8);
    expect(getWallAreaM2(project, "room-1.wall-back")).toBeCloseTo(10.92, 8);
    expect(getWallAreaM2(project, "room-1.wall-left")).toBeCloseTo(12.48, 8);
    expect(getWallAreaM2(project, "room-1.wall-right")).toBeCloseTo(12.48, 8);
  });

  it("keeps gross wall geometry unchanged while deriving opening and net areas", () => {
    const project = createOpeningProofProject();

    expect(getOpeningAreaM2(project, "room-1.door-1")).toBeCloseTo(1.89, 8);
    expect(getOpeningAreaM2(project, "room-1.window-1")).toBeCloseTo(1.32, 8);
    expect(getWallAreaM2(project, "room-1.wall-front")).toBeCloseTo(10.92, 8);
    expect(getWallOpeningAreaM2(project, "room-1.wall-front")).toBeCloseTo(1.89, 8);
    expect(getWallNetAreaM2(project, "room-1.wall-front")).toBeCloseTo(9.03, 8);
    expect(getWallAreaM2(project, "room-1.wall-right")).toBeCloseTo(12.48, 8);
    expect(getWallOpeningAreaM2(project, "room-1.wall-right")).toBeCloseTo(1.32, 8);
    expect(getWallNetAreaM2(project, "room-1.wall-right")).toBeCloseTo(11.16, 8);
  });
});
