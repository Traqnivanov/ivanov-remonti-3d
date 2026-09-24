import { describe, expect, it } from "vitest";
import {
  FINE_PUTTY_ASSIGNMENT_ID,
  LAMINATE_ASSIGNMENT_ID,
  createInitialOfferInteraction,
  getFocusedServiceAssignmentIds,
  getHighlightedEntityIds,
  selectModelEntity,
  selectOfferService,
  shouldShowLaminateFloor,
  showWholeResult,
} from "./smart-offer-interaction";
import {
  calculateFinePuttyQuantity,
  calculateLaminateFlooringQuantity,
  calculateLineTotalEur,
  devLaminateFlooringPriceBookItem,
  devPriceBookItem,
} from "./calculation";
import {
  createDefaultProject,
  getFinePuttyAssignment,
  getLaminateFlooringAssignment,
} from "./domain";

describe("Smart Offer core interaction loop", () => {
  it("Offer → Model highlights the exact Fine Putty walls", () => {
    const project = createDefaultProject();
    const interaction = selectOfferService(FINE_PUTTY_ASSIGNMENT_ID);

    expect(interaction.selectedServiceId).toBe(FINE_PUTTY_ASSIGNMENT_ID);
    expect(interaction.selectedEntity).toBeNull();
    expect(getHighlightedEntityIds(project, interaction)).toEqual(
      getFinePuttyAssignment(project).targetEntityIds,
    );
  });

  it("Offer → Model highlights only the floor for Laminate", () => {
    const project = createDefaultProject();
    const interaction = selectOfferService(LAMINATE_ASSIGNMENT_ID);

    expect(getFocusedServiceAssignmentIds(project, interaction)).toEqual([
      LAMINATE_ASSIGNMENT_ID,
    ]);
    expect(getHighlightedEntityIds(project, interaction)).toEqual([
      "room-1.floor",
    ]);
  });

  it("Model → Offer resolves Fine Putty for a linked wall", () => {
    const project = createDefaultProject();
    const interaction = selectModelEntity(project, "room-1.wall-left");

    expect(interaction.selectedServiceId).toBe(FINE_PUTTY_ASSIGNMENT_ID);
    expect(interaction.selectedEntity).toBe("room-1.wall-left");
    expect(getFocusedServiceAssignmentIds(project, interaction)).toEqual([
      FINE_PUTTY_ASSIGNMENT_ID,
    ]);
  });

  it("Model → Offer resolves Laminate for the floor", () => {
    const project = createDefaultProject();
    const interaction = selectModelEntity(project, "room-1.floor");

    expect(interaction.selectedServiceId).toBe(LAMINATE_ASSIGNMENT_ID);
    expect(interaction.selectedEntity).toBe("room-1.floor");
    expect(getFocusedServiceAssignmentIds(project, interaction)).toEqual([
      LAMINATE_ASSIGNMENT_ID,
    ]);
  });

  it("does not invent a linked offer position for an unrelated surface", () => {
    const project = createDefaultProject();
    const interaction = selectModelEntity(project, "room-1.ceiling");

    expect(interaction.selectedServiceId).toBeNull();
    expect(interaction.selectedEntity).toBe("room-1.ceiling");
    expect(getFocusedServiceAssignmentIds(project, interaction)).toEqual([]);
    expect(getHighlightedEntityIds(project, interaction)).toEqual([
      "room-1.ceiling",
    ]);
  });

  it("does not silently choose one service if multiple assignments target the same entity", () => {
    const project = createDefaultProject();
    project.serviceAssignments.push({
      id: "assignment-second-floor-service",
      serviceCode: "second-floor-service",
      label: "Second floor service",
      targetEntityIds: ["room-1.floor"],
      included: true,
      quantityRuleId: "test-rule",
      presentationMode: "highlight",
    });

    const interaction = selectModelEntity(project, "room-1.floor");

    expect(interaction.selectedServiceId).toBeNull();
    expect(getFocusedServiceAssignmentIds(project, interaction)).toEqual([
      LAMINATE_ASSIGNMENT_ID,
      "assignment-second-floor-service",
    ]);
  });

  it("exits focus mode without mutating project quantity or price", () => {
    const project = createDefaultProject();
    const fineQuantity = calculateFinePuttyQuantity(project);
    const fineTotal = calculateLineTotalEur(fineQuantity, devPriceBookItem);
    const floorQuantity = calculateLaminateFlooringQuantity(project);
    const floorTotal = calculateLineTotalEur(
      floorQuantity,
      devLaminateFlooringPriceBookItem,
    );

    const interaction = showWholeResult();

    expect(interaction).toEqual({
      selectedServiceId: null,
      selectedEntity: null,
    });
    expect(getHighlightedEntityIds(project, interaction)).toEqual([]);
    expect(calculateFinePuttyQuantity(project)).toEqual(fineQuantity);
    expect(calculateLineTotalEur(fineQuantity, devPriceBookItem)).toBe(fineTotal);
    expect(calculateLaminateFlooringQuantity(project)).toEqual(floorQuantity);
    expect(
      calculateLineTotalEur(
        floorQuantity,
        devLaminateFlooringPriceBookItem,
      ),
    ).toBe(floorTotal);
  });

  it("starts with Fine Putty focused without changing project data", () => {
    const project = createDefaultProject();
    const fineBefore = [...getFinePuttyAssignment(project).targetEntityIds];
    const floorBefore = [...getLaminateFlooringAssignment(project).targetEntityIds];

    const interaction = createInitialOfferInteraction();

    expect(interaction).toEqual({
      selectedServiceId: FINE_PUTTY_ASSIGNMENT_ID,
      selectedEntity: null,
    });
    expect(getHighlightedEntityIds(project, interaction)).toEqual(fineBefore);
    expect(getFinePuttyAssignment(project).targetEntityIds).toEqual(fineBefore);
    expect(getLaminateFlooringAssignment(project).targetEntityIds).toEqual(
      floorBefore,
    );
  });
});


describe("Laminate floor presentation state", () => {
  it("shows the Laminate result for Laminate focus and whole-result mode", () => {
    const project = createDefaultProject();

    expect(
      shouldShowLaminateFloor(
        project,
        selectOfferService(LAMINATE_ASSIGNMENT_ID),
      ),
    ).toBe(true);
    expect(shouldShowLaminateFloor(project, showWholeResult())).toBe(true);
  });

  it("keeps the Laminate result hidden while Fine Putty is the focused service", () => {
    const project = createDefaultProject();

    expect(
      shouldShowLaminateFloor(
        project,
        selectOfferService(FINE_PUTTY_ASSIGNMENT_ID),
      ),
    ).toBe(false);
  });

  it("shows Laminate when the linked floor itself is selected", () => {
    const project = createDefaultProject();

    expect(
      shouldShowLaminateFloor(
        project,
        selectModelEntity(project, "room-1.floor"),
      ),
    ).toBe(true);
  });

  it("does not invent Laminate presentation for an older Fine Putty-only project", () => {
    const project = createDefaultProject();
    project.serviceAssignments = project.serviceAssignments.filter(
      (assignment) => assignment.id !== LAMINATE_ASSIGNMENT_ID,
    );

    expect(shouldShowLaminateFloor(project, showWholeResult())).toBe(false);
  });
});
