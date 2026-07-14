# Business Focus

## Содержание

- [[#Вопросы Intern / Junior]]
	- [[#Как определить важные для бизнеса пользовательские сценарии?]]
	- [[#Как понять, что дефект важен для пользователя, а не только технически?]]
	- [[#Какие действия пользователя наиболее критичны для бизнеса и почему?]]
	- [[#Почему QA должен понимать, зачем бизнес создаёт feature?]]
	- [[#Как узнать, что новая feature может ухудшить User Experience?]]
	- [[#Почему неудобный дефект может быть проблемой для бизнеса?]]
	- [[#Как объяснить, что небольшой UI-дефект важен?]]
	- [[#Какие вопросы задать PM или analyst о новой feature?]]
	- [[#Почему QA должен знать, какие действия пользователя приносят revenue?]]
	- [[#Что показывает сильный Business Potential продукта?]]
- [[#Вопросы Middle]]
	- [[#Что такое Business Flow и как найти его критичные сценарии?]]
	- [[#Как работа QA влияет на Business Metrics и User Experience?]]
	- [[#Как увидеть успешное Scaling или Stagnation продукта?]]
	- [[#Как выбрать наиболее критичные для бизнеса пользовательские сценарии?]]
	- [[#Как бизнес-модель меняет Test Strategy?]]
	- [[#Какие Product Metrics могут ухудшить проблемы качества?]]
	- [[#Как связать технический дефект с User Behaviour и Business Metrics?]]
	- [[#Какие дефекты чаще всего приводят к потере Users или Revenue?]]
	- [[#Как приоритизировать тестирование перед Release при нехватке времени?]]
	- [[#Как оценить Release Risk с точки зрения бизнеса?]]
	- [[#Почему QA должен понимать Customer Journey, а не только features?]]
	- [[#Как проверить, что новая feature решает бизнес-проблему?]]
	- [[#Какие вопросы выявляют скрытые Business Risks новой functionality?]]
	- [[#Как понять, что дефект влияет на KPI, а не только на UX?]]
	- [[#Как объяснить бизнесу необходимость дополнительного времени на testing?]]
- [[#Вопросы Senior]]
	- [[#Как качество тестирования влияет на Revenue, Retention и User Trust?]]
	- [[#Какие сигналы показывают здоровье или деградацию продукта?]]
	- [[#Как QA может влиять на Product Decisions, а не только на качество реализации?]]
	- [[#Как оценивать ROI тестирования?]]
	- [[#Как выбирать Quality Investments, которые создают Business Value?]]
	- [[#Как связать QA Metrics с Business KPI?]]
	- [[#Какие редкие defects наиболее опасны для бизнеса?]]
	- [[#Как QA снижает финансовый и репутационный risk?]]
	- [[#Как увидеть, что команда тестирует технические details вместо Business Value?]]
	- [[#Как выстроить Risk-Based Testing для High-Revenue functionality?]]
	- [[#Как QA может поддержать решение Go или No-Go?]]
	- [[#Как объяснить Business Value Non-Functional Testing?]]
	- [[#Как оценить возможный impact production-инцидента до Release?]]
	- [[#Как QA помогает снизить Churn и повысить Retention?]]
	- [[#Какие сигналы показывают потерю Product Thinking командой?]]
	- [[#Как найти баланс между скоростью Delivery и Acceptable Business Risk?]]
	- [[#Как QA участвует в Product Discovery, а не только Delivery?]]

**Связанные заметки:** [[00 Индекс Skills Matrix AQA]]

---

## Вопросы Intern / Junior

### Как определить важные для бизнеса пользовательские сценарии?

**Ответ:**

Я определяю главное обещание продукта и действия, через которые пользователь получает эту ценность. В первую очередь важны scenarios, создающие revenue, часто используемые, затрагивающие много users, работающие с деньгами или personal data и необходимые по закону. Выбор подтверждают analytics, support tickets, product owners и прошлые incidents.

### Как понять, что дефект важен для пользователя, а не только технически?

**Ответ:**

Я выясняю, какую цель пользователя дефект блокирует или усложняет, как часто он возникает, сколько users его видят и есть ли безопасный workaround. Дефект важен для бизнеса, когда он может снизить completion задачи, деньги, trust, accessibility или capacity support.

### Какие действия пользователя наиболее критичны для бизнеса и почему?

**Ответ:**

Ответ зависит от продукта. Обычно критичны sign-up, login, поиск продукта, создание order, payment, сохранение важных data и renewal. Они важны, потому что дают основную user value или прямо влияют на revenue, retention, compliance и trust.

### Почему QA должен понимать, зачем бизнес создаёт feature?

**Ответ:**

Знание только behaviour показывает, работает ли feature. Знание business goal показывает, какие risk, user segment, metric и негативный outcome наиболее важны. Это помогает выбрать полезные scenarios и описать defect в форме, нужной команде для решения.

### Как узнать, что новая feature может ухудшить User Experience?

**Ответ:**

Я сравниваю новый flow с текущим Customer Journey и проверяю лишние steps, непонятный text, errors, performance, accessibility и mobile behaviour. Я уточняю target user и success metric, затем тестирую normal, edge и failure paths. Feedback prototype, beta users или support может показать вред, который не видно в happy-path test.

### Почему неудобный дефект может быть проблемой для бизнеса?

**Ответ:**

Friction может заставить users бросить flow, даже если он технически завершается. Например, непонятная validation около payment снижает conversion, создаёт обращения в support и уменьшает trust. Impact зависит от flow, audience, frequency и наличия workaround.

### Как объяснить, что небольшой UI-дефект важен?

**Ответ:**

Я не называю defect небольшим без context. Если он скрывает главную button, делает price нечитаемой, ломает accessibility или выглядит небезопасно на checkout, он может заблокировать ценное action пользователя. Я показываю затронутый journey, ожидаемый impact на metric, screenshots и risk, если defect не исправить.

### Какие вопросы задать PM или analyst о новой feature?

**Ответ:**

Я спрашиваю: кто target user, какую problem решает feature, какое behaviour означает успех и какая metric должна измениться. Также уточняю business rules, priorities, unhappy paths, legal или privacy limits, dependencies, rollout plan и последствия failure feature.

### Почему QA должен знать, какие действия пользователя приносят revenue?

**Ответ:**

Это помогает QA сначала защищать actions с наибольшим business impact. Revenue бывает прямым, например payment, или косвенным, например activation, ведущая к renewal subscription. Такое знание делает Risk-Based Testing и communication о release более полезными.

### Что показывает сильный Business Potential продукта?

**Ответ:**

Полезные признаки: ясная проблема customer, определённый target user, evidence demand, жизнеспособная value или revenue model, повторное использование или retention и economics, поддерживающая рост. Это hypotheses, пока product data и customer feedback их не подтвердят.

---

## Вопросы Middle

### Что такое Business Flow и как найти его критичные сценарии?

**Ответ:**

Business Flow — end-to-end path, который создаёт value для user и компании, например путь от search до paid order. Я строю actors, steps, data, integrations, rules и result, затем ранжирую scenarios по impact, frequency, вероятности failure, compliance и сложности recovery.

### Как работа QA влияет на Business Metrics и User Experience?

**Ответ:**

QA предотвращает или обнаруживает failures, меняющие user behaviour. Checkout defect может уменьшить conversion и revenue; crash в onboarding — activation и retention; slow pages — увеличить abandonment. QA не владеет metric единолично, но даёт evidence и снижает risk, который на неё влияет.

### Как увидеть успешное Scaling или Stagnation продукта?

**Ответ:**

Я сравниваю trends с baseline: active users, conversion, revenue, retention, churn, support load, latency, error rate, cost per transaction и capacity. Growth здоров, только если reliability, user outcomes и unit economics остаются приемлемыми. Stagnation проявляется flat activation, падением retention, слабой conversion или ростом support и incidents.

### Как выбрать наиболее критичные для бизнеса пользовательские сценарии?

**Ответ:**

Я составляю список scenarios из Customer Journey, analytics, product goals и известных incidents. Для каждого оцениваю business impact, user reach, change risk, likelihood failure и возможность recovery или rollback. Наибольшие combined risks получают самое глубокое test coverage первыми.

### Как бизнес-модель меняет Test Strategy?

**Ответ:**

Стратегия должна защищать способ создания value продуктом. E-commerce нужны discovery, checkout, payment и fulfilment; subscription product также нуждаются onboarding, billing, renewal и cancellation; advertising product — точные tracking и reporting. Бизнес-модель также меняет главные risks fraud, privacy, reliability и revenue.

### Какие Product Metrics могут ухудшить проблемы качества?

**Ответ:**

Проблемы качества могут ухудшить activation, conversion, successful payments, revenue, retention, churn, task completion, refund rate, support contacts, crash rate, latency и customer satisfaction. Нужно выбирать metric, на которую затронутое action пользователя реально может повлиять, и не заявлять прямую causal link без evidence.

### Как связать технический дефект с User Behaviour и Business Metrics?

**Ответ:**

Я строю цепочку: technical failure, затронутое action пользователя, изменённое user behaviour и возможный impact KPI. Например, expired token во время checkout останавливает payment, увеличивает abandoned orders и снижает conversion. Цепочку подтверждают logs, analytics, experiments, support data или incident evidence, если они доступны.

### Какие дефекты чаще всего приводят к потере Users или Revenue?

**Ответ:**

Частые примеры: failures в sign-up, login, search, checkout, payment, renewal, data saving, privacy, security, availability и performance. Редкий defect может быть опаснее частого minor defect, если у него большой blast radius, financial loss, legal exposure или долгий trust damage.

### Как приоритизировать тестирование перед Release при нехватке времени?

**Ответ:**

Я применяю Risk-Based Testing: impact умножается на likelihood с учётом размера change, integration risk и возможностей recovery. Сначала проверяю critical revenue, safety и data flows, изменённые areas, main platforms, known defect zones, monitoring и rollback. Затем сообщаю о непроверенном scope и remaining risk, чтобы owners приняли осознанное решение.

### Как оценить Release Risk с точки зрения бизнеса?

**Ответ:**

Я учитываю test evidence, open defects, missing coverage, затронутых users, business timing, compliance, возможные loss, blast radius, observability, readiness support и rollback. Технически minor failure может быть high risk во время campaign или для payment flow. Результат — ясное risk statement с options, а не только pass/fail status.

### Почему QA должен понимать Customer Journey, а не только features?

**Ответ:**

User проходит journey через features, devices, services и время. Feature может пройти локальные tests, но не сработать, потому что предыдущий step сохранил неправильные data или следующий не использует result. Знание journey находит cross-feature gaps и направляет testing на нужный user outcome.

### Как проверить, что новая feature решает бизнес-проблему?

**Ответ:**

До разработки я уточняю target user, problem, hypothesis, baseline, expected behaviour и success metric. Я проверяю полный journey и negative paths, а после release сравниваю usage, conversion, feedback и support data с baseline. Работающие buttons или API необходимы, но не доказывают, что problem решена.

### Какие вопросы выявляют скрытые Business Risks новой functionality?

**Ответ:**

Я спрашиваю, кому может повредить failure feature, какие data или деньги меняются, что происходит при retry или partial failure и какие integrations нужны. Также уточняю abuse, privacy, accessibility, legal rules, rollback, monitoring, support process, rollout segments и стоимость неправильного result.

### Как понять, что дефект влияет на KPI, а не только на UX?

**Ответ:**

Я определяю funnel step, на который влияет defect, и сравниваю behaviour до и после него: completion, abandonment, errors, support contacts, refunds или retention. Segment analysis может показать, что затронутые users хуже конвертируются или возвращаются. Это evidence impact, но correlation всё ещё нужно осторожно интерпретировать до вывода о causation.

### Как объяснить бизнесу необходимость дополнительного времени на testing?

**Ответ:**

Я называю change, test evidence, scenarios, которые остались непроверенными, вероятный impact и причину отсутствия покрытия risk. Затем предлагаю options: уменьшить scope, отложить release, добавить capacity, применить staged rollout или принять явный risk. Разговор защищает решение, а не просит время без evidence.

---

## Вопросы Senior

### Как качество тестирования влияет на Revenue, Retention и User Trust?

**Ответ:**

Качество защищает actions, создающие value, и reliability, ожидаемую users. Failed payments или unavailable features могут сразу снизить revenue; повторяющиеся crashes, slow flows, data loss и плохое recovery со временем снижают retention и trust. Test quality уменьшает эти risks, но должна сочетаться с product design, operations и customer support.

### Какие сигналы показывают здоровье или деградацию продукта?

**Ответ:**

Я отслеживаю balanced set signals: activation, conversion, revenue, retention, churn, complaints, refunds, incidents, error rate, latency, crash rate, availability и cost per transaction. Trends сравниваются с baseline, release changes и seasonality. Одна зелёная metric не доказывает, что product здоров.

### Как QA может влиять на Product Decisions, а не только на качество реализации?

**Ответ:**

QA может принести в discovery risks Customer Journey, failure scenarios, production evidence и measurable acceptance criteria. Мы можем оспаривать assumptions, предлагать experiments, определять observability и показывать, какой scope имеет лучший balance risk и value. QA даёт recommendations по evidence, а product owners определяют направление продукта.

### Как оценивать ROI тестирования?

**Ответ:**

Я сравниваю cost investment с ожидаемыми avoided losses и быстрым feedback: меньше incidents, manual work, release delay, support cost, legal и reputation risk. Выбираю measurable baseline и проверяю results после investment. ROI — estimate, поэтому assumptions и uncertainty должны быть видны.

### Как выбирать Quality Investments, которые создают Business Value?

**Ответ:**

Я приоритизирую повторяющиеся high-impact problems, дорогие incidents, slow feedback loops, слабое critical-flow coverage и risks, блокирующие safe delivery. Для каждого option определяю expected outcome, owner, cost, leading signal и review date. Investment ценна, когда улучшает meaningful outcome, а не только добавляет tools или test count.

### Как связать QA Metrics с Business KPI?

**Ответ:**

Я связываю QA signal с user behaviour, а затем с KPI. Например, escaped payment defects могут уменьшить successful purchases и revenue; flaky tests задерживают feedback и delivery; слабое critical-flow coverage повышает release risk. Такая map направляет investigation и decisions, но correlation сама по себе не доказывает cause.

### Какие редкие defects наиболее опасны для бизнеса?

**Ответ:**

Редкие failures, связанные с payment, data loss, privacy, security, legal reporting, account access или irreversible actions, могут быть тяжёлыми. Их frequency мала, но один event может затронуть многих users, вызвать financial loss, regulatory action или разрушить trust. Приоритет задают severity и blast radius, а не только occurrence count.

### Как QA снижает финансовый и репутационный risk?

**Ответ:**

QA рано находит high-impact scenarios, тестирует failure и recovery paths, проверяет controls и делает remaining risk видимым до release. Мы также поддерживаем monitoring, alerting, reproduction incidents и post-incident learning. Ясное evidence помогает owners предотвратить опасный release или подготовить safe mitigation.

### Как увидеть, что команда тестирует технические details вместо Business Value?

**Ответ:**

Warning signs: успех измеряют только test count или pass rate, tests не связаны с Customer Journey или outcomes, а много усилий идёт на low-impact details при gaps в critical flows. Фокус возвращают flow map, risk-based scope, measurable acceptance criteria и feedback production.

### Как выстроить Risk-Based Testing для High-Revenue functionality?

**Ответ:**

Я строю flow от entry до денег или renewal, включая data, integrations, fraud или security controls, errors, retries и recovery. Scenarios ранжируются по loss, user reach, likelihood, detectability и сложности rollback. План даёт глубокое coverage top risks, а также monitoring и rollback или mitigation plan для release.

### Как QA может поддержать решение Go или No-Go?

**Ответ:**

QA предоставляет evidence: выполненное и отсутствующее coverage, open defects, impact, affected segments, monitoring, rollback readiness и residual risk. Я ясно показываю trade-offs и рекомендую options: go, limited rollout, delay или reduced scope. QA информирует decision; его принимают уполномоченные business и technical owners.

### Как объяснить Business Value Non-Functional Testing?

**Ответ:**

Performance защищает completion и revenue под load. Resilience защищает availability и recovery при failures dependencies или infrastructure. Security и privacy testing защищают users, compliance, деньги и trust. Я объясняю каждую область через реалистичный user incident, вероятные loss, detection, recovery и cost prevention.

### Как оценить возможный impact production-инцидента до Release?

**Ответ:**

Я оцениваю affected users и flows, возможные data или money loss, legal exposure, trust damage, time to detect, time to recover и возможность rollback. Использую прошлые incidents, traffic volume, знание dependencies и failure tests, если они есть. Результат — range с assumptions, а не ложное точное number.

### Как QA помогает снизить Churn и повысить Retention?

**Ответ:**

QA защищает onboarding, delivery основной value, reliability, performance, data safety, renewals, cancellation flows и recovery from errors. Я отслеживаю retention cohorts, failed journeys, complaints, crashes и incidents, затем исследую и тестирую причины с наибольшим impact. QA не владеет churn единолично, но предотвращает quality failures, которые отталкивают users.

### Какие сигналы показывают потерю Product Thinking командой?

**Ответ:**

Команда может тестировать только написанное в ticket, измерять успех только execution numbers, игнорировать user outcomes и принимать defects без обсуждения impact. Другой сигнал — отсутствие learning после releases или incidents. Product Thinking возвращается через обсуждение problem пользователя, ожидаемой metric, assumptions, risks и evidence после release.

### Как найти баланс между скоростью Delivery и Acceptable Business Risk?

**Ответ:**

Сначала нужно сделать risk явным: что может failed, кого это затронет, насколько вероятно, как problem обнаружат и восстановятся. Затем выбирается пропорциональный control: уменьшить scope, добавить focused tests, использовать feature flag или staged rollout, улучшить monitoring или отложить. Speed ценна, пока remaining risk принят правильными owners.

### Как QA участвует в Product Discovery, а не только Delivery?

**Ответ:**

QA участвует в ранних обсуждениях и спрашивает о problem пользователя, assumptions, edge cases, data, misuse, failure modes и success measures. Мы помогаем определить experiments, acceptance criteria, testability, observability и safe rollout до появления code. Это уменьшает поздние surprises, а Delivery Testing всё равно проверяет implementation.
