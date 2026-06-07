# Annotations and Reflection Basics

## Table of Contents

- [[#Why Meta-Programming Matters]]
- [[#What Annotations Are]]
- [[#Built-In Annotations]]
- [[#Custom Annotations]]
- [[#Reflection Basics]]
- [[#Fields Methods and Constructors via Reflection]]
- [[#Annotations and Reflection in AQA]]
- [[#Interview Questions]]

**Related notes:** [[AQA Java eng]]

> [!info] Video Course (Zaur Tregulov)
> Course 2 (Black Belt): "Other Topics" — Reflection & Annotations.

---

## Why Meta-Programming Matters

Sometimes code needs information **about code itself**. For example:

- JUnit finds test methods marked with `@Test`
- Spring finds components marked with `@Service`
- Serialization libraries inspect fields and classes dynamically

This is where **annotations** and **reflection** become important.

- **Annotations** attach metadata to classes, methods, fields, and parameters
- **Reflection** lets the program inspect classes, methods, fields, and constructors at runtime

These tools are powerful, but they should be used carefully because they can reduce readability and safety if overused.

---

## What Annotations Are

An **annotation** is metadata written with `@`. It does not directly change program logic by itself, but tools and frameworks can read it and act on it.

```java
@Override
public String toString() {
    return "User";
}
```

### Where Annotations Can Be Used

- classes
- methods
- fields
- parameters
- constructors
- local variables

### Important Idea

Annotations describe information such as:

- "this method overrides a parent method"
- "this method is a test"
- "this field should be serialized"

The annotation itself is only metadata. Real behavior appears when the compiler, JVM, or framework processes it.

---

## Built-In Annotations

Java has several built-in annotations that you will see often.

### `@Override`

Indicates that a method overrides a parent method.

```java
class Animal {
    public void sound() {}
}

class Dog extends Animal {
    @Override
    public void sound() {
        System.out.println("Woof");
    }
}
```

Why it is useful:

- Helps the compiler catch mistakes
- Makes code easier to read

### `@Deprecated`

Marks code that should not be used in new development.

```java
@Deprecated
public void oldMethod() {
}
```

### `@SuppressWarnings`

Tells the compiler to hide specific warnings.

```java
@SuppressWarnings("unchecked")
List<String> names = (List<String>) rawList;
```

### `@FunctionalInterface`

Marks an interface intended to have exactly one abstract method.

```java
@FunctionalInterface
interface Printer {
    void print(String text);
}
```

> [!tip] Use Built-In Annotations
> `@Override` and `@FunctionalInterface` are simple but very useful. They improve safety with almost no cost.

---

## Custom Annotations

You can create your own annotations.

```java
public @interface SmokeTest {
}
```

This annotation can then be used like:

```java
@SmokeTest
public void loginTest() {
}
```

### Annotation With Values

```java
public @interface TestInfo {
    String author();
    int priority() default 1;
}
```

Usage:

```java
@TestInfo(author = "Ann", priority = 2)
public void checkoutTest() {
}
```

### Meta-Annotations

Annotations themselves can have annotations.

Common meta-annotations:

- `@Target`
- `@Retention`
- `@Documented`
- `@Inherited`

Example:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface SmokeTest {
}
```

### Why `@Retention` Matters

- `SOURCE` - exists only in source code
- `CLASS` - stored in `.class`, not always available at runtime
- `RUNTIME` - available through reflection at runtime

If you want to read an annotation using reflection, use `RetentionPolicy.RUNTIME`.

> [!warning] Without `RUNTIME`
> If a custom annotation is not retained at runtime, reflection will not see it.

---

## Reflection Basics

**Reflection** is the ability of a Java program to inspect classes and their members at runtime.

With reflection, you can get:

- class name
- field list
- method list
- constructors
- interfaces
- annotations

### Getting a `Class` Object

```java
Class<String> c1 = String.class;

String text = "hello";
Class<?> c2 = text.getClass();

Class<?> c3 = Class.forName("java.lang.String");
```

### Basic Reflection Example

```java
Class<?> clazz = ArrayList.class;

System.out.println(clazz.getName());         // java.util.ArrayList
System.out.println(clazz.getSimpleName());   // ArrayList
```

Reflection is useful when the class is not fully known at compile time or when a framework needs to inspect code automatically.

---

## Fields Methods and Constructors via Reflection

### Fields

```java
class User {
    private String name = "Alice";
}

Field field = User.class.getDeclaredField("name");
field.setAccessible(true);

User user = new User();
System.out.println(field.get(user)); // Alice
```

### Methods

```java
class User {
    public void sayHello() {
        System.out.println("Hello");
    }
}

Method method = User.class.getDeclaredMethod("sayHello");
method.invoke(new User());
```

### Constructors

```java
class User {
    public User(String name) {
        System.out.println(name);
    }
}

Constructor<User> constructor = User.class.getConstructor(String.class);
User user = constructor.newInstance("Bob");
```

### Common Reflection Methods

| Method | Meaning |
|---|---|
| `getDeclaredFields()` | all fields declared in class |
| `getDeclaredMethods()` | all methods declared in class |
| `getDeclaredConstructors()` | all constructors declared in class |
| `getDeclaredField(name)` | one field by name |
| `getDeclaredMethod(name, types...)` | one method by name |
| `newInstance()` | create object dynamically |
| `invoke()` | call method dynamically |

> [!caution] Reflection Has Cost
> Reflection is slower than direct code, bypasses some compile-time checks, and can reduce readability. Use it when necessary, not by default.

---

## Annotations and Reflection in AQA

These topics are very relevant in test automation.

### Typical Examples

- JUnit finds methods marked with `@Test`, `@BeforeEach`, `@AfterEach`
- Custom annotations can mark `@Smoke`, `@Regression`, or `@ApiTest`
- Reflection can load page objects, test data classes, or utility methods dynamically

### JUnit Example

```java
@Test
void loginShouldWork() {
}
```

JUnit reads the `@Test` annotation and knows that this method must be executed as a test.

### Custom Annotation Example

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Smoke {
}
```

```java
@Smoke
public void checkLogin() {
}
```

### Reflection Example in Framework Code

```java
Class<?> clazz = Class.forName("pages.LoginPage");
Object page = clazz.getDeclaredConstructor(WebDriver.class).newInstance(driver);
```

This can be useful in framework internals, but for beginner-level AQA code you should prefer simpler direct code when possible.

### Good Practices

- Use annotations for clear metadata
- Use reflection mostly in framework or infrastructure code
- Avoid reflection in ordinary business logic unless needed
- Keep custom annotations simple and meaningful

> [!info] Good Rule for AQA
> Annotations are common and friendly. Reflection is powerful but should stay mostly inside framework internals, not in every test.

---

## Interview Questions

### Top 10

**1. What is an annotation in Java?**  
An annotation is metadata attached to code elements such as classes, methods, or fields. Tools, frameworks, or the compiler can read it and act on it.

**2. What is reflection in Java?**  
Reflection is the ability of a program to inspect and interact with classes, fields, methods, and constructors at runtime.

**3. What does `@Override` do?**  
It tells the compiler that the method should override a parent method. If it does not, compilation fails.

**4. Why is `@Retention(RetentionPolicy.RUNTIME)` important?**  
Because only runtime-retained annotations are available through reflection at runtime.

**5. What is the difference between annotation and reflection?**  
Annotation is metadata. Reflection is a mechanism to inspect and use code structure at runtime. Reflection can read annotations.

**6. Can you create custom annotations?**  
Yes. Java allows defining your own annotation types with optional values and meta-annotations.

**7. What can reflection access?**  
Classes, fields, methods, constructors, interfaces, annotations, and more.

**8. Why can reflection be dangerous?**  
It is slower, bypasses some compile-time safety, and can make code harder to understand and maintain.

**9. Where do you see annotations in testing frameworks?**  
In JUnit annotations such as `@Test`, `@BeforeEach`, `@AfterEach`, and in custom tags or framework metadata.

**10. When would you use reflection in practice?**  
Mostly in frameworks, libraries, dependency injection, test runners, object mappers, and dynamic utility code.

---

### Tricky Questions

**1. Does an annotation change code behavior by itself?**  
Usually no. It is only metadata. Behavior changes only when some tool, framework, or compiler processes it.

**2. Can reflection access private fields and methods?**  
Yes, with `setAccessible(true)` in many cases, though this should be used carefully.

**3. What is the difference between `getFields()` and `getDeclaredFields()`?**  
`getFields()` returns public fields including inherited ones. `getDeclaredFields()` returns all fields declared in the class itself, including private ones.

**4. Why do many frameworks use reflection?**  
Because they need to inspect classes dynamically without hardcoding every class and method at compile time.

**5. Can reflection create objects dynamically?**  
Yes. You can get a constructor and call `newInstance()` to create objects at runtime.
