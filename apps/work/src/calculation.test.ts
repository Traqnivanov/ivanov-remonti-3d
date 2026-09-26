import { describe, expect, it } from "vitest";
import {
  calculateAssignmentQuantity,
  calculateFinePuttyQuantity,
  calculateLaminateFlooringQuantity,
  calculateLineTotalEur,
  calculateSupportedOfferLine,
  calculateSupportedOfferLines,
  devGypsumPuttyPriceBookItem,
  devLaminateFlooringPriceBookItem,
  devPriceBookItem,
  type PriceBookItem,
  type QuantityResult,
} from "./calculation";
import {
  createDefaultProject,
  createOpeningProofProject,
  getFinePuttyAssignment,
  getLaminateFlooringAssignment,
} from "./domain";
import {
  addOperationAssignment,
  findOperationAssignment,
  gypsumPuttyOperation,
} from "./operation-authoring";

describe("fine putty quantity", () => {
  it("calculates selected wall area from domain geometry", () => {
    const project = createDefaultProject();
    const result = calculateFinePuttyQuantity(project);

    const expected =
      2 * project.room.widthM * project.room.heightM +
      2 * project.room.lengthM * project.room.heightM;

    expect(result.value).toBeCloseTo(expected, 8);
    expect(result.sourceEntityIds).toHaveLength(4);
  });

  it("changes only when the service target set changes", () => {
    const project = createDefaultProject();
    getFinePuttyAssignment(project).targetEntityIds = ["room-1.wall-right"];

    expect(calculateFinePuttyQuantity(project).value).toBeCloseTo(
      project.room.lengthM * project.room.heightM,
      8,
    );
  });

  it("deducts only openings hosted on Fine Putty target walls", () => {
    const project = createOpeningProofProject();
    const result = calculateFinePuttyQuantity(project);

    expect(result.ruleId).toBe("wall-net-area-openings-v1");
    expect(result.value).toBeCloseTo(46.8 - 1.89 - 1.32, 8);
    expect(result.sourceEntityIds).toEqual([
      "room-1.wall-front",
      "room-1.wall-back",
      "room-1.wall-left",
      "room-1.wall-right",
      "room-1.door-1",
      "room-1.window-1",
    ]);
  });

  it("does not deduct an opening when its host wall is outside Fine Putty scope", () => {
    const project = createOpeningProofProject();
    getFinePuttyAssignment(project).targetEntityIds = ["room-1.wall-right"];

    const result = calculateFinePuttyQuantity(project);

    expect(result.value).toBeCloseTo(12.48 - 1.32, 8);
    expect(result.sourceEntityIds).toEqual([
      "room-1.wall-right",
      "room-1.window-1",
    ]);
  });

  it("keeps the old no-opening quantity exactly unchanged under the net-area rule", () => {
    const project = createDefaultProject();
    const result = calculateFinePuttyQuantity(project);

    expect(result.ruleId).toBe("wall-net-area-openings-v1");
    expect(result.value).toBeCloseTo(46.8, 8);
  });

  it("uses a separate DEV price-book abstraction", () => {
    const project = createDefaultProject();
    const quantity = calculateFinePuttyQuantity(project);

    expect(calculateLineTotalEur(quantity, devPriceBookItem)).toBeCloseTo(
      quantity.value * devPriceBookItem.unitPriceEur,
      8,
    );
  });
});

describe("laminate flooring quantity", () => {
  it("is unchanged by wall openings", () => {
    const project = createOpeningProofProject();
    const result = calculateLaminateFlooringQuantity(project);

    expect(result.value).toBeCloseTo(20.16, 8);
    expect(result.sourceEntityIds).toEqual(["room-1.floor"]);
  });

  it("calculates the exact floor area from canonical room geometry", () => {
    const project = createDefaultProject();
    const result = calculateLaminateFlooringQuantity(project);

    expect(result.ruleId).toBe("floor-area-v1");
    expect(result.sourceEntityIds).toEqual(["room-1.floor"]);
    expect(result.value).toBeCloseTo(
      project.room.widthM * project.room.lengthM,
      8,
    );
  });

  it("changes with floor dimensions but not with room height", () => {
    const project = createDefaultProject();
    const before = calculateLaminateFlooringQuantity(project).value;

    project.room.heightM += 1;
    expect(calculateLaminateFlooringQuantity(project).value).toBeCloseTo(
      before,
      8,
    );

    project.room.widthM += 1;
    expect(calculateLaminateFlooringQuantity(project).value).toBeCloseTo(
      project.room.widthM * project.room.lengthM,
      8,
    );
  });

  it("returns zero when the laminate assignment is not included", () => {
    const project = createDefaultProject();
    getLaminateFlooringAssignment(project).included = false;

    const result = calculateLaminateFlooringQuantity(project);

    expect(result.value).toBe(0);
    expect(result.sourceEntityIds).toEqual([]);
  });

  it("uses a separate EUR DEV price-book fixture", () => {
    const project = createDefaultProject();
    const quantity = calculateLaminateFlooringQuantity(project);

    expect(devLaminateFlooringPriceBookItem.id).toBe("dev-laminate-flooring");
    expect(devLaminateFlooringPriceBookItem.devOnly).toBe(true);
    expect(
      calculateLineTotalEur(quantity, devLaminateFlooringPriceBookItem),
    ).toBeCloseTo(
      quantity.value * devLaminateFlooringPriceBookItem.unitPriceEur,
      8,
    );
  });
});

