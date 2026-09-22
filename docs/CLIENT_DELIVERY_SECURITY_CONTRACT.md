# CLIENT DELIVERY & IP PROTECTION CONTRACT v1 — Ivanov Remonti Smart Offer

**Status:** OWNER-APPROVED PRODUCT DIRECTION  
**Purpose:** define how a Smart Offer reaches the client without sending the Work App, and how the product minimizes exposure of private logic, pricing, formulas, project data and intellectual property.

---

## 1. Core delivery rule

Ivanov Remonti never sends the editing software/project editor to the client.

The client receives only a **controlled web viewer for one specific Smart Offer**.

Core flow:

**Private Work App → prepare offer → publish client view → protected client link → read-only Smart Offer Viewer**

The client opens the offer in a browser.

No installation is required.

No editable project file is transferred to the client.

---

## 2. Two separate product surfaces

### A. Private Work App

For Ivanov Remonti only.

Contains:
- project authoring;
- geometry editing;
- objects;
- materials;
- services;
- quantity engine;
- Price Book;
- formulas;
- internal notes;
- offer preparation;
- revision/publish controls;
- access/security controls.

Recommended deployment namespace:

**app.ivanov-remonti.com**

Exact hosting/domain decision is implementation work, not locked infrastructure yet.

### B. Client Smart Offer Viewer

For the client.

Contains only what is needed to understand the published offer:
- 3D room/model;
- cutaway;
- service ↔ model interaction;
- client Info;
- quantities;
- approved prices/totals;
- final result;
- approved before/after;
- approved export/share actions later.

Recommended deployment namespace:

**offer.ivanov-remonti.com**

The Client Viewer must not contain authoring UI or Work App capabilities.

---

## 3. Access mode is chosen per offer by Ivanov Remonti

Work Mode must have a clear client-access control.

### Access Mode A — Secure Link

Ivanov Remonti generates one opaque, high-entropy client link.

Example concept:

`offer.ivanov-remonti.com/o/<random-token>`

Rules:
- token must not contain client name, phone, address or predictable project ID;
- token must not be sequential;
- possession of the link grants read-only access while the offer is active;
- Owner can revoke/regenerate the link.

### Access Mode B — Secure Link + PIN

Same secure link, plus a PIN gate.

Rules:
- PIN is chosen/generated from Work Mode;
- PIN is never stored in plain text server-side;
- failed PIN attempts are rate-limited;
- Owner can reset the PIN;
- Owner can switch an offer between Link and Link + PIN.

### Owner control

The Work App must expose a simple control equivalent to:

**Достъп до офертата**
- Link
- Link + PIN

Ivanov Remonti decides which mode is appropriate for each client.

This is an Owner-locked product rule.

---

## 4. Optional access controls

These are allowed product capabilities and can be enabled as the system matures:

- revoke access immediately;
- regenerate access link;
- reset PIN;
- optional expiry date;
- manually disable/enable an offer;
- view last-access / basic audit information;
- optional client-specific watermark;
- optional offer validity date.

The product should not force unnecessary friction for every client.

Security level is chosen according to the offer/client.

---

## 5. Client receives a presentation payload, not the full working project

The client viewer must receive the minimum data needed to display the published offer.

Client-visible data may include:
- published room geometry needed for rendering;
- published materials needed for rendering;
- published objects;
- client-visible services;
- linked surface/object IDs;
- published quantities;
- published unit prices and totals;
- client-facing Info;
- offer/revision metadata;
- presentation rules.

The client must NOT receive:
- full Price Book;
- internal pricing history;
- unreleased prices;
- internal formula definitions unless technically unavoidable;
- quantity-engine implementation;
- private project notes;
- hidden service options;
- complete asset library;
- other clients/projects;
- Work App permissions;
- admin/debug state;
- secret keys;
- database credentials;
- internal API credentials.

Principle:

**Send only what the client must see. Keep the business core private.**

---

## 6. Sensitive logic stays outside the public client bundle where practical

Business-critical logic should not be shipped to the Client Viewer if it can remain private.

Keep server/private where practical:
- Price Book management;
- quantity calculation rules;
- formula provenance;
- pricing rules;
- discounts/rate logic;
- offer publishing;
- access control;
- revision history;
- internal service registry management;
- admin functions.

The Client Viewer can receive the approved results required for display.

3D rendering and interaction necessarily run partly in the browser. Therefore no design may pretend that all client-side code can be hidden.

---

## 7. Frontend exposure — realistic rule

Any browser-based viewer sends frontend code and render data to the client device.

Therefore:

- do not claim that JavaScript can be made impossible to inspect;
- minification/obfuscation may slow casual copying but is not primary security;
- disabling right-click or DevTools is not accepted as a security mechanism;
- production source maps should not be publicly exposed unless intentionally required;
- secrets must never be embedded in frontend code.

We protect the valuable core by architecture, not by cosmetic blocking.

---

## 8. Client offer pages are private-by-design

Client offer pages should use privacy-oriented delivery rules:

- no public directory/list of offers;
- opaque offer token;
- `noindex` / no search-engine indexing;
- no public sitemap entry;
- no client name/address in URL;
- no predictable IDs;
- private/no-store caching strategy for sensitive offer responses where appropriate;
- restrictive referrer policy where appropriate;
- Content Security Policy appropriate to the final architecture;
- server-side authorization/access checks for protected data;
- rate limiting for PIN/access endpoints;
- signed/controlled asset access where private assets require it.

Exact headers/infrastructure are implementation decisions and must be tested.

---

## 9. Offer identity and anti-copy traceability

Every client offer should retain visible Ivanov Remonti identity.

Recommended visible elements:
- Ivanov Remonti brand;
- unique offer number;
- offer/revision number;
- issue/publish date;
- optional subtle viewing watermark;
- copyright / usage notice.

