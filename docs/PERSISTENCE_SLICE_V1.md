# PERSISTENCE SLICE v1 — Ivanov Remonti Smart Offer

**Status:** CURRENT TECHNICAL CONTRACT — P2.4c SAVE CODE PASS / P2.4c-LIVE OPTIMISTIC CONCURRENCY VERIFICATION NEXT  
**Repo:** `Traqnivanov/ivanov-remonti-3d`  
**Working branch:** `feat/persistence-slice-v1`  
**Base:** merged First Vertical Slice on `main`  
**Supabase project:** `ivanov-remonti-3d`  
**Supabase project ref:** `qjfpbxucrxrtpygusnuv`  
**Region:** `eu-west-1`  
**Initial database state at audit:** empty `public` schema, no migrations.

## 1. Goal

Slice 2 proves a reliable persistent Work flow without expanding into publishing or a complete room editor:

**authorized Work user → create/open project → edit canonical project state → save → reload → same project truth**

The slice must add persistence without breaking the First Slice invariants:

- one canonical project/domain truth;
- stable entity IDs;
- renderer is not persistence truth;
- viewer session state is not project state;
- quantity and price do not derive from visible meshes;
- Client/Preview remains read-only;
- no secrets in frontend or repository.

## 2. Scope

Included:

1. Supabase Auth for the private Work App.
2. Minimum persistent database schema for Work users and projects.
3. Versioned persisted project document.
4. Schema migration boundary in TypeScript.
5. Reliable Create / Save / Open.
6. Optimistic concurrency through `work_version`.
7. RLS and explicit grants.
8. Tests for round-trip persistence, migrations, authorization boundaries and stale-write rejection.

Not included:

- Published Revisions;
- client links / PIN;
- standalone protected Client Viewer;
- production Price Book;
- Storage assets;
- doors/windows or opening deductions;
- multiple service families;
- autosave as a product promise;
- collaboration / live multi-user editing;
- full history/event sourcing.

Those remain later slices unless Owner explicitly changes sequence.

## 3. Supabase boundary

The new Supabase project is dedicated to this product. Other Supabase projects must not be used or modified for this slice.

Current project:
- name: `ivanov-remonti-3d`;
- ref: `qjfpbxucrxrtpygusnuv`;
- status at creation/audit: `ACTIVE_HEALTHY`;
- Data API enabled;
- schema/RLS/grants will be created only by reviewed migrations;
- migration must explicitly normalize/revoke default `anon`/`authenticated` table grants and then grant only the minimum required privileges, rather than relying on Dashboard defaults.

Database password, secret keys and privileged credentials never enter GitHub, docs or browser bundles.

## 4. Minimum relational schema

### 4.1 `work_users`

Purpose: explicit allow-list for authorized Work App users.

Minimum fields:

- `user_id uuid primary key references auth.users(id)`;
- `display_name text`;
- `role text`;
- `active boolean not null default true`;
- `created_at timestamptz not null default now()`;
- `updated_at timestamptz not null default now()`.

Initial role model stays minimal. Do not build a company/team permission system yet.

### 4.2 `projects`

Purpose: canonical editable project container.

Minimum fields:

- `id uuid primary key default gen_random_uuid()`;
- `title text not null`;
- `owner_user_id uuid not null references auth.users(id)`;
- `status text not null default 'draft'`;
- `schema_version integer not null`;
- `work_version bigint not null default 1`;
- `work_state jsonb not null`;
- `created_at timestamptz not null default now()`;
- `updated_at timestamptz not null default now()`.

Allowed initial status values:
- `draft`;
- `active`;
- `archived`.

No physical delete workflow is required in this slice. Archive is enough.

`project_code` is intentionally deferred until its human-facing format is actually needed. Do not invent a code format during persistence work.

## 5. Persisted Project v1

Do not persist the current prototype object shape as the permanent contract.

The persisted document starts with the generalized shape already defined by `DATA_MODEL_V1`:

```ts
type PersistedProjectV1 = {
  schemaVersion: 1
  projectId: string
  rooms: PersistedRoomV1[]
  serviceAssignments: PersistedServiceAssignmentV1[]
  projectNotes: ProjectNoteV1[]
  presentation: ProjectPresentationV1
}
```

For the current UI this may contain exactly:
- one room;
- one Fine Putty assignment.

