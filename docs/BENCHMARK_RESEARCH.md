# BENCHMARK RESEARCH — proven patterns, not copied UI

## Цел

Преди да измисляме сложен интерфейс от нулата, изучаваме утвърдени продукти и вземаме **модели на взаимодействие**, които са подходящи за нашата конкретна цел.

Не копираме дизайн 1:1. Не копираме бранд, assets или proprietary UI.

## 1. RoomSketcher — какво е полезно

Официалните им материали показват:

- точни размери на стени;
- drag/snap на врати и прозорци;
- resize/rotate/duplicate на мебели;
- 2D + Live 3D;
- измервания и total area;
- голяма library от furniture/materials;
- favorites/custom selections;
- Replace Materials;
- 3D snapshots, high-resolution render, 360;
- upload/convert на план;
- AI-assisted floor capture/convert.

### Какво вземаме като принцип

- 2D за точност + 3D за разбиране;
- drag + точна числова стойност;
- snap;
- material replacement;
- favorites / personal library;
- лесно client preview.

### Какво НЕ е достатъчно за нас

Room planner логиката не описва реалния ремонтен process stack и не е центрирана върху трудови операции/оферта.

## 2. Planner 5D — какво е полезно

Официалният продукт описва:

- upload на room photo/floor plan;
- AI разпознаване на walls/doors/windows;
- editable drag-and-drop резултат;
- 2D/3D/VR;
- 3D models from photos;
- custom 3D model import;
- realistic/4K renders;
- budget/price tools;
- професионален Price Estimator/Specs workflow.

### Какво вземаме

- photo/floor-plan assisted старт;
- AI предлага, човек редактира;
- custom assets;
- cost layer да е част от професионалния workflow;
- реалистичен presentation render.

### Нашето правило

AI-generated geometry не става Quote Ready, докато няма калибрирани/потвърдени размери.

## 3. Homestyler — какво е полезно

Официалните им страници показват:

- 2D floor plan/sketch → editable 3D;
- drag-and-drop decorating;
- cloud rendering;
- много голяма 3D library;
- upload на собствени 3D модели;
- upload на собствени 2D textures/materials;
- personal reusable library.

### Какво вземаме

- personal asset library;
- custom texture upload;
- reusable custom models;
- separation editor vs high-quality rendering.

### Важен lesson

За custom textures трябва да имаме качество:
- достатъчна резолюция;
- правилно RGB изображение;
- минимална перспектива/сенки в texture source;
- реален physical scale;
- repeat/tiling.

## 4. SketchUp — какво е полезно

Официалната документация подчертава:

- components като reusable definition + instances;
- photoreal/PBR materials;
- custom materials;
- отделни material collections;
- browser sharing / stakeholder communication.

### Какво вземаме

- asset definition ≠ instance;
- reusable components;
- PBR material model;
- „In project“ и personal material collections;
- client share без да се дава editor контрол.

## 5. Floorplanner — какво е полезно

Официалният продукт набляга на:

- лесна употреба без 3D експертност;
- бърз 2D/3D workflow;
- photorealistic images;
- добри default визуални настройки, с advanced controls при нужда.

### Какво вземаме

- good defaults first;
- advanced lighting/render controls не трябва да блокират ежедневната работа;
- потребителят не трябва да бъде 3D специалист.

## 6. Нашата комбинирана посока

От конкурентите вземаме proven interaction patterns:

- 2D + 3D;
- drag/snap;
- точни размери;
- photo/plan assisted старт;
- custom materials;
- object library;
- realistic render;
- share/export;
- cost layer.

Но уникалното ядро е различно:

### A. Smart Offer Service Link Engine
Виждаш и управляваш:
`service position ↔ exact target in model ↔ quantity ↔ price ↔ Info ↔ relevant visual presentation`.

### B. Geometry-linked Operations
Операцията е вързана към реална площ/линия/обект.

### C. Quantity-linked Pricing
Количеството идва от geometry, а цената от Price Book.

### D. Client Trust View
Клиентът вижда:
- какво ще се направи;
- защо е нужно;
- как ще изглежда;
- колко е;
- колко струва.

## 7. UX стандарт, получен от benchmark-а

Не правим екран с всички възможни команди наведнъж.

Използваме:

- основен canvas;
- ограничени категории;
- context inspector;
- drag-and-drop;
- quick recipes;
- advanced breakdown;
- contextual service/offer panel;
- client mode.

## 8. Визуален стандарт, получен от benchmark-а

Интерактивният режим трябва да е бърз.

Client mode трябва да може да стигне до много по-високо качество:

- PBR;
- high-quality shadows;
- physically plausible lighting;
- custom real materials;
- high-resolution render;
- 360/interactive walkthrough като по-късна цел.

## 9. Източници на benchmark research

Официални продуктови/документационни страници, прегледани на 22.09.2026:

- RoomSketcher — Room Planner, Draw Floor Plans, Live 3D, Replace Materials, Pro Features.
- Planner 5D — AI Room Design, Pricing/Professional features, Budget/Price tools.
- Homestyler — official 3D design platform, custom 3D model and 2D texture upload documentation.
- SketchUp — Interior Design, Components, Materials/PBR documentation.
- Floorplanner — official product overview.

Тези източници служат за benchmark и не са продуктова спецификация за нашия инструмент.
