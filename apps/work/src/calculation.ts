import {
  getFinePuttyAssignment,
  getLaminateFlooringAssignment,
  type ProjectState,
  type SurfaceId,
} from "./domain";
import { getWallAreaM2, summarizeRoomGeometry } from "./geometry";

export type QuantityResult = {
  ruleId: string;
  ruleVersion: "1.0.0";
  unit: "m2";
  value: number;
  sourceEntityIds: SurfaceId[];
  usedOverride: false;
};

export type PriceBookItem = {
  id: string;
  label: string;
  unit: "m2";
  unitPriceEur: number;
  devOnly: true;
};

export const devFinePuttyPriceBookItem: PriceBookItem = {
  id: "dev-fine-putty",
  label: "Фина шпакловка — DEV",
  unit: "m2",
  unitPriceEur: 1,
  devOnly: true,
};

export const devPriceBookItem = devFinePuttyPriceBookItem;

export const devLaminateFlooringPriceBookItem: PriceBookItem = {
  id: "dev-laminate-flooring",
  label: "Ламинат — DEV",
  unit: "m2",
  unitPriceEur: 1,
  devOnly: true,
};

export function calculateFinePuttyQuantity(project: ProjectState): QuantityResult {
  const assignment = getFinePuttyAssignment(project);
  const sourceEntityIds = assignment.included
    ? [...assignment.targetEntityIds]
    : [];

  const value = sourceEntityIds.reduce(
    (sum, wallId) => sum + getWallAreaM2(project, wallId),
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

export function calculateLaminateFlooringQuantity(
  project: ProjectState,
): QuantityResult {
  const assignment = getLaminateFlooringAssignment(project);
  const sourceEntityIds = assignment.included
    ? [...assignment.targetEntityIds]
    : [];

  return {
    ruleId: "floor-area-v1",
    ruleVersion: "1.0.0",
    unit: "m2",
    value: sourceEntityIds.length
      ? summarizeRoomGeometry(project).floorM2
      : 0,
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
