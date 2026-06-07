# OOP Basics

## Table of Contents

- [[#Classes and Objects]]
- [[#Constructors]]
- [[#The this Keyword]]
- [[#Static Members]]
- [[#Encapsulation and Access Modifiers]]
- [[#Getters and Setters]]
- [[#The toString Method]]
- [[#equals() and hashCode()]]

**Related notes:** [[AQA Java eng]]

> [!info] Video Course (Zaur Tregulov)
> Course 1 (OCA): L4 classes & objects, L5 constructors & methods, L6 overloading & this, L8 static/final, L9 scope, L11 passing by reference.

---

## Classes and Objects

A **class** is a blueprint. An **object** is an instance of a class.

```java
public class Car {
    String brand;
    String color;
    int year;

    void startEngine() {
        System.out.println("The " + brand + " engine is running");
    }
}

public class Main {
    public static void main(String[] args) {
        Car myCar = new Car();
        myCar.brand = "Toyota";
        myCar.color = "Red";
        myCar.year = 2022;
        myCar.startEngine();
    }
}
```

### Anatomy of a Class

| Part | What it does |
|---|---|
| **Fields** (variables) | Store the object's state |
| **Constructors** | Initialize the object when created |
| **Methods** | Define the object's behavior |
| **Static members** | Belong to the class, not individual objects |

---

## Constructors

A constructor runs when you create an object with `new`. Same name as the class, no return type.

### Default Constructor

```java
public class Student {
    String name;
    int age;
    // Java adds: public Student() {}
}
```

### Parameterized Constructor

```java
public class Student {
    String name;
    int age;

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

Student s = new Student("Alice", 20);
```

### Overloaded Constructors

```java
public class Student {
    String name;
    int age;
    String group;

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
        this.group = "Unknown";
    }

    public Student(String name, int age, String group) {
        this.name = name;
        this.age = age;
        this.group = group;
    }

    public Student() {
        this("Unknown", 0);      // calls the first constructor
    }
}
```

> [!tip] Constructor Chaining
> Use `this(...)` to call one constructor from another. Must be the first line.

---

## The this Keyword

`this` refers to the current object.

```java
public class Employee {
    String name;

    public Employee(String name) {
        this.name = name;   // this.name = field, name = parameter
    }

    public Employee getEmployee() {
        return this;        // return the current object
    }
}
```

**Three uses:** 1) distinguish field from parameter 2) call another constructor 3) pass/return the current object.

---

## Static Members

`static` members belong to the **class itself**, not to individual objects. They are loaded **once** when the class is first accessed.

### Static Fields

```java
public class Counter {
    static int totalCount = 0;   // shared by all instances
    int instanceCount = 0;       // one per object

    public Counter() {
        totalCount++;
        instanceCount++;
    }
}

Counter c1 = new Counter();  // totalCount = 1, instanceCount = 1
Counter c2 = new Counter();  // totalCount = 2, instanceCount = 1
System.out.println(Counter.totalCount);   // 2 — access via class name
```

### Static Methods

```java
public class MathUtils {
    public static int add(int a, int b) {
        return a + b;
    }
}

int sum = MathUtils.add(5, 3);   // 8 — call without creating an object
```

> [!info] Static vs Instance
> - Static methods can only access static fields directly
> - Instance methods can access both static and instance members
> - `this` cannot be used in static methods (no object)

### Static Blocks

A static block runs **once** when the class is loaded — before any objects are created.

```java
public class Config {
    static String dbUrl;
    static Properties props;

    static {
        System.out.println("Loading configuration...");
        dbUrl = "jdbc:mysql://localhost:3306/app";
        // props.load(...) — load config file
    }
}
```

**Used for:** initializing complex static fields, loading configs, database connections.

### Initialization Order

When the JVM first loads a class, everything runs **strictly top to bottom**:

```java
public class Demo {
    static int a = 1;          // 1. static fields
    static {                   // 2. static blocks
        System.out.println("static: a=" + a + ", b=" + b);
    }
    static int b = 2;          // 3. static fields (continued)
    int x = 3;                 // 4. instance fields
    {                          // 5. instance blocks
        System.out.println("instance: x=" + x);
    }
    public Demo() {            // 6. constructor
        System.out.println("constructor");
    }
}

// When new Demo():
// static: a=1, b=0   ← b not yet initialized!
// instance: x=3
// constructor
```

**General object loading order:**
```
1. static fields (top to bottom)
2. static blocks (top to bottom)
3. instance fields (top to bottom)
4. instance blocks (top to bottom)
5. constructor
```

### With Inheritance

```
1. Parent static (all static fields + blocks)
2. Child static  (all static fields + blocks)
3. Parent instance → Parent constructor
4. Child instance → Child constructor
```

```java
class Parent {
    static { System.out.println("Parent static"); }
    { System.out.println("Parent instance"); }
    Parent() { System.out.println("Parent constructor"); }
}

class Child extends Parent {
    static { System.out.println("Child static"); }
    { System.out.println("Child instance"); }
    Child() { System.out.println("Child constructor"); }
}

// new Child() prints:
// Parent static
// Child static
// Parent instance
// Parent constructor
// Child instance
// Child constructor
```

> [!warning] Important
> Checked exceptions inside static blocks must be caught within the block. Unchecked exceptions are wrapped in `ExceptionInInitializerError`.
> The order of fields and blocks in code **matters** — JVM executes strictly top to bottom.

---

## Encapsulation and Access Modifiers

**Encapsulation** means hiding internal data and exposing only what is necessary.

### Access Modifiers

| Modifier | Class | Package | Subclass | World |
|---|---|---|---|---|
| `public` | ✅ | ✅ | ✅ | ✅ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| (default) | ✅ | ✅ | ❌ | ❌ |
| `private` | ✅ | ❌ | ❌ | ❌ |

```java
public class BankAccount {
    private double balance;          // only inside this class
    String accountNumber;            // default — same package
    protected String ownerName;      // package + subclasses
    public String bankName;          // anywhere
}
```

---

## Getters and Setters

Standard encapsulation pattern: `private` fields + `public` methods.

```java
public class User {
    private String username;
    private int age;
    private boolean active;

    public String getUsername() { return username; }

    public void setUsername(String username) {
        if (username != null && username.length() >= 3) {
            this.username = username;
        }
    }

    public int getAge() { return age; }

    public void setAge(int age) {
        if (age >= 0 && age <= 150) {
            this.age = age;
        }
    }

    public boolean isActive() { return active; }   // "is" prefix for boolean
}
```

> [!warning] Why Getters and Setters?
> Direct field access (`user.age = -5;`) allows invalid data. A setter can validate.

---

## The toString Method

Every class inherits `toString()` from `Object`. Override it for useful output.

```java
public class Product {
    private String name;
    private double price;

    public Product(String name, double price) {
        this.name = name;
        this.price = price;
    }

    @Override
    public String toString() {
        return "Product{name='" + name + "', price=" + price + "}";
    }
}

Product p = new Product("Laptop", 999.99);
System.out.println(p);   // Product{name='Laptop', price=999.99}
```

> [!tip] IntelliJ generates toString
> `Alt + Insert` → **toString()** → select fields.

---

## equals() and hashCode()

By default, `equals()` from `Object` compares **references** (same as `==`). If you want to compare **content**, you must override it.

### Why Override equals()?

```java
User a = new User("Alice", 25);
User b = new User("Alice", 25);

System.out.println(a == b);       // false — different objects
System.out.println(a.equals(b));  // false — default equals() uses ==
```

After overriding:

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    User user = (User) o;
    return age == user.age && Objects.equals(name, user.name);
}
```

Now `a.equals(b)` returns `true` because the content matches.

### Why Override hashCode() Too?

The **contract** says: if two objects are equal (`equals()` returns `true`), they must have the same `hashCode()`. This is required for `HashMap`, `HashSet`, and any hash-based collection.

```java
// Without hashCode() override:
Set<User> users = new HashSet<>();
users.add(new User("Alice", 25));
users.contains(new User("Alice", 25));  // false! — different hashCode

// With proper hashCode():
@Override
public int hashCode() {
    return Objects.hash(name, age);
}
// Now contains() returns true
```

**What breaks if you only override equals():**
- `HashMap` uses `hashCode()` to find the bucket. If two equal objects have different hash codes, the map puts them in different buckets and can never find one by the other.
- `HashSet` uses the same mechanism — "equal" objects appear as duplicates.

> [!danger] The Contract
> 1. If `a.equals(b)` is `true`, then `a.hashCode() == b.hashCode()` must be `true`
> 2. If hash codes are equal, `equals()` may or may not be `true` (collisions are allowed)
> 3. If `a.equals(b)` is `false`, hash codes *may* still be equal (but ideally should differ for performance)

> [!tip] IntelliJ generates both
> `Alt + Insert` → **equals() and hashCode()** → select fields. Always generate them together.

---

## Interview Questions

### Top 10

**1. What is the difference between a class and an object?**
A class is a blueprint or template that defines the structure (fields) and behavior (methods) of something. An object is a specific instance of a class created with the `new` keyword. One class can produce many independent objects.

**2. What is a constructor? Can it return a value?**
A constructor is a special method that initializes an object when it is created with `new`. It has the same name as the class and no return type (not even `void`). It cannot return a value.

**3. What is constructor overloading and constructor chaining?**
Constructor overloading means having multiple constructors with different parameter lists. Constructor chaining is calling one constructor from another using `this(...)` — it avoids duplicating initialization code.

**4. What does the `this` keyword refer to?**
`this` refers to the current object — the object whose method or constructor is being called. It is used to distinguish fields from parameters (`this.name = name`), to call another constructor (`this(params)`), and to return the current object.

**5. What is the difference between `static` and instance members?**
Static members belong to the class itself and are shared by all instances. They are accessed via the class name (`ClassName.field`). Instance members belong to each individual object and require an instance to access. Static methods cannot access instance fields directly.

**6. What is encapsulation? Why is it important?**
Encapsulation is hiding internal data and exposing it only through public methods. It protects the object's state from invalid values and reduces coupling between components. Achieved by marking fields `private` and providing public getters/setters.

**7. What are access modifiers in Java? List them from most to least restrictive.**
`private` (class only), default/package-private (package only), `protected` (package + subclasses), `public` (everywhere).

**8. What is the purpose of getters and setters?**
Getters provide controlled read access to private fields. Setters provide controlled write access — they can validate data, perform transformations, or trigger side effects. Without setters, direct field access could set invalid values like `user.age = -5`.

**9. What is the `toString()` method and why override it?**
`toString()` is inherited from `Object` and returns a default string representation (class name + hash code). Overriding it provides meaningful information about the object's state, which is useful for debugging and logging.

**10. What is a static constant? How is it declared?**
A static constant is a class-level value that cannot change. Declared as `public static final TYPE NAME = value;` — e.g., `public static final int MAX_SIZE = 100;`. The convention is UPPER_SNAKE_CASE.

---

### Tricky Questions

**1. What happens if you do not write any constructor in a class?**
Java automatically provides a default no-arg constructor that takes no parameters and does nothing (`public ClassName() { }`). It initializes all fields to their default values (0 for numbers, null for objects).

**2. What happens if you write at least one constructor? Does the default constructor still exist?**
No. Once you define any constructor, the default constructor is NOT automatically provided. If you still need a no-arg constructor, you must write it explicitly. This is a common mistake — extending a class whose parent only has a parameterized constructor causes a compile error.

**3. Can a static method access non-static fields? Why?**
No. A static method does not belong to any specific object. Since non-static fields require an object to exist, the static method has no object to access. The compiler error is: "Cannot make a static reference to the non-static field".

**4. Can you use `this` inside a static method?**
No. `this` refers to the current object. Static methods are not associated with any object, so there is no `this` available.

**5. What is the difference between `public` fields with direct access and private fields with getters/setters?**
Public fields offer no control — anyone can set `product.price = -100;`. Getters/setters let you add validation, logging, or computed values. They also let you change internal implementation without breaking external code (encapsulation principle).

