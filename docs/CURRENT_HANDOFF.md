# CURRENT HANDOFF — CHIEF WORK CONTROLLER — IVANOV REMONTI SMART OFFER

**Date:** 23.09.2026  
**Repo:** `Traqnivanov/ivanov-remonti-3d`  
**Current branch:** `feat/persistence-slice-v1`  
**Base / merged First Slice:** `main@cda27d78faf28565b7faef2f4917aa14c5d8a2d4`  
**PR #3:** MERGED / CLOSED  
**Current active slice:** Slice 2 — Persistence  
**Persistence contract:** `docs/PERSISTENCE_SLICE_V1.md`

Do not restart or re-imagine the product. Preserve the proven First Slice core.

## 1. Authority

1. Owner — final product authority.
2. Chief Work Controller — architecture, sequencing, risk, QA, routine technical decisions and task sizing.
3. OBK / execution chat — bounded implementation only.

Rule:
**NO ASSUMPTION → NO IMPLEMENTATION**

For ambiguous product behavior:
**audit → problem/goal → options → recommendation → risk → Owner decision → implementation**

Routine engineering inside an approved direction is owned by the Work Controller.

## 2. Mandatory reading

Follow `PROJECT_RULES_00_READ_FIRST.md §3`.

Current-slice addition:
- read `docs/PERSISTENCE_SLICE_V1.md` before Slice 2 implementation.

## 3. Product identity

Product: **Ivanov Remonti Smart Offer**.

North Star:

**обект ↔ услуга ↔ място в модела ↔ количество ↔ цена ↔ Info ↔ краен резултат**

This is not generic CAD, a room-planning toy or an animated construction process.

## 4. First Slice closure

First Vertical Slice is merged and closed.

Proven:
- true Three.js room;
- stable surface IDs;
- Work / Preview as Client capability split;
- Fine Putty linked to exact walls;
- Offer → Model and Model → Offer;
- geometry-derived wall quantity;
- DEV Price Book fixture;
- Smart Offer row + client Info;
- M² view from same geometry;
- hardened mobile QA;
- Owner real-device mobile acceptance for the checkpoint;
- desktop regression check;
- CI/tests/build/smoke pass.

The First Slice remains a foundation proof, not final product polish.

Do not reopen First Slice work unless a concrete regression is found.

## 5. Current Supabase project

Dedicated project for this product:

- organization: **Ivanov Remonti**;
- project: **ivanov-remonti-3d**;
- project ref: `qjfpbxucrxrtpygusnuv`;
- region: `eu-west-1`;
- initial status: `ACTIVE_HEALTHY`;
- at Slice 2 audit start: no `public` tables and no migrations.

Do not use or modify Supabase projects belonging to other products.

Never commit:
- database password;
- secret/service credentials;
- private keys.

## 6. Current architecture that remains protected

- Supabase Postgres = canonical persisted application truth.
- Supabase Auth = private Work identity.
- Stable entity IDs survive persistence.
- Renderer is not quantity/price truth.
- Viewer Session State is not Project State.
- Camera/zoom/cutaway/selection never mutate quantities or saved scope.
- Price Book remains a separate layer.
- Future Client Viewer reads Published Revision, not mutable Work state.
- No Firebase.
- No Cloudflare D1 as primary DB.

## 7. Slice 2 objective

Prove:

**authorized Work user → create/open project → edit canonical state → save → reload → same project truth**

Current Slice 2 includes:
- Work Auth boundary;
- minimum `work_users` + `projects` persistence;
- generalized versioned project document;
- project schema migration boundary;
- Create / Open / Save;
- optimistic `work_version`;
- RLS + explicit grants;
- persistence/security tests.

It does NOT include:
- Published Revision;
- Link / PIN;
- separate Client Viewer;
- production Price Book;
- Storage assets;
- doors/windows;
- more service families;
- full room expansion.

## 8. Important persistence decision

Do **not** save the current First Slice prototype object 1:1 as the permanent data contract.

Current runtime model is intentionally narrow:
- one room;
- one Fine Putty assignment;
- literal prototype IDs.

Persisted v1 uses the generalized shape from `DATA_MODEL_V1`:
- `rooms[]`;
- `serviceAssignments[]`;
- versioned `schemaVersion`;
- stable IDs.

Implementation may use an adapter so visible First Slice behavior stays unchanged while persistence is future-safe.

## 9. Save/version rule

Every loaded project carries `work_version`.

A save:
- requires expected current version N;
- updates only if DB row is still version N;
- writes N+1 on success;
- stale write returns conflict;
- never silently overwrites newer state.

No full collaboration/event-sourcing system is required.

## 10. Security rule

Work App is private.

- no anonymous Work project access;
- only authenticated authorized Work users;
- RLS is mandatory;
- frontend hiding is not authorization;
- `anon` receives no project data access;
- no privileged secret in browser;
- migration explicitly normalizes/revokes default table grants before granting only required authenticated privileges.

Exact visible sign-in method is not silently guessed if/when UI implementation reaches that decision.

## 11. Adaptive implementation sequence

Do not make one giant Slice 2 task.

### P2.1 — Persistence domain boundary
Pure TypeScript first:
- `PersistedProjectV1`;
- serializer/deserializer;
- migration/validation boundary;
- tests;
- no Supabase schema write.

### P2.2 — Database foundation
Reviewed migration:
- `work_users`;
- `projects`;
- constraints/indexes;
- explicit grants;
- RLS;
- security verification.

### P2.3 — Supabase client + Auth boundary
- publishable client config;
- authenticated Work gate;
- authorized Work-user check.

### P2.4 — Project repository
- create/list/open/save;
- optimistic concurrency;
- stale conflict handling.

### P2.5 — Minimal visible integration
- Create/Open/Save existing project;
- no unrelated redesign;
- Preview remains read-only.

### P2.6 — Acceptance
- security/RLS;
- reload round trip;
- stable IDs;
- same quantity after load;
- stale-save rejection;
- CI;
- mobile-first QA for visible UI.

## 12. Exact next gate

Current checkpoint:
- First Slice merged;
- dedicated Supabase project exists;
- reviewed persistence migration has been applied to Supabase;
- Persistence audit/contract is documented.

**P2.4c Save + stale-write rejection is live-verified PASS. Next task: P2.4d final repository verification only.**

Current gate:
1. P2.2 database foundation is complete and verified PASS;
2. P2.3 Auth is complete and live-verified;
3. P2.4a repository contract is complete and CI-proven;
4. repository contract is independent from Supabase implementation details;
5. no live project rows were created in P2.4a;
6. P2.4b adapter code/tests and real Create→List→Open verification are PASS;
7. temporary live QA entry has been removed and cleanup CI is PASS;
8. P2.4c Save adapter, real save 1→2 and stale retry rejection are PASS;
9. the bounded QA project is now at work_version 2 and the successful state was preserved;
10. temporary save QA code has been removed and cleanup CI #204 is PASS;
11. next task is **P2.4d only — final repository verification/read-only consolidation**;
12. do not add visible Create/Open/Save UI before P2.5.

Do not manually create tables in Dashboard.

## 13. Work sizing

Use `PROJECT_RULES_00_READ_FIRST.md §27 Adaptive Work Sizing`.

- micro-bundle related low-risk work;
- standard task = one clear functional block;
- split risky/multi-system work;
- checkpoint at a verifiable result or risk boundary.

Do not keep the chat occupied with a long monolithic task.

## 14. Final instruction

**Continue the same Smart Offer product. Slice 2 is persistence only. Preserve the First Slice behavior, create a clean versioned persistence boundary first, and do not jump to Publishing or Complete Room.**
