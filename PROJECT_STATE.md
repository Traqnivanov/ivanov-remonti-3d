# PROJECT STATE — Ivanov Remonti Smart Offer

**Role:** single official current-state document.  
**Start here first:** `START_HERE.md`  
**Current Work Issue:** #13 — `[CURRENT WORK] P3.3 — Generic Operation Authoring Core` — AUTHORIZED / not yet implemented.

This file answers only: **where is the project now, what is active, what can affect the next work, and what is NEXT.**  
Detailed execution history belongs to Git, merged PRs and closed Issues.

---

## 1. Repository / active work

- Repo: `Traqnivanov/ivanov-remonti-3d`
- Stable product-code baseline: `main` after merged P3.2; current `main` also includes the approved roadmap / source-rule / Uniqueness-gate documentation sync.
- P3.2 merge commit: `f55a0bcea1c298bdf773aa2ec970f0df7a13c896`
- Slice 2 merge commit inside main history: `4e281f15dd343048fd353ccf30f12596d69fcc98`
- Continuity consolidation merge commit: `358db09e31fde049d04403e36a14aa95250e8eaa`
- Active feature branch: none yet for P3.3c
- Active PR: none yet for P3.3c
- Active Current Work Issue: **#13 — P3.3 Generic Operation Authoring Core**
- PR #12: **MERGED / CLOSED**
- PR #10: **MERGED / CLOSED**
- P3.1 merge commit: `0631821405b7013554963c80b0d8481da9ace579`
- PR #8: **MERGED / CLOSED**

Every new chat must verify the actual branch / HEAD / PR state before changing anything.

---

## 2. Product phase

### First Vertical Slice — MERGED / CLOSED

Proved the core Smart Offer mechanism:
- true Three.js room;
- stable model entities;
- Work vs Client capability split;
- service ↔ exact model location;
- Offer → Model and Model → Offer;
- geometry-derived quantity;
- Price Book fixture;
- client Info;
- mobile-first and desktop QA.

History: PR #3 and its closed work records.

### Slice 2 — Persistence — MERGED / CLOSED

Proved the real persistent Work foundation:
- private Work Auth;
- Supabase Postgres + RLS;
- Create / List / Open / Save;
- versioned canonical Project State;
- stale-write rejection;
- Work-only persistence UI;
- dirty/error/conflict recovery;
- reload/reopen of the same canonical project;
- Viewer Session State kept outside persisted Project State.

History: PR #4 / closed Issue #6.

### Current product implementation

**P3.2 — Door + Window Openings — MERGED / CLOSED**

Current checkpoint:
- **P3.2a — Opening domain + persistence foundation: PASS**
- **P3.2b — Opening geometry proof: PASS**
- **P3.2c — Fine Putty net wall quantity: PASS**
- **P3.2d — Work opening controls + live persistence acceptance: PASS**
- **P3.2 overall acceptance: PASS / MERGED**
- PR #12 merge commit: `f55a0bcea1c298bdf773aa2ec970f0df7a13c896`

P3.1 — Floor Finish vertical slice remains **MERGED / CLOSED**

Current checkpoint:
- **P3.1a — multi-service domain/runtime foundation: PASS**
- **P3.1b — floor quantity + DEV pricing: PASS**
- **P3.1c — Smart Offer interaction: PASS**
- **P3.1d — floor visual result + persistence acceptance: PASS**
- **P3.1 overall acceptance: PASS / MERGED**

Owner-approved P3.1 direction:
- expand the proven Smart Offer mechanism through a real floor-finish vertical slice;
- preserve Fine Putty as a regression baseline;
- do not broaden into openings, furniture, uploaded materials, publishing or unrelated Slice 3 work.

---

## 3. Current live persistence truth

Dedicated Supabase project remains the canonical persisted application truth.

Three bounded QA projects now prove backward compatibility, P3.1, and P3.2 live persistence:

### Existing Slice 2 QA project
- title: `QA — P2.4b Create List Open`;
- `work_version = 3`;
- geometry: `4.2 × 4.8 × 2.7 m`;
- service assignments: **Fine Putty only**;
- remained unchanged throughout P3.1.

### P3.1 QA project
- title: `P3.1 QA Floor`;
- project ID: `67e7f6ff-16b8-4278-8cd0-6d2c0beab4ff`;
- `work_version = 2`;
- geometry: `4.3 × 4.8 × 2.6 m`;
- service assignments: **Fine Putty + Laminate**;
- Laminate target: `room-1.floor`;
- Laminate quantity after reload/open: **20.64 m²**;
- DB row ID and persisted `projectId`: matching;
- `presentation = {}`;
- camera/zoom/selection/cutaway Viewer Session State: not persisted;
- real authenticated Create → Save v1→v2 → reload → Open: PASS.