But persistence must not encode “there can only ever be one room/one service” into the contract.

The implementation may use adapters between the present First Slice domain model and `PersistedProjectV1` while preserving visible behavior.

## 6. Schema migration rule

There is one explicit current project schema version in code.

Required boundary:

```ts
parseAndMigrateProjectState(raw: unknown): CurrentPersistedProject
```

Rules:

1. validate unknown persisted input;
2. read `schemaVersion`;
3. migrate sequentially version-by-version;
4. reject unsupported future versions;
5. never silently guess missing critical geometry/service data;
6. preserve stable entity IDs;
7. return only the current validated shape.

The `projects.schema_version` column and `work_state.schemaVersion` must be written consistently.

Database migrations and project-document migrations are separate concepts:
- Supabase migrations change database schema;
- project migrations change stored `work_state` document shape.

Do not mix them.

## 7. Save concurrency contract

A save must not silently overwrite a newer edit.

Each loaded project carries its current `work_version`.

Save uses optimistic concurrency:

1. client loads project at version N;
2. client submits new state with expected version N;
3. update is allowed only where:
   - project id matches;
   - authenticated owner matches;
   - `work_version = N`;
4. successful save writes state and increments to N+1;
5. if no row matches, treat as a stale-write conflict;
6. do not silently retry over a newer version.

This can be implemented with a filtered atomic Postgres update; a larger locking/collaboration system is not required.

## 8. Auth and authorization contract

The Work App is private.

Initial security rule:
- no anonymous Work access;
- no public self-service Work signup as a product feature;
- only authenticated, authorized `work_users` may access persisted projects.

Exact visible sign-in method (for example password vs magic link) is a small UX decision and must not be guessed if implementation reaches that UI before it is already settled.

Authorization is database-enforced, not just hidden UI.

## 9. RLS / grants contract

Do not rely on Dashboard/default privilege behavior. Keep access explicit in the migration.

Before table-specific grants, explicitly revoke unintended default access from `anon` and `authenticated`, then grant only the operations required below.

For `work_users`:
- RLS enabled;
- authenticated user may read only their own allow-list row;
- normal frontend cannot create or elevate Work users.

For `projects`:
- RLS enabled;
- `anon` receives no project read/write access;
- authenticated users receive only the minimum required table privileges;
- SELECT only owned projects and only for active authorized Work users;
- INSERT only with `owner_user_id = auth.uid()` and authorized Work membership;
- UPDATE only owned projects and authorized Work membership;
- DELETE not granted in Slice 2.

Use `TO authenticated` policies and indexed ownership columns.

No service/secret key is shipped to the browser.

## 10. Create / Open / Save behavior

Backend contract:

### Create
- authenticated authorized Work user creates a project;
- Work repository generates a UUID before serialization/insert, so `projects.id` and `work_state.projectId` are identical from the first write;
- the database still has a UUID default as a defensive fallback, but normal Create sends the explicit project UUID;
- initial persisted state is created through the current serializer;
- `work_version = 1`.

### Open
- fetch only a project the current user is allowed to access;
- run `parseAndMigrateProjectState`;
- if invalid/unsupported, fail visibly instead of fabricating data;
- load into canonical Work state;
- viewer derives from that state.

### Save
- serialize canonical Work state;
- validate before sending;
- write with expected `work_version`;
- receive incremented version;
- stale-write conflict is surfaced and does not overwrite server state.

Exact visible button placement and autosave policy are not locked by this technical contract.

## 11. Viewer/session exclusion

Never persist as project truth:
- camera position;
- zoom;
- currently hidden wall;
- temporary cutaway state;
- selected surface/service;
- open Info panel;
- other transient viewer/session state.

A reload may reset those without changing the project.

## 12. Acceptance gates

Slice 2 cannot close unless all applicable checks pass:

1. unauthenticated user cannot read/write Work projects;
2. authorized user cannot read/write another owner's project;
3. project can be created, saved, page-reloaded and reopened with equivalent canonical state;
4. stable entity IDs survive round trip;
5. quantity/result for the current Fine Putty proof is unchanged after save/open;
6. save increments `work_version`;
7. stale save is rejected;
8. invalid or unsupported project schema is not silently accepted;
9. viewer session changes do not dirty persistent project state;
10. no privileged Supabase credential appears in browser bundle or repository;
11. CI/typecheck/tests pass;
12. any visible Auth/Save/Open UI passes mobile-first QA and desktop consistency review.

