# IVANOV TOOLS REUSE AUDIT v1

**Scope:** read-only analysis of `Traqnivanov/ivanov-tools`.  
**Safety:** no files in `ivanov-tools` were modified.

> **Current Owner-corrected scope:** only `kalkulator-combined.html` (“Калкулатор M²”) is selected for current Smart Offer integration/reference. `calculator.html` and `room.html` remain out of scope unless a later explicit Owner decision changes this. See §15.

## 1. Decision

Existing Ivanov Remonti tools are valuable as a **verified knowledge source for formulas and workflows**, but the 3D Visualizer must NOT depend on their HTML pages at runtime.

We will:

1. audit each useful formula;
2. compare it with real working practice and current service rules;
3. extract the approved logic into new pure calculation modules inside `ivanov-remonti-3d`;
4. add tests with known examples;
5. keep prices in the new versioned Price Book, not inside formulas.

This prevents the new program from breaking when an old tool changes and prevents old tools from being touched by the 3D project.

## 2. Current calculation source

### `kalkulator-combined.html` — ONLY ACTIVE CALCULATOR SOURCE

For Smart Offer calculation / M² / material-estimation migration, this is the **only currently approved legacy calculator source**.

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

### Historical audit only — NOT active sources

`calculator.html` and `room.html` were inspected historically, but by explicit Owner correction they are **NOT used as calculation/formula sources for Smart Offer**.

Rules:
- do not extract formulas from them;
- do not use them to resolve calculation ambiguity;
- do not copy their service taxonomy;
- do not integrate or embed them;
- do not treat them as fallback if `kalkulator-combined.html` lacks something.

If a future need appears that only one of those files seems to solve, STOP and ask Owner before using it.

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
source: audited kalkulator-combined.html + field validation
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


## 12. Historical inconsistency found during the original broad audit

> **Historical evidence only — not an active calculation source.** The files below were inspected before the Owner narrowed current calculation reuse to **Калкулатор M² / `kalkulator-combined.html` only**. This section is retained solely to explain why the Smart Offer taxonomy separates plaster from putty; do not use these files for formulas or current implementation decisions.

The original broad audit found:

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


## 14. Схеми и чертане от m² калкулатора

Owner изрично потвърди, че полезните функции на съществуващия m² калкулатор не трябва да се губят.

Одитът на `kalkulator-combined.html` показва, че освен формули той вече има полезна работна логика за:

- SVG схема на правоъгълно помещение;
- показване на С1 / С2 / С3 / С4 и m² по стена;
- размерни линии;
- таван / под / обем / обиколка;
- прозорци и врати като отвори;
- автоматично изваждане на площ на отвори;
- ниши / издатини с плюс/минус корекция;
- ръчно net m² override;
- избор на конкретни стени;
- гипсокартонена схема по стена;
- разпределение на листи;
- парчета / остатъци / резерв;
- количества за боя, шпакловка, лепило, бетон/замазка и ГК материали.

**Historical audit note — NOT an active source:** `calculator.html` and `room.html` were also inspected earlier, but their capabilities are excluded from the current calculation/reuse source set by the later Owner correction in §15. Do not port formulas, service logic or fallback behavior from them unless Owner explicitly reopens that scope.

### Integration rule

Тези функции не се копират като един стар HTML файл и не стават runtime dependency.

Разделяме ги на три категории:

#### A. Domain / calculation logic
Пренасяме след audit + tests:
- room/wall areas;
- openings;
- niches/additions;
- perimeter/volume;
- material quantity formulas;
- drywall sheet/profile rules;
- manual override contract.

#### B. Work technical visualization
Може да се пренесе като нов TypeScript/SVG/Canvas/3D helper:
- 2D room schema;
- m² per wall;
- dimension annotations;
- drywall board layout;
- material/layout diagrams.

Това е **Work Mode помощник**, не заместител на истинския 3D модел.

#### C. Client presentation
Към клиента показваме само това, което помага да разбере офертата.
Не излагаме вътрешни технически схеми/материални heuristics по подразбиране.

### Important design principle

Новият продукт не трябва да избира между „стария калкулатор“ и „новия 3D“.

Правилният модел е:

**една geometry truth → 3D + 2D technical schema + quantities + materials + offer**

Тоест размерите се въвеждат веднъж, а:
- 3D стаята;
- 2D схемата;
- m²;
- количествата;
- Smart Offer

четат от едни и същи domain данни.

Това премахва двойното въвеждане и е по-силно от директно вграждане на стария калкулатор.


## 15. Owner correction — current integration source is only Калкулатор М²

The earlier broad audit inspected several Ivanov Tools pages, but the **current implementation scope is narrower**.

For the Smart Offer integration, the only legacy calculator currently selected is:

**Калкулатор М² → `kalkulator-combined.html`**

The Ivanov Tools home page confirms that the visible **„Калкулатор М²“** card opens `kalkulator-combined.html`.

Current rule:
- use `kalkulator-combined.html` as the M² logic/workflow source;
- do not integrate `calculator.html`;
- do not integrate `room.html`;
- keep those files untouched unless a later explicit Owner decision expands scope.

Any earlier wording suggesting that both calculators are planned for integration is superseded by this correction.


## 16. Non-calculation Ivanov Tools capability map

This section is a **capability/reuse audit**, not authorization to integrate every old tool.

Important boundary:
- for **calculation / M² / material formulas**, the only active legacy source remains `kalkulator-combined.html`;
- the tools below may still contain useful **workflow, document, client-management or communication patterns**, but they do not become calculation sources;
- old Firebase/localStorage architecture is not reused as Smart Offer runtime architecture;
- Smart Offer keeps Supabase as canonical application truth and EUR-only pricing.

