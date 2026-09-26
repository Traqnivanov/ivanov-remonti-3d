# DECISION LOG

Този файл пази важните Owner решения хронологично, за да не се възстановява стара или погрешно разбрана посока.

> **Важно:** това е decision history, не current-state tracker. По-късно датирано Owner решение може да supersede по-старо. За текущото състояние започни от `START_HERE.md` → `PROJECT_STATE.md`, а тук чети релевантните решения.

## 22.09.2026 — Smart Offer е основният продукт

**Owner decision:** продуктът е интерактивна Smart оферта на Ivanov Remonti.

Не е:
- просто 3D room planner;
- просто калкулатор;
- просто PDF;
- анимация как майсторът извършва ремонта.

Основният механизъм е:

**обект ↔ услуга ↔ място в модела ↔ количество ↔ цена ↔ Info ↔ краен резултат**

## 22.09.2026 — Услугите са интерактивни

В офертата има бутони/позиции за услугите.

Натискане на услуга трябва да показва в модела точно къде се отнася.

Натискане на част от модела трябва да може да показва свързаните офертни позиции.

## 22.09.2026 — Не симулираме майсторската работа

Не показваме как физически се нанася шпакловка, как се шлайфа, как се грундира и т.н.

Визуалното представяне зависи от типа услуга:
- реален материал/краен резултат, когато е видим;
- реална геометрия при конструкции;
- x-ray/cutaway при скрити системи;
- маркиране + Info при услуги с малка видима промяна.

## 22.09.2026 — Info към всяка услуга

Пример: **Фина шпакловка · ⓘ**.

Краткото Info обяснява какво е, защо се прави, какво получава клиентът и какво включва конкретната позиция.

Основният текстов източник е съществуващото съдържание на Ivanov Remonti — service pages и наръчници. То се адаптира към кратък Smart Offer формат.

## 22.09.2026 — Ivanov Unique е задължителен критерий

При значими продуктови решения не се търси само „още една функция“.

Търси се по-добър механизъм:
- естествен;
- полезен;
- по-ясен;
- по-бърз;
- по-запомнящ се;
- със „как са се сетили точно така“ качество.

Различност без реална полза не се приема.

## 22.09.2026 — No assumption → no implementation

Когато продуктова идея има повече от едно разумно тълкуване, Work Controller/OBK няма право сам да избере версия и да я запише като Owner решение.

Първо се уточнява с Owner.

Особено важи за:
- клиентски UX;
- визуалното поведение на услугите;
- офертния workflow;
- quantity/price логика;
- продуктова идентичност.

## 22.09.2026 — Съществуващите калкулатори помагат, но не се копират сляпо

Traqnivanov/ivanov-tools остава read-only reference.

Формулите се:

**одитират → изолират → проверяват ръчно → тестват → пренасят**

Старите HTML инструменти не стават runtime dependency на Smart Offer.

## 22.09.2026 — Мазилка и шпакловка са отделни понятия

Обикновена мазилка, основна/укрепваща шпакловка, гипсова шпакловка, фина шпакловка, фуги на ГК и декоративна мазилка не се сливат в една операция.


## 22.09.2026 — 3D viewer и махащи се стени са задължителни

**Owner decision:** Smart Offer трябва да използва истинска интерактивна 3D стая като вече доказаната продуктова посока.

Задължително:
- orbit/zoom;
- вътрешен 3D изглед;
- ръчно show/hide на лява, дясна, предна, задна стена и таван;
- „Покажи всички“;
- автоматично cutaway/махане на пречещата стена според камерата;
- отделен ON/OFF контрол за автоматичното махане;
- стените/таванът се скриват само визуално — не се изтриват и не губят услуги, количества или цена;
- Smart Offer service selection и cutaway работят заедно.

Това не е допълнителна екстра. То е част от основния клиентски механизъм.

## 22.09.2026 — Work Mode и Client Mode са отделни capability режими

