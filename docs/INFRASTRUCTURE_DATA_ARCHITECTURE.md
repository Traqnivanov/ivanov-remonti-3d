# INFRASTRUCTURE & DATA ARCHITECTURE v1 — Ivanov Remonti Smart Offer

**Status:** OWNER-APPROVED CURRENT ARCHITECTURE  
**Purpose:** define where the application, data, files, business logic and client delivery live.  
**Governance:** this is the current best architecture, not an irreversible decision. It may be replaced through the Living Product review process if a better solution is demonstrated.

---

## 1. Architecture decision

Current approved stack:

- **GitHub** — source code and version control.
- **Cloudflare** — domains, delivery/hosting edge and security layer.
- **Supabase Postgres** — canonical persistent application database.
- **Supabase Auth** — authentication for Work App users.
- **Supabase Storage** — initial storage for project photos, textures and supported project assets.
- **Supabase server-side functions / protected backend operations** — publishing, access validation and other business-critical operations where client exposure is not appropriate.
- **No Firebase** in the current architecture.
- **No Cloudflare D1 as the primary application database** in the current architecture.
- **Cloudflare R2 is optional later**, only if asset scale/cost/performance creates a concrete reason to introduce it.

Do not add a second backend/database without a demonstrated need.

---

## 2. Two separate web applications

The product is logically and build-wise separated into two surfaces.

### A. Work App

Private authoring application for Ivanov Remonti.

Recommended namespace:

**app.ivanov-remonti.com**

Contains:
- project creation/editing;
- geometry authoring;
- object placement;
- materials;
- services;
- quantity logic;
- Price Book;
- prices;
- internal notes;
- client Info preparation;
- Preview as Client;
- publish/revision controls;
- Link / Link + PIN controls;
- access revoke/regenerate controls.

### B. Client Smart Offer Viewer

Read-only client application.

Recommended namespace:

**offer.ivanov-remonti.com**

Contains only:
- published Smart Offer data;
- true interactive 3D;
- room navigation;
- cutaway/wall visibility;
- service ↔ model interaction;
- client Info;
- published quantities/prices/totals;
- final-result view;
- later approved client actions.

The Client Viewer must not be the Work App with hidden buttons.

---

## 3. Source layout direction

Recommended repository/application structure:

```
apps/
  work/
  viewer/

packages/
  domain-types/
  3d-viewer-core/
  shared-ui-tokens/

backend/
  publishing/
  client-access/
  pricing/
  quantity/
```

This is an architectural direction, not a requirement that every folder exists on day one.

Critical rule:
- reusable rendering/domain code may be shared;
- authoring capability must not be shipped merely because the viewer shares 3D code;
- client build should exclude Work-only modules wherever practical.

---

## 4. Canonical data source

**Supabase Postgres is the application source of truth.**

The renderer is not the database.

The browser's current scene is not the database.

Local state may support responsiveness/offline drafts later, but persisted project truth is server-backed and versioned.

Core data families should include, as the product requires them:

- Work users / roles;
- projects;
- project metadata;
- current working project state;
- rooms/surfaces/openings/objects;
- service assignments;
- client-facing Info;
- Price Book;
- Price Book versions;
- quantity/pricing results;
- published offer revisions;
- offer access configuration;
- access tokens;
- PIN hash/settings;
- assets;
- audit/history events.

The first implementation may use a pragmatic combination of relational columns and versioned JSONB for complex project state. Do not create dozens of tables before the real workflow proves they are needed.

---

## 5. Project state strategy

The application must keep one canonical working project.

Recommended early model:

**project metadata + versioned project JSONB + relational records for business-critical entities that require querying, permissions or history.**

Good candidates for relational treatment from the beginning:
- projects;
- users/roles;
- Price Book entries/versions;
- published offer revisions;
- offer access;
- audit events.

3D geometry/state can initially remain a versioned structured project document, provided:
- it has stable entity IDs;
- migrations are supported;
- quantities/prices are not derived from visible mesh state;
- schema version is stored.

---

## 6. Published Revision is the approved client publishing model

**Owner-approved current rule:** the client does not read the live working project.

Publishing creates an explicit Smart Offer revision/snapshot.

Flow:

**Working Project → Preview as Client → Publish Revision 1 → Client sees Revision 1**

Later:

**Edit Working Project → Preview → Publish Revision 2 → Client sees published Revision 2 according to the approved access workflow**

Consequences:
- unfinished Work edits never leak automatically to the client;
- a sent price/scope is traceable;
- revisions can be audited;
- older published states are not silently overwritten;
- Work App remains free to continue editing after publication.

Exact UX for whether one stable client link advances to the newest published revision or whether revisions receive separate links is a later product decision. Do not assume it silently.

---

## 7. Publish pipeline

Publishing must be a server-controlled operation.

Target flow:

1. Work App loads the working project.
2. Ivanov Remonti runs **Preview as Client**.
3. Owner chooses access:
   - Link;
   - Link + PIN.
4. Owner selects **Publish**.
5. Server validates required project/offer data.
6. Quantity/pricing results required for the offer are finalized from approved rules.
7. System creates an immutable published offer revision.
8. System generates a minimized client presentation payload.
9. System generates/updates protected client access.
10. Client Viewer reads only that published client payload.

