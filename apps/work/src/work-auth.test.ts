import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import {
  WorkAuthBoundaryError,
  resolveWorkAccess,
} from "./work-auth";

type FakeOptions = {
  hasSession?: boolean;
  sessionError?: Error | null;
  userId?: string | null;
  userError?: Error | null;
  workUser?: {
    user_id: string;
    display_name: string;
    role: string;
  } | null;
  workUserError?: Error | null;
};

function createFakeClient(options: FakeOptions = {}) {
  const getSession = vi.fn().mockResolvedValue({
    data: {
      session: options.hasSession === false ? null : { access_token: "test" },
    },
    error: options.sessionError ?? null,
  });

  const getUser = vi.fn().mockResolvedValue({
    data: {
      user:
        options.userId === null
          ? null
          : { id: options.userId ?? "user-1" },
    },
    error: options.userError ?? null,
  });

  const maybeSingle = vi.fn().mockResolvedValue({
    data:
      options.workUser === undefined
        ? {
            user_id: options.userId ?? "user-1",
            display_name: "Траян",
            role: "owner",
          }
        : options.workUser,
    error: options.workUserError ?? null,
  });

  const eqActive = vi.fn().mockReturnValue({ maybeSingle });
  const eqUser = vi.fn().mockReturnValue({ eq: eqActive });
  const select = vi.fn().mockReturnValue({ eq: eqUser });
  const from = vi.fn().mockReturnValue({ select });

  const client = {
    auth: {
      getSession,
      getUser,
    },
    from,
  } as unknown as SupabaseClient;

  return {
    client,
    spies: {
      getSession,
      getUser,
      from,
      select,
      eqUser,
      eqActive,
      maybeSingle,
    },
  };
}

function expectBoundaryError(
  action: () => Promise<unknown>,
  code: WorkAuthBoundaryError["code"],
): Promise<void> {
  return action().then(
    () => {
      throw new Error(`Expected WorkAuthBoundaryError with code ${code}.`);
    },
    (error: unknown) => {
      expect(error).toBeInstanceOf(WorkAuthBoundaryError);
      expect((error as WorkAuthBoundaryError).code).toBe(code);
    },
  );
}

describe("Work authorization boundary", () => {
  it("returns signed-out without querying Work authorization", async () => {
    const { client, spies } = createFakeClient({ hasSession: false });

    await expect(resolveWorkAccess(client)).resolves.toEqual({
      status: "signed-out",
    });

    expect(spies.getUser).not.toHaveBeenCalled();
    expect(spies.from).not.toHaveBeenCalled();
  });

  it("verifies identity before resolving an authorized Work user", async () => {
    const { client, spies } = createFakeClient({
      userId: "user-42",
      workUser: {
        user_id: "user-42",
        display_name: "Траян Иванов",
        role: "owner",
      },
    });

    await expect(resolveWorkAccess(client)).resolves.toEqual({
      status: "authorized",
      workUser: {
        userId: "user-42",
        displayName: "Траян Иванов",
        role: "owner",
      },
    });

    expect(spies.getSession).toHaveBeenCalledTimes(1);
    expect(spies.getUser).toHaveBeenCalledTimes(1);
    expect(spies.from).toHaveBeenCalledWith("work_users");
    expect(spies.select).toHaveBeenCalledWith("user_id, display_name, role");
    expect(spies.eqUser).toHaveBeenCalledWith("user_id", "user-42");
    expect(spies.eqActive).toHaveBeenCalledWith("active", true);
  });

  it("returns unauthorized for an authenticated user without an active Work row", async () => {
    const { client } = createFakeClient({
      userId: "user-no-access",
      workUser: null,
    });

    await expect(resolveWorkAccess(client)).resolves.toEqual({
      status: "unauthorized",
      userId: "user-no-access",
    });
  });

  it("does not hide session read failures as signed-out", async () => {
    const { client } = createFakeClient({
      sessionError: new Error("storage failed"),
    });

    await expectBoundaryError(
      () => resolveWorkAccess(client),
      "SESSION_READ_FAILED",
    );
  });

  it("does not authorize from an unverified local session", async () => {
    const { client, spies } = createFakeClient({
      userId: null,
      userError: new Error("invalid token"),
    });

    await expectBoundaryError(
      () => resolveWorkAccess(client),
      "IDENTITY_VERIFICATION_FAILED",
    );

    expect(spies.from).not.toHaveBeenCalled();
  });

  it("does not hide Work authorization lookup failures as unauthorized", async () => {
    const { client } = createFakeClient({
      workUserError: new Error("database unavailable"),
    });

    await expectBoundaryError(
      () => resolveWorkAccess(client),
      "WORK_USER_LOOKUP_FAILED",
    );
  });
});
