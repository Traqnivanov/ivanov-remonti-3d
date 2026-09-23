import type { Room } from "./domain";

export type ViewerViewport = { width: number; height: number };
export type ViewerFrameVector = { x: number; y: number; z: number };
export type ViewerFrameBounds = { left: number; right: number; bottom: number; top: number };
export type ShowcaseFrame = {
  camera: ViewerFrameVector;
  target: ViewerFrameVector;
  distance: number;
  ndcBounds: ViewerFrameBounds;
};

type RoomDimensions = Pick<Room, "widthM" | "lengthM" | "heightM">;

const SHOWCASE_DIRECTION = normalize({ x: 0.45, y: 0.55, z: 1 });
const SHOWCASE_TARGET_X_RATIO = -0.1;
const SHOWCASE_TARGET_Y_RATIO = 0.24;
const MAX_HORIZONTAL_NDC = 0.88;
const MAX_VERTICAL_NDC = 0.76;
const DEFAULT_VERTICAL_FOV_DEG = 45;

export function calculateShowcaseFrame(
  room: RoomDimensions,
  viewport: ViewerViewport,
  verticalFovDeg = DEFAULT_VERTICAL_FOV_DEG,
): ShowcaseFrame {
  const width = Math.max(0.01, room.widthM);
  const length = Math.max(0.01, room.lengthM);
  const height = Math.max(0.01, room.heightM);
  const aspect = Math.max(0.1, viewport.width / Math.max(1, viewport.height));
  const verticalHalfFov = degreesToRadians(verticalFovDeg) / 2;
  const tanVertical = Math.tan(verticalHalfFov);
  const tanHorizontal = tanVertical * aspect;

  // The open three-quarter shell projects below/right of its geometric center.
  // Bias the orbit target toward the visible interior for a centered first frame.
  const target: ViewerFrameVector = {
    x: width * SHOWCASE_TARGET_X_RATIO,
    y: height * SHOWCASE_TARGET_Y_RATIO,
    z: 0,
  };

  const forward = scale(SHOWCASE_DIRECTION, -1);
  const right = normalize(cross(forward, { x: 0, y: 1, z: 0 }));
  const up = normalize(cross(right, forward));
  const corners = roomCorners(width, length, height);
  let distance = 1;

  for (const corner of corners) {
    const relative = subtract(corner, target);
    const towardCamera = dot(relative, SHOWCASE_DIRECTION);
    const horizontal = Math.abs(dot(relative, right));
    const vertical = Math.abs(dot(relative, up));

    distance = Math.max(
      distance,
      towardCamera + horizontal / (tanHorizontal * MAX_HORIZONTAL_NDC),
      towardCamera + vertical / (tanVertical * MAX_VERTICAL_NDC),
    );
  }

  const camera = add(target, scale(SHOWCASE_DIRECTION, distance));
  const ndcBounds = projectBounds(
    corners, camera, forward, right, up, tanHorizontal, tanVertical,
  );

  return { camera, target, distance, ndcBounds };
}

function projectBounds(
  corners: ViewerFrameVector[],
  camera: ViewerFrameVector,
  forward: ViewerFrameVector,
  right: ViewerFrameVector,
  up: ViewerFrameVector,
  tanHorizontal: number,
  tanVertical: number,
): ViewerFrameBounds {
  let left = Number.POSITIVE_INFINITY;
  let rightEdge = Number.NEGATIVE_INFINITY;
  let bottom = Number.POSITIVE_INFINITY;
  let top = Number.NEGATIVE_INFINITY;

  for (const corner of corners) {
    const fromCamera = subtract(corner, camera);
    const depth = dot(fromCamera, forward);
    const x = dot(fromCamera, right) / (depth * tanHorizontal);
    const y = dot(fromCamera, up) / (depth * tanVertical);

    left = Math.min(left, x);
    rightEdge = Math.max(rightEdge, x);
    bottom = Math.min(bottom, y);
    top = Math.max(top, y);
  }

  return { left, right: rightEdge, bottom, top };
}

function roomCorners(width: number, length: number, height: number): ViewerFrameVector[] {
  const halfWidth = width / 2;
  const halfLength = length / 2;
  return [
    { x: -halfWidth, y: 0, z: -halfLength },
    { x: -halfWidth, y: 0, z: halfLength },
    { x: halfWidth, y: 0, z: -halfLength },
    { x: halfWidth, y: 0, z: halfLength },
    { x: -halfWidth, y: height, z: -halfLength },
    { x: -halfWidth, y: height, z: halfLength },
    { x: halfWidth, y: height, z: -halfLength },
    { x: halfWidth, y: height, z: halfLength },
  ];
}

function add(a: ViewerFrameVector, b: ViewerFrameVector): ViewerFrameVector {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}
function subtract(a: ViewerFrameVector, b: ViewerFrameVector): ViewerFrameVector {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}
function scale(vector: ViewerFrameVector, factor: number): ViewerFrameVector {
  return { x: vector.x * factor, y: vector.y * factor, z: vector.z * factor };
}
function dot(a: ViewerFrameVector, b: ViewerFrameVector): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}
function cross(a: ViewerFrameVector, b: ViewerFrameVector): ViewerFrameVector {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}
function normalize(vector: ViewerFrameVector): ViewerFrameVector {
  const length = Math.hypot(vector.x, vector.y, vector.z);
  if (length === 0) return { x: 0, y: 0, z: 1 };
  return scale(vector, 1 / length);
}
function degreesToRadians(value: number): number {
  return (value * Math.PI) / 180;
}
