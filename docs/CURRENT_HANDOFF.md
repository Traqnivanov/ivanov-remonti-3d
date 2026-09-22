# CURRENT HANDOFF — CHIEF WORK CONTROLLER — IVANOV REMONTI SMART OFFER

**Date:** 22.09.2026  
**Repo:** `Traqnivanov/ivanov-remonti-3d`  
**Source branch:** `feat/vertical-slice-v1`  
**Branch HEAD before this handoff update:** `51a50ad2e3fb8594d98d4a7118d17748f6dde01f`  
**Open PR:** #3 — `First Vertical Slice v1: Smart Offer core loop` — **DRAFT / DO NOT MERGE**  
**Static preview branch:** `preview-vertical-slice-v1`  
**Current preview build commit:** `dbfeaa72691bb366ad788f76d9da825455aa66a7`

This file is the handoff for the **next Chief Work Controller**.  
Do not restart the project, redesign the product from zero, or treat the current prototype as the final product.

---

## 1. YOUR ROLE — READ THIS FIRST

You are the new **Chief Work Controller** for Ivanov Remonti Smart Offer.

Authority order:

1. **Owner** — final product authority.
2. **Chief Work Controller** — architecture, sequencing, risk, QA, task sizing, technical decisions delegated by Owner.
3. Any execution/OBK chat — implementation only under a bounded task.

The Owner is not expected to decide tooling, code structure, CI, hosting mechanics, state architecture, package choices or implementation details.  
You must lead those correctly and explain only what materially affects the product or requires an Owner decision.

Do not ask the Owner to approve something he has not actually seen or understood.

Do not merge, publish to production, change product fundamentals, or silently widen scope without explicit Owner authority where required.

### Work rhythm

Mandatory rule: `PROJECT_RULES_00_READ_FIRST.md §27 Adaptive Work Sizing`.

Do **not** use a fixed “one tiny change → stop” rhythm.

Use:
- **micro-bundle** for several related low-risk fixes with one QA gate;
- **standard task** for one clear functional block;
- **split task** for risky/large/ambiguous work.

Checkpoint only when there is a meaningful, verifiable result, a risk boundary, a failed QA gate, or an Owner decision.

---

## 2. PRODUCT IDENTITY — WHAT WE ARE BUILDING

The product is:

# **Ivanov Remonti Smart Offer**

It is **not**:
- a generic room planner;
- a generic CAD;
- a decorative 3D toy;
- a construction animation;
- a PDF quote with a 3D picture attached.

It is an **interactive renovation offer built on a real editable model of the client object**.

North Star:

**обект ↔ услуга ↔ място в модела ↔ количество ↔ цена ↔ Info ↔ краен резултат**

The room/object explains the offer.

The offer explains the room/object.

The client should understand:
- what exactly will be done;
- where it will be done;
- how much is included;
- how the price relates to the scope;
- why the work is included;
- what result they receive.

The product promise is essentially:

**Understand first → then decide.**

A client must be able to click an offer line and see the exact relevant place in 3D.  
A client must be able to click a real wall/object and see the related offer line(s).

---

## 3. THE CORE PRODUCT LOOP — DO NOT BREAK IT

The foundational loop is:

**Project geometry → stable entity → service assignment → quantity rule → Price Book item → offer row → client Info/presentation**

Reverse navigation is equally important:

**3D entity → linked service assignment(s) → offer row**

This means:
- renderer/mesh identity is never business truth;
- visible/hidden state is never quantity truth;
- camera position is never quantity truth;
- presentation highlight is never scope truth;
- a service must point to stable entity IDs;
- quantity must be derived from domain geometry/rules;
- price must remain separate from renderer code.

---

## 4. PRODUCT EXPERIENCE — WORK VS CLIENT

There are two different capability profiles over the same canonical project truth.

### Work / Edit

For Ivanov Remonti.

May eventually:
- create/edit project;
- enter dimensions;
- add/move openings and objects;
- assign services to exact areas;
- select quantity rules;
- select Price Book items;
- manage materials;
- prepare client Info;
- preview client experience;
- publish a revision.

### Client / View

Interactive but **read-only**.

Client may:
- rotate/zoom/reset camera;
- use cutaway/visibility;
- select service;
- select model entity;
- open Info;
- inspect quantity/price/result.

Client must never:
- mutate dimensions;
- change service scope;
- change quantity formula;
- change price;
- edit Price Book;
- receive broad Work capabilities.

Important:
Client Mode is **not** “Work Mode with buttons hidden”.

The current slice already has application-level capability guards proving this boundary.

---

## 5. STATE SEPARATION — CRITICAL

Keep these conceptually distinct:

1. **Working Project State** — editable business/project truth.
2. **Published Offer Revision** — immutable client-visible snapshot, later.
3. **Viewer Session State** — temporary camera/selection/hidden walls/UI state.

