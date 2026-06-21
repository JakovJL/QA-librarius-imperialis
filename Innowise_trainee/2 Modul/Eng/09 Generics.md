# Generics

## Table of Contents

- [[#Why Generics Exist]]
- [[#Generic Classes]]
- [[#Generic Methods]]
- [[#Bounded Types]]
- [[#Wildcards]]
- [[#Type Erasure]]
- [[#Generics in Practice]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]
	- [[#Advanced Questions]]
	- [[#Code Questions]]

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

---

### Advanced Questions

**1. What is variance in generics?**  
Generics are **invariant** by default: `List<String>` is not a subtype of `List<Object>`, even though `String` extends `Object`. This blocks unsafe operations.  
**Covariance** (`? extends T`) allows subtypes: `List<Integer>` is a subtype of `List<? extends Number>`.  
**Contravariance** (`? super T`) allows supertypes: `List<Number>` is a subtype of `List<? super Integer>`.

```java
List<String> strs = new ArrayList<>();
// List<Object> objs = strs;          // ❌ invariance — error

List<? extends Number> nums = new ArrayList<Integer>(); // ✅ covariance
List<? super Integer> ints = new ArrayList<Number>();   // ✅ contravariance
```

**2. Why can't you insert into `List<? extends Number>`?**  
The type is unknown. It could be `List<Integer>`, `List<Double>`, or `List<Number>`. The compiler cannot know if the new element matches the specific subtype. You can only **read** — guaranteed to get a `Number`.

```java
List<? extends Number> list = new ArrayList<Integer>();
// list.add(3.14);    // ❌ — Double cannot be Integer
// list.add(42);      // ❌ — compiler doesn't know if it's Integer
Number n = list.get(0); // ✅ — safe to read
```

**3. Why can't you overload a method by type parameter alone?**  
Because of type erasure. Two methods with the same erased signature are the same method. The compiler cannot tell them apart.

```java
// ❌ Does not compile — same erasure:
void process(List<String> list) { }
void process(List<Integer> list) { } // both become process(List) after erasure
```

**Solution:** rename the method or use different names.

**4. What is a bridge method?**  
The compiler automatically generates a bridge method to preserve polymorphism during type erasure. When a subclass overrides a generic method, the compiler creates a method with the erased signature that calls your generic method.

```java
// Source code:
class Box<T> { T get() { ... } }
class IntBox extends Box<Integer> {
    Integer get() { return 42; }
}
// Compiler adds bridge:
// Object get() { return this.get(); } // calls Integer get()
```

**5. What is the difference between reifiable and non-reifiable types?**  
**Reifiable** — the type is fully available at runtime: primitives (`int`), non-parameterized types (`String`), raw types (`List`), arrays (`String[]`), and `?` (unbounded wildcard).  
**Non-reifiable** — types with partially erased information: `List<String>`, `List<Integer>`. You cannot use `instanceof` or create arrays with them.

```java
boolean a = "hello" instanceof String;         // ✅ reifiable
boolean b = list instanceof List<?>;            // ✅ unbounded wildcard
// boolean c = list instanceof List<String>;    // ❌ non-reifiable — error
```

**6. What is wildcard capture?**  
A situation where the compiler needs to "remember" the unknown type from a `?` wildcard. The compiler creates an implicit type parameter for `?` to perform type checking. This helps in methods where `?` is used on both sides.

```java
// Problem — compiler doesn't know ? is the same type:
public void swap(List<?> list, int i, int j) {
    // list.set(i, list.get(j)); // ❌ — ? might be different
}

// Solution — capture via helper:
private <T> void swapHelper(List<T> list, int i, int j) {
    T tmp = list.get(i);
    list.set(i, list.get(j));
    list.set(j, tmp);
}
public void swap(List<?> list, int i, int j) {
    swapHelper(list, i, j); // compiler captures ? as T
}
```

**7. How do generics work with the static context?**  
The class type parameter (`T`) is **not available** in static methods and fields. Statics belong to the class, not to instances — and instances of the same class can have different `T`.

```java
public class Box<T> {
    // static T value;           // ❌ — compile error
    // public static T get() { } // ❌ — compile error

    public <R> static R convert(R value) { // ✅ — own R at method level
        return value;
    }
}
```

**8. What is `Class<T>` as a type parameter (type token)?**  
It allows passing type information at runtime, bypassing erasure. Used in libraries like Jackson, Gson, Spring to create instances of the correct type.

```java
public <T> T fromJson(String json, Class<T> type) {
    return new Gson().fromJson(json, type);
}
User user = fromJson("{\"name\":\"Alice\"}", User.class);
// Class<User> provides runtime info for creating the right type
```

**9. When is `@SuppressWarnings("unchecked")` justified?**  
When you, as the programmer, know for sure that a cast is safe, but the compiler cannot prove it due to type erasure. Typical cases: (1) generic arrays, (2) raw types in legacy code after migration to generics, (3) casts to `(T[])` and `(T)`. **Never** use it without understanding why you are sure the cast is safe.

```java
@SuppressWarnings("unchecked")
public <T> T[] toArray(T[] a) {
    if (a.length < size) return (T[]) Arrays.copyOf(elementData, size, a.getClass());
    System.arraycopy(elementData, 0, a, 0, size);
    return a;
}
```

**10. What is the difference between `List<Object>` and `List<?>`?**  
`List<Object>` is a **concrete** type — it can store any object. You can read as `Object` and **write** any type.  
`List<?>` is an **unknown** type. You can read as `Object`, but you cannot **write** anything except `null`. Purpose: tell a method that the collection's type does not matter and should not be changed.

```java
List<Object> objs = new ArrayList<>();
objs.add("hello");
objs.add(42);                  // ✅ can write anything

List<?> wild = new ArrayList<String>();
// wild.add("hello");           // ❌ — cannot write (except null)
Object o = wild.get(0);         // ✅ — can read as Object
```

---

### Code Questions

**1. What does this code print?**  
```java
List<String> strings = new ArrayList<>();
List<Integer> integers = new ArrayList<>();
System.out.println(strings.getClass() == integers.getClass());
```
**Answer:** `true`. At runtime, both are `ArrayList`. The `<String>` and `<Integer>` information is erased. `getClass()` returns the same `Class` object for both.

**2. Will this code compile?**  
```java
public void addToList(List<?> list) {
    list.add("hello");
}
```
**Answer:** No. `List<?>` means "unknown type." You can read as `Object`, but the only thing you can add is `null`. The compiler blocks writes to keep type safety.

**3. Will this code compile?**  
```java
List<? extends Number> nums = new ArrayList<Integer>();
nums.add(42);
```
**Answer:** No. `nums` is covariant — it could be `List<Integer>`, `List<Double>`, or any other subtype. The compiler cannot guarantee that `42` is the correct type for the unknown subtype of `Number`. Reading — yes. Writing — no.

**4. What does this code print?**  
```java
public class Test {
    public static void main(String[] args) {
        Box<Integer> box = new Box<>();
        System.out.println(box.get());
    }
}
class Box<T> {
    public T get() { return null; }
}
```
**Answer:** `null`. After erasure, `Box.get()` returns `Object`, and the compiler inserts a cast to `Integer`. But the value inside is `null`. Casting `null` to any type works without error.

**5. Will this code compile?**  
```java
class Container<T> {
    private T[] items = new T[10];
    public T get(int i) { return items[i]; }
}
```
**Answer:** No. `new T[10]` does not compile because of type erasure — the JVM doesn't know what array to create. Fix: `(T[]) new Object[10]` with `@SuppressWarnings("unchecked")`, or use `List<T>` instead of an array.

---

### Practical Tasks

> [!tip] How to practice
> Try to solve each task yourself first, then check the solution.

#### 1. Write a generic method to find max

**Task:** Write a static generic method `findMax` that takes `List<T>` and returns the maximum element. T must be bounded by Comparable.

```java
public static <T extends Comparable<T>> T findMax(List<T> list) {
    T max = list.get(0);
    for (T item : list) {
        if (item.compareTo(max) > 0) max = item;
    }
    return max;
}

// Usage:
System.out.println(findMax(List.of(3, 1, 4, 1, 5)));       // 5
System.out.println(findMax(List.of("apple", "banana")));    // "banana"
```

**Explanation:** `<T extends Comparable<T>>` is a bounded type parameter. Without it, you can't call `compareTo()`. The method works with any Comparable type.

| Complexity | O(n) time, O(1) memory |

#### 2. PECS — what compiles?

**Task:** Mark which lines compile and which do not. Explain why.

```java
List<? extends Number> readers = new ArrayList<Integer>();
// readers.add(42);                        // 1 — ?
Number n = readers.get(0);                 // 2 — ?

List<? super Integer> writers = new ArrayList<Number>();
writers.add(42);                           // 3 — ?
Object o = writers.get(0);                 // 4 — ?
```

**Answer:** 1 — ❌ won't compile (covariant — type unknown, cannot write). 2 — ✅ compiles (read as Number). 3 — ✅ compiles (contravariant — can write Integer). 4 — ✅ compiles, but type is Object, not Integer.

**Explanation:** PECS: Producer Extends (read only), Consumer Super (write only).

#### 3. Generic Pair class

**Task:** Implement a generic `Pair<K, V>` class with `getKey()` and `getValue()` methods.

```java
public class Pair<K, V> {
    private final K key;
    private final V value;

    public Pair(K key, V value) { this.key = key; this.value = value; }
    public K getKey() { return key; }
    public V getValue() { return value; }
}

// Usage:
Pair<String, Integer> pair = new Pair<>("age", 25);
String key = pair.getKey();     // "age" — no cast
Integer val = pair.getValue();  // 25 — no cast
```

**Explanation:** K and V are two independent type parameters. The compiler infers types from the constructor (diamond `<>`).

#### 4. Wildcard capture — fix the code

**Task:** This code does not compile. Fix it using wildcard capture.

```java
public void swap(List<?> list, int i, int j) {
    list.set(i, list.get(j)); // ❌ does not compile
}
```

**Solution:**

```java
private <T> void swapHelper(List<T> list, int i, int j) {
    T tmp = list.get(i);
    list.set(i, list.get(j));
    list.set(j, tmp);
}
public void swap(List<?> list, int i, int j) {
    swapHelper(list, i, j); // compiler captures ? as T
}
```

**Explanation:** The compiler doesn't know that `?` in `get()` and `set()` is the same type. The helper method with `<T>` captures the unknown type and makes both calls type-safe.

#### 5. Type erasure — verify in practice

**Task:** What does this code print? Why?

```java
List<String> strings = new ArrayList<>();
List<Integer> integers = new ArrayList<>();
System.out.println(strings.getClass() == integers.getClass());

// Can we do this?
// if (strings instanceof List<String>) { }
```

**Answer:** `true`. At runtime, both are `ArrayList`. The `<String>` and `<Integer>` information is erased. `instanceof List<String>` won't compile — non-reifiable types cannot be checked at runtime.

**Explanation:** Type erasure is the cost of backward compatibility with Java 4. The compiler inserts implicit casts, and at runtime all generic types look like raw types.
