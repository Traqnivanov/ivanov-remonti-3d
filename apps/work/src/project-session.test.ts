import { describe, expect, it, vi } from "vitest";
import { createDefaultProject } from "./domain";
import {
  ProjectRepositoryError,
  type OpenedProject,
  type ProjectRepository,
} from "./project-repository";
import {
  ProjectSessionError,
  applyProjectHistoryEdit,
  applyProjectSaveFailure,
  applyProjectSaveSuccess,
  beginProjectSave,
  canSaveProject,
  createProjectSession,
  loadProjectStartup,
  markProjectDirty,
  shouldWarnBeforeProjectSwitch,
} from "./project-session";

function openedProject(
  id = "project-1",
  workVersion = 1,
): OpenedProject {
  return {
    id,
    title: "Проект 1",
    status: "draft",
    schemaVersion: 1,
    workVersion,
    updatedAt: "2026-09-24T18:00:00.000Z",
    ownerUserId: "owner-1",
    createdAt: "2026-09-24T17:00:00.000Z",
    project: createDefaultProject(id),
  };
}

function mockRepository(
  options: {
    list?: ReturnType<ProjectRepository["list"]> extends Promise<infer T>
      ? T
      : never;
    open?: OpenedProject;
  } = {},
): ProjectRepository {
  const list = options.list ?? [];
  const open = options.open ?? openedProject();

  return {
    create: vi.fn(),
    list: vi.fn().mockResolvedValue(list),
    open: vi.fn().mockResolvedValue(open),
    save: vi.fn(),
  };
}

describe("Project Session startup", () => {
  it("requires a new project when the authorized user has no projects", async () => {
    const repository = mockRepository({ list: [] });

    await expect(loadProjectStartup(repository)).resolves.toEqual({
      kind: "new-project",
    });
    expect(repository.open).not.toHaveBeenCalled();
  });

  it("auto-opens the only available project", async () => {
    const opened = openedProject("project-only", 4);
    const repository = mockRepository({
      list: [
        {
          id: "project-only",
          title: "Само един",
          status: "draft",
          schemaVersion: 1,
          workVersion: 4,
          updatedAt: opened.updatedAt,
        },
      ],
      open: opened,
    });

    const result = await loadProjectStartup(repository);

    expect(repository.open).toHaveBeenCalledWith("project-only");
    expect(result).toMatchObject({
      kind: "ready",
      session: {
        projectId: "project-only",
        workVersion: 4,
        saveState: "clean",
      },
    });
  });

  it("asks the user to choose when two or more projects exist", async () => {
    const projects = [
      {
        id: "project-2",
        title: "Втори",
        status: "active" as const,
        schemaVersion: 1,
        workVersion: 3,
        updatedAt: "2026-09-24T19:00:00.000Z",
      },
      {
        id: "project-1",
        title: "Първи",
        status: "draft" as const,
        schemaVersion: 1,
        workVersion: 2,
        updatedAt: "2026-09-24T18:00:00.000Z",
      },
    ];
    const repository = mockRepository({ list: projects });

    await expect(loadProjectStartup(repository)).resolves.toEqual({
      kind: "choose-project",
      projects,
    });
    expect(repository.open).not.toHaveBeenCalled();
  });
});

