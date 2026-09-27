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
  ceilingAssignmentId: string;
  ceilingClientInfo: ClientInfo;
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
  ceilingAssignmentId: "assignment-gypsum-putty-ceiling-1",
  ceilingClientInfo: {
    what:
      "Гипсова шпакловка е подготвителен шпакловъчен слой върху тавана, според основата и избраната технология.",
    why:
      "Използва се за подготовка на тавана преди фината шпакловка, когато конкретната основа и технология го изискват.",
    result:
      "Подготвен таван за следващия фин слой.",
    includes:
      "Гипсова шпакловка върху тавана. Грунд, фина шпакловка, шлайфане и боя са отделни операции, когато са необходими.",
  },
};

export const sandingOperation: AuthorableOperationDefinition = {
  assignmentId: "assignment-sanding-1",
  serviceCode: "sanding",
  label: "Шлайфане",
  quantityRuleId: "wall-net-area-openings-v1",
  priceBookItemId: "dev-sanding",
  presentationMode: "highlight",
  allowedTargetKind: "wall",
  defaultTargetEntityIds: [...wallIds],
  clientInfo: {
    what:
      "Шлайфането премахва дребни неравности и следи от инструменти по шпаклованата повърхност.",
    why:
      "Прави основата гладка преди грундиране и боядисване.",
    result:
      "Гладка и подготвена повърхност за следващия довършителен етап.",
    includes:
      "Шлайфане на избраните стени. Грундът и боята са отделни операции.",
  },
  ceilingAssignmentId: "assignment-sanding-ceiling-1",
  ceilingClientInfo: {
    what:
      "Шлайфането премахва дребни неравности и следи от инструменти по шпаклования таван.",
    why:
      "Прави тавана гладък преди грундиране и боядисване.",
    result:
      "Гладък и подготвен таван за следващия довършителен етап.",
    includes:
      "Шлайфане на тавана. Грундът и боята са отделни операции.",
  },
};

export const primerOperation: AuthorableOperationDefinition = {
  assignmentId: "assignment-primer-1",
  serviceCode: "primer",
  label: "Грунд",
  quantityRuleId: "wall-net-area-openings-v1",
  priceBookItemId: "dev-primer",
  presentationMode: "highlight",
  allowedTargetKind: "wall",
  defaultTargetEntityIds: [...wallIds],
  clientInfo: {
    what:
      "Грундът подготвя основата преди боядисване и уеднаквява попиването на повърхността.",
    why:
      "Помага следващото покритие да се нанесе равномерно върху правилно подготвената основа.",
    result:
      "Грундирана повърхност, готова за боядисване според избраната система.",
    includes:
      "Грундиране на избраните стени. Шлайфането, локалните ремонти и боята са отделни операции.",
  },
  ceilingAssignmentId: "assignment-primer-ceiling-1",
  ceilingClientInfo: {
    what:
      "Грундът подготвя тавана преди боядисване и уеднаквява попиването на повърхността.",
    why:
      "Помага следващото покритие да се нанесе равномерно върху правилно подготвения таван.",
    result:
      "Грундиран таван, готов за боядисване според избраната система.",
    includes:
      "Грундиране на тавана. Шлайфането, локалните ремонти и боята са отделни операции.",
  },
};

export const paintOperation: AuthorableOperationDefinition = {
  assignmentId: "assignment-paint-1",
  serviceCode: "paint",
  label: "Боядисване",
  quantityRuleId: "wall-net-area-openings-v1",
  priceBookItemId: "dev-paint",
  presentationMode: "highlight",
  allowedTargetKind: "wall",
  defaultTargetEntityIds: [...wallIds],
  clientInfo: {
    what:
      "Боядисване с латекс върху подготвена и грундирана основа, стандартно в два слоя.",
    why:
      "Завършва стената с избраното крайно покритие и цвят.",
    result:
      "Завършени боядисани стени с равномерно покритие.",
    includes:
      "Боядисване на избраните стени. Подготовката, шпакловката, шлайфането и грундът остават отделни операции, когато са необходими.",
  },
  ceilingAssignmentId: "assignment-paint-ceiling-1",
  ceilingClientInfo: {
    what:
      "Боядисване с латекс върху подготвен и грундиран таван, стандартно в два слоя.",
    why:
      "Завършва тавана с избраното крайно покритие и цвят.",
    result:
      "Завършен боядисан таван с равномерно покритие.",
    includes:
      "Боядисване на тавана. Подготовката, шпакловката, шлайфането и грундът остават отделни операции, когато са необходими.",
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

export function findOperationCeilingAssignment(
  project: ProjectState,
  definition: AuthorableOperationDefinition,
): ServiceAssignment | undefined {
  return project.serviceAssignments.find(
    (assignment) => assignment.id === definition.ceilingAssignmentId,
  );
}

export function addOperationScopeAssignments(
  project: ProjectState,
  definition: AuthorableOperationDefinition,
): ProjectState {
  let nextProject = addOperationAssignment(project, definition);
  const existingCeiling = findOperationCeilingAssignment(nextProject, definition);

  if (!existingCeiling) {
    nextProject = {
      ...nextProject,
      serviceAssignments: [
        ...nextProject.serviceAssignments,
        {
          id: definition.ceilingAssignmentId,
          serviceCode: definition.serviceCode,
          label: definition.label,
          targetEntityIds: ["room-1.ceiling"],
          included: true,
          quantityRuleId: "ceiling-area-v1",
          priceBookItemId: definition.priceBookItemId,
          presentationMode: definition.presentationMode,
          clientInfo: { ...definition.ceilingClientInfo },
        },
      ],
    };
  } else {
    nextProject = setServiceAssignmentIncluded(
      nextProject,
      definition.ceilingAssignmentId,
      true,
    );
  }

  return setServiceAssignmentIncluded(
    nextProject,
    definition.assignmentId,
    true,
  );
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

export function setServiceAssignmentIncluded(
  project: ProjectState,
  assignmentId: string,
  included: boolean,
): ProjectState {
  let found = false;

  const serviceAssignments = project.serviceAssignments.map((assignment) => {
    if (assignment.id !== assignmentId) return assignment;
    found = true;

    if (included && assignment.targetEntityIds.length === 0) {
      throw new Error("An included service requires at least one target.");
    }

    return { ...assignment, included };
  });

  if (!found) {
    throw new Error(`Missing service assignment: ${assignmentId}`);
  }

  return {
    ...project,
    serviceAssignments,
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
