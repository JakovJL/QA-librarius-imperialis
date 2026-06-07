# Variables, Data Types, Operators

## Table of Contents

- [[#Primitive Data Types]]
- [[#Reference Types]]
- [[#Variable Declaration and Initialization]]
- [[#Type Casting]]
- [[#Operators]]
- [[#String Basics]]
- [[#var Keyword]]
- [[#Wrapper Classes and Autoboxing]]

**Related notes:** [[AQA Java eng]]

> [!info] Video Course (Zaur Tregulov)
> Course 1 (OCA): L2 primitives & variables, L3 operators & comparisons.

---

## Primitive Data Types

Java has 8 primitive types. They store simple values directly in memory — not objects.

| Type      | Size    | Range               | Default  | Example                      |
| --------- | ------- | ------------------- | -------- | ---------------------------- |
| `byte`    | 1 byte  | -128 to 127         | 0        | `byte b = 100;`              |
| `short`   | 2 bytes | -32,768 to 32,767   | 0        | `short s = 1000;`            |
| `int`     | 4 bytes | -2.1B to 2.1B       | 0        | `int age = 25;`              |
| `long`    | 8 bytes | very large          | 0L       | `long pop = 8_000_000_000L;` |
| `float`   | 4 bytes | ~±3.4E+38           | 0.0f     | `float pi = 3.14f;`          |
| `double`  | 8 bytes | ~±1.7E+308          | 0.0      | `double price = 19.99;`      |
| `boolean` | 1 bit   | true / false        | false    | `boolean isReady = true;`    |
| `char`    | 2 bytes | single Unicode char | '\u0000' | `char grade = 'A';`          |

> [!tip] Underscores in Numbers
> You can use underscores to make large numbers readable: `int million = 1_000_000;` Java ignores the underscores. Works in Java 7+.

```java
public class PrimitiveDemo {
    public static void main(String[] args) {
        int age = 25;
        double price = 19.99;
        boolean isStudent = true;
        char grade = 'A';
        long worldPopulation = 8_000_000_000L;
        float pi = 3.14159f;

        System.out.println("Age: " + age);
        System.out.println("Student: " + isStudent);
    }
}
```

---

## Reference Types

Reference types store a **memory address** to an object, not the value itself.

| Type | Description | Example |
|---|---|---|
| `String` | Text (immutable) | `String name = "Alice";` |
| Arrays | Collection of same-type values | `int[] numbers = {1, 2, 3};` |
| Classes | User-defined types | `Scanner input = new Scanner(System.in);` |

### Primitives vs References

```java
// Primitive — copies the VALUE
int a = 5;
int b = a;
b = 10;         // a is still 5

// Reference — copies the ADDRESS (both point to same object)
int[] arr1 = {1, 2, 3};
int[] arr2 = arr1;
arr2[0] = 99;   // arr1[0] is also 99!
```

> [!warning] Reference Trap
> When you assign one reference variable to another, they share the same object. Changing one changes the other. Common source of bugs.

---

## Variable Declaration and Initialization

```java
// 1. Declaration + initialization
int count = 10;

// 2. Declaration first, assignment later
int count;
count = 10;

// 3. Multiple variables of the same type
int x = 1, y = 2, z = 3;

// 4. Local variables MUST be initialized before use
int value;
// System.out.println(value);   // ❌ Compile error
value = 42;
System.out.println(value);       // ✅ OK
```

### Variable Scope

| Scope | Where declared | Visible where |
|---|---|---|
| **Local** | Inside a method or block | Only inside that method/block |
| **Instance** (field) | Inside a class, outside methods | The whole class, one per object |
| **Class** (static) | Inside a class with `static` | The whole class, shared by all objects |

```java
public class ScopeExample {
    static int classVar = 1;    // class scope
    int instanceVar = 2;        // instance scope

    public void myMethod() {
        int localVar = 3;       // local scope
    }
}
```

---

## Type Casting

### Implicit Casting (widening)

Smaller type → larger type. Safe, automatic.

```java
int myInt = 100;
long myLong = myInt;      // int → long, OK
double myDouble = myInt;  // int → double, OK
```

**Order:** `byte → short → int → long → float → double`

### Explicit Casting (narrowing)

Larger type → smaller type. May lose data. Done manually.

```java
double price = 19.99;
int rounded = (int) price;     // 19 (truncated!)

long bigNumber = 1_000_000_000L;
int small = (int) bigNumber;
```

> [!caution] Data Loss
> Narrowing can silently lose data. `(int) 19.99` gives `19` — decimal part is gone.

---

## Operators

### Arithmetic

| Operator | Meaning | Example |
|---|---|---|
| `+` | Addition | `5 + 3` → `8` |
| `-` | Subtraction | `5 - 3` → `2` |
| `*` | Multiplication | `5 * 3` → `15` |
| `/` | Division | `10 / 3` → `3` (integer!) |
| `%` | Modulus (remainder) | `10 % 3` → `1` |

> [!warning] Integer Division
> `10 / 3` gives `3`, not `3.33`. Use `10 / 3.0` to get `3.333...`.

### Comparison

| Operator | Meaning | Example |
|---|---|---|
| `==` | Equal to | `5 == 3` → `false` |
| `!=` | Not equal | `5 != 3` → `true` |
| `>` | Greater than | `5 > 3` → `true` |
| `<` | Less than | `5 < 3` → `false` |
| `>=` | Greater or equal | `5 >= 5` → `true` |
| `<=` | Less or equal | `5 <= 3` → `false` |

> [!caution] `==` with Strings
> `==` compares **memory addresses**. Use `.equals()` for content: `"hello".equals("hello")` → `true`.

### Logical

| Operator | Meaning | Example |
|---|---|---|
| `&&` | AND (short-circuit) | `true && false` → `false` |
| `||` | OR (short-circuit) | `true || false` → `true` |
| `!` | NOT | `!true` → `false` |

### Increment and Decrement

```java
int x = 5;
x++;       // x = 6
++x;       // x = 7

int a = x++;   // a = 7, then x = 8 (post: use old value first)
int b = ++x;   // x = 9, then b = 9 (pre: increment first)
```

### Compound Assignment

```java
int x = 10;
x += 5;    // x = 15
x -= 3;    // x = 12
x *= 2;    // x = 24
x /= 4;    // x = 6
x %= 2;    // x = 0
```

---

## String Basics

`String` is NOT a primitive — it's a class. But Java treats it specially.

```java
public class StringDemo {
    public static void main(String[] args) {
        String name = "Alice";

        System.out.println(name.length());                  // 5
        System.out.println(name.charAt(0));                // 'A'
        System.out.println(name.substring(1, 4));          // "lic"
        System.out.println(name.equals("Alice"));          // true
        System.out.println(name.equalsIgnoreCase("alice")); // true
        System.out.println(name.toUpperCase());            // "ALICE"
        System.out.println(name.contains("lic"));          // true
        System.out.println(name.startsWith("Al"));         // true
        System.out.println(name.isEmpty());                // false
    }
}
```

### String Concatenation

```java
String firstName = "John";
String lastName = "Doe";
String fullName = firstName + " " + lastName;    // "John Doe"

int age = 30;
String message = "Name: " + fullName + ", Age: " + age;
```

> [!info] String Immutability
> Strings cannot be changed after creation. Every "modification" creates a new String. Use `StringBuilder` for heavy text manipulation.

---

## var Keyword (Java 10+)

`var` lets the compiler infer the type. The variable is still strongly typed.

```java
var name = "Alice";          // String
var age = 25;                // int
var price = 19.99;           // double
var numbers = new int[5];    // int[]

// var name;                 // ❌ Must initialize immediately
// var x = null;             // ❌ Can't infer type from null
```

> [!tip] When to use var
> Use `var` when the type is obvious: `var list = new ArrayList<String>();`. Avoid when it hurts readability: `var result = someMethod();`.

---

## Wrapper Classes and Autoboxing

Generics and collections cannot work with primitives (`List<int>` is illegal). Java provides a **wrapper class** for each primitive type — a class that holds a primitive value as an object.

| Primitive | Wrapper | Example |
|---|---|---|
| `int` | `Integer` | `Integer num = 42;` |
| `double` | `Double` | `Double pi = 3.14;` |
| `boolean` | `Boolean` | `Boolean flag = true;` |
| `char` | `Character` | `Character ch = 'A';` |
| `long` | `Long` | `Long big = 100L;` |
| `byte` | `Byte` | `Byte b = 1;` |
| `short` | `Short` | `Short s = 10;` |
| `float` | `Float` | `Float f = 2.5f;` |

### Autoboxing and Unboxing

Java converts between primitives and wrappers automatically:

```java
// Autoboxing: primitive → wrapper (automatic)
Integer num = 42;             // compiler does: Integer.valueOf(42)
List<Integer> list = new ArrayList<>();
list.add(5);                  // autoboxes 5 → Integer.valueOf(5)

// Unboxing: wrapper → primitive (automatic)
int x = num;                  // compiler does: num.intValue()
int first = list.get(0);     // auto-unboxes Integer → int
```

### The Integer Cache Trap

Java caches `Integer` values from **-128 to 127**. Within this range, `Integer.valueOf()` returns the same object. Outside this range, it creates a new object each time.

```java
Integer a = 127;
Integer b = 127;
System.out.println(a == b);    // true — same cached object

Integer c = 128;
Integer d = 128;
System.out.println(c == d);    // false — different objects!
System.out.println(c.equals(d)); // true — same value
```

> [!danger] Always Use .equals() for Wrappers
> Never compare wrapper types with `==`. It works for small numbers (cache) but fails for large ones. Always use `.equals()`.

### Null Danger

Wrappers can be `null`, primitives cannot. Unboxing `null` throws `NullPointerException`:

```java
Integer value = null;
int x = value;           // NullPointerException! (tries to call value.intValue())
```

This is a very common bug when working with collections, database results, or JSON parsing — any of these can return `null` where you expect a number.

> [!tip] When to Use Which
> Use **primitives** for local calculations, loop counters, and anywhere you don't need `null`. Use **wrappers** when you need `null` as a valid value (e.g., "no data"), in collections (`List<Integer>`), and in generic code.

---

## Interview Questions

### Top 10

**1. How many primitive types does Java have? Name them.**
Java has 8 primitive types: `byte`, `short`, `int`, `long`, `float`, `double`, `boolean`, `char`. They store values directly in memory, not as objects.

**2. What is the difference between primitive and reference types?**
Primitive types store the actual value in memory. Reference types store a *memory address* that points to an object. Primitives are compared by value (`==`), while reference types compared with `==` compare addresses, not content.

**3. What is type casting? When is explicit casting needed?**
Type casting converts one data type to another. Implicit casting (widening) happens automatically when going from a smaller to a larger type (`int → long`). Explicit casting (narrowing) is required when going from a larger to a smaller type (`double → int`), and may lose data.

**4. What is the difference between `==` and `.equals()` for Strings?**
`==` compares memory addresses — it checks if two references point to the same object. `.equals()` compares the actual content of the strings. For string content comparison, always use `.equals()`.

**5. What is the result of `10 / 3` in Java? Why?**
The result is `3`, not `3.333`, because both operands are integers. Java performs integer division which truncates the decimal part. To get `3.333`, at least one operand must be a floating point type: `10 / 3.0` or `(double) 10 / 3`.

**6. What is the difference between `++x` and `x++`?**
`++x` (pre-increment) increments the value first, then returns the new value. `x++` (post-increment) returns the current value first, then increments. Example: if `x = 5`, `++x` returns 6, while `x++` returns 5 and x becomes 6.

**7. What is the `var` keyword? When should you use it?**
`var` (introduced in Java 10) lets the compiler infer the variable type from the right-hand side. Use it when the type is obvious (`var list = new ArrayList<String>()`). Avoid it when the type is not clear (`var result = getData()` — what type is `result`?).

**8. Why is String immutable in Java?**
Strings are immutable for security (sensitive data like passwords), caching (String pool), thread safety (no synchronization needed), and performance (hash code caching).

**9. What is the difference between `float` and `double`?**
`float` is 32-bit (precision ~7 decimal digits), requires the `f` suffix. `double` is 64-bit (precision ~15 decimal digits), is the default for decimal literals. For most calculations, `double` is preferred.

**10. What are compound assignment operators? Give examples.**
Compound operators combine an operation with assignment: `+=`, `-=`, `*=`, `/=`, `%=`. Example: `x += 5` is equivalent to `x = x + 5`. They also include an implicit cast: `short s = 5; s += 2;` compiles, but `s = s + 2;` does not.

---

### Tricky Questions

**1. What is the value of `2.0 - 1.1` in Java? Why?**
It is not `0.9`. It will be something like `0.8999999999999999` due to floating-point precision errors. Binary floating point cannot represent `0.1` exactly. Always use `BigDecimal` for precise decimal arithmetic (money, calculations).

**2. Can you use `var` for method parameters or return types?**
No. `var` can only be used for local variables inside methods. It cannot be used for method parameters, return types, fields, or catch parameters.

**3. Why does Java not have primitive types for strings?**
The designers chose to make String a class for flexibility: it can be interned (String Pool for memory optimization), have methods like `length()`, `substring()`, and support immutability contracts. Primitives cannot have methods or participate in the String Pool.

**4. What happens when you cast a large `long` value to `int`?**
If the value exceeds the `int` range (−2³¹ to 2³¹−1), the bits are truncated and the result wraps around (overflow). Java does not throw an exception. Example: `(int) 3_000_000_000L` will produce a negative number.

**5. Is it possible to change the value of a String after it is created?**
No — strings are immutable by design. However, you can use reflection to modify the internal `char[]` array, but this breaks the contract and should never be done in real code. Use `StringBuilder` for mutable strings.