**Owner decision:** програмата има две ясно различни действия/режими върху един и същ проект.

### Work / Edit Mode — Ivanov Remonti
Пълен работен достъп:
- геометрия;
- размери;
- помещения;
- врати/прозорци;
- обекти;
- материали;
- услуги;
- quantities;
- Price Book;
- цени;
- бележки;
- клиентско Info;
- подготовка на офертата.

### Client / View Mode — клиентът
Интерактивно, но read-only:
- разглежда 3D;
- върти/приближава;
- маха визуално стени/таван;
- избира помещение;
- избира услуга и вижда точната зона;
- избира стена/обект и вижда свързаните позиции;
- чете ⓘ Info;
- вижда количества, цени, обща цена и краен резултат.

Клиентът **не редактира проекта, обхвата, количествата или цените**.

Важно: Client Mode не е Work Mode с няколко скрити бутона. Това е отделен capability profile. Viewer действия като camera/cutaway са позволени, но не променят Project State.

Подробният договор е в `docs/WORK_CLIENT_MODE_CONTRACT.md`.

### Статус на старото отворено решение

**SUPERSEDED / РЕШЕНО ПО-КЪСНО:** въпросът live working project срещу published snapshot вече е решен с по-късното Owner решение **„Published Revision е клиентският publishing модел“**.

Активната истина е:

**Working Project → Preview as Client → Publish Revision → protected Client Viewer**

Клиентът не чете live working draft.

## 22.09.2026 — Client access може да бъде Link или Link + PIN

**Owner decision:** Ivanov Remonti избира отделно за всяка оферта начина на достъп на клиента.

Поддържат се:
- защитен уникален Link;
- защитен уникален Link + PIN.

Work Mode трябва да има ясен контрол, чрез който Owner избира режима за конкретната оферта.

Клиентът не получава Work App, editable project или редактор.

Client Viewer е read-only.

## 22.09.2026 — Client protection е част от Ivanov Unique Standard

**Owner decision:** уникалността не се оценява само по това как изглежда клиентската оферта.

Всяко клиентско решение трябва да се проверява едновременно по:
- качеството на клиентското преживяване;
- колко добре е защитен вътрешният Work App, логиката, цените, формулите, project data и proprietary механизма.

Правило:

**Expose the client experience. Protect the engine behind it.**

Подробният договор е в `docs/CLIENT_DELIVERY_SECURITY_CONTRACT.md`.

## 22.09.2026 — Текущият public repo е риск преди proprietary implementation

**HISTORICAL / SUPERSEDED BY THE LATER OWNER DECISION BELOW.**

Към момента на това обсъждане `Traqnivanov/ivanov-remonti-3d` е PUBLIC и рискът е отчетен.

По-късното активно Owner решение е repo да остане PUBLIC по време на development и да има задължителен Protection Gate преди production/final release.

## 22.09.2026 — Repo остава public по време на разработката

**Owner decision:** `Traqnivanov/ivanov-remonti-3d` остава PUBLIC, докато програмата се създава.

Owner приема риска от публичност по време на development.

Защитата на repository/source се прави, когато програмата е готова за production/final release.

До тогава:
- не се качват secrets/API keys;
- не се качват реални клиентски лични данни;
- не се качват production credentials;
- не се приема, че публичният repo е защитена среда.

Преди production/final release има задължителен **Protection Gate**, който включва решение и изпълнение за:
- private repository или друга одобрена private source strategy;
- production access/security;
- client delivery protection;
- removal/rotation на test credentials, ако има такива;
- проверка за source maps, secrets и sensitive data.

## 22.09.2026 — Решенията са текуща база, не вечна догма

**Owner decision:** програмата ще се доразработва постоянно и всяко старо решение може да бъде променено, ако се намери по-добро решение или се открие грешка в стара логика.

Тълкуване на статусите:
- **APPROVED** = прието за текущата версия;
- **LOCKED** = защитено от случайна/самоволна промяна, но не е необратимо;
- само ново изрично Owner решение може да замени фундаментална продуктова посока.

