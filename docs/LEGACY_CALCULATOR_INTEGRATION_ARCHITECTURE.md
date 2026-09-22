# LEGACY CALCULATOR INTEGRATION ARCHITECTURE v1

**Status:** WORK CONTROLLER CURRENT ARCHITECTURE — Owner delegated technical integration judgment  
**Purpose:** connect the two existing Ivanov Remonti calculators to Smart Offer without turning the new product into one huge, tightly-coupled application.  
**Safety:** `Traqnivanov/ivanov-tools` remains read-only. No runtime dependency on its HTML files.

---

## 1. Problem

Ivanov Remonti already has two valuable calculators with non-trivial logic.

If we rewrite everything from zero, we risk:
- losing proven field logic;
- reintroducing already solved mistakes;
- duplicating formulas;
- wasting development time.

If we simply embed the old HTML calculators into the new app, we risk:
- duplicate state;
- old DOM/UI coupled to new 3D;
- multiple storage systems;
- difficult testing;
- difficult maintenance;
- a heavy client bundle;
- future changes breaking unrelated modules.

Therefore the integration point must be **data and calculation contracts**, not direct UI-to-UI coupling.

---

## 2. The two calculators have different specialist roles

### A. `kalkulator-combined.html` — M² / room / diagram calculator

Observed useful capabilities include:

- rectangular room dimensions;
- gross walls: `2 × (L + W) × H`;
- ceiling/floor: `L × W`;
- volume and perimeter;
- S1 / S2 / S3 / S4 wall areas;
- SVG room diagram and dimension lines;
- windows/doors as openings;
- opening-area deductions;
- niches/projections with plus/minus adjustment;
- manual net-m² override;
- paint/putty/adhesive/material calculations;
- drywall wall selection;
- wall sheet count;
- drywall sheet layout/schema;
- reserve/waste helpers;
- ceiling/wall/partition drywall sections.

This tool is not “just a formula”. It is a **specialist technical M² + layout workspace**.

### B. `calculator.html` — detailed construction/material calculator

Observed useful capabilities include:

- multiple rooms/positions;
- ceilings;
- wall linings;
- partitions;
- drywall wall states;
- putty wall states/stacks;
- additional layers;
- material specifications;
- boards;
- UD/CD/UW/CW profiles;
- hangers;
- screws;
- dowels;
- tape;
- joint compounds;
- insulation;
- adhesives/foam;
- packaging/rounding;
- manual overrides;
- calculated total cost;
- PDF/specification workflow;
- save/open project workflow.

This tool is a **specialist service/material planner**, especially for drywall and finishing stacks.

### Supporting reference: `room.html`

`room.html` is useful as a product/workflow reference for:
- surface-based service assignment;
- room/project structure;
- double-sided partitions;
- quantity × price;
- quote/PDF workflow.

It is not treated as a third calculator engine that must be ported whole.

---

## 3. Core decision: integrate data, not screens

We do **not** combine the old calculator UIs with the new 3D UI into one screen.

We do **not** place the old HTML pages inside iframes.

We do **not** let 3D call DOM functions from the old calculators.

Instead:

```
                 Project Geometry / Domain State
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
    3D Work View    M² Technical View   Service Calculators
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                 Quantity / Material Results
                         │
                         ▼
                      Price Book
                         │
                         ▼
                    Smart Offer
```

One source of dimensions and entities.

Several specialist views/calculators.

No duplicated project truth.

---

## 4. 2D M² drawing and 3D are deliberately different

The existing 2D/SVG drawing is useful precisely because it is a technical M² view.

It should **not** be forced to become 3D.

Likewise the 3D renderer should not try to reproduce every technical calculator diagram.

### Work Mode can eventually expose:

- **3D** — spatial editing, placement, visual result, client preview;
- **M² / Схема** — technical 2D room diagram, dimensions, S1–S4, openings, areas;
- **Количества / Материали** — specialist calculations;
- **Оферта** — services, price and client presentation.

They are tabs/panels over one project, not four separate projects.

This is intentionally simpler than merging all visuals into one canvas.

---

## 5. One-way dependency rule

The dependency direction must be:

```
Domain Project
   ↓
Geometry selectors
   ↓
Calculation modules
   ↓
Result contracts
   ↓
Work UI / 2D schema / 3D / Offer UI
```

Forbidden:

- calculator DOM → 3D mesh;
- 3D mesh → Price Book;
- 2D SVG element → quantity;
- client viewer → Work calculator;
- old localStorage → canonical new project state.

UI is a consumer, never the source of quantity truth.

---

## 6. Migration classification for every legacy feature

Each legacy feature must receive one of four statuses before implementation.

### A. EXTRACT
Pure logic that belongs in the new calculation/domain core.

Examples:
- wall/floor/ceiling area;
- opening area;
- perimeter;
- volume;
- niche adjustment after validation;
- material consumption formula;
- drywall profile/material rule after audit.

### B. REBUILD AS SPECIALIST VIEW
Useful visualization/workflow, but old DOM code should not be reused directly.

Examples:
- SVG room diagram;
- S1/S2/S3/S4 labels;
- dimension lines;
- drywall board layout;
- sheet-cutting diagram.

### C. KEEP AS REFERENCE UNTIL NEEDED
Useful but not required for the current slice.

Examples:
- advanced drywall layouts;
- full material packaging;
- PDF variants;
- large multi-room workflows.

### D. RETIRE / DO NOT PORT
Duplicate, obsolete, contradictory or tightly coupled behavior.

