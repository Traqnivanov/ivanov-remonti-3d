# SMART OFFER — SCREEN 01 PRODUCT BLUEPRINT

**Status:** PROPOSAL FOR OWNER REVIEW — NOT LOCKED UI  
**Basis:** Smart Offer Product Contract + Brand & Content Audit v1  
**Purpose:** define the first **Client / View Mode** Smart Offer screen before any application implementation.

## 1. Screen goal

In one screen the client should understand:

1. what the proposed result is;
2. what work is included;
3. where each service applies;
4. how much of it is included;
5. what it costs;
6. what the service means.

The screen must feel like an Ivanov Remonti offer, not like CAD software.

## 2. Core interaction

### Offer → model
Click a service row:
- highlight the exact linked wall/ceiling/floor/opening/object;
- keep relevant final material/result visible when appropriate;
- show quantity + price + Info.

### Model → offer
Click a wall/object:
- show only or emphasize the offer positions connected to it.

### Reset
One clear action returns to the complete proposed room.

## 3. Proposed desktop composition

### Top bar
- Ivanov Remonti identity;
- project/client name;
- compact offer status/identifier only if later approved;
- view controls kept minimal;
- action: **Виж целия резултат**.

### Main canvas — dominant area
The room/model is the visual center.

Must support:
- true interactive 3D, not a static/fake-perspective room;
- orbit/zoom;
- clear selection;
- automatic cutaway;
- manual Left / Right / Front / Back / Ceiling visibility;
- **Show all**;
- **Auto wall removal ON/OFF**;
- realistic final materials;
- service highlight states.

Cutaway and wall visibility are core client controls, not advanced settings.

### Offer panel
A clean list of included positions.

Example row:

**Фина шпакловка**  ⓘ  
42.6 m² × 5.90 €  
**251.34 €**

Interaction:
- clicking the row activates that service in the model;
- clicking ⓘ opens compact explanation;
- no spreadsheet-style clutter.

### Total block
Persistent but visually calm:
- subtotal / additions if applicable;
- discount only if explicitly present;
- **Крайна цена** prominently.

No hidden totals.

## 4. Info panel behavior

Info should open in context without taking the client away from the offer.

Suggested card:

**Фина шпакловка**

**Какво е**  
Short definition adapted from Ivanov Remonti source content.

**Защо се прави**  
Short purpose.

**Какво получавате**  
Expected result.

**Какво включва тази позиция**  
Project scope.

**Защо е включено тук**  
Only when an explicit project note exists.

Action:
**Покажи къде е в офертата** / **Покажи на модела**

## 5. Service presentation examples

| Offer position | Model behavior |
|---|---|
| Фина шпакловка | highlight exact walls + Info |
| Шлайфане | highlight exact walls + Info; no fake visual effect |
| Грунд | highlight + Info |
| Боядисване | highlight + selected final color/finish |
| ГК таван | show real ceiling geometry |
| Вата | x-ray/cutaway of relevant assembly |
| LED ниша | show geometry + light line |
| Контакти | show/highlight exact movable objects |
| ВиК | x-ray route + sanitary points/objects |
| Обръщане | highlight exact opening/reveal geometry |

## 6. Brand direction for first prototype

Use the existing Ivanov Remonti palette:
- `#0a0e17`
- `#0d1b2e`
- `#162540`
- `#c9943a`
- `#e8b84b`
- white/muted text.

Typography candidate for prototype:
- Fraunces — headings / offer identity;
- Outfit — UI, quantities, controls.

This typography pair remains subject to Owner visual approval.

## 7. Copy style

Preferred:
- short;
- concrete;
- calm;
- no inflated marketing;
- explain before selling;
- direct quantity/price;
- real project wording.

Avoid:
- generic SaaS copy;
- long SEO paragraphs;
- cartoon labels;
- technical jargon without explanation;
- exaggerated claims of uniqueness.

## 8. Important non-decisions

This proposal does NOT yet decide:
- whether final voice is “аз” or “ние”;
- whether the client can accept/reject individual offer rows;
- whether options/alternatives are selectable by client;
- exact desktop/mobile panel placement;
- exact typography pair as locked brand token;
- share-link permissions;
- offer validity/signature/payment workflow.

These require separate Owner decisions.

## 9. First prototype acceptance test

The first screen direction is successful if a person who has never seen the system can answer within moments:

- “Какво ще стане с тази стая?”
- “Какво точно е включено?”
- “Къде е тази услуга?”
- “Какво означава?”
- “Колко е?”
- “Колко струва?”
- “Каква е крайната цена?”

without needing instructions from the builder.

## 10. Ivanov Unique check for Screen 01

Before visual approval ask:

- Does clicking a price row make the room explain itself?
- Does clicking the room make the offer explain itself?
- Is the Info useful in context instead of a generic encyclopedia?
- Does the client see evidence for scope rather than only text?
- Is there any step we can remove?
- Does the experience feel obvious after seeing it once?

The desired reaction is not “this has many features”.

The desired reaction is:

**“Това е толкова логично — защо обикновената оферта не работи така?”**


## 11. Mandatory 3D viewer reference

Screen 01 must follow `docs/3D_VIEWER_STANDARD.md`.

The offer panel may be redesigned, but the central experience remains a real 3D room with non-destructive wall/ceiling removal.

The prototype is not accepted if the room is replaced by:
- a static render;
- a 2D room image;
- a fake perspective card;
- a fixed camera that prevents inspecting the interior.

## 12. Screen 01 is Client Mode, not the editor

This screen is specifically for the client.

It must not contain authoring actions such as:
- Edit project;
- Add room;
- change room dimensions;
- move doors/windows as project edits;
- add/delete objects;
- add/delete services;
- change quantities;
- change unit prices;
- edit Price Book;
- save authoring changes.

It may contain:
- room switching;
- 3D orbit/zoom;
- wall/ceiling cutaway;
- service selection;
- model entity selection;
- Info;
- quantity/price/total;
- final-result view;
- later approved PDF/share controls.

A separate Work / Edit workspace will be designed for Ivanov Remonti.

The same Client Mode implementation should be reusable inside Work Mode through **Preview as Client**.


## 13. Protected entry before Screen 01

Screen 01 is not discovered publicly.

The client reaches it through the access mode chosen in Work Mode.

### Link mode
- client opens the unique protected offer link;
- after access validation, the Smart Offer opens.

### Link + PIN mode
- client opens the unique protected offer link;
- a minimal Ivanov Remonti access screen appears;
- client enters PIN;
- after validation, the Smart Offer opens.

The PIN gate should feel like part of the premium Ivanov Remonti experience, not like a technical admin login.

Before successful access, do not expose unnecessary project details.

The access screen may show:
- Ivanov Remonti identity;
- “Вашата Smart оферта”;
- offer number or safe non-sensitive identifier;
- PIN field when required;
- concise privacy/access note.

The main Screen 01 remains focused on 3D + offer after access succeeds.