Viewer Session State may change freely for the client.

It must never alter:
- geometry;
- scope;
- quantities;
- prices;
- published revision content.

Later client delivery uses **Published Revisions**, not the live mutable Work draft.

---

## 6. 3D STANDARD

True Three.js 3D is required.

Current and future standard includes:
- real room geometry;
- stable IDs;
- orbit;
- zoom;
- reset camera;
- manual Left / Right / Front / Back / Ceiling visibility;
- Show All;
- automatic cutaway;
- high/top camera hides ceiling when appropriate;
- hidden wall is visually hidden, not deleted;
- child geometry must not float when its host is hidden;
- service focus should be clear without turning the entire room into a crude solid color.

### Visual principle

The 3D viewer is a **main product hero**, not a leftover technical canvas.

The first loaded frame must:
- clearly show the room;
- be centered;
- use the available viewport well;
- avoid huge dead/empty areas;
- feel intentional and professional;
- make the 3D understandable before the user touches anything.

This is currently the **highest-priority visual defect**.

---

## 7. CURRENT OWNER VERDICT — THIS OVERRIDES ANY FALSE “READY” IMPRESSION

The first vertical slice is technically functioning, but **the Owner has NOT accepted the visual/product experience**.

On 22.09.2026 the Owner successfully opened the interactive Work preview and gave explicit feedback:

> the graphic/model is not centered;  
> as a first view it is slightly approaching the idea, but it is still very, very far away.

The screenshot showed:
- room/model pushed low/right;
- very large empty dark area;
- model too small/far on load;
- poor initial framing;
- weak first impression.

Therefore:

### DO NOT MERGE PR #3.

Technical acceptance is not product acceptance.

The next Chief Work Controller must treat the current state as:

**mechanism proven / first-view experience rejected and requiring correction.**

---

## 8. EXACT NEXT ADAPTIVE WORK BLOCK

Do **not** start openings, Supabase, Price Book production, more services, AI, materials library or another large subsystem.

First fix the Owner-visible 3D experience.

### Next block goal

**Viewer framing + centering + first impression**

Audit and correct as one coherent bounded block:

- why the room appears low/right in the available viewer;
- camera initial position;
- OrbitControls target;
- room visual center;
- camera distance/FOV;
- viewer sizing/resizing;
- how side panels affect perceived viewport center;
- reset-camera behavior;
- first-load framing;
- excessive unused dark space.

Expected result:
- room clearly centered in the 3D viewer;
- room occupies a useful proportion of the viewer;
- first view immediately reads as a room;
- reset returns to the same good showcase frame;
- Work and Client remain functionally identical where appropriate;
- no quantity/state/capability logic changes.

### Verification for this block

Before reporting completion:
1. strict TypeScript;
2. all tests;
3. production build;
4. browser smoke;
5. Work screenshot;
6. Client screenshot;
7. **actual visual inspection by Chief Work Controller**;
8. static interactive preview update;
9. Owner sees the result before any acceptance/merge discussion.

Do not say “visually fixed” because CI passed.  
You must inspect the produced visual.

---

## 9. CURRENT IMPLEMENTATION — WHAT ALREADY EXISTS

Stack:
- Vite;
- strict TypeScript;
- Three.js;
- Vitest.

Current slice contains:
- one rectangular room;
- floor / ceiling / 4 walls;
- stable surface IDs;
- orbit / zoom / reset;
- manual wall/ceiling visibility;
- auto cutaway;
- surface raycast selection;
- Work Mode;
- Client Preview;
- capability profile and mutation guards;
- first service: **Фина шпакловка**;
- selected target walls;
- service → 3D highlight;
- 3D wall → service-row emphasis;
- `Виж целия резултат`;
- geometry-based wall m²;
- DEV Price Book fixture;
- line total;
- client Info contract;
- compact M² technical schema;
- browser-level smoke testing;
- screenshot QA;
- committed dependency lockfile;
- `npm ci` CI install.

### Important code modules

`apps/work/src/domain.ts`
- ProjectState;
- stable entities;
- Fine Putty assignment;
- client Info.

`apps/work/src/geometry.ts`
- shared room geometry;
- wall/floor/ceiling areas;
- perimeter;
- volume.

`apps/work/src/calculation.ts`
- quantity provenance;
- DEV Price Book fixture;
- line total.

`apps/work/src/viewer.ts`
- Three.js scene;
- camera;
- OrbitControls;
- meshes;
- selection;
- visibility;
- highlight.

`apps/work/src/viewer-visibility.ts`
- pure auto-cutaway/visibility rules.

`apps/work/src/smart-offer-interaction.ts`
- Offer → Model / Model → Offer presentation state.

`apps/work/src/capabilities.ts`
- Work vs Client capability contract.

`apps/work/src/m2-schema.ts`
- compact 2D M² technical view from the same project geometry.

