import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import { createDefaultProject } from "./domain";
import {
  ProjectRepositoryError,
  prepareNewProjectDraft,
} from "./project-repository";
import { serializeProjectState } from "./persistence";
import { createSupabaseProjectReadRepository } from "./supabase-project-repository";

type FakeProjectRow = {
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

function makeRow(
  id = "project-1",
  overrides: Partial<FakeProjectRow> = {},
): FakeProjectRow {
  return {
    id,
    title: "Проект 1",
    owner_user_id: "owner-1",
    status: "draft",
    schema_version: 1,
    work_version: 1,
    work_state: serializeProjectState(createDefaultProject(id)),
    created_at: "2026-09-23T18:00:00.000Z",
    updated_at: "2026-09-23T18:00:00.000Z",
    ...overrides,
  };
}

function createClientForCreate(
  result: { data: FakeProjectRow | null; error: unknown },
) {
  const single = vi.fn().mockResolvedValue(result);
  const select = vi.fn().mockReturnValue({ single });
  const insert = vi.fn().mockReturnValue({ select });
  const from = vi.fn().mockReturnValue({ insert });

  return {
    client: { from } as unknown as SupabaseClient,
    spies: { from, insert, select, single },
  };
}

function createClientForList(
  result: { data: unknown[] | null; error: unknown },
) {
  const order = vi.fn().mockResolvedValue(result);
  const select = vi.fn().mockReturnValue({ order });
  const from = vi.fn().mockReturnValue({ select });

  return {
    client: { from } as unknown as SupabaseClient,
    spies: { from, select, order },
  };
}

function createClientForOpen(
  result: { data: FakeProjectRow | null; error: unknown },
) {
  const maybeSingle = vi.fn().mockResolvedValue(result);
  const eq = vi.fn().mockReturnValue({ maybeSingle });
  const select = vi.fn().mockReturnValue({ eq });
  const from = vi.fn().mockReturnValue({ select });

  return {
    client: { from } as unknown as SupabaseClient,
    spies: { from, select, eq, maybeSingle },
  };
}

async function expectRepositoryError(
  action: () => Promise<unknown>,
  code: ProjectRepositoryError["code"],
): Promise<void> {
  await action().then(
    () => {
      throw new Error(`Expected ProjectRepositoryError with code ${code}.`);
    },
    (error: unknown) => {
      expect(error).toBeInstanceOf(ProjectRepositoryError);
      expect((error as ProjectRepositoryError).code).toBe(code);
    },
  );
}

describe("Supabase project read repository", () => {
  it("creates a draft row with canonical ids, schema version and serialized state", async () => {
    const row = makeRow("project-create-1");
    const { client, spies } = createClientForCreate({
      data: row,
      error: null,
    });
    const repository = createSupabaseProjectReadRepository(
      client,
      "owner-1",
    );
    const input = prepareNewProjectDraft(
      "  Апартамент Иванови  ",
      () => "project-create-1",
    );

    await expect(repository.create(input)).resolves.toMatchObject({
      id: "project-create-1",
      ownerUserId: "owner-1",
      title: "Проект 1",
      schemaVersion: 1,
      workVersion: 1,
      project: {
        projectId: "project-create-1",
      },
    });

    expect(spies.from).toHaveBeenCalledWith("projects");
    expect(spies.insert).toHaveBeenCalledWith({
      id: "project-create-1",
      title: "Апартамент Иванови",
      owner_user_id: "owner-1",
      status: "draft",
      schema_version: 1,
      work_version: 1,
      work_state: serializeProjectState(input.project),
    });
  });

  it("maps the project list contract without loading work_state", async () => {
    const rows = [
      {
        id: "project-2",
        title: "Втори",
        status: "active",
        schema_version: 1,
        work_version: 4,
        updated_at: "2026-09-23T19:00:00.000Z",
      },
      {
        id: "project-1",
        title: "Първи",
        status: "draft",
        schema_version: 1,
        work_version: 2,
        updated_at: "2026-09-23T18:00:00.000Z",
      },
    ];
    const { client, spies } = createClientForList({
      data: rows,
      error: null,
    });
    const repository = createSupabaseProjectReadRepository(
      client,
      "owner-1",
    );

    await expect(repository.list()).resolves.toEqual([
      {
        id: "project-2",
        title: "Втори",
        status: "active",
        schemaVersion: 1,
        workVersion: 4,
        updatedAt: "2026-09-23T19:00:00.000Z",
      },
      {
        id: "project-1",
        title: "Първи",
        status: "draft",
        schemaVersion: 1,
        workVersion: 2,
        updatedAt: "2026-09-23T18:00:00.000Z",
      },
    ]);

    expect(spies.order).toHaveBeenCalledWith("updated_at", {
      ascending: false,
    });
  });

  it("opens and deserializes one project row", async () => {
    const row = makeRow("project-open-1", {
      title: "Дневна",
      work_version: 3,
    });
    const { client, spies } = createClientForOpen({
      data: row,
      error: null,
    });
    const repository = createSupabaseProjectReadRepository(
      client,
      "owner-1",
    );

    await expect(repository.open("project-open-1")).resolves.toMatchObject({
      id: "project-open-1",
      title: "Дневна",
      ownerUserId: "owner-1",
      workVersion: 3,
      project: {
        projectId: "project-open-1",
        room: {
          widthM: 4.2,
          lengthM: 4.8,
          heightM: 2.6,
        },
      },
    });

    expect(spies.eq).toHaveBeenCalledWith("id", "project-open-1");
  });

  it("treats an RLS-hidden or missing row as not found", async () => {
    const { client } = createClientForOpen({
      data: null,
      error: null,
    });
    const repository = createSupabaseProjectReadRepository(
      client,
      "owner-1",
    );

    await expectRepositoryError(
      () => repository.open("foreign-or-missing"),
      "NOT_FOUND",
    );
  });

  it("maps Supabase failures to storage failures", async () => {
    const { client } = createClientForList({
      data: null,
      error: new Error("network unavailable"),
    });
    const repository = createSupabaseProjectReadRepository(
      client,
      "owner-1",
    );

    await expectRepositoryError(
      () => repository.list(),
      "STORAGE_FAILURE",
    );
  });

  it("rejects invalid stored project state instead of inventing data", async () => {
    const row = makeRow("project-invalid", {
      work_state: {
        schemaVersion: 99,
        projectId: "project-invalid",
      },
    });
    const { client } = createClientForOpen({
      data: row,
      error: null,
    });
    const repository = createSupabaseProjectReadRepository(
      client,
      "owner-1",
    );

    await expectRepositoryError(
      () => repository.open("project-invalid"),
      "STORAGE_FAILURE",
    );
  });

  it("rejects a blank owner identity before any Supabase call", () => {
    const from = vi.fn();
    const client = { from } as unknown as SupabaseClient;

    expect(() =>
      createSupabaseProjectReadRepository(client, "   "),
    ).toThrowError(ProjectRepositoryError);
    expect(from).not.toHaveBeenCalled();
  });
});
