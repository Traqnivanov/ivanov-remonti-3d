import {
  getFinePuttyAssignment,
  getLaminateFlooringAssignment,
  isWallId,
  type ClientInfo,
  type ProjectState,
  type ServiceAssignment,
  type WallId,
} from "./domain";
import { getWallNetAreaM2, summarizeRoomGeometry } from "./geometry";

export type QuantityUnit =
  | "m2"
  | "lm"
  | "count"
  | "point"
  | "set"
  | "fixed";

export type QuantityResult = {
  ruleId: string;
  ruleVersion: "1.0.0";
  unit: QuantityUnit;
  value: number;
  sourceEntityIds: string[];
  usedOverride: false;
};

export type PriceBookItem = {
  id: string;
  label: string;
  unit: QuantityUnit;
  unitPriceEur: number;
  devOnly: true;
};

export type OfferLineCalculation = {
  assignmentId: string;
  label: string;
  quantity: QuantityResult;
  price: PriceBookItem;
  totalEur: number;
  clientInfo: ClientInfo;
};

type QuantityRuleCalculator = (
  project: ProjectState,
  assignment: ServiceAssignment,
) => QuantityResult;

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

const devPriceBookItems: Record<string, PriceBookItem> = {
  [devFinePuttyPriceBookItem.id]: devFinePuttyPriceBookItem,
  [devLaminateFlooringPriceBookItem.id]: devLaminateFlooringPriceBookItem,
};

function calculateWallNetAreaOpeningsQuantity(
  project: ProjectState,
  assignment: ServiceAssignment,
): QuantityResult {
  if (!assignment.included) {
    return {
      ruleId: "wall-net-area-openings-v1",
      ruleVersion: "1.0.0",
      unit: "m2",
      value: 0,
      sourceEntityIds: [],
      usedOverride: false,
    };
  }

  if (
    assignment.targetEntityIds.length === 0 ||
    assignment.targetEntityIds.some((id) => !isWallId(id))
  ) {
    throw new Error(
      "wall-net-area-openings-v1 requires one or more wall targets.",
    );
  }

  const wallIds = assignment.targetEntityIds as WallId[];
  const value = wallIds.reduce(
    (sum, wallId) => sum + getWallNetAreaM2(project, wallId),
    0,
  );
  const deductedOpeningIds = project.room.openings
    .filter((opening) => wallIds.includes(opening.hostSurfaceId))
    .map((opening) => opening.id);

  return {
    ruleId: "wall-net-area-openings-v1",
    ruleVersion: "1.0.0",
    unit: "m2",
    value,
    sourceEntityIds: [...wallIds, ...deductedOpeningIds],
    usedOverride: false,
  };
}

function calculateFloorAreaQuantity(
  project: ProjectState,
  assignment: ServiceAssignment,
): QuantityResult {
  if (!assignment.included) {
    return {
      ruleId: "floor-area-v1",
      ruleVersion: "1.0.0",
      unit: "m2",
      value: 0,
      sourceEntityIds: [],
      usedOverride: false,
    };
  }

  if (
    assignment.targetEntityIds.length !== 1 ||
    assignment.targetEntityIds[0] !== "room-1.floor"
  ) {
    throw new Error("floor-area-v1 requires exactly the room floor target.");
  }

  return {
    ruleId: "floor-area-v1",
    ruleVersion: "1.0.0",
    unit: "m2",
    value: summarizeRoomGeometry(project).floorM2,
    sourceEntityIds: ["room-1.floor"],
    usedOverride: false,
  };
}

const quantityRuleCalculators: Record<string, QuantityRuleCalculator> = {
  "wall-net-area-openings-v1": calculateWallNetAreaOpeningsQuantity,
  "floor-area-v1": calculateFloorAreaQuantity,
};

export function calculateAssignmentQuantity(
  project: ProjectState,
  assignment: ServiceAssignment,
): QuantityResult | null {
  const calculator = quantityRuleCalculators[assignment.quantityRuleId];
  return calculator ? calculator(project, assignment) : null;
}

export function findDevPriceBookItem(
  priceBookItemId: string | undefined,
): PriceBookItem | null {
  if (!priceBookItemId) return null;
  return devPriceBookItems[priceBookItemId] ?? null;
}

export function calculateFinePuttyQuantity(
  project: ProjectState,
): QuantityResult {
  const quantity = calculateAssignmentQuantity(
    project,
    getFinePuttyAssignment(project),
  );
  if (!quantity) {
    throw new Error("Fine Putty quantity rule is not supported.");
  }
  return quantity;
}

export function calculateLaminateFlooringQuantity(
  project: ProjectState,
): QuantityResult {
  const quantity = calculateAssignmentQuantity(
    project,
    getLaminateFlooringAssignment(project),
  );
  if (!quantity) {
    throw new Error("Laminate flooring quantity rule is not supported.");
  }
  return quantity;
}

export function calculateLineTotalEur(
  quantity: QuantityResult,
  price: PriceBookItem,
): number {
  if (quantity.unit !== price.unit) {
    throw new Error(
      `Quantity unit ${quantity.unit} does not match price unit ${price.unit}.`,
    );
  }
  return quantity.value * price.unitPriceEur;
}

export function calculateSupportedOfferLine(
  project: ProjectState,
  assignmentId: string,
): OfferLineCalculation | null {
  const assignment = project.serviceAssignments.find(
    (item) => item.id === assignmentId,
  );

  if (!assignment || !assignment.included || !assignment.clientInfo) return null;

  const quantity = calculateAssignmentQuantity(project, assignment);
  const price = findDevPriceBookItem(assignment.priceBookItemId);

  if (!quantity || !price) return null;

  return {
    assignmentId: assignment.id,
    label: assignment.label,
    quantity,
    price,
    totalEur: calculateLineTotalEur(quantity, price),
    clientInfo: assignment.clientInfo,
  };
}

export function calculateSupportedOfferLines(
  project: ProjectState,
): OfferLineCalculation[] {
  return project.serviceAssignments
    .map((assignment) => calculateSupportedOfferLine(project, assignment.id))
    .filter((line): line is OfferLineCalculation => line !== null);
}