При замяна на старо решение:
1. старото не се заличава безследно;
2. Decision Log записва какво е заменено и защо;
3. активните source-of-truth документи се актуализират;
4. кодът се променя чак след impact/risk review.

Критерият е: **най-доброто доказано решение за текущия продукт**, не „така сме го решили веднъж“.

## 22.09.2026 — Supabase + Cloudflare е текущата одобрена инфраструктура

**Owner decision:** текущата най-добра архитектура е:

- GitHub — source/version control;
- Cloudflare — domains, hosting/delivery edge и security layer;
- Supabase Postgres — canonical persistent database;
- Supabase Auth — Work App authentication;
- Supabase Storage — initial project asset storage;
- Supabase protected/server-side operations — publish, revisions, Link/PIN access, sanitized client payload;
- без Firebase;
- без Cloudflare D1 като primary DB;
- Cloudflare R2 само по-късно при доказана нужда.

Work App и Client Viewer са отделни web приложения/capability surfaces.

Подробности: `docs/INFRASTRUCTURE_DATA_ARCHITECTURE.md`.

## 22.09.2026 — Published Revision е клиентският publishing модел

**Owner decision:** клиентът не вижда live working project.

Flow:

**Working Project → Preview as Client → Publish Revision → protected Client Viewer**

Нова промяна в Work App не се показва на клиента, докато не бъде публикувана нова revision.

Причини:
- пази изпратената цена/обхват;
- предотвратява изтичане на недовършена редакция;
- дава история/audit;
- позволява Work проектът да продължи да се редактира независимо.

Остава за по-късно само UX решението дали един стабилен link отваря най-новата публикувана revision или всяка revision има отделен link.

## 22.09.2026 — Data Model v1 е текущата техническа база

Текущият модел разделя:
- Working Project State;
- Published Offer Revision;
- Viewer Session State.

Project/3D state използва stable entity IDs и schema version.

Service assignments свързват услугите към точни entity IDs.

Quantity идва от domain geometry + versioned rule, а не от visible meshes.

Price Book е отделен от renderer/geometry.

Published Revision запазва това, което клиентът реално е видял, включително quantity/unit price/line total.

Подробности: `docs/DATA_MODEL_V1.md`.

## 22.09.2026 — Първата реална имплементация е ограничен vertical slice

Следващата implementation цел е:
- една истинска Three.js стая;
- stable walls/floor/ceiling IDs;
- cutaway;
- една услуга „Фина шпакловка“;
- Offer → Model;
- Model → Offer;
- quantity;
- DEV Price Book abstraction;
- Info;
- Preview as Client.

Първият slice НЕ включва Supabase/Auth/Cloudflare/Link/PIN. Те идват след доказване на core механизма.

Подробности: `docs/FIRST_VERTICAL_SLICE_V1.md`.

## 22.09.2026 — Двата legacy калкулатора не се вграждат като готови HTML екрани

**Work Controller architecture, по делегираната техническа преценка на Owner:**

Съществуващите два калкулатора съдържат ценна сложна логика и тя се използва, но не чрез директно вграждане на старите HTML страници.

Правило:

**one project/domain truth → 3D + 2D m² technical schema + specialist calculators + quantities/materials + Smart Offer**

- m²/SVG чертането остава специализиран 2D Work инструмент;
- 3D остава отделен истински 3D изглед;
- и двата четат едни и същи room/surface/opening данни;
- формулите се extract-ват в pure TypeScript modules;
- сложният ГК calculator става specialist module и се зарежда само когато е нужен;
- Client Viewer не получава Work calculators;
- няма iframe, legacy DOM dependency, Firebase/localStorage dependency или duplicate room state.

Подробности: `docs/LEGACY_CALCULATOR_INTEGRATION_ARCHITECTURE.md`.


## 22.09.2026 — Owner correction — интегрираме само „Калкулатор М²“

