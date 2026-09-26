import { describe, expect, it } from "vitest";
import { createDefaultProject } from "./domain";
import {
  addOperationAssignment,
  findOperationAssignment,
  gypsumPuttyOperation,
  removeOperationAssignment,
  setOperationIncluded,
  setOperationTargets,
} from "./operation-authoring";

describe("generic operation authoring", () => {
  it("adds the gypsum putty proof operation only once", () => {
    const project = createDefaultProject("op-add");
    const added = addOperationAssignment(project, gypsumPuttyOperation);
    const addedTwice = addOperationAssignment(added, gypsumPuttyOperation);

    const assignment = findOperationAssignment(added, gypsumPuttyOperation);

    expect(project.serviceAssignments).toHaveLength(2);
    expect(added.serviceAssignments).toHaveLength(3);
    expect(addedTwice.serviceAssignments).toHaveLength(3);
    expect(assignment?.serviceCode).toBe("gypsum-putty");
    expect(assignment?.targetEntityIds).toEqual([
      "room-1.wall-front",
      "room-1.wall-back",
      "room-1.wall-left",
      "room-1.wall-right",
    ]);
    expect(assignment?.quantityRuleId).toBe("wall-net-area-openings-v1");
    expect(assignment?.priceBookItemId).toBe("dev-gypsum-putty");
  });

  it("removes only the selected operation", () => {
    const project = addOperationAssignment(
      createDefaultProject("op-remove"),
      gypsumPuttyOperation,
    );
    const removed = removeOperationAssignment(project, gypsumPuttyOperation);

    expect(findOperationAssignment(removed, gypsumPuttyOperation)).toBeUndefined();
    expect(removed.serviceAssignments.map((item) => item.serviceCode)).toEqual([
      "fine-putty",
      "laminate-flooring",
    ]);
  });

  it("can exclude and include an existing operation", () => {
    let project = addOperationAssignment(
      createDefaultProject("op-include"),
      gypsumPuttyOperation,
    );

    project = setOperationIncluded(project, gypsumPuttyOperation, false);
    expect(findOperationAssignment(project, gypsumPuttyOperation)?.included).toBe(
      false,
    );

    project = setOperationIncluded(project, gypsumPuttyOperation, true);
    expect(findOperationAssignment(project, gypsumPuttyOperation)?.included).toBe(
      true,
    );
  });

  it("changes exact wall targets without changing service identity", () => {
    const project = addOperationAssignment(
      createDefaultProject("op-targets"),
      gypsumPuttyOperation,
    );

    const changed = setOperationTargets(project, gypsumPuttyOperation, [
      "room-1.wall-left",
      "room-1.wall-right",
    ]);

    const assignment = findOperationAssignment(changed, gypsumPuttyOperation);
    expect(assignment?.serviceCode).toBe("gypsum-putty");
    expect(assignment?.targetEntityIds).toEqual([
      "room-1.wall-left",
      "room-1.wall-right",
    ]);
  });

  it("rejects a non-wall target", () => {
    const project = addOperationAssignment(
      createDefaultProject("op-invalid-target"),
      gypsumPuttyOperation,
    );

    expect(() =>
      setOperationTargets(project, gypsumPuttyOperation, ["room-1.floor"]),
    ).toThrow("This operation supports wall targets only.");
  });

  it("does not allow an included operation to lose its last target", () => {
    const project = addOperationAssignment(
      createDefaultProject("op-empty-target"),
      gypsumPuttyOperation,
    );

    expect(() =>
      setOperationTargets(project, gypsumPuttyOperation, []),
    ).toThrow("Choose at least one wall or exclude the operation first.");
  });

  it("allows zero targets only while the operation is excluded", () => {
    let project = addOperationAssignment(
      createDefaultProject("op-excluded-empty"),
      gypsumPuttyOperation,
    );
    project = setOperationIncluded(project, gypsumPuttyOperation, false);
    project = setOperationTargets(project, gypsumPuttyOperation, []);

    expect(
      findOperationAssignment(project, gypsumPuttyOperation)?.targetEntityIds,
    ).toEqual([]);
    expect(() =>
      setOperationIncluded(project, gypsumPuttyOperation, true),
    ).toThrow("An included operation requires at least one target.");
  });
});