`apps/work/scripts/browser-smoke.mjs`
- real Chromium interaction;
- console/runtime error gate;
- Work/Client boundary checks;
- 3D interactions.

---

## 10. CURRENT TECHNICAL VERIFICATION

At feature branch HEAD `51a50ad2e3fb8594d98d4a7118d17748f6dde01f`:

- Vertical Slice push CI run `35777446971` = SUCCESS;
- PR CI run `35777451581` = SUCCESS;
- static preview publish run `35777447020` = SUCCESS;
- strict TypeScript = PASS;
- tests = PASS;
- production build = PASS;
- browser smoke = PASS.

The formal acceptance matrix is:
`docs/FIRST_VERTICAL_SLICE_ACCEPTANCE_AUDIT.md`

Its meaning is now:
**technical mechanism PASS / Owner visual approval NOT granted.**

---

## 11. CURRENT PR / GIT STATE

PR #3:
**First Vertical Slice v1: Smart Offer core loop**

State:
- OPEN;
- DRAFT;
- mergeable;
- do not merge.

Base:
`main` at `bd6077c0abcb66189cfa1d62c370bbf99409687c`

Feature branch:
`feat/vertical-slice-v1`

Static preview build:
`preview-vertical-slice-v1`

The preview branch is generated from the Vite build and is only a development-review surface.

It does not redefine production hosting.

---

## 12. PREVIEW / HOSTING CONTEXT

The Owner needed to see and use the product before approval.

Attempts:
- Vercel connector had no usable team/project context;
- GitHub Pages repository service was not enabled;
- StackBlitz failed for Owner because its WebContainers/browser compatibility path rejected the browser session.

Current working solution:
- workflow builds the Vite application;
- publishes built files to `preview-vertical-slice-v1`;
- Owner successfully opened the static build through a CDN/raw GitHub delivery URL.

This is **temporary development preview infrastructure only**.

Do not distort product architecture around it.

Production direction remains:
- GitHub = source/version control;
- Cloudflare = future delivery/security;
- Supabase Postgres/Auth/Storage = future backend/persistence;
- protected server-side publishing/access/pricing later.

No Firebase.  
No Cloudflare D1 as primary database.

---

## 13. M² CALCULATOR — EXACT OWNER DECISION

Legacy repo:
`Traqnivanov/ivanov-tools`

Current integration source is **ONLY**:

**Калкулатор М² → `kalkulator-combined.html`**

Do not integrate:
- `calculator.html`;
- `room.html`.

Legacy tool is reference/knowledge, not runtime dependency.

Strict integration principle:

**one shared project/domain geometry → 3D + M² technical view + quantities/materials + Smart Offer**

Never:
- iframe the old calculator;
- depend on legacy DOM;
- depend on legacy localStorage/Firebase;
- maintain a second hidden room state;
- ask user to enter L/W/H twice.

For migrated formulas:
legacy result → manual calculation → pure TS implementation → automated test.

---

## 14. FUTURE PRODUCT SCOPE — KNOW THE DESTINATION, DO NOT BUILD IT ALL NOW

The Master vision includes, over time:

### Geometry / editing
- multiple rooms;
- irregular rooms later;
- doors/windows;
- openings with position/size/sill;
- furniture;
- radiator;
- lights;
- switches/outlets;
- sanitary objects;
- snapping;
- move/rotate/duplicate/lock;
- undo/redo.

### Services
Ivanov Remonti work includes:
- putty/plaster/fine finish;
- painting;
- drywall;
- insulation/mineral wool;
- plumbing;
- window/door reveals;
- decorative plaster;
- bathrooms/tiles;
- hidden LED;
- demolition;
- masonry/partitions;
- cornices/details;
- electrical work;
- full turnkey renovations.

Different service types require different visual semantics:
- surface → highlight/material/result;
- construction → real 3D geometry;
- hidden system → x-ray/cutaway;
- object → selectable object;
- low-visible preparation → highlighted zone + quantity + Info.

Do not force every service into the same visual effect.

### Materials / library
Later:
- uploaded material/photo textures;
- scale/repeat/rotation;
- own library;
- paint/laminate/tile/plaster/door/light/furniture/sanitary categories.

### Client delivery
Later:
- publish immutable revision;
- client-safe minimized payload;
- link or link + PIN;
- opaque token;
- no public directory;
- revocation/regeneration;
- no full Price Book/formula engine/private notes in client payload.

---

## 15. PRICE / QUANTITY RULES

Current price is deliberately a DEV fixture:
**1 EUR/m²** for Fine Putty.

It is not a business price and must not be mistaken for one.

Client preview labels it as test price.

Production rule:
- quantity from geometry + approved rule;
- Price Book separately versioned/protected;
- published revision snapshots quantity/unit price/line total;
- later Price Book changes must not rewrite what an old client revision showed.

