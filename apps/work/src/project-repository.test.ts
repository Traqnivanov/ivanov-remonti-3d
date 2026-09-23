import { describe, expect, it, vi } from "vitest";
import { createDefaultProject } from "./domain";
import {
  ProjectRepositoryError,
  assertOpenedProjectContract,
  prepareNewProjectDraft,
  prepareSaveProject,
  type OpenedProject,
  type ProjectRepository,
} from "./project-repository";

function expectRepositoryError(
  action: () => unknown,
  code: ProjectRepositoryError["code"],
): void {
  try {
    action();
    throw new Error(`Expected ProjectRepositoryError with code ${code}.`);
  } catch (error) {
    expect(error).toBeInstanceOf(ProjectRepositoryError);
    expect((error as ProjectRepositoryError).code).toBe(code);
  }
}

describe("Project repository contract", () => {
  it("prepares a new draft with one canonical generated project id", () => {
    const createId = vi.fn(() => "project-uuid-1");

    const draft = prepareNewProjectDraft("  Апартамент Иванови  ", createId);

    expect(createId).toHaveBeenCalledTimes(1);
    expect(draft.title).toBe("Апартамент Иванови");
    expect(draft.project.projectId).toBe("project-uuid-1");
    expect(draft.project.schemaVersion).toBe(1);
  });

  it("rejects a blank project title before repository I/O", () => {
    expectRepositoryError(
      () => prepareNewProjectDraft("   ", () => "project-uuid-1"),
      "INVALID_INPUT",
    );
  });

  it("prepares a save command with an explicit expected work version", () => {
    const project = createDefaultProject("project-save-1");

    expect(prepareSaveProject(project, 7)).toEqual({
      projectId: "project-save-1",
      expectedWorkVersion: 7,
      project,
    });
  });

  it("rejects invalid optimistic concurrency versions", () => {
    const project = createDefaultProject("project-save-1");

    for (const invalid of [0, -1, 1.5, Number.NaN]) {
      expectRepositoryError(
        () => prepareSaveProject(project, invalid),
        "INVALID_INPUT",
      );
    }
  });

  it("accepts an opened project only when metadata and canonical state agree", () => {
    const project = createDefaultProject("project-open-1");
    const opened: OpenedProject = {
      id: "project-open-1",
      title: "Дневна",
      status: "draft",
      schemaVersion: 1,
      workVersion: 3,
      updatedAt: "2026-09-23T18:00:00.000Z",
      ownerUserId: "owner-user-1",
      createdAt: "2026-09-23T17:00:00.000Z",
      project,
    };

    expect(assertOpenedProjectContract(opened)).toBe(opened);
  });

  it("rejects an opened project when row id and persisted project id diverge", () => {
    const opened: OpenedProject = {
      id: "row-id",
      title: "Дневна",
      status: "draft",
      schemaVersion: 1,
      workVersion: 1,
      updatedAt: "2026-09-23T18:00:00.000Z",
      ownerUserId: "owner-user-1",
      createdAt: "2026-09-23T17:00:00.000Z",
      project: createDefaultProject("different-project-id"),
    };

    expectRepositoryError(
      () => assertOpenedProjectContract(opened),
      "INVALID_INPUT",
    );
  });

  it("defines the Create/List/Open/Save port without requiring Supabase in callers", async () => {
    const opened: OpenedProject = {
      id: "project-1",
      title: "Проект 1",
      status: "draft",
      schemaVersion: 1,
      workVersion: 1,
      updatedAt: "2026-09-23T18:00:00.000Z",
      ownerUserId: "owner-user-1",
      createdAt: "2026-09-23T18:00:00.000Z",
      project: createDefaultProject("project-1"),
    };

    const repository: ProjectRepository = {
      create: vi.fn().mockResolvedValue(opened),
      list: vi.fn().mockResolvedValue([opened]),
      open: vi.fn().mockResolvedValue(opened),
      save: vi.fn().mockResolvedValue({
        projectId: "project-1",
        workVersion: 2,
        updatedAt: "2026-09-23T18:05:00.000Z",
      }),
    };

    await expect(
      repository.create(prepareNewProjectDraft("Проект 1", () => "project-1")),
    ).resolves.toEqual(opened);
    await expect(repository.list()).resolves.toEqual([opened]);
    await expect(repository.open("project-1")).resolves.toEqual(opened);
    await expect(
      repository.save(prepareSaveProject(opened.project, 1)),
    ).resolves.toEqual({
      projectId: "project-1",
      workVersion: 2,
      updatedAt: "2026-09-23T18:05:00.000Z",
    });
  });
});
