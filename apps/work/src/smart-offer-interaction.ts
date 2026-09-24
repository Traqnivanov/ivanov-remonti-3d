import type { ProjectState, SurfaceId } from "./domain";

export const FINE_PUTTY_ASSIGNMENT_ID = "assignment-fine-putty-1";

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

export function selectModelEntity(
  project: ProjectState,
  id: SurfaceId,
): OfferInteractionState {
  const linkedAssignments = project.serviceAssignments.filter(
    (assignment) =>
      assignment.included && assignment.targetEntityIds.includes(id),
  );

  return {
    selectedServiceId:
      linkedAssignments.length === 1 ? linkedAssignments[0]!.id : null,
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
    return project.serviceAssignments
      .filter(
        (assignment) =>
          assignment.included &&
          assignment.targetEntityIds.includes(interaction.selectedEntity!),
      )
      .map((assignment) => assignment.id);
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
