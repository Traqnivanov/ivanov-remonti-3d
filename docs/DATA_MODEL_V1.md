# DATA MODEL v1 — Ivanov Remonti Smart Offer

**Status:** OWNER-APPROVED CURRENT TECHNICAL BASELINE  
**Purpose:** define the minimum persistent/data structure needed for the product without overbuilding the database.  
**Governance:** this is a living technical baseline and may be revised through audit/impact review.

---

## 1. Core principle

The product has one canonical working project, explicit published offer revisions, and a separate temporary viewer session.

Do not mix:

- editable Work project data;
- immutable published offer data;
- temporary client camera/UI state.

The three layers are:

1. **Working Project State**
2. **Published Offer Revision**
3. **Viewer Session State**

---

## 2. Persistent data families

The current minimum persistent model is:

### 2.1 Work users

Purpose:
- identify authorized Ivanov Remonti Work App users;
- support future roles if needed.

Initial fields:
- `user_id` — UUID, linked to Supabase Auth;
- `display_name`;
- `role`;
- `created_at`;
- `updated_at`.

Initial role model may stay minimal.

Do not design a complex multi-company permission system before there is a real requirement.

---

### 2.2 Projects

Purpose:
- the canonical editable job/project container.

Recommended fields:
- `id` UUID;
- `project_code` human-safe internal code;
- `title`;
- `owner_user_id`;
- `status` — draft / active / archived;
- `schema_version`;
- `work_version`;
- `work_state` JSONB;
- `created_at`;
- `updated_at`.

Potential client metadata may exist in production, but real personal client data must not be committed to the public repository.

The browser scene is not the source of truth. `work_state` is persisted canonical project data.

---

## 3. Working Project State JSON

The early 3D/project document should remain structured and versioned.

Example shape:

```ts
type ProjectState = {
  schemaVersion: number
  projectId: string
  rooms: Room[]
  serviceAssignments: ServiceAssignment[]
  projectNotes: ProjectNote[]
  presentation: ProjectPresentation
}
```

### Room

```ts
type Room = {
  id: string
  name: string
  geometry: {
    lengthM: number
    widthM: number
    heightM: number
  }
  surfaces: Surface[]
  openings: Opening[]
  objects: SceneObject[]
  materials: MaterialAssignment[]
}
```

Every selectable/price-relevant entity has a stable ID.

Example IDs:

- `room-1.wall-front`
- `room-1.wall-back`
- `room-1.wall-left`
- `room-1.wall-right`
- `room-1.floor`
- `room-1.ceiling`
- `room-1.window-1`
- `room-1.outlet-1`

IDs survive camera changes, wall hiding and rendering changes.

---

## 4. Surfaces

Minimum surface model:

```ts
type Surface = {
  id: string
  kind: "wall" | "floor" | "ceiling"
  geometryRef: string
  hostRoomId: string
}
```

The exact rendered mesh is an implementation detail.

Quantity logic references domain surface IDs, not Three.js mesh identity.

---

## 5. Openings

Minimum opening model:

```ts
type Opening = {
  id: string
  kind: "door" | "window"
  hostSurfaceId: string
  widthM: number
  heightM: number
  sillM?: number
  offsetM: number
}
```

Openings are persistent geometry.

Whether an opening is deducted from a service quantity is decided by that service's quantity rule, not by one global net-area rule.

---

## 6. Scene objects

Minimum object model:

```ts
type SceneObject = {
  id: string
  kind: string
  hostEntityId?: string
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  dimensions?: { x: number; y: number; z: number }
  assetRef?: string
}
```

Examples:
- outlet;
- switch;
- light;
- radiator;
- sanitary object;
- furniture.

Work Mode can mutate them.

Client Mode may inspect them but not persist edits.

---

## 7. Service assignments

This is the bridge between offer and geometry.

```ts
type ServiceAssignment = {
  id: string
  serviceCode: string
  targetEntityIds: string[]
  included: boolean
  quantityRuleId: string
  quantityOverride?: {
    value: number
    reason: string
  }
  priceBookItemId?: string
  presentationMode:
    | "highlight"
    | "material"
    | "geometry"
    | "xray"
    | "object"
  clientInfo?: ClientInfo
  projectReason?: string
}
```

Important:
- `targetEntityIds` drive Offer → Model;
- reverse lookup drives Model → Offer;
- quantity is computed from domain geometry + approved rule;
- price is looked up from Price Book;
- presentation mode does not determine quantity.

---

## 8. Quantity result

Calculated results should have provenance.

```ts
type QuantityResult = {
  serviceAssignmentId: string
  ruleId: string
  ruleVersion: string
  unit: "m2" | "lm" | "pcs" | "point" | "set" | "fixed"
  value: number
  sourceEntityIds: string[]
  usedOverride: boolean
}
```

Future extensions can include assumptions/waste/material norms.

Do not calculate quantity from currently visible meshes.

---

## 9. Price Book

Relational persistence is preferred for Price Book because it must be queryable, versioned and protected.

### price_books

Recommended fields:
- `id`;
- `name`;
- `currency` — EUR;
- `version`;
- `status`;
- `created_at`;
- `activated_at`.

### price_book_items

