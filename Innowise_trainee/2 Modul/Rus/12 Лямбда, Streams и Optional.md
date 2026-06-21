# Лямбда, Streams и Optional

## Содержание

- [[#Почему функциональный стиль важен]]
- [[#Лямбда-выражения]]
- [[#Функциональные интерфейсы]]
- [[#Method References]]
- [[#Основы Streams]]
- [[#Промежуточные и терминальные операции]]
- [[#Optional]]
- [[#Лямбда Streams и Optional в AQA]]
- [[#Вопросы для собеседования]]
	- [[#Топ-10]]
	- [[#Хитрые вопросы]]
	- [[#Вопросы на углублённое понимание]]
	- [[#Вопросы с кодом]]

**Связанные заметки:** [[AQA Java rus]]

> [!info] Видео-курс (Заур Трегулов)
> Курс 1 (OCA): L26 лямбда-выражения. Курс 2 (Чёрный Пояс): Lambda и Streams.

---

## Почему функциональный стиль важен

До Java 8 работа с коллекциями часто требовала многословных циклов и временных переменных. Java 8 добавила **лямбда-выражения**, **streams** и **Optional**, чтобы сделать код короче, понятнее и выразительнее.

Эти возможности важны, потому что помогают:

- Описывать **что** нужно сделать, а не только **как**
- Обрабатывать коллекции в виде понятного пайплайна
- Уменьшать boilerplate для простого поведения
- Безопаснее работать с отсутствующими значениями, чем через обычный `null`

В реальных проектах и в AQA эти инструменты часто используются для фильтрации данных, преобразования списков, проверки условий и упрощения утилитного кода.

---

## Лямбда-выражения

**Лямбда-выражение** — это короткий способ передать поведение как данные. Проще говоря, это анонимная функция.

```java
(x, y) -> x + y
name -> name.toUpperCase()
() -> System.out.println("Hello")
```

### Базовый синтаксис

```java
parameters -> expression
parameters -> { statements; }
```

Примеры:

```java
List<String> names = List.of("Ann", "Bob", "Kate");
names.forEach(name -> System.out.println(name)); // печатает каждое имя на своей строке

Comparator<String> byLength = (a, b) -> a.length() - b.length(); // правило сортировки: короче — раньше
```

Лямбды бывают нескольких форм — зависит от количества параметров и тела:

```java
Runnable greet = () -> System.out.println("Hello");        // нет параметров; greet.run() печатает Hello
Consumer<String> print = name -> System.out.println(name); // один параметр; print.accept("Ann")
BinaryOperator<Integer> add = (a, b) -> a + b;             // два параметра; add.apply(2, 3) -> 5
Function<Integer, String> grade = score -> {               // тело из нескольких операторов: нужны { } и return
    if (score >= 60) return "pass";
    return "fail";
};
```

### Почему лямбда полезна

- Убирает boilerplate анонимных классов
- Делает короткие операции проще для чтения
- Отлично работает с коллекциями и streams

### До и после

До лямбды:

```java
Runnable task = new Runnable() {
    @Override
    public void run() {
        System.out.println("Run");
    }
};
```

С лямбдой:

```java
Runnable task = () -> System.out.println("Run");
```

> [!tip] Ключевая идея
> Используй лямбду, когда нужно передать небольшой кусок поведения: правило сортировки, условие фильтра, click handler, retry logic или пользовательскую проверку.

---

## Функциональные интерфейсы

Лямбда работает только с **функциональным интерфейсом**. Это интерфейс, у которого ровно **один абстрактный метод**.

```java
@FunctionalInterface
interface Calculator {
    int calculate(int a, int b);
}

Calculator sum = (a, b) -> a + b;
System.out.println(sum.calculate(2, 3)); // 5
```

### Частые встроенные функциональные интерфейсы

| Интерфейс | Метод | Смысл |
|---|---|---|
| `Predicate<T>` | `test(T t)` | проверяет условие |
| `Function<T, R>` | `apply(T t)` | преобразует одно значение в другое |
| `Consumer<T>` | `accept(T t)` | потребляет значение, ничего не возвращает |
| `Supplier<T>` | `get()` | создаёт значение |
| `UnaryOperator<T>` | `apply(T t)` | преобразует значение того же типа |
| `BinaryOperator<T>` | `apply(T a, T b)` | объединяет два значения одного типа |

Примеры:

```java
Predicate<String> isEmpty = text -> text.isEmpty();          // isEmpty.test("") -> true
Function<String, Integer> length = text -> text.length();    // length.apply("abc") -> 3
Consumer<String> printer = text -> System.out.println(text); // printer.accept("hi") печатает hi
Supplier<Double> random = () -> Math.random();               // random.get() -> новое случайное число
```

> [!info] `@FunctionalInterface`
> Эта аннотация не обязательна, но полезна. Она говорит компилятору, что интерфейс должен оставаться функциональным. Если кто-то добавит второй абстрактный метод, код перестанет компилироваться.

---

## Method References

**Method reference** — это более короткая форма лямбды, когда лямбда только вызывает уже существующий метод.

```java
names.forEach(System.out::println);
```

Это эквивалентно:

```java
names.forEach(name -> System.out.println(name));
```

### Частые формы

```java
ClassName::staticMethod    // статический метод класса:        x -> ClassName.staticMethod(x)
objectRef::instanceMethod  // метод конкретного объекта:       x -> objectRef.method(x)
ClassName::instanceMethod  // метод элемента, который придёт:  s -> s.method()
ClassName::new             // конструктор как фабрика:         () -> new ClassName()
```

По одному конкретному примеру на каждую форму:

```java
Function<String, Integer> parse = Integer::parseInt;   // x -> Integer.parseInt(x)
Consumer<String> print = System.out::println;          // x -> System.out.println(x)
Function<String, String> upper = String::toUpperCase;  // s -> s.toUpperCase()
Supplier<ArrayList<String>> make = ArrayList::new;     // () -> new ArrayList<>()
```

Примеры:

```java
List<String> names = List.of("ann", "bob");
names.stream()
     .map(String::toUpperCase)      // "ann" -> "ANN", "bob" -> "BOB"
     .forEach(System.out::println); // печатает ANN, затем BOB

Supplier<List<String>> listFactory = ArrayList::new; // listFactory.get() создаёт новый пустой список
```

Method reference улучшает читаемость, когда операция уже и так понятна из имени метода.

---

## Основы Streams

**Stream** — это не структура данных. Это пайплайн для обработки данных из источника, например списка, множества или массива.

```java
List<String> names = List.of("Ann", "Bob", "Kate", "Alex");

List<String> result = names.stream()
    .filter(name -> name.length() > 3) // оставить имена длиннее 3 -> [Kate, Alex]
    .map(String::toUpperCase)          // перевести каждое в верхний регистр -> [KATE, ALEX]
    .toList();                         // собрать в List

System.out.println(result); // [KATE, ALEX]
```

### Stream pipeline

Обычно stream pipeline состоит из трёх частей:

1. source
2. intermediate operations
3. terminal operation

```java
names.stream()                    // source
     .filter(n -> n.length() > 3) // intermediate
     .map(String::toUpperCase)    // intermediate
     .toList();                   // terminal
```

### Важные правила

- Streams не изменяют исходную коллекцию
- Streams обычно используются один раз
- Lazy evaluation означает, что промежуточные операции запускаются только при старте терминальной операции

> [!warning] Stream одноразовый
> После терминальной операции вроде `toList()` или `count()` stream закрывается. Повторно использовать тот же объект stream нельзя.

---

## Промежуточные и терминальные операции

### Промежуточные операции

Они возвращают новый stream и строят пайплайн.

Частые примеры:

- `filter(predicate)` — оставляет только элементы, подходящие под условие
- `map(function)` — преобразует каждый элемент в другое значение
- `sorted()` — сортирует элементы (естественный порядок или по `Comparator`)
- `distinct()` — убирает дубликаты
- `limit(n)` — оставляет только первые `n` элементов
- `skip(n)` — пропускает первые `n` элементов

```java
List<Integer> numbers = List.of(1, 2, 2, 3, 4, 5);

List<Integer> result = numbers.stream()
    .filter(n -> n > 2) // оставить > 2 -> [3, 4, 5] (две двойки отброшены)
    .distinct()         // убрать дубликаты -> [3, 4, 5]
    .sorted()           // отсортировать по возрастанию -> [3, 4, 5]
    .toList();          // собрать в List
// result = [3, 4, 5]
```

### Терминальные операции

Они завершают пайплайн и дают итоговый результат.

Частые примеры:

- `toList()` — собирает stream в List
- `collect(...)` — гибкий сбор (в List/Set/Map, склейка в строку...)
- `forEach(action)` — выполняет действие для каждого элемента (side effect)
- `count()` — возвращает количество элементов (`long`)
- `findFirst()` — возвращает первый элемент как `Optional`
- `anyMatch(predicate)` — `true`, если хотя бы один элемент подходит
- `allMatch(predicate)` — `true`, если подходят все элементы
- `reduce(...)` — сворачивает все элементы в одно значение (сумма, max, склейка...)

```java
long count = numbers.stream()
    .filter(n -> n % 2 == 0) // оставить чётные -> [2, 2, 4]
    .count();                // сколько осталось -> 3

boolean hasAdmin = List.of("user", "admin", "guest").stream()
    .anyMatch(role -> role.equals("admin")); // есть ли "admin"? -> true
```

### `map()` vs `filter()`

- `filter()` оставляет или убирает элементы
- `map()` преобразует каждый элемент

> [!tip] Быстрое сравнение
> | Операция | Что делает |
> |---|---|
> | `filter()` | оставляет только подходящие элементы |
> | `map()` | преобразует каждый элемент |
> | `distinct()` | убирает дубликаты |
> | `sorted()` | сортирует элементы |
> | `count()` | возвращает количество элементов |

---

## Optional

`Optional<T>` — это контейнер, который может содержать значение, а может быть пустым. Он используется для более явного представления "значение может отсутствовать", чем обычный `null`.

```java
Optional<String> name = Optional.of("Alice");            // содержит значение; null здесь бросил бы исключение
Optional<String> empty = Optional.empty();               // явно пустой, без значения
Optional<String> maybe = Optional.ofNullable(getName()); // пустой, если getName() вернёт null
```

### Частые методы

```java
Optional<String> maybeName = Optional.ofNullable("Ann");

maybeName.ifPresent(System.out::println);                   // выполнится только если значение есть -> печатает Ann
System.out.println(maybeName.orElse("Unknown"));            // значение, или "Unknown" если пусто -> Ann
System.out.println(maybeName.orElseGet(() -> "Generated")); // как orElse, но значение вычисляется только если пусто
```

Полезные методы:

- `isPresent()` — `true`, если значение есть
- `ifPresent(action)` — выполняет действие, только если значение есть
- `orElse(other)` — возвращает значение, или `other` если пусто
- `orElseGet(supplier)` — как `orElse`, но запасное значение вычисляется только если пусто
- `orElseThrow(...)` — возвращает значение, или бросает исключение если пусто
- `map(function)` — преобразует значение, если оно есть
- `filter(predicate)` — оставляет значение, только если оно подходит

### Почему это полезно

- Делает отсутствие значения явным
- Заставляет разработчика подумать о случае отсутствия
- Может уменьшить количество `NullPointerException` в сервисном или утилитном коде

### Чего лучше не делать

```java
Optional<String> name = Optional.of("Bob");
System.out.println(name.get()); // работает, но стиль рискованный (бросит исключение, если пусто)
```

Прямой вызов `get()` часто считается плохой практикой, потому что при пустом значении он бросает `NoSuchElementException`.

> [!caution] Optional нужен не везде
> `Optional` хорошо подходит для возвращаемых значений методов. Обычно его не рекомендуют использовать для полей сущностей, DTO и параметров методов.

---

## Лямбда Streams и Optional в AQA

Эти инструменты очень полезны в автотестировании.

### Типичные примеры

```java
List<WebElement> rows = driver.findElements(By.cssSelector(".row"));

List<String> visibleTexts = rows.stream()
    .map(WebElement::getText)        // каждая строка -> её текст
    .filter(text -> !text.isBlank()) // убрать пустые / пробельные тексты
    .toList();                       // собрать оставшиеся тексты в List
```

```java
boolean hasError = visibleTexts.stream()
    .anyMatch(text -> text.contains("Error")); // true, если хоть один текст содержит "Error"
```

```java
Optional<String> token = Optional.ofNullable(System.getenv("API_TOKEN"));         // пусто, если переменная окружения не задана
String actualToken = token.orElseThrow(() -> new IllegalStateException("API token is missing")); // значение, или исключение если пусто
```

### Где это используется

- Фильтрация списков элементов
- Преобразование API-данных
- Поиск одного подходящего значения
- Проверка условий через `anyMatch()` и `allMatch()`
- Безопасная работа с optional-конфигами

### Частые ошибки

- Строить слишком длинные stream-цепочки, которые ухудшают читаемость
- Использовать streams для кода с side effects
- Вызывать `Optional.get()` без проверки
- Использовать stream там, где обычный цикл проще

> [!info] Хорошее правило для AQA
> Если операция выглядит как "filter -> transform -> collect", stream обычно подходит хорошо. Если логика сложная и с состоянием, обычный цикл может быть понятнее.

---

## Вопросы для собеседования

### Топ-10

**1. Что такое лямбда-выражение в Java?**  
Лямбда-выражение — это короткий способ представить анонимную функцию. Оно позволяет передавать поведение как данные.

**2. Что такое функциональный интерфейс?**  
Это интерфейс с ровно одним абстрактным методом. Именно к нему можно привязать лямбду.

**3. В чём разница между `map()` и `filter()` в streams?**  
`filter()` оставляет только элементы, подходящие под условие. `map()` преобразует каждый элемент в другое значение.

**4. Изменяет ли stream исходную коллекцию?**  
Нет. Stream обрабатывает данные и обычно возвращает новый результат, не меняя исходную коллекцию.

**5. В чём разница между промежуточными и терминальными операциями?**  
Промежуточные операции возвращают новый stream и строят пайплайн. Терминальные операции завершают пайплайн и дают результат или side effect.

**6. Для чего нужен `Optional`?**  
Он используется для представления значения, которое может быть как доступным, так и отсутствующим, как более безопасная альтернатива обычному `null`.

**7. В чём разница между `orElse()` и `orElseGet()`?**  
`orElse()` всегда вычисляет свой аргумент. `orElseGet()` вызывает supplier только если значение отсутствует.

**8. Можно ли переиспользовать stream?**  
Нет. После терминальной операции stream закрывается и не может использоваться повторно.

**9. Что такое method reference?**  
Это более короткая форма лямбды, когда лямбда только вызывает уже существующий метод, например `System.out::println`.

**10. Когда использовать stream, а когда цикл?**  
Stream хорош для понятных пайплайнов обработки данных вроде фильтрации и преобразования. Цикл лучше, когда логика сложная, с состоянием или так проще читать.

---

### Хитрые вопросы

**1. Является ли `Optional` заменой каждому `null` в Java?**  
Нет. Он в основном полезен для возвращаемых значений. Использовать его везде подряд часто делает код менее читаемым.

**2. Почему `forEach()` не всегда лучший выбор для бизнес-логики?**  
Потому что он в основном предназначен для side effects. Для преобразований и фильтрации обычно понятнее использовать `map()` и `filter()`.

**3. Легко ли бросать checked-исключения внутри лямбды?**  
Не всегда. Многие функциональные интерфейсы не объявляют checked-исключения, поэтому часто нужен wrapping или специальная обработка.

**4. Что такое lazy evaluation в streams?**  
Промежуточные операции не выполняются сразу. Они запускаются только когда начинается терминальная операция.

**5. Почему parallel streams могут быть опасны?**  
Они могут создавать проблемы с thread-safety, лишние накладные расходы и непредсказуемую производительность, если операция не является stateless и безопасной для параллельного выполнения.

---

### Вопросы на углублённое понимание

**1. Что такое effectively final в контексте лямбд?**  
Лямбда может использовать переменные из внешней области видимости только если они **effectively final** — не меняются после инициализации. Компилятор проверяет это. Если переменная изменяется где-либо, лямбда не скомпилируется. Это связано с тем, что лямбда захватывает копию переменной, и если бы оригинал менялся, копия устарела бы.

```java
int threshold = 5;
// threshold = 10; // ❌ — раскомментируй, и лямбда не скомпилируется
list.stream().filter(n -> n > threshold).toList(); // ✅ threshold effectively final
```

**2. В чём разница между `findFirst()` и `findAny()`?**  
Оба возвращают `Optional<T>`, но: `findFirst()` — гарантированно первый элемент в порядке стрима (важно для sequential и ordered streams). `findAny()` — возвращает любой элемент, полезен в parallel streams (не блокирует порядок, быстрее). Для sequential стримов разницы нет.

```java
Optional<Integer> first = list.stream().findFirst(); // гарантированно первый
Optional<Integer> any = list.parallelStream().findAny(); // любой — быстрее
```

**3. Как работает `reduce()`?**  
Сворачивает (редуцирует) весь stream в одно значение. Три формы: (1) с аккумулятором: `reduce((a, b) -> a + b)` — возвращает `Optional` (stream может быть пустым), (2) с identity + аккумулятор: `reduce(0, (a, b) -> a + b)` — identity возвращается для пустого stream, (3) с identity + accumulator + combiner для parallel streams.

```java
int sum = List.of(1, 2, 3).stream().reduce(0, Integer::sum); // 6
Optional<Integer> max = List.of(3, 1, 4).stream().reduce(Integer::max); // Optional[4]
```

**4. Разница между `collect(Collectors.toList())` и `toList()` (Java 16+)?**  
`collect(Collectors.toList())` возвращает `List`, но конкретная реализация не гарантирована (обычно ArrayList). Можно модифицировать. `stream.toList()` (Java 16+) возвращает **неизменяемый** список — любые попытки `add()`/`remove()` кинут `UnsupportedOperationException`. Если нужен mutable список после stream — используй `collect(toCollection(ArrayList::new))`.

```java
List<String> modifiable = stream.collect(Collectors.toList());       // mutable
List<String> unmodifiable = stream.toList();                         // immutable (Java 16+)
List<String> explicitlyMutable = stream.collect(Collectors.toCollection(ArrayList::new));
```

**5. Что такое parallel stream? Когда его стоит использовать?**  
`parallelStream()` делит данные на несколько фрагментов, обрабатывает их в **нескольких потоках** через `ForkJoinPool.commonPool()`, потом объединяет результат. Ускоряет **только** CPU-bound операции на больших данных (>10k элементов). Не даёт выигрыша для I/O-bound или простых операций — накладные расходы на распараллеливание выше выгоды. Требует stateless, независимые операции. Опасен: не thread-safe коллекции, блокировки, `forEach` с состоянием.

```java
int sum = list.parallelStream()
    .filter(n -> n > 10)
    .reduce(0, Integer::sum); // параллельный фильтр + сумма
```

**6. Как работает `flatMap()`?**  
`flatMap()` — это map + flatten. `map()` преобразует каждый элемент в один элемент. `flatMap()` преобразует каждый элемент в **stream** элементов, а потом «сплющивает» все эти stream в один. Классический пример: список заказов → список всех товаров из всех заказов.

```java
List<List<Integer>> nested = List.of(List.of(1, 2), List.of(3, 4, 5));
List<Integer> flat = nested.stream()
    .flatMap(Collection::stream) // каждый подсписок → stream чисел
    .toList(); // [1, 2, 3, 4, 5]

List<String> words = List.of("hello", "world");
List<String> letters = words.stream()
    .flatMap(w -> Arrays.stream(w.split("")))
    .toList(); // [h, e, l, l, o, w, o, r, l, d]
```

**7. Разница между `peek()` и `forEach()`?**  
`peek()` — промежуточная операция, принимает `Consumer`, **возвращает stream**. Полезна для отладки (подсмотреть элементы). `forEach()` — терминальная операция, ничего не возвращает. В production `peek()` использовать не стоит — он задуман для debug.

```java
List<Integer> result = stream
    .peek(x -> System.out.println("before: " + x)) // только для отладки
    .filter(x -> x > 0)
    .peek(x -> System.out.println("after filter: " + x))
    .toList();

stream.forEach(x -> System.out.println(x)); // терминальная — завершает пайплайн
```

**8. `groupingBy()` и `partitioningBy()` — в чём разница?**  
`groupingBy(Function)` группирует элементы Map по ключу, возвращает `Map<K, List<V>>`. Можно задать downstream-коллектор (например, `counting()`).  
`partitioningBy(Predicate)` — частный случай groupingBy, но ключ всегда `boolean`. Возвращает `Map<Boolean, List<V>>` — всего две группы: true и false.

```java
Map<String, List<String>> byFirstLetter = names.stream()
    .collect(Collectors.groupingBy(s -> s.substring(0, 1)));

Map<Boolean, List<Integer>> partitioned = nums.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));
// {true=[2, 4], false=[1, 3, 5]}
```

**9. Правильные паттерны работы с `Optional`?**  
(1) ifPresentOrElse — выполнить действие если есть или если нет. (2) or — вернуть другой Optional если пусто (Java 9+). (3) stream() — преобразовать Optional в stream из 0 или 1 элемента (Java 9+). (4) filter — оставить значение только при условии.

```java
Optional<String> opt = Optional.ofNullable(getName());

opt.ifPresentOrElse(
    n -> log("Found: " + n),
    () -> log("Not found")
);

Optional<String> fallback = opt.or(() -> Optional.of("Default"));

opt.stream().forEach(System.out::println); // 0 или 1 элемент

String result = opt.filter(n -> n.length() > 3).orElse("too short");
```

**10. Как обрабатывать checked exceptions в лямбдах?**  
Функциональные интерфейсы (`Function`, `Predicate`) не объявляют checked exceptions. Нельзя напрямую бросить `IOException` внутри лямбды. Решения: (1) обернуть в unchecked (RuntimeException), (2) написать свой функциональный интерфейс с throws, (3) использовать try-catch внутри лямбды.

```java
// Вариант 1 — обёртка:
list.stream()
    .map(s -> {
        try { return new URL(s); }
        catch (MalformedURLException e) { throw new RuntimeException(e); }
    })
    .toList();

// Вариант 2 — утилитный метод:
static <T, R> Function<T, R> unchecked(CheckedFunction<T, R> fn) {
    return t -> { try { return fn.apply(t); } catch (Exception e) { throw new RuntimeException(e); } };
}
// list.stream().map(unchecked(url -> new URL(url))).toList();
```

---

### Вопросы с кодом

**1. Что выведет этот код?**  
```java
List<Integer> nums = List.of(1, 2, 3, 4, 5);
List<Integer> result = nums.stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * n)
    .toList();
System.out.println(result);
```
**Ответ:** `[4, 16]`. filter оставляет чётные (2, 4), map возводит в квадрат (4, 16). Работает как пайплайн.

**2. Что выведет этот код?**  
```java
List<String> names = List.of("Alice", "Bob", "Anna", "Alex");
long count = names.stream()
    .filter(n -> n.startsWith("A"))
    .count();
System.out.println(count);
```
**Ответ:** `3`. "Alice", "Anna", "Alex" — 3 имени на A.

**3. Что выведет этот код?**  
```java
Optional<String> result = List.<String>of().stream().findFirst();
System.out.println(result.orElse("empty"));
```
**Ответ:** `empty`. Пустой список, stream пустой, findFirst возвращает `Optional.empty()`, orElse возвращает "empty".

**4. Что выведет этот код?**  
```java
List<String> words = List.of("one", "two", "three");
String joined = words.stream()
    .reduce("", (a, b) -> a + b.toUpperCase());
System.out.println(joined);
```
**Ответ:** `"ONETWOTHREE"`. reduce начинает с пустой строки, на каждом шаге добавляет слово в верхнем регистре.

**5. Что выведет этот код?**  
```java
List<List<Integer>> data = List.of(List.of(1, 2), List.of(3, 4, 5));
int sum = data.stream()
    .flatMap(List::stream)
    .reduce(0, Integer::sum);
System.out.println(sum);
```
**Ответ:** `15`. flatMap разворачивает вложенные списки в один stream чисел [1,2,3,4,5], reduce суммирует.

---

### Практические задания

> [!tip] Как тренироваться
> Сначала попробуй решить сам, потом сверься с решением.

#### 1. Фильтрация и преобразование

**Задание:** Дан список строк. Оставь только имена длиннее 3 символов, преобразуй в верхний регистр, собери в список.

```java
List<String> names = List.of("Tom", "Anna", "Bob", "Alexandra", "Li");
List<String> result = names.stream()
    .filter(n -> n.length() > 3)
    .map(String::toUpperCase)
    .toList();
System.out.println(result); // [ANNA, ALEXANDRA]
```

**Разбор:** Классический пайплайн filter → map → toList. Каждая операция делает одно дело.

| Сложность | O(n) время, O(n) память |

#### 2. Сумма через reduce

**Задание:** Дан список чисел. Найди сумму всех чётных чисел через reduce.

```java
List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);
int sum = nums.stream()
    .filter(n -> n % 2 == 0)
    .reduce(0, Integer::sum);
System.out.println(sum); // 12 (2+4+6)
```

**Разбор:** filter оставляет чётные, reduce суммирует с identity=0.

| Сложность | O(n) время, O(1) память |

#### 3. Разворот вложенных списков flatMap

**Задание:** Дан список списков строк. Объедини все строки в один плоский список.

```java
List<List<String>> nested = List.of(
    List.of("a", "b"),
    List.of("c", "d", "e"),
    List.of("f")
);
List<String> flat = nested.stream()
    .flatMap(List::stream)
    .toList();
System.out.println(flat); // [a, b, c, d, e, f]
```

**Разбор:** flatMap берёт каждый подсписок и «разворачивает» его в поток элементов, потом все потоки сливаются в один.

| Сложность | O(n) время, O(n) память |

#### 4. Группировка по длине

**Задание:** Сгруппируй слова по их длине: ключ — длина, значение — список слов этой длины.

```java
List<String> words = List.of("cat", "dog", "apple", "bat", "elephant");
Map<Integer, List<String>> byLength = words.stream()
    .collect(Collectors.groupingBy(String::length));
System.out.println(byLength);
// {3=[cat, dog, bat], 5=[apple], 8=[elephant]}
```

**Разбор:** groupingBy(Function) — простейший способ сгруппировать по любому ключу.

| Сложность | O(n) время, O(n) память |

#### 5. Optional — безопасное получение значения

**Задание:** Дан метод, который может вернуть null. Используя Optional, получи значение или "Default", если null. Если значение есть и длиннее 3 символов — выведи его, иначе — "Short".

```java
public String getName(boolean returnNull) {
    return returnNull ? null : "Alice";
}

String result = Optional.ofNullable(getName(false))
    .filter(n -> n.length() > 3)
    .orElse("Short");
System.out.println(result); // Alice — длина 5 > 3

String result2 = Optional.ofNullable(getName(true))
    .filter(n -> n.length() > 3)
    .orElse("Short");
System.out.println(result2); // Short — getName вернул null
```

**Разбор:** Цепочка Optional.ofNullable → filter → orElse — стандартный паттерн безопасной работы с nullable значениями.

| Сложность | O(1) |
