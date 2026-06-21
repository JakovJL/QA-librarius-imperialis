# Lambda, Streams and Optional

## Table of Contents

- [[#Why Functional Style Matters]]
- [[#Lambda Expressions]]
- [[#Functional Interfaces]]
- [[#Method References]]
- [[#Streams Basics]]
- [[#Intermediate and Terminal Operations]]
- [[#Optional]]
- [[#Lambda Streams and Optional in AQA]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]
	- [[#Advanced Questions]]
	- [[#Code Questions]]

**Related notes:** [[AQA Java eng]]

> [!info] Video Course (Zaur Tregulov)
> Course 1 (OCA): L26 lambda expressions. Course 2 (Black Belt): Lambda & Streams.

---

## Why Functional Style Matters

Before Java 8, working with collections often meant writing verbose loops and temporary variables. Java 8 introduced **lambda expressions**, **streams**, and **Optional** to make code shorter, more readable, and more expressive.

These features matter because they help you:

- Describe **what** you want to do, not only **how**
- Process collections in a clear pipeline
- Reduce boilerplate for simple behavior
- Handle missing values more safely than using raw `null`

In real projects and in AQA, these tools are used for filtering data, transforming lists, checking conditions, and simplifying utility code.

---

## Lambda Expressions

A **lambda expression** is a short way to pass behavior as data. In simple words, it is an anonymous function.

```java
(x, y) -> x + y
name -> name.toUpperCase()
() -> System.out.println("Hello")
```

### Basic Syntax

```java
parameters -> expression
parameters -> { statements; }
```

Examples:

```java
List<String> names = List.of("Ann", "Bob", "Kate");
names.forEach(name -> System.out.println(name)); // prints each name on its own line

Comparator<String> byLength = (a, b) -> a.length() - b.length(); // sort rule: shorter string first
```

Lambdas come in a few shapes, depending on the number of parameters and the body:

```java
Runnable greet = () -> System.out.println("Hello");        // no parameters; greet.run() prints Hello
Consumer<String> print = name -> System.out.println(name); // one parameter; print.accept("Ann")
BinaryOperator<Integer> add = (a, b) -> a + b;             // two parameters; add.apply(2, 3) -> 5
Function<Integer, String> grade = score -> {               // body with several statements needs { } and return
    if (score >= 60) return "pass";
    return "fail";
};
```

### Why Lambda Is Useful

- Removes anonymous class boilerplate
- Makes short operations easy to read
- Works very well with collections and streams

### Before and After

Before lambda:

```java
Runnable task = new Runnable() {
    @Override
    public void run() {
        System.out.println("Run");
    }
};
```

With lambda:

```java
Runnable task = () -> System.out.println("Run");
```

> [!tip] Core Idea
> Use lambda when you need to pass a small piece of behavior: sorting rule, filter condition, click handler, retry logic, or custom validation.

---

## Functional Interfaces

A lambda works only with a **functional interface**. This is an interface with exactly **one abstract method**.

```java
@FunctionalInterface
interface Calculator {
    int calculate(int a, int b);
}

Calculator sum = (a, b) -> a + b;
System.out.println(sum.calculate(2, 3)); // 5
```

### Common Built-In Functional Interfaces

| Interface | Method | Meaning |
|---|---|---|
| `Predicate<T>` | `test(T t)` | checks a condition |
| `Function<T, R>` | `apply(T t)` | converts one value to another |
| `Consumer<T>` | `accept(T t)` | consumes a value, returns nothing |
| `Supplier<T>` | `get()` | produces a value |
| `UnaryOperator<T>` | `apply(T t)` | transforms value of same type |
| `BinaryOperator<T>` | `apply(T a, T b)` | combines two values of same type |

Examples:

```java
Predicate<String> isEmpty = text -> text.isEmpty();          // isEmpty.test("") -> true
Function<String, Integer> length = text -> text.length();    // length.apply("abc") -> 3
Consumer<String> printer = text -> System.out.println(text); // printer.accept("hi") prints hi
Supplier<Double> random = () -> Math.random();               // random.get() -> a new random number
```

> [!info] `@FunctionalInterface`
> This annotation is optional, but useful. It tells the compiler that the interface must stay functional. If someone adds a second abstract method, compilation fails.

---

## Method References

A **method reference** is a shorter form of lambda when the lambda only calls an existing method.

```java
names.forEach(System.out::println);
```

This is equivalent to:

```java
names.forEach(name -> System.out.println(name));
```

### Common Forms

```java
ClassName::staticMethod    // static method of a class:      x -> ClassName.staticMethod(x)
objectRef::instanceMethod  // method of one specific object: x -> objectRef.method(x)
ClassName::instanceMethod  // method called on the element:  s -> s.method()
ClassName::new             // constructor as a factory:      () -> new ClassName()
```

One concrete example per form:

```java
Function<String, Integer> parse = Integer::parseInt;   // x -> Integer.parseInt(x)
Consumer<String> print = System.out::println;          // x -> System.out.println(x)
Function<String, String> upper = String::toUpperCase;  // s -> s.toUpperCase()
Supplier<ArrayList<String>> make = ArrayList::new;     // () -> new ArrayList<>()
```

Examples:

```java
List<String> names = List.of("ann", "bob");
names.stream()
     .map(String::toUpperCase)      // "ann" -> "ANN", "bob" -> "BOB"
     .forEach(System.out::println); // prints ANN, then BOB

Supplier<List<String>> listFactory = ArrayList::new; // listFactory.get() creates a new empty list
```

Method references improve readability when the operation is already clear from the method name.

---

## Streams Basics

A **stream** is not a data structure. It is a pipeline for processing data from a source such as a list, set, or array.

```java
List<String> names = List.of("Ann", "Bob", "Kate", "Alex");

List<String> result = names.stream()
    .filter(name -> name.length() > 3) // keep names longer than 3 -> [Kate, Alex]
    .map(String::toUpperCase)          // upper-case each one -> [KATE, ALEX]
    .toList();                         // collect into a List

System.out.println(result); // [KATE, ALEX]
```

### Stream Pipeline

A stream pipeline usually has three parts:

1. source
2. intermediate operations
3. terminal operation

```java
names.stream()                    // source
     .filter(n -> n.length() > 3) // intermediate
     .map(String::toUpperCase)    // intermediate
     .toList();                   // terminal
```

### Important Rules

- Streams do not change the original collection
- Streams are usually used once
- Lazy evaluation means intermediate operations run only when terminal operation starts

> [!warning] Stream Is Single-Use
> After a terminal operation like `toList()` or `count()`, the stream is closed. You cannot reuse the same stream variable again.

---

## Intermediate and Terminal Operations

### Intermediate Operations

These return another stream and build the pipeline.

Common examples:

- `filter(predicate)` — keeps only elements that match the condition
- `map(function)` — transforms each element into another value
- `sorted()` — sorts elements (natural order, or by a `Comparator`)
- `distinct()` — removes duplicate elements
- `limit(n)` — keeps only the first `n` elements
- `skip(n)` — skips the first `n` elements

```java
List<Integer> numbers = List.of(1, 2, 2, 3, 4, 5);

List<Integer> result = numbers.stream()
    .filter(n -> n > 2) // keep > 2 -> [3, 4, 5]
    .distinct()         // remove duplicates -> [3, 4, 5]
    .sorted()           // sort ascending -> [3, 4, 5]
    .toList();          // collect into a List
// result = [3, 4, 5]
```

### Terminal Operations

These finish the pipeline and produce a result.

Common examples:

- `toList()` — collects the stream into a List
- `collect(...)` — flexible collecting (to List/Set/Map, joining into a String...)
- `forEach(action)` — runs an action for each element (side effect)
- `count()` — returns the number of elements (`long`)
- `findFirst()` — returns the first element as an `Optional`
- `anyMatch(predicate)` — `true` if at least one element matches
- `allMatch(predicate)` — `true` if every element matches
- `reduce(...)` — combines all elements into a single value (sum, max, concatenation...)

```java
long count = numbers.stream()
    .filter(n -> n % 2 == 0) // keep even numbers -> [2, 2, 4]
    .count();                // how many are left -> 3

boolean hasAdmin = List.of("user", "admin", "guest").stream()
    .anyMatch(role -> role.equals("admin")); // is "admin" present? -> true
```

### `map()` vs `filter()`

- `filter()` keeps or removes elements
- `map()` transforms each element

> [!tip] Quick Comparison
> | Operation | What it does |
> |---|---|
> | `filter()` | keeps only matching elements |
> | `map()` | transforms each element |
> | `distinct()` | removes duplicates |
> | `sorted()` | orders elements |
> | `count()` | returns number of elements |

---

## Optional

`Optional<T>` is a container that may contain a value or may be empty. It is used to represent "value may be missing" more explicitly than raw `null`.

```java
Optional<String> name = Optional.of("Alice");            // holds a value; null here would throw
Optional<String> empty = Optional.empty();               // explicitly empty, no value
Optional<String> maybe = Optional.ofNullable(getName()); // empty if getName() returns null
```

### Common Methods

```java
Optional<String> maybeName = Optional.ofNullable("Ann");

maybeName.ifPresent(System.out::println);                   // runs only if value present -> prints Ann
System.out.println(maybeName.orElse("Unknown"));            // the value, or "Unknown" if empty -> Ann
System.out.println(maybeName.orElseGet(() -> "Generated")); // like orElse, but computed only if empty
```

Useful methods:

- `isPresent()` — `true` if a value is present
- `ifPresent(action)` — runs the action only if a value is present
- `orElse(other)` — returns the value, or `other` if empty
- `orElseGet(supplier)` — like `orElse`, but the fallback is computed only when empty
- `orElseThrow(...)` — returns the value, or throws if empty
- `map(function)` — transforms the value if present
- `filter(predicate)` — keeps the value only if it matches

### Why It Is Useful

- Makes "missing value" explicit
- Forces the developer to think about absence
- Can reduce `NullPointerException` in service or utility code

### What Not to Do

```java
Optional<String> name = Optional.of("Bob");
System.out.println(name.get()); // works, but risky style (throws if empty)
```

Calling `get()` directly is often a bad idea because it throws `NoSuchElementException` if the value is absent.

> [!caution] Optional Is Not Everywhere
> `Optional` is good for method return values. It is usually not recommended for entity fields, DTO fields, or method parameters.

---

## Lambda Streams and Optional in AQA

These tools are very useful in test automation.

### Typical Examples

```java
List<WebElement> rows = driver.findElements(By.cssSelector(".row"));

List<String> visibleTexts = rows.stream()
    .map(WebElement::getText)        // each row -> its text
    .filter(text -> !text.isBlank()) // drop empty / blank texts
    .toList();                       // collect remaining texts into a List
```

```java
boolean hasError = visibleTexts.stream()
    .anyMatch(text -> text.contains("Error")); // true if any text contains "Error"
```

```java
Optional<String> token = Optional.ofNullable(System.getenv("API_TOKEN"));         // empty if env var not set
String actualToken = token.orElseThrow(() -> new IllegalStateException("API token is missing")); // value, or throw if empty
```

### Where You Use Them

- Filter lists of elements
- Transform API data
- Find one matching value
- Validate conditions with `anyMatch()` and `allMatch()`
- Handle optional config values safely

### Common Mistakes

- Building very long stream chains that hurt readability
- Using streams for code with side effects
- Calling `Optional.get()` without checking
- Using stream where a simple loop is clearer

> [!info] Good Rule for AQA
> If the operation is "filter -> transform -> collect", stream is usually a good fit. If logic is complex and stateful, a normal loop may be clearer.

---

## Interview Questions

### Top 10

**1. What is a lambda expression in Java?**  
A lambda expression is a short way to represent an anonymous function. It lets you pass behavior as data.

**2. What is a functional interface?**  
An interface with exactly one abstract method. Lambdas can be assigned to it.

**3. What is the difference between `map()` and `filter()` in streams?**  
`filter()` keeps only elements that match a condition. `map()` transforms each element into another value.

**4. Does a stream modify the original collection?**  
No. A stream processes data and usually returns a new result without changing the source collection.

**5. What is the difference between intermediate and terminal operations?**  
Intermediate operations return another stream and build the pipeline. Terminal operations finish the pipeline and produce a result or side effect.

**6. What is `Optional` used for?**  
It is used to represent a value that may be present or absent, as a safer alternative to raw `null` in many cases.

**7. What is the difference between `orElse()` and `orElseGet()`?**  
`orElse()` always evaluates its argument. `orElseGet()` evaluates the supplier only if the value is absent.

**8. Can a stream be reused?**  
No. After a terminal operation, the stream is closed and cannot be used again.

**9. What is a method reference?**  
A shorter form of lambda when the lambda only calls an existing method, for example `System.out::println`.

**10. When would you use a stream and when a loop?**  
Use a stream for clear data pipelines like filtering and mapping. Use a loop when logic is stateful, complex, or easier to read imperatively.

---

### Tricky Questions

**1. Is `Optional` a replacement for every `null` in Java?**  
No. It is mostly good for return values. Using it everywhere often makes code harder to read.

**2. Why is `forEach()` often not ideal for business logic?**  
Because it is mainly for side effects. For transformations and filtering, `map()` and `filter()` are usually clearer.

**3. Can you throw checked exceptions inside a lambda easily?**  
Not always. Many functional interfaces do not declare checked exceptions, so you often need wrapping or custom handling.

**4. What is lazy evaluation in streams?**  
Intermediate operations do not run immediately. They are executed only when a terminal operation starts.

**5. Why can parallel streams be dangerous?**  
They can cause thread-safety issues, extra overhead, and unpredictable performance if the operation is not stateless and safe for parallel execution.

---

### Advanced Questions

**1. What is "effectively final" in the context of lambdas?**  
A lambda can use variables from the outer scope only if they are **effectively final** — not changed after initialization. The compiler checks this. If the variable changes anywhere, the lambda will not compile. This is because the lambda captures a copy of the variable, and if the original changed, the copy would be outdated.

```java
int threshold = 5;
// threshold = 10; // ❌ — uncomment and the lambda won't compile
list.stream().filter(n -> n > threshold).toList(); // ✅ threshold is effectively final
```

**2. What is the difference between `findFirst()` and `findAny()`?**  
Both return `Optional<T>`, but: `findFirst()` guarantees the first element in stream order (important for ordered streams). `findAny()` returns any element — useful in parallel streams (no ordering overhead, faster). For sequential streams, there is no practical difference.

```java
Optional<Integer> first = list.stream().findFirst(); // guaranteed first
Optional<Integer> any = list.parallelStream().findAny(); // any — faster
```

**3. How does `reduce()` work?**  
Reduces the entire stream to a single value. Three forms: (1) with accumulator: `reduce((a, b) -> a + b)` — returns `Optional` (stream may be empty), (2) with identity + accumulator: `reduce(0, (a, b) -> a + b)` — identity is returned for empty stream, (3) with identity + accumulator + combiner for parallel streams.

```java
int sum = List.of(1, 2, 3).stream().reduce(0, Integer::sum); // 6
Optional<Integer> max = List.of(3, 1, 4).stream().reduce(Integer::max); // Optional[4]
```

**4. What is the difference between `collect(Collectors.toList())` and `toList()` (Java 16+)?**  
`collect(Collectors.toList())` returns a `List` — the implementation is not guaranteed (usually ArrayList). It is modifiable. `stream.toList()` (Java 16+) returns an **unmodifiable** list — any `add()`/`remove()` call throws `UnsupportedOperationException`. If you need a mutable list after streams, use `collect(toCollection(ArrayList::new))`.

```java
List<String> modifiable = stream.collect(Collectors.toList());       // mutable
List<String> unmodifiable = stream.toList();                         // immutable (Java 16+)
List<String> explicitMutable = stream.collect(Collectors.toCollection(ArrayList::new));
```

**5. What is a parallel stream? When should you use it?**  
`parallelStream()` splits data into chunks, processes them in **multiple threads** via `ForkJoinPool.commonPool()`, then merges the result. It speeds up **only** CPU-bound operations on large data sets (>10k elements). Does not help with I/O-bound or simple operations — the overhead of splitting outweighs the benefit. Requires stateless, independent operations. Dangerous: non-thread-safe collections, locks, stateful `forEach`.

```java
int sum = list.parallelStream()
    .filter(n -> n > 10)
    .reduce(0, Integer::sum); // parallel filter + sum
```

**6. How does `flatMap()` work?**  
`flatMap()` is map + flatten. `map()` transforms each element into one element. `flatMap()` transforms each element into a **stream** of elements and then flattens all those streams into one. Classic example: list of orders → list of all products from all orders.

```java
List<List<Integer>> nested = List.of(List.of(1, 2), List.of(3, 4, 5));
List<Integer> flat = nested.stream()
    .flatMap(Collection::stream) // each sublist → stream of numbers
    .toList(); // [1, 2, 3, 4, 5]

List<String> words = List.of("hello", "world");
List<String> letters = words.stream()
    .flatMap(w -> Arrays.stream(w.split("")))
    .toList(); // [h, e, l, l, o, w, o, r, l, d]
```

**7. What is the difference between `peek()` and `forEach()`?**  
`peek()` — an intermediate operation, accepts a `Consumer`, **returns a stream**. Useful for debugging (inspecting elements). `forEach()` — a terminal operation, returns void. In production, avoid `peek()` — it is meant for debugging only.

```java
List<Integer> result = stream
    .peek(x -> System.out.println("before: " + x)) // debug only
    .filter(x -> x > 0)
    .peek(x -> System.out.println("after filter: " + x))
    .toList();

stream.forEach(x -> System.out.println(x)); // terminal — ends the pipeline
```

**8. What is the difference between `groupingBy()` and `partitioningBy()`?**  
`groupingBy(Function)` groups elements into a Map by key, returns `Map<K, List<V>>`. You can add a downstream collector (e.g. `counting()`).  
`partitioningBy(Predicate)` is a special case of groupingBy where the key is always `boolean`. Returns `Map<Boolean, List<V>>` — exactly two groups: true and false.

```java
Map<String, List<String>> byFirstLetter = names.stream()
    .collect(Collectors.groupingBy(s -> s.substring(0, 1)));

Map<Boolean, List<Integer>> partitioned = nums.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));
// {true=[2, 4], false=[1, 3, 5]}
```

**9. Best practices for using `Optional`?**  
(1) `ifPresentOrElse()` — run action if present or if absent. (2) `or()` — return another Optional if empty (Java 9+). (3) `stream()` — convert Optional to a stream of 0 or 1 elements (Java 9+). (4) `filter()` — keep value only if condition matches.

```java
Optional<String> opt = Optional.ofNullable(getName());

opt.ifPresentOrElse(
    n -> log("Found: " + n),
    () -> log("Not found")
);

Optional<String> fallback = opt.or(() -> Optional.of("Default"));

opt.stream().forEach(System.out::println); // 0 or 1 elements

String result = opt.filter(n -> n.length() > 3).orElse("too short");
```

**10. How to handle checked exceptions in lambdas?**  
Functional interfaces (`Function`, `Predicate`) do not declare checked exceptions. You cannot directly throw `IOException` inside a lambda. Solutions: (1) wrap in unchecked (`RuntimeException`), (2) create your own functional interface with throws, (3) use try-catch inside the lambda.

```java
// Solution 1 — wrapper:
list.stream()
    .map(s -> {
        try { return new URL(s); }
        catch (MalformedURLException e) { throw new RuntimeException(e); }
    })
    .toList();

// Solution 2 — utility method:
static <T, R> Function<T, R> unchecked(CheckedFunction<T, R> fn) {
    return t -> { try { return fn.apply(t); } catch (Exception e) { throw new RuntimeException(e); } };
}
```

---

### Code Questions

**1. What does this code print?**  
```java
List<Integer> nums = List.of(1, 2, 3, 4, 5);
List<Integer> result = nums.stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * n)
    .toList();
System.out.println(result);
```
**Answer:** `[4, 16]`. Filter keeps even numbers (2, 4), map squares them (4, 16). Works as a pipeline.

**2. What does this code print?**  
```java
List<String> names = List.of("Alice", "Bob", "Anna", "Alex");
long count = names.stream()
    .filter(n -> n.startsWith("A"))
    .count();
System.out.println(count);
```
**Answer:** `3`. "Alice", "Anna", "Alex" — 3 names starting with A.

**3. What does this code print?**  
```java
Optional<String> result = List.<String>of().stream().findFirst();
System.out.println(result.orElse("empty"));
```
**Answer:** `empty`. Empty list → empty stream → findFirst returns `Optional.empty()` → orElse returns "empty".

**4. What does this code print?**  
```java
List<String> words = List.of("one", "two", "three");
String joined = words.stream()
    .reduce("", (a, b) -> a + b.toUpperCase());
System.out.println(joined);
```
**Answer:** `"ONETWOTHREE"`. Reduce starts with empty string, each step adds the word in uppercase.

**5. What does this code print?**  
```java
List<List<Integer>> data = List.of(List.of(1, 2), List.of(3, 4, 5));
int sum = data.stream()
    .flatMap(List::stream)
    .reduce(0, Integer::sum);
System.out.println(sum);
```
**Answer:** `15`. flatMap flattens nested lists into one stream [1,2,3,4,5], reduce sums them.

---

### Practical Tasks

> [!tip] How to practice
> Try to solve each task yourself first, then check the solution.

#### 1. Filter and Transform

**Task:** Given a list of strings, keep only names longer than 3 characters, convert to uppercase, collect to a list.

```java
List<String> names = List.of("Tom", "Anna", "Bob", "Alexandra", "Li");
List<String> result = names.stream()
    .filter(n -> n.length() > 3)
    .map(String::toUpperCase)
    .toList();
System.out.println(result); // [ANNA, ALEXANDRA]
```

**Explanation:** Classic filter → map → toList pipeline. Each operation does one thing.

| Complexity | O(n) time, O(n) memory |

#### 2. Sum via reduce

**Task:** Given a list of numbers, find the sum of all even numbers using reduce.

```java
List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);
int sum = nums.stream()
    .filter(n -> n % 2 == 0)
    .reduce(0, Integer::sum);
System.out.println(sum); // 12 (2+4+6)
```

**Explanation:** Filter keeps evens, reduce sums with identity=0.

| Complexity | O(n) time, O(1) memory |

#### 3. Flatten nested lists with flatMap

**Task:** Given a list of lists of strings, combine all strings into one flat list.

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

**Explanation:** flatMap takes each sublist and "flattens" it into a stream of elements, then all streams merge into one.

| Complexity | O(n) time, O(n) memory |

#### 4. Group by length

**Task:** Group words by their length: key = length, value = list of words of that length.

```java
List<String> words = List.of("cat", "dog", "apple", "bat", "elephant");
Map<Integer, List<String>> byLength = words.stream()
    .collect(Collectors.groupingBy(String::length));
System.out.println(byLength);
// {3=[cat, dog, bat], 5=[apple], 8=[elephant]}
```

**Explanation:** groupingBy(Function) is the simplest way to group by any key.

| Complexity | O(n) time, O(n) memory |

#### 5. Optional — safe value retrieval

**Task:** Given a method that may return null, use Optional to get the value or "Default" if null. If the value is present and longer than 3 chars — print it, otherwise — "Short".

```java
public String getName(boolean returnNull) {
    return returnNull ? null : "Alice";
}

String result = Optional.ofNullable(getName(false))
    .filter(n -> n.length() > 3)
    .orElse("Short");
System.out.println(result); // Alice — length 5 > 3

String result2 = Optional.ofNullable(getName(true))
    .filter(n -> n.length() > 3)
    .orElse("Short");
System.out.println(result2); // Short — getName returned null
```

**Explanation:** Optional.ofNullable → filter → orElse chain is the standard pattern for safe nullable value handling.

| Complexity | O(1) |
