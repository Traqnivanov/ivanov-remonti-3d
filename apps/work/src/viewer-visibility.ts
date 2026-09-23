import type { ProjectState, SurfaceId } from "./domain";

export type ViewerCameraPosition = {
  x: number;
  y: number;
  z: number;
};

export function getAutoHiddenSurfaceIds(
  project: ProjectState,
  camera: ViewerCameraPosition,
): Set<SurfaceId> {
  const { widthM: width, lengthM: length, heightM: height } = project.room;
  const hidden = new Set<SurfaceId>();

  const normalizedX = width > 0 ? camera.x / (width / 2) : 0;
  const normalizedZ = length > 0 ? camera.z / (length / 2) : 0;

  if (Math.abs(normalizedX) > Math.abs(normalizedZ)) {
    hidden.add(
      normalizedX > 0 ? "room-1.wall-right" : "room-1.wall-left",
    );
  } else {
    hidden.add(
      normalizedZ > 0 ? "room-1.wall-front" : "room-1.wall-back",
    );
  }

  if (camera.y > height * 1.35) {
    hidden.add("room-1.ceiling");
  }

  return hidden;
}

export function isSurfaceVisible(
  id: SurfaceId,
  manualHidden: ReadonlySet<SurfaceId>,
  autoHidden: ReadonlySet<SurfaceId>,
): boolean {
  return !manualHidden.has(id) && !autoHidden.has(id);
}
