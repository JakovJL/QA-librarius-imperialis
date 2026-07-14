# Java

## Содержание

- [[#Вопросы и ответы]]
	- [[#Чем отличаются primitive и reference types?]]
	- [[#Как access modifiers Java управляют visibility?]]
	- [[#Какие operators и loops нужно объяснять?]]
	- [[#Что такое autoboxing и unboxing?]]
	- [[#Как работают final и static?]]
	- [[#Как нужно обрабатывать exceptions?]]
	- [[#Чем отличаются abstract class и interface?]]
	- [[#Как generics улучшают type safety?]]
	- [[#Как выбрать collection?]]
	- [[#Чем отличаются ArrayList и LinkedList?]]
	- [[#Как внутренне работают Set и HashMap?]]
	- [[#Как работают lambdas и Stream API?]]
	- [[#Как использовать advanced Stream operations?]]
	- [[#Чем отличаются concurrency, parallelism и threads?]]
	- [[#Как работают synchronized и volatile?]]
	- [[#Что делают garbage collection и class loader?]]
	- [[#Какие patterns полезны в Java test framework?]]
- [[#Ссылки на теорию]]

**Связанные заметки:** [[00 Индекс Skills Matrix AQA]]

---

## Вопросы и ответы

### Чем отличаются primitive и reference types?

**Ответ:**

Primitive types Java: `byte`, `short`, `int`, `long`, `float`, `double`, `char` и `boolean`. Variable primitive type хранит value напрямую и не может быть `null`. Reference variable хранит reference на object или может быть `null`.

Для primitives `==` сравнивает values. Для objects `==` проверяет, указывают ли две references на один object; для logical value equality нужно `equals()`, если class его определяет. Например, две strings сравниваются через `equals()`, а не `==`.

### Как access modifiers Java управляют visibility?

**Ответ:**

`public` members доступны из других classes. `protected` members доступны в том же package и через inheritance. Member без modifier имеет package-private access и виден только внутри package. `private` members видны только в declaring class.

Fields следует оставлять private, пока они действительно не нужны callers. Лучше предоставлять небольшой method API, чтобы implementation details page object, client или helper можно было безопасно изменить.

### Какие operators и loops нужно объяснять?

**Ответ:**

Arithmetic operators вычисляют values, comparison operators возвращают boolean, logical operators объединяют conditions. `&&` и `||` используют short-circuit evaluation, поэтому правая часть может не выполниться. Ternary operator `condition ? first : second` выбирает одно из двух expressions.

Для branches используются `if`/`else` или `switch`. Для повторения — `for`, enhanced `for`, `while` и `do-while`. `break` завершает loop или switch, `continue` переходит к следующей iteration loop. Нужно выбирать самый понятный construct: сложным nested conditions часто нужен helper method или лучшая model.

### Что такое autoboxing и unboxing?

**Ответ:**

Autoboxing преобразует primitive в wrapper object, например `int` в `Integer`. Unboxing преобразует wrapper обратно в primitive. Collections и generics используют wrapper types, потому что type parameters не могут быть primitive types.

Unboxing `null` wrapper выбрасывает `NullPointerException`. Два objects `Integer` обычно сравниваются через `equals()`, а не `==`, потому что `==` сравнивает references.

### Как работают final и static?

**Ответ:**

`final` имеет разные значения в зависимости от context. Final variable нельзя reassigned, final method нельзя override, final class нельзя extend. Final reference не делает object immutable: его fields всё ещё могут меняться, если object mutable.

`static` принадлежит class, а не отдельному object. Он подходит для constants и stateless utility methods. Mutable static state в tests опасен: он может переносить data между tests и ломать parallel execution.

### Как нужно обрабатывать exceptions?

**Ответ:**

Exception сообщает об abnormal situation. Checked exceptions, кроме subclasses `RuntimeException`, нужно catch или declare. Unchecked exceptions обычно указывают на programming или contract error. `try`/`catch` нужен, когда code может добавить полезные recovery, cleanup или context; `finally` или `try-with-resources` — для надёжного cleanup.

Нельзя молча игнорировать exception. В test нужно завершать проверку понятным message и сохранять original cause. Нельзя catch широкий `Exception`, только чтобы продолжить работу в invalid test state.

### Чем отличаются abstract class и interface?

**Ответ:**

Interface задаёт contract, который могут implement разные classes. У него могут быть abstract, default, static и private methods, но это не обычное место для per-object mutable state. Abstract class может иметь shared fields, constructors и implemented methods, оставляя часть methods abstract.

Interface подходит для capability с разными implementations, например `TokenProvider`. Abstract class следует применять, только когда subclasses действительно имеют стабильные общие implementation и state. Class может implement несколько interfaces, но extends только один class.

### Как generics улучшают type safety?

**Ответ:**

Generics задают ожидаемый element или value type, например `List<Order>` или `Map<String, User>`. Тогда compiler не позволит вставить неверный type и уменьшит число явных casts при чтении data.

Нельзя использовать raw types, например `List` без type argument. Wildcards нужны, когда API принимает family types: `? extends T` обычно для reading producers, а `? super T` — для writing consumers. Не стоит применять wildcard, когда конкретный type делает method проще.

### Как выбрать collection?

**Ответ:**

`List` хранит ordered sequence и допускает duplicates. `Set` хранит unique values. `Queue` и `Deque` моделируют processing order. `Map` хранит key-value pairs и находится отдельно от hierarchy `Collection`. Выбор начинается с нужного behaviour: ordering, uniqueness, key lookup, queue operations, thread safety и expected size.

Например, `List` подходит для ordered UI items, `Set` — для сравнения unique IDs, `Map` — для data по ID, `ArrayDeque` — для queue или stack. Нельзя выбирать collection только потому, что она привычна.

### Чем отличаются ArrayList и LinkedList?

**Ответ:**

`ArrayList` использует resizable array. Он даёт быстрый indexed access и обычно является default choice для list. Insert или remove в середине сдвигает следующие elements, поэтому может быть дорогим. `LinkedList` хранит linked nodes; поиск item по index медленный, потому что нужно проходить nodes.

Добавление или удаление у известного node или конца может быть эффективно в `LinkedList`, но обычный test code часто сначала ищет этот node. Перед заменой `ArrayList` нужно измерить реальное bottleneck: `LinkedList` не становится автоматически быстрее для insertions.

### Как внутренне работают Set и HashMap?

**Ответ:**

`HashMap` — hash-table implementation `Map`. Она использует `hashCode()` key для выбора bucket и `equals()` для поиска совпадающего key среди possible collisions. При хорошо распределённых hashes `get` и `put` ожидаемо быстрые. У `HashMap` нет стабильного iteration order, и она не thread-safe при concurrent structural changes.

Keys должны иметь стабильные `equals()` и `hashCode()`, пока находятся в map. Изменение fields, используемых этими methods, может сделать key невозможным для поиска. `HashSet` полезен для uniqueness и в обычной implementation использует hashing; `LinkedHashSet` нужен, когда важен insertion order, а `TreeSet` — когда нужен sorted order.

### Как работают lambdas и Stream API?

**Ответ:**

Lambda — компактная implementation functional interface, например predicate или function. Stream — pipeline, который читает elements из source, применяет intermediate operations `filter` и `map`, затем terminal operation `toList`, `count` или `reduce`.

Stream не хранит elements и считается consumed после terminal operation. Operations stream должны быть stateless; нельзя менять non-concurrent source collection во время выполнения pipeline. Loop лучше, если он яснее выражает test logic.

### Как использовать advanced Stream operations?

**Ответ:**

`Collectors.groupingBy` собирает elements в groups по key, например API records по status. `Collectors.partitioningBy` делит elements на groups `true` и `false` по predicate. `mapping`, `counting`, `joining` и downstream collectors помогают получить один читаемый aggregate result.

Не нужно создавать длинный stream pipeline, скрывающий intention test. Следует проверить null handling, duplicate keys при `toMap`, требования к ordering и стоимость stateful operations `sorted` или `distinct`.

### Чем отличаются concurrency, parallelism и threads?

**Ответ:**

Concurrency означает, что несколько tasks могут делать progress в один период, часто чередуя work. Parallelism означает execution tasks одновременно на разных processors или cores. Thread — один путь execution внутри process; Java также предлагает более высокоуровневые executors и futures для управления tasks.

Parallel test runs требуют isolated drivers, test data, files и reporting. Raw threads в tests без lifecycle control часто создают flaky tests; лучше использовать executor или supported parallel mechanism test framework.

### Как работают synchronized и volatile?

**Ответ:**

`synchronized` использует monitor object для mutual exclusion: только один thread может выполнять protected block для этого monitor одновременно. Unlock monitor happens-before последующий lock того же monitor, поэтому изменения становятся видимы следующему thread.

`volatile` делает reads и writes одной variable visible и ordered между threads, но не делает compound action atomic. Например, `count++` всё ещё небезопасен только с `volatile`; если operation должна быть atomic, нужен `AtomicInteger` или lock.

### Что делают garbage collection и class loader?

**Ответ:**

Garbage collector освобождает memory objects, которые больше не reachable из live references. Он запускается по своему schedule, поэтому code не должен зависеть от точного момента collection. Memory leak в Java обычно означает, что object по ошибке остаётся reachable, например из static collection, listener, cache или thread-local value.

Class loader загружает classes и resources в JVM. Identity class включает и class name, и defining class loader, поэтому один class name из разных loaders — не один runtime type. Это важно для plugin systems, test runners и dependency conflicts.

### Какие patterns полезны в Java test framework?

**Ответ:**

Page Object или Screen Object отделяет test scenarios от UI details. Factory создаёт drivers или clients по configuration, Builder делает complex test data читаемыми, а Strategy выбирает изменяемое behaviour, например authentication или retry policy. Dependency injection делает реальные и fake dependencies заменяемыми.

Pattern следует использовать, только когда он устраняет duplication, coupling или неясное construction. Global mutable singletons и глубокое inheritance часто усложняют isolation tests и parallel runs.

---

## Ссылки на теорию

- [[AQA Java rus]]
