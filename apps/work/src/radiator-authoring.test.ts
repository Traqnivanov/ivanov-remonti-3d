import { describe, expect, it } from "vitest";
import {
  createDefaultProject,
  createOpeningProofProject,
  type SceneObject,
} from "./domain";
import {
  addRadiator,
  duplicateRadiator,
  getRadiatorLabel,
  moveRadiatorToWall,
  removeRadiator,
  setRadiatorLocked,
  updateRadiatorGeometry,
  validateRadiatorOpeningOverlaps,
  validateRadiatorRoomResize,
  validateRadiatorSet,
} from "./radiator-authoring";

describe("P3.6b radiator authoring", () => {
  it("adds one stable wall-hosted radiator without inventing a service", () => {
    const project = createOpeningProofProject("radiator-add");
    const result = addRadiator(project);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.objects).toHaveLength(1);
    const radiator = result.objects[0]!;
    expect(radiator.id).toBe("room-1.object-radiator-1");
    expect(radiator.kind).toBe("radiator");
    expect(radiator.placement.rotationDeg).toBe(0);
    expect(radiator.locked).toBe(false);
    expect(project.serviceAssignments.some((assignment) =>
      assignment.targetEntityIds.includes(radiator.id),
    )).toBe(false);

    const nextProject = structuredClone(project);
    nextProject.room.objects = result.objects;
    expect(validateRadiatorSet(nextProject.room)).toBeNull();
    expect(getRadiatorLabel(nextProject, radiator.id)).toBe("Радиатор 1");
  });

  it("keeps the human radiator label tied to the stable id number", () => {
    const project = createDefaultProject("radiator-stable-label");
    project.room.objects = [
      radiator("room-1.object-radiator-2", "room-1.wall-back", 2.1, 0.42),
    ];

    expect(
      getRadiatorLabel(project, "room-1.object-radiator-2"),
    ).toBe("Радиатор 2");
  });

  it("uses sequential room-stable ids after deletes", () => {
    const project = createDefaultProject("radiator-id");
    project.room.objects = [
      radiator("room-1.object-radiator-2", "room-1.wall-back", 2.1, 0.42),
      radiator("room-1.object-radiator-5", "room-1.wall-left", 2.4, 0.42),
    ];

    const result = addRadiator(project);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.focusId).toBe("room-1.object-radiator-6");
  });

  it("rejects overlap with a door or window", () => {
    const project = createOpeningProofProject("radiator-opening-overlap");
    const object = radiator(
      "room-1.object-radiator-1",
      "room-1.wall-front",
      0.9,
      0.42,
      1,
      0.6,
    );

    expect(
      validateRadiatorOpeningOverlaps(project.room.openings, [object]),
    ).toContain("врата или прозорец");

    project.room.objects = [object];
    expect(validateRadiatorSet(project.room)).toContain("врата или прозорец");
  });

  it("rejects radiator/radiator overlap on one wall", () => {
    const project = createDefaultProject("radiator-overlap");
    project.room.objects = [
      radiator("room-1.object-radiator-1", "room-1.wall-front", 2, 0.42),
      radiator("room-1.object-radiator-2", "room-1.wall-front", 2.4, 0.42),
    ];

    expect(validateRadiatorSet(project.room)).toContain(
      "Два радиатора не могат да се застъпват",
    );
  });

  it("rejects a radiator hosted on floor even though generic SceneObject allows floor hosts", () => {
    const project = createDefaultProject("radiator-wall-only");
    const object: SceneObject = {
      ...radiator("room-1.object-radiator-1", "room-1.wall-front", 2.1, 0.42),
      placement: {
        hostSurfaceId: "room-1.floor",
        uM: 2.1,
        vM: 2.4,
        normalOffsetM: 0,
        rotationDeg: 0,
      },
    };
    project.room.objects = [object];

    expect(validateRadiatorSet(project.room)).toContain(
      "трябва да бъде поставен върху стена",
    );
  });

  it("blocks geometry changes while locked but allows unlock", () => {
    const project = createDefaultProject("radiator-lock");
    project.room.objects = [
      {
        ...radiator("room-1.object-radiator-1", "room-1.wall-front", 2.1, 0.42),
        locked: true,
      },
    ];

    expect(
      updateRadiatorGeometry(project, "room-1.object-radiator-1", { uM: 3 }),
    ).toEqual({
      ok: false,
      message: "Радиаторът е заключен за редакция.",
    });

    const unlocked = setRadiatorLocked(
      project,
      "room-1.object-radiator-1",
      false,
    );
    expect(unlocked.ok).toBe(true);
    if (!unlocked.ok) return;
    expect(unlocked.objects[0]!.locked).toBe(false);
  });

  it("moves to a chosen wall using a valid host-local position", () => {
    const project = createOpeningProofProject("radiator-wall-move");
    const added = addRadiator(project);
    expect(added.ok).toBe(true);
    if (!added.ok) return;
    project.room.objects = added.objects;

    const moved = moveRadiatorToWall(
      project,
      added.focusId!,
      "room-1.wall-right",
    );

    expect(moved.ok).toBe(true);
    if (!moved.ok) return;
    const object = moved.objects.find((item) => item.id === added.focusId)!;
    expect(object.placement.hostSurfaceId).toBe("room-1.wall-right");

    const nextRoom = { ...project.room, objects: moved.objects };
    expect(validateRadiatorSet(nextRoom)).toBeNull();
  });

  it("duplicates to a new stable id and a non-overlapping placement", () => {
    const project = createDefaultProject("radiator-duplicate");
    const added = addRadiator(project);
    expect(added.ok).toBe(true);
    if (!added.ok) return;
    project.room.objects = added.objects;

    const duplicated = duplicateRadiator(project, added.focusId!);
    expect(duplicated.ok).toBe(true);
    if (!duplicated.ok) return;

    expect(duplicated.objects).toHaveLength(2);
    expect(duplicated.focusId).toBe("room-1.object-radiator-2");
    expect(validateRadiatorSet({ ...project.room, objects: duplicated.objects })).toBeNull();
  });

  it("blocks deletion when an offer assignment already targets the radiator", () => {
    const project = createDefaultProject("radiator-linked-delete");
    const object = radiator(
      "room-1.object-radiator-1",
      "room-1.wall-front",
      2.1,
      0.42,
    );
    project.room.objects = [object];
    project.serviceAssignments.push({
      id: "assignment-radiator-proof",
      serviceCode: "radiator-proof",
      label: "Radiator proof",
      targetEntityIds: [object.id],
      included: true,
      quantityRuleId: "entity-count-v1",
      presentationMode: "object",
    });

    const result = removeRadiator(project, object.id);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.message).toContain("свързан с позиция");
  });

  it("rejects a room resize that would move a radiator outside its host", () => {
    const project = createDefaultProject("radiator-resize");
    project.room.objects = [
      radiator("room-1.object-radiator-1", "room-1.wall-front", 3.7, 0.42),
    ];

    expect(
      validateRadiatorRoomResize(project, {
        widthM: 3.5,
        lengthM: 4.8,
        heightM: 2.6,
      }),
    ).toContain("излиза извън границите");
  });
});

function radiator(
  id: `room-1.object-${string}`,
  hostSurfaceId:
    | "room-1.wall-front"
    | "room-1.wall-back"
    | "room-1.wall-left"
    | "room-1.wall-right",
  uM: number,
  vM: number,
  widthM = 1,
  heightM = 0.6,
): SceneObject {
  return {
    id,
    kind: "radiator",
    placement: {
      hostSurfaceId,
      uM,
      vM,
      normalOffsetM: 0.04,
      rotationDeg: 0,
    },
    dimensionsM: {
      widthM,
      heightM,
      depthM: 0.12,
    },
    locked: false,
  };
}
