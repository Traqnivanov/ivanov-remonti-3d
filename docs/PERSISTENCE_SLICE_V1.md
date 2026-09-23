# PERSISTENCE SLICE v1 — Ivanov Remonti Smart Offer

**Status:** CURRENT TECHNICAL CONTRACT — P2.3b AUTHORIZATION BOUNDARY COMPLETE / SIGN-IN METHOD DECISION NEXT  
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
