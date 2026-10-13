import {
  getFinePuttyAssignment,
  getLaminateFlooringAssignment,
  isWallId,
  type ClientInfo,
  type ProjectState,
  type ServiceAssignment,
  type SurfaceId,
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

export type DynamicOfferLineCalculation = {
  assignmentId: string;
  label: string;
  quantity: QuantityResult;
  unitPriceEur: number | null;
  totalEur: number | null;
  priceStatus: "missing" | "priced";
  clientInfo: ClientInfo;
};

export type DynamicOfferSummary = {
  lines: DynamicOfferLineCalculation[];
  pricedSubtotalEur: number;
  complete: boolean;
  missingPriceAssignmentIds: string[];
};

export type EntityOfferBreakdown = {
  assignmentId: string;
  entityId: SurfaceId;
  quantity: QuantityResult;
  unitPriceEur: number | null;
  totalEur: number | null;
  priceStatus: "missing" | "priced";
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

export const devGypsumPuttyPriceBookItem: PriceBookItem = {
  id: "dev-gypsum-putty",
  label: "Гипсова шпакловка — DEV",
  unit: "m2",
  unitPriceEur: 1,
  devOnly: true,
};

export const devSandingPriceBookItem: PriceBookItem = {
  id: "dev-sanding",
  label: "Шлайфане — DEV",
  unit: "m2",
  unitPriceEur: 1,
  devOnly: true,
};

export const devPrimerPriceBookItem: PriceBookItem = {
  id: "dev-primer",
  label: "Грунд — DEV",
  unit: "m2",
  unitPriceEur: 1,
  devOnly: true,
};

export const devPaintPriceBookItem: PriceBookItem = {
  id: "dev-paint",
  label: "Боядисване — DEV",
  unit: "m2",
  unitPriceEur: 1,
  devOnly: true,
};

const devPriceBookItems: Record<string, PriceBookItem> = {
  [devFinePuttyPriceBookItem.id]: devFinePuttyPriceBookItem,
  [devLaminateFlooringPriceBookItem.id]: devLaminateFlooringPriceBookItem,
  [devGypsumPuttyPriceBookItem.id]: devGypsumPuttyPriceBookItem,
  [devSandingPriceBookItem.id]: devSandingPriceBookItem,
  [devPrimerPriceBookItem.id]: devPrimerPriceBookItem,
  [devPaintPriceBookItem.id]: devPaintPriceBookItem,
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

function calculateCeilingAreaQuantity(
  project: ProjectState,
  assignment: ServiceAssignment,
): QuantityResult {
  if (!assignment.included) {
    return {
      ruleId: "ceiling-area-v1",
      ruleVersion: "1.0.0",
      unit: "m2",
      value: 0,
      sourceEntityIds: [],
      usedOverride: false,
    };
  }

  if (
    assignment.targetEntityIds.length !== 1 ||
    assignment.targetEntityIds[0] !== "room-1.ceiling"
  ) {
    throw new Error("ceiling-area-v1 requires exactly the room ceiling target.");
  }

  return {
    ruleId: "ceiling-area-v1",
    ruleVersion: "1.0.0",
    unit: "m2",
    value: project.room.widthM * project.room.lengthM,
    sourceEntityIds: ["room-1.ceiling"],
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
  "ceiling-area-v1": calculateCeilingAreaQuantity,
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


export function setAssignmentUnitPriceEur(
  project: ProjectState,
  assignmentId: string,
  unitPriceEur: number | null,
): ProjectState {
  if (
    unitPriceEur !== null &&
    (!Number.isFinite(unitPriceEur) || unitPriceEur < 0)
  ) {
    throw new Error("Unit price must be a non-negative finite EUR amount.");
  }

  let found = false;
  const serviceAssignments = project.serviceAssignments.map((assignment) => {
    if (assignment.id !== assignmentId) return assignment;
    found = true;

    if (unitPriceEur === null) {
      const { unitPriceEur: _removed, ...withoutPrice } = assignment;
      return withoutPrice;
    }

    return {
      ...assignment,
      unitPriceEur,
    };
  });

  if (!found) {
    throw new Error(`Missing service assignment: ${assignmentId}`);
  }

  return {
    ...project,
    serviceAssignments,
  };
}

export function calculateEntityOfferBreakdown(
  project: ProjectState,
  assignmentId: string,
  entityId: SurfaceId,
): EntityOfferBreakdown | null {
  const assignment = project.serviceAssignments.find(
    (item) => item.id === assignmentId,
  );

  if (
    !assignment ||
    !assignment.included ||
    !assignment.targetEntityIds.includes(entityId)
  ) {
    return null;
  }

  const quantity = calculateAssignmentQuantity(project, {
    ...assignment,
    targetEntityIds: [entityId],
  });
  if (!quantity) return null;

  const unitPriceEur = assignment.unitPriceEur;
  if (unitPriceEur === undefined) {
    return {
      assignmentId,
      entityId,
      quantity,
      unitPriceEur: null,
      totalEur: null,
      priceStatus: "missing",
    };
  }

  if (!Number.isFinite(unitPriceEur) || unitPriceEur < 0) {
    throw new Error("Stored unit price must be a non-negative finite EUR amount.");
  }

  return {
    assignmentId,
    entityId,
    quantity,
    unitPriceEur,
    totalEur: quantity.value * unitPriceEur,
    priceStatus: "priced",
  };
}

export function calculateDynamicOfferLine(
  project: ProjectState,
  assignmentId: string,
): DynamicOfferLineCalculation | null {
  const assignment = project.serviceAssignments.find(
    (item) => item.id === assignmentId,
  );

  if (!assignment || !assignment.included || !assignment.clientInfo) return null;

  const quantity = calculateAssignmentQuantity(project, assignment);
  if (!quantity) return null;

  const unitPriceEur = assignment.unitPriceEur;
  if (unitPriceEur === undefined) {
    return {
      assignmentId: assignment.id,
      label: assignment.label,
      quantity,
      unitPriceEur: null,
      totalEur: null,
      priceStatus: "missing",
      clientInfo: assignment.clientInfo,
    };
  }

  if (!Number.isFinite(unitPriceEur) || unitPriceEur < 0) {
    throw new Error("Stored unit price must be a non-negative finite EUR amount.");
  }

  return {
    assignmentId: assignment.id,
    label: assignment.label,
    quantity,
    unitPriceEur,
    totalEur: quantity.value * unitPriceEur,
    priceStatus: "priced",
    clientInfo: assignment.clientInfo,
  };
}

export function calculateDynamicOfferSummary(
  project: ProjectState,
): DynamicOfferSummary {
  const lines = project.serviceAssignments
    .map((assignment) => calculateDynamicOfferLine(project, assignment.id))
    .filter((line): line is DynamicOfferLineCalculation => line !== null);

  const missingPriceAssignmentIds = lines
    .filter((line) => line.priceStatus === "missing")
    .map((line) => line.assignmentId);

  return {
    lines,
    pricedSubtotalEur: lines.reduce(
      (sum, line) => sum + (line.totalEur ?? 0),
      0,
    ),
    complete: missingPriceAssignmentIds.length === 0,
    missingPriceAssignmentIds,
  };
}