## 13. Implementation sequence

Use adaptive work sizing. Do not implement all of Slice 2 in one task.

### P2.1 — Persistence domain boundary
- define `PersistedProjectV1`;
- serializer/deserializer;
- migration/validation boundary;
- tests;
- no Supabase write yet.

### P2.2 — Database foundation
- reviewed migration for `work_users` + `projects`;
- constraints/indexes/updated timestamp handling;
- explicit grants;
- RLS;
- security verification.

### P2.3 — Supabase client + Work Auth boundary
- publishable client configuration;
- authenticated Work gate;
- authorized `work_users` check;
- no public authoring access.

### P2.4 — Project repository
- create/list/open/save;
- optimistic `work_version`;
- conflict handling;
- repository tests where practical.

### P2.5 — Minimal Work UI integration
- create/open/save the existing project;
- keep Preview/Client read-only;
- no unrelated redesign.

### P2.6 — Slice acceptance
- functional QA;
- RLS/security checks;
- reload/round-trip tests;
- mobile-first visible QA;
- documentation + PR gate.

## 14. Risk controls

Primary risks and controls:

- **Prototype schema becomes permanent by accident** → generalized persisted schema + adapter boundary.
- **Lost updates** → optimistic `work_version`.
- **Frontend-only security** → RLS + explicit grants.
- **Schema drift** → migration files + project document versioning.
- **Scope explosion** → no Publishing, Price Book, Storage or Complete Room in this slice.
- **Secret leakage** → publishable key only in browser; secrets never committed.
- **Cross-project contamination** → dedicated Supabase project only.

## 15. Exact next implementation gate

P2.1 is complete at commit `b598f62917c21766e1021763b6b151084a51a186`.

Verified:
- generalized `PersistedProjectV1`;
- serializer;
- strict validation/parser boundary;
- unsupported schema rejection;
- runtime adapter for the current First Slice subset;
- stable ID round trip;
- persisted/runtime data detachment;
- strict typecheck PASS;
- tests PASS;
- build PASS;
- browser smoke PASS;
- PR CI run #131 SUCCESS.

Supabase schema remains untouched.

P2.2a is complete:
- migration draft exists at `supabase/migrations/20260923163000_persistence_foundation.sql`;
- includes `work_users`, `projects`, constraints, indexes and updated timestamp handling;
- migration has NOT been applied to Supabase.

P2.2b is complete:
- current Supabase default privileges were audited;
- browser roles are explicitly revoked before minimum grants;
- future postgres-created public tables/sequences/functions default private for browser roles;
- service_role is explicitly allowed for protected server work and is never browser-shipped;
- RLS is enabled on both tables;
- `work_users` exposes only the active authenticated user's own allow-list row;
- `projects` SELECT/INSERT/UPDATE require ownership + active Work authorization;
- no DELETE grant/policy exists in Slice 2;
- Auth-user deletion is restricted so persisted project ownership cannot cascade away;
- project UUID creation contract is consistent with the JSONB `projectId` constraint;
- migration remains unapplied.

P2.2c is complete:
- the reviewed `persistence_foundation` migration was applied to Supabase project `qjfpbxucrxrtpygusnuv`;
- Supabase returned `success: true`;
- no Auth/UI/Save/Open work was added in the same task.

P2.2d is complete — PASS.

Verified against the live Supabase database:
- `public.work_users` and `public.projects` exist with the expected columns;
- primary keys and both foreign keys exist with `ON DELETE RESTRICT`;
- project JSONB/schema/version/status/title constraints exist;
- ownership/status indexes exist;
- both `updated_at` triggers exist and are enabled;
- RLS is enabled on both tables;
- exactly the expected policies exist:
  - `work_users_select_self_active`;
  - `projects_select_own`;
  - `projects_insert_own`;
  - `projects_update_own`;
- `anon` has no Work table SELECT/INSERT privileges;
- `authenticated` has SELECT only on `work_users` and SELECT/INSERT/UPDATE on `projects`;
- `authenticated` has no `work_users` INSERT/UPDATE/DELETE and no project DELETE;
- `anon` / `authenticated` cannot CREATE objects in `public`;
- the internal `set_updated_at()` helper is not executable by browser roles;
- service role retains protected server privileges;
- migration history contains `persistence_foundation`;
- Supabase Security Advisor reports no security findings.

