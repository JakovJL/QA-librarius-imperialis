# Generics

## Table of Contents

- [[#Why Generics Exist]]
- [[#Generic Classes]]
- [[#Generic Methods]]
- [[#Bounded Types]]
- [[#Wildcards]]
- [[#Type Erasure]]
- [[#Generics in Practice]]

**Related notes:** [[AQA Java eng]]

> [!info] Video Course (Zaur Tregulov)
> Course 2 (Black Belt): Generics; also Comparable & Comparator.

---

## Why Generics Exist

Before generics (Java < 5), collections stored `Object` — you had to cast every time:

```java
// Without generics — compiles but can fail at runtime
List list = new ArrayList();
list.add("hello");
list.add(42);                         // no error at compile time
String s = (String) list.get(1);      // ClassCastException at runtime!
```

The problem: the compiler has no idea what types are in the list. Errors appear only at runtime, which is too late.

Generics solve this by letting you specify the type:

```java
// With generics — error caught at compile time
List<String> list = new ArrayList<>();
list.add("hello");
// list.add(42);                      // compile error — caught immediately
String s = list.get(0);               // no cast needed
```

> [!danger] Core Idea
> Generics move type checking from **runtime** to **compile time**. The compiler guarantees type safety — if it compiles, it won't throw `ClassCastException`. This is called "type safety."

---

## Generic Classes

A generic class has one or more **type parameters** — placeholders for actual types that are specified when you create an instance.

```java
public class Box<T> {
    private T value;

    public Box(T value) { this.value = value; }
    public T getValue() { return value; }
    public void setValue(T value) { this.value = value; }
}
```

`T` is a **type parameter** — a placeholder. When you create a `Box`, you replace `T` with a real type:

```java
Box<String> stringBox = new Box<>("Hello");
String s = stringBox.getValue();      // no cast — compiler knows it's String

Box<Integer> intBox = new Box<>(42);
int n = intBox.getValue();            // auto-unboxing to int

// Box<int> x = ...;                  // compile error — primitives not allowed
```

### Multiple Type Parameters

```java
public class Pair<K, V> {
    private K key;
    private V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() { return key; }
    public V getValue() { return value; }
}

Pair<String, Integer> entry = new Pair<>("age", 25);
String key = entry.getKey();       // "age"
Integer value = entry.getValue();  // 25
```

### Naming Convention

Type parameter names are single uppercase letters by convention:

| Letter | Common meaning |
|---|---|
| `T` | Type (general) |
| `E` | Element (collections) |
| `K` | Key (maps) |
| `V` | Value (maps) |
| `R` | Return type |
| `N` | Number |

---

## Generic Methods

A method can have its own type parameter, independent of the class.

```java
public class Utils {
    // <T> before return type declares the type parameter
    public static <T> T getFirst(List<T> list) {
        if (list == null || list.isEmpty()) return null;
        return list.get(0);
    }
}

String first = Utils.getFirst(List.of("a", "b", "c"));  // "a"
Integer num = Utils.getFirst(List.of(1, 2, 3));          // 1
```

The compiler **infers** `T` from the argument. You can also specify it explicitly:

```java
String first = Utils.<String>getFirst(List.of("a", "b"));
```

### Why Generic Methods?

They let you write one method that works with any type, while still being type-safe. Without generics, you would write separate methods for `List<String>`, `List<Integer>`, `List<User>`, etc. — or use `List<Object>` and lose type safety.

---

## Bounded Types

Sometimes you need to restrict which types can be used as a type parameter. For example, a method that compares values needs types that are `Comparable`.

### Upper Bound: `extends`

`<T extends SomeClass>` means "T must be SomeClass or a subclass."

```java
// T must implement Comparable
public static <T extends Comparable<T>> T findMax(List<T> list) {
    T max = list.get(0);
    for (T item : list) {
        if (item.compareTo(max) > 0) {
            max = item;
        }
    }
    return max;
}

findMax(List.of(3, 1, 4, 1, 5));         // 5
findMax(List.of("banana", "apple"));      // "banana"
// findMax(List.of(new Object()));         // compile error — Object is not Comparable
```

### Multiple Bounds

```java
// T must extend Number AND implement Comparable
public static <T extends Number & Comparable<T>> T findMax(List<T> list) { ... }
```

> [!info] extends in Generics
> In generics, `extends` means both `extends` (classes) and `implements` (interfaces). You always write `extends`, even for interfaces: `<T extends Comparable>`, not `<T implements Comparable>`.

---

## Wildcards

Wildcards (`?`) represent an **unknown type**. They are used in method parameters when you don't need to name the type.

### Unbounded Wildcard: `?`

"Any type." Used when the method doesn't care about the specific type.

```java
public void printAll(List<?> list) {
    for (Object item : list) {
        System.out.println(item);
    }
}

printAll(List.of("a", "b"));     // works
printAll(List.of(1, 2, 3));       // works
printAll(List.of(new User()));    // works
```

### Upper Bounded: `? extends T`

"T or any subtype of T." Use when you **read** from the collection.

```java
// accepts List<Integer>, List<Double>, List<Number>, etc.
public double sum(List<? extends Number> numbers) {
    double total = 0;
    for (Number n : numbers) {
        total += n.doubleValue();
    }
    return total;
}

sum(List.of(1, 2, 3));           // List<Integer> — works
sum(List.of(1.5, 2.5));          // List<Double> — works
```

### Lower Bounded: `? super T`

"T or any supertype of T." Use when you **write** to the collection.

```java
// accepts List<Integer>, List<Number>, List<Object>
public void addNumbers(List<? super Integer> list) {
    list.add(1);
    list.add(2);
    list.add(3);
}

List<Number> numbers = new ArrayList<>();
addNumbers(numbers);              // works — Number is a supertype of Integer
```

### PECS Principle

**P**roducer **E**xtends, **C**onsumer **S**uper.

| You want to... | Use | Why |
|---|---|---|
| **Read** from the collection (it produces values) | `? extends T` | You know you'll get at least a `T` |
| **Write** to the collection (it consumes values) | `? super T` | You know it can accept a `T` |
| **Both read and write** | `T` (no wildcard) | Exact type needed |

> [!tip] Don't Memorize — Understand
> `? extends Number` → "I will read Numbers from this list, I don't care if they are Integer or Double."
> `? super Integer` → "I will put Integers into this list, I don't care if the list holds Number or Object."

---

## Type Erasure

Generics exist only at **compile time**. At runtime, the JVM does not know about type parameters — they are **erased**.

```java
// What you write:
List<String> list = new ArrayList<>();
list.add("hello");
String s = list.get(0);

// What the JVM sees (after erasure):
List list = new ArrayList();
list.add("hello");
String s = (String) list.get(0);    // compiler inserts the cast
```

### Consequences of Type Erasure

```java
// 1. Cannot create generic arrays
// T[] arr = new T[10];              // compile error

// 2. Cannot use instanceof with generics
// if (list instanceof List<String>)  // compile error

// 3. Cannot overload by generic type alone
// void process(List<String> list) { }
// void process(List<Integer> list) { }  // compile error — same erasure

// 4. At runtime, List<String> and List<Integer> are the same class
List<String> strings = new ArrayList<>();
List<Integer> ints = new ArrayList<>();
System.out.println(strings.getClass() == ints.getClass());  // true
```

> [!info] Why Erasure Exists
> When generics were added in Java 5, the designers needed backward compatibility with existing code that used raw types (`List` without `<>`). Type erasure let new generic code work with old libraries without changes. The price: no type information at runtime.

---

## Generics in Practice

### AQA: Generic Page Object Method

```java
public abstract class BasePage {
    protected WebDriver driver;

    public BasePage(WebDriver driver) { this.driver = driver; }

    // Generic method — returns the actual page type for method chaining
    @SuppressWarnings("unchecked")
    protected <T extends BasePage> T clickAndReturn(By locator) {
        driver.findElement(locator).click();
        return (T) this;
    }
}

public class LoginPage extends BasePage {
    public LoginPage(WebDriver driver) { super(driver); }

    public LoginPage enterUsername(String name) {
        driver.findElement(By.id("user")).sendKeys(name);
        return this;
    }

    public DashboardPage clickLogin() {
        driver.findElement(By.id("login")).click();
        return new DashboardPage(driver);
    }
}
```

### Generic Utility for Test Data

```java
public class TestDataLoader {
    // Load any type from a JSON file
    public static <T> T loadFromJson(String path, Class<T> type) {
        String json = Files.readString(Path.of(path));
        return new Gson().fromJson(json, type);
    }
}

User user = TestDataLoader.loadFromJson("data/user.json", User.class);
Config config = TestDataLoader.loadFromJson("data/config.json", Config.class);
```

### Collections You Use Every Day

```java
List<String> names = new ArrayList<>();           // List of strings
Map<String, Integer> scores = new HashMap<>();    // String keys, Integer values
Set<User> uniqueUsers = new HashSet<>();          // Set of User objects
Optional<String> maybeName = Optional.of("Alice"); // Maybe contains a String
```

> [!tip] When You See `<>` in Code
> Every time you see angle brackets in Java, that's generics. `List<String>`, `Map<K, V>`, `Optional<User>`, `Comparable<T>` — they all use the same mechanism you learned here.

---

## Interview Questions

### Top 10

**1. What are generics in Java? Why do we need them?**
Generics let you write classes and methods that work with any type while maintaining type safety. The compiler checks types at compile time, so you catch errors early instead of getting `ClassCastException` at runtime.

**2. What is a type parameter?**
A placeholder for a real type, declared in angle brackets: `<T>`. When you create an instance (`Box<String>`), `T` is replaced with `String`. The compiler enforces that only `String` values are used.

**3. Can you use primitive types with generics?**
No. Generics work only with reference types. Use wrapper classes instead: `List<Integer>` not `List<int>`, `Box<Double>` not `Box<double>`. Autoboxing handles the conversion.

**4. What is the difference between `<T>` and `<?>`?**
`<T>` declares a named type parameter — you can reference `T` in the method/class body. `<?>` is a wildcard — it means "unknown type" and is used when you don't need to reference the type by name.

**5. What is an upper bounded wildcard? Give an example.**
`<? extends Number>` means "Number or any subclass." Use it when you read from a collection: `double sum(List<? extends Number> list)` accepts `List<Integer>`, `List<Double>`, etc.

**6. What is the PECS principle?**
Producer Extends, Consumer Super. If a collection provides values, use `? extends`. If it receives values, use `? super`. If it does both, use a concrete type.

**7. What is type erasure?**
At runtime, generic type information is removed. `List<String>` becomes `List`. The compiler inserts casts where needed. This was done for backward compatibility with pre-Java 5 code.

**8. Can you create an array of a generic type?**
No. `new T[10]` is illegal because of type erasure — the JVM doesn't know what type `T` is at runtime. Use `List<T>` instead, or pass a `Class<T>` and use `Array.newInstance()`.

**9. What is a bounded type parameter?**
`<T extends Comparable<T>>` restricts `T` to types that implement `Comparable`. This lets you call `compareTo()` inside the method. Without the bound, the compiler doesn't know `T` has that method.

**10. What is a raw type? Why is it bad?**
A raw type is a generic class used without type parameters: `List list = new ArrayList();`. It disables type checking, loses all generic safety, and the compiler issues warnings. Always specify type parameters.

---

### Tricky Questions

**1. Is `List<Object>` a supertype of `List<String>`?**
No. Generics are **invariant**. `String` extends `Object`, but `List<String>` does NOT extend `List<Object>`. This prevents unsafe operations: if it were allowed, you could add an `Integer` to a `List<String>` through a `List<Object>` reference.

**2. Why can't you write `if (list instanceof List<String>)`?**
Because of type erasure. At runtime, the JVM only sees `List` — the `<String>` part is gone. You can check `list instanceof List<?>` (raw type check), but not the specific type parameter.

**3. What happens if two interfaces have the same default method and a class implements both?**
The class must override the method to resolve the conflict. This applies to generics too — if `Interface<String>` and `Interface<Integer>` are both implemented, the erased signatures may collide.

**4. Can a generic class extend `Throwable`?**
No. You cannot create generic exception classes (`class MyException<T> extends Exception`). This is because the catch mechanism needs exact types at runtime, and type erasure removes them.

**5. What is a "diamond" (`<>`) in `new ArrayList<>()`?**
The diamond operator (Java 7+) tells the compiler to infer the type from the left side: `List<String> list = new ArrayList<>();` — the compiler infers `ArrayList<String>`. Before Java 7, you had to write `new ArrayList<String>()`.