**Owner correction:** от двата legacy калкулатора в Ivanov Tools текущо ни трябва само инструментът с видимо име **„Калкулатор М²“**.

Проверено съответствие:

**Калкулатор М² → `kalkulator-combined.html`**

Следователно:
- `kalkulator-combined.html` е единственият текущ legacy calculator integration source;
- `calculator.html` не се интегрира;
- `room.html` не се интегрира;
- старото решение, формулирано като интеграция на „двата калкулатора“, е заменено.

M² се свързва с новата програма чрез shared project/domain state, а не чрез iframe или директно вграждане на стария HTML.


## 22.09.2026 — First-view viewer проблемът се коригира без промяна на product core

**Owner feedback / active implementation rule:** първият 3D кадър трябва да е реално центриран и с полезен мащаб на истинското устройство, а Reset да връща към същия полезен изглед.

Това е Viewer Session / presentation проблем, не причина да се променят:
- domain geometry;
- quantity;
- price;
- Work/Client capability contract.

Последователност на корекциите:
- adaptive room/viewport framing;
- след реален Owner screenshot — DPI/CSS canvas correction за Windows/high-DPI поведение.

Правило за напред:
**визуална корекция не се приема само по CI или headless screenshot; реалният Owner/device feedback има приоритет при видим UX дефект.**

Последният pre-DPI вариант беше изрично отхвърлен като все още изместен вдясно. Latest DPI-corrected build трябва да получи отделен Owner visual verdict преди merge.

## 22.09.2026 — Не прескачаме към следваща видима функция само защото prototype-ът е незавършен

**PROCESS RULE REMAINS ACTIVE; THE OLD SLICE ORDER BELOW IS SUPERSEDED.**

**Owner-confirmed process direction:** след доказване на един vertical slice не се избира произволно следващата видима екстра.

Преди нов subsystem:
**затваряне на текущия checkpoint → audit → explicit merge/continue decision → следващ одобрен slice.**

Historical plan at that point:
1. **Slice 2 — Persistence**;
2. **Slice 3 — Publishing**;
3. **Slice 4 — Complete room offer**.

**SUPERSEDED sequencing:** the later Owner-approved delivery direction, the continuity consolidation and the current `START_HERE.md` / `PROJECT_STATE.md` moved the active post-Persistence path to **one complete room before broad service-family expansion**. Publishing remains a required product capability, but the old instruction to do Publishing before Complete Room is no longer current.

The durable process rule still applies:
**audit → better proven sequencing → impact/risk review → Owner decision → source-of-truth sync → implementation.**

No subsystem may be started merely because it appeared next in this historical list.

## 22.09.2026 — PR #3 няма implicit merge approval

**Owner/process rule:** PR #3 остава DRAFT, докато няма изрично Owner разрешение за merge.

Не означават merge approval:
- „ок“ за продължаване;
- green CI;
- technical PASS;
- одобрение на отделна визуална корекция;
- documentation sync.

Преди merge Owner трябва да е видял релевантния интерактивен build и да даде изрично решение.


## 22.09.2026 — Mobile е първият QA и UX приоритет

**Owner decision:** за visible UI/3D и особено за Client experience **mobile е приоритетът**.

Задължителен процес:
1. mobile layout/viewport се проверява първо;
2. touch interaction се проверява, когато има interaction;
3. проверяват се readability, tap targets, scrolling, clipping и horizontal overflow;
4. 3D viewer се проверява за framing, scale и usable controls на тесен mobile viewport;
5. проверява се засегнатият Work и/или Client mode;
6. след това се проверява desktop/tablet consistency.

Правило:
**UI/3D промяна не се счита за окончателно готова, визуално приета или merge-ready само защото desktop CI/screenshot е добър.**

CI/headless mobile emulation е полезен gate, но за видими критични UX решения реален browser/device review или Owner screenshot има по-висока тежест, когато е наличен.

Mobile priority не означава desktop neglect. И двете трябва да работят, но при конфликт на пространство и сложност първо се защитава mobile clarity и основният workflow.

