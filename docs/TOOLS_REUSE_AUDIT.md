# IVANOV TOOLS REUSE AUDIT v1

**Scope:** read-only analysis of `Traqnivanov/ivanov-tools`.  
**Safety:** no files in `ivanov-tools` were modified.

## 1. Decision

Existing Ivanov Remonti tools are valuable as a **verified knowledge source for formulas and workflows**, but the 3D Visualizer must NOT depend on their HTML pages at runtime.

We will:

1. audit each useful formula;
2. compare it with real working practice and current service rules;
3. extract the approved logic into new pure calculation modules inside `ivanov-remonti-3d`;
4. add tests with known examples;
5. keep prices in the new versioned Price Book, not inside formulas.

This prevents the new program from breaking when an old tool changes and prevents old tools from being touched by the 3D project.

## 2. Useful source tools

### `kalkulator-combined.html`

Useful logic already present:

- gross wall area: `2 × (L + W) × H`;
- deduction of door/window openings;
- net wall area;
- ceiling/floor area: `L × W`;
- room volume;
- paint quantity by m² × consumption × coats;
- fine skim/putty quantity by m² × kg/m²/layer × layers;
- tile adhesive quantity;
- screed / concrete / self-leveling material estimates by area and thickness;
- plasterboard sheet layout helpers;
- manual override of calculated net m².

### `calculator.html`

Useful logic already present:

- ceilings, wall linings and partition areas;
- plasterboard quantity with waste factor;
- UD/CD and UW/CW profile estimates;
- hangers;
- screws;
- dowels;
- tape;
- jointing compound;
- finishing compound;
- insulation;
- adhesive and foam;
- putty service stacks by surface;
- material packaging rounding;
- manual quantity overrides.

### `room.html`

Useful architectural idea already present:

- surface-based room model;
- each surface can have construction/finishing services;
- partition walls are double-sided;
- operation quantity × unit labor price;
- material calculation derived from selected surface work;
- project save/open;
- quote/PDF workflow.

## 3. What we will reuse

We reuse **principles and approved formulas**, not page code.

Target modules in the new application:

```
src/domain/geometry/
  roomAreas.ts
  openings.ts
  surfaces.ts

src/domain/quantities/
  paint.ts
  putty.ts
  plaster.ts
  drywall.ts
  tile.ts
  screed.ts
  insulation.ts

src/domain/pricing/
  priceBook.ts
  operationCost.ts
  quoteTotals.ts
```

Each module must be usable without Three.js, DOM, UI, Firebase or browser storage.

## 4. What must NOT be copied blindly

### A. Prices

The old tools contain embedded labor/material prices and some values differ from the current public site.

Therefore:

- formulas and prices are separated;
- all prices in the new product come from Price Book;
- every price has a version/effective date;
- an old project stores the prices used at quote time;
- changing today's price must not silently change an accepted historical quote.

### B. Consumption norms

Values such as kg/m², liters/m², screws/m² and waste percentages are estimates.

Before a norm is LOCKED it needs:

- product/material context;
- real working validation;
- Owner approval;
- editable override.

The program may provide a default but must show when it is an estimate.

### C. Construction rules

Some old calculations are practical heuristics, not structural design.

They can estimate materials for known Ivanov Remonti workflows, but the program must not present them as engineering certification.

## 5. Geometry calculation contract

The new app must derive quantities from exact geometry.

### Room

For a rectangular room:

- floor = `L × W`
- ceiling = `L × W`
- gross walls = `2 × (L + W) × H`

For an individual wall:

- wall area = `wall length × wall height`

### Openings

For finishing operations:

`net surface = surface area - applicable openings`

But deduction is operation-specific.

Example:
- paint/skim coat may deduct a large door/window opening;
- window reveals/returns generate their own linear/surface quantity;
- drywall framing around an opening has different material logic.

So we do NOT use one global „net m²“ rule for every operation.

## 6. Surface ownership

Every wall, floor, ceiling and opening has a stable ID.

Operations attach to IDs such as:

```
room-1.wall-north
room-1.ceiling
room-1.floor
room-1.window-2.reveal
```

This allows the 3D view, m² calculation and quote to use the same source.

## 7. Formula provenance

Every production formula should carry metadata:

- formula ID;
- version;
- source/reference;
- assumptions;
- unit;
- default waste;
- editable inputs;
- validation status.

Example:

```
drywall.board.area.v1
source: audited calculator.html + field validation
unit: m²
defaultWaste: 10%
status: approved
```

## 8. Visualizer integration

The 3D scene never calculates prices by itself.

Correct flow:

`3D geometry → domain geometry → operation quantity → material quantity → Price Book → quote`

The renderer only visualizes the result.

## 9. Practical benefit

This lets the user model a wall once and automatically receive:

- real m²;
- deducted openings where applicable;
- skim coat m²;
- primer m²;
- paint m²;
- paint liters;
- drywall boards/profiles where applicable;
- linear meters for reveals/LED/cornices;
- labor price;
- materials;
- total for that wall;
- total for the room;
- total for the project.

## 10. Migration rule

No direct import from the old tools is considered production-ready until:

- formula is isolated;
- assumptions are documented;
- test cases exist;
- values are checked against a manual calculation;
- Owner/Work Controller accepts it.

## 11. Immediate candidate for first calculation-core prototype

The safest first vertical slice is:

**one rectangular room + one door + one window**

and calculate:

- floor/ceiling;
- gross walls;
- opening areas;
- net paint/skim surfaces;
- window/door reveal linear meters;
- operation totals;
- final EUR total.

Then compare the result manually and with the existing m² calculator.

Only after this passes do we connect the same data to 3D.


## 12. Important inconsistency found during audit

The existing tools themselves prove why we must audit before reuse.

In `calculator.html`:

- service key `osnovna` is labelled **„Основна мазилка“**;
- material `p_osnovna` is also **„Основна мазилка 30кг“**.

In `room.html`:

- the same service key `osnovna` is labelled **„Основна укрепваща шпакловка“**;
- the material is still **„Основна мазилка“**.

Therefore one key currently mixes two concepts in different tools.

**New-app rule:** this ambiguity is not copied. The new registry separates ordinary plaster from putty/skim-coat operations and gives each its own operation ID, formula and Price Book entry.

## 13. How the m² calculator will help the 3D program

The calculator becomes a verification/reference layer for the new Geometry → Quantity engine.

Example:

A room in the 3D model has:
- L = 5.00 m
- W = 4.00 m
- H = 2.70 m
- one door;
- one window.

The visualizer geometry calculates the exact wall surfaces and openings. The calculation core then produces the same type of outputs already proven useful in Ivanov Tools:

- gross wall m²;
- net wall m²;
- ceiling/floor m²;
- m² per individual wall;
- paint liters by coats;
- putty kg/buckets by selected layer;
- drywall boards/profiles/fasteners;
- tile adhesive;
- screed quantities.

During migration we compare the new pure-function result against:
1. manual calculation;
2. current Ivanov Tools result;
3. a known test fixture.

Only when all three agree within the accepted rounding rule is the formula marked approved.
