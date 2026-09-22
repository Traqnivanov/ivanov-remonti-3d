# CURRENT HANDOFF — IVANOV REMONTI SMART OFFER

**Date:** 22.09.2026  
**Repo:** `Traqnivanov/ivanov-remonti-3d`  
**Current branch:** `feat/vertical-slice-v1`  
**Current verified implementation checkpoint:** `62318ecd39d3c691570bd6f53e455c8a1fc21a5f`

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

At checkpoint `62318ecd39d3c691570bd6f53e455c8a1fc21a5f`:
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

### Final First Vertical Slice acceptance closure
- added browser-level smoke verification with real Chromium input;
- real drag + wheel interaction changes the rendered 3D view;
- manual wall hide and ceiling hide change the rendered view;
- Auto Cutaway toggles ON/OFF through the actual UI;
- Offer → Model is verified through the actual offer-row interaction plus exact target-ID tests;
- Model → Offer is verified through an actual pointer click on linked 3D geometry through the viewer raycast path;
- quantity / price / Info remain synchronized through presentation changes;
- hidden Client authoring controls are programmatically exercised and confirmed unable to mutate dimensions or service scope;
- direct Client Preview cannot escape into Work;
- browser page runtime exceptions / console.error / page log errors are a CI gate;
- explicit visibility/camera tests verify quantity stays invariant;
- latest verification: 5 test files / 18 tests PASS, strict TypeScript PASS, production build PASS, browser smoke PASS, Work/Client screenshot QA PASS.

Technical acceptance audit:
- `docs/FIRST_VERTICAL_SLICE_ACCEPTANCE_AUDIT.md`
- status: **TECHNICAL PASS — READY FOR PR / OWNER REVIEW**
- no required `FIRST_VERTICAL_SLICE_V1.md §11` item is blocked.

CI cleanup:
- GitHub Pages preview remains optional and is now manual-only because repository Pages is not enabled;
- failed Pages preview runs are not application failures and no longer run on normal branch pushes;
- production architecture remains unchanged.

Acceptance / closure commits include:
- `82a348601e16aa7ebba864812519c13cff8e3433` — actual linked-wall Model → Offer browser verification;
- `62318ecd39d3c691570bd6f53e455c8a1fc21a5f` — final clean visibility/quantity invariance test state;
- `4e46a8dc0fc122b28e016569c3000cd54fa67e3a` — Pages preview manual-only;
- `d96d3162dee5e08f43156af383cc28e8dd257b18` — formal technical acceptance audit.

Next work block:

**Open a Pull Request from `feat/vertical-slice-v1` to `main`, review the full diff and required checks, and report any real regression/risk found. Do NOT merge without explicit Owner approval.**

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
