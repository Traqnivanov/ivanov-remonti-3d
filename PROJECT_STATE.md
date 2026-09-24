# PROJECT STATE — Ivanov Remonti Smart Offer

**Role:** single official current-state document.  
**Start here first:** `START_HERE.md`  
**Current Work Issue:** #5 — **[CURRENT WORK] P2.5 — Minimal visible persistence integration**

This file describes **where the project is now**.  
It is not a history log. Git and historical documents preserve the past.

---

## 1. Current repository state

- Repo: `Traqnivanov/ivanov-remonti-3d`
- Stable production-development baseline: `main@cda27d78faf28565b7faef2f4917aa14c5d8a2d4`
- That main commit is the merged **First Vertical Slice** baseline.
- Active working branch: `feat/persistence-slice-v1`
- Active PR: **#4 — DRAFT / OPEN**
- Latest verified product-code checkpoint: `8821b3ac837360c9475d7543dbfc49cf96a5b6bb`
- Continuity system: **ACTIVE / MIGRATION VERIFIED**.
- Continuity migration was verified through branch head `c4b1b59b613647bfb832d2da2730fdffaa2caf3d` with Vertical Slice CI #222 SUCCESS and static preview #112 SUCCESS.
- Every new chat must still verify the **actual current branch HEAD and PR state** before implementation; Git continues moving after this state record.

---

## 2. Current product phase

**Current active slice:** Slice 2 — Persistence.

### Completed

#### First Vertical Slice — MERGED / CLOSED
Proven and accepted for that checkpoint:
- true Three.js room;
- stable surface IDs;
- Work / Client Preview capability split;
- Fine Putty linked to exact walls;
- Offer → Model;
- Model → Offer;
- geometry-derived wall quantity;
- DEV Price Book fixture;
- client Info;
- M² view from the same geometry truth;
- hardened mobile QA;
- Owner real-device mobile acceptance;
- desktop checkpoint;
- PR #3 explicitly approved and merged.

#### Slice 2 — P2.1 PASS
Persistence domain boundary:
- generalized `PersistedProjectV1`;
- serializer/deserializer;
- validation/migration boundary;
- stable project/entity identity rules.

#### Slice 2 — P2.2 PASS
Database foundation:
- dedicated Supabase project;
- `work_users`;
- `projects`;
- migration;
- explicit grants;
- RLS;
- security verification.

#### Slice 2 — P2.3 PASS
Private Work Auth:
- Supabase publishable browser client;
- authenticated identity boundary;
- active `work_users` authorization;
- Owner-selected email + password sign-in;
- private login UI;
- live real-user sign-in verified.

#### Slice 2 — P2.4 PASS
Project repository:
- Create;
- List;
- Open;
- Save;
- optimistic `work_version`;
- stale-save rejection;
- real live Create → List → Open verification;
- real live save `1 → 2`;
- stale retry from version 1 rejected as `STALE_WRITE`;
- final repository/RLS/cleanup verification PASS.

---

## 3. Current live persistence truth

Dedicated Supabase:
- organization: **Ivanov Remonti**
- project: **ivanov-remonti-3d**
- project ref: `qjfpbxucrxrtpygusnuv`
- region: `eu-west-1`

Current verified security posture:
- RLS enabled on `projects` and `work_users`;
- `anon` has no Work project SELECT/INSERT/UPDATE access;
- authenticated Work user can read own allowed Work access and own projects under RLS;
- authenticated browser cannot insert/update `work_users`;
- project DELETE is not granted to normal authenticated Work users;
- no `service_role` credential in browser bundle.

Bounded QA project:
- remains intentionally available for persistence verification;
- status: draft;
- `work_version = 3`;
- persisted project ID matches DB row ID;
- room remains `room-1`;
- saved room name: `Дневна — QA Save v2`;
- geometry: 4.2 × 4.8 × 2.7 m;
- Fine Putty assignment identity remains stable;
- real authenticated P2.5c Work Save `v2 → v3`: PASS;
- direct Supabase verification confirmed canonical height `2.7`;
- persisted `presentation = {}` and no Viewer Session State leaked into Project State.

Temporary `repoqa` / `saveqa` routes and modules were removed after verification.

---

## 4. Current gate

**P2.5 — Minimal visible persistence integration**

P2.5 implementation is **IN PROGRESS**.

Completed before implementation:
- short UI/interaction audit — PASS;
- one concrete interaction proposal — RECORDED IN ISSUE #5;
- visible Criteria Check — RECORDED IN ISSUE #5.