Performance Advisor reports only the two new project indexes as unused. This is expected at this checkpoint because both application tables contain zero rows and no Work repository traffic exists yet; it is not a removal signal.

No schema changes were made during P2.2d.

Next task is **P2.3 — Supabase client + Work Auth boundary**.
Keep it split into small tasks; do not combine Auth, project repository and visible Save/Open UI in one block.

No direct “click-create tables and fix later” workflow.


## 16. P2.3a checkpoint — Supabase client configuration

P2.3a is complete.

Implemented:
- official `@supabase/supabase-js` browser client dependency;
- locked dependency tree compatible with the Node 22 CI runtime;
- dedicated Work Supabase config module;
- hard guard that the configured URL targets only project ref `qjfpbxucrxrtpygusnuv`;
- hard guard that browser credentials use an `sb_publishable_` key format;
- no database password, secret key or service-role key is accepted by the browser config path;
- `apps/work/.env.example` contains placeholders only;
- Vite environment typing for the two allowed variables;
- unit tests for correct project, cross-project rejection, non-publishable-key rejection and client creation.

The real publishable key is intentionally not committed to the repository.

Verification:
- dependency install PASS;
- strict typecheck PASS;
- tests PASS;
- build PASS;
- browser smoke PASS;
- PR CI #154 SUCCESS.

No Auth UI, login method, Work-user authorization flow or project Save/Open repository was implemented in P2.3a.

Next task: **P2.3b — authenticated session + authorized Work-user boundary only**.
Do not combine it with visible login UI or P2.4 Save/Open.


## 17. P2.3b checkpoint — authenticated + authorized Work-user boundary

P2.3b is complete.

Implemented:
- `resolveWorkAccess(client)` as a non-UI authorization boundary;
- explicit states:
  - `signed-out`;
  - authenticated but `unauthorized`;
  - `authorized` active Work user;
- local session presence is checked first;
- authenticated identity is then verified with Supabase Auth `getUser()` before Work authorization;
- active Work access is resolved through `public.work_users`;
- lookup is constrained by authenticated user ID and `active = true`;
- database/session failures are surfaced as typed `WorkAuthBoundaryError` values instead of being hidden as signed-out/unauthorized;
- no Work user creation/elevation path exists in browser code.

Tests cover:
- signed-out path with no Work DB lookup;
- verified authorized Work user;
- authenticated user without active Work access;
- session read failure;
- unverified/invalid identity;
- Work authorization lookup failure.

Verification:
- strict typecheck PASS;
- tests PASS;
- build PASS;
- browser smoke PASS;
- PR CI #158 SUCCESS.

No visible Auth UI was added.
No sign-in method was chosen.
No `main.ts` integration was added.
No P2.4 project Save/Open work was started.

### Next gate

The technical Auth boundary now exists, but the visible sign-in method is intentionally unresolved.

Before visible Auth implementation, Owner must approve the sign-in experience. Reasonable initial options are:
- email + password;
- magic link / OTP email.

Do not guess this UX choice.

After the sign-in method is approved, implement only the minimal private Work sign-in entry; keep public signup disabled as a product flow.


## 18. P2.3c1 checkpoint — email/password sign-in logic

Owner selected **email + password** for the private Work sign-in.

P2.3c1 is complete.

Implemented:
- `signInWorkUser(client, credentials)`;
- email is trimmed before authentication;
- empty email/password are rejected before a Supabase call;
- Supabase Auth uses `signInWithPassword`;
- failed credentials/auth errors become a typed `WorkSignInError`;
- a nominal sign-in without a real user/session is rejected;
- after successful Auth, access is resolved through the already-proven P2.3b Work authorization boundary;
- successful Auth without an active `work_users` row remains `unauthorized`, not authorized by session alone;
- no `signUp` browser flow exists.

Tests cover:
- successful authorized sign-in;
- authenticated but unauthorized Work user;
- missing email;
- missing password;
- Supabase sign-in failure;
- incomplete sign-in response.

