import type { ProjectState, WallId } from "./domain";

export type QuantityResult = {
  ruleId: "wall-area-v1";
  ruleVersion: "1.0.0";
  unit: "m2";
  value: number;
  sourceEntityIds: WallId[];
  usedOverride: false;
};

export type PriceBookItem = {
  id: "dev-fine-putty";
  label: "Фина шпакловка — DEV";
  unit: "m2";
  unitPriceEur: number;
  devOnly: true;
};

export const devPriceBookItem: PriceBookItem = {
  id: "dev-fine-putty",
  label: "Фина шпакловка — DEV",
  unit: "m2",
  unitPriceEur: 1,
  devOnly: true,
};

function wallArea(project: ProjectState, wallId: WallId): number {
  const { widthM, lengthM, heightM } = project.room;

  switch (wallId) {
    case "room-1.wall-front":
    case "room-1.wall-back":
      return widthM * heightM;
    case "room-1.wall-left":
    case "room-1.wall-right":
      return lengthM * heightM;
  }
}

export function calculateFinePuttyQuantity(project: ProjectState): QuantityResult {
  const sourceEntityIds = project.serviceAssignment.included
    ? [...project.serviceAssignment.targetEntityIds]
    : [];

  const value = sourceEntityIds.reduce(
    (sum, wallId) => sum + wallArea(project, wallId),
    0,
  );

  return {
    ruleId: "wall-area-v1",
    ruleVersion: "1.0.0",
    unit: "m2",
    value,
    sourceEntityIds,
    usedOverride: false,
  };
}

export function calculateLineTotalEur(
  quantity: QuantityResult,
  price: PriceBookItem,
): number {
  return quantity.value * price.unitPriceEur;
}
