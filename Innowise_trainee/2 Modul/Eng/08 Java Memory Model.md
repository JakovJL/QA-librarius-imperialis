# Java Memory Model

## Table of Contents

- [[#Why Memory Matters]]
- [[#Stack and Heap]]
- [[#What Lives Where]]
- [[#Method Call Stack]]
- [[#Garbage Collection]]
- [[#null and NullPointerException]]
- [[#Memory Leaks in Java]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]
	- [[#Advanced Questions]]
	- [[#Code Questions]]

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

---

### Practical Tasks

> [!tip] How to practice
> Try to solve each task yourself first, then check the solution.

#### 1. Where does the variable live?

**Task:** Determine where each variable is stored: stack, heap, or metaspace.

```java
public class MemoryTest {
    static int staticCounter = 0;              // ?
    int instanceValue;                         // ?

    public void test() {
        int localPrimitive = 5;                // ?
        User user = new User("Alice");         // user (reference) — ?, User (object) — ?
        int[] arr = {1, 2, 3};                 // arr (reference) — ?, array — ?
    }
}
```

**Answer:** `staticCounter` — metaspace. `instanceValue` — heap (inside MemoryTest object). `localPrimitive` — stack. `user` (reference) — stack. `User` (object) — heap. `arr` (reference) — stack. array `{1,2,3}` — heap.

**Explanation:** Primitives live where they are declared (local → stack, fields → heap). References live where declared. Objects (new) are always on the heap. Statics — metaspace.

#### 2. String Pool — == vs equals

**Task:** Write what each line prints and why.

```java
String a = "hello";
String b = "hello";
String c = new String("hello");
String d = c.intern();

System.out.println(a == b);      // ?
System.out.println(a == c);      // ?
System.out.println(a == d);      // ?
System.out.println(c == d);      // ?
```

**Answer:** `true` (both from pool), `false` (c is a new heap object), `true` (intern returns pool reference), `false` (d from pool, c from heap).

**Explanation:** String literals are automatically interned in the String Pool (a and b are the same object). `new String()` creates a new heap object. `intern()` returns the canonical pool reference.

#### 3. When is an object eligible for GC?

**Task:** At which step does the User object become eligible for garbage collection?

```java
public class GcTest {
    public static void main(String[] args) {
        User u1 = new User("Alice");  // step 1
        User u2 = new User("Bob");    // step 2
        u1 = u2;                      // step 3
        u2 = null;                    // step 4
        System.gc();                  // step 5
    }
}
```

**Answer:** After step 3, the "Alice" object loses its last reference (u1 now points to "Bob") — eligible for GC. After step 4, both u1 and u2 point to null — "Bob" is also eligible for GC. `System.gc()` is only a suggestion.

**Explanation:** An object is eligible for GC when no live reference points to it. Reassigning a reference or setting it to null are the most common causes.

#### 4. Integer cache — 127 vs 128

**Task:** What does this code print?

```java
Integer a = 100;
Integer b = 100;
Integer c = 200;
Integer d = 200;
System.out.println(a == b);
System.out.println(c == d);
```

**Answer:** `true`, `false`. Integer caches values from -128 to 127. For 100, the same cached object is returned. For 200, different objects are created. The same applies to Byte, Short, Long (up to 127), Character (up to 127), Boolean.

**Explanation:** Autoboxing uses `Integer.valueOf()`, which returns a cached object for small values. Always use `.equals()` for comparing wrappers, not `==`.

#### 5. OutOfMemoryError

**Task:** Write code that will definitely cause OutOfMemoryError. How many objects can you create before the crash?

```java
public class OomDemo {
    public static void main(String[] args) {
        List<byte[]> list = new ArrayList<>();
        int count = 0;
        try {
            while (true) {
                list.add(new byte[10 * 1024 * 1024]); // 10 MB each
                count++;
            }
        } catch (OutOfMemoryError e) {
            System.out.println("Created " + count + " blocks before OOM");
        }
    }
}
```

**Explanation:** Each block is 10 MB. The count depends on heap size (`-Xmx`). If heap is 256 MB, ~20-25 blocks will be created before OOM. You can catch Error, but the program is unstable afterwards.

| Complexity | Limited by JVM memory |

---

### Advanced Questions

**1. Does Java pass parameters by value or by reference?**  
**By value.** Always. For primitives, the actual value is copied. For objects, the **value of the reference** (the address) is copied, not the object itself. You can change fields of the passed object inside a method, but you cannot replace the object itself — the outside reference stays the same.

```java
public void change(String s, StringBuilder sb) {
    s = "new";              // outside reference unchanged
    sb.append(" world");    // object changed — same reference
}
// Call:
String a = "hello";
StringBuilder b = new StringBuilder("hello");
change(a, b);
System.out.println(a); // "hello" — unchanged
System.out.println(b); // "hello world" — changed
```

**2. What is `happens-before`?**  
A relation in the Java Memory Model that guarantees one action's result is **visible** to another action. If A happens-before B, all changes made by A (including writes to variables) are visible in B. Rules: (1) same thread — program order, (2) unlock happens-before lock on the same monitor, (3) write to `volatile` happens-before read from it, (4) `start()` happens-before the thread's first action, (5) last action in a thread happens-before `join()`.

**3. How does `volatile` work?**  
`volatile` guarantees two things: (1) **visibility** — writes to a volatile variable are immediately visible to all threads (not cached in registers/local cache), (2) **reordering prevention** — the compiler and CPU cannot reorder operations around volatile. It does **not** guarantee atomicity: `count++` with volatile still needs synchronization.

```java
// volatile works for a flag:
volatile boolean running = true;
// Thread 1: while (running) { ... }
// Thread 2: running = false; // Thread 1 sees it immediately
```

**4. What is the difference between Strong, Soft, Weak, and Phantom references?**  
| Type | GC behavior | Usage |
|---|---|---|
| **Strong** | Not collected while reachable | Normal references (`User u = new User()`) |
| **Soft** | Collected only when memory is **very low** | Caches that can be rebuilt |
| **Weak** | Collected on the **first** GC | `WeakHashMap`, caches |
| **Phantom** | Object is already finalized | Post-mortem cleanup |

```java
WeakReference<User> ref = new WeakReference<>(new User());
System.gc(); // User will be collected
System.out.println(ref.get()); // null
```

**5. What is escape analysis?**  
A JIT analysis that detects whether an object "escapes" from a method (stored in a field, returned, passed to another method). If the object does **not escape**, the JVM can: (1) allocate it **on the stack** instead of the heap (stack allocation), (2) skip synchronization (lock elision), (3) replace fields with local variables (scalar replacement). This is one reason why creating small objects in Java is cheaper than it seems.

**6. What is TLAB (Thread-Local Allocation Buffer)?**  
Each thread gets a small buffer on the heap (TLAB) for allocating new objects. The thread allocates objects in its TLAB without synchronizing with other threads. When the TLAB is full, the thread requests a new one. This makes object creation faster in multi-threaded applications. TLAB size is configurable with `-XX:TLABSize`.

**7. What are stop-the-world pauses?**  
During some GC phases (especially Full GC), the JVM **stops all application threads**. While GC runs, the program does not execute. Long STW pauses are a problem for real-time systems. Modern GCs (G1, ZGC, Shenandoah) minimize STW by doing most work concurrently with the application.

**8. How does `final` affect visibility in the JMM?**  
The JMM gives a special guarantee for `final` fields: after the constructor finishes, `final` fields are **visible** to all threads without extra synchronization. This allows safe publication of immutable objects. Important: the object must not escape from the constructor (the `this` reference should not be accessible to other threads before the constructor completes).

```java
public class SafePoint {
    private final int x;
    private final int y;
    public SafePoint(int x, int y) {
        this.x = x;
        this.y = y;
    }
    // after constructor, x and y are guaranteed visible to all threads
}
```

**9. What is false sharing?**  
A performance problem in multi-threaded systems. The CPU works with cache lines (usually 64 bytes). If two threads on different cores modify variables that happen to be in the same cache line, the CPUs must synchronize caches — even though the variables are logically independent. Solutions: padding (adding empty fields to reach 64 bytes) or using the `@Contended` annotation.

```java
// Before: x and y may share a cache line — false sharing
volatile long x;
volatile long y;

// After: padding separates them into different lines
@Contended
volatile long x;
@Contended
volatile long y;
```

**10. What is `String.intern()` and how does it work?**  
`intern()` puts a string into the String Pool (if not already there) and returns the canonical representation. After interning, two equal strings point to the same pool object. The pool lives on the heap (before Java 7 — in PermGen). Using `intern()` carelessly is dangerous — it can overflow the pool and cause OutOfMemoryError.

```java
String a = "hello";             // literal — automatically in pool
String b = new String("hello"); // new object on heap
String c = b.intern();          // returns reference from pool
System.out.println(a == b);     // false — different objects
System.out.println(a == c);     // true — same pool object
```

---

### Code Questions

**1. What does this code print?**  
```java
String s1 = "hello";
String s2 = "hello";
String s3 = new String("hello");
System.out.println(s1 == s2);
System.out.println(s1 == s3);
System.out.println(s1.equals(s3));
```
**Answer:** `true`, `false`, `true`. `s1` and `s2` are the same object from the String Pool (== true). `s3` is a new object on the heap (== false). `equals()` compares content — true.

**2. What does this code print?**  
```java
Integer a = 127;
Integer b = 127;
Integer c = 128;
Integer d = 128;
System.out.println(a == b);
System.out.println(c == d);
```
**Answer:** `true`, `false`. Integer caches values from -128 to 127. For 127, the same cached object is returned. For 128, new objects are created. This applies to all wrapper types: `Byte`, `Short`, `Integer`, `Long` (up to 127), `Character` (up to 127), `Boolean`.

**3. What does this code print?**  
```java
public class FinalizeEscape {
    static FinalizeEscape saved;
    @Override protected void finalize() {
        saved = this; // resurrection
    }
    public static void main(String[] args) throws Exception {
        FinalizeEscape obj = new FinalizeEscape();
        obj = null;
        System.gc();
        Thread.sleep(100);
        System.out.println(saved != null); // true — object resurrected
        saved = null;
        System.gc();
        Thread.sleep(100);
        System.out.println(saved != null); // false — finalize() called once only
    }
}
```
**Answer:** `true`, `false`. `finalize()` is called **once** per object. During the first GC, the object "resurrects" by saving `this`. During the second GC, `finalize()` is not called again — the object is collected. This is why `finalize()` is deprecated.

**4. What does this code print?**  
```java
public class EscapeDemo {
    public static long sum() {
        Long sum = 0L;          // Long is an object, not a primitive
        for (long i = 0; i < 1_000_000; i++) {
            sum += i;           // creates a new Long object every iteration!
        }
        return sum;
    }
}
```
**Answer:** The code works but is **very slow**. `Long sum = 0L` is an object. `sum += i` unboxes, adds, and creates a new `Long` object on each iteration — 1 million objects. Correct version: `long sum = 0L` (primitive). This is a classic example of hidden object creation on the heap.

**5. What does this code print?**  
```java
public class VolatileDemo {
    static boolean flag = false;
    public static void main(String[] args) throws Exception {
        new Thread(() -> {
            while (!flag) { }  // may never stop
        }).start();
        Thread.sleep(100);
        flag = true;           // may not be visible to the other thread
        System.out.println("Main done");
    }
}
```
**Answer:** `Main done` is printed, but the second thread may **never stop**. Without `volatile`, the change to `flag` may stay in the CPU cache and not be visible to the other thread. Fix: `static volatile boolean flag`. This is a classic visibility problem in the JMM.
