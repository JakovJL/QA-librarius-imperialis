# OOP: Interfaces and Abstraction

## Table of Contents

- [[#What is an Interface]]
- [[#Implementing Interfaces]]
- [[#Multiple Inheritance via Interfaces]]
- [[#Default and Static Methods]]
- [[#Functional Interfaces]]
- [[#Abstract Classes vs Interfaces]]
- [[#Practical Patterns for AQA]]

**Related notes:** [[AQA Java eng]]

> [!info] Video Course (Zaur Tregulov)
> Course 1 (OCA): L23 abstract classes, interfaces, default methods.

---

## What is an Interface

An **interface** is a contract. It defines **what** a class must do, but not **how**.

```java
public interface Drawable {
    void draw();               // implicitly public abstract
    double getArea();
}

public class Circle implements Drawable {
    private double radius;

    public Circle(double radius) { this.radius = radius; }

    @Override
    public void draw() { System.out.println("Drawing a circle"); }

    @Override
    public double getArea() { return Math.PI * radius * radius; }
}
```

> [!info] Interface Syntax
> - `interface` replaces `class`
> - Methods have no body — just signature + semicolon
> - Fields are `public static final` (constants)
> - A class `implements` an interface

---

## Implementing Interfaces

A class can implement multiple interfaces. It must implement **all** abstract methods.

```java
public interface Printable { void printInfo(); }
public interface Resizable { void resize(double factor); }

public class Document implements Printable, Resizable {
    private String content;
    private double size;

    public Document(String content) { this.content = content; this.size = 1.0; }

    @Override
    public void printInfo() { System.out.println("Document: " + content); }

    @Override
    public void resize(double factor) { this.size *= factor; }
}
```

### Interface as a Type

```java
Printable doc = new Document("Hello");
doc.printInfo();              // works
// doc.resize(2.0);           // ❌ — resize not in Printable
```

> [!tip] Program to Interfaces
> ```java
> // ❌ Coupled to implementation
> ArrayList<String> list = new ArrayList<>();
> // ✅ Flexible
> List<String> list = new ArrayList<>();
> ```

---

## Multiple Inheritance via Interfaces

Java doesn't allow extending multiple classes, but a class **can implement multiple interfaces**.

```java
public interface Loggable { void log(String message); }
public interface Reportable { void generateReport(); }

public class TestResult implements Loggable, Reportable {
    private String testName;
    private boolean passed;

    @Override
    public void log(String message) { System.out.println("[LOG] " + message); }

    @Override
    public void generateReport() {
        log("Test: " + testName + " — " + (passed ? "PASSED" : "FAILED"));
    }
}
```

### Interface Inheritance

```java
public interface Readable { String read(); }
public interface Writable { void write(String data); }

public interface ReadWritable extends Readable, Writable {
    void clear();
}
```

---

## Default and Static Methods (Java 8+)

### Default Methods

Add a method **with a body** without breaking existing implementations.

```java
public interface Vehicle {
    void start();

    default void honk() { System.out.println("Beep beep!"); }
}

public class Car implements Vehicle {
    @Override
    public void start() { System.out.println("Car started"); }
    // honk() is inherited automatically
}
```

### Static Methods in Interfaces

```java
public interface Validator {
    boolean validate(String input);

    static boolean isValidEmail(String email) {
        return email != null && email.contains("@");
    }
}

Validator.isValidEmail("user@example.com");   // true
```

> [!caution] Not inherited
> Static methods in interfaces are NOT inherited by implementing classes.

---

## Functional Interfaces

Exactly **one** abstract method. Foundation of lambda expressions.

```java
@FunctionalInterface
public interface Greeting {
    String greet(String name);
}

// Lambda
Greeting hello = name -> "Hello, " + name;
System.out.println(hello.greet("Alice"));   // "Hello, Alice"
```

### Common Built-in Functional Interfaces

| Interface | Method | Purpose |
|---|---|---|
| `Predicate<T>` | `boolean test(T t)` | Test a condition |
| `Consumer<T>` | `void accept(T t)` | Do something, no return |
| `Function<T,R>` | `R apply(T t)` | Convert T to R |
| `Supplier<T>` | `T get()` | Provide a value |

```java
Predicate<String> isEmpty = s -> s.isEmpty();
isEmpty.test("");          // true
```

---

## Abstract Classes vs Interfaces

| Feature | Abstract Class | Interface |
|---|---|---|
| Fields | Any | Only `public static final` |
| Constructors | ✅ | ❌ |
| Concrete methods | ✅ | ✅ (default + static) |
| Multiple inheritance | ❌ | ✅ |
| Access modifiers | Any | `public` (+ `private` since Java 9) |

### When to Choose

```java
// ABSTRACT CLASS: shared state + partial behavior
// INTERFACE: capability/contract + multiple inheritance

// Practical: TestBase (abstract) + Reportable (interface)
public abstract class TestBase {
    protected WebDriver driver;

    public void setUp() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
    }

    public abstract void runTest();

    public void tearDown() {
        if (driver != null) driver.quit();
    }
}

public interface Reportable {
    void generateReport();
}

public class LoginTest extends TestBase implements Reportable {
    @Override
    public void runTest() {
        setUp();
        driver.get("https://example.com/login");
        // ... test logic
        tearDown();
    }

    @Override
    public void generateReport() {
        System.out.println("LoginTest report generated");
    }
}
```

---

## Practical Patterns for AQA

### WebDriver as Interface

```java
WebDriver driver = new ChromeDriver();
// WebDriver driver = new FirefoxDriver();
// WebDriver driver = new EdgeDriver();
// All three support the same methods — polymorphism
```

### Page Object with Interfaces

```java
public interface LoginPage {
    void enterUsername(String username);
    void enterPassword(String password);
    void clickLogin();
    String getErrorMessage();
}

public class LoginPageImpl implements LoginPage {
    private WebDriver driver;

    public LoginPageImpl(WebDriver driver) { this.driver = driver; }

    @Override
    public void enterUsername(String username) {
        driver.findElement(By.id("username")).sendKeys(username);
    }

    @Override
    public void enterPassword(String password) {
        driver.findElement(By.id("password")).sendKeys(password);
    }

    @Override
    public void clickLogin() {
        driver.findElement(By.id("login-btn")).click();
    }

    @Override
    public String getErrorMessage() {
        return driver.findElement(By.cssSelector(".error")).getText();
    }
}
```

> [!tip] Why This Matters
> Separate interface from implementation — swap Selenium, Playwright, or a mock without changing tests.



---

## Interview Questions

### Top 10

**1. What is an interface in Java?**
An interface is a reference type that defines a contract — what methods a class must implement, but not how. All methods are implicitly `public` and `abstract`. A class implements an interface using the `implements` keyword.

**2. What is the difference between an abstract class and an interface?**
Abstract classes can have fields (any kind), constructors, and concrete methods. Interfaces can only have `public static final` fields, no constructors, and (since Java 8) `default` and `static` methods. A class can extend only one abstract class but implement multiple interfaces.

**3. Can a class implement multiple interfaces?**
Yes. This is how Java achieves multiple inheritance: `class MyClass implements InterfaceA, InterfaceB { ... }`. The class must implement all abstract methods from all interfaces.

**4. What are default methods in interfaces? (Java 8+)**
`default` methods allow adding a method with a body to an interface without breaking existing implementations. Implementing classes inherit the default automatically and can override it if needed.

**5. What is a functional interface?**
A functional interface has exactly one abstract method. It is the foundation of lambda expressions. The `@FunctionalInterface` annotation is optional but recommended.

**6. What is the difference between `extending` an interface and `implementing` an interface?**
`extends` is used when an interface inherits from another interface: `interface B extends A`. `implements` is used when a class fulfills an interface contract: `class C implements A`.

**7. Can interfaces have fields? If so, what kind?**
Yes, but they are implicitly `public static final` — constants. You cannot have instance fields in an interface. Example: `int MAX_VALUE = 100;` is equivalent to `public static final int MAX_VALUE = 100;`.

**8. What is the diamond problem with interfaces? How does Java handle it?**
If a class implements two interfaces that both have the same `default` method, the class must override it to resolve the conflict. Otherwise, the compiler throws an error and forces you to choose.

**9. What is the purpose of static methods in interfaces? (Java 8+)**
Static methods in interfaces provide utility/helper methods that belong to the interface concept. They are called via the interface name: `Validator.isValidEmail(email)`. They are NOT inherited by implementing classes.

**10. Why are interfaces useful in test automation?**
They let you decouple the test logic from the implementation. Example: `WebDriver driver = new ChromeDriver()` lets you switch to Firefox or Edge without changing test code. Page Object interfaces let you swap Selenium for Playwright by just changing the implementation class.

---

### Tricky Questions

**1. Can an interface extend multiple interfaces?**
Yes. Unlike classes, interfaces can extend multiple interfaces: `interface C extends A, B { }`. This is safe because interfaces only declare method signatures — there is no implementation to conflict.

**2. Can a default method in an interface be `final`?**
No. A default method is designed to be overridden by implementing classes. Marking it `final` would contradict its purpose and is not allowed by the compiler.

**3. If a class implements two interfaces with the same default method, what happens?**
The class must override the method. If it does not, the compiler reports an error (diamond problem). The class must provide its own implementation, or call one of the parent defaults explicitly: `InterfaceA.super.methodName()`.

**4. Can an interface be instantiated directly (with `new`)?**
No. Interfaces cannot be instantiated. But you can create an *anonymous class* or a *lambda* (for functional interfaces) that implements the interface on the fly.

**5. Can an interface have a `private` method? (Java 9+)**
Yes, Java 9 introduced private methods in interfaces. They are used to share code between `default` methods within the same interface. Private methods are not visible to implementing classes.

