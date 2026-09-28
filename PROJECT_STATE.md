# PROJECT STATE — Ivanov Remonti Smart Offer

**Role:** single official current-state document.  
**Start here first:** `START_HERE.md`  
**Current Work Issue:** #23 — `[CURRENT WORK] D1 — Desktop Workbench UX` — **D1.2 IMPLEMENTED / TECHNICALLY + VISUALLY VERIFIED; awaiting Owner live-preview review. D1.3–D1.5 remain inactive.**

This file answers only: **where the project is now, what is active, what can affect the next work, and what is NEXT.**  
Detailed execution history belongs to Git, merged PRs and closed Issues.

---

## 1. Repository / current checkpoint

- Repo: `Traqnivanov/ivanov-remonti-3d`
- Stable branch: `main`
- P3.5 dependency branch: **`feat/p3-5a-wall-finishing`**
- P3.5 dependency PR: **#22 — DRAFT / verified but not merged; remains a separate Owner merge gate**
- Active D1 branch: **`feat/d1-1-desktop-workbench`**
- Active D1 PR: **#24 — `D1.1 — Desktop Workbench skeleton` — DRAFT / stacked on PR #22**
- Active Current Work Issue: **#23 — D1 Desktop Workbench UX**
- P3.3: **MERGED / VERIFIED / CLOSED**
- P3.4: **MERGED / VERIFIED / CLOSED**
- Latest product-code merge: PR #20
- PR #20 merge commit: `126e9877c425329867cf9963497467091008e1d2`
- Final verified P3.4b head before merge: `745fa385947315721102c82ce459651182b28b71`
- Final P3.4b CI: #351 / `36333699252` — **SUCCESS**
- P3.5a verified head: `e3aed2d13ed8cca18d31ac74623fb1a3b7ad73fc`
- P3.5a final CI: #357 / `36340308776` — **SUCCESS**

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

## 7. CURRENT WORK — D1 Desktop Workbench

Current Work Issue:
**#23 — `[CURRENT WORK] D1 — Desktop Workbench UX`**

Owner-approved direction:
- this D1 line changes **Desktop Work only**;
- Mobile Work and Client Preview are separate later redesigns and must not be redesigned inside D1;
- desktop becomes a practical 3-zone workstation:
  - left = object / room geometry;
  - center = persistent 3D work area;
  - right = services / scope / price / Smart Offer;
- the page must stop forcing constant full-page scrolling between geometry, services and offer;
- the distinctive product mechanism remains **object → service → exact place → quantity → price → Info**.

Approved bounded sequence — strictly one at a time:
1. **D1.1 — Desktop skeleton**
   - persistent three-zone desktop layout;
   - independent side-panel scrolling;
   - 3D remains visible while editing;
   - service controls move into the right Work zone;
   - no tabs/accordion redesign yet;
   - no business-logic change.
2. **D1.2 — Left Work panel**
   - compact Room / Openings / Scheme organization;
   - M² scheme becomes secondary/collapsible.
3. **D1.3 — Right Smart Offer panel**
   - scalable Services / Scope / Price+Info organization;
   - total remains easy to see as services grow.
4. **D1.4 — Unique context link**
   - 3D selection opens the exact relevant Work context;
   - preserve exact object/surface → service/offer relationship.
5. **D1.5 — Desktop acceptance QA**
   - multi-service real workflow;
   - openings + separate prices;
   - Save/Open + Work→Client Preview;
   - desktop overflow/scroll acceptance;
   - mobile/client regression only, no redesign.

Dependency:
- D1.1 is stacked on the verified P3.5b feature state because PR #22 is not merged yet;
- P3.5 Issue #21 stays open as **PAUSED / DEPENDENCY**;
- PR #22 remains DRAFT and is not implicitly approved or merged by starting D1;
- D1 changes must remain separable from P3.5 logic.

---

## 8. NEXT EXACT STEP

**OWNER LIVE-PREVIEW REVIEW — D1.2 Left Desktop Work panel.**

Verified D1.2 result:
- room dimensions remain immediately visible;
- openings are compact desktop summary rows;
- only one opening editor expands at a time;
- adding/editing keeps the relevant opening expanded;
- M² scheme is secondary/collapsed by default on desktop;
- collapsed M² row shows quick wall + ceiling area values;
- M² scheme expands on demand;
- D1.1 persistent 3D workbench remains intact.

Verification:
- branch: `feat/d1-2-left-work-panel`;
- stacked DRAFT PR: #25, base `feat/d1-1-desktop-workbench`;
- final head: `a238a0139e1bc56f060aa6852c2111cb3159d52a`;
- CI `36376182141`: **SUCCESS**;
- 17/17 test files, 161/161 tests: **PASS**;
- build + desktop/mobile/Client browser smoke: **PASS**;
- dedicated desktop visual `d12-left-work-panel.png`: inspected, no D1.2 blocker found;
- Pages deploy `36376277933`: **SUCCESS** from exact head;
- permanent preview: `https://traqnivanov.github.io/ivanov-remonti-3d/`.

**NEXT: Owner reviews D1.2 on live preview. Do not begin D1.3 and do not merge PR #25 without a separate Owner decision.**

