import { describe, expect, it } from "vitest";
import { createDefaultProject } from "./domain";
import {
  CURRENT_PROJECT_SCHEMA_VERSION,
  ProjectPersistenceError,
  deserializeProjectState,
  parseAndMigrateProjectState,
  serializeProjectState,
} from "./persistence";

describe("project persistence boundary", () => {
  it("serializes the First Slice into the generalized persisted v1 shape", () => {
    const project = createDefaultProject("project-123");
    const persisted = serializeProjectState(project);

    expect(persisted.schemaVersion).toBe(CURRENT_PROJECT_SCHEMA_VERSION);
    expect(persisted.projectId).toBe("project-123");
    expect(persisted.rooms).toHaveLength(1);
    expect(persisted.rooms[0].geometry).toEqual({
      widthM: 4.2,
      lengthM: 4.8,
      heightM: 2.6,
    });
    expect(persisted.rooms[0].openings).toEqual([]);
    expect(persisted.rooms[0].objects).toEqual([]);
    expect(persisted.rooms[0].materials).toEqual([]);
    expect(persisted.serviceAssignments).toHaveLength(1);
    expect(persisted.projectNotes).toEqual([]);
    expect(persisted.presentation).toEqual({});
    expect(persisted).not.toHaveProperty("camera");
    expect(persisted).not.toHaveProperty("selectedEntity");
  });

  it("round-trips the current canonical Work state without changing it", () => {
    const project = createDefaultProject("project-round-trip");
    project.room.widthM = 5.1;
    project.room.lengthM = 3.7;
    project.serviceAssignment.targetEntityIds = [
      "room-1.wall-front",
      "room-1.wall-left",
    ];

    const restored = deserializeProjectState(serializeProjectState(project));

    expect(restored).toEqual(project);
  });

  it("preserves stable surface and service target ids", () => {
    const project = createDefaultProject("stable-id-project");
    const persisted = serializeProjectState(project);
    const parsed = parseAndMigrateProjectState(persisted);

    expect(parsed.rooms[0].surfaces.map((surface) => surface.id)).toEqual([
      "room-1.wall-front",
      "room-1.wall-back",
      "room-1.wall-left",
      "room-1.wall-right",
      "room-1.floor",
      "room-1.ceiling",
    ]);
    expect(parsed.serviceAssignments[0].targetEntityIds).toEqual(
      project.serviceAssignment.targetEntityIds,
    );
  });

  it("rejects unsupported future schema versions instead of guessing", () => {
    const future = {
      ...serializeProjectState(createDefaultProject()),
      schemaVersion: 2,
    };

    expect(() => parseAndMigrateProjectState(future)).toThrowError(
      expect.objectContaining<ProjectPersistenceError>({
        code: "UNSUPPORTED_SCHEMA_VERSION",
      }),
    );
  });

  it("rejects malformed persisted geometry", () => {
    const malformed = serializeProjectState(createDefaultProject());
    malformed.rooms[0].geometry.widthM = 0;

    expect(() => parseAndMigrateProjectState(malformed)).toThrowError(
      expect.objectContaining<ProjectPersistenceError>({
        code: "INVALID_STATE",
      }),
    );
  });

  it("accepts a generalized persisted document but refuses runtime shapes not yet supported", () => {
    const generalized = serializeProjectState(createDefaultProject());
    generalized.rooms.push({
      ...generalized.rooms[0],
      id: "room-2",
      name: "Втора стая",
      surfaces: generalized.rooms[0].surfaces.map((surface) => ({
        ...surface,
        id: surface.id.replace("room-1", "room-2"),
      })),
    });

    expect(parseAndMigrateProjectState(generalized).rooms).toHaveLength(2);
    expect(() => deserializeProjectState(generalized)).toThrowError(
      expect.objectContaining<ProjectPersistenceError>({
        code: "UNSUPPORTED_RUNTIME_SHAPE",
      }),
    );
  });

  it("returns detached persisted data instead of sharing mutable runtime arrays", () => {
    const project = createDefaultProject();
    const persisted = serializeProjectState(project);

    persisted.rooms[0].surfaces[0].label = "Changed only in persisted copy";
    persisted.serviceAssignments[0].targetEntityIds.length = 0;

    expect(project.room.surfaces[0].label).toBe("Предна стена");
    expect(project.serviceAssignment.targetEntityIds).toHaveLength(4);
  });
});
