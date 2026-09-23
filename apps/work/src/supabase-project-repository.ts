import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ProjectRepositoryError,
  assertOpenedProjectContract,
  type CreateProjectInput,
  type OpenedProject,
  type ProjectListItem,
  type ProjectRepository,
  type ProjectStatus,
  type SaveProjectInput,
  type SaveProjectResult,
} from "./project-repository";
import {
  CURRENT_PROJECT_SCHEMA_VERSION,
  deserializeProjectState,
  serializeProjectState,
} from "./persistence";

type SupabaseProjectRepository = Pick<
  ProjectRepository,
  "create" | "list" | "open" | "save"
>;

type ProjectRow = {
  id: string;
  title: string;
  owner_user_id: string;
  status: string;
  schema_version: number;
  work_version: number;
  work_state: unknown;
  created_at: string;
  updated_at: string;
};

type ProjectListRow = Omit<
  ProjectRow,
  "owner_user_id" | "work_state" | "created_at"
>;

type ProjectSaveRow = {
  id: string;
  work_version: number;
  updated_at: string;
};

type ProjectVersionRow = {
  id: string;
  work_version: number;
};

const PROJECT_ROW_COLUMNS =
  "id, title, owner_user_id, status, schema_version, work_version, work_state, created_at, updated_at";

const PROJECT_LIST_COLUMNS =
  "id, title, status, schema_version, work_version, updated_at";

export function createSupabaseProjectReadRepository(
  client: SupabaseClient,
  ownerUserId: string,
): SupabaseProjectRepository {
  const normalizedOwnerUserId = requireNonBlank(
    ownerUserId,
    "Owner user id",
  );

  return {
    async create(input: CreateProjectInput): Promise<OpenedProject> {
      const title = requireNonBlank(input.title, "Project title");
      const projectId = requireNonBlank(
        input.project.projectId,
        "Project id",
      );

      const workState = serializeProjectState(input.project);

      const { data, error } = await client
        .from("projects")
        .insert({
          id: projectId,
          title,
          owner_user_id: normalizedOwnerUserId,
          status: "draft",
          schema_version: CURRENT_PROJECT_SCHEMA_VERSION,
          work_version: 1,
          work_state: workState,
        })
        .select(PROJECT_ROW_COLUMNS)
        .single<ProjectRow>();

      if (error || !data) {
        throw storageFailure("Unable to create project.", error);
      }

      return mapOpenedProject(data);
    },

    async list(): Promise<ProjectListItem[]> {
      const { data, error } = await client
        .from("projects")
        .select(PROJECT_LIST_COLUMNS)
        .order("updated_at", { ascending: false });

      if (error) {
        throw storageFailure("Unable to list projects.", error);
      }

      return ((data ?? []) as ProjectListRow[]).map(mapListItem);
    },

    async save(input: SaveProjectInput): Promise<SaveProjectResult> {
      const projectId = requireNonBlank(input.projectId, "Project id");

      if (input.project.projectId !== projectId) {
        throw new ProjectRepositoryError(
          "INVALID_INPUT",
          "Save project id does not match the project state id.",
        );
      }

      const expectedWorkVersion = requirePositiveInputVersion(
        input.expectedWorkVersion,
      );
      const nextWorkVersion = expectedWorkVersion + 1;

      if (!Number.isSafeInteger(nextWorkVersion)) {
        throw new ProjectRepositoryError(
          "INVALID_INPUT",
          "Next work version would exceed the safe integer range.",
        );
      }

      const workState = serializeProjectState(input.project);

      const { data, error } = await client
        .from("projects")
        .update({
          schema_version: CURRENT_PROJECT_SCHEMA_VERSION,
          work_version: nextWorkVersion,
          work_state: workState,
        })
        .eq("id", projectId)
        .eq("owner_user_id", normalizedOwnerUserId)
        .eq("work_version", expectedWorkVersion)
        .select("id, work_version, updated_at")
        .maybeSingle<ProjectSaveRow>();

      if (error) {
        throw storageFailure("Unable to save project.", error);
      }

      if (data) {
        return mapSaveResult(data, projectId, nextWorkVersion);
      }

      const { data: current, error: versionError } = await client
        .from("projects")
        .select("id, work_version")
        .eq("id", projectId)
        .maybeSingle<ProjectVersionRow>();

      if (versionError) {
        throw storageFailure(
          "Unable to verify project version after save conflict.",
          versionError,
        );
      }

      if (!current) {
        throw new ProjectRepositoryError(
          "NOT_FOUND",
          "Project was not found.",
        );
      }

      const currentWorkVersion = requirePositiveInteger(
        current.work_version,
        "Current project work version",
      );

      if (currentWorkVersion !== expectedWorkVersion) {
        throw new ProjectRepositoryError(
          "STALE_WRITE",
          `Project changed since it was opened. Expected version ${expectedWorkVersion}, current version ${currentWorkVersion}.`,
        );
      }

      throw storageFailure(
        "Project save matched no row even though the expected version is still current.",
      );
    },

    async open(projectId: string): Promise<OpenedProject> {
      const normalizedProjectId = requireNonBlank(
        projectId,
        "Project id",
      );

      const { data, error } = await client
        .from("projects")
        .select(PROJECT_ROW_COLUMNS)
        .eq("id", normalizedProjectId)
        .maybeSingle<ProjectRow>();

      if (error) {
        throw storageFailure("Unable to open project.", error);
      }

      if (!data) {
        // RLS intentionally makes a foreign project indistinguishable from a
        // project that does not exist.
        throw new ProjectRepositoryError(
          "NOT_FOUND",
          "Project was not found.",
        );
      }

      return mapOpenedProject(data);
    },
  };
}

