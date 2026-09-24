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
- Latest verified product-code checkpoint: `8a09c6066e085fdf7dd8ffce9f5230648c797cc7`
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
- `work_version = 2`;
- persisted project ID matches DB row ID;
- room remains `room-1`;
- saved room name: `Дневна — QA Save v2`;
- geometry: 4.2 × 4.8 × 2.6 m;
- Fine Putty assignment identity remains stable.

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
- **P2.5b — Project Bar + Projects dialog / Create/Open: NEXT**

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

Continuity migration verification:
- canonical `START_HERE.md`: present;
- canonical `PROJECT_STATE.md`: present;
- single Current Work Issue: **#5**;
- old `CURRENT_HANDOFF.md`: preserved but explicitly SUPERSEDED;
- First Slice implementation/acceptance docs: explicitly HISTORICAL;
- Work/Client publishing contract: synchronized to Owner-approved Published Revision;
- M²-only legacy integration scope: surfaced at the top of the reuse audit;
- PR #4 description: synchronized to actual P2.1–P2.4 state;
- active conflict scan: no unresolved active contradiction found;
- Vertical Slice CI **#222 — SUCCESS**;
- static preview **#112 — SUCCESS**;
- P2.4 repository verification: PASS;
- no P2.5 visible change exists yet, therefore P2.5 visual QA has not started.

A new chat must verify the current latest branch/PR/CI state rather than treating these run numbers as eternal state.

---

## 9. NEXT EXACT STEP

**P2.5b — implement the approved visible Work-only Project Bar shell + Projects dialog + Create/Open + 0/1/2+ startup behavior.**

Scope boundary:
- no Save/conflict recovery UI yet;
- no autosave;
- no rename/archive/delete;
- Client Preview remains read-only.

After P2.5b: technical gate + exact preview + visual inspection before advancing to P2.5c.
