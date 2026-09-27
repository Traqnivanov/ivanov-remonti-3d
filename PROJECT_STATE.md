# PROJECT STATE — Ivanov Remonti Smart Offer

**Role:** single official current-state document.  
**Start here first:** `START_HERE.md`  
**Current Work Issue:** #21 — `[CURRENT WORK] P3.5 — Real wall/ceiling finishing stack` — **PLANNING / AUDIT ONLY; NO IMPLEMENTATION AUTHORIZED YET.**

This file answers only: **where the project is now, what is active, what can affect the next work, and what is NEXT.**  
Detailed execution history belongs to Git, merged PRs and closed Issues.

---

## 1. Repository / current checkpoint

- Repo: `Traqnivanov/ivanov-remonti-3d`
- Stable branch: `main`
- Active feature branch: **none**
- Active PR: **none**
- Active Current Work Issue: **#21 — P3.5 Real wall/ceiling finishing stack**
- P3.3: **MERGED / VERIFIED / CLOSED**
- P3.4: **MERGED / VERIFIED / CLOSED**
- Latest product-code merge: PR #20
- PR #20 merge commit: `126e9877c425329867cf9963497467091008e1d2`
- Final verified P3.4b head before merge: `745fa385947315721102c82ce459651182b28b71`
- Final P3.4b CI: #351 / `36333699252` — **SUCCESS**

Every new chat must verify actual branch / HEAD / PR / Issue state before changing anything.

---

## 2. Product identity / North Star

Product: **Ivanov Remonti Smart Offer**

North Star:

**обект ↔ услуга ↔ точно място в модела ↔ количество ↔ цена ↔ Info ↔ краен резултат**

End-to-end target:

**real object → editable model → service → exact place → quantity → price → Info → final result → protected interactive client offer**

This is not:
- a generic CAD clone;
- a room-planning toy;
- a construction animation.

The product must create practical value for real Ivanov Remonti work and a clear, trustworthy client offer.

---

## 3. Stable merged foundation

### Persistence / security foundation
Already proved and merged:
- private Work Auth;
- Supabase Postgres as canonical persisted application truth;
- RLS;
- Create / List / Open / Save;
- optimistic concurrency / stale-write rejection;
- canonical Project State persistence;
- Viewer Session State kept outside persisted Project State;
- Work-only mutation capability;
- Client remains read-only.

Current verified security posture:
- RLS enabled on `projects` and `work_users`;
- anonymous users do not receive Work-project mutation access;
- browser does not ship privileged Supabase credentials;
- project access remains owner + active Work-user scoped.

### Geometry / interaction foundation
Merged and verified:
- true Three.js room;
- stable room/surface entities;
- Work vs Client capability profiles;
- Offer → Model and Model → Offer;
- room dimensions;
- door/window openings;
- opening-aware wall quantities;
- floor target / Laminate proof;
- mobile-first + desktop regression QA.

### Generic operation authoring — P3.3 CLOSED
P3.3 established:
- generic quantity dispatch by operation/rule identity rather than literal assignment ID;
- quantity-unit foundation;
- canonical Project State Undo/Redo;
- generic service add/include/target behavior;
- compact service authoring on mobile;
- Gypsum Putty as the first additional real Registry operation;
- Save/Open acceptance through the repository path.

Important accepted UX:
- services remain compact by default;
- only the actively edited service opens its settings;
- old always-expanded service-card direction is superseded.

### Dynamic pricing / totals — P3.4 CLOSED
Merged PRs:
- P3.4a PR #19 → `8aa86bdfe7aae9cd915608487c2c96b551114e67`
- P3.4b PR #20 → `126e9877c425329867cf9963497467091008e1d2`

Owner-locked pricing truth:
- **EUR ONLY**;
- there are **no fixed global product prices** as canonical pricing truth;
- Work enters the unit price for the concrete offer/service;
- the entered price is persisted with that offer/project;
- blank price is **not** `0 €`;
- explicit `0 €` remains distinguishable from blank;
- line total = canonical quantity × entered EUR unit price;
- offer total recalculates from included priced lines;
- selected service with no price shows **„Цена не е въведена“** and makes the offer incomplete;
- only services explicitly selected for execution enter the offer;
- unchecked services do not require price and do not affect totals/completeness;
- real new projects start with **no services selected**;
- zero selected services shows **„Няма избрани услуги“**, not „Непълна оферта“;
- Client/Preview sees prices and totals read-only;
- price edits participate in canonical Project State / Undo / Redo;
- Save/Open preserves the entered price;
- old visible `Quantity source / DEV fixture` proof UI is removed;
- test/DEV fixture prices may exist only as test compatibility data, never as business truth.

---

## 4. Source-of-truth contract

Always use these sources in their correct role:

### Real service truth
`Traqnivanov/Remonti-` on `main`
- current service pages define the real Ivanov Remonti service/scope;
- relevant Lom pages may add confirmed content;
- do not invent service meaning from memory.