function mapSaveResult(
  row: ProjectSaveRow,
  expectedProjectId: string,
  expectedWorkVersion: number,
): SaveProjectResult {
  const projectId = requireNonBlank(row.id, "Saved project id");
  const workVersion = requirePositiveInteger(
    row.work_version,
    "Saved project work version",
  );
  const updatedAt = requireNonBlank(
    row.updated_at,
    "Saved project updated timestamp",
  );

  if (projectId !== expectedProjectId) {
    throw storageFailure("Saved project id does not match the requested project.");
  }

  if (workVersion !== expectedWorkVersion) {
    throw storageFailure(
      `Saved project version is invalid. Expected ${expectedWorkVersion}, received ${workVersion}.`,
    );
  }

  return {
    projectId,
    workVersion,
    updatedAt,
  };
}

function mapOpenedProject(row: ProjectRow): OpenedProject {
  try {
    const project = deserializeProjectState(row.work_state);

    return assertOpenedProjectContract({
      ...mapListItem(row),
      ownerUserId: requireNonBlank(
        row.owner_user_id,
        "Project owner user id",
      ),
      createdAt: requireNonBlank(
        row.created_at,
        "Project created timestamp",
      ),
      project,
    });
  } catch (error) {
    if (error instanceof ProjectRepositoryError) throw error;
    throw storageFailure("Stored project state is invalid.", error);
  }
}

function mapListItem(row: ProjectListRow): ProjectListItem {
  return {
    id: requireNonBlank(row.id, "Project id"),
    title: requireNonBlank(row.title, "Project title"),
    status: parseStatus(row.status),
    schemaVersion: requirePositiveInteger(
      row.schema_version,
      "Project schema version",
    ),
    workVersion: requirePositiveInteger(
      row.work_version,
      "Project work version",
    ),
    updatedAt: requireNonBlank(
      row.updated_at,
      "Project updated timestamp",
    ),
  };
}

function parseStatus(value: string): ProjectStatus {
  if (
    value === "draft" ||
    value === "active" ||
    value === "archived"
  ) {
    return value;
  }

  throw storageFailure(
    `Stored project status is invalid: ${String(value)}.`,
  );
}

function requirePositiveInteger(
  value: number,
  label: string,
): number {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw storageFailure(`${label} must be a positive safe integer.`);
  }
  return value;
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

function requirePositiveInputVersion(value: number): number {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new ProjectRepositoryError(
      "INVALID_INPUT",
      "Expected work version must be a positive safe integer.",
    );
  }
  return value;
}

function storageFailure(
  message: string,
  cause?: unknown,
): ProjectRepositoryError {
  return new ProjectRepositoryError(
    "STORAGE_FAILURE",
    message,
    cause === undefined ? undefined : { cause },
  );
}
