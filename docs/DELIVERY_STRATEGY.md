# DELIVERY STRATEGY — HOW TO MAKE THE FULL VISION ACHIEVABLE

**Status:** foundation decision candidate
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

## 2. Critical simplification: we do NOT animate the worker doing the operation

The visualizer does not need to simulate a trowel spreading putty, a roller painting a wall or sandpaper physically removing material.

For the professional/client purpose we visualize the resulting state after each operation.

Example wall state stack:
1. existing surface;
2. plaster/base correction;
3. gypsum/repair layer;
4. fine skim coat;
5. sanded surface;
6. primed surface;
7. painted surface;
8. installed switches/outlets;
9. furniture/lighting/final room.

This gives the client the visual progression without building a construction-game simulation.

## 3. How each type of renovation work is drawn

### A. Surface operations
Used for plaster, gypsum putty, fine putty, primer, paint, decorative plaster, waterproofing and tile finish.

Implementation principle: surface geometry + operation stack + material state.

The same wall geometry remains the source of truth. Operations change its rendered material/state.

Examples:
- plaster: mineral texture + appropriate roughness and optional visible thickness;
- gypsum/fine skim: progressively smoother light mineral surface;
- sanding: same surface becomes smoother/cleaner, not a fake new object;
- primer: separate technical state, visually subtle;
- paint: real selected color + finish/roughness;
- decorative plaster: PBR texture/normal/roughness at real scale;
- tiles: generated tile grid/material with real tile dimensions and joints.

### B. Layer/assembly operations
Used for drywall, insulation, partition walls, suspended ceilings, niches and service boxes.

These DO use real geometry layers: frame → insulation → board → joint treatment → finish.
The user can switch stages and see inside the construction when needed.

### C. Linear operations
Used for LED niches, cornices, baseboards, reveals and pipes/cable routes.
These are paths with a real length and profile. The same path provides 3D geometry, linear meters and pricing quantity.

### D. Point/object operations
Used for outlets, switches, lights, plumbing points, radiators, sanitary ware and furniture.
They are objects with position, mounting height, rotation, dimensions, attachment surface and optional price.
The user moves them with drag-and-drop or exact numeric values.

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

Before building a whole apartment, prove the complete chain on one wall.

### Proof Wall v1
Inputs: wall width and height, one optional door/window, optional photo/reference.

Editable objects: one outlet, one switch, one light/reference object.

Operations: existing, plaster, gypsum putty, fine putty, sanding, primer, paint.

Outputs: visual stage switching, exact net m², quantity per selected operation, Price Book lookup, total EUR price and client before/after image.

If this works correctly, the architecture is proven.

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

A feature is preferred when it crosses the full chain: geometry → operation → visual state → quantity → price → client output.

Bad milestone: build 70 material shaders.
Good milestone: one wall can receive fine putty, show the correct state, calculate its m², calculate material/labor and appear in the quote.

This ensures the project becomes useful early.

## 11. Definition of useful MVP

The MVP does NOT need AI reconstruction.

It is useful when the user can:
1. create one real rectangular room from dimensions;
2. add/move doors and windows;
3. select surfaces;
4. add renovation operations in correct order;
5. see each stage;
6. apply paint/material;
7. add/move outlets, switches, lights and basic furniture;
8. calculate m² / linear meters / pieces;
9. price labor from Price Book;
10. export a clear client view and price breakdown.

## 12. Risk control

Biggest technical risks are photo reconstruction accuracy, photoreal quality on weak devices, asset library quality, complex non-rectangular geometry and keeping quantity calculations correct while geometry changes.

These risks are delayed until the base editor and quantity model are stable.

## 13. Time-control principle

We do not define success as all imagined features finished. We define checkpoints that can be used on real projects.

If a phase takes too long without creating a usable workflow, scope is reduced before adding more features.

## 14. Locked architectural idea

The application has four independent cores:
1. Geometry Core — rooms, surfaces, openings, objects.
2. Renovation Layer Engine — ordered construction/finish operations.
3. Quantity & Price Core — m², lm, pieces, norms, Price Book.
4. Renderer — editor visualization and client-quality output.

This separation is what keeps the full vision feasible.