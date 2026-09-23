# M² CALCULATOR INTEGRATION ARCHITECTURE v2

**Status:** CURRENT OWNER-CORRECTED DIRECTION  
**Source tool:** `Traqnivanov/ivanov-tools/kalkulator-combined.html`  
**Visible tool name in Ivanov Tools:** **Калкулатор М²**  
**Safety:** `Traqnivanov/ivanov-tools` remains read-only.

---

## 1. Exact scope

Only the existing **Калкулатор М²** is planned for integration/reuse at this stage.

In the Ivanov Tools home screen, the card:

**Калкулатор М²**

opens:

`kalkulator-combined.html`

This is the legacy tool we audit and reuse.

### Explicitly out of current integration scope

- `calculator.html` — not planned for integration now;
- `room.html` — not planned for integration now.

They remain untouched legacy tools/references and do not become dependencies of the new Smart Offer app.

If later a unique capability from them is needed, it requires a separate audit and Owner decision.

---

## 2. Why M² is useful

The M² calculator already contains substantial working logic, including:

- room L / W / H;
- S1 / S2 / S3 / S4 wall areas;
- floor / ceiling;
- perimeter / volume;
- SVG technical room drawing;
- dimension lines;
- windows / doors and opening deductions;
- niches / projections;
- manual net-m² override;
- paint / putty / adhesive quantity logic;
- drywall wall selection;
- drywall sheet calculations;
- drywall sheet layout/schema;
- reserve/waste logic;
- ceiling / wall / partition drywall calculations;
- material-related calculations already implemented in this tool.

This knowledge should not be thrown away or rewritten blindly.

---

## 3. Integration principle

We do **not** embed the old M² HTML page inside the new application.

We do **not** make the new 3D depend on the old DOM/localStorage.

Instead we migrate useful logic behind one shared project model:

```
                Shared Project / Geometry State
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
          3D Work View        M² Technical View
              │                     │
              └──────────┬──────────┘
                         ▼
              Quantity / Material Logic
                         │
                         ▼
                     Smart Offer
```

---

## 4. 2D M² drawing stays 2D

The M² calculator's technical drawing is useful because it is a fast technical scheme.

It does not need to become 3D.

The new 3D viewer has a different purpose:
- spatial editing;
- object placement;
- realistic room understanding;
- client interaction;
- final result.

The future Work App may therefore have separate views:

**3D | M² / Схема | Услуги | Количества | Оферта**

But all of them read the same project data.

---

## 5. No double entry

Strict rule:

**Room dimensions, openings and geometry are entered once.**

The same data feeds:
- 3D;
- M² technical schema;
- quantities;
- material calculations;
- Smart Offer.

We must not maintain one room in 3D and another hidden room inside M².

---

## 6. What is migrated from M²

Every M² capability receives one of three statuses:

### EXTRACT AS PURE LOGIC
Examples:
- wall/floor/ceiling areas;
- opening deductions;
- perimeter/volume;
- niche adjustment;
- material quantity formulas;
- drywall quantity/layout formulas after validation.

### REBUILD AS WORK VIEW
Examples:
- SVG room schema;
- S1–S4 labels;
- dimension lines;
- drywall board layout diagrams.

These may be recreated in TypeScript/SVG/Canvas using the new shared state.

### DEFER
Anything not needed yet stays in the existing M² calculator until its turn comes.

We do not migrate the entire tool in one pass.

---

## 7. Complexity rule

The M² integration must not make the whole application heavy.

Therefore:
- calculation code stays separate from Three.js;
- technical M² view is not active when not needed;
- advanced drywall logic is loaded/used only when relevant;
- Client Viewer does not receive the M² Work tooling;
- no Firebase or old localStorage dependency is imported;
- no second canonical project state is created.

---

## 8. Verification rule

For every migrated M² formula:

1. use a known M² calculator input;
2. record the current M² output;
3. calculate manually;
4. implement a pure TypeScript rule;
5. add an automated test;
6. compare results;
7. document rounding/assumptions;
8. approve or correct.

No legacy formula is treated as automatically correct merely because it exists.

---

## 9. Current first slice

The first vertical slice remains intentionally small.

It uses the M² calculator only as a verification source for:
- rectangular room dimensions;
- individual wall area;
- total wall area.

It does not port the full M² calculator yet.

After the core 3D ↔ service ↔ quantity mechanism works, M² capabilities can be migrated in controlled stages.

---

## 10. North Star

We are not building:

**3D + an embedded M² calculator.**

We are building:

**one project engine that can present the same room as 3D, as an M² technical scheme, and as a Smart Offer.**

The existing M² calculator supplies valuable proven logic and workflow ideas.

Its useful knowledge is reused.

Its old technical coupling is not.
