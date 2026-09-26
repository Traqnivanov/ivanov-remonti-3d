# DELIVERY STRATEGY — HOW TO MAKE THE FULL VISION ACHIEVABLE

**Status:** OWNER-APPROVED FOUNDATION DIRECTION
**Goal:** prevent the project from becoming a one-year experiment before it becomes useful.

## 1. Feasibility assessment

The complete vision is achievable, but only if the application is built as a sequence of usable vertical slices.

The project becomes unnecessarily large if we try to solve at once:
- photo → perfect automatic 3D reconstruction;
- full CAD editing;
- every renovation operation;
- all materials;
- all furniture;
- photoreal rendering;
- quantity engine;
- price engine;
- PDF/quote;
- client sharing.

The correct approach is to make every completed phase already useful for a real Ivanov Remonti project.

## 2. Critical simplification: Smart Offer, not construction animation

The product does NOT simulate a worker physically applying putty, sanding, priming or painting.

The client interacts with the **offer position**, and the model answers:
- where the service applies;
- what it means;
- what quantity is included;
- what it costs;
- what visual result is relevant, if there is one.

This removes a huge amount of unnecessary simulation complexity while preserving the actual client value.

## 3. How services are presented

### A. Surface services
Plaster, gypsum/fine putty, primer, paint, decorative plaster, waterproofing, tiles.

Use:
- exact surface highlight;
- realistic material/result only where the difference is meaningful;
- quantity and price from the same geometry.

### B. Geometric/construction services
Drywall, partitions, suspended ceilings, niches, boxes.

Use real 3D geometry linked to quantities.

### C. Hidden systems
Insulation, profiles, plumbing and electrical routes.

Use x-ray/cutaway/transparent technical views when the client asks to inspect that service.

### D. Movable objects
Outlets, switches, lights, radiators, sanitary ware, doors, furniture.

Use reusable 3D objects with exact position/height/size.

### E. Low-visibility services
Sanding, primer and similar work.

Use zone highlight + quantity + price + short Info. Do not invent fake visual drama.

## 4. Visual quality strategy

The editor and the client image are two rendering targets.

### Editor quality
Must be fast, clear, dimensionally correct and easy to manipulate. It can use optimized models and textures.

### Client quality
Must aim for PBR materials, physically plausible lighting, contact shadows, high-quality textures, realistic object proportions, anti-aliasing, high-resolution output and an optional high-quality render pass.

This avoids making the everyday editor slow just to achieve a beautiful final image.

## 5. Asset strategy — we do not model the world by hand

We use a controlled asset system:
- parametric doors/windows;
- reusable outlets/switches;
- reusable lights;
- reusable radiators;
- reusable sanitary items;
- reusable furniture categories;
- GLB/GLTF import for richer objects;
- user-uploaded materials/textures.

Each asset definition can have multiple instances. A sofa, lamp or toilet is not redrawn for every project.

## 6. Photo-to-model is staged

### Phase P0 — Reference photo
Upload room photos and keep them inside the project as visual reference.

### Phase P1 — Assisted tracing
User creates/confirms walls, openings and known dimensions.

### Phase P2 — AI suggestions
System proposes walls/openings/objects from photos.

### Phase P3 — calibrated reconstruction
AI suggestions become editable geometry after at least one trusted real measurement.

### Phase P4 — quote-ready
Only confirmed geometry participates in automatic quantities and pricing.

This keeps the application useful before advanced AI is finished.

## 7. The first production proof must be deliberately small

Before building a whole apartment, prove the complete Smart Offer chain on **one wall**.

### Proof Wall v1

Inputs:
- wall width and height;
- one optional door/window;
- optional photo/reference.

Editable objects:
- one outlet;
- one switch;
- one light/reference object.

Offer positions:
- plaster;
- gypsum putty;
- fine putty;
- sanding;
- primer;
- paint.

Outputs:
- clicking an offer position highlights the exact target zone;
- clicking the wall shows linked offer positions;
- short ⓘ Info;
- exact net m²;
- quantity per selected operation;
- Price Book lookup;
- total EUR price;
- final client result.

If this works correctly, the core Smart Offer mechanism is proven.

## 8. Next vertical slice: one complete room

After Proof Wall:
- floor;
- ceiling;
- four walls;
- door/window openings;
- automatic cutaway;
- wall selection;
- same operation stack per surface;
- floor finish;
- outlets/switches/lights;
- furniture objects;
- room totals;
- client render.

This becomes the first genuinely useful version for day-to-day work.

## 9. Only then expand service families

Recommended order:
1. wall finishing;
2. drywall/insulation;
3. paint/materials;
4. floor finishes;
5. doors/windows/reveals;
6. electrical planning;
7. bathroom/tile/waterproofing;
8. plumbing;
9. ceilings/LED;
10. demolition/masonry;
11. advanced furniture/assets;
12. photo/AI automation.

The order can change by Owner decision, but we do not implement all families in parallel.

## 10. Development rule: vertical slices, not giant subsystems

A feature is preferred when it crosses the full chain:

**geometry → linked service → client presentation → quantity → price → Smart Offer**

Bad milestone:
- build 70 shaders;
- build every construction stage renderer;
- build a huge furniture library before the offer mechanism works.

Good milestone:
- one wall has a real offer position for fine putty;
- clicking the position highlights the correct wall;
- Info explains it;
- m² and price are correct;
- the position appears correctly in the client offer.

This ensures the project becomes useful early.

