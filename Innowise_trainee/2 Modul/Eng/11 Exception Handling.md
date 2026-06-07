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
