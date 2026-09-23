import { describe, expect, it } from "vitest";
import { calculateFinePuttyQuantity, calculateLineTotalEur, devPriceBookItem } from "./calculation";
import { createDefaultProject } from "./domain";

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
    project.serviceAssignment.targetEntityIds = ["room-1.wall-right"];

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
