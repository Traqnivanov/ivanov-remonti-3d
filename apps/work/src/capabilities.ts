export type AppMode = "work" | "client";
export type AppEntry = "work" | "direct-client";

export type ModeCapabilities = {
  canAuthorProject: boolean;
  canInspectViewer: boolean;
  canReturnToWork: boolean;
};

export function getModeCapabilities(
  mode: AppMode,
  entry: AppEntry,
): ModeCapabilities {
  return {
    canAuthorProject: mode === "work" && entry === "work",
    canInspectViewer: true,
    canReturnToWork: entry === "work",
  };
}