Currency: **EUR**.

---

## 16. CURRENT FIRST-SLICE SCOPE BOUNDARIES

Not yet implemented by design:
- door/window openings;
- deductions;
- niches/projections;
- full M² calculator migration;
- advanced drywall calculations;
- production Price Book;
- Supabase persistence/auth;
- Published Revisions;
- protected standalone Client Viewer;
- Link/PIN;
- production Cloudflare delivery;
- PDF/signature/acceptance;
- furniture/material library;
- AI photo/model generation.

Do not mark these as bugs in the current slice.

But also do not forget the Master destination.

---

## 17. CURRENT KNOWN NON-BLOCKING TECHNICAL NOTE

Vite reports a JS chunk around ~518 KB minified, slightly above its 500 KB warning threshold.

Do not derail the current visual-first-view correction for this.

Optimize when measured/appropriate, especially before broader client distribution.

---

## 18. VISUAL QUALITY STANDARD

The Owner is strict about visible quality.

Rules:
- do not send an uninspected UI result to Owner;
- do not rely on “tests pass” as visual acceptance;
- inspect actual screenshot/render;
- if text is too small, clipped, overlapping, off-center or visually weak, fix it before presenting;
- functional correctness is necessary, not sufficient;
- prototype may be visually early, but obvious composition defects are not acceptable.

Current owner feedback proves this point.

The first screen must eventually feel:
- clear;
- intentional;
- professional;
- modern;
- easy to understand;
- visually centered;
- not overloaded;
- not empty/unfinished.

---

## 19. PRODUCT DECISION RULE

If a genuine product ambiguity exists:
- do not silently choose;
- frame the options and impact;
- ask Owner only for the decision that truly requires product authority.

If it is a normal technical implementation choice:
- Chief Work Controller decides;
- do not push routine engineering decisions onto Owner.

If a task becomes much larger/riskier than expected:
- split before losing control.

If several tiny fixes are clearly related:
- bundle them.

---

## 20. GIT / QA RULE

Work on the existing branch unless a deliberate branch transition is required.

Before merge:
- full diff review;
- CI green;
- UI/3D screenshot inspection;
- Owner has actually seen the relevant product state;
- explicit Owner merge approval.

Never infer merge approval from:
- “ok” to continue work;
- technical PASS;
- successful CI;
- screenshot approval for an unrelated subpart.

PR #3 currently has **no merge approval**.

---

## 21. MANDATORY READING ORDER FOR THE NEW CHIEF WORK CONTROLLER

Read exactly in this order before making meaningful changes:

1. `PROJECT_RULES_00_READ_FIRST.md`
2. `docs/MASTER_SPEC.md`
3. `docs/PRODUCT_VISION_STANDARD.md`
4. `docs/SMART_OFFER_PRODUCT_CONTRACT.md`
5. `docs/3D_VIEWER_STANDARD.md`
6. `docs/WORK_CLIENT_MODE_CONTRACT.md`
7. `docs/CLIENT_DELIVERY_SECURITY_CONTRACT.md`
8. `docs/INFRASTRUCTURE_DATA_ARCHITECTURE.md`
9. `docs/DATA_MODEL_V1.md`
10. `docs/DECISION_LOG.md`
11. `docs/SERVICE_OPERATION_REGISTRY.md`
12. `docs/BENCHMARK_RESEARCH.md`
13. `docs/TOOLS_REUSE_AUDIT.md`
14. `docs/LEGACY_CALCULATOR_INTEGRATION_ARCHITECTURE.md`
15. `docs/DELIVERY_STRATEGY.md`
16. `docs/FIRST_VERTICAL_SLICE_V1.md`
17. `docs/FIRST_VERTICAL_SLICE_ACCEPTANCE_AUDIT.md`
18. **this file last**

Then inspect the current code and current live preview.

Do not trust an older chat summary over current repository truth + latest explicit Owner feedback.

---

## 22. FIRST MESSAGE / BEHAVIOR OF THE NEW CHIEF WORK CONTROLLER

The new controller should NOT begin by asking the Owner to re-explain the project.

It should:
- confirm repo/branch/PR HEAD;
- read the mandatory docs;
- verify current CI;
- inspect the actual current Work and Client preview;
- acknowledge the Owner's visual rejection;
- perform the bounded viewer framing/centering audit;
- present a concrete correction plan if any product choice is needed;
- otherwise implement the technical framing correction;
- run QA;
- visually inspect;
- update static preview;
- only then ask Owner to look at the improved first view.

---

## 23. FINAL HANDOFF SENTENCE

**Continue the same product. Preserve the proven core. Do not merge. Fix the rejected first-view 3D composition next: center and frame the room properly, reduce dead space, make reset/initial camera intentional, verify visually, publish the preview, and let the Owner see it before any approval discussion.**
