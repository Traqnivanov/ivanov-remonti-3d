# CURRENT HANDOFF — CHIEF WORK CONTROLLER — IVANOV REMONTI SMART OFFER

**Date:** 22.09.2026  
**Repo:** `Traqnivanov/ivanov-remonti-3d`  
**Source branch:** `feat/vertical-slice-v1`  
**Latest implementation checkpoint before this documentation sync:** `be36a7b3c198175ab592e19e222b097196bebe8b`  
**Open PR:** #3 — `First Vertical Slice v1: Smart Offer core loop` — **DRAFT / DO NOT MERGE WITHOUT EXPLICIT OWNER APPROVAL**  
**Static preview branch:** `preview-vertical-slice-v1`  
**Latest verified preview build before this documentation sync:** `fd5425ac5675e0aaedb480f1d9f3428eaf0a396d`

This file is the active handoff for the next Chief Work Controller.

Do not restart the project.  
Do not invent a new product.  
Do not jump to a new subsystem because the current prototype looks unfinished.  
Verify the current branch HEAD first, because documentation-only commits may exist after the implementation checkpoint above.

---

## 1. ROLE AND AUTHORITY

Authority order:

1. **Owner** — final product authority.
2. **Chief Work Controller** — architecture, sequencing, risk, QA, technical decisions delegated by Owner, and task sizing.
3. **OBK / execution chat** — implementation only inside a bounded task.

The Owner should not be asked to decide routine engineering details.  
The Work Controller must not silently decide ambiguous product behavior.

Core rule:

**NO ASSUMPTION → NO IMPLEMENTATION**

For product ambiguity:
**audit → problem/goal → options → recommendation → risk → Owner decision → implementation**

For routine technical work inside an approved direction, the Work Controller decides and verifies.

---

## 2. MANDATORY READING ORDER

Follow `PROJECT_RULES_00_READ_FIRST.md §3` exactly before meaningful work:

1. `PROJECT_RULES_00_READ_FIRST.md`
2. `docs/MASTER_SPEC.md`
3. `docs/SMART_OFFER_PRODUCT_CONTRACT.md`
4. `docs/3D_VIEWER_STANDARD.md`
5. `docs/WORK_CLIENT_MODE_CONTRACT.md`
6. `docs/CLIENT_DELIVERY_SECURITY_CONTRACT.md`
7. `docs/INFRASTRUCTURE_DATA_ARCHITECTURE.md`
8. `docs/DATA_MODEL_V1.md`
9. `docs/DECISION_LOG.md`
10. `docs/PRODUCT_VISION_STANDARD.md`
11. `docs/SERVICE_OPERATION_REGISTRY.md`
12. `docs/BENCHMARK_RESEARCH.md`
13. `docs/TOOLS_REUSE_AUDIT.md`
14. `docs/LEGACY_CALCULATOR_INTEGRATION_ARCHITECTURE.md`
15. `docs/DELIVERY_STRATEGY.md`
16. `docs/FIRST_VERTICAL_SLICE_V1.md` while this slice is active
17. this handoff last

Repository truth + latest explicit Owner decision beats an older chat summary.

---

## 3. PRODUCT IDENTITY

The product is **Ivanov Remonti Smart Offer**.

It is NOT:
- a generic room planner;
- a generic CAD;
- a decorative 3D toy;
- a construction-process animation;
- a PDF quote with a 3D image attached.

North Star:

**обект ↔ услуга ↔ място в модела ↔ количество ↔ цена ↔ Info ↔ краен резултат**

The room explains the offer.  
The offer explains the room.

The client must be able to understand:
- what will be done;
- where;
- why;
- how much;
- at what price;
- what result is proposed.

Offer → Model and Model → Offer are both fundamental.

---

## 4. NON-NEGOTIABLE ARCHITECTURE

Preserve:

- one canonical project/domain truth;
- stable entity IDs;
- renderer is NOT quantity/price truth;
- camera/visibility/highlight are NOT scope truth;
- quantity derives from domain geometry + approved rule;
- price comes from a separate Price Book layer;
- Work Mode and Client Mode are separate capability profiles;
- Client Mode is interactive but read-only;
- Viewer Session State never mutates Project State, quantity or price;
- future client delivery uses **Published Revisions**, not the live mutable Work draft;
- Client Viewer receives a minimized published payload, not the Work App.

