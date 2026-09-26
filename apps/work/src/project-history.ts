import type { ProjectState } from "./domain";

export const DEFAULT_PROJECT_HISTORY_LIMIT = 50;

export type ProjectHistory = {
  readonly past: readonly ProjectState[];
  readonly current: ProjectState;
  readonly future: readonly ProjectState[];
  readonly limit: number;
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
    current: cloneProjectState(project),
    future: [],
    limit,
  };
}

export function getCurrentProjectState(history: ProjectHistory): ProjectState {
  return cloneProjectState(history.current);
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
  const nextPast = [...history.past, cloneProjectState(history.current)];
  const boundedPast =
    nextPast.length > history.limit
      ? nextPast.slice(nextPast.length - history.limit)
      : nextPast;

  return {
    past: boundedPast,
    current: cloneProjectState(nextProject),
    future: [],
    limit: history.limit,
  };
}

export function undoProjectState(history: ProjectHistory): ProjectHistory {
  const previous = history.past.at(-1);
  if (!previous) return history;

  return {
    past: history.past.slice(0, -1),
    current: cloneProjectState(previous),
    future: [
      cloneProjectState(history.current),
      ...history.future.map(cloneProjectState),
    ].slice(0, history.limit),
    limit: history.limit,
  };
}

export function redoProjectState(history: ProjectHistory): ProjectHistory {
  const next = history.future[0];
  if (!next) return history;

  return {
    past: [
      ...history.past.map(cloneProjectState),
      cloneProjectState(history.current),
    ].slice(-history.limit),
    current: cloneProjectState(next),
    future: history.future.slice(1).map(cloneProjectState),
    limit: history.limit,
  };
}

function cloneProjectState(project: ProjectState): ProjectState {
  return structuredClone(project);
}
