# PROJECT STATE — Ivanov Remonti Smart Offer

**Role:** single official current-state document.  
**Start here first:** `START_HERE.md`  
**Current Work Issue:** none

This file answers only: **where is the project now, what is active, what can affect the next work, and what is NEXT.**  
Detailed execution history belongs to Git, merged PRs and closed Issues.

---

## 1. Repository / active work

- Repo: `Traqnivanov/ivanov-remonti-3d`
- Stable product baseline: `main` after merged Slice 2 + continuity consolidation.
- Slice 2 merge commit inside main history: `4e281f15dd343048fd353ccf30f12596d69fcc98`
- Continuity consolidation merge commit: `358db09e31fde049d04403e36a14aa95250e8eaa`
- Active branch: **none**
- Active PR: **none**
- Active Current Work: **none**
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

**P3.1 — Floor Finish vertical slice — MERGED / CLOSED**

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

**None.**

P3.1 — Floor Finish vertical slice is complete after merged PR #10.

Closed result:
- multi-service runtime foundation: PASS;
- Fine Putty regression baseline: PASS;
- Laminate floor assignment + exact floor quantity: PASS;
- separate EUR DEV pricing fixture: PASS;
- Offer → Model / Model → Offer: PASS;
- client Info + focused quantity/price: PASS;
- corrected Laminate visual proof: PASS;
- real authenticated Save/reload/Open: PASS;
- backward compatibility with old Fine Putty-only project: PASS;
- Viewer Session separation: PASS;
- final branch CI #277: SUCCESS;
- final static preview #157: SUCCESS;
- merge commit: `0631821405b7013554963c80b0d8481da9ace579`.

Detailed history remains in PR #10 / Issue #9 / Git.

---

## 7. NEXT EXACT STEP

**No active implementation task.**

The broader approved direction remains **one complete room**.

Before the next implementation block:
1. Work Controller audits the remaining complete-room gaps against the newly merged P3.1 baseline;
2. identify the smallest logically complete next block;
3. make one concrete proposal;
4. run Criteria Check;
5. obtain explicit Owner approval where required;
6. only then create the next Current Work Issue and implementation branch.

Do not jump directly into broad services/assets/AI expansion and do not implement from historical assumptions.
