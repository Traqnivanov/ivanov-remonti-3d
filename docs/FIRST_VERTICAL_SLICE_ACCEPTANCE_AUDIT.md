# FIRST VERTICAL SLICE v1 — TECHNICAL ACCEPTANCE AUDIT

**Date:** 22.09.2026  
**Repo:** `Traqnivanov/ivanov-remonti-3d`  
**Branch:** `feat/vertical-slice-v1`  
**Acceptance basis:** `docs/FIRST_VERTICAL_SLICE_V1.md §11`  
**Status:** **TECHNICAL PASS — READY FOR PR / OWNER REVIEW**  
**Important:** this is not an Owner product approval and is not a merge authorization.

## Verification evidence

Latest fully passing verification before this audit:

- Vertical Slice CI run: `35772299341`
- strict TypeScript: PASS
- Vitest: **18 / 18 tests PASS**
- production build: PASS
- browser smoke: **PASS — Work + direct Client Preview**
- Work screenshot QA: PASS
- Client screenshot QA: PASS

The browser smoke uses a real headless Chromium session and checks application/runtime console errors, real canvas interaction, Work/Client boundaries and key Smart Offer interactions.

## §11 acceptance matrix

### 3D

| Requirement | Status | Evidence |
|---|---|---|
| room is true 3D | VERIFIED | Three.js/WebGL room uses real floor/wall/ceiling meshes; rendered in Work and Client QA screenshots. |
| orbit/zoom works comfortably | VERIFIED for first-slice functional acceptance | Browser smoke sends real drag + wheel input to the 3D canvas and verifies the rendered page changes; no app/runtime error is produced. |
| wall/ceiling visibility works | VERIFIED | Browser smoke hides a real wall and ceiling and verifies visual changes; pure visibility tests also pass. |
| auto cutaway can be enabled/disabled | VERIFIED | Browser smoke toggles Auto Cutaway both ways; `viewer-visibility.test.ts` verifies camera-side cutaway rules. |
| no floating child artifacts for implemented geometry | VERIFIED FOR CURRENT SCOPE | Current child visual geometry is attached to its host mesh; visibility is inherited. Latest visual QA shows no floating artifacts. No furniture/opening child system exists in this slice. |

### Offer → Model

| Requirement | Status | Evidence |
|---|---|---|
| click Fine Putty offer row | VERIFIED | Browser smoke performs the actual offer-row click. |
| correct wall(s) highlight | VERIFIED | `smart-offer-interaction.test.ts` resolves the exact assigned wall IDs; browser smoke verifies entering/exiting focus changes the rendered model presentation. |
| quantity/price/Info stay synchronized | VERIFIED | Browser smoke snapshots quantity, total and Info before/after presentation-only interactions; values remain unchanged. |

### Model → Offer

| Requirement | Status | Evidence |
|---|---|---|
| click a linked wall | VERIFIED | Browser smoke performs real pointer clicks on visible 3D canvas geometry through the viewer raycast path. |
| Fine Putty row is emphasized/shown | VERIFIED | Browser smoke requires the Fine Putty row to become selected after a linked-wall canvas click; pure interaction tests cover the same link contract. |

### Integrity

| Requirement | Status | Evidence |
|---|---|---|
| hiding wall does not change quantity | VERIFIED | Visibility/quantity invariance test passes; quantity is derived from Project/domain geometry, not visible meshes. |
| camera does not change quantity | VERIFIED | Auto-cutaway camera states are tested while quantity remains identical. |
| price is not stored on mesh/material | VERIFIED | Price Book fixture and line-total logic live in calculation/domain code; renderer/viewer material code has no price source. |
| changing selected service presentation does not change quantity | VERIFIED | Smart Offer interaction tests explicitly verify quantity and line total remain invariant across presentation-only selections. |

### Work vs Client

| Requirement | Status | Evidence |
|---|---|---|
| Work controls exist only in Work UI | VERIFIED | Work/Client screenshots + browser smoke. |
| Preview as Client has no authoring controls | VERIFIED | Client UI hides Work authoring; application capability guard rejects dimension/target mutation even if hidden controls are invoked programmatically. |
| same project state feeds both | VERIFIED | Work and Preview toggle capability/presentation over the same in-memory `project` object; there is no separately retyped Client project state. |

### Quality

| Requirement | Status | Evidence |
|---|---|---|
| no console errors | VERIFIED | Browser smoke monitors runtime exceptions, `console.error` and browser page log errors; latest run passes. Headless Chrome host DBus/GPU stderr messages are runner/environment noise, not page console errors. |
| strict TypeScript passes | VERIFIED | Latest CI passes `tsc --noEmit`. |
| calculation tests pass | VERIFIED | Latest CI: 5 test files, 18 tests, all pass. |
| manual visual QA performed | VERIFIED | Latest Work and direct Client screenshots were inspected after the implementation/interaction fixes. |

## Approved-scope deferrals — not blockers

The following remain deliberately outside First Vertical Slice v1 and do **not** fail this acceptance audit:

- openings / window-door deductions;
- full legacy M² calculator migration;
- multiple services and advanced operation-specific calculators;
- production Price Book;
- Supabase persistence/auth;
- Published Revisions;
- protected standalone Client Viewer;
- Link / Link + PIN;
- Cloudflare production delivery;
- PDF / signature / acceptance flow;
- furniture, photo AI and full materials library.

## Known non-blocking technical notes

- Vite reports a JavaScript chunk around 518 KB minified, above its 500 KB warning threshold. This is a performance optimization item for later and does not invalidate the first-slice mechanism.
- GitHub Pages was only an optional development-preview experiment. Repository Pages is not enabled, so the Pages workflow is now **manual-only** and does not run/fail on normal branch pushes.
- Production hosting architecture remains Cloudflare + Supabase as already approved; this audit does not change it.

## Result

No required §11 acceptance item is currently blocked.

The First Vertical Slice v1 is **technically ready for Pull Request review**.

Next allowed action:
1. open PR from `feat/vertical-slice-v1` to `main`;
2. review diff/checks;
3. **do not merge without Owner approval**.
