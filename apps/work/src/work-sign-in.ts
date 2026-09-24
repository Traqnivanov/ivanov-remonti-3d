import type { SupabaseClient } from "@supabase/supabase-js";
import { resolveWorkAccess, type WorkAccessState } from "./work-auth";

export type WorkSignInCredentials = {
  email: string;
  password: string;
};

export class WorkSignInError extends Error {
  constructor(
    public readonly code:
      | "EMAIL_REQUIRED"
      | "PASSWORD_REQUIRED"
      | "SIGN_IN_FAILED"
      | "SIGN_IN_INCOMPLETE",
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "WorkSignInError";
  }
}

export async function signInWorkUser(
  client: SupabaseClient,
  credentials: WorkSignInCredentials,
): Promise<WorkAccessState> {
  const email = credentials.email.trim();
  const password = credentials.password;

  if (!email) {
    throw new WorkSignInError("EMAIL_REQUIRED", "Email is required.");
  }

  if (!password) {
    throw new WorkSignInError("PASSWORD_REQUIRED", "Password is required.");
  }

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new WorkSignInError(
      "SIGN_IN_FAILED",
      "Unable to sign in with the supplied email and password.",
      { cause: error },
    );
  }

  if (!data.session || !data.user) {
    throw new WorkSignInError(
      "SIGN_IN_INCOMPLETE",
      "Supabase sign-in completed without an authenticated session.",
    );
  }

  return resolveWorkAccess(client);
}
