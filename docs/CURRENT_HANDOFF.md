# CURRENT HANDOFF — IVANOV REMONTI SMART OFFER

**Date:** 22.09.2026  
**Repo:** `Traqnivanov/ivanov-remonti-3d`  
**Current branch:** `feat/vertical-slice-v1`  
**Current verified implementation checkpoint:** `6a61fa512355c967a646181b776dd05a09679a18`

## 1. Roles / process

- Owner = user, final product authority.
- Work Controller = current assistant / next lead chat.
- Follow **PROJECT_RULES_00_READ_FIRST.md §27 Adaptive Work Sizing**.
- Use the smallest safe block for risky/ambiguous work, but bundle obvious related low-risk corrections into one coherent pass.
- After each meaningful implementation block:
  1. typecheck/tests/build as applicable;
  2. visual QA if UI/3D changed;
  3. fix regressions before expanding scope.
- Do not silently change product fundamentals.
- Do not add more rules/documents unless they solve a real coordination problem.
- Existing APPROVED/LOCKED decisions are current protected baseline, but can be replaced later by explicit Owner decision after audit.

## 2. Product criteria that MUST remain intact

The product is **Ivanov Remonti Smart Offer**, not a generic room planner.

Core chain:

**обект ↔ услуга ↔ място в 3D ↔ количество ↔ цена ↔ Info ↔ краен резултат**

Required:
- true interactive 3D;
- orbit / zoom / reset;
- removable walls/ceiling and auto cutaway;
- Work Mode and Client/View Mode remain separate capability profiles;
- client never edits project/quantity/price;
- service row ↔ exact 3D target works both directions;
- quantity derives from domain geometry, never from visible meshes;
- Price Book stays separate from renderer;
- published client flow later uses Published Revisions, not live Work state.

## 3. M² decision — IMPORTANT

From the two legacy calculators in `Traqnivanov/ivanov-tools`, current integration scope is ONLY:

**Калкулатор М² → `kalkulator-combined.html`**

Do NOT integrate `calculator.html` or `room.html` unless Owner later explicitly expands scope.

M² rule:

**one shared project/domain geometry → 3D + M² technical schema + quantities + Smart Offer**

No iframe, no direct legacy HTML runtime dependency, no duplicate room dimensions.

## 4. Current implementation state

Current branch already contains:
- Vite + strict TypeScript;
- Three.js room viewer;
- one rectangular room;
- stable wall/floor/ceiling IDs;
- orbit/zoom/reset;
- manual wall/ceiling visibility;
- auto cutaway;
- surface selection;
- Work Mode;
- Preview as Client;
- first service: **Фина шпакловка**;
- service target selection by wall;
- service → highlighted 3D walls;
- wall → linked service focus;
- quantity result from geometry;
- DEV-only price abstraction;
- client Info card;
- shared M² geometry module;
- M² tests for floor/ceiling/walls/perimeter/volume;
- compact M² technical schema reading the SAME project state as 3D;
- CI workflow with typecheck/tests/build and Work/Client screenshots.

Visual QA already corrected:
- shadow/moire artifacts removed;
- service focus changed from solid gold room to restrained gold outline/emphasis;
- reliable CSS Info icon;
- M² wall labels kept inside schema.

## 5. Current verification

At checkpoint `6a61fa512355c967a646181b776dd05a09679a18`:
- **Vertical Slice CI = SUCCESS**
- typecheck = success
- tests = success
- production build = success

GitHub Pages preview workflow was added only to give Owner a clickable preview.

Current Pages deployment:
- application build succeeds;
- Pages workflow fails at **Configure Pages** because GitHub Pages is not enabled/configured for the repository;
- this is a preview-hosting configuration issue, NOT an app build failure.

Do not change application architecture merely to obtain a preview URL.

Vercel was considered briefly, but is NOT required and is not part of current product architecture.

## 6. Production architecture remains unchanged

Current approved direction:
- GitHub = source/version control;
- Cloudflare = future delivery/security layer;
- Supabase Postgres/Auth/Storage = future persistent production backend;
- no Firebase;
- no D1 primary DB;
- no Supabase/Cloudflare production integration in the current first vertical slice.