### `offer.html` — STRONG FUTURE REUSE / workflow reference

Observed capabilities:
- client/offer metadata;
- service picker and quote positions;
- per-line quantity/price/total;
- grand total;
- offer history;
- PDF/print generation;
- settings/services management;
- links/actions toward Contract and Advances.

Useful for Smart Offer:
- quote/document field structure;
- final offer totals and grouping;
- offer history/revision UX ideas;
- PDF snapshot/export structure;
- transition from accepted offer toward contract/payment workflow.

Do **not** copy directly:
- Firebase/localStorage persistence;
- BGN display/conversion remnants;
- manual pricing assumptions that conflict with the new versioned Price Book;
- old calculator/room navigation dependencies.

Recommended timing:
- audit/reference **now** so the new Smart Offer does not rebuild incompatible quote concepts;
- implementation/reuse after the complete-room quote core and Price Book rules are sufficiently stable;
- PDF/export belongs later than the interactive Smart Offer core, not at the beginning.

### `clients.html` — FUTURE CLIENT / PROJECT LINK

Observed capabilities:
- client list;
- search;
- create/edit/delete client;
- status/tool links;
- Firebase-backed client records.

Useful for Smart Offer:
- client identity and project-to-client association;
- avoiding duplicate client entry across offer/contract/payment workflows.

Recommended timing:
- not required for the next room-geometry/service slice;
- should be considered before full client delivery / contract / payment workflow is connected.

Do not copy Firebase persistence; Smart Offer client/project identity must use the approved Supabase architecture.

### `contract.html` — POST-OFFER WORKFLOW REFERENCE

Observed capabilities:
- construction contract generation;
- parties;
- object and term;
- included activities;
- free/additional services;
- payment schedule;
- guarantee/obligations;
- saved contract history / print.

Useful for Smart Offer:
- future transition **accepted Smart Offer → contract**;
- carrying accepted scope and totals without retyping.

Recommended timing:
- after quote scope/Price Book/client identity are stable;
- not part of current complete-room 3D slice.

### `avansov-otchet.html` — POST-CONTRACT FINANCE REFERENCE

Observed capabilities:
- clients;
- total service value;
- advance payments;
- remaining balance;
- status/notes;
- PDF;
- Firebase-backed records.

Useful for Smart Offer ecosystem:
- future **contracted job → advances / remaining payments** workflow.

Recommended timing:
- later operational phase after accepted offer/contract;
- not part of the current Smart Offer room core.

### `profiles.html` — POTENTIALLY USEFUL, CURRENTLY NOT AN APPROVED SOURCE

Observed capabilities:
- UD/CD profile calculations and positions;
- cutting plans;
- ceiling/wall SVG schemes;
- reads `ir_profiles_data` and links back to the old `calculator.html` flow.

Because it is coupled to the currently excluded `calculator.html` workflow:
- do **not** use its formulas or integrate it under the current rules;
- if its profile/cutting-plan capability becomes valuable for the drywall module, perform a separate audit and ask Owner before reuse.

### `naruchnik.html` / `naruchnik-ai.html` — INTERNAL CLIENT-COMMUNICATION TOOL, NOT SERVICE-INFO AUTHORITY

Observed capabilities:
- client-conversation/psychology guidance;
- notes/history/outcomes;
- client context;
- AI assistant behavior;
- old Firebase + direct Anthropic browser-key architecture.

Potential future value:
- internal Work-side communication support;
- sales/client-conversation guidance;
- learning from outcomes.

It is **not** the factual source for Smart Offer service ⓘ Info.
Service Info authority remains the real service pages + `Remonti-/narachnik/` service guides.

Do not reuse the old direct-browser API-key/Firebase architecture.

### `services.js` — LEGACY PRICE/SERVICE DATA, NOT CANONICAL

May be useful only as historical evidence/comparison.
Do not use it as:
- service truth;
- Price Book truth;
- current currency logic.

Current service truth comes from `Traqnivanov/Remonti-` + Service Operation Registry.
Current prices come from the versioned Price Book and are EUR-only.

### `receipts.html`

The current file does not provide a usable implemented capability in this audit.
Do not depend on it for Smart Offer planning.

### Other repo infrastructure

`auth-guard.js`, service worker, analytics and Cloudflare/Firebase plumbing are part of the old Office ecosystem.
They are not automatically reusable architecture for Smart Offer.
The approved Smart Offer Auth/data/security architecture remains authoritative.

### Recommended sequencing principle

Do not wait until the end to look at Ivanov Tools.

Use the repo as a **pre-implementation dependency check** whenever Smart Offer reaches a matching capability:

1. **room geometry / M² / material quantities** → only `kalkulator-combined.html`;
2. **service meaning / client Info** → `Remonti-` service pages + real service guides;
3. **quote totals/history/PDF concepts** → audit `offer.html` before implementing that block;
4. **client identity** → audit `clients.html` before implementing client/project linking;
5. **contract generation** → audit `contract.html` before implementing accepted-offer → contract;
6. **advances/payments** → audit `avansov-otchet.html` before implementing post-contract finance;
7. **drywall profile/cutting plan** → `profiles.html` only after separate Owner approval because of its excluded-calculator coupling;
8. **client-conversation assistant** → `naruchnik*.html` only if/when an internal communication-support module is intentionally added.

Principle:

**Do not port Ivanov Tools wholesale. Before building a Smart Offer capability from zero, first check whether an existing Ivanov tool already contains useful proven workflow knowledge — then migrate only the approved logic into the new architecture.**
