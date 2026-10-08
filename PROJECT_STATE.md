# PROJECT STATE — Ivanov Remonti Smart Offer

**Role:** single official current-state document.  
**Start here first:** `START_HERE.md`  
**Current Work Issue:** #21 — `[CURRENT WORK] P3.5a+b — Owner product decision gate` — **Desktop D1 is Owner-approved / not merged; P3.5a+b awaits its own explicit Owner product decision.**

This file answers only: **where the project is now, what is active, what can affect the next work, and what is NEXT.**  
Detailed execution history belongs to Git, merged PRs and closed Issues.

---

## 1. Repository / current checkpoint

- Repo: `Traqnivanov/ivanov-remonti-3d`
- Stable branch: `main`
- Latest merged product checkpoint: **P3.4 / PR #20**
- PR #20 merge commit: `126e9877c425329867cf9963497467091008e1d2`
- P3.5 dependency:
  - branch: `feat/p3-5a-wall-finishing`
  - PR #22: **DRAFT / VERIFIED / NOT MERGED**
  - actual scope: **P3.5a+b — Wall/Ceiling finishing foundation**
  - verified head: `cab113478d250c4e74221a6367f883cb5f543881`
  - CI `36343470472`: **SUCCESS**, 161/161 tests PASS
- Desktop D1:
  - D1.1–D1.5: **OWNER-APPROVED / NOT MERGED**
  - final stacked head: `2f777372d3c0b6cd05ba28aeb8431fda6e39344c`
  - final CI `37832808003`: **SUCCESS**, 169/169 tests PASS
  - final PR: #31, stacked through PRs #24/#25/#27/#28/#29/#30
- Current Work Issue: **#21 — P3.5a+b Owner product decision gate**
- D1 Issue #23: **OWNER-APPROVED / NOT MERGED**
- No P3.5/D1 merge is authorized yet.

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

These do not block the current P3.5 decision gate, but must not be forgotten:

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

## 7. CURRENT WORK — final integration merge gate

Current Work Issue:
**#21 — `[CURRENT WORK] P3.5 + D1 — final merge gate`**

Owner-approved scope:
- P3.5a+b — **OWNER-APPROVED / NOT MERGED**;
- Desktop D1.1–D1.5 — **OWNER-APPROVED / NOT MERGED**.

Single current integration candidate:
- PR #33 — **DRAFT / NOT MERGED**;
- branch: `review/p35-d1-final-acceptance`;
- latest exact head / CI / visual / deploy evidence is recorded in Current Work Issue #21;
- candidate product code preserves the accepted D1 behavior;
- reconciliation preserves current main documentation/preview workflow truth and introduces no new product behavior.

Final acceptance already established on the candidate before this documentation-only continuity sync:
- typecheck PASS;
- 17/17 test files / 169/169 tests PASS;
- build PASS;
- full browser acceptance PASS;
- Desktop Work / Owner Preview / direct Client / mobile Work-Preview-Client visual review PASS;
- exact Pages deployment PASS.

Because this file and the handoff are now being synchronized on `main`, PR #33 must include this documentation-only main movement and rerun the final CI/deploy check before merge authorization can be requested. No product behavior may change during that refresh.

Approved P3.5a+b truth remains:
- Fine Putty / Gypsum Putty / Sanding / Primer / Paint are distinct real operations;
- applicable finishing service defaults to walls + ceiling;
- walls use opening-aware net m²;
- ceiling uses room width × length;
- ceiling is independently removable;
- wall/ceiling are separate price scopes with Work-entered EUR prices;
- both scopes keep one real service identity;
- missing price ≠ zero;
- Client remains read-only;
- plaster/base-putty/broad catalog remain deferred.

No merge is authorized.

---

## 8. NEXT EXACT STEP

**REFRESH PR #33 WITH THIS DOCUMENTATION-ONLY MAIN SYNC → RERUN FINAL ACCEPTANCE → OWNER MERGE GATE.**

Required:
1. reconcile PR #33 with the latest `main` documentation-only commits;
2. prove product files remain unchanged from the accepted integration behavior;
3. rerun final CI and exact Pages deployment;
4. verify no visual/product regression from the doc-only refresh;
5. record final head/evidence in Issue #21;
6. **STOP for explicit Owner merge command.**

Do not:
- change P3.5/D1 product behavior;
- merge old stacked PRs directly;
- start Mobile Work redesign;
- start P3.6 or another phase.

**No merge without an explicit Owner command for PR #33.**