describe("Project Session dirty/save state", () => {
  it("starts clean and does not warn before switching projects", () => {
    const session = createProjectSession(openedProject());

    expect(session.saveState).toBe("clean");
    expect(canSaveProject(session)).toBe(false);
    expect(shouldWarnBeforeProjectSwitch(session)).toBe(false);
  });

  it("marks Work authoring changes dirty", () => {
    const session = markProjectDirty(
      createProjectSession(openedProject()),
    );

    expect(session.saveState).toBe("dirty");
    expect(session.editRevision).toBe(1);
    expect(canSaveProject(session)).toBe(true);
    expect(shouldWarnBeforeProjectSwitch(session)).toBe(true);
  });

  it("can return to a saved history revision without a false dirty warning", () => {
    const original = createProjectSession(openedProject("history-session", 2));
    const editedProject = structuredClone(original.project);
    editedProject.room.widthM = 5;

    let session = applyProjectHistoryEdit(original, editedProject, false);
    expect(session.saveState).toBe("dirty");
    expect(shouldWarnBeforeProjectSwitch(session)).toBe(true);

    session = applyProjectHistoryEdit(session, structuredClone(original.project), true);

    expect(session.project.room.widthM).toBe(4.2);
    expect(session.saveState).toBe("clean");
    expect(session.savedEditRevision).toBe(session.editRevision);
    expect(shouldWarnBeforeProjectSwitch(session)).toBe(false);
  });

  it("clears a retryable save error when undo returns to the saved project state", () => {
    const original = createProjectSession(openedProject("history-error", 2));
    let session = markProjectDirty(original);
    session = beginProjectSave(session).session;
    session = applyProjectSaveFailure(session, new Error("Network unavailable"));

    const restored = applyProjectHistoryEdit(
      session,
      structuredClone(original.project),
      true,
    );

    expect(restored.saveState).toBe("clean");
    expect(restored.lastError).toBeNull();
    expect(canSaveProject(restored)).toBe(false);
    expect(shouldWarnBeforeProjectSwitch(restored)).toBe(false);
  });

  it("does not clear conflict state merely because local history matches an older saved revision", () => {
    const original = createProjectSession(openedProject("history-conflict", 2));
    let session = markProjectDirty(original);
    session = beginProjectSave(session).session;
    session = applyProjectSaveFailure(
      session,
      new ProjectRepositoryError("STALE_WRITE", "stale"),
    );

    const restored = applyProjectHistoryEdit(
      session,
      structuredClone(original.project),
      true,
    );

    expect(restored.saveState).toBe("conflict");
    expect(canSaveProject(restored)).toBe(false);
  });

  it("begins save with the current work version", () => {
    let session = createProjectSession(openedProject("project-save", 7));
    session.project.room.widthM = 5.3;
    session = markProjectDirty(session);

    const begun = beginProjectSave(session);

    expect(begun.session.saveState).toBe("saving");
    expect(begun.session.savingEditRevision).toBe(1);
    expect(begun.input).toEqual({
      projectId: "project-save",
      expectedWorkVersion: 7,
      project: session.project,
    });
  });

  it("becomes clean after a successful save with no newer local edits", () => {
    let session = createProjectSession(openedProject("project-save", 1));
    session = markProjectDirty(session);
    session = beginProjectSave(session).session;

    const saved = applyProjectSaveSuccess(session, {
      projectId: "project-save",
      workVersion: 2,
      updatedAt: "2026-09-24T20:00:00.000Z",
    });

    expect(saved.saveState).toBe("clean");
    expect(saved.workVersion).toBe(2);
    expect(saved.savedEditRevision).toBe(1);
    expect(saved.savingEditRevision).toBeNull();
    expect(canSaveProject(saved)).toBe(false);
    expect(shouldWarnBeforeProjectSwitch(saved)).toBe(false);
  });

  it("remains dirty when the user edits again while the previous save is in flight", () => {
    let session = createProjectSession(openedProject("project-save", 1));
    session = markProjectDirty(session);
    session = beginProjectSave(session).session;

    session.project.room.heightM = 2.8;
    session = markProjectDirty(session);

    const saved = applyProjectSaveSuccess(session, {
      projectId: "project-save",
      workVersion: 2,
      updatedAt: "2026-09-24T20:00:00.000Z",
    });

    expect(saved.saveState).toBe("dirty");
    expect(saved.workVersion).toBe(2);
    expect(saved.savedEditRevision).toBe(1);
    expect(saved.editRevision).toBe(2);
    expect(canSaveProject(saved)).toBe(true);
    expect(shouldWarnBeforeProjectSwitch(saved)).toBe(true);
  });

  it("keeps local edits and enters conflict after STALE_WRITE", () => {
    let session = createProjectSession(openedProject("project-stale", 2));
    session.project.room.lengthM = 5.2;
    session = markProjectDirty(session);
    session = beginProjectSave(session).session;

    const conflicted = applyProjectSaveFailure(
      session,
      new ProjectRepositoryError(
        "STALE_WRITE",
        "Project changed since it was opened.",
      ),
    );

    expect(conflicted.saveState).toBe("conflict");
    expect(conflicted.project.room.lengthM).toBe(5.2);
    expect(conflicted.workVersion).toBe(2);
    expect(canSaveProject(conflicted)).toBe(false);
    expect(shouldWarnBeforeProjectSwitch(conflicted)).toBe(true);
  });

  it("keeps local edits retryable after a generic save error", () => {
    let session = createProjectSession(openedProject("project-error", 2));
    session = markProjectDirty(session);
    session = beginProjectSave(session).session;

    const failed = applyProjectSaveFailure(
      session,
      new Error("Network unavailable"),
    );

    expect(failed.saveState).toBe("error");
    expect(failed.lastError).toBe("Network unavailable");
    expect(canSaveProject(failed)).toBe(true);
    expect(shouldWarnBeforeProjectSwitch(failed)).toBe(true);
  });

  it("blocks save when there are no unsaved changes", () => {
    const session = createProjectSession(openedProject());

    expect(() => beginProjectSave(session)).toThrowError(
      ProjectSessionError,
    );
    try {
      beginProjectSave(session);
    } catch (error) {
      expect((error as ProjectSessionError).code).toBe(
        "SAVE_NOT_NEEDED",
      );
    }
  });

  it("blocks another save while one is already in progress", () => {
    let session = createProjectSession(openedProject());
    session = markProjectDirty(session);
    session = beginProjectSave(session).session;

    expect(() => beginProjectSave(session)).toThrowError(
      ProjectSessionError,
    );
    try {
      beginProjectSave(session);
    } catch (error) {
      expect((error as ProjectSessionError).code).toBe(
        "SAVE_IN_PROGRESS",
      );
    }
  });

  it("blocks blind retry after a stale conflict", () => {
    let session = createProjectSession(openedProject("project-stale", 2));
    session = markProjectDirty(session);
    session = beginProjectSave(session).session;
    session = applyProjectSaveFailure(
      session,
      new ProjectRepositoryError("STALE_WRITE", "stale"),
    );

    expect(() => beginProjectSave(session)).toThrowError(
      ProjectSessionError,
    );
    try {
      beginProjectSave(session);
    } catch (error) {
      expect((error as ProjectSessionError).code).toBe(
        "SAVE_BLOCKED_BY_CONFLICT",
      );
    }
  });

  it("rejects a save result for another project or unexpected version", () => {
    let session = createProjectSession(openedProject("project-a", 3));
    session = markProjectDirty(session);
    session = beginProjectSave(session).session;

    expect(() =>
      applyProjectSaveSuccess(session, {
        projectId: "project-b",
        workVersion: 4,
        updatedAt: "2026-09-24T20:00:00.000Z",
      }),
    ).toThrowError(ProjectSessionError);

    expect(() =>
      applyProjectSaveSuccess(session, {
        projectId: "project-a",
        workVersion: 5,
        updatedAt: "2026-09-24T20:00:00.000Z",
      }),
    ).toThrowError(ProjectSessionError);
  });
});
