# BRAND & CONTENT AUDIT v1 — Ivanov Remonti Smart Offer

**Scope:** read-only audit of `Traqnivanov/Remonti-` on `main`.  
**Purpose:** extract the existing Ivanov Remonti identity, tone, service knowledge and reusable client-facing content for Smart Offer.  
**Safety:** no files in `Traqnivanov/Remonti-` or `Traqnivanov/ivanov-tools` were modified.

## 1. Sources reviewed

Core site:
- `index.html`
- `lom/index.html`
- `shpaklovka.html`
- `boyadisvane.html`
- `gipsokarton.html`
- `obrashchane.html`
- `lom/vik.html`

Guides:
- `narachnik/index.html`
- `narachnik/shpaklovka.html`
- `narachnik/boyadisvane.html`
- `narachnik/gipsokarton.html`
- `narachnik/obrashchane.html`
- `narachnik/vik.html`

Assets/listing review:
- real project photos and before/after images;
- service OG images;
- Ivanov Remonti logo assets;
- Sofia and Lom service imagery.

## 2. Existing visual identity — observed facts

### Core palette

The same dark-navy/gold system appears repeatedly in the main site and guides.

Observed CSS variables include:

- background / ink: `#0a0e17`
- navy: `#0d1b2e`
- navy 2: `#162540`
- navy 3: `#1c2e48`
- blue: `#1a3a6b`
- gold: `#c9943a`
- gold 2: `#e8b84b`
- white: `#ffffff`
- muted text: `#8a9ab0`
- cream/warm accents also exist on the main site: `#f4f0e8`, `#ede8dc`

Gold gradients are already part of the identity, including combinations around `#c9943a`, `#e8b84b` and lighter gold highlights.

### Shape language

Observed:
- dark cards with thin gold/translucent-gold borders;
- mostly restrained radii around 6–10 px on content cards/buttons;
- occasional pill shapes for badges/actions;
- gold accent lines and borders;
- strong contrast between dark background and white/gold copy.

### Typography

The existing ecosystem loads/uses more than one typography pair.

Observed on the main site:
- Outfit
- Fraunces
- Jost
- Cormorant Garamond
- DM Serif Display

Observed on the guide hub:
- **Fraunces** for display/headings;
- **Outfit** for body/UI.

**Audit conclusion:** the brand has a clear color identity but the typography is not yet one single locked system across all pages.

**Recommendation for Smart Offer prototype:** test **Fraunces + Outfit** first because it is already used consistently in the guide system and gives a premium/editorial + clear-UI balance. This is a recommendation, not an Owner-locked decision.

## 3. Existing brand promise — observed facts

Repeated brand ideas across the site:

- “Ти Почиваш — Ние Ремонтираме”
- clear/detailed offer before work;
- fixed agreed price after inspection;
- written guarantee;
- free inspection;
- no surprises at the end;
- explain what is actually needed;
- no unnecessary work;
- client decides after understanding;
- personal responsibility;
- real photos/video from jobs;
- professional equipment;
- communication during the job;
- acceptance of completed work.

Strong phrases already present in the current content include ideas equivalent to:

- “Първо разбирате, после решавате.”
- “Без натиск и без задължение.”
- “Какво наистина трябва да се направи.”
- “Точно колко и защо. Нищо излишно.”
- “Ясна оферта.”
- “Фиксирана цена по договор.”
- “Писмена гаранция.”
- “Без изненади.”

## 4. Tone of voice

### What the current content sounds like

The strongest tone is:
- direct;
- plain language;
- practical;
- explanatory;
- confidence without excessive technical jargon;
- transparent about what is and is not known before inspection;
- client-education focused;
- anti-surprise / anti-hidden-cost;
- personal responsibility.

The guides reinforce this with practical language such as:
- what is suitable;
- why a step is needed;
- common mistakes;
- what affects price;
- how to recognize quality.

### Important unresolved voice difference

There are two existing narrative voices:

- Sofia/main pages often use **plural brand voice**: “идваме”, “работим”, “получавате”.
- Lom pages often use **personal singular voice**: “идвам”, “работя лично”, “казвам”.

**NO ASSUMPTION rule applies.**

Before final Smart Offer client copy is locked, Owner must choose one of:
1. brand plural;
2. personal singular;
3. contextual voice by region/project.

Do not silently choose.

## 5. Content-source hierarchy for Smart Offer Info

For every service Info card use this order:

