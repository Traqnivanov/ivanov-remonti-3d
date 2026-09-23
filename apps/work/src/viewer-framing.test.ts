import { describe, expect, it } from "vitest";
import { createDefaultProject } from "./domain";
import { calculateShowcaseFrame } from "./viewer-framing";
import { getAutoHiddenSurfaceIds } from "./viewer-visibility";

describe("viewer showcase framing", () => {
  it("centers the default room and uses the available Work viewport", () => {
    const project = createDefaultProject();
    const frame = calculateShowcaseFrame(project.room, { width: 850, height: 936 }, 45);
    const centerX = (frame.ndcBounds.left + frame.ndcBounds.right) / 2;
    const centerY = (frame.ndcBounds.bottom + frame.ndcBounds.top) / 2;
    const horizontalFill = (frame.ndcBounds.right - frame.ndcBounds.left) / 2;
    const verticalFill = (frame.ndcBounds.top - frame.ndcBounds.bottom) / 2;

    expect(Math.abs(centerX)).toBeLessThan(0.03);
    expect(Math.abs(centerY)).toBeLessThan(0.04);
    expect(horizontalFill).toBeGreaterThan(0.84);
    expect(horizontalFill).toBeLessThanOrEqual(0.881);
    expect(verticalFill).toBeGreaterThan(0.62);
  });

  it("moves closer in the wider Client viewport instead of leaving dead space", () => {
    const project = createDefaultProject();
    const workFrame = calculateShowcaseFrame(project.room, { width: 850, height: 936 }, 45);
    const clientFrame = calculateShowcaseFrame(project.room, { width: 1080, height: 936 }, 45);
    const clientVerticalFill =
      (clientFrame.ndcBounds.top - clientFrame.ndcBounds.bottom) / 2;

    expect(clientFrame.distance).toBeLessThan(workFrame.distance);
    expect(clientVerticalFill).toBeGreaterThan(0.7);
  });

  it("starts from an interior-readable cutaway angle", () => {
    const project = createDefaultProject();
    const frame = calculateShowcaseFrame(project.room, { width: 850, height: 936 }, 45);
    const hidden = getAutoHiddenSurfaceIds(project, frame.camera);

    expect(hidden.has("room-1.wall-front")).toBe(true);
    expect(hidden.has("room-1.ceiling")).toBe(true);
  });
});