Това правило не се прилага към чисто backend/domain/documentation промени без видим UI ефект.


## 23.09.2026 — Mobile QA трябва да доказва реалния CSS viewport и реалния navigation state

**Owner real-device evidence corrected the QA process.**

Предишен automated mobile PASS се оказа false positive:
- emulator profile беше зададен като narrow phone;
- effective CSS layout в теста беше значително по-широк;
- Owner phone screenshot показа clipped/overlapping controls, които headless test не беше уловил;
- direct Client test не покриваше отделното състояние **Work → Preview as Client**.

Активно правило:
1. mobile test трябва да измери и assert-не реалната CSS layout ширина;
2. проверява се document horizontal overflow;
3. проверяват се bounds на **всеки видим бутон/контрол**;
4. 3D controls не могат да покриват protected canvas safe area;
5. Work, Work → Preview as Client и direct Client са отделни QA states, когато съществуват;
6. Owner/device screenshot има по-висока тежест от headless PASS при видим конфликт;
7. при такъв конфликт gate се отваря отново и старият PASS се маркира като невалиден за този visual issue.

Latest corrected implementation checkpoint:
`5d5e5f04c238b7fd2b73c0feb4a23e13b57b11fe`

Latest verified static preview:
`6beb1cf18adffc2515a490df286f154f0d380a5d`

Статус:
- hardened 360 px automated QA — PASS;
- Work Controller mobile screenshot review — PASS;
- desktop Opera regression review — PASS;
- **Owner real-device recheck — ACCEPTED FOR FIRST SLICE CHECKPOINT**;
- PR #3 remains DRAFT / no merge approval.


## 23.09.2026 — Owner прие latest mobile build за First Vertical Slice checkpoint

След hardened 360 px QA и реална повторна проверка на телефон Owner даде **„Ок“** в контекст, в който предварително беше уточнено, че това означава:

**Owner приема текущото mobile изживяване за First Vertical Slice checkpoint.**

Това заключва само mobile visual gate за този checkpoint.

Не означава:
- финален mobile polish;
- готов продукт;
- одобрение на следващи slices;
- merge разрешение за PR #3.

Следващата стъпка е:
**final merge-gate audit → отделно explicit Owner merge decision.**


## 23.09.2026 — First Slice merged; Slice 2 Persistence започва на отделна основа

Owner даде изрично **“Merge PR #3”**.

PR #3 — `First Vertical Slice v1: Smart Offer core loop` — е merged в `main`.

Merge commit:
`cda27d78faf28565b7faef2f4917aa14c5d8a2d4`

След merge Owner потвърди да продължим по одобрения ред към Slice 2 — Persistence.

Създаден е отделен Supabase контекст за продукта:
- Organization: **Ivanov Remonti**
- Project: **ivanov-remonti-3d**
- Project ref: `qjfpbxucrxrtpygusnuv`
- Region: `eu-west-1`

При audit старта проектът е ACTIVE_HEALTHY, без `public` таблици и без migrations.

Активният Slice 2 contract е:
`docs/PERSISTENCE_SLICE_V1.md`

Задължителен ред:
**P2.1 persistence domain boundary → P2.2 reviewed DB migration/RLS → P2.3 Auth → P2.4 repository Save/Open → P2.5 minimal UI → P2.6 acceptance.**

Не се създават таблици ръчно и не се прескача директно към Publishing, врати/прозорци или други видими функции.


## 23.09.2026 — Owner избра Work sign-in: имейл + парола

След P2.3b Owner избра вариант **1 — имейл + парола** за частния Work вход.

Активното решение е:
- Work App използва Supabase Auth email + password sign-in;
- няма публична регистрация като продуктова функция;
- magic link / OTP не е текущият вход;
- sign-in implementation се разделя на малки checkpoints;
- първо P2.3c1 sign-in logic + tests;
- после отделно P2.3c2 minimal visible login UI + visual QA;
- P2.4 Save/Open не се смесва с Auth задачите.


