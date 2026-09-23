import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const IVANOV_REMONти_SUPABASE_PROJECT_REF = "qjfpbxucrxrtpygusnuv";
export const IVANOV_REMONти_SUPABASE_URL =
  `https://${IVANOV_REMONти_SUPABASE_PROJECT_REF}.supabase.co`;

export type WorkSupabaseConfig = {
  url: string;
  publishableKey: string;
};

type SupabaseEnv = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
};

export function readWorkSupabaseConfig(
  env: SupabaseEnv = import.meta.env,
): WorkSupabaseConfig {
  const url = env.VITE_SUPABASE_URL?.trim();
  const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url) {
    throw new Error("Missing VITE_SUPABASE_URL.");
  }
  if (!publishableKey) {
    throw new Error("Missing VITE_SUPABASE_PUBLISHABLE_KEY.");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("VITE_SUPABASE_URL must be a valid URL.");
  }

  if (
    parsedUrl.protocol !== "https:" ||
    parsedUrl.origin !== IVANOV_REMONти_SUPABASE_URL
  ) {
    throw new Error(
      `VITE_SUPABASE_URL must target the Ivanov Remonti Supabase project (${IVANOV_REMONти_SUPABASE_PROJECT_REF}).`,
    );
  }

  if (!publishableKey.startsWith("sb_publishable_")) {
    throw new Error(
      "VITE_SUPABASE_PUBLISHABLE_KEY must be a Supabase publishable key, never a secret/service key.",
    );
  }

  return { url: parsedUrl.origin, publishableKey };
}

export function createWorkSupabaseClient(
  config: WorkSupabaseConfig = readWorkSupabaseConfig(),
): SupabaseClient {
  return createClient(config.url, config.publishableKey);
}
