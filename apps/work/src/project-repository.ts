import { createDefaultProject, type ProjectState } from "./domain";
import { CURRENT_PROJECT_SCHEMA_VERSION } from "./persistence";

export type ProjectStatus = "draft" | "active" | "archived";

export type ProjectListItem = {
  id: string;
  title: string;
  status: ProjectStatus;
  schemaVersion: number;
  workVersion: number;
  updatedAt: string;
};

export type OpenedProject = ProjectListItem & {
  ownerUserId: string;
  createdAt: string;
  project: ProjectState;
};

export type CreateProjectInput = {
  title: string;
  project: ProjectState;
};

export type SaveProjectInput = {
  projectId: string;
  expectedWorkVersion: number;
  project: ProjectState;
};

export type SaveProjectResult = {
  projectId: string;
  workVersion: number;
  updatedAt: string;
};

export interface ProjectRepository {
  create(input: CreateProjectInput): Promise<OpenedProject>;
  list(): Promise<ProjectListItem[]>;
  open(projectId: string): Promise<OpenedProject>;
  save(input: SaveProjectInput): Promise<SaveProjectResult>;
}

export class ProjectRepositoryError extends Error {
  constructor(
    public readonly code:
      | "INVALID_INPUT"
      | "NOT_FOUND"
      | "ACCESS_DENIED"
      | "STALE_WRITE"
      | "STORAGE_FAILURE",
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ProjectRepositoryError";
  }
}

export function prepareNewProjectDraft(
  title: string,
  createProjectId: () => string = () => crypto.randomUUID(),
): CreateProjectInput {
  const normalizedTitle = requireNonBlank(title, "Project title");
  const projectId = requireNonBlank(createProjectId(), "Project id");

  return {
    title: normalizedTitle,
    project: createDefaultProject(projectId),
  };
}

export function prepareSaveProject(
  project: ProjectState,
  expectedWorkVersion: number,
): SaveProjectInput {
  const projectId = requireNonBlank(project.projectId, "Project id");

  if (
    !Number.isSafeInteger(expectedWorkVersion) ||
    expectedWorkVersion < 1
  ) {
    throw new ProjectRepositoryError(
      "INVALID_INPUT",
      "Expected work version must be a positive safe integer.",
    );
  }

  return {
    projectId,
    expectedWorkVersion,
    project,
  };
}

export function assertOpenedProjectContract(
  opened: OpenedProject,
): OpenedProject {
  requireNonBlank(opened.id, "Opened project id");
  requireNonBlank(opened.ownerUserId, "Opened project owner");
  requireNonBlank(opened.title, "Opened project title");

  if (opened.id !== opened.project.projectId) {
    throw new ProjectRepositoryError(
      "INVALID_INPUT",
      "Opened project metadata id does not match project state id.",
    );
  }

  if (
    opened.schemaVersion !== CURRENT_PROJECT_SCHEMA_VERSION ||
    opened.project.schemaVersion !== CURRENT_PROJECT_SCHEMA_VERSION
  ) {
    throw new ProjectRepositoryError(
      "INVALID_INPUT",
      "Opened project schema version is not supported by the current Work app.",
    );
  }

  if (!Number.isSafeInteger(opened.workVersion) || opened.workVersion < 1) {
    throw new ProjectRepositoryError(
      "INVALID_INPUT",
      "Opened project work version must be a positive safe integer.",
    );
  }

  return opened;
}

function requireNonBlank(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new ProjectRepositoryError(
      "INVALID_INPUT",
      `${label} must not be blank.`,
    );
  }
  return normalized;
}
