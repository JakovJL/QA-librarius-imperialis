# Java Memory Model

## Table of Contents

- [[#Why Memory Matters]]
- [[#Stack and Heap]]
- [[#What Lives Where]]
- [[#Method Call Stack]]
- [[#Garbage Collection]]
- [[#null and NullPointerException]]
- [[#Memory Leaks in Java]]

**Related notes:** [[AQA Java eng]]

> [!info] Video Course (Zaur Tregulov)
> Course 1 (OCA): L4 & L11 (reference types, passing by reference) — partial. Stack/Heap/GC is covered deeper in this note.

---

## Why Memory Matters

When you write `int x = 5;` or `new User("Alice")`, Java stores this data somewhere in memory. Understanding **where** and **how** helps you:

- Predict when objects are destroyed (important for resource management in tests)
- Understand why `==` behaves differently for primitives and objects
- Debug `NullPointerException` and `OutOfMemoryError`
- Answer common interview questions

You don't need to manage memory manually in Java (unlike C/C++). But you need to understand the model to write correct code and explain your choices.

---

## Stack and Heap

Java runtime memory is divided into two main areas:

### Stack

The **stack** is a fast, ordered area of memory. Each thread has its own stack. It works like a stack of plates — last in, first out (LIFO).

What lives on the stack:
- **Local variables** (primitives and references)
- **Method call frames** (which method is running, its parameters, local variables)
- **Return addresses** (where to go back after a method finishes)

The stack is **automatically cleaned up** when a method returns — its frame is removed, and all local variables in it are gone.

### Heap

The **heap** is a shared memory area for all threads. It is larger and slower than the stack.

What lives on the heap:
- **All objects** (created with `new`)
- **Arrays** (even `int[]` — arrays are objects)
- **String Pool** (a special region inside the heap)
- **Static fields** (stored in the class metadata area)

Objects on the heap live until the **Garbage Collector** removes them.

### Visual Model

```
STACK (per thread)               HEAP (shared)
+------------------+             +------------------------+
| main()           |             |                        |
|   int age = 25   |  --------  |  User object           |
|   User u = ref --|----------->|  { name: "Alice",      |
|                  |             |    age: 25 }           |
+------------------+             |                        |
| login()          |             |  String "Alice"        |
|   String s = ref-|----------->|  (in String Pool)      |
|   int count = 0  |             |                        |
+------------------+             +------------------------+
```

> [!danger] Core Rule
> Primitives are stored **where they are declared**. If declared inside a method → stack. If declared as an object field → heap (inside the object). References are always on the stack (or in the object), but the object they point to is always on the heap.

---

## What Lives Where

This is the most commonly asked question about Java memory. The answer depends on **where the variable is declared**, not its type.

### Local Variables (inside a method)

```java
public void calculate() {
    int x = 10;              // primitive → stack
    double pi = 3.14;        // primitive → stack
    String name = "Alice";   // reference → stack, object → heap (pool)
    User user = new User();  // reference → stack, object → heap
    int[] arr = {1, 2, 3};   // reference → stack, array object → heap
}
// when calculate() returns → all references removed from stack
// objects on the heap become eligible for GC if no other references exist
```

### Instance Fields (inside an object)

```java
public class User {
    private int age;           // lives inside the User object on the heap
    private String name;       // reference inside User object, String on heap
    private int[] scores;      // reference inside User object, array on heap
}
```

When you create `new User()`, the JVM allocates one block of memory on the heap for the entire object — including space for `age`, `name`, and `scores`.

### Static Fields

```java
public class Config {
    static String url = "https://example.com";   // stored in class metadata
    static int timeout = 30;                      // stored in class metadata
}
```

Static fields are stored in a special area associated with the class itself (metaspace in modern JVM). They live for the entire duration of the program.

> [!tip] Quick Reference
> | Declaration | Primitive value | Reference | Object |
> |---|---|---|---|
> | Local variable | Stack | Stack | Heap |
> | Instance field | Heap (in object) | Heap (in object) | Heap |
> | Static field | Metaspace | Metaspace | Heap |

---

## Method Call Stack

When a method is called, a new **stack frame** is pushed onto the stack. When the method returns, the frame is popped off.

```java
public class Demo {
    public static void main(String[] args) {        // frame 1 (bottom)
        int result = multiply(3, 4);                 // frame 2 pushed
        System.out.println(result);
    }

    static int multiply(int a, int b) {              // frame 2
        int product = a * b;
        return product;                              // frame 2 popped
    }
}
```

**Stack during `multiply()` execution:**

```
| multiply()          |  <- top (current)
|   a = 3, b = 4     |
|   product = 12      |
|---------------------|
| main()              |  <- waiting
|   args = ref        |
|   result = ???      |
+---------------------+
```

### StackOverflowError

If methods call themselves infinitely (bad recursion), the stack runs out of space:

```java
public void oops() {
    oops();   // never stops → StackOverflowError
}
```

> [!info] Stack Size
> Default stack size is ~512KB–1MB per thread. This is enough for most programs. Deep recursion or very large local arrays can exhaust it. You can increase it with `-Xss` JVM flag, but usually the fix is to avoid deep recursion.

---

## Garbage Collection

In Java, you don't free memory manually. The **Garbage Collector (GC)** automatically finds and removes objects that are no longer reachable.

### When is an Object Eligible for GC?

An object becomes eligible when **no live reference** points to it:

```java
User user = new User("Alice");  // User object is reachable via 'user'
user = new User("Bob");         // "Alice" object is now unreachable → eligible for GC
user = null;                    // "Bob" object is now unreachable → eligible for GC
```

### How GC Works (simplified)

1. **Mark phase** — GC starts from "roots" (local variables, static fields, thread stacks) and marks every reachable object
2. **Sweep phase** — unreachable (unmarked) objects are removed, and their memory is freed
3. The JVM runs GC automatically when the heap gets low on space

### Generational Collection

The JVM divides the heap into regions based on object age:

| Region | Contains | GC Frequency |
|---|---|---|
| **Young Generation** | Newly created objects | Frequent (minor GC) |
| **Old Generation** | Long-lived objects (survived many GCs) | Rare (major GC) |

Most objects die young (temporary variables, loop iterations). The young generation is collected often and quickly. Objects that survive multiple collections are promoted to the old generation.

### What You Cannot Do

- You cannot force GC to run. `System.gc()` is only a **suggestion** — the JVM may ignore it.
- You cannot predict **when** GC will run.
- You cannot control **which** objects are collected.

> [!caution] finalize() is Deprecated
> The `finalize()` method (called before GC collects an object) is deprecated since Java 9 and removed in Java 18. Don't use it. Use try-with-resources for cleanup instead.

---

## null and NullPointerException

`null` means "this reference points to nothing." It is not an object — it is the absence of an object.

```java
String name = null;    // reference exists, but points to nothing
name.length();          // NullPointerException — no object to call length() on
```

### Common Causes of NullPointerException

```java
// 1. Uninitialized object field
User user = new User();
user.getAddress().getCity();     // if getAddress() returns null → NPE

// 2. Method returns null
String result = map.get("key"); // returns null if key not found
result.toUpperCase();            // NPE

// 3. Array element is null
String[] names = new String[3]; // [null, null, null]
names[0].length();               // NPE
```

### How to Prevent NPE

```java
// 1. Null check
if (name != null) {
    System.out.println(name.length());
}

// 2. Safe method call order
"expected".equals(name);   // safe — "expected" is never null
// name.equals("expected"); // unsafe — name might be null

// 3. Optional (Java 8+) — covered in a later topic
Optional<String> maybeName = Optional.ofNullable(name);
maybeName.ifPresent(n -> System.out.println(n.length()));
```

> [!tip] NPE in AQA
> `NullPointerException` is the most common error in test automation. Typical causes: WebDriver returns `null` when an element is not found, a page object field is not initialized, or a test data method returns `null`. Always check for `null` when working with external data.

---

## Memory Leaks in Java

Java has automatic memory management, but memory leaks are still possible. A **memory leak** happens when objects are no longer needed but still referenced — GC cannot collect them.

### Common Leak Patterns

```java
// 1. Forgotten references in collections
List<User> cache = new ArrayList<>();
while (true) {
    cache.add(new User(...));   // list grows forever — old users never removed
}

// 2. Static collections
static Map<String, Object> globalCache = new HashMap<>();
// objects in static collections live for the entire program

// 3. Unclosed resources
Connection conn = DriverManager.getConnection(url);
// if you forget conn.close(), the connection object and its buffers stay in memory
```

### Prevention

- Close resources with try-with-resources
- Use weak references (`WeakHashMap`) for caches
- Don't store everything in static collections
- In tests: always call `driver.quit()` in `@AfterEach` — WebDriver holds a lot of memory

> [!warning] OutOfMemoryError
> When the heap is full and GC cannot free enough space, the JVM throws `OutOfMemoryError`. Common causes: memory leak, too much test data loaded at once, or heap size too small. Increase with `-Xmx` flag: `java -Xmx2g MyApp`.

---

## Interview Questions

### Top 10

**1. What is the difference between stack and heap?**
Stack is per-thread, stores local variables and method frames, fast, LIFO, auto-cleaned on method return. Heap is shared, stores all objects, slower, managed by Garbage Collector.

**2. Where are local variables stored? Where are objects stored?**
Local primitive variables are stored on the stack. Local reference variables are on the stack too, but the objects they point to are on the heap. All objects live on the heap.

**3. What is Garbage Collection?**
Automatic memory management. The GC finds objects with no live references (unreachable) and frees their memory. The programmer does not free memory manually.

**4. When does an object become eligible for Garbage Collection?**
When no live reference points to it. This happens when: the reference is set to `null`, the reference goes out of scope (method returns), or the reference is reassigned to another object.

**5. What is `NullPointerException`?**
An exception thrown when you try to use a reference that points to `null` — calling a method, accessing a field, or indexing an array through a null reference.

**6. What is the String Pool?**
A special area on the heap where Java stores string literals. When you create `"hello"`, the JVM checks the pool first and reuses the existing object if found. This saves memory because string literals often repeat.

**7. Can you force Garbage Collection?**
No. `System.gc()` is a request, not a command. The JVM decides when and how to run GC. In practice, you should never rely on `System.gc()`.

**8. What is `StackOverflowError`?**
Thrown when the stack runs out of space, usually due to infinite or very deep recursion. Each method call adds a frame to the stack — if it never returns, the stack fills up.

**9. What is the difference between `StackOverflowError` and `OutOfMemoryError`?**
`StackOverflowError` — the thread stack is full (too many nested method calls). `OutOfMemoryError` — the heap is full (too many objects, memory leak, or heap too small). Both are `Error`, not `Exception`.

**10. What are the generations in Java GC?**
Young Generation (new objects, collected frequently) and Old Generation (long-lived objects, collected rarely). Most objects die young, so frequent young-gen collection is efficient.

---

### Tricky Questions

**1. Is it possible to have a memory leak in Java?**
Yes. If an object is still referenced but no longer needed (e.g., in a growing static collection), GC cannot collect it. This is a logical memory leak — the reference exists, so GC treats it as alive.

**2. Where does a primitive field of an object live — stack or heap?**
Heap. The field is part of the object, and the object is on the heap. Only local primitive variables inside methods live on the stack.

**3. What happens if `finalize()` throws an exception?**
The exception is silently ignored and the object is finalized anyway. This is one of many reasons why `finalize()` is unreliable and deprecated.

**4. Can an object be resurrected during finalization?**
Yes. If `finalize()` stores `this` in a static field, the object becomes reachable again and GC won't collect it. This is called object resurrection — a terrible practice that makes code unpredictable.

**5. What is metaspace? How is it different from the old PermGen?**
Metaspace (Java 8+) stores class metadata (class definitions, method data, static fields). Unlike PermGen (fixed size, caused `OutOfMemoryError`), metaspace uses native memory and grows automatically. It is not part of the Java heap.
