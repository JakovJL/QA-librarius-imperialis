# CI-CD

## Содержание

- [[#Область матрицы]]
- [[#Вопросы и ответы]]
	- [[#Что такое Continuous Integration?]]
	- [[#Чем Continuous Delivery отличается от Continuous Deployment?]]
	- [[#Что происходит в базовом pipeline после commit?]]
	- [[#Как настроить базовый CI job?]]
	- [[#Чем отличается pipeline для микросервисов?]]
	- [[#Что такое Quality Gates и Infrastructure as Code?]]
	- [[#Что важно знать о pipeline scripts?]]
	- [[#Чем отличаются распространённые CI-инструменты?]]
- [[#Ссылки на теорию]]

**Связанные заметки:** [[00 Индекс Skills Matrix AQA]]

---

## Область матрицы

Эта заметка покрывает:

- Continuous Integration, Continuous Delivery и Continuous Deployment.
- Базовые jobs и pipelines в Jenkins, TeamCity, GitLab CI, CircleCI, Bamboo или Azure DevOps.
- Уровни Test Pyramid, Quality Gates, микросервисы, Infrastructure as Code, linters и Static Analysis.

---

## Вопросы и ответы

### Что такое Continuous Integration?

**Короткий ответ:**

Continuous Integration означает частое объединение небольших изменений разработчиков и их автоматическую проверку в pipeline. Типичный CI выполняет build, быстрые тесты, Static Analysis, создаёт artifact и быстро сообщает результат.

### Чем Continuous Delivery отличается от Continuous Deployment?

**Короткий ответ:**

Continuous Delivery поддерживает каждое одобренное изменение готовым к production, но релиз требует ручного бизнес-решения. Continuous Deployment автоматически выпускает каждое изменение, прошедшее pipeline. Оба подхода требуют надёжных тестов, мониторинга, rollback и управляемой конфигурации.

### Что происходит в базовом pipeline после commit?

**Короткий ответ:**

Pipeline получает код, восстанавливает dependencies, выполняет build, linters и Unit tests, затем Integration или API tests, создаёт artifact и может развернуть тестовое окружение для небольшого E2E suite. Быстрые нижние уровни запускаются первыми, чтобы рано остановить неуспешный процесс.

### Как настроить базовый CI job?

**Короткий ответ:**

Я задаю trigger, repository и branch, runtime и dependencies, environment variables или ссылки на secrets, команды build и tests, timeouts, artifacts, reports и notifications. Secrets хранятся в защищённом хранилище CI, а конфигурация job — в Version Control System.

### Чем отличается pipeline для микросервисов?

**Короткий ответ:**

Pipeline микросервиса по возможности собирает и проверяет только затронутые сервисы. Обычно он добавляет Contract tests, сканирование container image, Service Integration tests, публикацию image, deployment окружения, Smoke checks и постепенный rollout. Важны совместимость версий и общие зависимости.

### Что такое Quality Gates и Infrastructure as Code?

**Короткий ответ:**

Quality Gate блокирует продвижение, если не выполнены согласованные условия: тесты, linting, Security scanning, политика покрытия или критические проблемы Static Analysis. Infrastructure as Code хранит определения окружений в Version Control System для review и воспроизводимости. Gate должен отражать реальный риск, а не одну метрику.

### Что важно знать о pipeline scripts?

**Короткий ответ:**

Pipeline scripts могут использовать YAML, Groovy, shell или PowerShell. Я делаю steps небольшими, безопасно работаю с переменными, проверяю exit codes, использую `try/finally` или post-actions для cleanup и reports и не вывожу secrets. Сложная переиспользуемая логика должна поддерживаться как обычный код.

### Чем отличаются распространённые CI-инструменты?

Jenkins обычно использует `Jenkinsfile` и синтаксис Groovy pipeline. TeamCity использует build configurations и Kotlin DSL, если configuration хранится как code. Bamboo и Azure DevOps также определяют jobs, agents, variables, artifacts и permissions; Azure DevOps работает с Git или TFVC repositories. GitLab CI использует `.gitlab-ci.yml`, а CircleCI — `.circleci/config.yml`. Синтаксис различается, но для любого job нужны trigger, runner или agent, commands, inputs, artifacts, reports и безопасная работа с secrets.

**Sonar и linters:**

Linter проверяет style кода и простые правила корректности. SonarQube или SonarCloud добавляет Static Analysis и может применять Quality Gate. Например, pipeline сначала запускает Unit tests и coverage, отправляет анализ в Sonar и блокирует продвижение только при нарушении согласованного gate.

**Continuous Delivery на практике:**

После успешных тестов и проверок pipeline публикует versioned artifact или image, разворачивает его в test или staging environment, запускает Smoke checks и ожидает разрешённого действия для production. Continuous Deployment убирает это последнее ручное release action, поэтому monitoring, rollback и безопасные стратегии deployment становятся обязательными.

---

## Ссылки на теорию

- [[19 CI-CD с GitHub Actions]]
