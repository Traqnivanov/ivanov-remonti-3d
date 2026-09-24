import { describe, expect, it } from "vitest";
import {
  calculateFinePuttyQuantity,
  calculateLaminateFlooringQuantity,
  calculateLineTotalEur,
  calculateSupportedOfferLine,
  calculateSupportedOfferLines,
  devLaminateFlooringPriceBookItem,
  devPriceBookItem,
} from "./calculation";
import {
  createDefaultProject,
  getFinePuttyAssignment,
  getLaminateFlooringAssignment,
} from "./domain";

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
    expect(calculateLineTotalEur(
      quantity,
      devLaminateFlooringPriceBookItem,
    )).toBeCloseTo(
      quantity.value * devLaminateFlooringPriceBookItem.unitPriceEur,
      8,
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
});