Client payload must not be the full editable Work project unless a specific technical reason is reviewed and approved.

---

## 8. Supabase responsibilities

### Postgres
Stores persistent business/project data.

### Auth
Initial use:
- authenticate Ivanov Remonti Work App users;
- enforce Work access.

Client offer access does not require a normal client account in the approved initial model.

### Storage
Initial home for:
- project photos;
- reference photos;
- textures;
- uploaded materials;
- generated previews;
- supported 3D/project assets.

Private assets should use access-controlled delivery where appropriate.

### Server-side protected operations
Use server-side functions/backend operations for:
- offer publication;
- revision creation;
- access-token handling;
- PIN verification;
- sanitized client payload creation;
- sensitive pricing/quantity operations where practical;
- privileged writes;
- audit events.

Never put privileged/service secrets in either frontend bundle.

---

## 9. Cloudflare responsibilities

Cloudflare is the outer delivery/security layer, not the business database.

Use it as appropriate for:
- DNS;
- web application delivery/hosting;
- TLS;
- CDN/static asset delivery;
- edge protection;
- rate limiting/security controls;
- later production hardening.

Potential tools such as Workers/Pages/Turnstile/WAF may be used when the concrete implementation needs them.

Do not add Cloudflare D1 merely because Cloudflare is already in the stack.

---

## 10. Storage scaling rule

Start with **Supabase Storage**.

Do not introduce Cloudflare R2 at foundation stage unless there is a measured reason.

A later R2 migration/addition can be considered for:
- high asset volume;
- bandwidth/cost pressure;
- specific asset-delivery requirements.

Avoid dual-storage complexity without evidence.

---

## 11. Why Firebase is excluded

Firebase is not part of the approved current architecture.

Reason:
- Supabase already covers the required database/auth/storage/backend role;
- introducing Firebase creates a second security model, data model and operational dependency without a demonstrated product benefit.

If a future capability genuinely requires Firebase, it must go through:
**problem → evidence → architecture impact → Owner decision**.

---

## 12. Client data minimization

The Client Viewer receives only what that published offer needs.

Allowed examples:
- published geometry needed to render;
- published materials/objects;
- published service rows;
- linked entity IDs;
- published quantities;
- published unit prices/totals;
- client-facing Info;
- revision metadata;
- viewer presentation settings.

Do not send:
- entire Price Book;
- quantity formula definitions;
- internal pricing rules;
- private Work notes;
- draft/unpublished changes;
- other projects;
- admin state;
- secrets;
- database credentials;
- unused proprietary libraries/data.

---

## 13. Access model

Per published offer Owner chooses:

### Link
Opaque, high-entropy protected link.

### Link + PIN
Same protected link plus server-validated PIN.

Required capabilities:
- revoke access;
- regenerate token;
- reset PIN;
- switch access mode;
- rate-limit PIN failures.

PIN is stored only as a suitable hash/verification form, not plaintext.

---

## 14. Security boundary

Browser code is never trusted as the authorization boundary.

Required principle:

**UI capability + server/data capability must agree.**

Examples:
- hiding “Edit price” is not security;
- Client Viewer has no authorized mutation path for price;
- Link/PIN validation happens server-side;
- privileged database operations use protected server credentials only;
- RLS/authorization policies protect persistent data.

---

## 15. Development repository policy

Current Owner decision remains:

- GitHub repository stays PUBLIC during development;
- no real client personal data;
- no secrets/API keys;
- no production credentials.

Before production/final release the mandatory Protection Gate reviews:
- repository/source privacy strategy;
- production secrets;
- production database access;
- source maps;
- client access protection;
- deployment artifacts;
- sensitive asset access.

---

## 16. First implementation principle

Do not provision the entire future infrastructure before the first vertical slice needs it.

Build in this order:

**local application skeleton → project state contract → first 3D/Smart Offer vertical slice → persistence → Work authentication → publish revision → protected Client Viewer**

Infrastructure is introduced when it supports a proven workflow, not as infrastructure for its own sake.

---

## 17. Acceptance criteria

Architecture remains acceptable if:

1. there is one canonical persistent project truth;
2. Work App and Client Viewer are separate capability surfaces;
3. Client Viewer cannot mutate Work project state;
4. published client offers are explicit revisions, not live drafts;
5. internal Price Book/formulas remain private where practical;
6. no frontend contains privileged secrets;
7. client payload is minimized;
8. Link/PIN is server-enforced;
9. Supabase is the primary application backend;
10. Cloudflare is delivery/security, not a duplicate primary database;
11. Firebase is not introduced without a demonstrated new requirement;
12. Storage starts simple with Supabase Storage;
13. the architecture can evolve through the Living Product rule.

---

## 18. Current architecture summary

```
GitHub
  └─ source/version control

Cloudflare
  ├─ app.ivanov-remonti.com   → Work App
  ├─ offer.ivanov-remonti.com → Client Viewer
  └─ DNS / delivery / edge security

Supabase
  ├─ Postgres  → project/business source of truth
  ├─ Auth      → Work App identity/access
  ├─ Storage   → project images/textures/assets
  └─ Protected server operations
       ├─ publishing
       ├─ revisions
       ├─ Link/PIN access
       └─ sanitized client payload

Client
  └─ receives only published read-only Smart Offer data
```

This is the approved current best architecture.
