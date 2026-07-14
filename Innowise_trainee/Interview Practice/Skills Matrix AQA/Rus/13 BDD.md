# BDD

## Содержание

- [[#Вопросы и ответы]]
	- [[#Что это такое и что нужно знать?]]
	- [[#Какие практические навыки нужны Automation QA?]]
	- [[#Какие ошибки и риски важны?]]
- [[#Требования Intern и Junior]]
- [[#Требования Middle и Senior]]
	- [[#Что означают Given, When, Then, And и But?]]
	- [[#Как работают Feature, Scenario, Background, Scenario Outline и Examples?]]
	- [[#Как Gherkin steps связываются с Java code?]]
	- [[#Что такое Cucumber, SpecFlow и Robot Framework?]]
	- [[#Когда команде стоит использовать BDD?]]
	- [[#Как нужно строить step definitions и hooks?]]
	- [[#Как поддерживать большой BDD suite в CI?]]
- [[#Ссылки на теорию]]

**Связанные заметки:** [[00 Индекс Skills Matrix AQA]]

---

## Вопросы и ответы

### Что это такое и что нужно знать?

**Короткий ответ:**

BDD описывает behaviour через общие examples. Given задаёт context, When — action, Then — observable result; Cucumber связывает Gherkin steps с кодом.

### Какие практические навыки нужны Automation QA?

**Короткий ответ:**

Использовать Feature, Scenario, Background, Scenario Outline, Examples, tags, hooks и reusable step layers; запускать tags и публиковать reports в CI.

### Какие ошибки и риски важны?

**Короткий ответ:**

Избегать technical UI steps, duplicated scenarios, hidden setup, giant step definitions и BDD, если stakeholders не используют examples.

---

## Требования Intern и Junior

- `Feature` описывает business capability, а `Scenario` — один example. `Given` задаёт context, `When` описывает action, `Then` задаёт наблюдаемый outcome. `And` и `But` продолжают предыдущий keyword без изменения смысла.
- `Background` содержит короткие общие preconditions для каждого scenario одного feature. `Scenario Outline` — parameterised scenario; каждая строка `Examples` становится отдельным execution. Tags группируют scenarios и фильтруют run, например `@smoke`.
- Cucumber связывает Gherkin step с Java method через step-definition annotations. `.feature` file запускается через Cucumber runner или по selected tags. Cucumber, SpecFlow и Robot Framework дают читаемые executable examples, но работают в разных language ecosystems.
- Нужно писать business language: «When the customer pays» лучше, чем «When I click CSS selector». Дублирующиеся scenarios не нужны; при одинаковом behaviour меняются data через Scenario Outline.

---

## Требования Middle и Senior

- BDD полезен, когда business, QA и development совместно обсуждают examples. Он не полезен, если feature files пишутся только после code и их никто вне QA не читает. При review проверяются понятный outcome, одно behaviour, meaningful data, отсутствие hidden setup и duplication.
- Hooks `@Before` и `@After` подготавливают и очищают scenario. Они должны быть маленькими и видимыми; business actions в hooks помещать нельзя. Step definition делается тонким, ниже располагаются reusable domain step layer и UI/API clients. Atomic steps раскрывают низкоуровневые actions, а reusable DSL выражает business actions. В feature files лучше DSL.
- Измеряются requirement-to-scenario coverage, execution time, pass rate и flaky rate. Большому suite нужны tag strategy, parallel-safe data, разделённые features и CI selection по tag, branch или changed component.
- Cucumber настраивается через tags, glue packages, dry run, formatter plugins и report paths. CI публикует reports и может передавать results в Jira/Xray или TMS. Contract examples можно связывать с OpenAPI или Pact, но Gherkin scenario не заменяет API contract.

---

## Подробные вопросы и ответы

### Что означают Given, When, Then, And и But?

**Ответ:**

`Given` описывает starting context, `When` — action, а `Then` — observable result. `And` и `But` продолжают предыдущий step в читаемом language. Scenario должен описывать behaviour, а не technical clicks или selectors.

```gherkin
Given a registered customer has an item in the cart
When the customer pays with a valid card
Then the order status is "Paid"
```

### Как работают Feature, Scenario, Background, Scenario Outline и Examples?

**Ответ:**

`Feature` описывает одну business capability. `Scenario` — один concrete example. `Background` содержит короткие shared preconditions для каждого scenario feature и не должен скрывать главное behaviour. `Scenario Outline` — один parameterised scenario, а каждая строка `Examples` становится отдельным execution. Tags, например `@smoke` или `@api`, группируют scenarios и фильтруют run.

### Как Gherkin steps связываются с Java code?

**Ответ:**

Cucumber находит Java methods с annotations `@Given`, `@When` и `@Then`. Text или expression annotation сопоставляется с Gherkin step. Runner запускает selected feature, directory или tag expression. Step definitions должны вызывать workflow или page/API layer, а не содержать длинный Selenium code.

### Что такое Cucumber, SpecFlow и Robot Framework?

**Ответ:**

Cucumber — BDD tool, запускающий Gherkin scenarios с bindings на языках, включая Java. SpecFlow — .NET/C# equivalent с Gherkin. Robot Framework — keyword-driven framework, который тоже может выражать readable acceptance scenarios. Tool выбирается по language, reporting, CI и stakeholder workflow команды.

### Когда команде стоит использовать BDD?

**Ответ:**

BDD полезен, когда product, QA и development должны согласовать shared example до implementation. Он улучшает clarification и создаёт living documentation, если команда поддерживает её актуальность. BDD не подходит, если scenarios пишутся после coding, их читает только QA или feature требует technical unit-level feedback, а не business examples.

### Как нужно строить step definitions и hooks?

**Ответ:**

Step definition должен быть тонким: он переводит Gherkin text в domain action. Reusable workflow или step layer выполняет business action, а page objects или API clients — technical interaction. Hooks `@Before` и `@After` подготавливают и очищают state; они не должны скрытно выполнять action, который должен показать scenario. Это исключает giant step definitions и hidden setup.

### Как поддерживать большой BDD suite в CI?

**Ответ:**

Нужны meaningful tags, fast feedback groups, parallel-safe data и отдельные UI, API и integration suites. Отслеживаются requirement coverage, execution time, pass rate и flaky rate. Cucumber настраивается через tag filters, glue packages, dry run, formatter plugins и report paths. CI может публиковать results в Jira/Xray или TMS и запускать impacted scenarios, но contract checks OpenAPI или Pact остаются отдельными tests.

---

## Ссылки на теорию

- [[20 Архитектура фреймворка автотестов]]