Current approved infrastructure direction:
- GitHub — source/version control;
- Cloudflare — delivery/security;
- Supabase Postgres/Auth/Storage + protected server operations;
- no Firebase;
- no Cloudflare D1 as primary application DB.

Repo remains public during development by Owner decision; Production Protection Gate comes later.

---

## 5. ADAPTIVE WORK SIZING — HOW TO WORK

Mandatory: `PROJECT_RULES_00_READ_FIRST.md §27 Adaptive Work Sizing`.

Do NOT use a mechanical “one tiny change and stop” rhythm.

Use:
- **micro-bundle** — several closely related low-risk corrections, one QA gate;
- **standard task** — one clear functional block;
- **split task** — risky, broad, ambiguous or multi-system work.

Stop/checkpoint when:
- there is a meaningful verifiable result;
- a risk boundary is reached;
- QA fails;
- an Owner product decision is required.

Do not expand scope while fixing one bounded problem.

---

## 6. FIRST VERTICAL SLICE — WHAT IS PROVEN

The current slice proves the core loop with one rectangular room and one service: **Фина шпакловка**.

Implemented:
- true Three.js room;
- floor / ceiling / four walls;
- stable surface IDs;
- orbit / zoom / reset;
- manual wall/ceiling visibility;
- automatic cutaway;
- surface raycast selection;
- Work Mode;
- Preview as Client;
- capability guards;
- Fine Putty assignment to exact walls;
- Offer → Model highlight;
- Model → Offer emphasis;
- `Виж целия резултат`;
- geometry-derived wall m²;
- DEV Price Book abstraction;
- line total;
- client Info;
- compact M² technical schema from the same geometry;
- browser smoke;
- visual QA;
- dependency lockfile and `npm ci`.

The first slice is a **foundation proof**, not a finished product.

---

## 7. VIEWER FIRST-VIEW HISTORY — IMPORTANT

Owner feedback exposed a visible first-view defect:
- room too far/small;
- room low/right;
- large dead dark area;
- weak first impression.

The first correction introduced adaptive room framing:
- commit `499a86fc7663d49fff98fafa6014df1fdb4b2f2d`;
- framing now uses room dimensions + real viewer aspect;
- initial view and Reset use the same showcase-frame logic;
- framing tests were added.

Owner then showed that on the real Windows/browser setup the model was still pushed right.

Audit found the real-device issue:
- renderer pixel ratio was >1;
- `renderer.setSize(..., false)` left CSS canvas sizing inconsistent with the visual viewport;
- CI at DPR=1 did not expose the same displacement.

DPI/CSS canvas correction:
- implementation checkpoint `be36a7b3c198175ab592e19e222b097196bebe8b`;
- `renderer.setSize(width, height)` now keeps the CSS canvas aligned with the viewer on high-DPI displays.

### Current visual acceptance state

Do NOT invent an approval that has not happened.

The Owner explicitly rejected the pre-DPI build as still right-shifted.  
The latest DPI correction has technical/CI/visual-QA evidence, but the Owner has not yet given an explicit final visual verdict on that exact latest build in the current review sequence.

Therefore:
- framing direction is improved and technically corrected;
- it is not final visual polish;
- **PR #3 still has no merge approval**;
- next Controller must not claim Owner acceptance of the latest build unless the Owner explicitly confirms it.

---

## 8. LATEST TECHNICAL VERIFICATION

For implementation checkpoint `be36a7b3c198175ab592e19e222b097196bebe8b`:

- Push CI: `35782023236` — SUCCESS
- Pull Request CI: `35782027582` — SUCCESS
- Static preview publish: `35782022859` — SUCCESS
- strict TypeScript — PASS
- Vitest — **21 / 21 tests PASS**
- production build — PASS
- browser smoke — PASS
- Work screenshot QA — inspected
- Client screenshot QA — inspected
- static preview build: `fd5425ac5675e0aaedb480f1d9f3428eaf0a396d`

After the viewer changes, these core files remained byte-identical to the previous proven checkpoint:
- `apps/work/src/domain.ts`
- `apps/work/src/calculation.ts`
- `apps/work/src/capabilities.ts`
- `apps/work/src/smart-offer-interaction.ts`
- `apps/work/src/viewer-visibility.ts`

