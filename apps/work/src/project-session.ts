import type { ProjectState } from "./domain";
import {
  ProjectRepositoryError,
  prepareSaveProject,
  type OpenedProject,
  type ProjectListItem,
  type ProjectRepository,
  type SaveProjectInput,
  type SaveProjectResult,
} from "./project-repository";

export type ProjectSaveState =
  | "clean"
  | "dirty"
  | "saving"
  | "error"
  | "conflict";

export type ProjectSession = {
  projectId: string;
  title: string;
  project: ProjectState;
  workVersion: number;
  updatedAt: string;
  saveState: ProjectSaveState;
  editRevision: number;
  savedEditRevision: number;
  savingEditRevision: number | null;
  lastError: string | null;
};

export type ProjectStartup =
  | { kind: "new-project" }
  | { kind: "ready"; session: ProjectSession }
  | { kind: "choose-project"; projects: ProjectListItem[] };

export type BeginProjectSaveResult = {
  session: ProjectSession;
  input: SaveProjectInput;
};

export class ProjectSessionError extends Error {
  constructor(
    public readonly code:
      | "SAVE_NOT_NEEDED"
      | "SAVE_IN_PROGRESS"
      | "SAVE_BLOCKED_BY_CONFLICT"
      | "SAVE_RESULT_MISMATCH",
    message: string,
  ) {
    super(message);
    this.name = "ProjectSessionError";
  }
}

export async function loadProjectStartup(
  repository: ProjectRepository,
): Promise<ProjectStartup> {
  const projects = await repository.list();

  if (projects.length === 0) {
    return { kind: "new-project" };
  }

  if (projects.length === 1) {
    const onlyProject = projects[0];
    if (!onlyProject) {
      throw new Error("Project list reported one item but none was available.");
    }

    const opened = await repository.open(onlyProject.id);
    return {
      kind: "ready",
      session: createProjectSession(opened),
    };
  }

  return {
    kind: "choose-project",
    projects,
  };
}

export function createProjectSession(
  opened: OpenedProject,
): ProjectSession {
  return {
    projectId: opened.id,
    title: opened.title,
    project: opened.project,
    workVersion: opened.workVersion,
    updatedAt: opened.updatedAt,
    saveState: "clean",
    editRevision: 0,
    savedEditRevision: 0,
    savingEditRevision: null,
    lastError: null,
  };
}

export function markProjectDirty(
  session: ProjectSession,
): ProjectSession {
  const editRevision = session.editRevision + 1;

  return {
    ...session,
    editRevision,
    saveState:
      session.saveState === "clean"
        ? "dirty"
        : session.saveState,
  };
}

export function canSaveProject(session: ProjectSession): boolean {
  return session.saveState === "dirty" || session.saveState === "error";
}

export function shouldWarnBeforeProjectSwitch(
  session: ProjectSession,
): boolean {
  return session.editRevision !== session.savedEditRevision;
}

export function beginProjectSave(
  session: ProjectSession,
): BeginProjectSaveResult {
  if (session.saveState === "saving") {
    throw new ProjectSessionError(
      "SAVE_IN_PROGRESS",
      "A project save is already in progress.",
    );
  }

  if (session.saveState === "conflict") {
    throw new ProjectSessionError(
      "SAVE_BLOCKED_BY_CONFLICT",
      "Reload the latest project version before saving again.",
    );
  }

  if (!canSaveProject(session)) {
    throw new ProjectSessionError(
      "SAVE_NOT_NEEDED",
      "The project has no unsaved changes.",
    );
  }

  return {
    session: {
      ...session,
      saveState: "saving",
      savingEditRevision: session.editRevision,
      lastError: null,
    },
    input: prepareSaveProject(session.project, session.workVersion),
  };
}

export function applyProjectSaveSuccess(
  session: ProjectSession,
  result: SaveProjectResult,
): ProjectSession {
  if (session.saveState !== "saving" || session.savingEditRevision === null) {
    throw new ProjectSessionError(
      "SAVE_RESULT_MISMATCH",
      "Received a save result without a matching in-flight save.",
    );
  }

  if (result.projectId !== session.projectId) {
    throw new ProjectSessionError(
      "SAVE_RESULT_MISMATCH",
      "Saved project id does not match the active project session.",
    );
  }

  if (result.workVersion !== session.workVersion + 1) {
    throw new ProjectSessionError(
      "SAVE_RESULT_MISMATCH",
      "Saved project version does not match the expected next version.",
    );
  }

  const savedEditRevision = session.savingEditRevision;
  const hasNewerLocalChanges = session.editRevision > savedEditRevision;

  return {
    ...session,
    workVersion: result.workVersion,
    updatedAt: result.updatedAt,
    saveState: hasNewerLocalChanges ? "dirty" : "clean",
    savedEditRevision,
    savingEditRevision: null,
    lastError: null,
  };
}

export function applyProjectSaveFailure(
  session: ProjectSession,
  error: unknown,
): ProjectSession {
  if (session.saveState !== "saving" || session.savingEditRevision === null) {
    throw new ProjectSessionError(
      "SAVE_RESULT_MISMATCH",
      "Received a save failure without a matching in-flight save.",
    );
  }

  const conflict =
    error instanceof ProjectRepositoryError &&
    error.code === "STALE_WRITE";

  return {
    ...session,
    saveState: conflict ? "conflict" : "error",
    savingEditRevision: null,
    lastError: conflict
      ? "Project changed on the server."
      : errorMessage(error),
  };
}

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return "Project save failed.";
}
