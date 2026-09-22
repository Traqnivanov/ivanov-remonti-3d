# 3D VIEWER STANDARD v1 — Ivanov Remonti Smart Offer

**Status:** OWNER-APPROVED PRODUCT DIRECTION  
**Scope:** mandatory behavior for the Smart Offer 3D viewer before implementation.

## 1. Core rule

The Smart Offer client experience is built around a **real interactive 3D room/model**.

It is not:
- a static image;
- a fake 2.5D perspective;
- a flat diagram;
- a slideshow replacing the room model.

The client must be able to inspect the proposal spatially and understand exactly where each quoted service applies.

## 2. Required 3D interaction

The viewer must support at minimum:

- orbit/rotate around the room;
- zoom;
- clear selection of walls, ceiling, floor, openings and objects;
- stable camera behavior;
- reset / return to a useful overall view;
- suitable preset views where they improve speed;
- mouse interaction first, with touch support planned for mobile.

The controls must be easier than CAD. A client should not need instructions to inspect the room.

## 3. Walls must be removable visually

Walls are real geometry and remain part of the project model.

Visibility is non-destructive.

Required manual controls:

- Left wall;
- Right wall;
- Front wall;
- Back wall;
- Ceiling;
- Show all.

Hiding a wall must never delete it or remove its measurements, services, quantities or pricing links.

## 4. Automatic cutaway

The viewer should automatically remove the surface that blocks the camera from seeing the interior.

Examples:

- camera moves behind the front wall → front wall is hidden;
- camera moves to the left exterior side → left wall is hidden;
- camera moves above the room → ceiling can be hidden.

The goal is that the client naturally sees inside the room without manually fighting the camera.

## 5. Manual control always wins

Automatic cutaway is assistance, not a restriction.

Required control:

**Auto wall removal: ON/OFF**

When automatic behavior is disabled, the manual visibility state remains under the user's control.

A later implementation may support a persistent **Section / Cutaway** mode where a chosen wall stays hidden regardless of camera position.

## 6. Ceiling visibility

The ceiling follows the same non-destructive rule as walls.

Required behavior:

- manual Ceiling show/hide;
- automatic hide from an appropriate top view;
- return when the camera/view no longer requires it;
- ceiling-linked services and quantities remain in the project even while hidden.

## 7. Child geometry follows its host surface

When a wall is visually hidden, the system must avoid floating artifacts.

Items visually owned by that wall may also need to hide with it, depending on the view:

- baseboards;
- wall finish meshes;
- reveals;
- trim;
- wall-mounted decorative layers;
- door/window frame parts that would otherwise float incorrectly.

However, the underlying objects and quote links are not deleted.

Objects that must remain visible for the selected service can be intentionally shown by the service presentation mode.

## 8. Smart Offer and cutaway work together

Cutaway exists to make the quoted work easier to understand.

Example:

1. client clicks **Фина шпакловка**;
2. linked walls are highlighted;
3. if one linked wall is behind the current camera obstruction, cutaway should expose the relevant surface where practical;
4. client can rotate the room while the service remains selected;
5. quantity, price and Info stay synchronized.

The service selection must not be lost merely because a wall becomes visually hidden.

## 9. Clicking the model

Selectable model entities need stable IDs.

Examples:

- room-1.wall-front;
- room-1.wall-left;
- room-1.ceiling;
- room-1.floor;
- room-1.window-1;
- room-1.outlet-3.

Clicking a surface/object can show all Smart Offer positions linked to that entity.

This must work regardless of whether the entity is currently in final-material view, service-highlight view or technical/x-ray view.

## 10. Service presentation in 3D

The 3D viewer supports multiple presentation modes.

### Highlight
For services where location matters more than a visible material change.

Examples:
- sanding;
- primer;
- preparation;
- fine putty when a separate realistic visual change adds little value.

### Material
For visually meaningful finishes.

Examples:
- paint;
- decorative plaster;
- tile;
- laminate/floor finish.