## 23.09.2026 — Owner одобри canonical continuity system за всички следващи чатове

Owner одобри специално за `ivanov-remonti-3d` професионална continuity система, при условие че **не се губи нито едно важно решение, условие, критерий, риск или одобрена посока**.

Активното правило е:

- `START_HERE.md` = постоянният вход и operating rules;
- `PROJECT_STATE.md` = единственото официално текущо състояние;
- точно един GitHub Issue с префикс **[CURRENT WORK]** = временната текуща работа;
- Git / PR = историята;
- Master/contracts остават трайната продуктова/архитектурна база и се четат според dependency map, а не всичките при всеки старт.

Задължителен boot за нов чат:

**START_HERE → PROJECT_STATE → Current Work Issue → verify branch/HEAD/PR → task-relevant dependency docs**

Нов чат преди работа потвърждава:
- къде сме;
- кое е официално;
- кое е временно;
- кое е непроверено;
- NEXT EXACT STEP.

При конфликт:

**STOP — NO GUESSING.**

За съществена промяна:

**audit → concrete proposal → visible Criteria Check → Owner approval → implementation → technical verification → exact preview → visual verification → record result → NEXT**

Criteria Check използва **PASS / PARTIAL-RISK / NOT APPLICABLE** и покрива приложимото:
- human benefit;
- 3-second clarity;
- primary action;
- Smart Offer North Star;
- Work/Client safety;
- mobile/readability/touch/focus/accessibility;
- Project State vs Viewer Session State;
- quantity/price truth;
- privacy/RLS/security/data;
- performance;
- side effects;
- recovery/error/stale states;
- need for new product decision.

Visible UI/3D не се приема само по code/CI. Ако не е гледано реално: **НЕ Е ВИЗУАЛНО ПРОВЕРЕНО**. Ако не е тествано: **НЕ Е ПРОВЕРЕНО**.

Continuity migration е консервативна:
- старите handoff/checkpoint материали първо се маркират historical/superseded, а не се трият;
- активните решения и criteria се пренасят преди какъвто и да е cleanup;
- history остава достъпна чрез Git.

Основният acceptance test е:

**ако текущият чат изчезне, нов чат трябва да може от repo + Current Work Issue да продължи правилно без Owner да разказва проекта отначало.**

## 25.09.2026 — Permanent docs are not a chat diary

**Owner decision:** the continuity system must preserve the project path without forcing future Work chats to read the full project history.

Permanent documentation rule:
- ideas, questions, alternatives, temporary problems, implementation evidence and intermediate reasoning belong in chat + the active Current Work Issue;
- `PROJECT_STATE.md` contains only current factual state, active work, live risks and NEXT;
- permanent product/architecture contracts receive only durable Owner-approved truths that future phases must obey;
- `START_HERE.md` carries only globally important product/process guardrails and the end-state compass;
- detailed execution history belongs to Git, merged PRs and closed Issues;
- rejected/superseded options are not copied into permanent active contracts simply because they were discussed.

Continuity target:

**A future Work chat must understand the whole path without reading the whole history.**

It starts from:
`START_HERE.md → PROJECT_STATE.md → active Current Work Issue (if any) → verify Git → only task-relevant dependency docs`.

This decision does not remove historical evidence; it changes where that evidence belongs.

## 26.09.2026 — Universal continuity protocol and Owner criteria are binding

**Owner decision:** the project must be self-explanatory enough that a new Chief Work Controller / execution chat can continue without Owner reconstructing the project from memory.

The permanent process is now explicitly hardened in `START_HERE.md`.

