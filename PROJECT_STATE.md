# PROJECT STATE — Ivanov Remonti Smart Offer

**Role:** single official current-state document.  
**Start here first:** `START_HERE.md`  
**Current Work Issue:** #7 — **[CURRENT WORK] Documentation consolidation — end-state compass**

This file answers only: **where is the project now, what is active, what can affect the next work, and what is NEXT.**  
Detailed execution history belongs to Git, merged PRs and closed Issues.

---

## 1. Repository / active work

- Repo: `Traqnivanov/ivanov-remonti-3d`
- Stable product baseline: `main@dd85c583ec52b687126fac62fd4646a7e02c8143`
- Slice 2 merge commit inside main history: `4e281f15dd343048fd353ccf30f12596d69fcc98`
- Active branch: `docs/continuity-compass-consolidation`
- Active PR: **#8 — DRAFT / OPEN**
- Active Current Work: **Issue #7**
- Current branch purpose: documentation consolidation only; no product implementation.

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

**None.**

No Slice 3 implementation is authorized while Issue #7 is active.

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

These do not block the current documentation task, but must not be forgotten:

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

## 6. Current Work — Issue #7

Purpose:
- keep permanent docs out of chat-diary mode;
- make `START_HERE` sufficient as the end-state/product/process compass;
- keep `PROJECT_STATE` compact;
- preserve history in Git / merged PRs / closed Issues;
- prove that a new Work chat can continue without reading the entire document stack.

No product code, Supabase, 3D, pricing, service or client-delivery behavior is being changed in this task.

---

## 7. NEXT EXACT STEP

Issue #7 implementation and cold-start simulation are complete.

Cold-start result: **PASS** — `START_HERE.md + PROJECT_STATE.md + Issue #7 + Git verification` are sufficient to reconstruct the end-state product, current state, protected truths and correct NEXT without reading the full document stack.

Current merge gate:
1. review PR #8 diff;
2. require green CI / repository checks on the final docs branch;
3. stop for explicit Owner merge approval.

**Do not start Slice 3 implementation inside Issue #7.**
