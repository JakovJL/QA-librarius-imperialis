# Enums

## Table of Contents

- [[#Why Enums Exist]]
- [[#Basic Enum]]
- [[#Enum with Fields and Methods]]
- [[#Enum in switch]]
- [[#Enum Utility Methods]]
- [[#Enums in Practice]]

**Related notes:** [[AQA Java eng]]

> [!info] Video Course (Zaur Tregulov)
> Course 2 (Black Belt): "Other Topics" section — Enum.

---

## Why Enums Exist

Imagine you have a set of fixed values — browser types, test statuses, days of the week. You could use `String` constants:

```java
public static final String CHROME = "CHROME";
public static final String FIREFOX = "FIREFOX";
```

But this has problems:
- Nothing stops you from passing `"CRHOME"` (typo) — it compiles fine
- No way to list all valid values
- No type safety — any `String` fits where a browser name is expected

An **enum** is a special class that represents a fixed set of constants. The compiler guarantees that only declared values can be used.

```java
public enum Browser {
    CHROME, FIREFOX, EDGE, SAFARI
}

Browser b = Browser.CHROME;   // only these 4 values are allowed
// Browser b = Browser.OPERA; // compile error — OPERA is not declared
```

> [!danger] Core Idea
> Enum = a type with a closed set of values. If you know all possible options at compile time, use an enum.

---

## Basic Enum

```java
public enum Season {
    SPRING, SUMMER, AUTUMN, WINTER
}
```

Under the hood, each constant is a `public static final` instance of the `Season` class. The JVM creates exactly 4 `Season` objects — one for each constant — and no more can be created.

```java
Season current = Season.SUMMER;
System.out.println(current);          // SUMMER
System.out.println(current.name());   // "SUMMER" (String)
System.out.println(current.ordinal()); // 1 (zero-based position)
```

> [!info] Enum is a Class
> Every enum implicitly extends `java.lang.Enum`. This means you cannot extend another class. But enums can implement interfaces.

---

## Enum with Fields and Methods

Enums are not just labels. Each constant can carry data and behavior. This is what makes Java enums powerful compared to enums in other languages.

**Why would you need this?** Suppose each browser has a driver class name and a default timeout. Instead of keeping this data in a separate config or map, you store it directly in the enum — the data and the constant live together.

```java
public enum Browser {
    CHROME("chromedriver", 10),
    FIREFOX("geckodriver", 15),
    EDGE("msedgedriver", 10);

    private final String driverName;
    private final int defaultTimeout;

    // Constructor is always private (even without the keyword)
    Browser(String driverName, int defaultTimeout) {
        this.driverName = driverName;
        this.defaultTimeout = defaultTimeout;
    }

    public String getDriverName() { return driverName; }
    public int getDefaultTimeout() { return defaultTimeout; }

    public String getDriverPath() {
        return "drivers/" + driverName;
    }
}
```

```java
Browser browser = Browser.CHROME;
System.out.println(browser.getDriverName());     // chromedriver
System.out.println(browser.getDefaultTimeout()); // 10
System.out.println(browser.getDriverPath());     // drivers/chromedriver
```

> [!caution] Enum Constructor is Always Private
> You cannot write `new Browser(...)`. The only instances are the ones declared as constants. This is how the "fixed set" guarantee works.

---

## Enum in switch

Enums work naturally with `switch` — and the compiler warns you if you miss a case.

```java
public String getSeasonMessage(Season season) {
    switch (season) {
        case SPRING: return "Time to plant";
        case SUMMER: return "Time to rest";
        case AUTUMN: return "Time to harvest";
        case WINTER: return "Time to code";
        default: return "Unknown";
    }
}
```

With enhanced switch (Java 14+):

```java
String message = switch (season) {
    case SPRING -> "Time to plant";
    case SUMMER -> "Time to rest";
    case AUTUMN -> "Time to harvest";
    case WINTER -> "Time to code";
};
```

> [!tip] No Default Needed
> If you cover all enum values in an enhanced switch, the compiler knows the switch is exhaustive — no `default` branch needed. If you later add a new constant to the enum, the compiler will warn you about every switch that doesn't handle it.

---

## Enum Utility Methods

Every enum gets these methods for free:

| Method | What it does | Example |
|---|---|---|
| `name()` | Returns the constant name as a String | `Browser.CHROME.name()` -> `"CHROME"` |
| `ordinal()` | Returns the position (0-based) | `Browser.FIREFOX.ordinal()` -> `1` |
| `values()` | Returns an array of all constants | `Browser.values()` -> `[CHROME, FIREFOX, EDGE]` |
| `valueOf(String)` | Converts a String to an enum constant | `Browser.valueOf("CHROME")` -> `Browser.CHROME` |

```java
// Loop through all values
for (Browser b : Browser.values()) {
    System.out.println(b.name() + " -> " + b.getDriverName());
}

// Parse from String (e.g., from config file)
String config = "FIREFOX";
Browser browser = Browser.valueOf(config);   // Browser.FIREFOX
// Browser.valueOf("Opera");                 // IllegalArgumentException!
```

> [!caution] valueOf is Case-Sensitive
> `Browser.valueOf("chrome")` throws `IllegalArgumentException`. The string must exactly match the constant name. If you need case-insensitive parsing, write a helper method.

---

## Enums in Practice

### Test Status Tracking

```java
public enum TestStatus {
    PASSED("green"),
    FAILED("red"),
    SKIPPED("yellow"),
    BLOCKED("gray");

    private final String color;

    TestStatus(String color) { this.color = color; }
    public String getColor() { return color; }
}
```

### Environment Configuration

```java
public enum Environment {
    DEV("https://dev.example.com", "dev_user"),
    STAGING("https://staging.example.com", "stage_user"),
    PROD("https://example.com", "prod_user");

    private final String baseUrl;
    private final String defaultUser;

    Environment(String baseUrl, String defaultUser) {
        this.baseUrl = baseUrl;
        this.defaultUser = defaultUser;
    }

    public String getBaseUrl() { return baseUrl; }
    public String getDefaultUser() { return defaultUser; }
}

// Usage in tests
Environment env = Environment.valueOf(System.getProperty("env", "DEV"));
driver.get(env.getBaseUrl());
```

### Enum Implementing an Interface

```java
public interface Describable {
    String describe();
}

public enum Priority implements Describable {
    LOW {
        @Override
        public String describe() { return "Can wait"; }
    },
    MEDIUM {
        @Override
        public String describe() { return "Should fix soon"; }
    },
    HIGH {
        @Override
        public String describe() { return "Fix now"; }
    };
}
```

> [!tip] When to Use Enums in AQA
> - Browser types (`CHROME`, `FIREFOX`, `EDGE`)
> - Test environments (`DEV`, `STAGING`, `PROD`)
> - Test statuses (`PASSED`, `FAILED`, `SKIPPED`)
> - User roles (`ADMIN`, `USER`, `GUEST`)
> - Any value that comes from a config and has a known fixed set of options

---

## Interview Questions

### Top 10

**1. What is an enum in Java?**
An enum is a special class that represents a fixed set of constants. Each constant is a `public static final` instance of the enum class. Enums provide type safety — the compiler ensures only declared values are used.

**2. Can an enum have fields, methods, and constructors?**
Yes. Enums can have private fields, public methods, and constructors. The constructor is always private (implicitly). Each constant can pass arguments to the constructor, and each carries its own data.

**3. What is the difference between `name()` and `toString()` for an enum?**
`name()` always returns the exact constant name as declared (e.g., `"CHROME"`). `toString()` returns the same by default, but can be overridden to return a human-friendly string. `valueOf()` relies on `name()`, not `toString()`.

**4. What does `values()` return?**
A new array containing all constants of the enum, in the order they are declared. It is often used for iteration or validation.

**5. How do you safely convert a String to an enum?**
`Browser.valueOf("CHROME")` works if the string matches exactly. It throws `IllegalArgumentException` for unknown values. For safe conversion, wrap it in a try-catch or write a helper that iterates `values()`.

**6. Can an enum implement an interface?**
Yes. Enums can implement any number of interfaces. Each constant can provide its own implementation. This is useful for strategy-like patterns.

**7. Can an enum extend a class?**
No. Every enum already extends `java.lang.Enum` implicitly. Java does not allow multiple inheritance, so an enum cannot extend another class.

**8. Why use enums instead of String or int constants?**
Type safety (compiler catches invalid values), no typos, auto-complete in IDE, ability to attach data and behavior, `values()` for listing all options.

**9. Is it possible to create new enum instances at runtime?**
No. The set of instances is fixed at compile time. You cannot use `new`, reflection, or deserialization to create new instances. This makes enums inherently singleton-per-value.

**10. Can enums be used in switch statements?**
Yes, and this is one of their primary use cases. The compiler checks that all cases are covered (in enhanced switch), which prevents bugs when new constants are added.

---

### Tricky Questions

**1. What happens if you compare enums with `==`?**
It works correctly. Since each constant is a singleton instance, `==` compares identity, which is the same as logical equality. In fact, `==` is preferred over `.equals()` for enums because it is null-safe: `null == Browser.CHROME` returns `false`, while `null.equals(Browser.CHROME)` throws `NullPointerException`.

**2. Can an enum have an abstract method?**
Yes. If an enum declares an abstract method, every constant must implement it. This is how you give each constant unique behavior without an interface.

**3. Are enums thread-safe?**
Enum constants are created when the class is loaded — this is inherently thread-safe in Java. Enum fields marked `final` are safely published. However, if an enum has mutable state (non-final fields), that state is not automatically thread-safe.

**4. Can an enum be serialized?**
Yes, and serialization is handled specially. The JVM serializes only the constant's `name()` and recreates it via `valueOf()` on deserialization. This means enum singletons survive serialization, unlike regular classes.

**5. What is `EnumSet` and why use it instead of `HashSet<MyEnum>`?**
`EnumSet` is a specialized `Set` implementation for enums. Internally it uses a bit vector, making it extremely fast and memory-efficient. Example: `EnumSet.of(Browser.CHROME, Browser.FIREFOX)`.
