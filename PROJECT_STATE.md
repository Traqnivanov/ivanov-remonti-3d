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
- **P3.1b — floor quantity + DEV pricing: PASS**
- **P3.1c — Smart Offer interaction: PASS**
- **P3.1d — floor visual result + persistence acceptance: PASS**
- **P3.1 overall acceptance: PASS / OWNER MERGE DECISION PENDING**

Owner-approved P3.1 direction:
- expand the proven Smart Offer mechanism through a real floor-finish vertical slice;
- preserve Fine Putty as a regression baseline;
- do not broaden into openings, furniture, uploaded materials, publishing or unrelated Slice 3 work.

---

## 3. Current live persistence truth

Dedicated Supabase project remains the canonical persisted application truth.

Two bounded QA projects now prove both backward compatibility and P3.1:

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

P3.1 checkpoints:
- P3.1a multi-service runtime foundation: **PASS**;
- P3.1b floor quantity + DEV pricing: **PASS**;
- P3.1c Smart Offer interaction: **PASS**;
- P3.1d floor visual result + persistence acceptance: **PASS**.

Final accepted P3.1 result:
- runtime supports multiple surface-targeted service assignments;
- Fine Putty remains the regression baseline;
- Laminate targets exactly `room-1.floor`;
- floor quantity comes from canonical geometry;
- price stays in a separate EUR DEV Price Book fixture;
- Offer → Model and Model → Offer work for Fine Putty and Laminate;
- Client Info/quantity/DEV price are synchronized to the focused service;
- corrected lightweight Laminate presentation passed desktop/mobile visual QA;
- Save/reload/Open with both assignments passed live authenticated verification;
- old Fine Putty-only persisted v1 project remains valid and unchanged;
- no Viewer Session State persistence regression.

Accepted product/QA checkpoints:
- P3.1a product-code: `8459e9c9ef4a118b426a3d43174845429fc270c9`;
- P3.1b product-code: `ddfc447b0f36d7ac370254dcb3a56ee4ce7b7bf5`;
- P3.1c product-code: `7785668a3c0a789a87746ebca6d3de6afe0e44a3`;
- Laminate visual correction: `54275623f63e4e32eb44ec2842273a1df344f901`;
- final verified product/QA HEAD before this state record: `e63fad567a66e7e6c78a546c2092b27fb72af04f`;
- CI #276: SUCCESS;
- P3.1 static preview #156: SUCCESS.

Scope audit: PASS — no openings, wall net deductions, palettes/uploads, furniture, electrical objects, PDF/export, publishing, production Price Book, broad service catalog or AI/photo expansion entered P3.1.

---

## 7. NEXT EXACT STEP

**Final PR #10 merge gate.**

Before merge:
1. commit this factual P3.1 acceptance state only;
2. require final branch HEAD CI = SUCCESS;
3. require P3.1 static preview publish = SUCCESS;
4. verify PR #10 remains mergeable and scope-clean;
5. stop for explicit Owner merge approval.

Do not begin the next complete-room block before PR #10 is merged and `main` is verified.
