import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import { WorkSignInError, signInWorkUser } from "./work-sign-in";

type FakeOptions = {
  signInError?: Error | null;
  hasSignInSession?: boolean;
  hasSignInUser?: boolean;
  workUser?: {
    user_id: string;
    display_name: string;
    role: string;
  } | null;
};

function createFakeClient(options: FakeOptions = {}) {
  const signInWithPassword = vi.fn().mockResolvedValue({
    data: {
      session: options.hasSignInSession === false ? null : { access_token: "test" },
      user:
        options.hasSignInUser === false
          ? null
          : { id: "user-1" },
    },
    error: options.signInError ?? null,
  });

  const getSession = vi.fn().mockResolvedValue({
    data: { session: { access_token: "test" } },
    error: null,
  });

  const getUser = vi.fn().mockResolvedValue({
    data: { user: { id: "user-1" } },
    error: null,
  });

  const maybeSingle = vi.fn().mockResolvedValue({
    data:
      options.workUser === undefined
        ? {
            user_id: "user-1",
            display_name: "Траян Иванов",
            role: "owner",
          }
        : options.workUser,
    error: null,
  });

  const eqActive = vi.fn().mockReturnValue({ maybeSingle });
  const eqUser = vi.fn().mockReturnValue({ eq: eqActive });
  const select = vi.fn().mockReturnValue({ eq: eqUser });
  const from = vi.fn().mockReturnValue({ select });

  const client = {
    auth: {
      signInWithPassword,
      getSession,
      getUser,
    },
    from,
  } as unknown as SupabaseClient;

  return {
    client,
    spies: {
      signInWithPassword,
      getSession,
      getUser,
      from,
      maybeSingle,
    },
  };
}

async function expectSignInError(
  action: () => Promise<unknown>,
  code: WorkSignInError["code"],
): Promise<void> {
  await action().then(
    () => {
      throw new Error(`Expected WorkSignInError with code ${code}.`);
    },
    (error: unknown) => {
      expect(error).toBeInstanceOf(WorkSignInError);
      expect((error as WorkSignInError).code).toBe(code);
    },
  );
}

describe("Work email/password sign-in", () => {
  it("signs in with trimmed email and resolves authorized Work access", async () => {
    const { client, spies } = createFakeClient();

    await expect(
      signInWorkUser(client, {
        email: "  owner@example.com  ",
        password: "secret",
      }),
    ).resolves.toEqual({
      status: "authorized",
      workUser: {
        userId: "user-1",
        displayName: "Траян Иванов",
        role: "owner",
      },
    });

    expect(spies.signInWithPassword).toHaveBeenCalledWith({
      email: "owner@example.com",
      password: "secret",
    });
    expect(spies.getSession).toHaveBeenCalledTimes(1);
    expect(spies.getUser).toHaveBeenCalledTimes(1);
    expect(spies.from).toHaveBeenCalledWith("work_users");
  });

  it("returns unauthorized when Auth succeeds but no active Work row exists", async () => {
    const { client } = createFakeClient({ workUser: null });

    await expect(
      signInWorkUser(client, {
        email: "person@example.com",
        password: "secret",
      }),
    ).resolves.toEqual({
      status: "unauthorized",
      userId: "user-1",
    });
  });

  it("rejects an empty email before calling Supabase", async () => {
    const { client, spies } = createFakeClient();

    await expectSignInError(
      () =>
        signInWorkUser(client, {
          email: "   ",
          password: "secret",
        }),
      "EMAIL_REQUIRED",
    );

    expect(spies.signInWithPassword).not.toHaveBeenCalled();
  });

  it("rejects an empty password before calling Supabase", async () => {
    const { client, spies } = createFakeClient();

    await expectSignInError(
      () =>
        signInWorkUser(client, {
          email: "owner@example.com",
          password: "",
        }),
      "PASSWORD_REQUIRED",
    );

    expect(spies.signInWithPassword).not.toHaveBeenCalled();
  });

  it("surfaces Supabase sign-in failures", async () => {
    const { client } = createFakeClient({
      signInError: new Error("invalid credentials"),
    });

    await expectSignInError(
      () =>
        signInWorkUser(client, {
          email: "owner@example.com",
          password: "wrong",
        }),
      "SIGN_IN_FAILED",
    );
  });

  it("rejects a sign-in result without a session", async () => {
    const { client } = createFakeClient({
      hasSignInSession: false,
    });

    await expectSignInError(
      () =>
        signInWorkUser(client, {
          email: "owner@example.com",
          password: "secret",
        }),
      "SIGN_IN_INCOMPLETE",
    );
  });
});