### Geometry
For newly built shapes.

Examples:
- drywall wall;
- suspended ceiling;
- niche;
- box;
- partition.

### X-ray / cutaway
For hidden assemblies.

Examples:
- insulation;
- profiles;
- plumbing routes;
- electrical routes.

### Object
For installed/movable items.

Examples:
- outlet;
- switch;
- light;
- radiator;
- sanitary fixture;
- door;
- furniture.

The presentation mode is part of the service metadata, not hardcoded into the camera.

## 11. Final-result mode

The viewer must have one obvious action equivalent to:

**Виж целия резултат**

This returns from a single-service explanation to the complete proposed room.

In final-result mode:
- all included final materials/objects are shown;
- temporary service highlighting is removed;
- cutaway remains available so the interior is still easy to inspect;
- the offer total and service list remain accessible.

## 12. Work view vs Client Smart Offer view

Both use the same canonical 3D project state, but different capabilities. Detailed mode permissions are defined in `docs/WORK_CLIENT_MODE_CONTRACT.md`.

### Work view
Can expose:
- dimensions;
- exact coordinates;
- snapping;
- object transforms;
- technical layers;
- quantities;
- service assignment;
- Price Book links.

### Client Smart Offer view
Keeps:
- room navigation;
- cutaway;
- service selection;
- model ↔ offer link;
- Info;
- quantity and price;
- final-result view.

It hides unnecessary editing complexity.

## 13. Realism standard

The final client view must not look like a children's planner or blocky placeholder.

Required direction:
- real proportions;
- physically plausible materials;
- correct texture scale;
- realistic doors/windows;
- believable lighting;
- shadows/contact grounding;
- quality objects;
- clear edges and readable spatial depth.

Early technical prototypes may temporarily use simplified geometry, but they are not accepted as final client quality.

## 14. Performance rule

Interactive 3D must remain responsive.

Therefore:
- editor/viewer quality and final high-quality render are separate targets;
- assets are optimized/lazy-loaded where appropriate;
- hiding walls is visibility/cutaway logic, not scene destruction/rebuild;
- service selection does not rebuild the entire room unnecessarily.

## 15. Quantity integrity

Camera and wall visibility never affect quantities.

A hidden wall:
- still has its full geometry data;
- still owns its operations;
- still participates in m²/lm/piece calculations;
- still participates in pricing.

Correct relation:

**project geometry → quantities → prices**

not:

**what happens to be visible on screen → quantities**.

## 16. First prototype acceptance criteria

The first working 3D proof is accepted only if:

1. a room can be rotated and zoomed comfortably;
2. all four walls and ceiling can be manually shown/hidden;
3. Auto wall removal can be switched on/off;
4. camera movement exposes the interior naturally;
5. hiding surfaces causes no broken/floating visual artifacts;
6. clicking a service highlights the correct geometry;
7. clicking geometry identifies linked Smart Offer positions;
8. returning to **Виж целия резултат** restores the complete proposal;
9. no visibility action changes quantities or prices;
10. the experience is visually checked, not accepted only from code review.

## 17. Ivanov Unique requirement for the 3D viewer

Cutaway is not treated as a technical demo feature.

It should feel as if the offer itself knows **what the client is trying to inspect**.

The long-term goal is:

- select a service → the room presents the relevant area clearly;
- select an object/area → the offer presents the relevant service clearly;
- rotate the room → obstructing geometry gets out of the way naturally;
- return to final result → the room becomes whole again.

The desired feeling is that model, offer and camera cooperate as one product.

## 18. Viewer state must not become project editing

Client interaction with the 3D scene is intentionally rich but read-only.

Allowed client viewer/session changes:
- camera;
- zoom;
- selected room;
- selected service;
- selected entity;
- hidden walls/ceiling;
- cutaway/X-ray state;
- open Info;
- focus/final-result mode.

These actions must not write geometry, service scope, quantity or price.

If an action changes the actual project, it belongs to Work Mode.
