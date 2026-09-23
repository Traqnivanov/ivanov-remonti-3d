import type { SupabaseClient } from "@supabase/supabase-js";

export type AuthorizedWorkUser = {
  userId: string;
  displayName: string;
  role: string;
};

export type WorkAccessState =
  | { status: "signed-out" }
  | { status: "unauthorized"; userId: string }
  | { status: "authorized"; workUser: AuthorizedWorkUser };

export class WorkAuthBoundaryError extends Error {
  constructor(
    public readonly code:
      | "SESSION_READ_FAILED"
      | "IDENTITY_VERIFICATION_FAILED"
      | "WORK_USER_LOOKUP_FAILED",
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "WorkAuthBoundaryError";
  }
}

type WorkUserRow = {
  user_id: string;
  display_name: string;
  role: string;
};

export async function resolveWorkAccess(
  client: SupabaseClient,
): Promise<WorkAccessState> {
  const { data: sessionData, error: sessionError } =
    await client.auth.getSession();

  if (sessionError) {
    throw new WorkAuthBoundaryError(
      "SESSION_READ_FAILED",
      "Unable to read the current Supabase auth session.",
      { cause: sessionError },
    );
  }

  if (!sessionData.session) {
    return { status: "signed-out" };
  }

  // A locally stored session is not trusted as the authorization identity.
  // Verify the user with Supabase Auth before any Work authorization lookup.
  const { data: userData, error: userError } = await client.auth.getUser();

  if (userError || !userData.user) {
    throw new WorkAuthBoundaryError(
      "IDENTITY_VERIFICATION_FAILED",
      "Unable to verify the authenticated Supabase user.",
      { cause: userError ?? undefined },
    );
  }

  const { data: workUser, error: workUserError } = await client
    .from("work_users")
    .select("user_id, display_name, role")
    .eq("user_id", userData.user.id)
    .eq("active", true)
    .maybeSingle<WorkUserRow>();

  if (workUserError) {
    throw new WorkAuthBoundaryError(
      "WORK_USER_LOOKUP_FAILED",
      "Unable to verify Work App authorization.",
      { cause: workUserError },
    );
  }

  if (!workUser) {
    return {
      status: "unauthorized",
      userId: userData.user.id,
    };
  }

  return {
    status: "authorized",
    workUser: {
      userId: workUser.user_id,
      displayName: workUser.display_name,
      role: workUser.role,
    },
  };
}
