# Exception Handling

## Table of Contents

- [[#Why Exceptions Matter]]
- [[#Exception Hierarchy]]
- [[#Checked and Unchecked Exceptions]]
- [[#try catch and finally]]
- [[#throw and throws]]
- [[#Custom Exceptions]]
- [[#Try-With-Resources]]
- [[#Exception Handling in AQA]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]
	- [[#Advanced Questions]]
	- [[#Code Questions]]

**Related notes:** [[AQA Java eng]]

> [!info] Video Course (Zaur Tregulov)
> Course 1 (OCA): L24 exceptions & error handling.

---

## Why Exceptions Matter

Programs do not always work in the happy path. A file may be missing, a locator may be wrong, a network call may fail, or user input may be invalid. Java uses **exceptions** to signal such problems.

Exception handling matters because it helps you:

- Separate normal logic from error logic
- Stop silent failures
- Give useful messages for debugging
- Recover from expected problems when recovery is possible

Without exception handling, the program may crash without clear information about what happened.

---

## Exception Hierarchy

All problems in Java inherit from `Throwable`.

```text
Throwable
├── Error
└── Exception
    └── RuntimeException
```

### Error

`Error` means serious JVM-level problems. Usually, application code should not try to handle them.

Examples:

- `OutOfMemoryError`
- `StackOverflowError`

### Exception

`Exception` means problems that application code may want to handle.

Examples:

- `IOException`
- `SQLException`
- `ParseException`

### RuntimeException

`RuntimeException` is a special group of exceptions caused mostly by programming mistakes.

Examples:

- `NullPointerException`
- `IllegalArgumentException`
- `IndexOutOfBoundsException`
- `ArithmeticException`

> [!danger] Core Rule
> `Error` is usually not handled. `Exception` is handled or declared. `RuntimeException` often means a bug in code or invalid input.

---

## Checked and Unchecked Exceptions

This is one of the most common interview topics.

### Checked Exceptions

Checked exceptions are verified by the compiler. You must either handle them with `try-catch` or declare them with `throws`.

```java
public String readFile(String path) throws IOException {
    return Files.readString(Path.of(path));
}
```

Examples:

- `IOException`
- `SQLException`
- `ClassNotFoundException`

### Unchecked Exceptions

Unchecked exceptions are subclasses of `RuntimeException`. The compiler does not force you to handle them.

```java
public int divide(int a, int b) {
    return a / b; // can throw ArithmeticException if b == 0
}
```

Examples:

- `NullPointerException`
- `IllegalStateException`
- `NumberFormatException`

> [!tip] Quick Comparison
> | Type | Checked by compiler | Typical cause |
> |---|---|---|
> | Checked exception | Yes | External problem: file, DB, network |
> | Unchecked exception | No | Bug in code or bad input |

In simple words:

- Checked exception -> "something outside the code can fail"
- Unchecked exception -> "the code uses data in a wrong way"

---

## try catch and finally

The basic syntax for exception handling is `try-catch-finally`.

```java
try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
} finally {
    System.out.println("This block always runs");
}
```

### `try`

The `try` block contains code that may throw an exception.

### `catch`

The `catch` block handles a specific exception.

```java
try {
    Integer.parseInt("abc");
} catch (NumberFormatException e) {
    System.out.println("Invalid number: " + e.getMessage());
}
```

### `finally`

The `finally` block runs almost always, whether exception happened or not. It is often used for cleanup.

```java
FileInputStream input = null;
try {
    input = new FileInputStream("data.txt");
    // work with file
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (input != null) {
        try {
            input.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### Multiple catch Blocks

```java
try {
    String text = args[0];
    int number = Integer.parseInt(text);
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("No argument passed");
} catch (NumberFormatException e) {
    System.out.println("Argument is not a number");
}
```

> [!warning] Order Matters
> Put more specific exceptions before more general ones. If you catch `Exception` first, the compiler will not allow a later `IOException` catch block because it becomes unreachable.

---

## throw and throws

These two keywords are often confused.

### `throw`

`throw` is used inside a method to create and throw one exception object.

```java
public void setAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("Age cannot be negative");
    }
}
```

### `throws`

`throws` is used in the method signature to declare that the method may pass an exception to the caller.

```java
public String loadConfig(String path) throws IOException {
    return Files.readString(Path.of(path));
}
```

> [!info] Short Rule
> `throw` -> action inside method. `throws` -> declaration in method signature.

---

## Custom Exceptions

Sometimes standard exceptions are too generic. In that case, you can create your own exception class.

```java
public class InvalidUserDataException extends RuntimeException {
    public InvalidUserDataException(String message) {
        super(message);
    }
}
```

```java
public void register(User user) {
    if (user.getEmail() == null) {
        throw new InvalidUserDataException("Email is required");
    }
}
```

### When to Use Custom Exceptions

- When the error has clear business meaning
- When you want better logs and messages
- When you want one specific type for one problem area

In test automation, custom exceptions can make failures easier to read.

---

## Try-With-Resources

If you work with files, streams, database connections, or other closeable resources, use **try-with-resources**.

```java
try (BufferedReader reader = Files.newBufferedReader(Path.of("data.txt"))) {
    String line = reader.readLine();
    System.out.println(line);
} catch (IOException e) {
    e.printStackTrace();
}
```

Why it is better:

- Resource closes automatically
- Code is shorter
- Less risk of memory/resource leak

It works with classes that implement `AutoCloseable`, such as:

- streams
- readers/writers
- JDBC connections, statements, result sets

> [!tip] Best Practice
> Prefer try-with-resources over manual `finally` cleanup when working with closeable resources.

---

## Exception Handling in AQA

In automation, exceptions happen all the time. The goal is not to hide them. The goal is to handle them correctly and keep failure messages useful.

### Common Examples

```java
try {
    driver.findElement(By.id("login")).click();
} catch (NoSuchElementException e) {
    throw new AssertionError("Login button was not found", e);
}
```

### Typical AQA Exceptions

- `NoSuchElementException` - element not found
- `TimeoutException` - wait condition failed
- `StaleElementReferenceException` - DOM changed
- `AssertionError` - expected result does not match actual result

### Good Practices

- Add clear message when rethrowing exceptions
- Do not catch every exception blindly
- Do not hide test failures with empty `catch` blocks
- Catch only when you can recover or improve the message

### Bad Example

```java
try {
    driver.findElement(By.id("login")).click();
} catch (Exception e) {
    // ignore
}
```

This is bad because the test may continue in a broken state and fail later with a confusing reason.

> [!caution] Empty catch Is Dangerous
> An empty `catch` block hides the real problem. In tests, this creates false positives or unclear failures. If you catch an exception, log it, wrap it, or fail the test with a clear message.

---

## Interview Questions

### Top 10

**1. What is an exception in Java?**  
An exception is an object that describes a problem during program execution. Java uses it to stop normal flow and transfer control to error-handling code.

**2. What is the difference between checked and unchecked exceptions?**  
Checked exceptions are verified by the compiler and must be handled or declared. Unchecked exceptions extend `RuntimeException` and are not forced by the compiler.

**3. What is the difference between `throw` and `throws`?**  
`throw` is used inside a method to throw an exception object. `throws` is used in the method signature to declare possible exceptions.

**4. What is `finally` used for?**  
It is used for cleanup code that should run whether exception happens or not, for example closing resources.

**5. Can you catch multiple exceptions?**  
Yes. You can use multiple `catch` blocks or multi-catch syntax like `catch (IOException | SQLException e)`.

**6. What is the parent class of all exceptions?**  
Technically, the top class is `Throwable`. `Exception` is the parent of most application-level exceptions.

**7. What is try-with-resources?**  
A syntax that closes resources automatically after use. It works with classes that implement `AutoCloseable`.

**8. Should you catch `Exception` everywhere?**  
No. Catching too broadly hides real problems and makes debugging harder. Catch specific exceptions when possible.

**9. Can `finally` be skipped?**  
In normal situations it runs, but it may not run in extreme cases such as JVM crash or forced process termination.

**10. When would you create a custom exception?**  
When the problem has clear business meaning and a dedicated exception makes code and logs easier to understand.

---

### Tricky Questions

**1. Is `RuntimeException` checked or unchecked?**  
Unchecked. The compiler does not force you to handle it.

**2. Can you have `try` without `catch`?**  
Yes, if you have `finally`. You can also use try-with-resources with `catch` and/or `finally`.

**3. What happens if both `try` and `finally` throw exceptions?**  
The exception from `finally` can hide the original one. This is another reason why try-with-resources is safer than manual cleanup.

**4. Why is catching `Throwable` usually a bad idea?**  
Because it also catches `Error`, and serious JVM problems usually should not be handled like normal business errors.

**5. What is the difference between `Exception` and `Error`?**  
`Exception` describes problems application code may handle. `Error` describes serious system-level problems that are usually not recoverable in normal code.

---

### Advanced Questions

**1. Multi-catch vs multiple `catch` blocks — what is the difference?**  
Multiple `catch` blocks catch exceptions in order — the first match wins. Multi-catch (`catch (IOException | SQLException e)`) catches several types in one block. Restriction: the types in multi-catch cannot be in a parent-child relationship (the compiler would make you use just the parent).

```java
// ✅ Multiple catch — different actions:
try { ... }
catch (FileNotFoundException e) { log("file missing"); }
catch (IOException e) { log("io error"); }

// ✅ Multi-catch — same action:
try { ... }
catch (IOException | SQLException e) { log("db or io error", e); }

// ❌ Error — FileNotFoundException extends IOException:
// catch (FileNotFoundException | IOException e) { }
```

**2. How does the JVM handle exceptions internally?**  
When an exception is thrown, the JVM: (1) creates the exception object (fills the stack trace), (2) looks for a matching `catch` block from the innermost `try` outward (up the call stack), (3) if no `catch` is found, the exception travels up the call stack until it reaches `main`, after which the thread terminates. If the exception is never caught — the program crashes with full stack trace on stderr.

**3. How to read and analyze a stack trace?**  
Read the stack trace **top to bottom**. The topmost line is the exact throw location. The problem is most likely in your code (not library code) — look for the line with your package name.

```java
Exception in thread "main" java.lang.NullPointerException
    at com.myapp.service.UserService.findUser(UserService.java:25) // ← problem here
    at com.myapp.controller.UserController.getUser(UserController.java:12)
    at com.myapp.Main.main(Main.java:5)
```

`e.getMessage()` — short description. `e.getCause()` — original exception (for chaining). `e.printStackTrace()` — full stack trace.

**4. What is exception chaining?**  
Wrapping one exception inside another while keeping the original cause. This preserves context as the exception travels through application layers.

```java
try {
    parseFile(path);
} catch (IOException e) {
    throw new RuntimeException("Failed to load config from " + path, e);
}
// Later: e.getCause() returns the original IOException
```

**5. What are suppressed exceptions?**  
When try-with-resources closes multiple resources, each close exception is **suppressed** in favor of the primary exception. You can get suppressed exceptions via `e.getSuppressed()`. Added in Java 7 to solve the problem of hidden exceptions in finally.

```java
try (AutoCloseable a = () -> { throw new RuntimeException("A"); };
     AutoCloseable b = () -> { throw new RuntimeException("B"); }) {
    throw new RuntimeException("Main");
}
// Main: "Main". Suppressed: "A", "B"
```

**6. What happens if `finally` throws an exception?**  
It **replaces** the original exception from `try` or `catch`. This is one of the main problems with finally — error information is lost. This is why try-with-resources is safer: it uses suppressed exceptions instead of replacement.

```java
try {
    throw new RuntimeException("Original");
} finally {
    throw new RuntimeException("Finally"); // ❌ Original is lost
}
// Only "Finally" will be seen
```

**7. Can you use `return` in `try`, `catch`, and `finally`? Which one wins?**  
`finally` **always** wins. If `try` has a `return` and `finally` has a `return`, the value from `finally` is returned. If `finally` has a `return` and `catch` has a `throw`, the `return` suppresses the exception.

```java
public int test() {
    try { return 1; }
    finally { return 2; } // returns 2, not 1
}
```

**8. What are the most common Selenium WebDriver exceptions?**  
| Exception | When it happens |
|---|---|
| `NoSuchElementException` | Element not found in the DOM |
| `StaleElementReferenceException` | Element was in DOM but disappeared (page refreshed) |
| `TimeoutException` | Wait condition was not met within the timeout |
| `ElementClickInterceptedException` | Another element covers the target |
| `InvalidElementStateException` | Element is in the wrong state (disabled, not visible) |
| `WebDriverException` | General WebDriver exception (driver crashed, no connection) |

**9. What is the difference between `assert` and exceptions?**  
`assert` is for self-checks (invariants, post-conditions). Can be disabled at runtime (`-ea` flag). Not meant for production validation.  
Exceptions — always enabled. In tests, `AssertionError` (thrown by `assertEquals`, `assertTrue`) is an exception, not `assert`.

```java
// assert — can be disabled:
assert x > 0 : "x must be positive";
// Exception — always works:
if (x <= 0) throw new IllegalArgumentException("x must be positive");
// In tests:
Assertions.assertTrue(x > 0); // throws AssertionError — unchecked
```

**10. When to catch an exception vs when to use `throws`?**  
Catch when: (1) you can recover (retry, fallback, default value), (2) you want to add context (exception chaining), (3) you must release resources (close, rollback).  
Declare when: (1) you do not know how to handle it (let the caller decide), (2) in library code (not your job to decide), (3) `throws` is already in the signature and extending it makes sense.

```java
// Catch — can recover:
try { return fetchData(); }
catch (IOException e) { return defaultData; }
// Declare — not your level:
public User findUser(int id) throws DataAccessException { ... }
```

---

### Code Questions

**1. What does this code print?**  
```java
public class Test {
    public static void main(String[] args) { System.out.println(test()); }
    static int test() {
        try { return 1; }
        catch (Exception e) { return 2; }
        finally { return 3; }
    }
}
```
**Answer:** `3`. `finally` runs after `try` or `catch` but before the actual return. If `finally` contains a `return`, it replaces any previous return.

**2. What does this code print?**  
```java
public class Test {
    public static void main(String[] args) {
        try { System.exit(0); }
        finally { System.out.println("Finally"); }
    }
}
```
**Answer:** Nothing. `System.exit(0)` stops the JVM immediately. `finally` does not run.

**3. Will this code compile?**  
```java
try { throw new IOException(); }
catch (IOException e) { throw new RuntimeException(e); }
catch (RuntimeException e) { System.out.println("Caught"); }
```
**Answer:** Yes. IOException is caught, wrapped in RuntimeException and rethrown. The second catch catches it — prints "Caught".

**4. What does this code print?**  
```java
public class Test {
    public static void main(String[] args) {
        try { throw new RuntimeException("Outer"); }
        catch (RuntimeException e) { throw new RuntimeException("Inner", e); }
        finally { throw new RuntimeException("Finally"); }
    }
}
```
**Answer:** Program crashes with `RuntimeException: Finally`. Original "Outer" and "Inner" are lost. Exception from `finally` replaces all previous ones.

**5. What does this code print?**  
```java
try (AutoCloseable res = () -> { throw new Exception("Close"); }) {
    throw new Exception("Work");
} catch (Exception e) {
    System.out.println(e.getMessage());
    for (Throwable s : e.getSuppressed()) {
        System.out.println("Suppressed: " + s.getMessage());
    }
}
```
**Answer:**  
```
Work
Suppressed: Close
```
The close exception is suppressed in favor of the main one. `getSuppressed()` shows both.

---

### Practical Tasks

> [!tip] How to practice
> Try to solve each task yourself first, then check the solution.

#### 1. try-catch-finally with return

**Task:** What does this code return and why?

```java
public int calculate() {
    try {
        return 10 / 0;
    } catch (ArithmeticException e) {
        return -1;
    } finally {
        System.out.println("Finally always runs");
    }
}
```

**Answer:** Returns `-1`. Division by zero throws `ArithmeticException`, caught by catch, returns -1. `finally` runs before the return — prints "Finally always runs".

**Explanation:** `finally` executes after try/catch but before the method actually returns. If `finally` had a `return`, it would override the catch return.

#### 2. Custom exception with chaining

**Task:** Create a custom checked exception `ConfigLoadException` and a method that wraps `IOException` into it.

```java
public class ConfigLoadException extends Exception {
    public ConfigLoadException(String message, Throwable cause) {
        super(message, cause);
    }
}

public String loadConfig(String path) throws ConfigLoadException {
    try {
        return Files.readString(Path.of(path));
    } catch (IOException e) {
        throw new ConfigLoadException("Failed to load config from " + path, e);
    }
}

// Usage:
try {
    String cfg = loadConfig("app.properties");
} catch (ConfigLoadException e) {
    System.out.println(e.getMessage());   // "Failed to load..."
    System.out.println(e.getCause());     // IOException with details
}
```

**Explanation:** Exception chaining preserves the original cause. `getCause()` returns the wrapped `IOException`. This is the standard pattern for wrapping exceptions across layers.

#### 3. Multi-catch — fix the order

**Task:** This code does not compile. Fix it.

```java
try {
    // some code that can throw various exceptions
} catch (Exception e) {
    log("General error");
} catch (IOException e) {
    log("IO error");
}
```

**Answer:** Won't compile — `IOException` extends `Exception`, so the first catch already catches everything. Fix: swap the order (more specific first).

```java
try {
    // some code
} catch (IOException e) {
    log("IO error");
} catch (Exception e) {
    log("General error");
}
```

**Explanation:** A more specific exception must be caught before a more general one. The compiler checks this at compile time.

#### 4. Try-with-resources — custom resource

**Task:** Create a custom `AutoCloseable` resource and use it in try-with-resources. It should print "Open" on creation and "Close" on close.

```java
public class DatabaseConnection implements AutoCloseable {
    public DatabaseConnection() { System.out.println("Open"); }
    public void query(String sql) { System.out.println("Query: " + sql); }
    @Override public void close() { System.out.println("Close"); }
}

// Usage:
try (DatabaseConnection db = new DatabaseConnection()) {
    db.query("SELECT * FROM users");
}
// Prints:
// Open
// Query: SELECT * FROM users
// Close
```

**Explanation:** Any class implementing `AutoCloseable` can be used in try-with-resources. `close()` is called automatically even if an exception occurs in the try block.

#### 5. Suppressed exceptions in practice

**Task:** What does this code print?

```java
try (AutoCloseable a = () -> { throw new RuntimeException("A"); };
     AutoCloseable b = () -> { throw new RuntimeException("B"); }) {
    throw new RuntimeException("Main");
} catch (RuntimeException e) {
    System.out.println(e.getMessage());
    for (Throwable s : e.getSuppressed()) {
        System.out.println("Suppressed: " + s.getMessage());
    }
}
```

**Answer:**
```
Main
Suppressed: A
Suppressed: B
```

The main exception is "Main". Both "A" and "B" are suppressed because try-with-resources collects close exceptions without losing the primary one. Without try-with-resources (using finally), "Main" would have been lost.
