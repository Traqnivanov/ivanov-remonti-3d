import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import { createDefaultProject } from "./domain";
import {
  ProjectRepositoryError,
  prepareNewProjectDraft,
  prepareSaveProject,
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

function createClientForSave(options: {
  updateResult: {
    data: { id: string; work_version: number; updated_at: string } | null;
    error: unknown;
  };
  versionResult?: {
    data: { id: string; work_version: number } | null;
    error: unknown;
  };
}) {
  const updateMaybeSingle = vi.fn().mockResolvedValue(options.updateResult);
  const updateSelect = vi.fn().mockReturnValue({
    maybeSingle: updateMaybeSingle,
  });
  const eqVersion = vi.fn().mockReturnValue({
    select: updateSelect,
  });
  const eqOwner = vi.fn().mockReturnValue({
    eq: eqVersion,
  });
  const eqId = vi.fn().mockReturnValue({
    eq: eqOwner,
  });
  const update = vi.fn().mockReturnValue({
    eq: eqId,
  });

  const versionMaybeSingle = vi.fn().mockResolvedValue(
    options.versionResult ?? {
      data: null,
      error: null,
    },
  );
  const versionEq = vi.fn().mockReturnValue({
    maybeSingle: versionMaybeSingle,
  });
  const versionSelect = vi.fn().mockReturnValue({
    eq: versionEq,
  });

  const from = vi
    .fn()
    .mockImplementationOnce(() => ({ update }))
    .mockImplementationOnce(() => ({ select: versionSelect }));

  return {
    client: { from } as unknown as SupabaseClient,
    spies: {
      from,
      update,
      eqId,
      eqOwner,
      eqVersion,
      updateSelect,
      updateMaybeSingle,
      versionSelect,
      versionEq,
      versionMaybeSingle,
    },
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

  it("saves only the expected work version and increments it by one", async () => {
    const project = createDefaultProject("project-save-1");
    project.room.widthM = 5.1;

    const { client, spies } = createClientForSave({
      updateResult: {
        data: {
          id: "project-save-1",
          work_version: 2,
          updated_at: "2026-09-23T20:00:00.000Z",
        },
        error: null,
      },
    });
    const repository = createSupabaseProjectReadRepository(
      client,
      "owner-1",
    );

    await expect(
      repository.save(prepareSaveProject(project, 1)),
    ).resolves.toEqual({
      projectId: "project-save-1",
      workVersion: 2,
      updatedAt: "2026-09-23T20:00:00.000Z",
    });

    expect(spies.update).toHaveBeenCalledWith({
      schema_version: 1,
      work_version: 2,
      work_state: serializeProjectState(project),
    });
    expect(spies.eqId).toHaveBeenCalledWith("id", "project-save-1");
    expect(spies.eqOwner).toHaveBeenCalledWith(
      "owner_user_id",
      "owner-1",
    );
    expect(spies.eqVersion).toHaveBeenCalledWith("work_version", 1);
    expect(spies.from).toHaveBeenCalledTimes(1);
  });

  it("returns STALE_WRITE when the database has a newer work version", async () => {
    const project = createDefaultProject("project-stale-1");
    const { client } = createClientForSave({
      updateResult: {
        data: null,
        error: null,
      },
      versionResult: {
        data: {
          id: "project-stale-1",
          work_version: 3,
        },
        error: null,
      },
    });
    const repository = createSupabaseProjectReadRepository(
      client,
      "owner-1",
    );

    await expectRepositoryError(
      () => repository.save(prepareSaveProject(project, 2)),
      "STALE_WRITE",
    );
  });

  it("returns NOT_FOUND when the project is missing or hidden by RLS", async () => {
    const project = createDefaultProject("missing-project");
    const { client } = createClientForSave({
      updateResult: {
        data: null,
        error: null,
      },
      versionResult: {
        data: null,
        error: null,
      },
    });
    const repository = createSupabaseProjectReadRepository(
      client,
      "owner-1",
    );

    await expectRepositoryError(
      () => repository.save(prepareSaveProject(project, 1)),
      "NOT_FOUND",
    );
  });

  it("does not silently accept an unexpected no-row save at the same version", async () => {
    const project = createDefaultProject("project-save-odd");
    const { client } = createClientForSave({
      updateResult: {
        data: null,
        error: null,
      },
      versionResult: {
        data: {
          id: "project-save-odd",
          work_version: 1,
        },
        error: null,
      },
    });
    const repository = createSupabaseProjectReadRepository(
      client,
      "owner-1",
    );

    await expectRepositoryError(
      () => repository.save(prepareSaveProject(project, 1)),
      "STORAGE_FAILURE",
    );
  });

  it("maps save update failures to storage failures without a version probe", async () => {
    const project = createDefaultProject("project-save-error");
    const { client, spies } = createClientForSave({
      updateResult: {
        data: null,
        error: new Error("database unavailable"),
      },
    });
    const repository = createSupabaseProjectReadRepository(
      client,
      "owner-1",
    );

    await expectRepositoryError(
      () => repository.save(prepareSaveProject(project, 1)),
      "STORAGE_FAILURE",
    );

    expect(spies.from).toHaveBeenCalledTimes(1);
  });

  it("rejects a mismatched save id before any Supabase call", async () => {
    const from = vi.fn();
    const client = { from } as unknown as SupabaseClient;
    const repository = createSupabaseProjectReadRepository(
      client,
      "owner-1",
    );

    await expectRepositoryError(
      () =>
        repository.save({
          projectId: "row-id",
          expectedWorkVersion: 1,
          project: createDefaultProject("different-id"),
        }),
      "INVALID_INPUT",
    );

    expect(from).not.toHaveBeenCalled();
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
