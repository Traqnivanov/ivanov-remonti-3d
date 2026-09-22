import { describe, expect, it } from "vitest";
import {
  createInitialOfferInteraction,
  getHighlightedEntityIds,
  selectModelEntity,
  selectOfferService,
  showWholeResult,
} from "./smart-offer-interaction";
import {
  calculateFinePuttyQuantity,
  calculateLineTotalEur,
  devPriceBookItem,
} from "./calculation";
import { createDefaultProject } from "./domain";

describe("Smart Offer core interaction loop", () => {
  it("Offer → Model highlights the exact assigned walls", () => {
    const project = createDefaultProject();
    const interaction = selectOfferService();

    expect(interaction.selectedService).toBe(true);
    expect(interaction.selectedEntity).toBeNull();
    expect(getHighlightedEntityIds(project, interaction)).toEqual(
      project.serviceAssignment.targetEntityIds,
    );
  });

  it("Model → Offer keeps Fine Putty selected for a linked wall", () => {
    const project = createDefaultProject();
    const interaction = selectModelEntity(project, "room-1.wall-left");

    expect(interaction.selectedService).toBe(true);
    expect(interaction.selectedEntity).toBe("room-1.wall-left");
    expect(getHighlightedEntityIds(project, interaction)).toEqual([
      "room-1.wall-left",
    ]);
  });

  it("does not claim Fine Putty is linked to unrelated geometry", () => {
    const project = createDefaultProject();
    const interaction = selectModelEntity(project, "room-1.floor");

    expect(interaction.selectedService).toBe(false);
    expect(interaction.selectedEntity).toBe("room-1.floor");
    expect(getHighlightedEntityIds(project, interaction)).toEqual([
      "room-1.floor",
    ]);
  });

  it("exits focus mode without mutating project quantity or price", () => {
    const project = createDefaultProject();
    const beforeQuantity = calculateFinePuttyQuantity(project);
    const beforeTotal = calculateLineTotalEur(beforeQuantity, devPriceBookItem);

    const interaction = showWholeResult();

    const afterQuantity = calculateFinePuttyQuantity(project);
    const afterTotal = calculateLineTotalEur(afterQuantity, devPriceBookItem);

    expect(interaction).toEqual({
      selectedService: false,
      selectedEntity: null,
    });
    expect(getHighlightedEntityIds(project, interaction)).toEqual([]);
    expect(afterQuantity).toEqual(beforeQuantity);
    expect(afterTotal).toBe(beforeTotal);
  });

  it("starts with Fine Putty focused without changing project data", () => {
    const project = createDefaultProject();
    const beforeTargets = [...project.serviceAssignment.targetEntityIds];

    const interaction = createInitialOfferInteraction();

    expect(interaction).toEqual({
      selectedService: true,
      selectedEntity: null,
    });
    expect(getHighlightedEntityIds(project, interaction)).toEqual(beforeTargets);
    expect(project.serviceAssignment.targetEntityIds).toEqual(beforeTargets);
  });

  it("keeps quantity and price invariant across presentation-only selections", () => {
    const project = createDefaultProject();
    const quantity = calculateFinePuttyQuantity(project);
    const total = calculateLineTotalEur(quantity, devPriceBookItem);

    const interactions = [
      selectOfferService(),
      selectModelEntity(project, "room-1.wall-front"),
      selectModelEntity(project, "room-1.floor"),
      showWholeResult(),
    ];

    for (const interaction of interactions) {
      getHighlightedEntityIds(project, interaction);

      const currentQuantity = calculateFinePuttyQuantity(project);
      const currentTotal = calculateLineTotalEur(currentQuantity, devPriceBookItem);

      expect(currentQuantity).toEqual(quantity);
      expect(currentTotal).toBe(total);
    }
  });
});
