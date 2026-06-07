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
names.forEach(name -> System.out.println(name));

Comparator<String> byLength = (a, b) -> a.length() - b.length();
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
Predicate<String> isEmpty = text -> text.isEmpty();
Function<String, Integer> length = text -> text.length();
Consumer<String> printer = text -> System.out.println(text);
Supplier<Double> random = () -> Math.random();
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
ClassName::staticMethod
objectRef::instanceMethod
ClassName::instanceMethod
ClassName::new
```

Examples:

```java
List<String> names = List.of("ann", "bob");
names.stream()
     .map(String::toUpperCase)
     .forEach(System.out::println);

Supplier<List<String>> listFactory = ArrayList::new;
```

Method references improve readability when the operation is already clear from the method name.

---

## Streams Basics

A **stream** is not a data structure. It is a pipeline for processing data from a source such as a list, set, or array.

```java
List<String> names = List.of("Ann", "Bob", "Kate", "Alex");

List<String> result = names.stream()
    .filter(name -> name.length() > 3)
    .map(String::toUpperCase)
    .toList();

System.out.println(result); // [KATE, ALEX]
```

### Stream Pipeline

A stream pipeline usually has three parts:

1. source
2. intermediate operations
3. terminal operation

```java
names.stream()                 // source
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

- `filter()`
- `map()`
- `sorted()`
- `distinct()`
- `limit()`
- `skip()`

```java
List<Integer> numbers = List.of(1, 2, 2, 3, 4, 5);

List<Integer> result = numbers.stream()
    .filter(n -> n > 2)
    .distinct()
    .sorted()
    .toList();
```

### Terminal Operations

These finish the pipeline and produce a result.

Common examples:

- `toList()`
- `collect()`
- `forEach()`
- `count()`
- `findFirst()`
- `anyMatch()`
- `allMatch()`
- `reduce()`

```java
long count = numbers.stream()
    .filter(n -> n % 2 == 0)
    .count();

boolean hasAdmin = List.of("user", "admin", "guest").stream()
    .anyMatch(role -> role.equals("admin"));
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
Optional<String> name = Optional.of("Alice");
Optional<String> empty = Optional.empty();
Optional<String> maybe = Optional.ofNullable(getName());
```

### Common Methods

```java
Optional<String> maybeName = Optional.ofNullable("Ann");

maybeName.ifPresent(System.out::println);
System.out.println(maybeName.orElse("Unknown"));
System.out.println(maybeName.orElseGet(() -> "Generated"));
```

Useful methods:

- `isPresent()`
- `ifPresent()`
- `orElse()`
- `orElseGet()`
- `orElseThrow()`
- `map()`
- `filter()`

### Why It Is Useful

- Makes "missing value" explicit
- Forces the developer to think about absence
- Can reduce `NullPointerException` in service or utility code

### What Not to Do

```java
Optional<String> name = Optional.of("Bob");
System.out.println(name.get()); // works, but risky style
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
    .map(WebElement::getText)
    .filter(text -> !text.isBlank())
    .toList();
```

```java
boolean hasError = visibleTexts.stream()
    .anyMatch(text -> text.contains("Error"));
```

```java
Optional<String> token = Optional.ofNullable(System.getenv("API_TOKEN"));
String actualToken = token.orElseThrow(() -> new IllegalStateException("API token is missing"));
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
They can create thread-safety issues, overhead, and unpredictable performance if the operation is not stateless and safe for parallel execution.
