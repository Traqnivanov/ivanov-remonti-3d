import { describe, expect, it } from "vitest";
import { createDefaultProject } from "./domain";
import {
  addOperationAssignment,
  addOperationScopeAssignments,
  findOperationAssignment,
  findOperationCeilingAssignment,
  gypsumPuttyOperation,
  paintOperation,
  primerOperation,
  removeOperationAssignment,
  sandingOperation,
  setOperationIncluded,
  setOperationTargets,
  setServiceAssignmentIncluded,
} from "./operation-authoring";

describe("generic operation authoring", () => {
  it("adds the gypsum putty proof operation only once", () => {
    const project = createDefaultProject("op-add");
    const added = addOperationAssignment(project, gypsumPuttyOperation);
    const addedTwice = addOperationAssignment(added, gypsumPuttyOperation);

    const assignment = findOperationAssignment(added, gypsumPuttyOperation);

    expect(project.serviceAssignments).toHaveLength(3);
    expect(added.serviceAssignments).toHaveLength(4);
    expect(addedTwice.serviceAssignments).toHaveLength(4);
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
    expect(removed.serviceAssignments.map((item) => item.id)).toEqual([
      "assignment-fine-putty-1",
      "assignment-fine-putty-ceiling-1",
      "assignment-laminate-flooring-1",
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

  it("adds all approved P3.5a operations through the same wall-only authoring boundary", () => {
    const definitions = [sandingOperation, primerOperation, paintOperation];

    for (const definition of definitions) {
      const project = addOperationAssignment(
        createDefaultProject(`p35a-${definition.serviceCode}`),
        definition,
      );
      const assignment = findOperationAssignment(project, definition);

      expect(assignment?.serviceCode).toBe(definition.serviceCode);
      expect(assignment?.label).toBe(definition.label);
      expect(assignment?.quantityRuleId).toBe("wall-net-area-openings-v1");
      expect(assignment?.targetEntityIds).toEqual([
        "room-1.wall-front",
        "room-1.wall-back",
        "room-1.wall-left",
        "room-1.wall-right",
      ]);
      expect(assignment?.included).toBe(true);
      expect(assignment?.clientInfo).toBeDefined();
    }
  });

  it("adds wall and ceiling as two priced scopes of the same real operation by default", () => {
    const project = addOperationScopeAssignments(
      createDefaultProject("p35b-default-ceiling"),
      paintOperation,
    );

    const wall = findOperationAssignment(project, paintOperation);
    const ceiling = findOperationCeilingAssignment(project, paintOperation);

    expect(wall?.serviceCode).toBe("paint");
    expect(ceiling?.serviceCode).toBe("paint");
    expect(wall?.included).toBe(true);
    expect(ceiling?.included).toBe(true);
    expect(wall?.quantityRuleId).toBe("wall-net-area-openings-v1");
    expect(ceiling?.quantityRuleId).toBe("ceiling-area-v1");
    expect(ceiling?.targetEntityIds).toEqual(["room-1.ceiling"]);
    expect(ceiling?.id).not.toBe(wall?.id);
  });

  it("can remove only the ceiling scope without removing the wall service", () => {
    let project = addOperationScopeAssignments(
      createDefaultProject("p35b-remove-ceiling"),
      paintOperation,
    );

    project = setServiceAssignmentIncluded(
      project,
      paintOperation.ceilingAssignmentId,
      false,
    );

    expect(findOperationAssignment(project, paintOperation)?.included).toBe(true);
    expect(findOperationCeilingAssignment(project, paintOperation)?.included).toBe(false);
  });

  it("keeps every P3.5a operation wall-only", () => {
    for (const definition of [sandingOperation, primerOperation, paintOperation]) {
      const project = addOperationAssignment(
        createDefaultProject(`p35a-invalid-${definition.serviceCode}`),
        definition,
      );

      expect(() =>
        setOperationTargets(project, definition, ["room-1.ceiling"]),
      ).toThrow("This operation supports wall targets only.");
    }
  });
});
