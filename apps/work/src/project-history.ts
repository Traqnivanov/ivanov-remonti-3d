import type { ProjectState } from "./domain";

export const DEFAULT_PROJECT_HISTORY_LIMIT = 50;

export type ProjectHistoryEntry = {
  readonly revision: number;
  readonly project: ProjectState;
};

export type ProjectHistory = {
  readonly past: readonly ProjectHistoryEntry[];
  readonly current: ProjectHistoryEntry;
  readonly future: readonly ProjectHistoryEntry[];
  readonly limit: number;
  readonly nextRevision: number;
  readonly savedRevision: number;
};

export function createProjectHistory(
  project: ProjectState,
  limit = DEFAULT_PROJECT_HISTORY_LIMIT,
): ProjectHistory {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("Project history limit must be a positive integer.");
  }

  return {
    past: [],
    current: {
      revision: 0,
      project: cloneProjectState(project),
    },
    future: [],
    limit,
    nextRevision: 1,
    savedRevision: 0,
  };
}

export function getCurrentProjectState(history: ProjectHistory): ProjectState {
  return cloneProjectState(history.current.project);
}

export function getCurrentProjectRevision(history: ProjectHistory): number {
  return history.current.revision;
}

export function isCurrentProjectSaved(history: ProjectHistory): boolean {
  return history.current.revision === history.savedRevision;
}

export function markProjectHistoryRevisionSaved(
  history: ProjectHistory,
  revision = history.current.revision,
): ProjectHistory {
  if (!Number.isInteger(revision) || revision < 0) {
    throw new Error("Saved project history revision must be a non-negative integer.");
  }

  return {
    ...history,
    savedRevision: revision,
  };
}

export function canUndoProject(history: ProjectHistory): boolean {
  return history.past.length > 0;
}

export function canRedoProject(history: ProjectHistory): boolean {
  return history.future.length > 0;
}

export function commitProjectState(
  history: ProjectHistory,
  nextProject: ProjectState,
): ProjectHistory {
  const nextPast = [...history.past, cloneEntry(history.current)];
  const boundedPast =
    nextPast.length > history.limit
      ? nextPast.slice(nextPast.length - history.limit)
      : nextPast;

  return {
    past: boundedPast,
    current: {
      revision: history.nextRevision,
      project: cloneProjectState(nextProject),
    },
    future: [],
    limit: history.limit,
    nextRevision: history.nextRevision + 1,
    savedRevision: history.savedRevision,
  };
}

export function undoProjectState(history: ProjectHistory): ProjectHistory {
  const previous = history.past.at(-1);
  if (!previous) return history;

  return {
    past: history.past.slice(0, -1).map(cloneEntry),
    current: cloneEntry(previous),
    future: [cloneEntry(history.current), ...history.future.map(cloneEntry)].slice(
      0,
      history.limit,
    ),
    limit: history.limit,
    nextRevision: history.nextRevision,
    savedRevision: history.savedRevision,
  };
}

export function redoProjectState(history: ProjectHistory): ProjectHistory {
  const next = history.future[0];
  if (!next) return history;

  return {
    past: [...history.past.map(cloneEntry), cloneEntry(history.current)].slice(
      -history.limit,
    ),
    current: cloneEntry(next),
    future: history.future.slice(1).map(cloneEntry),
    limit: history.limit,
    nextRevision: history.nextRevision,
    savedRevision: history.savedRevision,
  };
}

function cloneEntry(entry: ProjectHistoryEntry): ProjectHistoryEntry {
  return {
    revision: entry.revision,
    project: cloneProjectState(entry.project),
  };
}

function cloneProjectState(project: ProjectState): ProjectState {
  return structuredClone(project);
}