### Service taxonomy / operations
`docs/SERVICE_OPERATION_REGISTRY.md`
- keeps distinct operations distinct;
- **„Мазилка“ ≠ „шпакловка“**;
- the public family „Шпакловка“ may contain Fine Putty, Gypsum Putty, reinforced/base putty, drywall joint treatment, sanding, primer/preparation, etc.

### Client-facing Info
Source priority:
**relevant current service page → relevant `narachnik/` guide → main-site brand/tone → explicit Owner/project note**

Do not invent unsupported diagnosis, technical fact or project-specific reason.

### Quantity / geometry / materials calculation legacy reference
Only:
`Traqnivanov/ivanov-tools/kalkulator-combined.html` — **Калкулатор M²**

Do not use:
- `calculator.html`
- `room.html`

as fallback formula sources.

### Legacy office tools
`ivanov-tools/offer.html`, clients/contract/advance tools may be audited later as workflow references only when their matching product capability is reached.  
Do not port old Firebase/localStorage architecture or legacy prices.

---

## 5. Active durable product guardrails

- mobile-first UX/QA;
- Work/Edit and Client/View remain separate capability profiles;
- true interactive 3D remains;
- quantities derive from confirmed domain geometry + approved rules;
- pricing remains separate from geometry/renderer;
- Client never edits canonical Project State;
- Viewer Session State is not persistent business truth;
- one complete room comes before broad service-family expansion;
- final Client/Result quality should become believable/realistic while Work remains fast/practical;
- colors/materials/user images/assets are part of later approved complete-room direction;
- Published Revision/Snapshot remains required before real client delivery;
- repo remains public during development by Owner choice;
- Production Protection Gate remains mandatory before production-ready claim.

Approved staged path:
**P3.3 → P3.4 → P3.5 → P3.6 → P3.7 → P3.8 Complete Room → P4 Publishing → P5 broader service families → P6 Office workflow → P7 Photo Assist → P8 advanced outputs → Production Protection Gate**

### Uniqueness Interrupt Gate
Approved decisions are protected current baselines, not immutable forever.

If a materially stronger mechanism/sequence is discovered:
**detect → stop affected scope → compare benefit → assess dependencies/impact/risk → Owner decision when material → supersede/sync old truth → continue**

Do not use this as permission to restart unrelated accepted work.

---

## 6. Known deferred / pre-release items

These do not block P3.5 planning, but must not be forgotten:

1. Password recovery redirect still needs production-safe handling before user-facing recovery.
2. Supabase leaked-password protection warning requires later review before production.
3. Published client delivery:
   - Published Revision/Snapshot approved;
   - stable-link vs revision-specific-link UX remains a later decision.
4. Production Protection Gate:
   - repo/source protection;
   - credentials/security/RLS/client access review;
   - asset/privacy review;
   - production hardening.

---

## 7. CURRENT WORK — P3.5

Current Work Issue:
**#21 — `[CURRENT WORK] P3.5 — Real wall/ceiling finishing stack`**

Status:
**PLANNING / AUDIT ONLY. NO P3.5 IMPLEMENTATION AUTHORIZED YET.**

P3.5 direction:
- real finishing operations, not one generic „Шпакловка“;
- audit ordinary plaster/leveling, reinforced/base putty, gypsum putty, fine putty, sanding, primer/preparation and paint from approved sources;
- ceiling becomes a real service target;
- quantity/opening-deduction behavior must be correct per operation;
- client Info must come from approved Ivanov Remonti sources;
- reuse the merged generic authoring/pricing foundation rather than creating parallel mechanisms.

Non-goals at this first step:
- no P3.5 code;
- no broad service catalog;
- no Object/Edit Core;
- no Materials/Colors/Images/Assets implementation;
- no Publishing;
- no Photo/AI;
- no unrelated redesign;
- no fixed price catalog.

---

## 8. NEXT EXACT STEP

**P3.5 source audit + one concrete bounded proposal only.**

The Work Controller must:

1. read `START_HERE.md`;
2. read this `PROJECT_STATE.md`;
3. read Current Work Issue #21;
4. verify actual `main` / HEAD / open PR state;
5. read only task-relevant permanent contracts:
   - `docs/MASTER_SPEC.md`
   - `docs/SERVICE_OPERATION_REGISTRY.md`
   - `docs/SMART_OFFER_PRODUCT_CONTRACT.md`
   - `docs/DELIVERY_STRATEGY.md`
6. audit relevant current `Traqnivanov/Remonti-` service pages + `narachnik/` guides;
7. use `kalkulator-combined.html` only where a quantity/formula question actually requires it;
8. identify the real finishing chain/dependencies and current implementation gaps;
9. propose the **smallest useful P3.5 implementation sequence**;
10. run full Criteria Check + Uniqueness Interrupt Gate + regression/dependency review;
11. explain the proposal to Owner in plain Bulgarian;
12. **STOP for Owner approval before any P3.5 code.**

There is currently:
- no P3.5 feature branch;
- no P3.5 PR;
- no P3.5 product-code implementation.

