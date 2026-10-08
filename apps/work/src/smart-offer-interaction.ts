import type { ProjectState, SurfaceId } from "./domain";

export const FINE_PUTTY_ASSIGNMENT_ID = "assignment-fine-putty-1";
export const LAMINATE_ASSIGNMENT_ID = "assignment-laminate-flooring-1";

export type OfferInteractionState = {
  selectedServiceId: string | null;
  selectedEntity: SurfaceId | null;
};

export function createInitialOfferInteraction(): OfferInteractionState {
  return {
    selectedServiceId: FINE_PUTTY_ASSIGNMENT_ID,
    selectedEntity: null,
  };
}

export function selectOfferService(
  serviceAssignmentId: string,
): OfferInteractionState {
  return {
    selectedServiceId: serviceAssignmentId,
    selectedEntity: null,
  };
}

export function getLinkedServiceAssignments(
  project: ProjectState,
  id: SurfaceId,
) {
  return project.serviceAssignments.filter(
    (assignment) =>
      assignment.included && assignment.targetEntityIds.includes(id),
  );
}

export function selectModelEntity(
  project: ProjectState,
  id: SurfaceId,
): OfferInteractionState {
  const linkedAssignments = getLinkedServiceAssignments(project, id);

  return {
    selectedServiceId:
      linkedAssignments.length === 1 ? linkedAssignments[0]!.id : null,
    selectedEntity: id,
  };
}

export function selectModelEntityService(
  project: ProjectState,
  id: SurfaceId,
  serviceAssignmentId: string,
): OfferInteractionState {
  const linked = getLinkedServiceAssignments(project, id).some(
    (assignment) => assignment.id === serviceAssignmentId,
  );

  if (!linked) {
    throw new Error(
      `Service assignment ${serviceAssignmentId} is not linked to ${id}.`,
    );
  }

  return {
    selectedServiceId: serviceAssignmentId,
    selectedEntity: id,
  };
}

export function showWholeResult(): OfferInteractionState {
  return {
    selectedServiceId: null,
    selectedEntity: null,
  };
}

export function getFocusedServiceAssignmentIds(
  project: ProjectState,
  interaction: OfferInteractionState,
): string[] {
  if (interaction.selectedEntity) {
    const linkedAssignments = getLinkedServiceAssignments(
      project,
      interaction.selectedEntity,
    );

    if (
      interaction.selectedServiceId &&
      linkedAssignments.some(
        (assignment) => assignment.id === interaction.selectedServiceId,
      )
    ) {
      return [interaction.selectedServiceId];
    }

    return linkedAssignments.map((assignment) => assignment.id);
  }

  if (
    interaction.selectedServiceId &&
    project.serviceAssignments.some(
      (assignment) =>
        assignment.included &&
        assignment.id === interaction.selectedServiceId,
    )
  ) {
    return [interaction.selectedServiceId];
  }

  return [];
}

export function getHighlightedEntityIds(
  project: ProjectState,
  interaction: OfferInteractionState,
): SurfaceId[] {
  if (interaction.selectedEntity) {
    return [interaction.selectedEntity];
  }

  if (interaction.selectedServiceId) {
    const assignment = project.serviceAssignments.find(
      (item) =>
        item.included && item.id === interaction.selectedServiceId,
    );
    return assignment ? [...assignment.targetEntityIds] : [];
  }

  return [];
}


export function shouldShowLaminateFloor(
  project: ProjectState,
  interaction: OfferInteractionState,
): boolean {
  const laminate = project.serviceAssignments.find(
    (assignment) =>
      assignment.id === LAMINATE_ASSIGNMENT_ID &&
      assignment.included &&
      assignment.targetEntityIds.includes("room-1.floor"),
  );

  if (!laminate) return false;

  if (interaction.selectedEntity) {
    return (
      interaction.selectedEntity === "room-1.floor" &&
      laminate.targetEntityIds.includes(interaction.selectedEntity)
    );
  }

  if (interaction.selectedServiceId) {
    return interaction.selectedServiceId === LAMINATE_ASSIGNMENT_ID;
  }

  return true;
}
