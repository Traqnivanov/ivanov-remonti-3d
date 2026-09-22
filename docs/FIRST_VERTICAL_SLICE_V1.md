# FIRST REAL VERTICAL SLICE v1 — Ivanov Remonti Smart Offer

**Status:** OWNER-APPROVED NEXT IMPLEMENTATION TARGET  
**Purpose:** prove the core Smart Offer mechanism end-to-end before building the full application.

---

## 1. Goal

The first implementation must prove the smallest real chain:

**real 3D room → exact entity → service assignment → quantity → Price Book result → offer row → client interaction**

It must not become a broad room planner.

---

## 2. Scope

Build one rectangular room with real Three.js geometry.

Required room elements:
- four walls;
- floor;
- ceiling;
- stable IDs;
- orbit/zoom;
- reset view;
- manual wall/ceiling visibility;
- automatic cutaway toggle.

One real service is enough to prove the chain.

Recommended first service:

**Фина шпакловка**

Reason:
- easy surface target;
- quantity can be audited from geometry;
- useful Info;
- strong Offer → Model / Model → Offer proof;
- no fake material effect is required.

Use highlight + Info for this first service.

---

## 3. Minimal Work Mode

The first Work screen only needs what is required for the proof.

Allow:
- room length;
- room width;
- room height;
- select one or more wall surfaces;
- assign Fine Putty service;
- see calculated m²;
- attach one Price Book fixture/item;
- see line total;
- client Info;
- Preview as Client.

Do not add yet:
- furniture library;
- bathrooms;
- full electrical editor;
- photo AI;
- full materials catalog;
- accounts;
- share links;
- PDF;
- large settings area.

---

## 4. Minimal Client Preview

Preview as Client must use the same viewer behavior intended for the future client application.

Required:
- real 3D room;
- service row;
- click service → exact target wall(s) highlight;
- unrelated geometry may de-emphasize;
- click wall → linked service row is emphasized;
- Info opens in context;
- quantity visible;
- unit price visible;
- line total visible;
- **Виж целия резултат** exits focus mode;
- cutaway remains usable while service is selected.

No edit controls.

---

## 5. Quantity rule

For the first proof, implement one explicitly testable wall-area quantity rule.

The rule must use domain geometry.

Do not use rendered mesh visibility.

Required tests:
- wall visible → quantity X;
- same wall hidden → quantity still X;
- camera moved → quantity still X;
- service target changed → quantity changes only because target changed.

If an opening is not included in the first slice, do not pretend opening deduction is solved.

Opening deduction is a later audited rule.

---

## 6. Price rule

Price comes from a Price Book abstraction.

For the local proof:
- use a clearly marked DEV/TEST Price Book fixture;
- never treat the fixture as production truth;
- keep price lookup outside the renderer;
- EUR only.

Calculation:

**quantity × unit price = line total**

The exact fixture value is irrelevant to acceptance; architecture is what matters.

---

## 7. Info

Use one client Info object with the approved structure:

- Какво е
- Защо се прави
- Какво получавате
- Какво включва тази позиция
- Защо е включено тук — only if an explicit test project note exists

The first implementation may use short fixture text clearly marked for prototype use until source content is ported through the approved content process.

---

## 8. Project state

Use the new Data Model v1 contract.

Minimum persisted-in-memory/local project state:
- schema version;
- project ID;
- room;
- surfaces;
- service assignment;
- quantity result;
- price reference;
- presentation state.

Do not connect Supabase in the first code commit unless persistence is required to prove the core mechanism.

---

## 9. Technical stack

- Vite;
- TypeScript strict;
- Three.js;
- test runner suitable for pure calculation/domain tests;
- no service worker;
- no Firebase;
- no auth;
- no production backend;
- no client share link yet.

Keep:
- domain state;
- quantity/price logic;
- renderer;
- Work UI;
- Client Preview

logically separated.

---

## 10. Suggested package boundary

Initial practical structure:

```
apps/
  work/

packages/
  domain/
  calculation-core/
  3d-viewer/
  client-offer-ui/
```

A separate `apps/viewer/` becomes necessary when the protected Client Viewer slice begins.

Do not create infrastructure folders that contain no real code just to match a future diagram.

---

## 11. Acceptance tests

The vertical slice is accepted only if all of the following work:

### 3D
- room is true 3D;
- orbit/zoom works comfortably;
- wall/ceiling visibility works;
- auto cutaway can be enabled/disabled;
- no floating child artifacts for the implemented geometry.

### Offer → Model
- click Fine Putty offer row;
- correct wall(s) highlight;
- quantity/price/Info stay synchronized.

### Model → Offer
- click a linked wall;
- Fine Putty row is emphasized/shown.

### Integrity
- hiding wall does not change quantity;
- camera does not change quantity;
- price is not stored on mesh/material;
- changing selected service presentation does not change quantity.

### Work vs Client
- Work controls exist only in Work UI;
- Preview as Client has no authoring controls;
- same project state feeds both.

### Quality
- no console errors;
- strict TypeScript passes;
- calculation tests pass;
- manual visual QA is performed before acceptance.

---

## 12. Explicit non-goals

The first vertical slice does not include:
- Supabase persistence;
- authentication;
- Cloudflare deployment;
- Link/PIN;
- Published Revision;
- Storage;
- PDF;
- client acceptance/signature;
- full Price Book;
- multiple complex services;
- photo reconstruction.

These are deliberately deferred until the core mechanism is proven.

---

## 13. What follows after acceptance

### Slice 2 — Persistence
- Supabase project persistence;
- schema migrations;
- Work Auth;
- safe Save/Open.

### Slice 3 — Publishing
- Published Revision creation;
- client-safe payload;
- Link / Link + PIN;
- separate Client Viewer app.

### Slice 4 — Complete room offer
- multiple services;
- multiple surfaces;
- openings;
- operation-specific quantity rules;
- fuller client Info.

Then expand objects, materials, advanced services and realism.

---

## 14. Stop rule

If the first slice reveals that:
- interaction is confusing;
- data model is wrong;
- cutaway is unstable;
- quantity architecture is coupled to rendering;
- Work/Client separation is awkward;

stop and correct the foundation before adding features.

The purpose of the first slice is to expose mistakes cheaply.