A screenshot cannot be technically prevented.

The goal is that copied material clearly retains provenance and that the underlying Work App/business logic is not included.

Optional watermark modes may later include:
- offer number only;
- offer number + client initials;
- stronger watermark for sensitive projects.

Privacy impact must be considered before putting full client identity on visible watermarks.

---

## 10. Licensing and legal protection layer

The technical system should support an explicit **view-only client license / Terms of Use** for the Smart Offer.

The intended business rule is:
- the client receives permission to view the offer for the purpose of evaluating/accepting the renovation proposal;
- no license to reproduce, resell, reverse engineer, redistribute or commercialize the software/design system is granted;
- Ivanov Remonti retains ownership of the application, brand assets and proprietary system.

This document defines product intent only.

**Before public launch, final legal wording must be reviewed for the relevant jurisdiction by a qualified legal professional.**

Do not treat UI text alone as complete legal protection.

---

## 11. Protection of the idea vs protection of implementation

The product must be realistic about IP protection.

We cannot guarantee that nobody will ever imitate the visible idea.

What we can protect strongly:
- source code;
- private authoring workflow;
- formula/quantity engine;
- Price Book;
- internal service model;
- unpublished product logic;
- project/customer data;
- private assets;
- brand;
- published offer provenance;
- access to the Work App.

Product strategy:

**Expose the client experience. Protect the engine behind it.**

The defensible advantage is not only one visual feature. It is the complete integrated mechanism, brand, data, workflow, implementation quality and continued development.

---

## 12. Ivanov Unique — Client Experience + Protected Core

From this point forward, every client-facing feature must be checked against two questions:

### Client Experience
Does it make the Smart Offer clearer, more impressive, more useful or more natural for the client?

### Protected Core
Can we deliver that experience without unnecessarily exposing:
- authoring logic;
- formulas;
- prices not meant for this client;
- internal project data;
- reusable business logic;
- other customers' data;
- proprietary Work App functionality?

A feature is stronger when it improves the client experience **and** keeps the internal system private.

This is part of the Ivanov Unique Standard.

---

## 13. Smart Offer client lifecycle

Target client lifecycle:

1. Ivanov Remonti creates/edits the project in Work Mode.
2. Ivanov Remonti previews exactly what the client will see.
3. Ivanov Remonti chooses access:
   - Link; or
   - Link + PIN.
4. Ivanov Remonti publishes the client offer.
5. System creates a protected client access link.
6. Client opens the branded Smart Offer Viewer.
7. Client explores:
   - rooms;
   - 3D;
   - cutaway;
   - services;
   - Info;
   - quantities;
   - prices;
   - final result.
8. Client cannot author the project.
9. Client can later send a change request/comment if that feature is approved.
10. Ivanov Remonti can revoke/replace client access.

Whether publication is a live view or immutable revision is governed by the separate publishing decision below.

---

## 14. Publishing revision model — pending final Owner lock

Two technical models remain possible:

### Live project publication
The client always sees the current working state.

Risk:
- unfinished edits or changed prices may become visible unintentionally.

### Published revision/snapshot
The client sees only an explicitly published offer revision.

Example:

**Working Project → Publish Revision 1 → Client sees Revision 1**

Later:

**Edit Working Project → Publish Revision 2 → Client sees Revision 2**

Work Controller recommendation remains **Published Revision/Snapshot** because it protects both Ivanov Remonti and the client from accidental post-send changes.

This stays marked as pending until Owner explicitly locks it.

---

## 15. Repository/source protection — Owner-approved development policy

Repository:

`Traqnivanov/ivanov-remonti-3d`

remains **PUBLIC during development by explicit Owner decision**.

This is a deliberate temporary development policy, not the final production security model.

### During development
- public repo is allowed;
- no secrets/API keys;
- no real client personal data;
- no production credentials;
- no assumption that repository contents are private.

### Protection Gate before production/final release

Before the finished program is released for real client use, repository/source protection becomes mandatory.

The gate must review and complete the approved final protection strategy, including:
- making implementation source private or another Owner-approved private source strategy;
- production access controls;
- client-view security;
- secret scanning/rotation;
- public source-map exposure;
- sensitive data exposure;
- deployment artifacts.

The final source-protection action is not performed early because Owner explicitly wants the repo to remain public while the program is being created.

---

## 16. Security non-negotiables

Never:
- put API/database secrets in frontend code;
- expose admin tokens to Client Mode;
- trust client-side hidden buttons as authorization;
- use predictable offer IDs as access control;
- include other-client data in client payloads;
- send the editable Work project to the client;
- use public client pages as storage for private Work data;
- claim screenshots can be technically prevented;
- claim minification equals IP protection;
- publish proprietary source unintentionally through deployment artifacts.

---

## 17. Acceptance criteria

Client delivery/security is not ready unless:

1. Work App is not sent to the client;
2. client access is read-only;
3. Owner can choose Link or Link + PIN per offer;
4. access can be revoked;
5. token is opaque/non-predictable;
6. PIN protection is server-enforced;
7. client payload is minimized;
8. Price Book/internal formulas remain private where practical;
9. other clients' data cannot be accessed;
10. viewer interactions do not mutate the project;
11. brand/offer provenance remains visible;
12. client pages are not publicly indexed;
13. no secrets are shipped in frontend;
14. legal usage terms are prepared before public production launch;
15. repository/source exposure has been deliberately decided before proprietary implementation.

---

## 18. North Star

The client should feel:

**“Получих не просто оферта. Получих защитен интерактивен преглед на точно моя ремонт.”**

Ivanov Remonti should retain:

**control of the editor, the logic, the data, the prices, the publishing and the access.**
