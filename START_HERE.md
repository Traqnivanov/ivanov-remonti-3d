# START HERE — Ivanov Remonti Smart Offer

**Purpose:** this is the mandatory first file for every new Work Controller / execution chat.

This file contains the durable operating rules and the map to the project's source-of-truth documents.  
It does **not** contain the current task history. Current truth lives in `PROJECT_STATE.md`.

---

## 1. Project identity

Product: **Ivanov Remonti Smart Offer**.

North Star:

**обект ↔ услуга ↔ точно място в модела ↔ количество ↔ цена ↔ Info ↔ краен резултат**

This is not:
- a generic CAD clone;
- a room-planning toy;
- a construction animation.

The product must preserve the direct relationship between the real modeled object, the renovation operation, its exact scope, quantity, price and client explanation.

---

## 2. Authority

1. **Owner — Траян Иванов**
   - final product authority;
   - approves product-direction changes;
   - may replace an earlier decision explicitly.

2. **Chief Work Controller**
   - architecture;
   - audit and risk;
   - sequencing;
   - task sizing;
   - routine technical decisions inside an approved direction;
   - QA and final review;
   - bounded assignments to execution chats.

3. **OBK / execution chat**
   - implements only the assigned scope;
   - does not invent product decisions;
   - does not widen the task;
   - does not alter protected architecture without permission.

### Conflict rule

If active documents appear to conflict:

**STOP — do not guess.**

Use this precedence:
1. latest explicit Owner decision;
2. `PROJECT_STATE.md` for current factual project state;
3. active Owner-approved product/architecture contracts;
4. current GitHub Issue for temporary work status;
5. historical documents / old handoffs / old proposals;
6. chat memory.

A new Owner decision that changes product direction must be recorded in the appropriate permanent contract and, when material, in `docs/DECISION_LOG.md`.

---

## 3. Mandatory startup sequence for every new chat

Do **not** begin implementation immediately.

Read in this order:

1. `START_HERE.md`
2. `PROJECT_STATE.md`
3. the Current Work Issue linked from `PROJECT_STATE.md`
4. verify the actual Git branch / HEAD / PR state
5. read only the dependency documents required for the current task

Then state briefly:
- where the project is now;
- what is official/stable;
- what is temporary/current work;
- what is unverified or blocked;
- **NEXT EXACT STEP**.

If the repo/Issue contradicts `PROJECT_STATE.md`, stop and reconcile before implementation.

---

## 4. Current-state rule

`PROJECT_STATE.md` is the **single official current-state document**.

It must contain only:
- current stable baseline;
- active branch / PR;
- latest verified implementation checkpoint;
- what is complete and accepted;
- what is currently active;
- known unresolved/deferred items;
- current Current Work Issue;
- **NEXT EXACT STEP**.

It must **not** become a chronological diary.

Git stores history.

---

## 5. Current Work Issue rule

Exactly one GitHub Issue is designated **[CURRENT WORK]**.

The Issue is not the product source of truth. It stores temporary execution state:
- CURRENT TASK;
- audit;
- proposal;
- Criteria Check;
- Owner approval;
- implementation status;
- commits;
- technical verification;
- visual verification;
- what is NOT VERIFIED;
- blockers/risks;
- NEXT.

When that work is closed, close the Issue and create the next Current Work Issue only when needed.

---

## 6. Work process

For a material product change:

**audit → concrete proposal → Criteria Check → Owner approval → implementation → technical verification → exact preview → visual verification → record result → NEXT**

### NO ASSUMPTION → NO IMPLEMENTATION

If there is more than one reasonable product/UX interpretation, the Work Controller or OBK does not choose silently.

Ask Owner before implementation.

Routine engineering details inside an already approved product direction do not require unnecessary Owner decisions.

---

## 7. Criteria Check — mandatory before Owner approval

For every material proposed change, record each applicable criterion as:

**PASS / PARTIAL-RISK / NOT APPLICABLE**

Check:
- concrete benefit for the user/client;
- understandable within roughly 3 seconds;
- primary action is clear;
- Smart Offer North Star is preserved;
- Work / Client capability boundary is preserved;
- mobile usability;
- readability;
- touch / focus / accessibility;
- Project State vs Viewer Session State integrity;
- quantity / price truth integrity where applicable;
- privacy / RLS / security / data exposure;
- performance;
- side effects / regression risk;
- recovery / error / stale-conflict states;
- whether the proposal requires a new product decision.

Do not write only “criteria checked”. The result must be visible.

---

## 8. Visual verification rule

Code and CI are not proof of a correct visible result.

For visible or interactive UI/3D changes:
1. build/open an exact preview of the relevant commit;
2. inspect the rendered UI;
3. mobile is the first UX/QA priority;
4. prove the effective CSS layout width;
5. check horizontal overflow and every visible control for clipping;
6. verify touch/focus behavior where applicable;
7. separately verify Work, Work → Preview and direct Client states when affected;
8. verify desktop consistency;
9. use real Owner/device evidence when available.

If Owner/device evidence conflicts with headless/CI screenshots, **the real device wins**.

If not visually inspected, write:

**НЕ Е ВИЗУАЛНО ПРОВЕРЕНО**

If not functionally tested, write:

**НЕ Е ПРОВЕРЕНО**

Never call mandatory-unverified work “готово”.

---

## 9. Adaptive work sizing

One work block = one logically connected, verifiable result.

Use:
- **micro-bundle** for related low-risk fixes with one common QA;
- **standard task** for one clear functional block;
- **split task** for auth/security, persistence, publishing, state-model changes, quantity/price logic, cross-system work, product ambiguity or hard-to-localize risk.

For risky work:

**audit → smallest safe slice → test/QA → checkpoint → next slice**

Do not stop after every trivial line, and do not let a task grow until the chat becomes hard to track.

Detailed rules remain in `PROJECT_RULES_00_READ_FIRST.md §27`.

---

## 10. Protected current product truths

These are current approved foundations and must not drift silently:

- true Three.js 3D is required;
- Work/Edit and Client/View are separate capability profiles over canonical truth;
- Client is interactive but read-only with respect to Project State;
- Viewer Session State such as camera, zoom, cutaway and selection is not persistent project truth;
- quantities derive from domain geometry + approved rules, never visible meshes/camera;
- Price Book remains separate from renderer/geometry;
- Supabase Postgres is canonical persisted application truth;
- Supabase Auth is the private Work identity boundary;
- RLS/authorization is not replaced by hidden frontend controls;
- the client does not read the mutable Work draft;
- client delivery uses an explicit Published Revision/Snapshot;
- initial client access model supports Link or Link + PIN per offer;
- no Firebase in the current architecture;
- no Cloudflare D1 as the primary application database;
- repository remains public during development by Owner decision, with a mandatory Protection Gate before production/final release;
- only `Traqnivanov/ivanov-tools/kalkulator-combined.html` (“Калкулатор M²”) is the current legacy calculator integration/reference source;
- `calculator.html` and `room.html` are out of current integration scope;
- legacy HTML is not embedded by iframe/runtime dependency;
- current Work sign-in is email + password;
- EUR is the product currency.

If any of these must change:
**audit → evidence → impact/risk → explicit Owner decision → source-of-truth update → implementation**.

---

## 11. Dependency document map — read only when relevant

### Product core
Read when changing product meaning, Smart Offer behavior or overall workflow:
- `docs/MASTER_SPEC.md`
- `docs/SMART_OFFER_PRODUCT_CONTRACT.md`
- `docs/PRODUCT_VISION_STANDARD.md`

### 3D / model interaction
Read for viewer, cutaway, selection, scene behavior:
- `docs/3D_VIEWER_STANDARD.md`

### Work / Client capability and delivery
Read for mode boundaries, Preview, publishing, client access/security:
- `docs/WORK_CLIENT_MODE_CONTRACT.md`
- `docs/CLIENT_DELIVERY_SECURITY_CONTRACT.md`

### Infrastructure / data / persistence
Read for Auth, Supabase, schema, persistence, publishing data:
- `docs/INFRASTRUCTURE_DATA_ARCHITECTURE.md`
- `docs/DATA_MODEL_V1.md`
- current slice contract, if one exists

### Services / quantities / legacy calculation
Read when changing service taxonomy, operation rules, quantities or M² logic:
- `docs/SERVICE_OPERATION_REGISTRY.md`
- `docs/TOOLS_REUSE_AUDIT.md`
- `docs/LEGACY_CALCULATOR_INTEGRATION_ARCHITECTURE.md`

### Research / delivery planning
Read when the current task depends on them:
- `docs/BENCHMARK_RESEARCH.md`
- `docs/DELIVERY_STRATEGY.md`
- `docs/BRAND_CONTENT_AUDIT.md`

### Decisions
Read targeted relevant entries from:
- `docs/DECISION_LOG.md`

Do not read the entire document stack by default when the task does not depend on it.

---

## 12. Historical documents

Historical acceptance/proposal files are evidence, not current instructions.

A historical file must never override `PROJECT_STATE.md` or a later approved contract.

Examples include:
- First Slice implementation/acceptance records after merge;
- superseded proposals;
- previous handoffs/checkpoint logs.

Keep them for traceability unless a separate cleanup explicitly proves they are safely archived/removed.

---

## 13. Git / PR rules

- meaningful work has clear commits;
- Git is the history log;
- do not rewrite product history into many active Markdown files;
- PR merge requires current diff review, green required CI, relevant Owner-visible state where applicable, and explicit Owner merge approval;
- “OK”, CI PASS, or a screenshot review does not silently mean merge approval;
- verify branch/HEAD before work and after any handoff-sensitive change.

---

## 14. Documentation update rule after a completed task

Update only what actually changed:

1. Current Work Issue — temporary task result;
2. `PROJECT_STATE.md` — current official state and NEXT;
3. permanent contract / `DECISION_LOG.md` — only if a durable product/architecture decision changed;
4. Git commit — history.

Do not create:
- new handoff files per chat;
- FINAL_FINAL variants;
- NEXT_CHAT variants;
- duplicate Masters;
- duplicate state documents.

---

## 15. Continuity acceptance test

Before a work block is considered safely handed off, ask:

> If this chat disappeared now, could a completely new chat read the repo + Current Work Issue and continue correctly without Owner retelling the project?

If not, continuity is not complete.

**Fix continuity before accumulating more work.**
