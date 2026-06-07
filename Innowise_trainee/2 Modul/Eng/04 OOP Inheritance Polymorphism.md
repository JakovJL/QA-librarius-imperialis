# OOP: Inheritance and Polymorphism

## Table of Contents

- [[#Inheritance Basics]]
- [[#The super Keyword]]
- [[#Method Overriding]]
- [[#Method Overloading]]
- [[#The final Keyword]]
- [[#Abstract Classes]]
- [[#Polymorphism]]
- [[#instanceof Operator]]

**Related notes:** [[AQA Java eng]]

> [!info] Video Course (Zaur Tregulov)
> Course 1 (OCA): L21 inheritance, super, protected; L22 overriding & field hiding.

---

## Inheritance Basics

**Inheritance** lets a class (child) reuse fields and methods from another class (parent). Keyword: `extends`.

```java
public class Animal {
    protected String name;

    public void eat() { System.out.println(name + " is eating"); }
    public void sleep() { System.out.println(name + " is sleeping"); }
}

public class Dog extends Animal {
    public void bark() { System.out.println(name + " says: Woof!"); }
}

Dog dog = new Dog();
dog.name = "Rex";
dog.eat();      // inherited from Animal
dog.bark();     // defined in Dog
```

> [!info] Single Inheritance
> A class can extend only one parent. Multiple levels are fine: `Puppy extends Dog extends Animal`.

### What is Inherited?

| Inherited | Not Inherited |
|---|---|
| `public` / `protected` fields/methods | `private` fields/methods |
| `default` (same package) | Constructors (but callable via `super()`) |

---

## The super Keyword

`super` refers to the parent class.

### Calling Parent Constructor

```java
public class Vehicle {
    protected String brand;
    protected int year;

    public Vehicle(String brand, int year) {
        this.brand = brand;
        this.year = year;
    }
}

public class Car extends Vehicle {
    private String model;

    public Car(String brand, int year, String model) {
        super(brand, year);       // must be FIRST line
        this.model = model;
    }
}
```

### Accessing Parent Methods

```java
public class Parent {
    public void display() { System.out.println("Parent display"); }
}

public class Child extends Parent {
    @Override
    public void display() {
        super.display();            // call parent version
        System.out.println("Child display");
    }
}
// Output: Parent display
//         Child display
```

---

## Method Overriding

Child redefines a parent method. Same signature.

```java
public class Shape {
    public double getArea() { return 0; }
}

public class Circle extends Shape {
    private double radius;
    public Circle(double radius) { this.radius = radius; }

    @Override
    public double getArea() { return Math.PI * radius * radius; }
}
```

### Override Rules

| Requirement | Explanation |
|---|---|
| Same signature | Same name + parameters |
| Same or wider access | `protected` → `public` OK, reverse NOT. `private` methods are not inherited |
| `@Override` annotation | Optional but catches typos |

---

## Method Overloading

Multiple methods with the same name but different parameters in the same class.

```java
public class Calculator {
    public int add(int a, int b) { return a + b; }
    public double add(double a, double b) { return a + b; }
    public int add(int a, int b, int c) { return a + b + c; }
}
```

### Overriding vs Overloading

| Aspect | Overriding | Overloading |
|---|---|---|
| When | Child redefines parent method | Same class, different params |
| Where | Different classes | Same class |
| Signature | Same | Different |
| Binding | Runtime | Compile-time |

---

## The final Keyword

| Usage | Effect |
|---|---|
| `final` variable | Cannot change (constant) |
| `final` method | Cannot be overridden |
| `final` class | Cannot be extended |

```java
public class Parent {
    public final void printWelcome() { System.out.println("Welcome!"); }
}
// Child cannot override printWelcome()

public final class MathConstants {
    public static final double PI = 3.14159;
}
// Cannot extend MathConstants
```

---

## Abstract Classes

Cannot be instantiated directly. May contain abstract methods (no body) that children **must** override.

```java
public abstract class Payment {
    protected double amount;

    public Payment(double amount) { this.amount = amount; }

    public abstract void processPayment();    // no body

    public void printReceipt() {              // concrete method
        System.out.println("Payment of $" + amount + " processed");
    }
}

public class CreditCardPayment extends Payment {
    private String cardNumber;

    public CreditCardPayment(double amount, String cardNumber) {
        super(amount);
        this.cardNumber = cardNumber;
    }

    @Override
    public void processPayment() {
        System.out.println("Processing via card " + cardNumber);
    }
}
```

> [!info] Rules
> - Cannot `new Payment()` — it's incomplete
> - A class with any abstract method must be `abstract`
> - Can have constructors, fields, concrete methods

---

## Polymorphism

"Many forms" — the same method call behaves differently based on the actual object type.

```java
Payment payment1 = new CreditCardPayment(100.0, "1234");
Payment payment2 = new PayPalPayment(50.0, "user@email.com");

payment1.processPayment();   // CreditCardPayment version
payment2.processPayment();   // PayPalPayment version

// Array of different payment types
Payment[] payments = {payment1, payment2};
for (Payment p : payments) {
    p.processPayment();      // each does its own thing
}
```

> [!tip] Polymorphism in AQA
> `WebDriver driver = new ChromeDriver();` — switch to Firefox or Edge without changing other code.

---

## instanceof Operator

Checks if an object is an instance of a specific class.

```java
Payment payment = new CreditCardPayment(100, "1234");

if (payment instanceof CreditCardPayment) {
    CreditCardPayment cc = (CreditCardPayment) payment;  // safe cast
}

if (payment instanceof Payment) {   // true — parent class
    System.out.println("It's a payment");
}
```

### Pattern Matching (Java 16+)

```java
if (payment instanceof CreditCardPayment cc) {
    System.out.println(cc.getCardNumber());  // no explicit cast
}
```

> [!caution] instanceof is a Code Smell
> Overusing `instanceof` usually means your design is wrong. Prefer polymorphism.
> ```java
> // Bad
> if (animal instanceof Dog) { ((Dog)animal).bark(); }
> if (animal instanceof Cat) { ((Cat)animal).meow(); }
> // Good
> animal.makeSound();   // Dog barks, Cat meows
> ```



---

## Interview Questions

### Top 10

**1. What is inheritance in Java? What keyword is used?**
Inheritance allows a child class to reuse fields and methods from a parent class. The keyword is `extends`. Java supports single inheritance — a class can extend only one parent class.

**2. What is the difference between method overloading and method overriding?**
Overloading — same name, different parameters, in the same class (compile-time polymorphism). Overriding — same signature, in a child class, redefines the parent method (runtime polymorphism).

**3. What does the `super` keyword do?**
`super` refers to the parent class. It is used to: (1) call the parent constructor (`super(params)` — must be the first line in the child constructor), (2) access the parent's methods when overridden (`super.methodName()`).

**4. What is the difference between an abstract class and a concrete class?**
An abstract class (declared with `abstract`) cannot be instantiated directly. It can contain abstract methods (no body) that children must implement. A concrete class can be instantiated and must implement all inherited abstract methods.

**5. What is the `@Override` annotation? Why use it?**
`@Override` tells the compiler that a method is intended to override a parent method. It is optional but highly recommended because the compiler catches errors like typos in the method name or wrong parameter types.

**6. What is polymorphism? Give an example.**
Polymorphism means "many forms" — the same method call behaves differently based on the actual object type at runtime. Example: `Animal a = new Dog(); a.makeSound();` calls `Dog`'s version of `makeSound()`, not `Animal`'s.

**7. What does the `final` keyword do when applied to a method? A class? A variable?**
`final` method — cannot be overridden by children. `final` class — cannot be extended (inherited). `final` variable — cannot be reassigned (constant).

**8. Why doesn't Java support multiple class inheritance?**
To avoid the "diamond problem": if two parent classes have the same method, the child does not know which version to inherit. Java solves this with interfaces — a class can implement multiple interfaces.

**9. What is the `instanceof` operator?**
`instanceof` checks if an object is an instance of a specific class, subclass, or interface. It returns `boolean`. Used before casting to avoid `ClassCastException`.

**10. What is the difference between `extends` and `implements`?**
`extends` is for class-to-class (or interface-to-interface) inheritance. A class can extend only one class. `implements` is for a class to fulfill an interface contract. A class can implement multiple interfaces.

---

### Tricky Questions

**1. Can a constructor be `final`? Can it be `static`?**
No to both. Constructors are not regular methods and cannot be overridden or inherited, so `final` does not apply. Constructors cannot be `static` because they must be associated with object creation.

**2. Can an abstract class have a constructor? What is its purpose?**
Yes. An abstract class can have a constructor, and it is called via `super()` from the child's constructor. Its purpose is to initialize the shared state (fields) of the abstract class before the child's constructor runs.

**3. Why is overusing `instanceof` considered bad design?**
Because it bypasses polymorphism. Instead of checking the type and casting manually (`if (animal instanceof Dog) { ((Dog) animal).bark(); }`), you should let the object do the work (`animal.makeSound()`). Overusing `instanceof` means your hierarchy probably needs redesign.

**4. What happens if you call `super.super.methodName()`?**
Compile error. Java does not allow accessing a grandparent's method directly if the parent overrides it. You can only access the direct parent with `super`. To access the grandparent's version, you would need the parent to expose it.

**5. Can you override a `private` method?**
No. Private methods are not inherited, so they cannot be overridden. If you declare a method with the same name in the child, it is a *new* method, not an override — and if the child adds `@Override`, the compiler will report an error.