## 7. What is NOT finished

- visual design is still an early functional prototype, not final polish;
- M² integration is only the first shared geometry bridge, NOT the full old M² calculator migration;
- no doors/windows/opening deductions yet in the new slice;
- no full materials/GK migration yet;
- no Supabase persistence/auth yet;
- no protected published Client Viewer yet;
- no live public preview URL yet because GitHub Pages is not enabled.

## 8. NEXT ADAPTIVE WORK BLOCK

Do not start a large new subsystem. Size the next block according to PROJECT_RULES §27.

Latest completed adaptive blocks:

### Smart Offer core loop acceptance
- isolated presentation/selection state in `apps/work/src/smart-offer-interaction.ts`;
- added tests for Offer → Model: selecting Fine Putty resolves exactly the assigned target walls;
- added tests for Model → Offer: selecting a linked wall keeps the Fine Putty offer row selected;
- added unrelated-geometry test: selecting floor does not falsely claim Fine Putty is linked;
- “Виж целия резултат” exits focus without changing project quantity or price;
- presentation-only interactions are explicitly tested to keep quantity and line total invariant;
- `main.ts` now consumes the same tested interaction logic instead of duplicating selection rules;
- selected entity chip now shows the human surface label instead of leaking the stable technical ID.

Core-loop commits:
- `36ea7f99f01057c1301d2abb840f3bb10064d177` — interaction state;
- `e86c908366fefcd4b24589c92dfcab6f98c8e7df` — Offer ↔ Model tests;
- `74dcaf8eadbf156bbe03f89359f25611285d96d5` — application integration;
- `1db888680f8cbe3c067e5f13a5590a544700d305` — quantity/price invariance test.

### Viewer visibility / cutaway acceptance
- isolated auto-cutaway and visibility resolution in `apps/work/src/viewer-visibility.ts`;
- tests verify dominant camera side hides the correct wall;
- high camera also hides the ceiling;
- manual hiding and automatic hiding combine non-destructively;
- `RoomViewer` now uses the tested pure visibility rules;
- no quantity/price path depends on viewer visibility state.

Visibility commits:
- `b4305bbf5f53d65fa8767c46b25801c7c24b644c` — visibility rules;
- `b5246391f84986b89414a5dd1e67e9f1257d708f` — visibility tests;
- `6a61fa512355c967a646181b776dd05a09679a18` — viewer integration.

Verification at this checkpoint:
- strict TypeScript = PASS;
- all automated tests = PASS;
- production build = PASS;
- Work screenshot QA = PASS;
- direct Client Preview screenshot QA = PASS;
- no visible regression in room geometry, service focus, offer values or Work/Client presentation.

Next work block:

**Run the final First Vertical Slice acceptance audit against every item in `FIRST_VERTICAL_SLICE_V1.md §11`. Do not add new product features. Close only concrete verification gaps (especially console-error/smoke verification if not currently proven), then classify each acceptance item as verified, intentionally deferred by the approved slice scope, or blocked. If all required items are verified, prepare the branch for PR review; do not merge without Owner approval.**

## 9. Required reading for a new chat

Read in this order:
1. `PROJECT_RULES_00_READ_FIRST.md`
2. `docs/MASTER_SPEC.md`
3. `docs/SMART_OFFER_PRODUCT_CONTRACT.md`
4. `docs/3D_VIEWER_STANDARD.md`
5. `docs/WORK_CLIENT_MODE_CONTRACT.md`
6. `docs/CLIENT_DELIVERY_SECURITY_CONTRACT.md`
7. `docs/INFRASTRUCTURE_DATA_ARCHITECTURE.md`
8. `docs/DATA_MODEL_V1.md`
9. `docs/DECISION_LOG.md`
10. `docs/TOOLS_REUSE_AUDIT.md`
11. `docs/LEGACY_CALCULATOR_INTEGRATION_ARCHITECTURE.md`
12. `docs/FIRST_VERTICAL_SLICE_V1.md`
13. **this file**

Do not restart the project. Continue from the current branch and current checkpoint.