## 11. Definition of useful MVP

The MVP does NOT need AI reconstruction and does NOT need visual simulation of every construction process.

It is useful when the user can:

1. create one real rectangular room from dimensions;
2. add/move doors and windows;
3. select surfaces;
4. add real services to exact surfaces/objects;
5. click a service and see exactly where it applies;
6. click a model element and see linked offer positions;
7. open short service Info;
8. apply paint/material where relevant;
9. add/move outlets, switches, lights and basic furniture;
10. calculate m² / linear meters / pieces;
11. price labor from Price Book;
12. present a clear interactive Smart Offer to the client.

## 12. Risk control

Biggest technical risks are photo reconstruction accuracy, photoreal quality on weak devices, asset library quality, complex non-rectangular geometry and keeping quantity calculations correct while geometry changes.

These risks are delayed until the base editor and quantity model are stable.

## 13. Time-control principle

We do not define success as all imagined features finished. We define checkpoints that can be used on real projects.

If a phase takes too long without creating a usable workflow, scope is reduced before adding more features.

## 14. Locked architectural idea

The application has five independent cores:

1. **Geometry Core** — rooms, surfaces, openings, objects.
2. **Service Link Engine** — services linked to exact geometry/objects and client presentation mode.
3. **Quantity & Price Core** — m², lm, pieces, norms, Price Book.
4. **Renderer** — editor visualization and client-quality output.
5. **Smart Offer UI** — interactive client-facing offer with service ↔ model navigation and Info.

This separation is what keeps the full vision feasible and prevents the product from becoming a construction-animation project.



## 15. Owner-approved staged path after merged P3.2

**Approved 26.09.2026 after full source-of-truth / implementation-gap audit.**

The active staged direction from the current merged baseline is:

1. **P3.3 — Generic Operation Authoring Core**
   - remove proof-only assignment-specific coupling;
   - generic operation/quantity dispatch;
   - safe Work add/remove/include/target authoring;
   - Undo/Redo/change boundary before authoring expands;
   - prove the mechanism with one additional real operation from the Service Registry;
   - preserve backward compatibility and existing Fine Putty/Laminate/Openings behavior.

2. **P3.4 — Price Core + room/offer totals**
   - versioned real Price Book;
   - line totals and coherent room/offer totals;
   - historical quote-price safety;
   - audit `ivanov-tools/offer.html` as workflow reference before implementing matching quote concepts.

3. **P3.5 — Real wall/ceiling finishing stack**
   - separate real operations such as plaster, reinforced/base putty, gypsum putty, fine putty, sanding, primer and paint where supported;
   - ceiling becomes a real service target;
   - operation-specific opening deductions/dependencies;
   - Client Info comes from approved Ivanov Remonti service/guide sources.

4. **P3.6 — Object/Edit Core**
   - canonical movable objects and persistence;
   - outlets, switches, lighting, radiator and basic furniture proof;
   - position/size/height/attachment/lock;
   - drag/snap and edit behavior built on the safe Undo/Redo boundary.

5. **P3.7 — Materials + Colors + Images + Assets**
   - real paint color/palette flow;
   - intentional user-uploaded materials/textures and reference images;
   - scale/repeat/rotation/correction where required;
   - reusable material/asset library;
   - Supabase Storage as the approved initial asset-storage layer.

6. **P3.8 — Complete Room Result + acceptance**
   - close the approved one-complete-room direction end-to-end;
   - real services, finishes, core objects, quantities, Price Book/totals, Info, offer↔model interaction, Save/Open and coherent Client/Final Result;
   - mobile-first + desktop + persistence regression acceptance.

7. **P4 — Protected Publishing / real Client Viewer**
   - Published Revision/Snapshot;
   - minimized client payload;
   - separate protected read-only Client Viewer;
   - Link / Link + PIN and protected asset delivery.
   - This is after Complete Room under the current approved sequence; exact publishing UX decisions that remain open still require Owner approval.

8. **P5 — Broader service-family expansion**
   - drywall/insulation, reveals, electrical, bathroom/tile/waterproofing, plumbing, ceilings/LED, demolition/masonry and other approved registry families;
   - each new family enters through its real service source, exact target, quantity rule, price rule, Info and presentation mode;
   - do not parallel-build the catalog.

9. **P6 — Ivanov Office workflow integration/reuse**
   - inspect and reuse approved workflow knowledge from Offer / Clients / Contract / Advances when the matching Smart Offer capability is reached;
   - do not reuse old Firebase/localStorage architecture.

10. **P7 — Photo Assist**
    - reference → assisted tracing → AI suggestions → calibrated model → Quote Ready;
    - unconfirmed AI geometry never becomes quantity/price truth.

11. **P8 — Secondary client outputs / advanced capability**
    - PDF snapshot, high-quality/360 outputs, richer assets, advanced multi-room/geometry, approved automation and other later capabilities.

12. **Production Protection Gate**
    - repository/source protection;
    - credentials/security/RLS/client-access review;
    - asset/privacy checks;
    - production hardening before the product is called production-ready.

This roadmap is a **direction and dependency order, not an irreversible script**.

The global **Uniqueness Interrupt Gate** applies to every phase and checkpoint. If a materially better mechanism or sequencing is discovered, stop the affected scope, compare it against the approved baseline, run impact/risk review, obtain Owner approval when required, sync the source-of-truth, and only then continue.

Do not use the roadmap as permission to start later phases early or to bundle multiple independent systems into one task.