### P3.2 QA project
- title: `P3.2 QA Openings`;
- project ID: `add1f9af-5e4a-4b60-b047-5fa20e2e8c31`;
- `work_version = 2`;
- geometry: `4.2 × 4.8 × 2.6 m`;
- openings: exactly **1 door + 1 window**;
- door: `0.9 × 2.1 m`, front wall;
- window: `1.3 × 1.1 m`, sill `0.9 m`, right wall;
- persisted total opening area: **3.32 m²**;
- persisted Fine Putty net area recomputed directly from Supabase state: **43.48 m²**;
- Fine Putty rule: `wall-net-area-openings-v1`;
- `presentation = {}`;
- authenticated UI proof: door + window → **43.59 m²** → window width `1.2 → 1.3` → **43.48 m²** → dirty → Save `v1 → v2` → reload/reopen: PASS;
- older Slice 2 and P3.1 QA projects remained untouched.

Current verified security posture remains unchanged:
- RLS enabled on `projects` and `work_users`;
- `anon` has no Work-project SELECT/INSERT/UPDATE;
- authenticated project access is owner + active Work-user scoped;
- authenticated browser has no project DELETE and cannot mutate `work_users`;
- no privileged Supabase credential is shipped to the browser.

---

## 4. Active durable direction

The shortest authoritative product direction is now in `START_HERE.md`:

**real object → editable model → service → exact place → quantity → price → Info → final result → protected interactive client offer**

Important current guardrails:
- Work/Edit and Client/View remain separate capability profiles;
- mobile is the first UX/QA priority;
- quantities come from confirmed domain geometry + approved rules;
- Price Book stays separate from renderer/geometry;
- client receives a Published Revision/Snapshot, never the mutable Work draft;
- Client is read-only with Link or Link + PIN per approved delivery contract;
- EUR only;
- final Client/Result quality must aim toward a believable real-room result, while Work view stays fast/practical;
- real colors/palettes and intentional user-supplied materials/images on supported surfaces/objects are part of the end-state target;
- next major product direction after Persistence is **one complete room before broad service-family expansion**, unless Owner explicitly changes it;
- the approved staged path is now recorded in `docs/DELIVERY_STRATEGY.md §15`: **P3.3 → P3.4 → P3.5 → P3.6 → P3.7 → P3.8 Complete Room → P4 Publishing → P5 broader service families → P6 Office workflow → P7 Photo Assist → P8 advanced outputs → Protection Gate**;
- **Uniqueness Interrupt Gate is always active:** an approved decision is the protected current baseline, not immutable. If a materially stronger mechanism/logic/sequence is found during work, stop the affected scope, compare benefit + dependencies + impact/risk, obtain Owner approval when the product decision changes, supersede/sync the old truth, then continue. No silent substitution and no unrelated restart.

Detailed rules are read from the dependency map in `START_HERE.md` only when the active task requires them.

---

## 5. Known deferred / blocking-before-release items

These do not block planning of the next slice, but must not be forgotten:

1. **Password recovery redirect**
   - localhost default was exposed during testing;
   - fix before password recovery is exposed to users.

2. **Supabase leaked-password protection**
   - Security Advisor warning remains;
   - review/enable when appropriate before production/final release.

3. **Production Protection Gate**
   - repo remains public during development by Owner decision;
   - production/final release requires the approved repository/source/security protection review.

4. **Published client delivery UX**
   - Published Revision/Snapshot is approved;
   - stable-link vs revision-specific-link behavior remains a later product decision.

---

## 6. Current Work

**P3.3 — Generic Operation Authoring Core — AUTHORIZED / NOT YET IMPLEMENTED**

Current Work Issue:
- Issue #13 — `[CURRENT WORK] P3.3 — Generic Operation Authoring Core`.

Approved purpose:
- remove proof-only Fine Putty/Laminate assignment-specific coupling before more services are added;
- establish generic operation → target → quantity rule → quantity → Price Book reference → Info → presentation-mode flow;
- introduce the safe authoring/change boundary and Undo/Redo foundation before authoring expands;
- prove the generic mechanism with one additional real Registry operation;
- preserve P3.1/P3.2 behavior and old persisted projects.

P3.3 is intentionally bounded. Production Price Book/totals, broad finishing catalog, objects, uploaded materials/images, Publishing and AI remain outside this block.

There is currently:
- no P3.3 feature branch yet;
- no P3.3 PR yet;
- no P3.3 product-code implementation yet.

The global **Uniqueness Interrupt Gate** applies at every P3.3 checkpoint. If a materially stronger mechanism is discovered, the affected work stops before further implementation and follows the approved compare → impact/risk → Owner decision when material → supersede/sync → continue flow.

---

## 7. NEXT EXACT STEP

**P3.3c — generic Work operation authoring + third real operation.**

P3.3a and P3.3b are now merged into `main`.

Exact next:
1. audit the approved source definition for **Гипсова шпакловка** only;
2. define the smallest generic Work flow to add/remove/include the operation and choose exact wall targets;
3. reuse the generic quantity rule and separate price reference; no new assignment-specific calculation branch;
4. source Client Info from the approved Ivanov Remonti page/guide;
5. verify Undo/Redo + Save/Open + Offer↔Model behavior;
6. mobile-first QA;
7. do not expand into the broader finishing catalog in this block.

Uniqueness Interrupt Gate remains active throughout P3.3c.