Examples:
- embedded old prices;
- ambiguous operation keys;
- Firebase/localStorage coupling from legacy tools;
- UI-specific calculations that duplicate a pure domain rule.

Nothing is ported merely because it already exists.

---

## 7. Service calculation plug-ins

The new app should not have one giant `calculateEverything()`.

Each service family gets an isolated calculator module only when needed.

Example future shape:

```
calculation-core/
  geometry/
    roomAreas.ts
    openings.ts
    perimeter.ts

  services/
    putty.ts
    paint.ts
    drywall/
      walls.ts
      ceilings.ts
      partitions.ts
      boardLayout.ts
      profiles.ts
    tile.ts
    screed.ts

  materials/
    packageRounding.ts
    waste.ts
```

Each module:
- accepts plain domain data;
- returns plain typed results;
- has no Three.js;
- has no DOM;
- has no Supabase;
- has no Price Book hardcoded values.

This keeps complexity local.

---

## 8. Calculation result contract

Every specialist calculator returns a standard result instead of directly modifying the UI.

Conceptually:

```ts
type CalculationResult = {
  operationId: string
  quantity: {
    value: number
    unit: string
    ruleId: string
    ruleVersion: string
    sourceEntityIds: string[]
  }
  materials?: MaterialResult[]
  warnings?: CalculationWarning[]
  assumptions?: string[]
}
```

This result can be shown by:
- 2D Work calculator;
- 3D Work panel;
- Smart Offer builder;
- future PDF/export.

One calculation, multiple presentations.

---

## 9. Drywall is a specialist sub-system, not global app complexity

Drywall has legitimately complex logic:
- boards;
- cuts;
- seams;
- staggered layout;
- profiles;
- hangers;
- fasteners;
- insulation;
- waste;
- partitions;
- ceilings.

We should not make every project carry all drywall logic all the time.

Rule:

**load/use drywall calculator only when a drywall operation exists.**

The same pattern applies later to:
- tiles;
- plumbing;
- electrical;
- ceilings;
- decorative systems.

This is how the program remains light while supporting complex jobs.

---

## 10. Performance / weight rules

To prevent a heavy application:

1. **No duplicate renderers active unnecessarily.**  
   2D technical schema does not need to render while Client Preview is active.

2. **Lazy-load specialist modules.**  
   Drywall planner is loaded when drywall is used.

3. **Client Viewer excludes Work calculators.**  
   Client build receives no detailed material planners.

4. **Calculation modules are pure and small.**  
   They do not include 3D assets/UI.

5. **Heavy 3D assets load on demand.**

6. **No Firebase/legacy runtime imported just to reuse old logic.**

7. **One project store.**  
   Avoid synchronizing multiple hidden copies of room dimensions.

8. **No premature worker/microservice complexity.**  
   Normal m²/material arithmetic runs locally; introduce Web Workers/server processing only if real profiling proves a need.

---

## 11. Work Mode UX principle

Do not show all tools at once.

Suggested eventual Work workspace:

```
[ 3D ] [ Схема / m² ] [ Услуги ] [ Количества ] [ Оферта ]
```

Contextual behavior:
- editing room size in either approved dimension editor updates project geometry;
- opening/niche edits update the same domain project;
- 3D reflects the geometry;
- M² schema reflects the geometry;
- quantities recompute;
- offer updates only according to assigned services.

Advanced material planning appears only for the selected service.

This avoids a cockpit full of controls.

---

## 12. No double entry

A strict acceptance rule:

**The user must not enter L/W/H, openings or the same service target separately in the 2D calculator and 3D editor.**

One project input must feed both.

If a specialist tool needs extra information not present in geometry — e.g. board type, profile spacing, number of paint coats — that service-specific input lives on the service assignment, not on a separate duplicate room.

---

## 13. Legacy verification process

For every extracted formula:

1. capture a known legacy calculator input;
2. record the old output;
3. calculate manually;
4. implement pure TypeScript rule;
5. run automated fixture;
6. compare;
7. document rounding/assumptions;
8. approve or correct.

Only then mark the rule migrated.

For complex drywall layout:
- compare not only totals;
- compare board/cut layout where the legacy schema is considered useful;
- validate field practicality before production lock.

---

## 14. Current vertical slice impact

The current first slice should remain small.

It will **not** port both calculators now.

It will:
- establish stable room/surface IDs;
- establish geometry selectors;
- establish one quantity result contract;
- verify wall area against the M² calculator;
- prove 3D ↔ service ↔ quantity.

After that, the next migration task is a **Legacy Calculator Capability Registry**, feature by feature.

This prevents the first slice from exploding into a full rewrite.

---

## 15. Integration sequence

Recommended sequence:

### Stage 1 — Geometry contract
One room, surfaces, stable IDs, dimensions.

### Stage 2 — M² bridge
Port and test:
- wall areas;
- floor/ceiling;
- perimeter/volume;
- openings.

Rebuild a lightweight 2D technical schema from the new domain state.

### Stage 3 — Finishing quantity modules
Putty/paint/primer/material norms after audit.

### Stage 4 — Drywall specialist module
Boards/layout/profiles/fasteners/insulation, migrated in controlled pieces.

### Stage 5 — Other specialist calculators
Only when their service workflow enters the app.

At every stage, 3D and 2D remain consumers of the same domain state.

---

## 16. North Star for integration

We are not building:

**3D + calculator 1 + calculator 2 + room.html glued together.**

We are building:

**one project engine with several specialist tools around it.**

The existing calculators are valuable because they contain proven knowledge.

Their knowledge is migrated.

Their accidental technical coupling is not.
