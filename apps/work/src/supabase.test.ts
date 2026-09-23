import { describe, expect, it } from "vitest";
import {
  IVANOV_REMONти_SUPABASE_URL,
  createWorkSupabaseClient,
  readWorkSupabaseConfig,
} from "./supabase";

const PUBLISHABLE_KEY = "sb_publishable_test-only";

describe("Work Supabase client configuration", () => {
  it("accepts only the dedicated Ivanov Remonti project URL", () => {
    expect(
      readWorkSupabaseConfig({
        VITE_SUPABASE_URL: IVANOV_REMONти_SUPABASE_URL,
        VITE_SUPABASE_PUBLISHABLE_KEY: PUBLISHABLE_KEY,
      }),
    ).toEqual({
      url: IVANOV_REMONти_SUPABASE_URL,
      publishableKey: PUBLISHABLE_KEY,
    });
  });

  it("rejects a different Supabase project", () => {
    expect(() =>
      readWorkSupabaseConfig({
        VITE_SUPABASE_URL: "https://other-project.supabase.co",
        VITE_SUPABASE_PUBLISHABLE_KEY: PUBLISHABLE_KEY,
      }),
    ).toThrow(/Ivanov Remonti Supabase project/);
  });

  it("rejects non-publishable credentials", () => {
    expect(() =>
      readWorkSupabaseConfig({
        VITE_SUPABASE_URL: IVANOV_REMONти_SUPABASE_URL,
        VITE_SUPABASE_PUBLISHABLE_KEY: "service-role-or-secret",
      }),
    ).toThrow(/publishable key/);
  });

  it("creates the official Supabase client from validated config", () => {
    const client = createWorkSupabaseClient({
      url: IVANOV_REMONти_SUPABASE_URL,
      publishableKey: PUBLISHABLE_KEY,
    });

    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
  });
});
