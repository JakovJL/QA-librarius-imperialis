# Java

## Table of Contents

- [[#Questions and Answers]]
	- [[#What Is the Difference Between Primitive and Reference Types?]]
	- [[#How Do Java Access Modifiers Control Visibility?]]
	- [[#Which Operators and Loops Should You Explain?]]
	- [[#What Are Autoboxing and Unboxing?]]
	- [[#How Do final and static Work?]]
	- [[#How Should You Handle Exceptions?]]
	- [[#How Do an Abstract Class and an Interface Differ?]]
	- [[#How Do Generics Improve Type Safety?]]
	- [[#How Do You Choose a Collection?]]
	- [[#How Do ArrayList and LinkedList Differ?]]
	- [[#How Do Set and HashMap Work Internally?]]
	- [[#How Do Lambdas and the Stream API Work?]]
	- [[#How Do You Use Advanced Stream Operations?]]
	- [[#What Is the Difference Between Concurrency, Parallelism, and Threads?]]
	- [[#How Do synchronized and volatile Work?]]
	- [[#What Do Garbage Collection and the Class Loader Do?]]
	- [[#Which Patterns Are Useful in a Java Test Framework?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Questions and Answers

### What Is the Difference Between Primitive and Reference Types?

**Answer:**

Java primitive types are `byte`, `short`, `int`, `long`, `float`, `double`, `char`, and `boolean`. A primitive variable stores its value directly and cannot be `null`. A reference variable stores a reference to an object or can be `null`.

For primitives, `==` compares values. For objects, `==` compares whether two references point to the same object; use `equals()` for logical value equality when the class defines it. For example, compare two strings with `equals()`, not `==`.

### How Do Java Access Modifiers Control Visibility?

**Answer:**

`public` members are accessible from other classes. `protected` members are accessible in the same package and through inheritance. A member without a modifier has package-private access and is visible only inside its package. `private` members are visible only inside their declaring class.

Keep fields private unless callers truly need them. Expose a small method API so that implementation details of a page object, client, or helper can change safely.

### Which Operators and Loops Should You Explain?

**Answer:**

Arithmetic operators calculate values; comparison operators produce a boolean; logical operators combine conditions. `&&` and `||` use short-circuit evaluation, so the right side may not run. The ternary operator `condition ? first : second` selects one of two expressions.

Use `if`/`else` or `switch` for branches. Use `for`, enhanced `for`, `while`, and `do-while` for repetition. `break` exits a loop or switch, and `continue` skips to the next loop iteration. Choose the clearest construct; complex nested conditions often need a helper method or a better model.

### What Are Autoboxing and Unboxing?

**Answer:**

Autoboxing converts a primitive to its wrapper object, for example `int` to `Integer`. Unboxing converts a wrapper to a primitive. Collections and generics use wrapper types because type parameters cannot be primitive types.

Unboxing a `null` wrapper throws `NullPointerException`. Also, two `Integer` objects should normally be compared with `equals()`, not `==`, because `==` compares references.

### How Do final and static Work?

**Answer:**

`final` has different meanings by context. A final variable cannot be reassigned, a final method cannot be overridden, and a final class cannot be extended. A final reference does not make the referenced object immutable; its fields can still change if the object is mutable.

`static` belongs to the class, not to an individual object. Use it for constants and stateless utility methods. Avoid mutable static state in tests because it can leak data between tests and break parallel execution.

### How Should You Handle Exceptions?

**Answer:**

An exception reports an abnormal situation. Checked exceptions, except subclasses of `RuntimeException`, must be caught or declared. Unchecked exceptions usually signal a programming or contract error. Use `try`/`catch` when the code can add useful recovery, cleanup, or context; use `finally` or `try-with-resources` for reliable cleanup.

Do not swallow an exception. In a test, fail with a clear message and preserve the original cause. Do not catch broad `Exception` only to continue with an invalid test state.

### How Do an Abstract Class and an Interface Differ?

**Answer:**

An interface defines a contract that different classes can implement. It can have abstract, default, static, and private methods, but it is not a normal holder for per-object mutable state. An abstract class can define shared fields, constructors, and implemented methods, while leaving some methods abstract.

Use an interface for a capability with different implementations, such as `TokenProvider`. Use an abstract class only when subclasses truly share stable implementation and state. A class can implement several interfaces but extends only one class.

### How Do Generics Improve Type Safety?

**Answer:**

Generics declare the expected element or value type, for example `List<Order>` or `Map<String, User>`. The compiler can then reject inserting a wrong type and reduces explicit casts when reading data.

Avoid raw types such as `List` without a type argument. Use wildcards when an API accepts a family of types: `? extends T` is commonly for reading producers, and `? super T` for writing consumers. Do not use a wildcard when a concrete type makes the method simpler.

### How Do You Choose a Collection?

**Answer:**

`List` keeps an ordered sequence and allows duplicates. `Set` keeps unique values. `Queue` and `Deque` model processing order. `Map` stores key-value pairs and is separate from the `Collection` hierarchy. Choose by the required behaviour first: ordering, uniqueness, key lookup, queue operations, thread safety, and expected size.

For example, use a `List` for ordered UI items, a `Set` to compare unique IDs, a `Map` for data by ID, and an `ArrayDeque` for a queue or stack. Do not choose a collection only because it is familiar.

### How Do ArrayList and LinkedList Differ?

**Answer:**

`ArrayList` uses a resizable array. It gives fast indexed access and is usually the default list choice. Inserting or removing near the middle shifts later elements, so it can be expensive. `LinkedList` stores linked nodes; finding an item by index is slow because it walks nodes.

Adding or removing at a known node or at an end can be efficient for `LinkedList`, but normal test code often first has to find that node. Measure a real bottleneck before replacing `ArrayList`; `LinkedList` is not automatically faster for insertions.

### How Do Set and HashMap Work Internally?

**Answer:**

`HashMap` is a hash-table implementation of `Map`. It uses a key's `hashCode()` to select a bucket and `equals()` to find the matching key among possible collisions. With well-distributed hashes, `get` and `put` are expected to be fast. `HashMap` has no stable iteration order and is not thread-safe for concurrent structural changes.

Keys should have stable `equals()` and `hashCode()` values while they are in a map. Mutating fields used by these methods can make a key impossible to find. `HashSet` is useful for uniqueness and uses hashing for its usual implementation; use `LinkedHashSet` when insertion order matters or `TreeSet` when sorted order is needed.

### How Do Lambdas and the Stream API Work?

**Answer:**

A lambda is a compact implementation of a functional interface, such as a predicate or function. A stream is a pipeline that reads elements from a source and applies intermediate operations such as `filter` and `map`, then a terminal operation such as `toList`, `count`, or `reduce`.

A stream does not store the elements and is consumed after a terminal operation. Keep stream operations stateless and do not modify a non-concurrent source collection while the pipeline is running. Use a loop if it expresses the test logic more clearly.

### How Do You Use Advanced Stream Operations?

**Answer:**

Use `Collectors.groupingBy` to collect elements into groups by a key, for example API records by status. Use `Collectors.partitioningBy` to split elements into the `true` and `false` groups of a predicate. `mapping`, `counting`, `joining`, and downstream collectors can make one readable aggregate result.

Do not create a long stream pipeline that hides the test intention. Check null handling, duplicate keys when using `toMap`, ordering requirements, and the cost of stateful operations such as `sorted` or `distinct`.

### What Is the Difference Between Concurrency, Parallelism, and Threads?

**Answer:**

Concurrency means several tasks can make progress during the same period, often by interleaving work. Parallelism means tasks execute at the same time on different processors or cores. A thread is one path of execution inside a process; Java also provides higher-level executors and futures to manage tasks.

Parallel test runs need isolated drivers, test data, files, and reporting. Starting raw threads in tests without lifecycle control often creates flaky tests; prefer an executor or the test framework's supported parallel mechanism.

### How Do synchronized and volatile Work?

**Answer:**

`synchronized` uses an object's monitor to give mutual exclusion: only one thread can execute the protected block for that monitor at a time. Unlocking a monitor happens-before a later lock of the same monitor, so changes become visible to the next thread.

`volatile` makes reads and writes of one variable visible and ordered between threads, but it does not make a compound action atomic. For example, `count++` is still unsafe with only `volatile`; use `AtomicInteger` or a lock when the operation must be atomic.

### What Do Garbage Collection and the Class Loader Do?

**Answer:**

The garbage collector reclaims memory for objects that are no longer reachable from live references. It runs on its own schedule, so code must not rely on a particular collection time. A memory leak in Java usually means that an object is still reachable by mistake, for example from a static collection, listener, cache, or thread-local value.

A class loader loads classes and resources into the JVM. Class identity includes both the class name and its defining class loader, so the same class name from different loaders is not the same runtime type. This matters in plugin systems, test runners, and dependency conflicts.

### Which Patterns Are Useful in a Java Test Framework?

**Answer:**

Use Page Object or Screen Object to separate test scenarios from UI details. Use Factory to create drivers or clients from configuration, Builder to make complex test data readable, and Strategy to select a changeable behaviour such as authentication or retry policy. Dependency injection can make real and fake dependencies replaceable.

Choose a pattern only when it removes duplication, coupling, or unclear construction. Global mutable singletons and deep inheritance often make test isolation and parallel runs harder.

---

## Theory Links

- [[AQA Java eng]]
