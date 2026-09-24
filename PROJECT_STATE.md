# PROJECT STATE — Ivanov Remonti Smart Offer

**Role:** single official current-state document.  
**Start here first:** `START_HERE.md`  
**Current Work Issue:** #9 — **[CURRENT WORK] P3.1 — Floor Finish vertical slice**

This file answers only: **where is the project now, what is active, what can affect the next work, and what is NEXT.**  
Detailed execution history belongs to Git, merged PRs and closed Issues.

---

## 1. Repository / active work

- Repo: `Traqnivanov/ivanov-remonti-3d`
- Stable product baseline: `main` after merged Slice 2 + continuity consolidation.
- Slice 2 merge commit inside main history: `4e281f15dd343048fd353ccf30f12596d69fcc98`
- Continuity consolidation merge commit: `358db09e31fde049d04403e36a14aa95250e8eaa`
- Active branch: `feat/p3-1-floor-finish-vertical-slice`
- Active PR: **#10 — DRAFT / OPEN**
- Active Current Work: **Issue #9 — P3.1**
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

**P3.1 — Floor Finish vertical slice — ACTIVE**

Current checkpoint:
- **P3.1a — multi-service domain/runtime foundation: PASS**
- **P3.1b — floor quantity + DEV pricing: ACTIVE**

Owner-approved P3.1 direction:
- expand the proven Smart Offer mechanism through a real floor-finish vertical slice;
- preserve Fine Putty as a regression baseline;
- do not broaden into openings, furniture, uploaded materials, publishing or unrelated Slice 3 work.

---

## 3. Current live persistence truth

Dedicated Supabase project remains the canonical persisted application truth.

Current bounded QA project:
- `work_version = 3`;
- geometry: `4.2 × 4.8 × 2.7 m`;
- reload/reopen: verified;
- Fine Putty after reopen: `48.60 m²`;
- DB row ID and persisted `projectId`: matching;
- Viewer Session State: not persisted.

Current verified security posture:
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
- next major product direction after Persistence is **one complete room before broad service-family expansion**, unless Owner explicitly changes it.

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

**Issue #9 — P3.1 Floor Finish vertical slice**

Active branch:
- `feat/p3-1-floor-finish-vertical-slice`

Active PR:
- **#10 — DRAFT / OPEN**

Current checkpoint:
- **P3.1a — multi-service domain/runtime foundation**

P3.1a implementation checkpoint:
- runtime Project State changed from singleton `serviceAssignment` to `serviceAssignments[]`;
- persisted schema version remains v1 because persistence already used an assignments array;
- canonical Fine Putty assignment remains required;
- runtime can round-trip multiple surface-targeted assignments;
- unique assignment IDs are enforced;
- visible UI remains Fine Putty-only in P3.1a;
- product-code checkpoint: `8459e9c9ef4a118b426a3d43174845429fc270c9`.

P3.1a verification:
- CI #267: SUCCESS;
- typecheck/tests/build/browser smoke: PASS;
- Fine Putty regression: PASS;
- scope audit: PASS.

Safety rule for P3.1b:
- existing persisted projects are not silently given a new quoted floor service;
- existing v1 Fine Putty-only state remains valid.

---

## 7. NEXT EXACT STEP

**P3.1b — floor quantity + DEV pricing.**

Implement only:
1. canonical laminate/floor-finish assignment factory for new P3.1 default/proof projects;
2. exact floor-area quantity from canonical room geometry;
3. separate DEV Price Book fixture in EUR;
4. regression tests proving Fine Putty remains unchanged;
5. persistence round-trip for the new assignment.

Do not add the second visible offer row or floor material rendering yet. Those belong to P3.1c/P3.1d.
