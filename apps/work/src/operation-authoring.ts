import {
  isWallId,
  wallIds,
  type ClientInfo,
  type ProjectState,
  type ServiceAssignment,
  type ServicePresentationMode,
  type SurfaceId,
  type WallId,
} from "./domain";

export type AuthorableOperationDefinition = {
  assignmentId: string;
  serviceCode: string;
  label: string;
  quantityRuleId: string;
  priceBookItemId: string;
  presentationMode: ServicePresentationMode;
  allowedTargetKind: "wall";
  defaultTargetEntityIds: WallId[];
  clientInfo: ClientInfo;
};

export const gypsumPuttyOperation: AuthorableOperationDefinition = {
  assignmentId: "assignment-gypsum-putty-1",
  serviceCode: "gypsum-putty",
  label: "Гипсова шпакловка",
  quantityRuleId: "wall-net-area-openings-v1",
  priceBookItemId: "dev-gypsum-putty",
  presentationMode: "highlight",
  allowedTargetKind: "wall",
  defaultTargetEntityIds: [...wallIds],
  clientInfo: {
    what:
      "Гипсова шпакловка е подготвителен шпакловъчен слой, обичайно в 1–2 ръце според основата и избраната технология.",
    why:
      "Използва се за подготовка на повърхността преди фината полимерна шпакловка, когато конкретната основа и технология го изискват.",
    result:
      "Подготвена основа за следващия фин слой. При съществено криви стени изравняването е работа на мазилката, не на гипсовата шпакловка.",
    includes:
      "Гипсова шпакловка върху избраните повърхности. Грунд, мазилка, армиране, фина шпакловка, шлайфане и боя са отделни операции, когато са необходими.",
  },
};

export function findOperationAssignment(
  project: ProjectState,
  definition: AuthorableOperationDefinition,
): ServiceAssignment | undefined {
  return project.serviceAssignments.find(
    (assignment) => assignment.id === definition.assignmentId,
  );
}

export function addOperationAssignment(
  project: ProjectState,
  definition: AuthorableOperationDefinition,
): ProjectState {
  if (findOperationAssignment(project, definition)) return project;

  return {
    ...project,
    serviceAssignments: [
      ...project.serviceAssignments,
      {
        id: definition.assignmentId,
        serviceCode: definition.serviceCode,
        label: definition.label,
        targetEntityIds: [...definition.defaultTargetEntityIds],
        included: true,
        quantityRuleId: definition.quantityRuleId,
        priceBookItemId: definition.priceBookItemId,
        presentationMode: definition.presentationMode,
        clientInfo: { ...definition.clientInfo },
      },
    ],
  };
}

export function removeOperationAssignment(
  project: ProjectState,
  definition: AuthorableOperationDefinition,
): ProjectState {
  if (!findOperationAssignment(project, definition)) return project;

  return {
    ...project,
    serviceAssignments: project.serviceAssignments.filter(
      (assignment) => assignment.id !== definition.assignmentId,
    ),
  };
}

export function setOperationIncluded(
  project: ProjectState,
  definition: AuthorableOperationDefinition,
  included: boolean,
): ProjectState {
  return updateOperation(project, definition, (assignment) => {
    if (included && assignment.targetEntityIds.length === 0) {
      throw new Error("An included operation requires at least one target.");
    }
    return { ...assignment, included };
  });
}

export function setOperationTargets(
  project: ProjectState,
  definition: AuthorableOperationDefinition,
  targetEntityIds: SurfaceId[],
): ProjectState {
  if (
    definition.allowedTargetKind === "wall" &&
    targetEntityIds.some((id) => !isWallId(id))
  ) {
    throw new Error("This operation supports wall targets only.");
  }

  return updateOperation(project, definition, (assignment) => {
    if (assignment.included && targetEntityIds.length === 0) {
      throw new Error(
        "Choose at least one wall or exclude the operation first.",
      );
    }

    return {
      ...assignment,
      targetEntityIds: [...targetEntityIds],
    };
  });
}

function updateOperation(
  project: ProjectState,
  definition: AuthorableOperationDefinition,
  updater: (assignment: ServiceAssignment) => ServiceAssignment,
): ProjectState {
  const assignment = findOperationAssignment(project, definition);
  if (!assignment) {
    throw new Error(`Missing operation assignment: ${definition.assignmentId}`);
  }

  return {
    ...project,
    serviceAssignments: project.serviceAssignments.map((item) =>
      item.id === definition.assignmentId ? updater(item) : item,
    ),
  };
}