Verification:
- strict typecheck PASS;
- tests PASS;
- build PASS;
- browser smoke PASS;
- PR CI #163 SUCCESS.

No visible login UI was added.
No project Save/Open work was started.

Next task: **P2.3c2 — minimal private Work login UI + visual QA only**.


## 19. P2.3c2 checkpoint — private Work login UI

P2.3c2 is complete — PASS.

Implemented:
- minimal private Work login screen;
- email + password fields with correct browser autocomplete hints;
- no public registration action or language;
- submit is wired to the proven P2.3c1 sign-in logic;
- successful Auth still passes through the P2.3b active `work_users` authorization boundary;
- unauthorized accounts receive a clear access-denied state;
- configuration/bootstrap failure has a separate visible error state;
- direct Client Preview continues to bypass Work Auth as the current read-only First Slice proof;
- Work authoring is gated before the Work UI is rendered.

QA:
- mobile login layout checked at effective 360 CSS px;
- no horizontal overflow;
- inputs/button are not clipped and meet the 44 px minimum control height;
- desktop login inspected at 1440×900;
- Work, Owner Preview and direct Client regression smoke remain PASS;
- Controller visually inspected desktop login, mobile login, Work and Client screenshots;
- PR CI #171 SUCCESS.

CI uses a **development-only** QA authorization hook to preserve full Work regression coverage without committing a real credential. The hook is guarded by `import.meta.env.DEV`; it is not a production authorization path.

The real Supabase publishable key remains outside the repository.

### Next gate — P2.3d

Before P2.3 can close, perform a real live Auth verification:
1. provision the first Supabase Auth Work user;
2. add the matching active `work_users` allow-list row;
3. run one real email/password sign-in against the dedicated Supabase project;
4. verify authorized access and unauthorized/signed-out boundaries;
5. keep P2.4 Save/Open out of this task.


## 20. P2.3d checkpoint — live Auth verification

P2.3d is complete — PASS.

Live verification completed against the dedicated Supabase project:
- the first real Supabase Auth Work user was created;
- the final Auth user is mapped to exactly one active `work_users` row;
- allow-list row is `role = owner`, `active = true`;
- persistence preview workflow published successfully with repository variable `SUPABASE_PUBLISHABLE_KEY`;
- the preview build contains the correct project ref and a browser-safe publishable key path;
- no `service_role` credential is present in the browser bundle;
- Owner performed a real email/password sign-in in the published preview and entered the Work application successfully;
- signed-out behavior was exercised live because the private login screen was shown before authentication;
- unauthorized behavior remains covered by P2.3b/P2.3c1 tests and the live RLS/allow-list database boundary already verified in P2.2d; creating a second throwaway Auth account solely to repeat that branch live is intentionally not required.

A temporary password-recovery attempt exposed the project default redirect still pointing to localhost. This does not block the selected email+password login flow and is not part of Slice 2 Save/Open. Record it as a later Auth recovery configuration task before password recovery is exposed as a user-facing feature.

P2.3 is now complete:
- P2.3a client configuration — PASS;
- P2.3b authenticated + authorized Work-user boundary — PASS;
- P2.3c1 email/password sign-in logic — PASS;
- P2.3c2 private login UI + visual QA — PASS;
- P2.3d real live sign-in — PASS.

### Next gate — P2.4 Project repository

Split P2.4 into small checkpoints:
1. **P2.4a — repository contract + mocked unit tests only**;
2. **P2.4b — Create/List/Open live Supabase repository operations**;
3. **P2.4c — Save + optimistic `work_version` + stale-write conflict**;
4. **P2.4d — live repository verification**.

Do not add visible Create/Open/Save UI until P2.5.


## 21. P2.4a checkpoint — project repository contract

P2.4a is complete — PASS.

Implemented:
- Supabase-independent `ProjectRepository` port with:
  - `create`;
  - `list`;
  - `open`;
  - `save`;
- explicit repository DTOs:
  - `ProjectListItem`;
  - `OpenedProject`;
  - `CreateProjectInput`;
  - `SaveProjectInput`;
  - `SaveProjectResult`;
- typed `ProjectRepositoryError` contract including:
  - invalid input;
  - not found;
  - access denied;
  - stale write;
  - storage failure;
- `prepareNewProjectDraft()`:
  - normalizes title;
  - generates exactly one canonical project ID;
  - creates the current default Work state with that ID;
