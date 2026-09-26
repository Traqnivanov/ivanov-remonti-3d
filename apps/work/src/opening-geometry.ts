import type { ProjectState, WallId } from "./domain";

export type WallOpeningRect = {
  id: string;
  kind: "door" | "window";
  wallId: WallId;
  startM: number;
  endM: number;
  bottomM: number;
  topM: number;
};

export function getWallSpanM(
  project: ProjectState,
  wallId: WallId,
): number {
  return wallId === "room-1.wall-front" || wallId === "room-1.wall-back"
    ? project.room.widthM
    : project.room.lengthM;
}

export function getWallOpeningRects(
  project: ProjectState,
  wallId: WallId,
): WallOpeningRect[] {
  return project.room.openings
    .filter((opening) => opening.hostSurfaceId === wallId)
    .map((opening) => {
      const bottomM = opening.sillM ?? 0;
      return {
        id: opening.id,
        kind: opening.kind,
        wallId,
        startM: opening.offsetM,
        endM: opening.offsetM + opening.widthM,
        bottomM,
        topM: bottomM + opening.heightM,
      };
    })
    .sort((a, b) => a.startM - b.startM || a.bottomM - b.bottomM);
}
