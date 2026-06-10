# Практика — QA Issue Tracker

## Содержание

- [[#Как пользоваться этим проектом]]
- [[#Обзор проекта]]
- [[#Настройка проекта]]
- [[#Моделирование бага через переменные]]
- [[#Логика триажа]]
- [[#Класс Bug]]
- [[#Иерархия Issue]]
- [[#Интерфейсы и абстракция]]
- [[#Enum'ы Severity и Status]]
- [[#Форматтер отчётов]]
- [[#Ссылки и равенство]]
- [[#Generic-репозиторий]]
- [[#Репозиторий на коллекциях]]
- [[#Валидация и кастомные исключения]]
- [[#Запросы через Stream и Optional]]
- [[#Аннотации и Reflection]]
- [[#Сохранение в файл]]
- [[#Перевод проекта на Maven]]
- [[#Модульные тесты на JUnit 5]]
- [[#UI-тесты на Selenium]]

**Связанные заметки:** [[AQA Java rus]]

---

## Как пользоваться этим проектом

Это **один сквозной проект**, а не 18 отдельных задач. Вы строите небольшой **QA Issue Tracker** на Java, и каждое задание переиспользует код, написанный ранее. К концу у вас будет настоящий Maven-проект с юнит-тестами и UI-тестами — работа для портфолио, затрагивающая каждую тему Модуля 2.

**Правила:**
- Работайте в **одном и том же проекте** всё время. Никогда не удаляйте предыдущий код — расширяйте его.
- Используйте корневой пакет `com.innowise.tracker` и подпакеты (`model`, `repository`, `io` и т.д.).
- В каждом задании есть **Критерии приёмки** — относитесь к ним как к чек-листу. Задача выполнена, только когда можно отметить каждый пункт.
- **Подсказки** направляют в нужную сторону, но никогда не дают готового решения. Немного помучиться — это и есть смысл.
- После каждого задания читайте **Теперь у вас есть** — там назван артефакт, от которого зависит следующее задание.

> [!tip] Как изучать тему перед заданием
> Сначала прочитайте связанную теоретическую заметку (строка `**Тема:**`), затем делайте задание. Задание — это «лаборатория» для этой заметки.

> [!caution] Держите проект компилируемым
> После каждого задания проект должен по-прежнему компилироваться и запускаться. Если что-то сломалось — почините, прежде чем идти дальше: следующие задания предполагают рабочую сборку.

---

## Обзор проекта

Вы строите консольное приложение, которое хранит и управляет программными задачами (баги, таски, истории), как маленькая Jira. Оно растёт чёткими слоями:

| Слой | Создаётся в заданиях | Что делает |
|---|---|---|
| **Доменная модель** | 03–08 | Иерархия `Issue`, enum'ы, равенство, отчёты |
| **Репозиторий** | 09–12 | Хранилище на generics и коллекциях, запросы, исключения |
| **Сохранение** | 13–14 | Аннотации, reflection, save/load в CSV |
| **Сборка и тесты** | 15–17 | Maven-проект, юнит-тесты JUnit, UI-тесты Selenium |

**Дуга проекта вкратце:**

```
переменные → класс Bug → иерархия Issue → интерфейсы → enum'ы → отчёты
   → generics → коллекции → исключения → streams
   → аннотации → запись в файл → Maven → JUnit → Selenium
```

Каждый шаг превращает предыдущий «черновой» код во что-то более прочное: разрозненные переменные становятся классом, класс входит в иерархию, иерархия попадает в репозиторий, репозиторий сохраняется в файл, и наконец всё покрывается тестами.

> [!info] Полная карта классов — что есть в готовом проекте
> | Класс / Тип | Пакет | Поля | Ключевые методы |
> |---|---|---|---|
> | `Main` | `tracker` | — | `main()` |
> | `ProjectClass` | `tracker` | `APP_NAME`, `VERSION` | `getAppName()`, `getVersion()` |
> | `MemoryDemo` | `tracker` | — | `run()` |
> | `Issue` *(abstract)* | `tracker.model` | `id`, `title`, `reporter`, `status` | `describe()`, `getSummary()`, `canTransitionTo(Status)` |
> | `Bug` | `tracker.model` | `stepsToReproduce`, `resolved`, `createdDayOfYear`, `severity` | `getPriorityScore()`, `describe()`, `getSummary()`, `Bug(Bug other)` копирующий конструктор |
> | `Task` | `tracker.model` | `estimateHours` | `describe()`, `getSummary()` |
> | `Story` | `tracker.model` | `storyPoints` | `describe()`, `getSummary()` |
> | `Severity` *(enum)* | `tracker.model` | `weight: int` | `getWeight()` |
> | `Status` *(enum)* | `tracker.model` | — | `canTransitionTo(Status)` |
> | `Reportable` *(интерфейс)* | `tracker.model` | — | `generateReport()` |
> | `Assignable` *(интерфейс)* | `tracker.model` | — | `assignTo(String)`, `getAssignee()` |
> | `ReportFormatter` | `tracker.util` | — | `format(Issue)`, `formatKey(String,int)`, `parseKey(String)`, `validateEmail(String)` |
> | `Repository<T>` *(интерфейс)* | `tracker.repository` | — | `add(T)`, `getById(int)`, `getAll()`, `remove(int)` |
> | `InMemoryRepository<T>` | `tracker.repository` | `Map<Integer,T> store` | все выше + `getByStatus(Status)`, `countBySeverity()`, `filterBySeverity(Severity)`, `sortedByWeightDesc()`, `titles()`, `countByStatus()`, `getByIdOrThrow(int)` |
> | `IssueNotFoundException` | `tracker.exception` | — | `IssueNotFoundException(String)` |
> | `InvalidIssueException` | `tracker.exception` | — | `InvalidIssueException(String)` |
> | `DuplicateIssueException` | `tracker.exception` | — | `DuplicateIssueException(String)` |
> | `@CsvColumn` *(аннотация)* | `tracker.annotation` | `name: String` | — |
> | `CsvMapper` | `tracker.util` | — | `toHeader(Class<?>)`, `toRow(Object)` |
> | `IssueFileStorage` | `tracker.io` | — | `save(repo, path)`, `load(path)` |

---

## Настройка проекта

**Тема:** [[00 Основы Java]] · **Опирается на:** ничего — это старт

> [!info] Что строим
> | Действие | Класс | Поля | Методы |
> |---|---|---|---|
> | Создать | `Main` в `tracker` | — | `main()` — печатает баннер |
> | Создать | `ProjectClass` в `tracker` | `APP_NAME: String`, `VERSION: String` (оба `static final`) | `getAppName()`, `getVersion()` |

**Задача:** Установите JDK (21+) и создайте новый проект IntelliJ IDEA с именем `qa-tracker`. Создайте базовый пакет `com.innowise.tracker` и класс `Main` внутри него. В `main` выведите приветственный баннер, например `=== QA Issue Tracker v0.1 ===`. Храните имя приложения и версию в константах.

**Критерии приёмки:**
- [ ] `java -version` и `javac -version` оба работают в терминале
- [ ] Проект запускается и печатает баннер
- [ ] Класс `Main` в пакете `com.innowise.tracker`; имя файла совпадает с классом
- [ ] Имя приложения — константа `UPPER_SNAKE_CASE`; класс — `PascalCase`
- [ ] Нет кода в пакете по умолчанию (default package)

**Подсказки:** Точкой входа должен быть `public static void main(String[] args)`. Используйте `public static final String APP_NAME = "...";`. Именование пакетов в обратном доменном стиле разбиралось в теме.

**Теперь у вас есть:** работающий каркас проекта с правильной структурой пакетов.

---

## Моделирование бага через переменные

**Тема:** [[01 Переменные типы данных операторы]] · **Опирается на:** Настройка проекта

> [!info] Что строим
> | Действие | Класс | Переменные (локальные, класса ещё нет) | Что вычислить |
> |---|---|---|---|
> | Изменить | `Main` | `id: int`, `title: String`, `reporter: String`, `severityLevel: int`, `resolved: boolean`, `createdDayOfYear: int` | `ageInDays` = сегодня − createdDayOfYear; `priorityScore` = severityLevel × 10 |

**Задача:** Внутри `main` опишите **один** баг, используя только локальные переменные (пока без класса): `id` (int), `title` (String), `reporter` (String), `severityLevel` (int, 1–4), `resolved` (boolean) и `createdDayOfYear` (int). Выберите значение «сегодня» и вычислите **возраст бага в днях** арифметикой. Вычислите **priority score** = `severityLevel * 10` (используйте операторы). Выведите каждое значение и оба вычисленных числа в читаемом виде.

**Критерии приёмки:**
- [ ] Для каждого атрибута выбраны корректные примитивные типы
- [ ] Возраст вычислен вычитанием, priority score — умножением
- [ ] Использован хотя бы один реляционный или логический оператор (например, `severityLevel >= 3 && !resolved`)
- [ ] Все значения и результаты выводятся понятно
- [ ] Класса по-прежнему нет — только переменные

**Подсказки:** Используйте `System.out.printf` или конкатенацию строк для форматирования. Подумайте, какие значения могут быть отрицательными, а какие нет. Сохраните этот список атрибутов — скоро он станет полями класса `Bug`.

**Теперь у вас есть:** полный список атрибутов бага, проверенный вручную.

---

## Логика триажа

**Тема:** [[02 Управляющие конструкции]] · **Опирается на:** Моделирование бага через переменные

> [!info] Что строим
> | Действие | Класс | Что добавить |
> |---|---|---|
> | Изменить | `Main` | `switch` по severityLevel → строка-метка; `if/else` эскалация (severity ≥ 3 && !resolved); `for` по `int[]` с severity; `while` — счётчик High/Critical |

**Задача:** Напишите логику триажа, которая превращает `severityLevel` в метку приоритета. Используйте `switch` по severity (1→"Low", 2→"Medium", 3→"High", 4→"Critical", всё прочее→"Unknown"). Затем используйте `if/else`, чтобы пометить баг как "Escalated", когда `severity >= 3` **и** он не resolved. Наконец, пройдите циклом по `int[]` из нескольких severity и **посчитайте**, сколько из них High или Critical, выведя итог.

**Критерии приёмки:**
- [ ] `switch` обрабатывает каждое валидное severity и невалидный случай
- [ ] `if/else` правильно сочетает severity и флаг `resolved`
- [ ] В проекте хотя бы раз встречаются и цикл `for`, и цикл `while`
- [ ] Счётчик High/Critical выводит правильное число
- [ ] Невалидные severity не роняют программу

**Подсказки:** Выражение `switch` (со стрелками `->`) чище старого стиля `case:`. Переиспользуйте переменные из предыдущего задания как данные для цикла. Эта логика позже переедет в enum `Severity` и в тесты триажа.

**Теперь у вас есть:** рабочие правила триажа, которые вы переиспользуете в enum и в юнит-тестах.

---

## Класс Bug

**Тема:** [[03 Основы ООП]] · **Опирается на:** Моделирование бага через переменные, Логика триажа

> [!info] Что строим
> | Действие | Класс | Поля | Методы |
> |---|---|---|---|
> | Создать | `Bug` в `tracker.model` | `id: int`, `title: String`, `reporter: String`, `resolved: boolean`, `createdDayOfYear: LocalDate`, `severity: Severity` | `Bug(id,title,reporter,resolved,date,severity)` полный конструктор; `Bug(id,title,reporter,severity)` короткий через `this(...)`; геттеры/сеттеры (setTitle валидирует непустоту; setSeverity валидирует не-null); `getPriorityScore()` → вес × 10; `toString()`; `equals()`/`hashCode()` только по id |

**Задача:** Превратите разрозненные переменные из задания 01 в настоящий класс `Bug` в `com.innowise.tracker.model`. Добавьте параметризованный конструктор и перегруженный (цепочка конструкторов через `this(...)`). Сделайте поля `private` с геттерами/сеттерами; сеттеры должны валидировать (title не пустой, severity 1–4). Переопределите `toString()` и переопределите `equals()`/`hashCode()` только по `id`. В `Main` создайте несколько объектов `Bug` и выведите их.

**Критерии приёмки:**
- [ ] Все поля `private`; доступ только через геттеры/сеттеры
- [ ] Сеттер отклоняет пустой title и severity вне диапазона
- [ ] `toString()` возвращает читаемую строку
- [ ] Два бага с одинаковым `id` равны через `equals()` и имеют одинаковый `hashCode()`
- [ ] Хотя бы один конструктор вызывает другой через `this(...)`

**Подсказки:** IntelliJ по `Alt+Insert` генерирует геттеры, `equals()`, `hashCode()` и `toString()`. Сделайте `id` фактически неизменяемым после установки. Используйте `Objects.hash(id)` и `Objects.equals(...)`.

**Теперь у вас есть:** доменный объект `Bug` — основа всей модели.

---

## Иерархия Issue

**Тема:** [[04 ООП Наследование и полиморфизм]] · **Опирается на:** Класс Bug

> [!info] Что строим
> | Действие | Класс | Поля | Методы |
> |---|---|---|---|
> | Создать | `Issue` в `tracker.model` | `id: int`, `title: String`, `reporter: String` (перенесены из Bug) | `Issue(id,title,reporter)`; `describe()` — печатает id, title, reporter; геттеры/сеттеры |
> | Изменить | **`Bug`** | `stepsToReproduce: String` (новое) | `describe()` `@Override` — вызывает `super.describe()` + печатает шаги |
> | Создать | `Task` в `tracker.model` | `estimateHours: int` | `Task(id,title,reporter,hours)`; `describe()` `@Override` — вызывает `super.describe()` + печатает часы |
> | Создать | `Story` в `tracker.model` | `storyPoints: int` | `Story(id,title,reporter,points)`; `describe()` `@Override` — вызывает `super.describe()` + печатает очки |

**Задача:** Выделите базовый класс `Issue` с общими полями (`id`, `title`, `reporter`) и методом `describe()`. Сделайте `Bug extends Issue` (добавляет `stepsToReproduce`). Добавьте два собрата: `Task extends Issue` (добавляет `estimateHours`) и `Story extends Issue` (добавляет `storyPoints`). Переопределите `describe()` в каждом подклассе так, чтобы вывод зависел от типа. В `Main` положите смешанные объекты в `Issue[]` и вызовите `describe()` для каждого в цикле.

**Критерии приёмки:**
- [ ] `Bug`, `Task`, `Story` все наследуют `Issue`
- [ ] Конструкторы подклассов вызывают `super(...)`
- [ ] `describe()` помечен `@Override` и ведёт себя по-разному для каждого типа
- [ ] Один цикл по `Issue[]` печатает разный вывод для каждого объекта (полиморфизм)
- [ ] Общие поля живут только в `Issue`, не дублируются в подклассах

**Подсказки:** Тип на этапе компиляции — `Issue`, но тип во время выполнения решает, какой `describe()` запустится — это динамическая диспетчеризация. После рефакторинга `equals()`/`hashCode()` у `Bug` должны продолжать работать.

**Теперь у вас есть:** полиморфную иерархию `Issue`.

---

## Интерфейсы и абстракция

**Тема:** [[05 ООП Интерфейсы и абстракция]] · **Опирается на:** Иерархия Issue

> [!info] Что строим
> | Действие | Класс | Поля | Методы |
> |---|---|---|---|
> | Изменить | **`Issue`** (сделать `abstract`) | — | `getSummary(): String` — абстрактный, реализуется каждым подклассом |
> | Создать | интерфейс `Reportable` в `tracker.model` | — | `generateReport(): String` |
> | Создать | интерфейс `Assignable` в `tracker.model` | — | `assignTo(String user)`, `getAssignee(): String` |
> | Изменить | **`Bug`**, **`Task`**, **`Story`** | `assignee: String` | реализуют `Reportable` и `Assignable`; `getSummary()` — возвращает однострочное описание |

**Задача:** Сделайте `Issue` **абстрактным** классом с абстрактным методом `getSummary()`. Определите два интерфейса: `Reportable { String generateReport(); }` и `Assignable { void assignTo(String user); String getAssignee(); }`. Пусть конкретные issue реализуют их. В `Main` держите объекты через ссылку на интерфейс (например, `Reportable r = bug;`) и вызывайте методы интерфейса.

**Критерии приёмки:**
- [ ] `Issue` является `abstract` и не может быть создан напрямую (`new Issue(...)` не компилируется)
- [ ] `getSummary()` абстрактен и реализован в каждом подклассе
- [ ] `Reportable` и `Assignable` реализованы конкретными классами
- [ ] Хотя бы одна переменная объявлена через тип интерфейса, а не класса
- [ ] `assignTo()` сохраняет assignee, который возвращает `getAssignee()`

**Подсказки:** Класс может реализовать несколько интерфейсов, но наследовать только один класс. Рассмотрите `default`-метод в `Reportable` для общего заголовка отчёта. Программируйте на интерфейс, а не на реализацию.

**Теперь у вас есть:** чистые абстракции (`abstract Issue` + интерфейсы-возможности).

---

## Enum'ы Severity и Status

**Тема:** [[06 Перечисления Enum]] · **Опирается на:** Интерфейсы и абстракция, Логика триажа

> [!info] Что строим
> | Действие | Класс | Поля | Методы |
> |---|---|---|---|
> | Создать | enum `Severity` в `tracker.model` | `weight: int` (private) | конструктор `Severity(int weight)`; `getWeight(): int` |
> | Создать | enum `Status` в `tracker.model` | константы: `NEW`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `REOPENED` | `canTransitionTo(Status next): boolean` — true только для допустимых переходов |
> | Изменить | **`Issue`** | `status: Status` | геттер/сеттер для status |
> | Изменить | **`Bug`** | тип `severity`: `int` → `Severity` | обновить `getPriorityScore()` — использует `severity.getWeight()` |

**Задача:** Замените сырой `int severityLevel` на enum `Severity { LOW(1), MEDIUM(2), HIGH(3), CRITICAL(4) }`, который хранит поле `weight` и предоставляет `getWeight()`. Добавьте enum `Status { NEW, IN_PROGRESS, RESOLVED, CLOSED, REOPENED }` и дайте `Issue` поле `Status`. Добавьте метод `boolean canTransitionTo(Status next)`, разрешающий только осмысленные переходы (например, `NEW → IN_PROGRESS`, но не `CLOSED → IN_PROGRESS`). Переведите `switch` триажа на работу с `Severity`.

**Критерии приёмки:**
- [ ] У `Severity` есть конструктор, приватное поле и `getWeight()`
- [ ] Модель использует `Severity`/`Status` вместо int/String
- [ ] `canTransitionTo()` отклоняет хотя бы один невалидный переход
- [ ] `switch` по enum обрабатывает каждую константу
- [ ] Логика триажа теперь читает severity из enum

**Подсказки:** Конструкторы enum неявно приватны. Полезны `Severity.values()` и `valueOf(String)`. В `switch` по enum не нужен префикс enum в каждом `case`.

**Теперь у вас есть:** типобезопасные `Severity` и `Status` в модели.

---

## Форматтер отчётов

**Тема:** [[07 Строки подробно]] · **Опирается на:** Enum'ы Severity и Status

> [!info] Что строим
> | Действие | Класс | Поля | Методы |
> |---|---|---|---|
> | Создать | `ReportFormatter` в `tracker.util` | — | `format(Issue): String` — строит многострочный отчёт через `StringBuilder`; `formatKey(String prefix, int id): String` — возвращает напр. `BUG-001`; `parseKey(String key): int` — парсит `BUG-001` → `1`; `validateEmail(String email): boolean` — проверяет regex |

**Задача:** Создайте `ReportFormatter` в `com.innowise.tracker.util`. С помощью `StringBuilder` соберите многострочный текстовый отчёт по `Issue` (ключ, title, severity, status, reporter, assignee). Проверьте email репортёра через **regex**. Сформируйте читаемый ключ задачи вида `BUG-001` через `String.format` с дополнением нулями и напишите метод, который парсит такой ключ обратно в число через `split`.

**Критерии приёмки:**
- [ ] Отчёт собирается через `StringBuilder`, а не `+` в цикле
- [ ] Regex проверяет базовый email и отклоняет невалидный
- [ ] Ключ форматируется как `PREFIX-NNN` с нулями (`BUG-001`)
- [ ] Парсинг `BUG-001` возвращает int `1`
- [ ] Использован хотя бы один из `strip()`, `isBlank()`, `toLowerCase()`

**Подсказки:** `String.format("%s-%03d", prefix, id)` дополняет нулями. Regex для email может быть простым: `^[\\w.+-]+@[\\w-]+\\.[\\w.-]+$`. Добавьте короткий комментарий о разнице `==` и `.equals()` для строк (String pool) — здесь это проверяется мысленно, а реально пригодится в следующем задании.

**Теперь у вас есть:** `ReportFormatter` плюс хелперы валидации.

---

## Ссылки и равенство

**Тема:** [[08 Модель памяти Java]] · **Опирается на:** Класс Bug, Форматтер отчётов

> [!info] Что строим
> | Действие | Класс | Поля | Методы |
> |---|---|---|---|
> | Создать | `MemoryDemo` в `tracker` | — | `run()` — демонстрирует изменение по общей ссылке, независимость копии, дедупликацию в HashSet |
> | Изменить | **`Bug`** | — | `Bug(Bug other)` копирующий конструктор — создаёт независимую копию |

**Задача:** Создайте класс `MemoryDemo`, доказывающий, что вы понимаете ссылки. Покажите, что две переменные, указывающие на **один и тот же** `Bug`, видят изменения друг друга. Добавьте **конструктор копирования** `Bug(Bug other)`, создающий независимую копию. Положите несколько багов (включая два с одинаковым `id`) в `HashSet<Bug>` и покажите, что дубликат отклоняется. Добавьте короткие комментарии про stack vs heap и `==` vs `equals()`.

**Критерии приёмки:**
- [ ] Демо доказывает изменение по общей ссылке (меняем через одну переменную, читаем через другую)
- [ ] `Bug(Bug other)` создаёт достаточно глубокую независимую копию
- [ ] `HashSet<Bug>` отклоняет второй баг с дублирующим `id`
- [ ] Комментарий объясняет, почему `HashSet` работает (опирается на `equals`/`hashCode` из задания 03)
- [ ] Разница `==` и `equals()` показана на двух равных багах

**Подсказки:** Если `HashSet` **не** убирает дубликаты, ваши `equals()`/`hashCode()` неверны — вернитесь к заданию 03. Конструктор копирования пригодится позже, когда вы будете загружать данные и захотите избежать общего состояния.

**Теперь у вас есть:** конструктор копирования у `Bug` и доказательство, что контракт равенства работает.

---

## Generic-репозиторий

**Тема:** [[09 Дженерики]] · **Опирается на:** Иерархия Issue, Ссылки и равенство

> [!info] Что строим
> | Действие | Класс | Поля | Методы |
> |---|---|---|---|
> | Создать | интерфейс `Repository<T>` в `tracker.repository` | — | `add(T)`, `getById(int): T`, `getAll(): List<T>`, `remove(int)` |
> | Создать | `InMemoryRepository<T>` в `tracker.repository` | `List<T> store` (временно) | реализует все четыре метода выше |
> | Добавить хелпер | в любом месте | — | `<T extends Issue> void printSummaries(List<T>)` — вызывает `getSummary()` для каждого |

**Задача:** Определите generic-интерфейс `Repository<T>` с `add(T)`, `getById(int id)`, `getAll()` и `remove(int id)`. Сделайте первую реализацию `InMemoryRepository<T>` (хранилище пока может быть простым списком — оно улучшится в следующем задании). Добавьте generic-хелпер с ограничением `<T extends Issue> void printSummaries(List<T> issues)`, который вызывает `getSummary()` для каждого.

**Критерии приёмки:**
- [ ] `Repository<T>` является generic, а `InMemoryRepository<T>` его реализует
- [ ] Нигде нет сырых типов (raw types) — нет предупреждений об unchecked
- [ ] Метод с ограничением `<T extends Issue>` компилируется и использует `getSummary()`
- [ ] Можно создать и `InMemoryRepository<Bug>`, и `InMemoryRepository<Issue>`
- [ ] `getById` возвращает совпавшую сущность или пока `null` (улучшится в задании 12)

**Подсказки:** Ограничение `<T extends Issue>` и позволяет вызывать `getSummary()` внутри generic-метода. Подумайте, почему `Repository<Bug>` не является `Repository<Issue>` (инвариантность) — в теме разбирается PECS.

**Теперь у вас есть:** generic-слой хранилища.

---

## Репозиторий на коллекциях

**Тема:** [[10 Массивы и коллекции]] · **Опирается на:** Generic-репозиторий

> [!info] Что строим
> | Действие | Класс | Поля | Методы |
> |---|---|---|---|
> | Изменить | **`InMemoryRepository<T>`** | `List<T>` → `Map<Integer, T> store` | `getById(int)` — поиск по map за O(1); `getAll()` — возвращает защитную копию; `getByStatus(Status): List<T>`; `countBySeverity(): Map<Severity, Integer>` |

**Задача:** Улучшите `InMemoryRepository<T>`, чтобы хранить сущности в `Map<Integer, T>` по ключу id (быстрый поиск, нет дублей id). Добавьте `IssueRepository` (или generic-запросы): `List<T> getAll()`, возвращающий защитную копию, `getByStatus(Status)` и `countBySeverity()`, возвращающий `Map<Severity, Integer>`. Продемонстрируйте `Set`, чтобы доказать уникальность id.

**Критерии приёмки:**
- [ ] Хранилище — это `Map<Integer, T>`; `getById` — поиск по map за O(1)
- [ ] Добавление второй сущности с существующим id не перезаписывает молча (решите и задокументируйте поведение)
- [ ] `getByStatus` возвращает только подходящие issue
- [ ] `countBySeverity` возвращает корректные счётчики по `Severity`
- [ ] `getAll()` возвращает копию, чтобы внешний код не мог изменить внутреннее хранилище

**Подсказки:** `Map.values()` даёт все сущности. `new ArrayList<>(map.values())` — быстрая защитная копия. Выбирайте коллекцию по задаче: `Map` для поиска по id, `List` для упорядоченного вывода, `Set` для уникальности.

**Теперь у вас есть:** `IssueRepository` — настоящее хранилище данных с базовыми запросами.

---

## Валидация и кастомные исключения

**Тема:** [[11 Обработка исключений]] · **Опирается на:** Репозиторий на коллекциях

> [!info] Что строим
> | Действие | Класс | Наследует | Когда бросается |
> |---|---|---|---|
> | Создать | `IssueNotFoundException` в `tracker.exception` | `RuntimeException` | `getById` — id не найден |
> | Создать | `DuplicateIssueException` в `tracker.exception` | `RuntimeException` | `add` — id уже существует |
> | Создать | `InvalidIssueException` в `tracker.exception` | `RuntimeException` | сеттеры / конструктор — плохое значение поля |

**Задача:** Добавьте кастомные исключения в `com.innowise.tracker.exception`: `IssueNotFoundException` (unchecked), `InvalidIssueException` и `DuplicateIssueException`. Пусть `getById` бросает `IssueNotFoundException`, когда id отсутствует, а `add` бросает `DuplicateIssueException` при повторном id. Пусть сеттеры/конструктор `Bug`/`Issue` бросают `InvalidIssueException` при плохих данных. В `Main` оберните вызовы в `try/catch` и выводите дружелюбные сообщения.

**Критерии приёмки:**
- [ ] Существуют три класса кастомных исключений, у каждого конструктор с сообщением
- [ ] Сделан осмысленный и последовательный выбор checked vs unchecked
- [ ] Репозиторий бросает исключение на отсутствующий id и на дубль id
- [ ] Невалидные данные issue бросают `InvalidIssueException`
- [ ] `Main` ловит исключения, и программа не падает

**Подсказки:** Наследуйте `RuntimeException` для unchecked, `Exception` для checked. Кладите проблемный id/значение в сообщение исключения — это реально помогает в отладке. Блок `finally` или try-with-resources естественно появится в задании про сохранение в файл.

**Теперь у вас есть:** надёжный репозиторий с осмысленными ошибками валидации.

---

## Запросы через Stream и Optional

**Тема:** [[12 Лямбда, Streams и Optional]] · **Опирается на:** Валидация и кастомные исключения

> [!info] Что строим
> | Действие | Класс | Методы |
> |---|---|---|
> | Изменить | **`InMemoryRepository<T>`** | `getById(int): Optional<T>` — оборачивает результат в Optional; `getByIdOrThrow(int): T` — использует `orElseThrow(() -> new IssueNotFoundException(...))`; `filterBySeverity(Severity): List<T>` — stream + filter; `sortedByWeightDesc(): List<T>` — stream + sorted по весу desc; `titles(): List<String>` — stream + map в title; `countByStatus(): Map<Status, Long>` — stream + `Collectors.groupingBy` |

**Задача:** Перепишите запросы репозитория через Stream API. Добавьте: `filterBySeverity(Severity)`, `sortedByWeightDesc()`, `titles()` (отобразить каждый issue в его title), `countByStatus()` через `Collectors.groupingBy`. Измените `getById`, чтобы он возвращал `Optional<T>`, и добавьте `getByIdOrThrow`, использующий `orElseThrow(() -> new IssueNotFoundException(...))`. Используйте лямбды и method references.

**Критерии приёмки:**
- [ ] Использованы хотя бы по одному `filter`, `map`, `sorted` и коллектор `Collectors`
- [ ] `countByStatus()` возвращает `Map<Status, Long>` через `groupingBy`
- [ ] `getById` возвращает `Optional<T>`; `.get()` не вызывается без проверки
- [ ] `getByIdOrThrow` использует `orElseThrow`
- [ ] Хотя бы раз встречается method reference (например, `Issue::getTitle`)

**Подсказки:** `Comparator.comparingInt(i -> i.getSeverity().getWeight()).reversed()` сортирует по weight. Предпочитайте `Optional` возврату `null`. `groupingBy(Issue::getStatus, Collectors.counting())` даёт счётчики.

**Теперь у вас есть:** чистый декларативный слой запросов над репозиторием.

---

## Аннотации и Reflection

**Тема:** [[13 Аннотации и основы Reflection]] · **Опирается на:** Запросы через Stream и Optional

> [!info] Что строим
> | Действие | Класс | Поля / Элементы | Методы |
> |---|---|---|---|
> | Создать | аннотация `@CsvColumn` в `tracker.annotation` | `name: String` | — (используется как `@CsvColumn("имя_колонки")` на полях Bug) |
> | Создать | `CsvMapper` в `tracker.util` | — | `toHeader(Class<?>): String` — читает имена `@CsvColumn` через reflection → заголовок CSV; `toRow(Object): String` — читает значения полей → строка данных CSV |

**Задача:** Создайте runtime-аннотацию `@CsvColumn(String name)` и поставьте её на те поля `Bug`, которые хотите экспортировать. Напишите `CsvMapper`, который через **reflection** читает каждое поле с `@CsvColumn` у объекта и строит (а) строку заголовка CSV из имён колонок и (б) строку данных CSV из значений полей.

**Критерии приёмки:**
- [ ] `@CsvColumn` имеет `@Retention(RUNTIME)` и `@Target(FIELD)`
- [ ] `CsvMapper` читает аннотированные поля через reflection (`getDeclaredFields`)
- [ ] Строка заголовка строится из значений `name` аннотации
- [ ] Строка данных строится из реальных значений полей экземпляра
- [ ] Поля без аннотации пропускаются

**Подсказки:** `field.setAccessible(true)` позволяет читать приватные поля. `field.isAnnotationPresent(CsvColumn.class)` фильтрует; `field.getAnnotation(CsvColumn.class).name()` даёт имя колонки. Делайте значения безопасными по запятым (оборачивайте в кавычки или заменяйте запятые).

**Теперь у вас есть:** аннотацию плюс reflection-маппер CSV — мост к сохранению в файл.

---

## Сохранение в файл

**Тема:** [[14 Файловый ввод-вывод]] · **Опирается на:** Аннотации и Reflection, Репозиторий на коллекциях

> [!info] Что строим
> | Действие | Класс | Поля | Методы |
> |---|---|---|---|
> | Создать | `IssueFileStorage` в `tracker.io` | — | `save(InMemoryRepository, Path)` — пишет CSV через CsvMapper; `load(Path): InMemoryRepository` — читает CSV, восстанавливает объекты Bug |

**Задача:** Создайте `IssueFileStorage` в `com.innowise.tracker.io`. `save(repository, path)` записывает все issue в `issues.csv` (заголовок из `CsvMapper`, по строке на issue). `load(path)` читает файл обратно, восстанавливает объекты `Bug` и кладёт их в свежий репозиторий. Используйте try-with-resources и обрабатывайте `IOException`.

**Критерии приёмки:**
- [ ] `save` создаёт валидный CSV-файл с заголовком и строкой на каждый issue
- [ ] `load` восстанавливает issue и добавляет их в репозиторий
- [ ] Для reader и writer используется try-with-resources
- [ ] `IOException` обработан (или обёрнут) — сырой stack trace не утекает пользователю
- [ ] Сохранение, затем загрузка дают равный набор issue (round-trip работает)

**Подсказки:** `Files.newBufferedWriter` / `Files.newBufferedReader` просты и безопасны. Переиспользуйте `CsvMapper` из предыдущего задания для заголовка и строк. Конструктор копирования из задания 08 помогает избежать общего состояния при восстановлении объектов.

**Теперь у вас есть:** постоянное хранилище — трекер переживает перезапуск.

---

## Перевод проекта на Maven

**Тема:** [[15 Сборочные инструменты Maven Gradle]] · **Опирается на:** Сохранение в файл (вся кодовая база)

> [!info] Что строим
> | Действие | Файл | Что добавить |
> |---|---|---|
> | Создать | `pom.xml` в корне проекта | `groupId: com.innowise`, `artifactId: qa-tracker`, Java 21, зависимость JUnit 5 с scope test |
> | Переместить | все исходники | в `src/main/java/com/innowise/tracker/...` по структуре пакетов |
> | Создать | дерево `src/test/java/` | пустое пока — тесты добавляются в задании 16 |

**Задача:** Превратите проект в Maven-проект. Добавьте `pom.xml` (`groupId` `com.innowise`, `artifactId` `qa-tracker`, Java 21). Перенесите исходники в `src/main/java` по папкам пакетов и создайте пустое дерево `src/test/java`. Добавьте зависимость JUnit 5 сейчас (Selenium добавим в последнем задании). Соберите из терминала.

**Критерии приёмки:**
- [ ] Стандартная раскладка Maven: `src/main/java`, `src/test/java`, `pom.xml`
- [ ] `mvn clean compile` завершается с `BUILD SUCCESS`
- [ ] JUnit 5 (`junit-jupiter`) — зависимость со scope `test`
- [ ] Приложение по-прежнему запускается (через IDE или `exec`-плагин)
- [ ] Задан `<maven.compiler.release>21</maven.compiler.release>` (или эквивалент)

**Подсказки:** IntelliJ умеет конвертировать проект в Maven, но напишите `pom.xml` руками хотя бы раз, чтобы понять его. Используйте `<scope>test</scope>` для JUnit. Агрегатор `junit-jupiter` подтягивает API и engine вместе.

**Теперь у вас есть:** Maven-проект, готовый к автотестам.

---

## Модульные тесты на JUnit 5

**Тема:** [[16 Модульное тестирование с JUnit 5]] · **Опирается на:** Перевод проекта на Maven

> [!info] Что строим
> | Действие | Тест-класс | Что тестирует |
> |---|---|---|
> | Создать | `BugTest` в `src/test/java` | валидация Bug (пустой title бросает исключение), equals/hashCode по id |
> | Создать | `SeverityTest` | `Severity.getWeight()`, `Status.canTransitionTo()` |
> | Создать | `RepositoryTest` | CRUD, `assertThrows` для `IssueNotFoundException` и `DuplicateIssueException`, один Stream-запрос |
> | Создать | `TriageTest` | `@ParameterizedTest` с `@CsvSource` — несколько значений severity → ожидаемая метка |

**Задача:** Напишите юнит-тесты в `src/test/java` для написанной логики. Покройте: валидацию и равенство `Bug`, `Severity.getWeight()`, `Status.canTransitionTo()`, CRUD репозитория, включая `assertThrows` для not-found и duplicate, и хотя бы один Stream-запрос. Добавьте **параметризованный тест** для логики триажа. Используйте `@BeforeEach` для создания свежего репозитория на каждый тест.

**Критерии приёмки:**
- [ ] Тесты следуют шаблону Arrange–Act–Assert и имеют имена, описывающие поведение
- [ ] `assertThrows` проверяет `IssueNotFoundException` и `DuplicateIssueException`
- [ ] `@ParameterizedTest` (например, `@CsvSource`) прогоняет логику триажа на нескольких входах
- [ ] `@BeforeEach` готовит общее состояние; тесты независимы (любой порядок проходит)
- [ ] `mvn test` запускается, и весь набор зелёный

**Подсказки:** `assertThrows(IssueNotFoundException.class, () -> repo.getByIdOrThrow(999))` возвращает исключение, чтобы можно было проверить его сообщение. Переиспользуйте правила триажа из задания 02 как систему под тестом. Держите каждый тест сфокусированным на одном сценарии.

**Теперь у вас есть:** зелёный набор юнит-тестов, доказывающий, что домен и репозиторий работают.

---

## UI-тесты на Selenium

**Тема:** [[17 Основы Selenium WebDriver]] · **Опирается на:** Модульные тесты на JUnit 5

> [!info] Что строим
> | Действие | Тест-класс | Что делает |
> |---|---|---|
> | Создать | `LoginTest` в `src/test/java` | `@BeforeEach` создаёт WebDriver; `@AfterEach` вызывает `driver.quit()`; тест 1 — валидный логин → проверка успеха; тест 2 — неверный логин → проверка сообщения об ошибке; использует `WebDriverWait` + `ExpectedConditions` |

**Задача:** Добавьте зависимость Selenium и напишите класс JUnit + Selenium-тестов против публичного учебного сайта — `https://www.saucedemo.com` или `https://the-internet.herokuapp.com/login`. Откройте страницу, войдите с верными данными и проверьте успех, затем войдите с неверными данными и проверьте сообщение об ошибке. Создавайте драйвер в `@BeforeEach` и вызывайте `quit()` в `@AfterEach`. **Бонус:** когда UI-проверка падает, соберите объект `Bug` (переиспользуя доменную модель), описывающий дефект, и выведите его отчёт через `ReportFormatter`.

**Критерии приёмки:**
- [ ] Зависимость Selenium добавлена; драйвер создаётся в `@BeforeEach`, `quit()` в `@AfterEach`
- [ ] Локаторы (`By.id`/`By.cssSelector`/…) находят поля логина и кнопку
- [ ] Один тест проверяет успешный вход, другой — ошибку при неверных данных
- [ ] Используется явное ожидание (`WebDriverWait` + `ExpectedConditions`) вместо `Thread.sleep`
- [ ] Бонус: упавшая проверка создаёт `Bug` и печатает его через `ReportFormatter`

**Подсказки:** Selenium Manager (Selenium 4.6+) скачивает драйвер браузера автоматически — ручной настройки не нужно. Учётные данные `saucedemo.com` указаны на его странице логина. Бонус замыкает круг: доменная модель вашего трекера теперь регистрирует те самые баги, которые находят ваши UI-тесты.

**Теперь у вас есть:** полный, собранный Maven QA Issue Tracker с юнит-тестами и UI-тестами Selenium — каждая тема Модуля 2 отработана в одном проекте.