- `prepareSaveProject()`:
  - carries explicit expected `work_version`;
  - rejects invalid concurrency versions before repository I/O;
- `assertOpenedProjectContract()`:
  - requires metadata/project ID consistency;
  - requires current supported schema version;
  - requires positive safe `work_version`.

Mocked tests cover:
- generated project ID consistency;
- title validation;
- explicit expected version;
- invalid version rejection;
- opened project metadata/state consistency;
- ID mismatch rejection;
- full Create/List/Open/Save repository port shape without any Supabase dependency.

Verification:
- strict typecheck PASS;
- tests PASS;
- build PASS;
- browser regression smoke PASS;
- PR CI #179 SUCCESS.

No live `projects` rows were created in P2.4a.
No Supabase repository adapter exists yet.
No visible Create/Open/Save UI was added.

Next task: **P2.4b — live Supabase repository adapter for Create/List/Open only**.
Do not implement Save/stale-write handling until P2.4c.


## 22. P2.4b adapter checkpoint — code/tests PASS, live verification pending

The Supabase Create/List/Open adapter is implemented and mocked-test proven.

Implemented:
- authenticated-owner-scoped adapter factory;
- Create writes explicit project UUID, owner UUID, draft status, schema version, work version 1 and serialized canonical state;
- List reads metadata only and orders by latest update;
- Open reads one RLS-visible row and deserializes through the persistence boundary;
- RLS-hidden foreign rows remain indistinguishable from missing rows;
- malformed stored state fails instead of inventing project data;
- no Save implementation was added.

Verification:
- strict typecheck PASS;
- tests PASS;
- build PASS;
- browser regression smoke PASS;
- PR CI #183 SUCCESS.

No live project row has been created yet.

Next micro-task: **P2.4b-live — one bounded real Create → List → Open verification using the already authorized Owner session.**
This must not add product Create/Open UI and must not implement Save.


## 23. P2.4b live checkpoint — Create/List/Open

P2.4b is complete — PASS.

Verified with the real authorized Owner session and the live Supabase project:
- one bounded QA project was created;
- the same project appeared in `list()`;
- the same project was opened through `open()`;
- row id and persisted `work_state.projectId` round-tripped consistently;
- owner id matched the authenticated Owner;
- schema version = 1;
- work version = 1.

Live QA project:
- title: `QA — P2.4b Create List Open`;
- status: `draft`;
- work version: `1`.

The temporary `?repoqa=1` entry and its QA-only module/styles were removed immediately after the live check.
Post-cleanup CI #191 is SUCCESS:
- typecheck PASS;
- tests PASS;
- build PASS;
- browser smoke PASS.

No visible product Create/Open UI was added.
No Save implementation exists yet.

Next task: **P2.4c — Save + optimistic `work_version` + stale-write conflict only**.


## 24. P2.4c code checkpoint — Save + optimistic concurrency

P2.4c code is complete — PASS.

Implemented in the Supabase project repository adapter:
- `save(input)` writes only when all of the following match:
  - project id;
  - authenticated owner id;
  - expected `work_version`;
- successful save writes:
  - current schema version;
  - serialized canonical `work_state`;
  - `work_version = expected + 1`;
- successful save must return the same project id and exactly the expected next version;
- if update matches zero rows, a read-only version probe distinguishes:
  - hidden/missing row → `NOT_FOUND`;
  - newer visible version → `STALE_WRITE`;
  - same version but no update → `STORAGE_FAILURE` as an unexpected condition;
- mismatched row/project ids are rejected before repository I/O;
- invalid work versions are rejected;
- update failures are never reinterpreted as stale success.

Mocked tests cover:
- successful version N → N+1 save;
- explicit owner/id/version predicates;
- stale-write detection;
- missing/RLS-hidden project handling;
- unexpected same-version no-row save;
- storage failure;
- mismatched project id rejection.

Verification:
- strict typecheck PASS;
- tests PASS;
- build PASS;
- browser regression smoke PASS;
- PR CI #195 SUCCESS.

No live save was performed in this checkpoint.
The bounded QA project remains at `work_version = 1`.

Next micro-task: **P2.4c-live — one real save from version 1 → 2, then intentionally retry from stale version 1 and prove `STALE_WRITE`.**
No UI.