1. **Current service page** — concise service definition and what is included.
2. **Relevant guide** — deeper explanation, technology, common mistakes, quality criteria.
3. **Main site** — Ivanov Remonti promise/tone.
4. **Project-specific note** — why this service is included in this exact offer, if explicitly entered/confirmed.
5. **Price Book** — all current prices and units.

Do NOT hardcode public-page price text inside the Info description.

Reason:
- public pages can be regional;
- price tables can change;
- old tools already contain some different values;
- Smart Offer has a dedicated versioned Price Book.

## 6. Smart Offer Info format

Every service should support a compact `ⓘ` panel.

Recommended structure:

### Какво е
One short client-friendly definition.

### Защо се прави
What problem/need the operation solves.

### Какво получавате
The expected result.

### Какво включва тази позиция
The concrete scope represented in the offer.

### Защо е включено тук
**Project-specific field.** This can become a strong Ivanov Unique mechanism, but it must only show a reason that has been explicitly entered/confirmed for the project. It must not invent diagnoses.

### Важно
Only when a real caution/dependency matters.

## 7. Core service content map

### Fine putty / Фина шпакловка

Sources:
- `shpaklovka.html`
- `narachnik/shpaklovka.html`

Current source supports:
- final finishing layer before paint;
- smooth surface ready for painting;
- dust-reduced/machine sanding is part of the working method;
- can be used alone when the base is already sufficiently good;
- may follow gypsum/base work when more correction is needed.

Smart Offer presentation candidate:
- target surface highlight;
- smooth neutral finish preview only if useful;
- quantity in m²;
- `ⓘ` from the above source content.

### Gypsum putty / Гипсова шпакловка

Sources:
- `shpaklovka.html`
- `narachnik/shpaklovka.html`

Current source supports:
- used for light irregularities/cracks and base correction;
- can precede fine putty;
- mesh/reinforcement is used in specific cracked/joint situations.

Smart Offer presentation candidate:
- exact surface highlight;
- Info;
- no exaggerated fake texture required.

### Reinforced/base preparation

Sources:
- `shpaklovka.html`
- `narachnik/shpaklovka.html`

Current source supports:
- old/weak/problematic bases can require strengthening;
- mesh can be part of the system;
- actual need depends on the condition of the base.

Important taxonomy note:
- old Ivanov Tools uses the same/related key inconsistently for “Основна мазилка” and “Основна укрепваща шпакловка”.
- Smart Offer must keep ordinary plaster and putty/reinforcement operations separate.

### Drywall joint treatment

Source:
- `shpaklovka.html`

Current source supports:
- joint tape;
- screw treatment;
- corner treatment;
- overall smoothing so joints do not remain visible after paint.

### Sanding / Шлайфане

Sources:
- `shpaklovka.html`
- `narachnik/shpaklovka.html`

Current source supports:
- dust-reduced/machine sanding;
- removes roughness/tool traces;
- prepares surface before primer/paint depending on the system.

Smart Offer presentation:
- highlight + Info + m²;
- do not invent a dramatic visual state.

### Primer / Грунд

Sources:
- `shpaklovka.html`
- `boyadisvane.html`
- `narachnik/boyadisvane.html`

Current source supports:
- primer before painting is described as required, not optional;
- without primer paint can absorb unevenly and coverage can suffer;
- exact primer use also depends on base/system.

Smart Offer presentation:
- highlight + Info;
- visually subtle;
- no fake colored layer just to make it obvious.

### Painting / Боядисване

Sources:
- `boyadisvane.html`
- `narachnik/boyadisvane.html`

Current source supports:
- two-coat latex after priming in the standard service description;
- white or color;
- substrate inspection/preparation;
- local corrections if needed;
- protection/masking around floors, joinery, switches and outlets;
- paint selection depends on room/use and finish;
- matte vs satin has different visual/maintenance behavior;
- consumption must follow the actual product's stated norm.

Smart Offer presentation:
- exact target surfaces;
- selected real color/finish;
- m²;
- Price Book value;
- Info.

### Drywall / Гипсокартон

Sources:
- `gipsokarton.html`
- `narachnik/gipsokarton.html`

Current source supports:
- straight suspended ceiling;
- LED niche;
- partition wall;
- wall lining;
- different board/system choices;
- mineral wool for sound/thermal improvement;
- installations must be coordinated before closing;
- system complexity affects price.

Smart Offer presentation:
- real geometry;
- optional x-ray/cutaway for structure/insulation;
- m² or lm depending on operation.

