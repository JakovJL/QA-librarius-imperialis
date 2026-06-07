# String in Depth

## Table of Contents

- [[#Why Strings are Special]]
- [[#String Pool]]
- [[#Immutability]]
- [[#StringBuilder and StringBuffer]]
- [[#Useful String Methods]]
- [[#String Formatting]]
- [[#Basic Regular Expressions]]

**Related notes:** [[AQA Java eng]]

> [!info] Video Course (Zaur Tregulov)
> Course 1 (OCA): L16 String, L17 StringBuilder. Course 2 (Black Belt): Regular Expressions.

---

## Why Strings are Special

In Java, `String` is not a primitive type — it is a class. But the language treats it differently from other classes:

- You can create a String without `new`: `String s = "hello";`
- The `+` operator is overloaded for String concatenation
- String literals are automatically **interned** (stored in a special memory pool)
- Strings are **immutable** — once created, they cannot be changed

These special features exist because strings are the most commonly used data type. Almost every program deals with text — user input, file paths, URLs, test data, log messages. Java optimizes strings heavily because of this.

> [!danger] Core Rule
> `String` is a `final` class. It cannot be subclassed. Every "modification" creates a new String object. This is by design, not a limitation.

---

## String Pool

When you write a string literal in code, Java does not always create a new object. It first checks a special area of memory called the **String Pool** (also called the intern pool).

```java
String a = "hello";    // creates "hello" in the pool
String b = "hello";    // reuses the SAME object from the pool
String c = new String("hello");  // creates a NEW object on the heap

System.out.println(a == b);     // true  — same object in the pool
System.out.println(a == c);     // false — different objects
System.out.println(a.equals(c)); // true — same content
```

**How it works:**
1. `"hello"` (literal) -> JVM checks the pool. Not found? Creates it there. Found? Returns the existing reference.
2. `new String("hello")` -> Always creates a new object on the heap, even if `"hello"` already exists in the pool.

### Why Does the Pool Exist?

Strings appear everywhere in code — class names, method names, config values. Many of them repeat. Without the pool, every `"hello"` would create a separate object. The pool saves memory by sharing identical strings.

```java
// You can manually add a string to the pool:
String c = new String("hello").intern();
System.out.println(a == c);   // true — intern() returns the pooled version
```

> [!tip] Practical Rule
> Use literals (`"hello"`) whenever possible. Use `new String()` only when you explicitly need a separate object (which is almost never). Always compare with `.equals()`, never `==`.

---

## Immutability

A `String` object cannot be changed after creation. Every method that seems to modify a string actually returns a **new** String.

```java
String name = "Alice";
String upper = name.toUpperCase();

System.out.println(name);    // "Alice"  — original is unchanged
System.out.println(upper);   // "ALICE"  — new object
```

This means string concatenation in a loop creates many temporary objects:

```java
// BAD — creates ~1000 temporary String objects
String result = "";
for (int i = 0; i < 1000; i++) {
    result = result + i;   // each + creates a new String
}

// GOOD — one StringBuilder, no temporary objects
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String result = sb.toString();
```

### Why is String Immutable?

The design is intentional, and the reasons matter:

1. **String Pool works only because of immutability.** If `a` and `b` point to the same pooled `"hello"` and someone could change `a` to `"world"`, then `b` would also become `"world"`. Immutability prevents this.
2. **Thread safety.** Multiple threads can share the same String without synchronization.
3. **Security.** Strings carry sensitive data — class names, file paths, database URLs. If a string could be changed after a security check, the check would be meaningless.
4. **Hash code caching.** String caches its `hashCode()` on first call. This makes HashMap lookups with String keys very fast.

> [!warning] Common Mistake
> `name.toUpperCase();` does nothing if you don't assign the result. The original `name` is unchanged. You must write `name = name.toUpperCase();`.

---

## StringBuilder and StringBuffer

When you need to build or modify text repeatedly, use `StringBuilder`. It is a **mutable** sequence of characters — modifications happen in place, without creating new objects.

```java
StringBuilder sb = new StringBuilder("Hello");
sb.append(" World");      // "Hello World"
sb.insert(5, ",");        // "Hello, World"
sb.replace(0, 5, "Hi");  // "Hi, World"
sb.delete(2, 4);          // "Hiorld"  — deletes index 2..3
sb.reverse();              // "dlroiH"

String result = sb.toString();  // convert back to String
```

### StringBuilder vs StringBuffer

| Feature | StringBuilder | StringBuffer |
|---|---|---|
| Thread-safe | No | Yes (synchronized) |
| Speed | Faster | Slower (due to synchronization) |
| When to use | Single-threaded code (99% of cases) | Multi-threaded code that shares a buffer |

> [!tip] Default Choice
> Always use `StringBuilder`. Use `StringBuffer` only when multiple threads write to the same buffer — which is extremely rare in practice.

### When to Use What

| Situation | Use |
|---|---|
| Simple concatenation (`a + b`) | `String` (compiler optimizes it) |
| Concatenation in a loop | `StringBuilder` |
| Building complex text (HTML, SQL, reports) | `StringBuilder` |
| Read-only text, method parameters | `String` |

---

## Useful String Methods

These methods appear constantly in test automation — validating text, extracting data, comparing results.

### Checking Content

```java
String text = "Test Case #42: Login Validation";

text.isEmpty()               // false
text.isBlank()               // false (Java 11+ — checks whitespace too)
text.contains("Login")       // true
text.startsWith("Test")      // true
text.endsWith("Validation")  // true
text.matches(".*#\\d+.*")   // true (regex match)
```

### Extracting and Transforming

```java
String text = "  Hello, World!  ";

text.trim()                  // "Hello, World!" — removes leading/trailing spaces
text.strip()                 // "Hello, World!" — Java 11+, handles Unicode spaces
text.substring(2, 7)         // "llo, " — from index 2 to 6 (exclusive end)
text.charAt(7)               // 'W'
text.indexOf("World")        // 9
text.toLowerCase()           // "  hello, world!  "
text.toUpperCase()           // "  HELLO, WORLD!  "
text.replace("World", "Java") // "  Hello, Java!  "
```

### Splitting and Joining

```java
String csv = "Alice,Bob,Charlie";
String[] names = csv.split(",");     // ["Alice", "Bob", "Charlie"]

String joined = String.join(" | ", names);  // "Alice | Bob | Charlie"

// Split with limit
"a.b.c.d".split("\\.", 2);          // ["a", "b.c.d"] — only 2 parts
```

> [!caution] split() Takes a Regex
> `"file.txt".split(".")` returns an empty array because `.` in regex means "any character". Escape it: `split("\\.")`.

---

## String Formatting

### String.format()

Works like `printf` in C — placeholders are replaced with values.

```java
String name = "Alice";
int score = 95;
double percent = 95.5;

String msg = String.format("Student %s scored %d (%.1f%%)", name, score, percent);
// "Student Alice scored 95 (95.5%)"
```

| Placeholder | Type | Example |
|---|---|---|
| `%s` | String | `"Alice"` |
| `%d` | Integer | `42` |
| `%f` | Float/Double | `3.140000` |
| `%.2f` | Float with 2 decimals | `3.14` |
| `%n` | Newline (platform-specific) | |
| `%%` | Literal `%` | `%` |

### formatted() (Java 15+)

```java
String msg = "Hello, %s! You have %d messages.".formatted("Alice", 5);
```

### Text Blocks (Java 15+)

For multi-line strings — useful for SQL, JSON, HTML in tests:

```java
String json = """
        {
            "name": "Alice",
            "age": 25,
            "active": true
        }
        """;
```

> [!tip] AQA Use Case
> Text blocks are perfect for expected JSON in API tests and for SQL queries in database tests. No more ugly concatenation with `\n`.

---

## Basic Regular Expressions

Regular expressions (regex) let you match patterns in text. In test automation, you use them for validating formats, extracting data, and parsing logs.

### Common Patterns

| Pattern | Matches | Example |
|---|---|---|
| `\\d` | A digit | `"5"` |
| `\\d+` | One or more digits | `"123"` |
| `\\w` | A word character (letter, digit, `_`) | `"a"` |
| `\\s` | A whitespace | `" "` |
| `.` | Any character | `"x"` |
| `[abc]` | One of a, b, c | `"b"` |
| `[a-z]` | Any lowercase letter | `"m"` |
| `^` | Start of string | |
| `$` | End of string | |
| `*` | Zero or more | `"aaa"` or `""` |
| `+` | One or more | `"aaa"` |
| `?` | Zero or one | `"a"` or `""` |

### Using Regex with String

```java
// Check if matches
String email = "user@example.com";
boolean valid = email.matches("[\\w.]+@[\\w.]+\\.[a-z]{2,}");  // true

// Replace with pattern
String text = "Order #123 and Order #456";
String cleaned = text.replaceAll("#\\d+", "#XXX");
// "Order #XXX and Order #XXX"

// Split by pattern
String data = "Alice   Bob\tCharlie";
String[] names = data.split("\\s+");   // ["Alice", "Bob", "Charlie"]
```

### Regex in AQA

```java
// Validate error message format
String error = "Error 404: Page not found";
assertTrue(error.matches("Error \\d{3}: .+"));

// Extract number from text
String price = "Total: $42.99";
String number = price.replaceAll("[^\\d.]", "");  // "42.99"
```

> [!info] When to Go Deeper
> For complex regex (capturing groups, lookahead, named groups), use `Pattern` and `Matcher` classes. For simple validation and replacement, String methods are enough.

---

## Interview Questions

### Top 10

**1. Why is String immutable in Java?**
For String Pool safety (shared references would corrupt if mutable), thread safety (no synchronization needed), security (sensitive strings can't be changed after checks), and performance (hashCode is cached). Immutability is enforced by `final` class + `private final` internal array.

**2. What is the String Pool?**
A special memory area where Java stores string literals. When you write `"hello"`, the JVM checks the pool first. If `"hello"` already exists, it returns the existing reference instead of creating a new object. This saves memory.

**3. What is the difference between `==` and `.equals()` for Strings?**
`==` compares references (memory addresses). `.equals()` compares content (characters). Two strings with the same content may be different objects: `new String("a") == new String("a")` is `false`, but `.equals()` is `true`.

**4. What is the difference between `StringBuilder` and `StringBuffer`?**
Both are mutable character sequences. `StringBuilder` is not thread-safe but faster. `StringBuffer` is thread-safe (synchronized) but slower. Use `StringBuilder` in 99% of cases.

**5. When should you use `StringBuilder` instead of `String` concatenation?**
When concatenating in a loop or building text from many parts. `String` concatenation creates a new object each time. `StringBuilder` modifies in place. For simple `a + b + c` (no loop), the compiler optimizes it — `StringBuilder` is not needed.

**6. What does `intern()` do?**
`intern()` adds a string to the String Pool (or returns the existing pooled version). After `String s = new String("hi").intern();`, `s` points to the pooled `"hi"`. Useful in rare cases where you have many duplicate strings from external sources.

**7. What is the difference between `trim()` and `strip()`?**
`trim()` removes ASCII whitespace (characters <= ` `). `strip()` (Java 11+) removes all Unicode whitespace, including non-breaking spaces. `strip()` is the modern choice.

**8. How does `split()` work? What is the gotcha?**
`split(regex)` divides a string by a regex pattern. The gotcha: the argument is a regex, not a plain string. `"a.b".split(".")` returns an empty array because `.` means "any character" in regex. Use `split("\\.")` for a literal dot.

**9. What are text blocks? (Java 15+)**
Multi-line string literals using triple quotes (`"""`). They preserve line breaks and indentation, and strip common leading whitespace. Useful for JSON, SQL, HTML templates in tests.

**10. What is `String.format()` used for?**
Creating strings with placeholders: `String.format("Name: %s, Age: %d", name, age)`. Placeholders: `%s` (String), `%d` (int), `%f` (float), `%.2f` (2 decimal places). Cleaner than concatenation for complex messages.

---

### Tricky Questions

**1. How many String objects are created by `String s = new String("hello");`?**
Up to two. The literal `"hello"` creates one object in the String Pool (if not already there). `new String(...)` creates a second object on the heap. The variable `s` references the heap object.

**2. Is `"" + 5` valid? What happens?**
Yes. The compiler converts it to `new StringBuilder().append("").append(5).toString()`, which produces `"5"`. Any type concatenated with a String becomes a String.

**3. Why does `"abc" == "ab" + "c"` return `true`?**
The compiler optimizes constant expressions at compile time. `"ab" + "c"` is evaluated to `"abc"` during compilation, and the result uses the same pooled string. But `String a = "ab"; a + "c" == "abc"` is `false` — `a` is a variable, so the concatenation happens at runtime and creates a new object.

**4. Can you change a String using reflection?**
Technically yes — you can access the internal `char[]` (Java 8) or `byte[]` (Java 9+) via reflection. But this breaks the immutability contract, corrupts the String Pool, and should never be done. Java 9+ modules make this harder with access restrictions.

**5. What happens if you call `split("")` on a string?**
It splits every character: `"abc".split("")` returns `["a", "b", "c"]`. In Java 8+, this does not include a leading empty string (older Java versions did).
