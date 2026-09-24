# WORK / CLIENT MODE CONTRACT v1 — Ivanov Remonti Smart Offer

**Status:** OWNER-APPROVED PRODUCT DIRECTION  
**Purpose:** define exactly what Ivanov Remonti can edit and what the client can only inspect.  
**Rule:** Work Mode and Client Mode use the same project truth, but they do NOT expose the same capabilities.

---

## 1. Fundamental product split

The application has two clearly separated operating modes:

### A. Work / Edit Mode
For Ivanov Remonti.

Purpose:
- create the project;
- build and correct geometry;
- configure the renovation proposal;
- assign services;
- calculate quantities;
- set prices;
- prepare the final Smart Offer.

### B. Client / View Mode
For the client.

Purpose:
- inspect the already prepared proposal;
- understand what is included;
- see where each service applies;
- understand quantities and prices;
- inspect the final result in 3D.

The client does **not** receive the editor.

Core rule:

**Ivanov Remonti creates and edits.  
The client explores and understands.**

---

## 2. One project truth, two capability layers

Both modes must read from the same canonical project model.

The system must not maintain:
- one editable project;
- a separately retyped client offer;
- a second manually synchronized 3D model.

That would create mismatches.

Correct model:

**Project State → Work Mode**
  
**Project State → Client Smart Offer View**

The client view is a controlled read-only interpretation of the same project data.

---

## 3. Three different kinds of state

To avoid confusion, the application must distinguish:

### 3.1 Project State
Persistent project data.

Examples:
- rooms;
- wall dimensions;
- doors/windows;
- objects;
- materials;
- services;
- operation targets;
- quantities;
- prices;
- project notes;
- client-facing Info;
- final proposal.

Only Work Mode may change Project State.

### 3.2 Offer Presentation State
Rules that determine how the project is presented to the client.

Examples:
- which service rows are client-visible;
- service ordering/grouping;
- client labels;
- Info content;
- which visual presentation mode a service uses;
- before/after visibility.

This is prepared in Work Mode.

The client can view it but not edit it.

### 3.3 Viewer Session State
Temporary visual interaction while viewing.

Examples:
- camera position;
- zoom;
- current room;
- selected service;
- selected wall/object;
- hidden wall;
- hidden ceiling;
- auto-cutaway ON/OFF;
- X-ray currently open;
- Info panel open/closed.

Client Mode **may change Viewer Session State**, because this is only how the client is looking at the offer.

Changing Viewer Session State must never alter Project State, quantities or prices.

---

## 4. Work / Edit Mode capabilities

Work Mode may expose the full authoring toolset.

### Project
- create project;
- rename project;
- add/edit project/client metadata;
- Save/Open;
- duplicate/archive later if needed.

### Geometry
- create room;
- add/remove room;
- change width/length/height;
- irregular geometry later;
- add/move/resize doors and windows;
- exact numeric input;
- wall assignment;
- sill/height/position;
- snap;
- lock objects.

### Objects
- add/move/delete/duplicate:
  - outlets;
  - switches;
  - lights;
  - radiators;
  - doors;
  - sanitary ware;
  - furniture;
  - other supported objects.

### Materials / finishes
- select paint;
- select floor;
- select tiles;
- select decorative finish;
- upload/custom material;
- texture scale/rotation where supported.

### Services / operations
- add service;
- remove service;
- enable/disable;
- attach to exact target surfaces/objects;
- set scope;
- set project-specific note;
- set “why included here”;
- choose client presentation mode;
- order/group offer positions.

### Quantity / Price
- inspect calculated quantity;
- use approved manual override where allowed;
- choose unit;
- choose Price Book item;
- edit Price Book through the approved Price Book workflow;
- set labor/material treatment;
- apply explicitly approved discount/addition;
- inspect total.

### Technical inspection
- dimensions;
- guides;
- exact coordinates;
- technical layers;
- x-ray;
- hidden installations;
- formula/debug information where appropriate.

### Offer preparation
- preview Client Mode;
- choose which information is client-visible;
- verify final result;
- choose **Access: Link / Link + PIN** per offer;
- generate/reset PIN when PIN mode is used;
- revoke/regenerate client access;
- verify final result;
- publish/send/export the offer when those functions are implemented.

---

## 5. Client / View Mode capabilities

Client Mode is interactive but **read-only**.

The client may:

### 3D navigation
- rotate/orbit;
- zoom;
- reset useful view;
- change room;
- use approved preset views.

### Cutaway / visibility
- hide/show approved walls;
- hide/show ceiling;
- Show all;
- Auto wall removal ON/OFF;
- X-ray/cutaway where the offer exposes it.

These actions are Viewer Session State only.

### Smart Offer interaction
- click a service;
- see exact affected walls/zones/objects;
- click a wall/object;
- see linked offer positions;
- open ⓘ Info;
- see “What is it?”;
- see “Why is it needed?”;
- see “Why is it included here?” when a confirmed project note exists;
- see “What do you receive?”;
- see quantity;
- see unit price;
- see position total;
- see overall total;
- see final-result mode;
- inspect before/after where present.

### Optional future non-editing actions
If approved later:
- download PDF;
- open read-only share link;
- send a change request/comment.

A change request is communication, **not direct editing of the project**.

---

## 6. Client Mode forbidden capabilities

The client must not be able to:

- add/delete rooms;
- change room dimensions;
- move/resize walls;
- move/resize doors/windows as project edits;
- move technical objects as project edits;
- add/delete services;
- attach/detach services from surfaces;
- alter quantities;
- alter quantity formulas;
- alter unit prices;
- edit Price Book;
- edit discounts;
- edit totals;
- change project materials as committed project data;
- add/delete outlets, switches, lights, radiators or sanitary points;
- save authoring changes into the project;
- access technical/debug/admin controls.

