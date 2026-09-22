# DECISION LOG

Този файл съдържа важните Owner решения, които бъдещ чат трябва да знае, за да не възстановява стара или погрешно разбрана посока.

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

### Оставащо Owner решение
Дали изпратената клиентска оферта чете live working project или публикувана immutable/revision snapshot версия. Work Controller препоръчва публикувани revisions, но това още не е заключено.

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

Към момента `Traqnivanov/ivanov-remonti-3d` е PUBLIC.

Това не е променено автоматично.

Преди да започне съществен proprietary implementation, Owner трябва изрично да реши:
- repo да стане private; или
- public docs и private implementation да се разделят.

Причина: публичното repo противоречи на целта да не се улеснява копирането на реалната имплементация.

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
