import { describe, expect, it } from "vitest";
import {
  createDefaultProject,
  createOpeningProofProject,
  getFinePuttyAssignment,
} from "./domain";
import {
  canRedoProject,
  canUndoProject,
  commitProjectState,
  createProjectHistory,
  getCurrentProjectRevision,
  getCurrentProjectState,
  isCurrentProjectSaved,
  markProjectHistoryRevisionSaved,
  redoProjectState,
  undoProjectState,
} from "./project-history";

describe("project history", () => {
  it("starts from a detached canonical project snapshot marked as saved", () => {
    const project = createDefaultProject("history-start");
    const history = createProjectHistory(project);

    project.room.widthM = 9;

    expect(getCurrentProjectState(history).room.widthM).toBe(4.2);
    expect(getCurrentProjectRevision(history)).toBe(0);
    expect(isCurrentProjectSaved(history)).toBe(true);
    expect(canUndoProject(history)).toBe(false);
    expect(canRedoProject(history)).toBe(false);
  });

  it("undoes and redoes canonical room changes", () => {
    const initial = createDefaultProject("history-room");
    let history = createProjectHistory(initial);

    const edited = getCurrentProjectState(history);
    edited.room.widthM = 5.4;
    history = commitProjectState(history, edited);

    expect(getCurrentProjectState(history).room.widthM).toBe(5.4);
    expect(getCurrentProjectRevision(history)).toBe(1);
    expect(isCurrentProjectSaved(history)).toBe(false);
    expect(canUndoProject(history)).toBe(true);

    history = undoProjectState(history);
    expect(getCurrentProjectState(history).room.widthM).toBe(4.2);
    expect(isCurrentProjectSaved(history)).toBe(true);
    expect(canRedoProject(history)).toBe(true);

    history = redoProjectState(history);
    expect(getCurrentProjectState(history).room.widthM).toBe(5.4);
    expect(isCurrentProjectSaved(history)).toBe(false);
  });

  it("can mark the exact saved revision even when newer local edits exist", () => {
    let history = createProjectHistory(createDefaultProject("history-save"));

    const first = getCurrentProjectState(history);
    first.room.widthM = 5;
    history = commitProjectState(history, first);
    const savingRevision = getCurrentProjectRevision(history);

    const second = getCurrentProjectState(history);
    second.room.heightM = 3;
    history = commitProjectState(history, second);

    history = markProjectHistoryRevisionSaved(history, savingRevision);
    expect(isCurrentProjectSaved(history)).toBe(false);

    history = undoProjectState(history);
    expect(getCurrentProjectRevision(history)).toBe(savingRevision);
    expect(isCurrentProjectSaved(history)).toBe(true);
  });

  it("restores openings and service targets as canonical project truth", () => {
    let history = createProjectHistory(createOpeningProofProject("history-data"));

    const edited = getCurrentProjectState(history);
    edited.room.openings = edited.room.openings.filter(
      (opening) => opening.kind !== "door",
    );
    getFinePuttyAssignment(edited).targetEntityIds = ["room-1.wall-right"];
    history = commitProjectState(history, edited);

    expect(getCurrentProjectState(history).room.openings).toHaveLength(1);
    expect(
      getFinePuttyAssignment(getCurrentProjectState(history)).targetEntityIds,
    ).toEqual(["room-1.wall-right"]);

    history = undoProjectState(history);
    const restored = getCurrentProjectState(history);

    expect(restored.room.openings).toHaveLength(2);
    expect(getFinePuttyAssignment(restored).targetEntityIds).toEqual([
      "room-1.wall-front",
      "room-1.wall-back",
      "room-1.wall-left",
      "room-1.wall-right",
    ]);
  });

  it("clears redo history after a new edit", () => {
    let history = createProjectHistory(createDefaultProject("history-branch"));

    const first = getCurrentProjectState(history);
    first.room.widthM = 5;
    history = commitProjectState(history, first);

    const second = getCurrentProjectState(history);
    second.room.lengthM = 6;
    history = commitProjectState(history, second);

    history = undoProjectState(history);
    expect(canRedoProject(history)).toBe(true);

    const replacement = getCurrentProjectState(history);
    replacement.room.heightM = 3;
    history = commitProjectState(history, replacement);

    expect(canRedoProject(history)).toBe(false);
    expect(getCurrentProjectState(history).room.widthM).toBe(5);
    expect(getCurrentProjectState(history).room.lengthM).toBe(4.8);
    expect(getCurrentProjectState(history).room.heightM).toBe(3);
  });

  it("keeps only the configured number of undo states", () => {
    let history = createProjectHistory(
      createDefaultProject("history-limit"),
      2,
    );

    for (const width of [5, 6, 7]) {
      const edited = getCurrentProjectState(history);
      edited.room.widthM = width;
      history = commitProjectState(history, edited);
    }

    history = undoProjectState(history);
    expect(getCurrentProjectState(history).room.widthM).toBe(6);

    history = undoProjectState(history);
    expect(getCurrentProjectState(history).room.widthM).toBe(5);

    const noMoreUndo = undoProjectState(history);
    expect(getCurrentProjectState(noMoreUndo).room.widthM).toBe(5);
    expect(canUndoProject(noMoreUndo)).toBe(false);
  });

  it("does not expose internal history snapshots for accidental mutation", () => {
    let history = createProjectHistory(createDefaultProject("history-detached"));

    const edited = getCurrentProjectState(history);
    edited.room.widthM = 5;
    history = commitProjectState(history, edited);

    const current = getCurrentProjectState(history);
    current.room.widthM = 12;

    expect(getCurrentProjectState(history).room.widthM).toBe(5);
  });

  it("rejects invalid history and saved revision values", () => {
    const project = createDefaultProject("history-invalid");

    expect(() => createProjectHistory(project, 0)).toThrow(
      "Project history limit must be a positive integer.",
    );
    expect(() =>
      markProjectHistoryRevisionSaved(createProjectHistory(project), -1),
    ).toThrow("Saved project history revision must be a non-negative integer.");
  });
});
