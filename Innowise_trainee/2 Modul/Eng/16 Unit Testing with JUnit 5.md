# Unit Testing with JUnit 5

## Table of Contents

- [[#Why Unit Testing Matters]]
- [[#What JUnit 5 Is]]
- [[#Basic Structure of a Test]]
- [[#Assertions]]
- [[#Lifecycle Annotations]]
- [[#Parameterized Tests]]
- [[#Best Practices and Common Mistakes]]
- [[#JUnit 5 in AQA]]
- [[#Interview Questions]]

**Related notes:** [[AQA Java eng]]

> [!caution] Not in the video course
> Zaur's courses end at Java Core — JUnit 5 is not covered. This is the AQA layer: learn from this note + practice, and find video separately.

---

## Why Unit Testing Matters

A **unit test** checks one small piece of code in isolation. Usually this means one method or one class.

Unit testing matters because it helps you:

- catch bugs early
- verify business logic automatically
- refactor code more safely
- document expected behavior
- run fast checks on every change

Good unit tests are usually:

- fast
- isolated
- deterministic
- easy to read

> [!tip] Core Idea
> A unit test should answer one question clearly: "If I give this input, do I get the expected result?"

---

## What JUnit 5 Is

**JUnit 5** is the modern version of the JUnit testing framework for Java.

It is widely used for:

- writing unit tests
- organizing test classes
- running assertions
- preparing and cleaning test state
- parameterized testing

### Main Annotation

```java
import org.junit.jupiter.api.Test;

class CalculatorTest {

    @Test
    void shouldAddTwoNumbers() {
        // test body
    }
}
```

The `@Test` annotation tells JUnit that the method is a test method.

### JUnit 5 Modules

The names are useful to know:

- `JUnit Platform` - launches testing frameworks
- `JUnit Jupiter` - programming model and API for JUnit 5
- `JUnit Vintage` - support for older JUnit versions

In daily work, you mostly write tests with **Jupiter** annotations and assertions.

---

## Basic Structure of a Test

A test method usually follows the **Arrange -> Act -> Assert** pattern.

```java
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class CalculatorTest {

    @Test
    void shouldAddTwoNumbers() {
        // Arrange
        Calculator calculator = new Calculator();

        // Act
        int result = calculator.add(2, 3);

        // Assert
        assertEquals(5, result);
    }
}
```

### Arrange

Prepare input data and objects.

### Act

Call the method under test.

### Assert

Check that the result is correct.

### Test Naming

A good test name should describe behavior:

- `shouldReturnSumForPositiveNumbers`
- `shouldThrowExceptionForNullInput`
- `shouldCreateUserWithValidEmail`

> [!info] Readability First
> A test is also documentation. Someone should understand the scenario by reading the test name and the assertions.

---

## Assertions

Assertions are methods that verify expected results.

### Common Assertions

```java
import static org.junit.jupiter.api.Assertions.*;

assertEquals(5, result);
assertNotEquals(4, result);
assertTrue(value > 0);
assertFalse(list.isEmpty());
assertNull(user.getMiddleName());
assertNotNull(user);
```

### Assert Exception

```java
IllegalArgumentException exception = assertThrows(
    IllegalArgumentException.class,
    () -> calculator.divide(10, 0)
);

assertEquals("Division by zero", exception.getMessage());
```

### Assert Multiple Checks

```java
assertAll(
    () -> assertEquals("Alice", user.getName()),
    () -> assertEquals(25, user.getAge()),
    () -> assertTrue(user.isActive())
);
```

### Assert Timeout

```java
assertTimeout(Duration.ofSeconds(2), () -> {
    service.process();
});
```

> [!warning] One Assertion Idea
> A test can have multiple assertions if they verify one logical scenario. But if the test checks many unrelated things, it becomes harder to understand and debug.

---

## Lifecycle Annotations

JUnit 5 provides annotations for setup and cleanup.

### `@BeforeEach` and `@AfterEach`

Run before and after every test method.

```java
import org.junit.jupiter.api.*;

class CalculatorTest {

    private Calculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new Calculator();
    }

    @AfterEach
    void tearDown() {
        calculator = null;
    }
}
```

### `@BeforeAll` and `@AfterAll`

Run once for the whole test class.

```java
class DatabaseTest {

    @BeforeAll
    static void connect() {
        System.out.println("Connect once");
    }

    @AfterAll
    static void disconnect() {
        System.out.println("Disconnect once");
    }
}
```

### `@DisplayName`

Gives a human-readable name to a test.

```java
@DisplayName("Should create user with valid data")
@Test
void shouldCreateUser() {
}
```

> [!tip] Use Lifecycle Carefully
> Put only truly shared setup into lifecycle methods. If setup is too hidden, tests become harder to read.

---

## Parameterized Tests

Sometimes one logic should be tested with several inputs. JUnit 5 supports **parameterized tests**.

```java
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class NumberTest {

    @ParameterizedTest
    @ValueSource(ints = {2, 4, 6, 8})
    void shouldRecognizeEvenNumbers(int number) {
        assertTrue(number % 2 == 0);
    }
}
```

### Common Sources

- `@ValueSource`
- `@CsvSource`
- `@NullSource`
- `@EmptySource`
- `@MethodSource`

Example with CSV:

```java
@ParameterizedTest
@CsvSource({
    "2, 3, 5",
    "10, 20, 30",
    "0, 7, 7"
})
void shouldAddNumbers(int a, int b, int expected) {
    Calculator calculator = new Calculator();
    assertEquals(expected, calculator.add(a, b));
}
```

Parameterized tests reduce duplication when one behavior should be checked with many data sets.

---

## Best Practices and Common Mistakes

### Good Practices

- keep tests independent
- use clear names
- test behavior, not implementation details
- make test data simple
- keep unit tests fast

### Common Mistakes

- one test depends on another
- using real database or external API in a unit test
- too much setup hidden in helper code
- weak assertion like only `assertNotNull()`
- random values causing unstable tests

### Unit Test vs Integration Test

| Type | Goal | Typical dependency usage |
|---|---|---|
| unit test | check one small part in isolation | dependencies are mocked or avoided |
| integration test | check interaction between parts | real dependencies may be used |

> [!caution] Fast Feedback Matters
> Unit tests should run quickly. If a test is slow because it uses files, network, database, or browser, it may no longer be a true unit test.

---

## JUnit 5 in AQA

JUnit 5 is often the main foundation of a Java automation framework.

### Typical Uses

- organize test classes and test methods
- run setup and cleanup code
- group assertions
- run smoke and regression tests
- combine with Selenium or REST Assured

### Selenium Example

```java
class LoginTest {

    private WebDriver driver;

    @BeforeEach
    void setUp() {
        driver = new ChromeDriver();
    }

    @AfterEach
    void tearDown() {
        driver.quit();
    }

    @Test
    void shouldOpenLoginPage() {
        driver.get("https://example.com/login");
        assertEquals("Login", driver.getTitle());
    }
}
```

### Why It Matters in AQA

- gives standard structure to tests
- works well with IDE and CI
- integrates with reporting tools
- makes tests easier to maintain

> [!info] Good Rule for AQA
> Even if the framework uses Selenium or API tools, JUnit usually controls the structure: what is a test, what runs before it, and what happens after it.

---

## Interview Questions

### Top 10

**1. What is JUnit 5?**  
JUnit 5 is a Java testing framework used for writing and running tests.

**2. What does `@Test` do?**  
It marks a method as a test method that JUnit should execute.

**3. What is the difference between `@BeforeEach` and `@BeforeAll`?**  
`@BeforeEach` runs before every test. `@BeforeAll` runs once before all tests in the class.

**4. What is an assertion?**  
An assertion checks whether the actual result matches the expected result.

**5. How do you test exceptions in JUnit 5?**  
Use `assertThrows()` and check the thrown exception or its message.

**6. What is a parameterized test?**  
It is one test method executed multiple times with different input data.

**7. Why should unit tests be independent?**  
Because one test should not depend on the execution order or result of another test.

**8. What is the Arrange Act Assert pattern?**  
A common test structure: prepare data, execute logic, verify result.

**9. Can JUnit 5 be used in AQA frameworks?**  
Yes. It is often used as the main test framework in Java automation projects.

**10. What is `@DisplayName` used for?**  
It gives a readable custom name to a test or test class.

---

### Tricky Questions

**1. Must `@BeforeAll` be static?**  
Usually yes, unless the test class uses a special lifecycle configuration like `@TestInstance(Lifecycle.PER_CLASS)`.

**2. Is a test with Selenium still a unit test?**  
Usually no. It is closer to UI or integration testing because it depends on browser and external system behavior.

**3. Why can `assertNotNull()` be a weak assertion?**  
Because it checks very little. A non-null result can still be completely wrong.

**4. When should you prefer parameterized tests?**  
When one behavior should be checked against several different inputs or edge cases.

**5. Why is hidden setup dangerous?**  
Because tests become harder to read, understand, and debug when too much logic is outside the test body.