So the viewer correction did not alter domain geometry truth, quantity, pricing, capability boundaries or cutaway rules.

---

## 9. PR #3 STATE

PR #3:
**First Vertical Slice v1: Smart Offer core loop**

Current policy:
- OPEN;
- DRAFT;
- mergeable at last audit;
- **DO NOT MERGE without explicit Owner approval**.

Never infer merge approval from:
- “ok” meaning continue;
- green CI;
- technical PASS;
- approval of one subpart;
- a documentation update.

Before merge:
- current HEAD/diff must be verified;
- CI must be green;
- visual result must have been seen by Owner;
- explicit Owner merge approval is required.

---

## 10. WHAT IS DELIBERATELY NOT IN THIS SLICE

Not bugs and not reasons to widen PR #3:

- door/window openings and deductions;
- niches/projections;
- full M² calculator migration;
- multiple services;
- production Price Book;
- Supabase persistence/auth;
- Published Revision implementation;
- protected standalone Client Viewer;
- Link / Link + PIN implementation;
- Cloudflare production delivery;
- PDF/signature/acceptance;
- furniture/material library;
- AI/photo reconstruction.

Do not start these inside PR #3 merely because the screen looks incomplete.

---

## 11. M² CALCULATOR DECISION

Only this legacy tool is current integration/reference scope:

**Калкулатор М² → `Traqnivanov/ivanov-tools/kalkulator-combined.html`**

Do NOT integrate:
- `calculator.html`;
- `room.html`.

Strict rule:

**one shared project/domain geometry → 3D + M² technical view + quantities/materials + Smart Offer**

No iframe.  
No duplicate hidden room state.  
No legacy DOM/localStorage/Firebase runtime dependency.

Formula migration:
**legacy result → manual calculation → pure TypeScript → automated test → approval**

---

## 12. SEQUENCING AFTER FIRST-SLICE CLOSURE

Do not choose the next feature ad hoc.

Current approved development sequence after the First Vertical Slice is:

### Slice 2 — Persistence
- Supabase project persistence;
- schema/version migration;
- Work authentication;
- reliable Save/Open.

### Slice 3 — Publishing
- Published Revision creation;
- minimized client-safe payload;
- Link / Link + PIN;
- separate protected Client Viewer.

### Slice 4 — Complete room offer
- multiple services;
- openings;
- operation-specific quantity rules;
- fuller client Info and room workflow.

Then expand objects, materials, service families and realism in controlled slices.

This sequence can be changed only through:
**audit → impact/risk → better demonstrated solution → Owner decision**.

Important:
Do NOT jump directly to doors/windows, materials or another visible feature just because the current proof looks unfinished.

---

## 13. EXACT NEXT GATE FOR A NEW CHAT

A new Chief Work Controller should:

1. verify current branch HEAD and PR #3 state;
2. read the mandatory source-of-truth documents;
3. verify CI after this documentation sync;
4. confirm that no app code changed after `be36a7b3c198175ab592e19e222b097196bebe8b` unless the diff proves otherwise;
5. let the Owner inspect the latest interactive DPI-corrected preview if the Owner has not explicitly done so;
6. obtain an **explicit Owner decision about merging PR #3**;
7. if merge is approved, perform the approved merge procedure and then start a fresh audit/planning block for Slice 2;
8. if merge is not approved, address only the concrete Owner finding — do not broaden scope.

Do not start Slice 2 before PR #3 closure unless the Owner explicitly changes the sequencing.

---

## 14. VISUAL QUALITY RULE

Technical PASS is never enough for visible UI/3D.

Before showing a visual change as “fixed”:
- inspect the real rendered result;
- check centering, scale, clipping, readable text and dead space;
- consider real-device DPI/browser behavior;
- verify Work and Client views;
- do not call prototype visuals final quality.

The final product still needs much higher realism and polish.  
The present slice only proves the product mechanism.

---

## 15. FINAL HANDOFF

**Continue the same Smart Offer product. Preserve the proven core. Work adaptively, not randomly. Do not add the next attractive feature just because the prototype is incomplete. First close PR #3 through the current visual-review + explicit merge gate. Then follow the approved slice sequence unless Owner deliberately changes it.**
