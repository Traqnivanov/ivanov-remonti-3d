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

## 7. MERGED CHECKPOINT — P3.6a SceneObject foundation

Status:
**MERGED / CLOSED / VERIFIED.**

Owner explicitly authorized merge of PR #35.

Final merge:
- PR #35 — MERGED;
- merge commit: `ab0c901a557c5201d85841462244de0ef4ce5888`;
- tested candidate head: `9bbd2a8d0fdcba006ccd8ae2ffb65bb89eace231`;
- merge commit tree is byte-identical to the tested candidate tree: `f5eb237560578120b54c71a141bee1e45a32eaf9`;
- final pre-merge CI `38465353270`: SUCCESS;
- 18/18 test files / 187/187 tests PASS;
- typecheck + build + full browser acceptance PASS;
- final visual artifact `11848262735`: PASS;
- no UI/layout/content regression;
- no Supabase/DB schema migration or production change.

Merged P3.6a truth:
- canonical SceneObject is part of Project State;
- object IDs are stable and room-scalable;
- canonical placement is surface-host-local, not Three.js/world coordinates;
- dimensions + lock state are canonical project state;
- rotated host-plane bounds and room-depth constraints are validated;
- supported objects persist through the existing project JSON / `work_state` path;
- old projects with `objects: []` remain compatible;
- invalid object state is rejected before Save;
- missing object/entity references are rejected at Save/Open boundaries;
- ServiceAssignment / Smart Offer entity bridge can target object IDs;
- generic `entity-count-v1` infrastructure exists without introducing a fake customer-facing service;
- SceneObject state participates in existing Undo/Redo;
- current visible Work/Client behavior remains unchanged.

Still not implemented:
- visible Radiator object authoring/rendering;
- object drag/snap;
- object lock controls in UI;
- real object-linked service family/pricing;
- P3.7 assets/materials;
- Mobile Work redesign.

---

## 8. NEXT EXACT STEP

**NO NEW P3.6 SUB-STEP IS ACTIVE.**

The approved sequence points next to **P3.6b — Radiator proof object**, but P3.6b must be opened as a new bounded Current Work checkpoint before implementation.

Required before P3.6b code:
1. open exactly one new `[CURRENT WORK]` Issue for P3.6b;
2. re-read the merged P3.6a baseline and relevant viewer/object contracts;
3. define the smallest real Radiator proof behavior that uses the merged SceneObject foundation;
4. run Criteria Check and confirm scope/risks;
5. obtain Owner approval for that bounded P3.6b checkpoint;
6. only then implement.

Do not:
- reopen/rebuild P3.6a;
- start P3.6c drag/snap early;
- broaden to electrical/furniture/service catalogs;
- touch Supabase/DB by implication;
- start P3.7 or Mobile redesign.

**Stable P3.6a merge baseline: `ab0c901a557c5201d85841462244de0ef4ce5888` plus documentation-only post-merge continuity sync.**
