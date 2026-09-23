# FIRST VERTICAL SLICE v1 — TECHNICAL ACCEPTANCE AUDIT

**Date:** 22.09.2026  
**Repo:** `Traqnivanov/ivanov-remonti-3d`  
**Branch:** `feat/vertical-slice-v1`  
**Acceptance basis:** `docs/FIRST_VERTICAL_SLICE_V1.md §11`  
**Latest implementation checkpoint before documentation sync:** `5d5e5f04c238b7fd2b73c0feb4a23e13b57b11fe`  
**Status:** **TECHNICAL PASS / DESKTOP CHECKPOINT ACCEPTABLE / HARDENED MOBILE QA PASS / OWNER REAL-DEVICE RECHECK PENDING / NO MERGE APPROVAL**

This audit is a technical acceptance record. It is not merge authorization.

## 1. Owner visual-review history

The first technically passing slice was not accepted visually.

Owner-observed problems:
- room/model pushed low/right;
- too much empty dark space;
- model too small/far on first load;
- first view did not feel intentional enough.

Correction 1:
- commit `499a86fc7663d49fff98fafa6014df1fdb4b2f2d`;
- adaptive showcase framing based on room dimensions and viewport;
- initial and reset framing unified;
- framing tests added.

Owner then showed the model still right-shifted on the real Windows/browser setup.

Correction 2:
- implementation checkpoint `be36a7b3c198175ab592e19e222b097196bebe8b`;
- high-DPI/CSS canvas sizing fixed by allowing renderer size to update the CSS canvas;
- no domain/quantity/price/capability logic changed.

Important:
- the Owner explicitly rejected the pre-DPI build;
- the later DPI-corrected desktop view was then judged acceptable for the First Slice checkpoint, not final polish;
- mobile-first QA subsequently exposed two real issues: Work viewer below the first screen and oversized mobile viewer overlays;
- commit `6d7030dbd48399d72a3cac362f94ddbc9ab06aa0` improved those issues, but **Owner real-device screenshots rejected that state**;
- the Owner screenshots showed controls covering the 3D scene, clipped controls and an oversized Work → Preview header;
- audit found the original mobile emulation was a false positive because its effective CSS layout was much wider than the requested phone profile;
- QA was hardened to assert a real 360 px CSS layout, all visible control bounds, horizontal overflow and the real Work → Preview transition;
- commits through `5d5e5f04c238b7fd2b73c0feb4a23e13b57b11fe` separated controls from the 3D canvas and constrained the mobile layout correctly;
- hardened automated mobile/touch QA and Work Controller visual inspection now pass;
- Owner real-phone/device **recheck** is still pending.

Therefore PR #3 remains DRAFT and must not be merged without explicit Owner approval after the remaining real-device visual gate.

## 2. Latest verification evidence

For `5d5e5f04c238b7fd2b73c0feb4a23e13b57b11fe`:

- Push CI run: `35791907144` — SUCCESS
- Pull Request CI run: `35791911659` — SUCCESS
- Static preview publish run: `35791907178` — SUCCESS
- strict TypeScript: PASS
- Vitest: **21 / 21 tests PASS**
- production build: PASS
- `npm ci`: PASS
- desktop Work smoke: PASS
- desktop direct Client smoke: PASS
- mobile Work smoke at true 360 px layout target: PASS
- mobile Work → Owner Preview smoke: PASS
- mobile direct Client smoke: PASS
- touch orbit: PASS
- horizontal overflow gate: PASS
- visible button/control clipping gate: PASS
- desktop screenshots: inspected
- mobile Work/Owner Preview/direct Client screenshots: inspected
- real Opera desktop regression check: PASS
- static preview build: `6beb1cf18adffc2515a490df286f154f0d380a5d`

The browser smoke uses a real Chromium session and checks runtime/console errors, canvas interaction, Work/Client boundaries and core Smart Offer interactions.

## 3. §11 acceptance matrix

### 3D

| Requirement | Status | Evidence |
|---|---|---|
| true 3D room | VERIFIED | Three.js/WebGL floor/walls/ceiling with stable IDs. |
| orbit/zoom | VERIFIED | Real browser drag + wheel input changes rendered view. |
| reset useful view | VERIFIED TECHNICALLY | Reset uses the same adaptive showcase-frame calculation as initial view. |
| wall/ceiling visibility | VERIFIED | Browser smoke + pure visibility tests. |
| auto cutaway ON/OFF | VERIFIED | Browser smoke + visibility rules. |
| quantity independent of camera/visibility | VERIFIED | Domain quantity invariance tests remain green. |
| first-view fit adapts to viewer | VERIFIED TECHNICALLY | `viewer-framing.test.ts` covers Work/Client viewport fitting. |
| high-DPI canvas remains aligned to CSS viewer | IMPLEMENTED + CI/SCREENSHOT QA | Renderer CSS size now follows the real viewer dimensions. |

