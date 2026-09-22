import type { ProjectState, WallId } from "./domain";

export type RoomGeometrySummary = {
  widthM: number;
  lengthM: number;
  heightM: number;
  floorM2: number;
  ceilingM2: number;
  grossWallsM2: number;
  perimeterM: number;
  volumeM3: number;
  wallAreasM2: Record<WallId, number>;
};

export function summarizeRoomGeometry(project: ProjectState): RoomGeometrySummary {
  const { widthM, lengthM, heightM } = project.room;

  const wallAreasM2: Record<WallId, number> = {
    "room-1.wall-front": widthM * heightM,
    "room-1.wall-back": widthM * heightM,
    "room-1.wall-left": lengthM * heightM,
    "room-1.wall-right": lengthM * heightM,
  };

  const floorM2 = widthM * lengthM;
  const perimeterM = 2 * (widthM + lengthM);

  return {
    widthM,
    lengthM,
    heightM,
    floorM2,
    ceilingM2: floorM2,
    grossWallsM2: perimeterM * heightM,
    perimeterM,
    volumeM3: floorM2 * heightM,
    wallAreasM2,
  };
}

export function getWallAreaM2(project: ProjectState, wallId: WallId): number {
  return summarizeRoomGeometry(project).wallAreasM2[wallId];
}