describe("generic operation quantity boundary", () => {
  it("calculates by quantity rule instead of literal assignment id", () => {
    const project = createOpeningProofProject();
    const assignment = {
      ...getFinePuttyAssignment(project),
      id: "assignment-another-wall-operation",
      serviceCode: "another-wall-operation",
      label: "Another wall operation",
    };

    const result = calculateAssignmentQuantity(project, assignment);

    expect(result?.ruleId).toBe("wall-net-area-openings-v1");
    expect(result?.value).toBeCloseTo(46.8 - 1.89 - 1.32, 8);
  });

  it("rejects a known wall rule when it targets a non-wall surface", () => {
    const project = createDefaultProject();
    const assignment = {
      ...getFinePuttyAssignment(project),
      id: "assignment-invalid-wall-rule",
      targetEntityIds: ["room-1.floor"] as const,
    };

    expect(() =>
      calculateAssignmentQuantity(project, {
        ...assignment,
        targetEntityIds: [...assignment.targetEntityIds],
      }),
    ).toThrow("wall-net-area-openings-v1 requires one or more wall targets.");
  });

  it("returns null for an unsupported quantity rule", () => {
    const project = createDefaultProject();
    const assignment = {
      ...getFinePuttyAssignment(project),
      id: "assignment-unknown-rule",
      quantityRuleId: "unknown-rule",
    };

    expect(calculateAssignmentQuantity(project, assignment)).toBeNull();
  });

  it("rejects quantity and price units that do not match", () => {
    const quantity: QuantityResult = {
      ruleId: "test-rule",
      ruleVersion: "1.0.0",
      unit: "m2",
      value: 10,
      sourceEntityIds: [],
      usedOverride: false,
    };
    const price: PriceBookItem = {
      id: "test-price",
      label: "Test",
      unit: "lm",
      unitPriceEur: 2,
      devOnly: true,
    };

    expect(() => calculateLineTotalEur(quantity, price)).toThrow(
      "Quantity unit m2 does not match price unit lm.",
    );
  });
});

describe("supported offer line bridge", () => {
  it("returns one calculated line for each supported included assignment", () => {
    const project = createDefaultProject();
    const lines = calculateSupportedOfferLines(project);

    expect(lines.map((line) => line.assignmentId)).toEqual([
      "assignment-fine-putty-1",
      "assignment-laminate-flooring-1",
    ]);
    expect(lines[0]!.quantity.value).toBeCloseTo(
      calculateFinePuttyQuantity(project).value,
      8,
    );
    expect(lines[1]!.quantity.value).toBeCloseTo(
      calculateLaminateFlooringQuantity(project).value,
      8,
    );
  });

  it("supports a different assignment id when rule and price references are supported", () => {
    const project = createDefaultProject();
    const source = getFinePuttyAssignment(project);
    project.serviceAssignments.push({
      ...source,
      id: "assignment-second-wall-operation",
      serviceCode: "second-wall-operation",
      label: "Second wall operation",
    });

    const line = calculateSupportedOfferLine(
      project,
      "assignment-second-wall-operation",
    );

    expect(line?.assignmentId).toBe("assignment-second-wall-operation");
    expect(line?.quantity.ruleId).toBe("wall-net-area-openings-v1");
    expect(line?.price.id).toBe("dev-fine-putty");
    expect(line?.quantity.value).toBeCloseTo(
      calculateFinePuttyQuantity(project).value,
      8,
    );
  });

  it("does not invent a line for an unsupported assignment", () => {
    const project = createDefaultProject();
    project.serviceAssignments.push({
      id: "assignment-unknown",
      serviceCode: "unknown",
      label: "Unknown",
      targetEntityIds: ["room-1.ceiling"],
      included: true,
      quantityRuleId: "unknown-rule",
      presentationMode: "highlight",
    });

    expect(calculateSupportedOfferLine(project, "assignment-unknown")).toBeNull();
  });

  it("does not invent a line when the price reference is unsupported", () => {
    const project = createDefaultProject();
    const source = getFinePuttyAssignment(project);
    project.serviceAssignments.push({
      ...source,
      id: "assignment-unknown-price",
      priceBookItemId: "unknown-price",
    });

    expect(
      calculateSupportedOfferLine(project, "assignment-unknown-price"),
    ).toBeNull();
  });
});


describe("gypsum putty proof operation", () => {
  it("reuses the audited net-wall rule without a new service-specific formula", () => {
    let project = createOpeningProofProject("gypsum-proof");
    project = addOperationAssignment(project, gypsumPuttyOperation);

    const assignment = findOperationAssignment(project, gypsumPuttyOperation);
    expect(assignment).toBeDefined();

    const line = calculateSupportedOfferLine(project, assignment!.id);

    expect(line?.quantity.ruleId).toBe("wall-net-area-openings-v1");
    expect(line?.quantity.value).toBeCloseTo(46.8 - 1.89 - 1.32, 8);
    expect(line?.price.id).toBe(devGypsumPuttyPriceBookItem.id);
    expect(line?.totalEur).toBeCloseTo(line!.quantity.value, 8);
  });
});