Client Mode is not “Work Mode with a few buttons hidden”.

It is a distinct capability profile.

---

## 7. Security / architecture rule

Hiding editing buttons is not sufficient.

The application architecture must enforce mode capabilities.

Minimum design principle:

- mutating commands exist behind a capability/permission layer;
- Client Mode does not receive permission to execute authoring mutations;
- UI hides unavailable actions **and** the underlying mutation path rejects them.

For a later web-shared client link:
- read-only permission must also be enforced outside the visible UI;
- the client must not be able to mutate project data by calling an exposed write action directly.

Exact authentication/share-link implementation is a later technical decision.

---

## 8. Command model

A useful implementation direction is to separate:

### Read commands
Allowed in both modes:
- get project;
- get room;
- get service;
- get quantity;
- get price;
- get linked surfaces;
- get linked offer positions;
- get Info.

### View commands
Allowed in both modes:
- select entity;
- orbit;
- zoom;
- hide wall locally;
- show wall locally;
- set cutaway;
- open Info;
- set focus mode.

### Authoring commands
Work Mode only:
- create/update/delete room;
- update geometry;
- create/update/delete object;
- assign service;
- remove service;
- change quantity override;
- change pricing;
- change material;
- edit client-facing project content.

This separation should exist at domain/application level, not only in button visibility.

---

## 9. Client Focus Mode

When the client selects a service, the application should coordinate several view behaviors as one interaction:

1. service row becomes selected;
2. exact linked geometry is highlighted;
3. non-relevant geometry may be visually de-emphasized;
4. cutaway exposes the relevant area where practical;
5. quantity and price remain visible;
6. correct Info is opened or made immediately available;
7. rotating/zooming does not lose the service selection.

This is Viewer Session State and does not edit the offer.

Action **“Виж целия резултат”** exits Focus Mode and restores the complete proposal view.

---

## 10. Model → Offer interaction in Client Mode

When the client clicks a real surface/object, the offer should answer from the same project links.

Example:

**Дясна стена · 11.4 m²**

Linked positions:
- Машинна мазилка;
- Фина шпакловка;
- Шлайфане;
- Грунд;
- Боядисване;
- Контакти — 2 бр.

This is read-only inspection.

The client can navigate from the wall to a service and back without changing scope.

---

## 11. Work Mode preview of Client Mode

Work Mode must provide a reliable **Preview as Client** action.

Purpose:
- check exactly what the client will see;
- verify that no edit controls leak into Client Mode;
- verify service ↔ geometry links;
- verify Info;
- verify quantities/prices;
- verify cutaway;
- verify final result.

This preview should use the same Client Mode component/capability profile, not a separate mock implementation.

---

## 12. Visual separation between modes

### Work Mode should communicate:
- precision;
- editing;
- control;
- measurements;
- technical state.

### Client Mode should communicate:
- clarity;
- confidence;
- explanation;
- visual result;
- transparent price.

Client Mode must not look like a disabled editor.

It should feel intentionally designed for viewing.

---

## 13. Screen 01 implication

The approved Screen 01 direction is a **Client Smart Offer screen**.

Therefore it should NOT show authoring actions such as:
- Edit project;
- Add room;
- Move object;
- Change price;
- Save authoring project;
- Add/remove service.

Allowed Screen 01 controls include:
- room navigation;
- 3D orbit/zoom;
- wall/ceiling cutaway;
- service selection;
- surface/object selection;
- Info;
- quantity/price;
- final result;
- approved export/share actions later.

A separate Work/Edit screen or workspace will be designed for Ivanov Remonti.

---

## 14. Publishing model — OWNER-APPROVED CURRENT RULE

The earlier live-project vs published-snapshot question is resolved.

**Owner-approved rule:** the client does **not** read the mutable Working Project. Client delivery uses an explicit **Published Revision / Snapshot**.

Model:

**Working Project → Preview → Publish Revision 1 → Client sees Revision 1**

Later edits do not silently change that already published offer:

**Working Project changes → Preview → Publish Revision 2 → Client sees the newly published revision according to the approved access workflow**

This preserves professional quote/scope stability and provides an audit/history basis.

Still intentionally unresolved:
- whether one stable client link advances to the newest published revision;
- or whether each revision receives a revision-specific link.

That UX decision must not be assumed silently.

---

## 15. Acceptance criteria

The mode architecture is correct only if all of these are true:

1. one canonical project feeds both modes;
2. Work Mode can author the project;
3. Client Mode can inspect but cannot author;
4. client camera/cutaway interaction never modifies quantities or scope;
5. hiding edit buttons is not the only protection;
6. Preview as Client matches the actual client experience;
7. client service selection remains synchronized with 3D;
8. client model selection remains synchronized with the offer;
9. client cannot alter prices/quantities/services;
10. future share-link permissions can enforce read-only behavior technically.

---

## 16. Ivanov Unique criterion

The distinction should not feel like “admin vs user”.

The better product mechanism is:

**Work Mode builds the explanation.  
Client Mode makes the explanation interactive.**

Ivanov Remonti prepares:
- the exact geometry;
- the exact work;
- the reason;
- the quantity;
- the price;
- the result.

The client receives a clean environment where the room itself explains the offer.

## 17. Client delivery/security reference

Client Mode is delivered through a controlled web viewer, not by sending the Work App.

Owner chooses per offer:
- secure Link; or
- secure Link + PIN.

Detailed access, payload-minimization, source-protection and IP-protection rules are defined in:

`docs/CLIENT_DELIVERY_SECURITY_CONTRACT.md`.
