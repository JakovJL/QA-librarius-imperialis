# Управление проектом и Package Manager

## Содержание

- [[#Область матрицы]]
- [[#Вопросы и ответы]]
	- [[#Зачем нужны Package и Build Tools?]]
	- [[#Как работает Maven?]]
	- [[#Чем Gradle отличается от Maven?]]
- [[#Как npm и Yarn управляют JavaScript-проектом?]]
- [[#Как управлять dependencies и versions?]]
- [[#Что такое lock files и нужно ли их коммитить?]]
	- [[#Как работают repositories и параметры build?]]
- [[#Ссылки на теорию]]

**Связанные заметки:** [[00 Индекс Skills Matrix AQA]]

---

## Область матрицы

Эта заметка покрывает:

- Назначение package и build tools: Maven, Gradle, Ant, npm, Yarn, pip, NuGet и Poetry.
- Dependencies, repositories, lifecycle tasks, configuration, versions и lock files.
- Сторонние repositories и параметризация build.

---

## Вопросы и ответы

### Зачем нужны Package и Build Tools?

**Короткий ответ:**

Они загружают и управляют dependencies, разрешают versions, компилируют код, запускают тесты, создают artifacts и дают повторяемые команды для локальной работы и CI. Примеры: Maven и Gradle для Java, npm или Yarn для JavaScript, pip или Poetry для Python и NuGet для .NET.

### Как работает Maven?

**Короткий ответ:**

Maven использует `pom.xml` для project coordinates, properties, dependencies, plugins, repositories и build settings. У Maven есть три встроенных lifecycle: `default`, `clean` и `site`. `clean` является phase lifecycle `clean`, а `compile`, `test`, `package`, `verify` и `install` — phases lifecycle `default`. При контролируемых inputs команды должны давать одинаковый результат локально и в CI.

### Чем Gradle отличается от Maven?

**Короткий ответ:**

Gradle использует программируемую build model с Groovy или Kotlin DSL и task graph. Он гибкий и поддерживает incremental build и caching. Maven сильнее основан на conventions и XML. Оба управляют Java dependencies и tests; проекту не нужна лишняя сложная build logic.

### Как npm и Yarn управляют JavaScript-проектом?

**Короткий ответ:**

`package.json` описывает JavaScript-проект: его имя, version, scripts, dependencies, development dependencies и configuration. Script запускается через `npm run <script>` или `yarn <script>`. Значение можно передать через environment variable, если проект его поддерживает: `BASE_URL=https://test.example npm run test`.

**Dependencies:**

- `dependencies` нужны при запуске приложения в production.
- `devDependencies` используются для разработки, тестирования, linting или build.
- `npm install <package>` добавляет runtime dependency, а `npm install -D <package>` — development dependency. У Yarn есть аналогичные команды.
- При production installation можно не устанавливать development dependencies, например через `npm ci --omit=dev`.

### Как управлять dependencies и versions?

**Короткий ответ:**

Dependency declaration содержит group, artifact, version и scope или configuration. Я контролирую versions, проверяю transitive dependencies и при необходимости использую dependency locking или Bill of Materials. SemVer использует `major.minor.patch`: major-изменение может нарушить совместимость, а minor и patch по правилам SemVer должны быть обратно совместимы.

В npm диапазон `1.2.3` означает точную version, `^1.2.3` разрешает совместимые versions ниже `2.0.0`, `~1.2.3` — patch updates ниже `1.3.0`, а `*` разрешает любую version. При обычной воспроизводимой установке committed lock file имеет приоритет: package manager установит указанную в нём точную version, а не более новую version, разрешённую `^` или `~`.

### Что такое lock files и нужно ли их коммитить?

**Короткий ответ:**

npm, Yarn и Poetry используют lock files для точных разрешённых versions. `package-lock.json` относится к npm, а `yarn.lock` — к Yarn. Для applications их обычно коммитят, чтобы локальная установка и CI были воспроизводимыми. Maven и Gradle используют другие механизмы dependency locking, а не `package-lock.json`.

### Как работают repositories и параметры build?

**Короткий ответ:**

Dependencies могут приходить из public или private repositories: Maven Central, внутренний Nexus или Artifactory. Credentials хранятся в защищённых settings, а не в source files. Build parameters могут выбирать environment, tags, browser или feature flags, но значения нужно проверять и документировать defaults. Примеры: Maven `-Denv=test`, Gradle `-Penv=test` или environment variable npm.

**Установка библиотеки:**

- Java: dependency объявляется в `pom.xml` или `build.gradle`; Maven или Gradle получит её из настроенного repository.
- JavaScript: используется `npm install <package>` или `yarn add <package>`.
- Python: используется `pip install <package>`.
- Ant: библиотека добавляется в classpath проекта, обычно через задачу dependency management или repository tool.

---

## Ссылки на теорию

- [[15 Сборочные инструменты Maven Gradle]]