### Offer → Model

| Requirement | Status | Evidence |
|---|---|---|
| Fine Putty row interaction | VERIFIED | Browser smoke performs actual row click. |
| correct linked geometry highlight | VERIFIED | Interaction tests + rendered presentation change. |
| quantity/price/Info stay synchronized | VERIFIED | Browser smoke snapshots values across presentation-only interaction. |

### Model → Offer

| Requirement | Status | Evidence |
|---|---|---|
| linked wall can be clicked in 3D | VERIFIED | Real pointer/raycast browser path. |
| linked Fine Putty row is emphasized | VERIFIED | Browser smoke + pure interaction test. |

### Integrity

| Requirement | Status | Evidence |
|---|---|---|
| hidden wall does not change quantity | VERIFIED | Quantity derives from Project/domain geometry. |
| camera does not change quantity | VERIFIED | Camera/cutaway states tested independently. |
| price not stored on mesh/material | VERIFIED | Price Book fixture lives in calculation/domain layer. |
| presentation does not mutate scope | VERIFIED | Interaction tests and Client mutation guards pass. |

### Work vs Client

| Requirement | Status | Evidence |
|---|---|---|
| Work authoring controls only in Work UI | VERIFIED | Screenshots + smoke. |
| Client Preview cannot author | VERIFIED | Hidden controls are programmatically exercised and rejected by capability guard. |
| direct Client cannot escape to Work | VERIFIED | Browser smoke. |
| one project state feeds both | VERIFIED | No duplicate Client project state. |

### Quality

| Requirement | Status | Evidence |
|---|---|---|
| no page console/runtime errors | VERIFIED | Browser smoke error gate. |
| strict TypeScript | VERIFIED | CI PASS. |
| tests | VERIFIED | 6 test files, **21 tests PASS**. |
| production build | VERIFIED | CI PASS. |
| manual screenshot inspection | VERIFIED | Latest Work and Client CI artifacts inspected. |
| desktop checkpoint acceptance | VERIFIED FOR FIRST SLICE | Owner judged the corrected desktop composition acceptable for this checkpoint, not final polish. |
| hardened mobile emulated QA | VERIFIED | True 360 px layout target; Work, Owner Preview and direct Client; touch, overflow and per-control clipping gates. |
| Work Controller mobile visual inspection | VERIFIED | Latest Work, Owner Preview and direct Client mobile screenshots inspected. |
| previous Owner real-device mobile review | REJECTED / SUPERSEDED BUILD | Proved the earlier QA false positive and forced the hardened gate. |
| Owner real-device mobile recheck | **PENDING** | Required before merge discussion is closed. |

## 4. Viewer correction isolation

After the original technical acceptance, the viewer work changed framing/canvas behavior only.

The following core modules remained byte-identical through the latest implementation checkpoint:
- `apps/work/src/domain.ts`
- `apps/work/src/calculation.ts`
- `apps/work/src/capabilities.ts`
- `apps/work/src/smart-offer-interaction.ts`
- `apps/work/src/viewer-visibility.ts`

Therefore the recent corrections did not alter:
- project/domain geometry truth;
- service scope;
- quantity rules;
- Price Book separation;
- Work/Client capability contract;
- cutaway rule logic.

## 5. Approved-scope deferrals — not blockers

Still deliberately outside First Vertical Slice v1:
- openings / door-window deductions;
- full M² calculator migration;
- multiple services;
- production Price Book;
- Supabase persistence/auth;
- Published Revision implementation;
- protected standalone Client Viewer;
- Link / Link + PIN;
- Cloudflare production delivery;
- PDF/signature/acceptance;
- furniture/material library;
- photo/AI reconstruction.

Do not classify these as regressions in PR #3.

## 6. Known non-blocking note

Vite still reports a JavaScript chunk around 518 KB minified, slightly above the 500 KB warning threshold.

This is a later performance item and is not a blocker for the first-slice mechanism.

## 7. Result

Technical acceptance remains **PASS**.

Current closure gate:

1. verify CI remains green after documentation sync;
2. Owner opens the latest interactive build on a real phone/device;
3. if mobile is accepted, obtain explicit Owner merge approval;
4. if mobile reveals a concrete issue, fix only that bounded issue and repeat mobile-first QA;
5. only then merge or continue correction.

**No implicit “OK”, CI result, screenshot review by the Work Controller, or documentation update counts as merge approval.**