### Window/door reveals / Обръщане

Sources:
- `obrashchane.html`
- `narachnik/obrashchane.html`

Current source supports:
- drywall method;
- plaster + putty method;
- angle profiles;
- reinforcement;
- joint finishing where applicable;
- final preparation for paint;
- whole-wall vs local finishing can differ.

Smart Offer presentation:
- opening/reveal geometry;
- linear meters and/or area according to the approved quantity rule;
- exact highlighted reveal;
- Info.

### Plumbing / ВиК

Sources:
- `lom/vik.html`
- `narachnik/vik.html`

Current source supports:
- new installation;
- water supply and drainage;
- routes in channels;
- fittings and valves;
- pressure test before closing;
- faucet replacement;
- toilet replacement;
- siphons/flexible connections;
- sanitary installation;
- layout planning before work.

The guide reinforces:
- pressure testing before closing;
- separate shutoff valves;
- correct drainage slope;
- access for future maintenance.

Smart Offer presentation:
- x-ray/cutaway for hidden routes;
- movable sanitary objects;
- point/object/route quantities depending on the operation;
- Info.

## 8. Additional services already present in the main site

The Sofia main page explicitly lists:
- bathroom renovation;
- tiles/faience;
- hidden LED lighting;
- demolition;
- masonry and partition walls;
- decorative cornices;
- soundproofing;
- full renovation.

The Lom page also explicitly lists:
- bathroom renovation;
- tiles/faience;
- hidden LED lighting;
- demolition;
- masonry/partition walls;
- full renovation.

These belong in the service registry, but each needs its own operation breakdown before implementation.

## 9. Real imagery is already a brand asset

The repo contains:
- real job photos;
- before/after photos;
- service-specific images;
- drywall/LED projects;
- painting;
- putty;
- plumbing;
- decorative plaster;
- joinery/reveals.

Smart Offer should prefer real Ivanov Remonti imagery where a real project/example is useful, instead of generic stock imagery.

## 10. Brand behaviors that should carry into Smart Offer

Observed site behavior suggests the product should feel:

- transparent before persuasive;
- explanation before pressure;
- clear scope before price;
- real proof before marketing claim;
- exact location/quantity instead of vague wording;
- “nothing unnecessary”;
- client can understand why a position exists.

This aligns directly with the approved Smart Offer mechanism.

## 11. Strong Ivanov Unique opportunities derived from existing content

These are **recommendations**, not locked features.

### A. “Защо е включено тук”

The existing brand repeatedly explains what is actually needed and why.

Smart Offer can make this project-specific:

**Фина шпакловка · 42.6 m² · ⓘ**  
“Включена е за Стени 1, 2 и 3. Причина: [Owner-entered/confirmed project note].”

This would connect diagnosis, model and offer without inventing facts.

### B. “Покажи ми точно къде”

Every offer row can have a natural action:
- click row → exact highlighted geometry.

This translates the brand promise “точно колко и защо” into product behavior.

### C. “Какво получавам”

Info should end with a visible client result, not only technical process.

Example:
- Fine putty → “гладка основа, готова за следващия финиш”.
- Drywall wall lining → “права завършена равнина / място за скрити инсталации”, depending on project.

### D. “Нищо излишно”

If a service is not part of the offer for a surface, it should not be shown as if it were.

The model should visually prove scope, not decorate the quote with generic operations.

## 12. Gaps / risks found

### Typography is not fully unified
Main site and guides use overlapping but different font systems.

Action:
- prototype one Smart Offer typography pair;
- Owner approves before it becomes a locked design token.

### Voice is not fully unified
Sofia uses plural brand voice; Lom often uses personal singular.

Action:
- Owner decision before final client copy.

### Prices are not a content-source problem
Prices in pages/tools are not the final source of truth for Smart Offer.

Action:
- use versioned Price Book;
- Info content never embeds a price unless explicitly generated from the current offer.

### Some service families are broad
“Bathroom renovation”, “full renovation”, “demolition”, etc. need decomposition into specific quote operations.

Action:
- do not implement them as one vague button.

## 13. Audit conclusion

The existing Ivanov Remonti ecosystem already contains enough material to build the first Smart Offer identity without inventing a new brand.

The strongest reusable foundations are:

**dark navy + gold identity + premium editorial headings + clear UI typography + real project proof + plainspoken explanation + fixed-scope clarity + written responsibility + “first understand, then decide”.**

The new product should translate those values into interaction, not merely copy the website styling.