Owner decision:
**APPROVED.**

Implementation progress:
- **P2.5a — Project Session foundation: PASS**
- **P2.5b — Project Bar + Projects dialog / Create/Open: PASS**
- **P2.5c — Save + dirty/error/conflict recovery: PASS**
- **P2.5c live authenticated Save v2 → v3 + direct Supabase verification: PASS**
- **P2.5d — final P2.5 acceptance: IN PROGRESS**

P2.5 scope is only:
- Create project;
- Open existing project;
- Save current project;
- clear save/version/conflict/error status;
- preserve Client Preview as read-only.

Not in P2.5:
- Publishing;
- Published Revision UI;
- Link / PIN;
- Client editing;
- Complete Room expansion;
- new service families;
- production Price Book expansion;
- unrelated visual redesign.

Current temporary work record:
- GitHub Issue **#5**.

---

## 5. Active product/architecture truths relevant now

The complete durable list is in `START_HERE.md §10`.

Especially relevant to P2.5:
- Project State and Viewer Session State stay separate;
- Save/Open persists canonical project truth, not camera/selection/cutaway;
- Client Preview is read-only;
- quantity remains geometry-derived;
- renderer is not persistence truth;
- `work_version` must remain the optimistic concurrency boundary;
- stale saves must never silently overwrite newer state;
- Work access remains private and RLS-enforced;
- no privileged Supabase secret in browser.

---

## 6. Known unresolved / deferred items

These are known and must not be forgotten, but they are **not blockers for starting the P2.5 audit**:

1. **Password recovery redirect**
   - current Supabase recovery redirect exposed a localhost default during testing;
   - email/password login itself works;
   - configure/review recovery flow before exposing password recovery as a user-facing feature.

2. **Supabase leaked-password protection advisor**
   - Security Advisor reports leaked-password protection disabled;
   - non-blocking for P2.4;
   - review during P2.6 security acceptance;
   - availability may depend on current Supabase plan/capability.

3. **Protection Gate before production/final release**
   - repo remains public during development by Owner decision;
   - production is not approved until source/repository protection strategy and security review are completed.

4. **Published client delivery**
   - Published Revision/Snapshot is already the approved client model;
   - exact stable-link vs revision-specific-link UX remains a later decision and must not be guessed.

---

## 7. Historical truth that must not be revived as current

- PR #3 is **merged/closed**.
- First Slice is **closed**; do not reopen it without a concrete regression.
- old wording that says First Slice mobile approval/merge is still pending is historical and superseded.
- old wording that says Published Revision is “not yet Owner-locked” is superseded by the later Owner approval.
- broad legacy-calculator scope is superseded: only **Калкулатор M² / `kalkulator-combined.html`** is current.
- old PR #4 descriptions that say migration/Auth/Save/Open are absent are stale; P2.1–P2.4 are now complete.

---

## 8. Current verification status

Continuity system:
- canonical `START_HERE.md`: active;
- canonical `PROJECT_STATE.md`: active;
- single Current Work Issue: **#5**;
- historical/superseded documents remain non-authoritative.

P2.5 verification:
- P2.5a technical gate: PASS;
- P2.5b technical + Controller visual gate: PASS;
- P2.5c code/automated QA/Controller visual gate: PASS;
- P2.5c source checkpoint: `8821b3ac837360c9475d7543dbfc49cf96a5b6bb`;
- CI #255: SUCCESS;
- static preview #146: SUCCESS;
- latest branch head after a no-code checkpoint: `ad19a8c15d966f5b54c822a8077fe23121100b80`;
- CI #256: SUCCESS;
- static preview #147: SUCCESS;
- real authenticated P2.5c Save through the visible Work UI: **PASS**;
- direct Supabase verification after the live Save: **PASS**;
- live QA project is now at `work_version = 3`;
- persisted geometry is `4.2 × 4.8 × 2.7 m`;
- no Viewer Session State was persisted.

P2.5d final acceptance is now the active gate.

A new chat must verify the current latest branch/PR/CI state rather than treating these run numbers as eternal state.

---

## 9. NEXT EXACT STEP

**P2.5d — complete final P2.5 acceptance.**

Required:
- verify current branch HEAD / PR / CI after the live-PASS state record;
- confirm full P2.5 technical regression gate remains green;
- perform final mobile-first visual acceptance for the complete persistence flow;
- confirm desktop consistency;
- record any visual/product defect immediately before closure.

Do not begin P2.6 or merge PR #4 until P2.5d passes.
