import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ProjectRepositoryError,
  assertOpenedProjectContract,
  type CreateProjectInput,
  type OpenedProject,
  type ProjectListItem,
  type ProjectRepository,
  type ProjectStatus,
} from "./project-repository";
import {
  CURRENT_PROJECT_SCHEMA_VERSION,
  deserializeProjectState,
  serializeProjectState,
} from "./persistence";

type ProjectReadRepository = Pick<
  ProjectRepository,
  "create" | "list" | "open"
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

const PROJECT_ROW_COLUMNS =
  "id, title, owner_user_id, status, schema_version, work_version, work_state, created_at, updated_at";

const PROJECT_LIST_COLUMNS =
  "id, title, status, schema_version, work_version, updated_at";

export function createSupabaseProjectReadRepository(
  client: SupabaseClient,
  ownerUserId: string,
): ProjectReadRepository {
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
