# Software Engineering Practices

## Содержание

- [[#Вопросы и ответы]]
	- [[#Что такое OOP и почему оно важно в test automation?]]
	- [[#Чем отличаются encapsulation, inheritance, polymorphism и abstraction?]]
	- [[#Когда использовать composition, interfaces или inheritance?]]
	- [[#Какие design patterns помогают test framework?]]
	- [[#Что такое functional programming и когда оно полезно?]]
	- [[#Как lambdas, higher-order functions и streams помогают test code?]]
	- [[#Что означает SOLID в test framework?]]
	- [[#Почему важны code standards, linters и static analysis?]]
	- [[#Что такое code smells и как на них реагировать?]]
	- [[#Что такое refactoring и как выполнять его безопасно?]]
	- [[#Как выглядит полезный code review?]]
	- [[#Как отлаживать простое падение test?]]
	- [[#Как отлаживать сложные проблемы framework и concurrency?]]
	- [[#Что ожидается от senior engineer в engineering practices?]]
- [[#Ссылки на теорию]]

**Связанные заметки:** [[00 Индекс Skills Matrix AQA]]

---

## Вопросы и ответы

### Что такое OOP и почему оно важно в test automation?

**Ответ:**

Object-oriented programming (OOP) организует code вокруг objects, которые объединяют data и behaviour. В automation framework object может представлять page, UI component, API client, test data или configuration.

OOP облегчает изменение test, когда у каждого class есть ясная responsibility. Это не значит, что для каждого небольшого value нужен отдельный class.

### Чем отличаются encapsulation, inheritance, polymorphism и abstraction?

**Ответ:**

Encapsulation скрывает internal details за небольшим public API. Например, `LoginPage` может предоставлять `login(user)`, а не позволять tests работать с её locators. Inheritance позволяет child class переиспользовать или расширять parent type. Polymorphism даёт code возможность использовать разные implementations через один общий type. Abstraction выделяет нужное behaviour и скрывает лишние details.

Эти concepts нужно объяснять на реальном примере framework, а не только определениями из учебника.

### Когда использовать composition, interfaces или inheritance?

**Ответ:**

Composition используется, когда у class есть dependency: например, page object имеет `WebDriver`, а API client — HTTP transport. Interface нужен, когда callers используют одну capability у нескольких implementations, например у реального и stub notification client. Inheritance подходит только для настоящего отношения «is-a» и стабильного общего contract.

Глубокие base classes часто скрывают setup и делают tests хрупкими. Лучше предпочитать маленькие composed objects inheritance, используемому только ради нескольких общих methods.

### Какие design patterns помогают test framework?

**Ответ:**

Page Object хранит actions и locators page вне test scenarios. Factory создаёт подходящий driver, API client или test object по configuration. Builder делает complex test data читаемыми. Strategy выбирает заменяемое behaviour, например authentication method или retry policy. Singleton допустим для действительно shared immutable configuration, но может усложнить parallel tests и isolation.

Pattern выбирают, потому что он решает существующую проблему. Нельзя добавлять patterns, только чтобы framework выглядел сложнее.

### Что такое functional programming и когда оно полезно?

**Ответ:**

Functional programming рассматривает functions как values и стремится к предсказуемым operations. Pure function возвращает одинаковый result для одинакового input и не имеет видимого side effect. Immutability означает, что operation возвращает новые data, а не меняет shared data.

Эти ideas полезны для transformations test data, проверок response и небольших utilities. Они уменьшают hidden state и упрощают unit test. Продвинутые ideas, например currying, memoization или monads, нужны только если делают project понятнее; их нельзя использовать только ради стиля.

### Как lambdas, higher-order functions и streams помогают test code?

**Ответ:**

Lambda — короткое function expression. Higher-order function принимает function или возвращает её. В Java streams могут применять `filter`, `map` и `reduce` к последовательности elements. Это удобно для выбора test data или преобразования API results в понятные assertions.

Функции в stream должны быть stateless; нельзя изменять source collection во время stream pipeline. Простой loop лучше, когда он понятнее или debugging сложного stream будет трудным.

### Что означает SOLID в test framework?

**Ответ:**

SOLID — пять design guidelines:

- Single Responsibility: у class одна главная причина измениться.
- Open/Closed: behaviour расширяется через стабильный design, а не изменением множества existing callers.
- Liskov Substitution: заменяющая implementation соблюдает тот же contract.
- Interface Segregation: clients зависят от маленьких нужных interfaces, а не от большого interface с неиспользуемыми methods.
- Dependency Inversion: высокоуровневая test logic зависит от abstractions, а не напрямую от конкретного driver, client или storage.

Например, test scenario не должен напрямую зависеть от конкретной HTTP library, если interface `OrderClient` выражает нужное action. SOLID нужно применять, когда он уменьшает риск изменений; чрезмерное число layers тоже усложняет поддержку.

### Почему важны code standards, linters и static analysis?

**Ответ:**

Code standards делают naming, formatting, imports, error handling и test structure единообразными. Это уменьшает шум в review и облегчает чтение code. Formatter, linter и static analyser могут автоматически найти многие повторяемые проблемы: unused code, risky constructs или возможные null errors.

Команда должна согласовать rules, запускать checks локально и в CI, а warnings исправлять или явно обосновывать. Успешный linter не доказывает, что test имеет корректные business assertions.

### Что такое code smells и как на них реагировать?

**Ответ:**

Code smell — сигнал о возможном design debt, но не автоматический bug. Распространённые smells: duplicate code, long method, large class, длинные parameter lists, complex conditionals, feature, который слишком зависит от другого class, и hidden mutable state.

Сначала нужно определить вред: сложный review, медленное изменение, flaky test или высокий risk errors. Затем выбрать небольшое подходящее изменение: Extract Method, Rename, Introduce Parameter Object или Replace Conditional with Polymorphism. Нельзя делать большой rewrite только потому, что у smell есть название.

### Что такое refactoring и как выполнять его безопасно?

**Ответ:**

Refactoring меняет internal design без изменения ожидаемого observable behaviour. Его цель — более понятный, безопасный и поддерживаемый code. Распространённые techniques: Rename, Extract Method, Extract Class, Move Method и замена duplication общим helper.

Refactoring защищают relevant automated tests и небольшие reviewable commits. Сначала нужно понять текущее behaviour, затем изменить один concern, запустить checks и изучить diff. Не следует смешивать большой refactoring с несвязанной feature или bug fix без ясной причины.

### Как выглядит полезный code review?

**Ответ:**

Code review проверяет correctness, test coverage, readability, maintainability, security и risk. Author должен описать goal, важный design choice, способ проверки и известные limits. Reviewer читает requirement и даёт specific, respectful feedback с объяснением impact.

Сначала проверяются correctness и risk, а затем небольшие style comments. Хороший review задаёт вопросы, предлагает alternatives при необходимости и принимает обоснованное решение. Senior reviewers помогают решать разногласия, менторят участников и поддерживают practical team standards.

### Как отлаживать простое падение test?

**Ответ:**

Нужно воспроизвести failure и прочитать assertion message, stack trace, test logs, screenshots или request/response evidence. Breakpoint, step into или step over и просмотр variables помогают найти первое value, которое отличается от ожидания.

До изменения code проверить test data, configuration, timing, locator или request details и environment. После исправления запустить узкий test и нужные более широкие checks. Нельзя добавлять wait или retry только для скрытия необъяснённого failure.

### Как отлаживать сложные проблемы framework и concurrency?

**Ответ:**

Для сложной проблемы нужно сузить failing path через correlation IDs, structured logs и minimal reproduction. Conditional breakpoints могут остановить execution только на нужном input. Remote debugging позволяет исследовать process в test environment, но его нужно включать безопасно и использовать осторожно.

Для concurrency следует проверить thread states, shared mutable data, locks, timeouts и порядок events. Failure, исчезающий под debugger, может быть timing problem. Для CPU, allocations, garbage collection и роста memory нужен profiler, а не предположение по одному slow test.

### Что ожидается от senior engineer в engineering practices?

**Ответ:**

Senior engineer осознанно выбирает architecture, распознаёт subtle smells и anti-patterns, планирует безопасный refactoring через несколько framework layers. Он настраивает и улучшает quality checks, делает review сложных изменений, менторит коллег и ясно объясняет trade-offs.

Он способен исследовать незнакомый code и production-like failures: performance, memory leaks, garbage-collection pressure, integrations и concurrency. Цель — не самый абстрактный design, а надёжный framework, который команда понимает и может менять.

---

## Ссылки на теорию

- [[23 Инженерные практики для AQA]]
