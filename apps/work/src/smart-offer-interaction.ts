import { getFinePuttyAssignment, type ProjectState, type SurfaceId } from "./domain";

export type OfferInteractionState = {
  selectedService: boolean;
  selectedEntity: SurfaceId | null;
};

export function createInitialOfferInteraction(): OfferInteractionState {
  return {
    selectedService: true,
    selectedEntity: null,
  };
}

export function selectOfferService(): OfferInteractionState {
  return {
    selectedService: true,
    selectedEntity: null,
  };
}

export function selectModelEntity(
  project: ProjectState,
  id: SurfaceId,
): OfferInteractionState {
  const linked = getFinePuttyAssignment(project).targetEntityIds.some(
    (targetId) => targetId === id,
  );

  return {
    selectedService: linked,
    selectedEntity: id,
  };
}

export function showWholeResult(): OfferInteractionState {
  return {
    selectedService: false,
    selectedEntity: null,
  };
}

export function getHighlightedEntityIds(
  project: ProjectState,
  interaction: OfferInteractionState,
): SurfaceId[] {
  if (interaction.selectedEntity) {
    return [interaction.selectedEntity];
  }

  if (interaction.selectedService) {
    return [...getFinePuttyAssignment(project).targetEntityIds];
  }

  return [];
}
