import { describe, expect, it } from "vitest";
import { createDefaultProject, createOpeningProofProject, findLaminateFlooringAssignment, getFinePuttyAssignment, getLaminateFlooringAssignment } from "./domain";
import {
  CURRENT_PROJECT_SCHEMA_VERSION,
  ProjectPersistenceError,
  deserializeProjectState,
  parseAndMigrateProjectState,
  serializeProjectState,
} from "./persistence";

describe("project persistence boundary", () => {
  it("serializes the current project into the generalized persisted v1 shape", () => {
    const project = createDefaultProject("project-123");
    const persisted = serializeProjectState(project);

    expect(persisted.schemaVersion).toBe(CURRENT_PROJECT_SCHEMA_VERSION);
    expect(persisted.projectId).toBe("project-123");
    expect(persisted.rooms).toHaveLength(1);
    expect(persisted.rooms[0]!.geometry).toEqual({
      widthM: 4.2,
      lengthM: 4.8,
      heightM: 2.6,
    });
    expect(persisted.rooms[0]!.openings).toEqual([]);
    expect(persisted.rooms[0]!.objects).toEqual([]);
    expect(persisted.rooms[0]!.materials).toEqual([]);
    expect(persisted.serviceAssignments).toHaveLength(2);
    expect(persisted.projectNotes).toEqual([]);
    expect(persisted.presentation).toEqual({});
    expect(persisted).not.toHaveProperty("camera");
    expect(persisted).not.toHaveProperty("selectedEntity");
  });

  it("round-trips the current canonical Work state without changing it", () => {
    const project = createDefaultProject("project-round-trip");
    project.room.widthM = 5.1;
    project.room.lengthM = 3.7;
    getFinePuttyAssignment(project).targetEntityIds = [
      "room-1.wall-front",
      "room-1.wall-left",
    ];

    const restored = deserializeProjectState(serializeProjectState(project));

    expect(restored).toEqual(project);
  });

  it("round-trips canonical door and window openings with stable ids", () => {
    const project = createDefaultProject("opening-round-trip");
    project.room.openings = [
      {
        id: "room-1.door-1",
        kind: "door",
        hostSurfaceId: "room-1.wall-front",
        widthM: 0.9,
        heightM: 2.1,
        offsetM: 0.35,
      },
      {
        id: "room-1.window-1",
        kind: "window",
        hostSurfaceId: "room-1.wall-right",
        widthM: 1.2,
        heightM: 1.1,
        offsetM: 1.4,
        sillM: 0.9,
      },
    ];

    const restored = deserializeProjectState(serializeProjectState(project));

    expect(restored.room.openings).toEqual(project.room.openings);
    expect(restored.room.openings.map((opening) => opening.id)).toEqual([
      "room-1.door-1",
      "room-1.window-1",
    ]);
  });

  it("keeps old persisted projects with openings: [] valid without injecting openings", () => {
    const persisted = serializeProjectState(createDefaultProject("old-empty-openings"));

    const restored = deserializeProjectState(persisted);

    expect(restored.room.openings).toEqual([]);
  });

  it("migrates the legacy Fine Putty wall-area-v1 rule to the canonical net-area rule on load", () => {
    const persisted = serializeProjectState(createDefaultProject("legacy-fine-putty-rule"));
    const finePutty = persisted.serviceAssignments.find(
      (assignment) => assignment.id === "assignment-fine-putty-1",
    );
    if (!finePutty) throw new Error("Missing Fine Putty assignment.");
    finePutty.quantityRuleId = "wall-area-v1";

    const migrated = parseAndMigrateProjectState(persisted);
    const migratedFinePutty = migrated.serviceAssignments.find(
      (assignment) => assignment.id === "assignment-fine-putty-1",
    );
    const restored = deserializeProjectState(persisted);

    expect(migratedFinePutty?.quantityRuleId).toBe(
      "wall-net-area-openings-v1",
    );
    expect(getFinePuttyAssignment(restored).quantityRuleId).toBe(
      "wall-net-area-openings-v1",
    );
  });

    it("keeps an existing Fine Putty-only persisted v1 project valid without injecting Laminate", () => {
    const persisted = serializeProjectState(createDefaultProject("existing-v1-project"));
    persisted.serviceAssignments = persisted.serviceAssignments.filter(
      (assignment) => assignment.serviceCode === "fine-putty",
    );

    const restored = deserializeProjectState(persisted);

    expect(restored.serviceAssignments).toHaveLength(1);
    expect(getFinePuttyAssignment(restored).serviceCode).toBe("fine-putty");
    expect(findLaminateFlooringAssignment(restored)).toBeUndefined();
  });

  it("round-trips multiple runtime service assignments without changing the canonical Fine Putty assignment", () => {
    const project = createDefaultProject("multi-assignment-project");
    project.serviceAssignments.push({
      id: "assignment-p3-1a-foundation-2",
      serviceCode: "p3-1a-foundation-test",
      label: "P3.1a foundation test",
      targetEntityIds: ["room-1.floor"],
      included: true,
      quantityRuleId: "surface-area-foundation-test",
      priceBookItemId: "dev-p3-1a-foundation-test",
      presentationMode: "material",
      clientInfo: {
        what: "Foundation-only test assignment.",
        why: "Proves runtime multi-assignment round-trip.",
        result: "No visible product expansion.",
        includes: "Persistence/runtime foundation only.",
      },
    });

    const restored = deserializeProjectState(serializeProjectState(project));

    expect(restored.serviceAssignments).toEqual(project.serviceAssignments);
    expect(getFinePuttyAssignment(restored)).toEqual(
      getFinePuttyAssignment(project),
    );
  });

  it("preserves stable proof opening ids through persistence", () => {
    const project = createOpeningProofProject("stable-opening-project");
    const restored = deserializeProjectState(serializeProjectState(project));

    expect(restored.room.openings.map((opening) => opening.id)).toEqual([
      "room-1.door-1",
      "room-1.window-1",
    ]);
  });

  it("preserves stable surface and service target ids", () => {
    const project = createDefaultProject("stable-id-project");
    const persisted = serializeProjectState(project);
    const parsed = parseAndMigrateProjectState(persisted);

    expect(parsed.rooms[0]!.surfaces.map((surface) => surface.id)).toEqual([
      "room-1.wall-front",
      "room-1.wall-back",
      "room-1.wall-left",
      "room-1.wall-right",
      "room-1.floor",
      "room-1.ceiling",
    ]);
    expect(parsed.serviceAssignments[0]!.targetEntityIds).toEqual(
      getFinePuttyAssignment(project).targetEntityIds,
    );
    expect(parsed.serviceAssignments[1]!.targetEntityIds).toEqual(
      getLaminateFlooringAssignment(project).targetEntityIds,
    );
  });

  it("rejects unsupported future schema versions instead of guessing", () => {
    const future = {
      ...serializeProjectState(createDefaultProject()),
      schemaVersion: 2,
    };

    expectPersistenceError(
      () => parseAndMigrateProjectState(future),
      "UNSUPPORTED_SCHEMA_VERSION",
    );
  });

  it("rejects malformed persisted geometry", () => {
    const malformed = serializeProjectState(createDefaultProject());
    malformed.rooms[0]!.geometry.widthM = 0;

    expectPersistenceError(() => parseAndMigrateProjectState(malformed), "INVALID_STATE");
  });

  it("rejects an opening whose host is not an existing wall", () => {
    const malformed = serializeProjectState(createDefaultProject());
    malformed.rooms[0]!.openings.push({
      id: "room-1.window-invalid-host",
      kind: "window",
      hostSurfaceId: "room-1.floor",
      widthM: 1,
      heightM: 1,
      offsetM: 0.5,
      sillM: 0.8,
    });

    expectPersistenceError(
      () => parseAndMigrateProjectState(malformed),
      "INVALID_STATE",
    );
  });

  it("rejects an opening that exceeds its host wall horizontally", () => {
    const malformed = serializeProjectState(createDefaultProject());
    malformed.rooms[0]!.openings.push({
      id: "room-1.door-too-wide",
      kind: "door",
      hostSurfaceId: "room-1.wall-front",
      widthM: 1,
      heightM: 2.1,
      offsetM: 3.5,
    });

    expectPersistenceError(
      () => parseAndMigrateProjectState(malformed),
      "INVALID_STATE",
    );
  });

  it("rejects an opening that exceeds room height", () => {
    const malformed = serializeProjectState(createDefaultProject());
    malformed.rooms[0]!.openings.push({
      id: "room-1.window-too-high",
      kind: "window",
      hostSurfaceId: "room-1.wall-back",
      widthM: 1,
      heightM: 1.2,
      offsetM: 0.5,
      sillM: 1.5,
    });

    expectPersistenceError(
      () => parseAndMigrateProjectState(malformed),
      "INVALID_STATE",
    );
  });

  it("rejects duplicate opening ids", () => {
    const malformed = serializeProjectState(createDefaultProject());
    const opening = {
      id: "room-1.window-duplicate",
      kind: "window" as const,
      hostSurfaceId: "room-1.wall-back",
      widthM: 1,
      heightM: 1,
      offsetM: 0.4,
      sillM: 0.8,
    };
    malformed.rooms[0]!.openings.push(opening, {
      ...opening,
      hostSurfaceId: "room-1.wall-left",
      offsetM: 1.8,
    });

    expectPersistenceError(
      () => parseAndMigrateProjectState(malformed),
      "INVALID_STATE",
    );
  });

  it("rejects overlapping openings on the same wall", () => {
    const malformed = serializeProjectState(createDefaultProject());
    malformed.rooms[0]!.openings.push(
      {
        id: "room-1.window-overlap-a",
        kind: "window",
        hostSurfaceId: "room-1.wall-right",
        widthM: 1.3,
        heightM: 1.1,
        offsetM: 0.6,
        sillM: 0.8,
      },
      {
        id: "room-1.window-overlap-b",
        kind: "window",
        hostSurfaceId: "room-1.wall-right",
        widthM: 1,
        heightM: 1,
        offsetM: 1.2,
        sillM: 0.9,
      },
    );

    expectPersistenceError(
      () => parseAndMigrateProjectState(malformed),
      "INVALID_STATE",
    );
  });

  it("accepts adjacent non-overlapping openings on the same wall", () => {
    const persisted = serializeProjectState(createDefaultProject());
    persisted.rooms[0]!.openings.push(
      {
        id: "room-1.door-adjacent",
        kind: "door",
        hostSurfaceId: "room-1.wall-front",
        widthM: 0.9,
        heightM: 2.1,
        offsetM: 0.2,
      },
      {
        id: "room-1.window-adjacent",
        kind: "window",
        hostSurfaceId: "room-1.wall-front",
        widthM: 1,
        heightM: 1,
        offsetM: 1.1,
        sillM: 0.9,
      },
    );

    expect(() => deserializeProjectState(persisted)).not.toThrow();
  });

  it("accepts a generalized persisted document but refuses runtime shapes not yet supported", () => {
    const generalized = serializeProjectState(createDefaultProject());
    const firstRoom = generalized.rooms[0]!;
    generalized.rooms.push({
      ...firstRoom,
      id: "room-2",
      name: "Втора стая",
      surfaces: firstRoom.surfaces.map((surface) => ({
        ...surface,
        id: surface.id.replace("room-1", "room-2"),
      })),
    });

    expect(parseAndMigrateProjectState(generalized).rooms).toHaveLength(2);
    expectPersistenceError(
      () => deserializeProjectState(generalized),
      "UNSUPPORTED_RUNTIME_SHAPE",
    );
  });

  it("returns detached persisted data instead of sharing mutable runtime arrays", () => {
    const project = createDefaultProject();
    project.room.openings.push({
      id: "room-1.window-detached",
      kind: "window",
      hostSurfaceId: "room-1.wall-left",
      widthM: 1,
      heightM: 1,
      offsetM: 0.8,
      sillM: 0.9,
    });
    const persisted = serializeProjectState(project);

    persisted.rooms[0]!.surfaces[0]!.label = "Changed only in persisted copy";
    persisted.rooms[0]!.openings[0]!.widthM = 2;
    persisted.serviceAssignments[0]!.targetEntityIds.length = 0;

    expect(project.room.surfaces[0]!.label).toBe("Предна стена");
    expect(project.room.openings[0]!.widthM).toBe(1);
    expect(getFinePuttyAssignment(project).targetEntityIds).toHaveLength(4);
    expect(getLaminateFlooringAssignment(project).targetEntityIds).toEqual([
      "room-1.floor",
    ]);
  });
});


function expectPersistenceError(
  action: () => unknown,
  code: ProjectPersistenceError["code"],
): void {
  try {
    action();
    throw new Error(`Expected ProjectPersistenceError with code ${code}.`);
  } catch (error) {
    expect(error).toBeInstanceOf(ProjectPersistenceError);
    expect((error as ProjectPersistenceError).code).toBe(code);
  }
}