Mandatory foundations:
- project memory lives in the project sources, not in one chat;
- ENTRY / CURRENT STATE / durable product truth / decision history / work control / evidence have distinct roles;
- every material decision is checked against the universal Owner criteria plus project-specific criteria;
- **Uniqueness / distinctive product logic is a mandatory Owner criterion**, but only when it creates real user/product value;
- checkpoint lifecycle is **OPEN → WORKING → DECISION / VERIFIED RESULT → CLOSED → SYNC → NEXT**;
- Work Controller has a proactive strategic duty and must report significant conflict, drift, missed dependency, dead-end or materially stronger solution;
- Critical strategic risk stops the affected work until resolved;
- a new chat must produce the mandatory startup report (role, final goal, Owner criteria, checkpoint, last valid decision, NEXT, open, frozen, authority limit, strategic duty) before substantive work;
- after an important checkpoint, a **Sync Gate** must leave CURRENT STATE, durable contracts/dependencies, Work control, active Issue/PR and NEXT consistent;
- canonical documentation records resolved truth, not the transcript of discussion;
- handoff means synchronized canonical sources, not a new per-chat handoff file.

Acceptance condition:

**If Owner must explain again what the project is, how it is judged, where it is now, what is frozen or what comes next, continuity is not complete.**

This process decision does not change P3.2 product scope or authorize a new room block.


## 26.09.2026 — Post-Persistence active direction is one complete room

**Reconciliation of already approved Owner direction; not a new feature decision.**

The current active product path after the merged Persistence slice is:

**continue the one-complete-room direction before broad service-family expansion.**

This is supported by the Owner-approved `docs/DELIVERY_STRATEGY.md`, the continuity consolidation acceptance, `START_HERE.md`, and the current `PROJECT_STATE.md`.

“One complete room” means an end-to-end useful room workflow, not merely four rendered walls. The current guardrail includes:
- four walls + floor + ceiling;
- door/window openings;
- cutaway/visibility and surface selection;
- real service operations linked to exact targets;
- quantity + price truth;
- materials/finishes;
- core movable objects;
- room totals;
- a coherent Client/Final Result.

P3.1 Floor Finish and P3.2 Door + Window Openings are completed parts of that direction.

The exact bounded NEXT after P3.2 must be derived from the active dependency/product documents and current implementation gaps, then presented through the normal audit → proposal → Criteria Check → Owner approval process.

Publishing/Link/PIN remains required by the product contracts, but the historical instruction that it must precede Complete Room is superseded.


## 26.09.2026 — Owner approves staged roadmap and continuous Uniqueness Interrupt Gate

**Owner decision:** the audited post-P3.2 path is approved and becomes the active staged product direction.

Approved sequence:
**P3.3 Generic Operation Authoring Core → P3.4 Price Core/totals → P3.5 wall/ceiling finishing stack → P3.6 Object/Edit Core → P3.7 Materials/Colors/Images/Assets → P3.8 Complete Room acceptance → P4 Protected Publishing/Client Viewer → P5 broader service families → P6 Office workflow integration/reuse → P7 Photo Assist → P8 advanced/secondary outputs → Production Protection Gate.**

This sequence is a dependency direction, not a permanent prohibition on improvement.

Owner clarified the operational meaning of **Ivanov Unique / Living Product**:

- approved decisions are the current protected baseline, not immutable forever;
- the Uniqueness criterion remains active while a task is being executed and reviewed, not only when the task is initially proposed;
- if a materially stronger mechanism, logic, interaction or sequence is discovered, the Work Controller must stop the affected task before embedding the weaker approach further;
- the stronger option must be compared against the approved baseline with concrete benefit + dependency + impact/risk;
- no chat may silently replace an Owner-approved product decision;
- material product changes require Owner decision before implementation;
- after approval of a replacement, the old decision is marked superseded and the canonical sources are synchronized before work resumes;
- this interrupt applies to the affected scope only and is not permission to restart unrelated accepted work.

Durable formulation:

**APPROVED / LOCKED = protected current truth, not immunity from a demonstrably better solution.**

**Uniqueness Interrupt Gate:**  
**discover stronger solution → STOP affected work → compare/evidence → impact/risk → Owner decision when material → supersede/sync → continue.**