Recommended fields:
- `id`;
- `price_book_id`;
- `service_code`;
- `label`;
- `unit`;
- `unit_price`;
- optional labor/material split later if actually needed;
- `active`;
- `metadata` JSONB.

Do not hardcode current business prices in Three.js or renderer code.

---

## 10. Working project history

Do not silently overwrite without version awareness.

Recommended early fields:
- `work_version` on project;
- optional `project_snapshots` table later when real recovery/history requires it.

Do not implement a full event-sourcing architecture at v1.

---

## 11. Published offers

A project can have one or more client offers over time.

### offers

Recommended fields:
- `id`;
- `project_id`;
- `offer_code`;
- `status` — active / closed / revoked;
- `access_mode` — link / link_pin;
- `access_token_hash`;
- `pin_hash` nullable;
- `expires_at` nullable;
- `revoked_at` nullable;
- `active_revision_id` nullable;
- `created_at`;
- `updated_at`.

Do not put client name/address into the URL token.

---

## 12. Published offer revisions

### offer_revisions

Recommended fields:
- `id`;
- `offer_id`;
- `revision_no`;
- `source_project_work_version`;
- `source_project_schema_version`;
- `presentation_payload` JSONB;
- `currency` — EUR;
- `total_amount`;
- `content_hash`;
- `published_by`;
- `published_at`.

A published revision is immutable application data.

If something changes, create a new revision.

Do not silently mutate Revision 1 into Revision 2.

---

## 13. Client presentation payload

The payload is a minimized, client-safe projection of one published revision.

Example:

```ts
type ClientOfferPayload = {
  offerCode: string
  revisionNo: number
  publishedAt: string
  currency: "EUR"
  rooms: PublishedRoomView[]
  offerItems: PublishedOfferItem[]
  totalAmount: number
  presentation: ClientPresentation
}
```

It may contain:
- geometry required for rendering;
- client-visible materials/objects;
- client-visible service rows;
- entity links;
- published quantity;
- unit price;
- line total;
- client Info.

It does not contain:
- full Price Book;
- formula engine;
- private notes;
- draft changes;
- other projects;
- privileged credentials.

---

## 14. Offer item snapshot

Published offer line data should be self-contained enough to preserve what the client saw.

Recommended shape:

```ts
type PublishedOfferItem = {
  id: string
  serviceCode: string
  label: string
  targetEntityIds: string[]
  quantity: number
  unit: string
  unitPrice: number
  lineTotal: number
  presentationMode: string
  clientInfo?: ClientInfo
  projectReason?: string
}
```

A future Price Book change must not retroactively alter an already published revision.

---

## 15. Client access

The access token in the URL should be high-entropy and opaque.

Server persistence:
- store a secure hash/verification representation;
- do not rely on sequential public IDs.

PIN:
- optional per offer;
- never stored as plaintext;
- server-validated;
- rate-limited.

Offer access can be revoked without deleting the offer history.

---

## 16. Assets

### assets

Recommended fields:
- `id`;
- `project_id`;
- `kind`;
- `storage_path`;
- `mime_type`;
- `checksum`;
- `visibility` — private / published;
- `created_by`;
- `created_at`.

Initial storage: Supabase Storage.

Published/private asset access must follow the client delivery contract.

---

## 17. Audit events

Do not build an analytics warehouse initially.

A small audit/event table may later record important actions:

- offer published;
- revision published;
- access revoked;
- token regenerated;
- PIN reset;
- client change request.

Avoid collecting unnecessary personal browsing data.

---

## 18. Viewer Session State

Viewer Session State is normally browser/session data, not business persistence.

Example:

```ts
type ViewerSessionState = {
  activeRoomId: string
  selectedServiceId?: string
  selectedEntityId?: string
  hiddenEntityIds: string[]
  autoCutaway: boolean
  xray: boolean
  camera: CameraState
  infoOpen: boolean
}
```

This state must never affect:
- project geometry;
- scope;
- quantities;
- prices;
- published revision content.

---

## 19. RLS / capability intent

Exact SQL policies are implemented later, but the model must support:

### Work user
Can read/write authorized Work projects and Work data.

### Client access endpoint
Does not grant broad database access.

It returns only the validated published client payload for one offer/revision.

Client Browser must not receive a generic ability to query all offers/projects.

---

## 20. Migration rule

Every persisted project document stores `schema_version`.

When the project model changes:

**read old version → migrate → validate → persist new version intentionally**

Do not break old saved projects because TypeScript types changed.

---

## 21. What is deliberately NOT designed yet

Not locked yet:
- stable client link always pointing to latest published revision vs revision-specific links;
- multi-company/multi-tenant billing;
- client accounts;
- payment/signature workflow;
- full event sourcing;
- large analytics;
- collaborative editing;
- automatic conflict merging.

These are not required for the first vertical slices.

---

## 22. Acceptance criteria

Data model v1 is healthy if:

1. stable geometry/entity IDs exist;
2. renderer is not source of truth;
3. service ↔ geometry is explicit;
4. quantity provenance exists;
5. Price Book is separate from geometry/rendering;
6. Published Revision preserves quantity/price shown to client;
7. client payload is minimized;
8. client viewer state cannot mutate business data;
9. project documents are schema-versioned;
10. the model remains simple enough to change as the product evolves.
