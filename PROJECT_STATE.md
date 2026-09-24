# PROJECT STATE — Ivanov Remonti Smart Offer

**Role:** single official current-state document.  
**Start here first:** `START_HERE.md`  
**Current Work Issue:** #6 — **[CURRENT WORK] P2.6 — Slice 2 acceptance**

This file describes **where the project is now**.  
It is not a history log. Git and historical documents preserve the past.

---

## 1. Current repository state

- Repo: `Traqnivanov/ivanov-remonti-3d`
- Stable production-development baseline: `main@cda27d78faf28565b7faef2f4917aa14c5d8a2d4`
- That main commit is the merged **First Vertical Slice** baseline.
- Active working branch: `feat/persistence-slice-v1`
- Active PR: **#4 — DRAFT / OPEN**
- Latest verified product-code checkpoint: `7afa4856bdd56bfeb28e2b7ed3c3cd7e7d82be6c`
- Continuity system: **ACTIVE / MIGRATION VERIFIED**.
- Continuity migration was verified through branch head `c4b1b59b613647bfb832d2da2730fdffaa2caf3d` with Vertical Slice CI #222 SUCCESS and static preview #112 SUCCESS.
- Every new chat must still verify the **actual current branch HEAD and PR state** before implementation; Git continues moving after this state record.

---

## 2. Current product phase

**Current active slice:** Slice 2 — Persistence — **ACCEPTANCE PASS / OWNER MERGE DECISION PENDING**.

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

**P2.6 — Slice 2 acceptance: PASS**

All Slice 2 acceptance gates are satisfied.

Key final evidence:
- P2.1–P2.5: PASS;
- real authenticated Work Save `v2 → v3`: PASS;
- direct Supabase verification: `work_version = 3`, geometry `4.2 × 4.8 × 2.7 m`;
- new-page reload → automatic reopen: PASS;
- reopened Fine Putty quantity: `48.60 m²`;
- stable persisted project/entity identity: PASS;
- stale-write rejection: PASS;
- invalid/unsupported schema rejection: PASS;
- Viewer Session State isolation: PASS;
- live RLS/grants re-verification: PASS;
- no privileged browser credential: PASS;
- final mobile-first + desktop visible QA: PASS;
- latest verified product-code checkpoint: `7afa4856bdd56bfeb28e2b7ed3c3cd7e7d82be6c`.

Security disposition:
- leaked-password protection disabled: known non-blocking warning for Slice 2; review again before production/final release;
- password recovery localhost redirect: non-blocking because recovery is not exposed in Slice 2; must be fixed before exposing recovery;
- Protection Gate remains mandatory before production/final release.

Current temporary work record:
- GitHub Issue **#6**.

PR #4 remains **DRAFT / OPEN**.
**Next gate is explicit Owner merge approval.**
No merge and no Slice 3 work before that approval.
---

## 5. Active product/architecture truths relevant now

The complete durable list is in `START_HERE.md §10`.

Especially relevant to P2.6:
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

These are known and must not be forgotten. P2.6 must explicitly classify whether any of them blocks Slice 2 closure:

1. **Password recovery redirect**
   - current Supabase recovery redirect exposed a localhost default during testing;
   - email/password login itself works;
   - P2.6 classification: non-blocking because recovery is not exposed in Slice 2;
   - configure/review recovery flow before exposing password recovery as a user-facing feature.

2. **Supabase leaked-password protection advisor**
   - Security Advisor still reports leaked-password protection disabled;
   - P2.6 classification: known, non-blocking for Slice 2 correctness/RLS;
   - review again before production/final release and enable if available/appropriate for the deployed plan.

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
- single Current Work Issue: **#6**;
- historical/superseded documents remain non-authoritative.

Slice 2 — Persistence: **ACCEPTANCE PASS**.
- product-code checkpoint: `7afa4856bdd56bfeb28e2b7ed3c3cd7e7d82be6c`;
- P2.5 final CI #259: SUCCESS;
- P2.5 static preview #150: SUCCESS;
- current QA project: `work_version = 3`;
- persisted geometry: `4.2 × 4.8 × 2.7 m`;
- reload/reopen proof: PASS;
- Fine Putty after reopen: `48.60 m²`;
- live RLS/grants re-check: PASS;
- mobile-first final visual review: PASS;
- desktop consistency: PASS.

Current branch documentation reconciliation is part of the final PR gate and must have green CI before merge.

A new chat must verify the actual current branch/PR/CI state rather than treating these run numbers as eternal state.
---

## 9. NEXT EXACT STEP

**Owner merge decision for PR #4.**

Before merge:
- verify the latest branch HEAD after final documentation reconciliation;
- require latest CI = SUCCESS;
- require static preview publish = SUCCESS;
- PR #4 remains DRAFT until the Owner explicitly approves merge.

If Owner approves merge and the final checks are green:
- merge PR #4 into `main`;
- verify resulting `main` state;
- close Current Work Issue #6;
- only then prepare the next Slice 3 work record.

Do not start Slice 3 before the merge is complete and verified.
