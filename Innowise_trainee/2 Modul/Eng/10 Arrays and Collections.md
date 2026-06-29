# Arrays and Collections

## Table of Contents

- [[#Why This Topic Matters]]
- [[#Arrays]]
- [[#Collection Framework Overview]]
	- [[#Interfaces, Abstract Classes, and Implementations]]
- [[#Equality and Ordering Contracts]]
	- [[#equals and hashCode Contract]]
	- [[#Comparable vs Comparator]]
	- [[#Ordered vs Sorted]]
- [[#List]]
	- [[#List Interface]]
	- [[#ArrayList]]
	- [[#LinkedList]]
	- [[#ArrayList vs LinkedList]]
- [[#Set]]
	- [[#Set Interface]]
	- [[#HashSet]]
	- [[#LinkedHashSet]]
	- [[#TreeSet]]
	- [[#HashSet vs LinkedHashSet vs TreeSet]]
- [[#Map]]
	- [[#Map Interface]]
	- [[#HashMap]]
	- [[#Load Factor and Capacity]]
	- [[#LinkedHashMap]]
	- [[#TreeMap]]
	- [[#HashMap vs LinkedHashMap vs TreeMap]]
	- [[#ConcurrentHashMap]]
	- [[#Thread-Safe Collections]]
	- [[#WeakHashMap]]
	- [[#EnumMap and EnumSet]]
- [[#Queue and Deque]]
	- [[#Queue Interface]]
	- [[#PriorityQueue]]
	- [[#Deque Interface]]
	- [[#ArrayDeque]]
- [[#Immutable and Unmodifiable Collections]]
- [[#Utility Classes]]
	- [[#Arrays Utility]]
	- [[#Collections Utility]]
- [[#Big O Notation]]
- [[#Iteration and Common Operations]]
	- [[#Iterator and ListIterator]]
- [[#Arrays and Collections in AQA]]
- [[#Interview Questions]]
	- [[#Beginner Questions]]
	- [[#Intermediate Questions]]
	- [[#Advanced Questions]]
	- [[#Code Questions]]
- [[#Practical Tasks]]

**Related notes:** [[AQA Java eng]]

> [!info] Video Course (Zaur Tregulov)
> Course 1 (OCA): L18 arrays, L19 varargs & foreach, L20 ArrayList. Course 2 (Black Belt): Collections (List/Set/Map).

---

## Why This Topic Matters

In Java, you often need to store more than one value: a list of usernames, a set of unique emails, a map of test data, or a queue of tasks. Arrays and collections solve this problem.

This topic matters because you will use it everywhere:

- In business code to store and process data
- In AQA to keep locators, test data, API payloads, and results
- In interviews to explain which structure fits which task

The main idea is simple:

- **Arrays** are fixed-size containers
- **Collections** are flexible, ready-made data structures from the Java Collections Framework

---

## Arrays

An **array** stores multiple values of the same type in one object. Its size is fixed after creation.

```java
int[] numbers = new int[3];
numbers[0] = 10;
numbers[1] = 20;
numbers[2] = 30;

String[] names = {"Ann", "Bob", "Kate"};
System.out.println(names[1]); // Bob
```

### Key Rules

- Index starts at `0`
- Size cannot change after creation
- Arrays can store primitives and objects
- All elements have a default value

```java
int[] nums = new int[3];        // [0, 0, 0]
String[] words = new String[2]; // [null, null]
```

### Advantages

- Very fast access by index: `arr[i]`
- Simple syntax
- Good when size is known in advance

### Disadvantages

- Fixed size
- No built-in methods like `add()` or `remove()`
- Insertion in the middle is inconvenient because elements must be shifted

> [!tip] Array vs Collection
> Use an array when the number of elements is fixed and simple indexed access is enough. Use a collection when size changes often or when you need ready-made operations such as `add`, `remove`, `contains`, or sorting.

---

## Collection Framework Overview

The **Java Collections Framework** is a set of interfaces and classes for storing groups of objects.

Common interfaces:

- `List` - ordered collection, duplicates allowed
- `Set` - unique elements, no duplicates
- `Queue` - elements processed in a specific order
- `Map` - key-value pairs

> [!info] Map and the Collection interface
> `Map` is part of the Java Collections Framework even though it does not extend `Collection`. It belongs to the same family of data structures (same `java.util` package, same design philosophy) and is used alongside the other collections — but its API works on key-value pairs rather than single elements, so it does not fit the `Collection` contract.

Common implementations:

- `ArrayList`
- `LinkedList`
- `HashSet`
- `HashMap`
- `PriorityQueue`

```java
List<String> list = new ArrayList<>();
Set<String> set = new HashSet<>();
Map<String, Integer> map = new HashMap<>();
Queue<String> queue = new LinkedList<>();
```

> [!warning] Collections store objects, not primitives
> A collection can hold `Integer`, `Double`, or `Boolean`, but not `int`, `double`, or `boolean`. Java auto-boxes primitives into their wrapper classes when you add them, and unboxes on read.

### Interfaces, Abstract Classes, and Implementations

The framework has three layers:

- **Interface** — defines the contract (methods), no behavior. Examples: `List`, `Set`, `Queue`, `Map`.
- **Abstract class** — a partial implementation that concrete classes build on. Examples: `AbstractList`, `AbstractSet`, `AbstractQueue`. You rarely use these directly.
- **Concrete implementation** — the usable class. Examples: `ArrayList`, `HashSet`, `PriorityQueue`.

Program to the interface, not the implementation: declare the type as `List<String> list = new ArrayList<>();` so you can swap the implementation without changing the rest of the code.

The root `Collection` interface defines the methods every collection (except `Map`) inherits:

| Method | What it does |
|---|---|
| `add(e)` / `addAll(c)` | Add one / add all from another collection |
| `remove(o)` / `removeAll(c)` | Remove one / remove all found in `c` |
| `retainAll(c)` | Keep only elements also in `c` |
| `contains(o)` / `containsAll(c)` | Membership checks |
| `size()` / `isEmpty()` | Count / emptiness |
| `clear()` | Remove everything |
| `iterator()` | Returns an `Iterator` over the elements |
| `toArray()` / `toArray(T[])` | Convert to an array |
| `stream()` | Return a `Stream` over the elements |

---

## Equality and Ordering Contracts

Collections constantly compare elements: `List.contains()` checks equality, `Set` rejects duplicates, `Map` finds values by key, and sorted structures order elements. Two contracts power all of this: `equals()`/`hashCode()` for equality, and `Comparable`/`Comparator` for ordering.

Understanding these contracts first makes every following section easier to reason about.

---

### equals and hashCode Contract

**Definition:** `equals()` decides whether two objects are logically the same. `hashCode()` returns an integer used by hash-based collections (`HashMap`, `HashSet`) to place elements into buckets quickly.

**Goal:** Let hash-based collections find objects in O(1) on average.

**The contract (must obey):**

- If `a.equals(b)` is `true`, then `a.hashCode() == b.hashCode()` must also be `true`.
- If `equals()` is `false`, the hash codes **may** be equal (this is a collision) or different.
- Whenever you override `equals()`, you **must** also override `hashCode()`.

```java
// Broken: equals() checks name, but hashCode() is not overridden.
// Two users with the same name land in different buckets -> duplicates leak into a Set.
public class User {
    String name;

    public boolean equals(Object o) {
        return o instanceof User u && this.name.equals(u.name);
    }
    // hashCode() missing!
}
```

> [!danger] Core rule
> Equal objects **must** have equal hash codes. If you break this, `HashSet` will store "duplicates" and `HashMap` will "lose" keys, because they search in the wrong bucket.

---

### Comparable vs Comparator

Both define how to order objects, but from different places.

**`Comparable`** — the natural ordering defined **inside** the class itself.

- One default ordering per class
- Method: `int compareTo(T o)`
- Example: `String` sorts lexicographically

**`Comparator`** — an external strategy. You can build many different orderings for the same class.

- Method: `int compare(T a, T b)`
- Used with `Collections.sort(list, comparator)` or `list.sort(comparator)`

```java
// Comparable — defined inside the class:
public class User implements Comparable<User> {
    String name;
    public int compareTo(User other) { return this.name.compareTo(other.name); }
}

// Comparator — external, reusable:
Comparator<User> byNameLength = Comparator.comparingInt(u -> u.name.length());
users.sort(byNameLength);
```

> [!info] Comparable vs Comparator
> `Comparable` answers "how does this object compare itself to another?" (one default order). `Comparator` answers "how do I compare two objects from the outside?" (many possible orders).

### Ordered vs Sorted

These two words are often confused but mean different things in the JDK:

- **Ordered** — the collection returns elements in a **predictable sequence**, but not by value. `ArrayList` and `ArrayDeque` are ordered by insertion position. `LinkedHashSet` and `LinkedHashMap` keep **insertion order** (and `LinkedHashMap` can optionally keep access order).
- **Sorted** — elements are arranged **by their value**, using `Comparable` or `Comparator`. `TreeSet` and `TreeMap` are sorted.
- **Unordered** — no guaranteed sequence. `HashSet` and `HashMap` are unordered.

**Natural ordering** is the default order defined by a class's `Comparable` (alphabetical for `String`, ascending for numbers). For any other order, pass a `Comparator`.

> [!info] Insertion order vs sorted order
> Insertion order = "in the order I added them". Sorted order = "ordered by the elements' values". `LinkedHashMap` gives the first; `TreeMap` gives the second.

---

## List

A `List` keeps insertion order and allows duplicates. It is the most everyday collection: ordered, indexable, and flexible.

---

### List Interface

**Definition:** An ordered collection that allows access by index and permits duplicate values (including `null`).

**Goal:** Store a sequence of elements where position matters.

Common `List` methods (inherited by `ArrayList` and `LinkedList`):

| Method | What it does |
|---|---|
| `add(e)` | Add to the end |
| `add(i, e)` | Insert at index `i`, shift the rest right |
| `get(i)` | Read element at index `i` |
| `set(i, e)` | Replace element at index `i`, returns the old value |
| `remove(int i)` | Remove **by index** |
| `remove(Object o)` | Remove **by value** (first match) |
| `removeIf(pred)` | Remove all elements matching a condition |
| `indexOf(o)` | First index of value, or `-1` |
| `contains(o)` | `true` if the value is present |
| `size()` | Number of elements |
| `isEmpty()` | `true` if size is `0` |
| `clear()` | Remove everything |

```java
List<String> users = new ArrayList<>(List.of("ann", "bob", "kate"));
users.set(0, "alice");              // [alice, bob, kate]
users.add(1, "dave");               // [alice, dave, bob, kate]
users.removeIf(u -> u.length() > 3); // removes "alice", "dave", "kate"
System.out.println(users.indexOf("bob")); // 0
```

> [!caution] remove(int) vs remove(Object) with List of Integers
> For a `List<Integer>`, `list.remove(1)` removes the element **at index 1**, not the value `1`. To remove by value, use `list.remove(Integer.valueOf(1))`.

---

### ArrayList

**Definition:** A `List` backed by a dynamic array that grows when it fills up.

**Goal:** Be the fast, general-purpose ordered collection.

**How it grows internally:** created with the default constructor, the internal array is empty. On the first `add()` it is allocated with `DEFAULT_CAPACITY = 10`. When full, `grow()` creates a new array of size `oldCapacity + (oldCapacity >> 1)` (about **1.5×**) and copies elements across with `Arrays.copyOf()`. A single resize is O(n), but amortized over many adds each `add()` is O(1).

**Advantages:**

- Fast random access: `get(i)` is O(1)
- Memory efficient — one contiguous array of references
- Friendly to the CPU cache, so it is fast in practice

**Disadvantages:**

- Slow insert/remove in the middle: O(n) because elements shift
- Resize is occasionally expensive (but amortized)

**When to use:** Default choice for an ordered collection in almost all cases.

---

### LinkedList

**Definition:** A `List` built from doubly-linked nodes. Each node stores the value plus a reference to the previous and next node.

**Goal:** Support fast add/remove at the ends.

**Advantages:**

- `add()`/`remove()` at the head or tail is O(1)
- Can be used as a `Queue` or `Deque` too

**Disadvantages:**

- `get(i)` is O(n) — must walk from one end to the index
- More memory per element: each node is a separate object (value + prev + next)
- Poor cache locality

**When to use:** Rarely. Prefer `ArrayDeque` for a queue/stack, and `ArrayList` for a general list.

---

### ArrayList vs LinkedList

> [!tip] Quick Comparison
> | Aspect | ArrayList | LinkedList |
> |---|---|---|
> | Backing structure | Dynamic array | Doubly-linked nodes |
> | `get(i)` | O(1) | O(n) |
> | Insert/remove at ends | O(1)* amortized | O(1) |
> | Insert/remove in middle | O(n) | O(n) |
> | Memory per element | One reference | A node object (prev + next + value) |
> | Best for | Reading by index, general use | Frequent add/remove at ends |

> [!caution] LinkedList insert is rarely faster in practice
> `LinkedList` gives O(1) insertion only when you already hold the node. Inserting at an index still costs O(n) to walk there. At realistic sizes, `ArrayList` usually wins even for middle inserts thanks to cache locality and lower overhead.

In real projects and tests, `ArrayList` is the default choice almost all the time.

---

## Set

A `Set` stores only unique elements. Use it whenever duplicates are not allowed.

---

### Set Interface

**Definition:** A collection that rejects duplicate elements.

**Goal:** Guarantee uniqueness and fast membership checks.

Common `Set` methods:

| Method | What it does |
|---|---|
| `add(e)` | Add; returns `false` if already present |
| `remove(o)` | Remove a value |
| `contains(o)` | Membership check (fast) |
| `addAll(c)` | Union with another collection |
| `retainAll(c)` | Keep only elements also in `c` (intersection) |
| `removeAll(c)` | Remove all elements found in `c` (difference) |

```java
Set<String> a = new HashSet<>(List.of("chrome", "firefox", "edge"));
Set<String> b = new HashSet<>(List.of("firefox", "safari"));
a.retainAll(b);                       // intersection -> [firefox]
System.out.println(a.add("firefox")); // false, already there
```

> [!danger] Uniqueness depends on equals() and hashCode()
> `Set` decides duplicates using `equals()`/`hashCode()`. If these are broken on a custom class, the Set will store "duplicates". → see [[#equals and hashCode Contract]]

---

### HashSet

**Definition:** A `Set` backed by a hash table. Internally it uses a `HashMap` where each element is a key and a single shared dummy object is the value.

**Goal:** The fastest general-purpose Set.

**Advantages:**

- `add`, `remove`, `contains` are O(1) on average
- Low overhead

**Disadvantages:**

- No ordering guarantee — iteration order can look random
- Performance depends on a correct `hashCode()`

**When to use:** The default `Set` whenever you only need uniqueness.

---

### LinkedHashSet

**Definition:** A `HashSet` that also keeps a linked list of its entries, preserving **insertion order**.

**Goal:** Uniqueness **plus** predictable iteration order.

**Advantages:**

- Iterates in the order elements were added
- Still O(1) average operations

**Disadvantages:**

- Slightly more memory than `HashSet` (the links)

**When to use:** When you need a unique collection that iterates in a stable order (e.g. deduplicate while keeping first-seen order).

---

### TreeSet

**Definition:** A `Set` backed by a red-black tree. Elements are kept **sorted**.

**Goal:** Keep elements ordered and support range queries.

**Advantages:**

- Always iterates in sorted order
- Supports range views: `subSet`, `headSet`, `tailSet`
- `add`/`remove`/`contains` are O(log n)

**Disadvantages:**

- Slower than `HashSet` (O(log n) vs O(1))
- Does **not** allow `null`
- Uses `Comparable`/`Comparator`, not `equals()`/`hashCode()`, for uniqueness

**When to use:** When you need a sorted unique set, e.g. autocomplete candidates, sorted ranges, leaderboard.

**Interfaces:** `TreeSet` implements `SortedSet`, which is extended by `NavigableSet`. These add navigation methods: `first()`, `last()`, `lower(e)`, `higher(e)`, `floor(e)`, `ceiling(e)`, and range views `subSet(...)`, `headSet(...)`, `tailSet(...)`.

---

### HashSet vs LinkedHashSet vs TreeSet

> [!tip] Quick Comparison
> | Feature | HashSet | LinkedHashSet | TreeSet |
> |---|---|---|---|
> | Order | None | Insertion order | Sorted |
> | `add`/`remove`/`contains` | O(1)* | O(1)* | O(log n) |
> | Allows `null` | Yes (one) | Yes (one) | No |
> | Decides uniqueness by | `hashCode`/`equals` | `hashCode`/`equals` | `compareTo`/`Comparator` |
> | Best for | Pure uniqueness | Uniqueness + order | Sorted uniqueness |

---

## Map

A `Map` stores data as `key -> value` pairs. It is the structure behind config maps, parsed JSON, HTTP headers, and many interview problems.

---

### Map Interface

**Definition:** A collection of key-value entries where each key is unique.

**Goal:** Look up a value by key quickly.

Common `Map` methods:

| Method | What it does |
|---|---|
| `put(k, v)` | Add or overwrite; returns the old value |
| `get(k)` | Value for key, or `null` |
| `getOrDefault(k, def)` | Value, or `def` if key missing |
| `putIfAbsent(k, v)` | Set only if key not present |
| `containsKey(k)` / `containsValue(v)` | Membership checks |
| `remove(k)` | Remove an entry by key |
| `keySet()` / `values()` / `entrySet()` | Views for iteration |
| `computeIfAbsent(k, fn)` | Build and store a value lazily if key missing |
| `merge(k, v, fn)` | Combine new and existing value (great for counting) |

```java
Map<String, Integer> count = new HashMap<>();
for (String word : List.of("a", "b", "a")) {
    count.merge(word, 1, Integer::sum); // {a=2, b=1}
}
System.out.println(count.getOrDefault("x", 0)); // 0

Map<String, List<String>> byType = new HashMap<>();
byType.computeIfAbsent("ui", k -> new ArrayList<>()).add("loginTest");
```

> [!caution] get() can return null for two reasons
> `map.get(k)` returns `null` both when the key is absent **and** when the key exists with a `null` value. Use `containsKey(k)` or `getOrDefault(k, def)` to tell them apart.

---

### HashMap

**Definition:** A `Map` backed by a hash table — an array of **buckets**.

**Goal:** The fastest general-purpose Map.

**How it works internally:**

1. Entries are stored in an array of buckets, each holding a `Node<K,V>` (key, value, hash, next).
2. On `put(k, v)`: compute `k.hashCode()`, spread the bits, map to a bucket index.
3. If the bucket is empty — place the node. If occupied — compare keys with `equals()`: match → overwrite the value; no match → append to the bucket's linked list (a **collision**).
4. Since Java 8, when a bucket grows past **8** entries (and the table is large enough), that chain is converted into a balanced **red-black tree**, improving worst-case lookup from O(n) to O(log n).
5. `get(k)` works the same way: hash → bucket → search the chain/tree via `equals()`.

**Advantages:**

- `put`, `get`, `remove`, `containsKey` are O(1) average
- Widely supported and well understood

**Disadvantages:**

- No ordering guarantee
- Not thread-safe
- Depends on a correct `hashCode()`

**When to use:** Default `Map` in almost all single-threaded code.

> [!caution] Never use mutable keys
> If a key's fields change after insertion, its hash code changes too — but the entry stays in the original bucket. Lookups then compute the new hash and search a different bucket, so the entry is effectively lost. Prefer immutable keys like `String`, `Integer`, or `Long`.

---

### Load Factor and Capacity

**Definition:** **Capacity** is the number of buckets (default `16`). The **load factor** (default `0.75`) is the fill threshold: when `size > capacity × loadFactor`, the map **resizes** — it doubles capacity and rehashes every entry into new buckets.

**Why 0.75:** A trade-off between memory and speed. A low value (e.g. 0.5) means fewer collisions but more empty buckets (more memory). A high value (e.g. 0.9) saves memory but increases collisions and slows lookups.

**Practical tip:** If you know the final size in advance, pass it to the constructor (`new HashMap<>(expectedSize)`) to avoid repeated resizing.

---

### LinkedHashMap

**Definition:** A `HashMap` that also keeps a linked list of entries, preserving **insertion order** (or access order, optionally).

**Goal:** Fast lookups **plus** predictable iteration order.

**Advantages:**

- Iterates in insertion (or access) order
- Still O(1) average operations

**Disadvantages:**

- Slightly more memory than `HashMap`

**When to use:** When order matters, e.g. ordered config, or building an LRU cache (access-order mode).

---

### TreeMap

**Definition:** A `Map` backed by a red-black tree. Keys are kept **sorted**.

**Goal:** Ordered keys and range queries.

**Advantages:**

- Iterates in sorted key order
- Range views: `subMap`, `headMap`, `tailMap`
- O(log n) for `put`/`get`/`remove`

**Disadvantages:**

- Slower than `HashMap` (O(log n) vs O(1))
- Keys must be `Comparable` or a `Comparator` must be supplied
- Does not allow `null` keys

**When to use:** When keys must stay sorted, e.g. time series, ordered configs, range lookups.

**Interfaces:** `TreeMap` implements `SortedMap`, which is extended by `NavigableMap`. These add navigation methods on keys: `firstKey()`, `lastKey()`, `lowerKey(k)`, `higherKey(k)`, `floorKey(k)`, `ceilingKey(k)`, and range views `subMap(...)`, `headMap(...)`, `tailMap(...)`.

---

### HashMap vs LinkedHashMap vs TreeMap

> [!tip] Quick Comparison
> | Feature | HashMap | LinkedHashMap | TreeMap |
> |---|---|---|---|
> | Order | None | Insertion / access | Sorted by key |
> | `put`/`get`/`remove` | O(1)* | O(1)* | O(log n) |
> | `null` key | Yes (one) | Yes (one) | No |
> | Range queries | No | No | Yes |
> | Best for | Default lookups | Ordered lookups, LRU | Sorted keys |

---

### ConcurrentHashMap

**Definition:** A thread-safe `Map` designed for concurrent access.

**Goal:** Safe and fast Map for multi-threaded code.

**Advantages:**

- Thread-safe without locking the whole map — locking happens at the bucket (bin) level, so reads are usually lock-free and writes do not block the entire structure
- Much higher throughput than a fully synchronized map
- Does **not** throw `ConcurrentModificationException` during iteration

**Disadvantages:**

- Does not allow `null` keys or values
- More overhead than a plain `HashMap`

**When to use:** Whenever a map is shared between threads.

> [!info] ConcurrentHashMap vs Collections.synchronizedMap()
> `synchronizedMap()` wraps **every** method in one lock — only one thread at a time. `ConcurrentHashMap` locks per bucket, allowing many readers and writers in parallel, and does not allow `null`.

### Thread-Safe Collections

Standard collections (`ArrayList`, `HashMap`, `HashSet`) are **not** thread-safe. For concurrent access, use the dedicated classes in `java.util.concurrent`:

- `ConcurrentHashMap` — thread-safe map, locks per bucket
- `CopyOnWriteArrayList` / `CopyOnWriteArraySet` — every write copies the whole array; great for read-heavy lists that rarely change
- `ConcurrentLinkedQueue` — non-blocking, lock-free FIFO queue
- `BlockingQueue` (e.g. `LinkedBlockingQueue`, `ArrayBlockingQueue`) — blocks the caller when empty or full; used in producer-consumer patterns

**Legacy synchronized classes:** `Vector`, `Hashtable`, and `Stack` (which extends `Vector`) synchronize every method on a single lock. They predate `java.util.concurrent` and are considered legacy — coarse-grained locking makes them slow under contention. Prefer `ArrayList`/`HashMap` plus a concurrent class.

**Wrapper alternative:** `Collections.synchronizedList/set/map()` wraps any collection in a thread-safe view, but it locks the whole collection on every operation, and compound actions still need external synchronization. The dedicated concurrent collections are usually the better choice.

---

### WeakHashMap

**Definition:** A `Map` whose keys are held via **weak references**.

**Goal:** Let entries disappear automatically when the key is no longer referenced anywhere else.

**How it works:** If a key has no strong reference outside the map, the garbage collector may collect it, and the entry is removed from the map on the next cleanup.

**When to use:** Caches that should expire when the key falls out of use, or listener registries that clean themselves up.

---

### EnumMap and EnumSet

**Definition:** Specialized, extremely fast collections whose keys/elements are a single `enum` type.

**How they work:** `EnumMap` stores values in an array indexed by the enum's `ordinal()` — no hashing. `EnumSet` is backed by a bit vector (`long[]`).

**Advantages:**

- O(1) operations and very compact memory
- No hash collisions

**When to use:** Whenever the key/element type is an `enum`.

```java
enum Status { ACTIVE, INACTIVE, BANNED }
Map<Status, List<User>> usersByStatus = new EnumMap<>(Status.class);
Set<Status> activeStatuses = EnumSet.of(Status.ACTIVE, Status.INACTIVE);
```

---

## Queue and Deque

A `Queue` orders elements for processing (usually FIFO). A `Deque` (double-ended queue) supports add/remove at both ends and can act as both a queue and a stack.

---

### Queue Interface

**Definition:** A collection that processes elements in a specific order, typically first-in-first-out (FIFO).

**Goal:** Handle elements one by one in order.

Common `Queue` methods:

| Method | What it does |
|---|---|
| `offer(e)` / `add(e)` | Add to the tail |
| `poll()` | Remove and return the head, or `null` if empty |
| `peek()` | Look at the head without removing, or `null` |

```java
Queue<String> tasks = new ArrayDeque<>();
tasks.offer("login");
tasks.offer("checkout");
System.out.println(tasks.peek()); // login (not removed)
System.out.println(tasks.poll()); // login (removed)
```

> [!info] offer/poll vs add/remove
> `offer`/`poll`/`peek` return a special value (`false`, `null`) on failure. `add`/`remove`/`element` throw an exception instead. Prefer the returning versions.

---

### PriorityQueue

**Definition:** A queue where the head is always the **smallest** element according to its ordering (a min-heap by default).

**Goal:** Always retrieve the highest-priority element next.

**How it works:** Backed by a binary heap — a tree where every parent is smaller than its children. `offer()` inserts and sifts up (O(log n)); `poll()` removes the root and sifts down (O(log n)); `peek()` reads the root (O(1)).

**Advantages:**

- O(log n) insert and removal
- Always gives the next priority element in O(1)

**Disadvantages:**

- Does not order the whole queue — only the root is guaranteed to be the min
- Iterator order is not sorted

**When to use:** Task schedulers, "top K" problems, algorithms like Dijkstra.

---

### Deque Interface

**Definition:** A double-ended queue — supports insertion and removal at both the head and the tail.

**Goal:** A single structure usable as a queue (FIFO — First-In-First-Out) **or** a stack (LIFO — Last-In-First-Out).

Common `Deque` methods: `addFirst`/`addLast`, `removeFirst`/`removeLast`, `peekFirst`/`peekLast`, plus `push`/`pop` for stack usage.

---

### ArrayDeque

**Definition:** A `Deque` backed by a resizable **circular array**.

**Goal:** The fast, general-purpose queue and stack.

**Advantages:**

- O(1) amortized operations at both ends
- No per-element node objects — less memory than `LinkedList`
- Faster than `LinkedList` for queue/stack work

**Disadvantages:**

- Slow insert/remove in the middle (not what it is designed for)

**When to use:** Whenever you need a stack or a queue.

> [!danger] Do not use the legacy Stack class
> `Stack` extends `Vector` (synchronized, slow) and breaks LSP — it "is a" `Vector`, so `List` methods like `get(index)` leak into a stack. Use `ArrayDeque` with `push()`/`pop()` for LIFO, or `offer()`/`poll()` for FIFO.

```java
// Stack (LIFO):
Deque<String> stack = new ArrayDeque<>();
stack.push("a"); stack.pop();

// Queue (FIFO):
Queue<String> queue = new ArrayDeque<>();
queue.offer("a"); queue.poll();
```

> [!info] ArrayDeque vs LinkedList as a Deque
> `ArrayDeque` is essentially always preferred: it is faster and uses less memory (a circular array vs a node object per element). Use `LinkedList` only if you need list-style indexed access in the middle, which a `Deque` does not offer.

---

## Immutable and Unmodifiable Collections

Java offers several ways to get a collection that cannot change. They are not all the same.

**1. `List.of(...)` / `Set.of(...)` / `Map.of(...)` (Java 9+)**

Return **fully immutable** collections. Any `add`, `remove`, or `set` throws `UnsupportedOperationException`. They also reject `null` elements.

**2. `Collections.unmodifiableList(list)` (and friends)**

Wraps an **existing** collection in a read-only view. The original is still mutable, and changes to it **are visible** through the view.

**3. `List.copyOf(list)` / `Set.copyOf()` / `Map.copyOf()` (Java 10+)**

Create an **immutable copy** — a true snapshot that no longer reflects the source.

```java
List<String> mutable = new ArrayList<>();
mutable.add("a");
List<String> unmod = Collections.unmodifiableList(mutable);
mutable.add("b");          // unmod now also sees "b"!

List<String> copy = List.copyOf(mutable); // snapshot, does not change later
```

> [!tip] Arrays.asList() vs List.of() vs new ArrayList()
> `new ArrayList<>()` is fully mutable. `Arrays.asList()` is **fixed-size** and **backed by the array**: `set()` works, but `add`/`remove` throw `UnsupportedOperationException`, and changes in the array reflect in the list. `List.of()` is fully **immutable** and rejects `null`.

---

## Utility Classes

The `Arrays` and `Collections` classes provide static helper methods. These operate on arrays and collections from the outside — they are not instance methods.

---

### Arrays Utility

Helper methods for arrays.

| Call | What it does |
|---|---|
| `Arrays.sort(arr)` | Sort an array in place |
| `Arrays.sort(arr, from, to)` | Sort a range `from..to-1` |
| `Arrays.sort(arr, comparator)` | Sort with custom `Comparator` |
| `Arrays.toString(arr)` | Readable string representation |
| `Arrays.deepToString(arr)` | String for multi-dimensional arrays |
| `Arrays.equals(a, b)` | Element-by-element equality |
| `Arrays.deepEquals(a, b)` | Equality for nested arrays |
| `Arrays.fill(arr, val)` | Fill entire array with a value |
| `Arrays.fill(arr, from, to, val)` | Fill a range |
| `Arrays.copyOf(arr, newLength)` | Copy with truncate or padding |
| `Arrays.copyOfRange(arr, from, to)` | Copy a range |
| `Arrays.setAll(arr, generator)` | Fill with index-based generator |
| `Arrays.stream(arr)` | Convert to `Stream` |
| `Arrays.binarySearch(arr, key)` | Binary search, returns index or negative |
| `Arrays.mismatch(a, b)` | First index where arrays differ, or `-1` |
| `Arrays.asList(...)` | Fixed-size list backed by the array |
| `Arrays.hashCode(arr)` | Hash code based on content |

```java
int[] nums = {3, 1, 2};
Arrays.sort(nums);
System.out.println(Arrays.toString(nums)); // [1, 2, 3]
```

---

### Collections Utility

Helper methods for collections.

| Call | What it does |
|---|---|
| `Collections.sort(list)` | Sort a list in place |
| `Collections.reverse(list)` | Reverse order |
| `Collections.shuffle(list)` | Random shuffle |
| `Collections.max(list)` / `min(list)` | Largest / smallest element |
| `Collections.max(list, comp)` / `min(list, comp)` | With custom comparator |
| `Collections.frequency(list, o)` | Count occurrences |
| `Collections.addAll(c, elements...)` | Add multiple elements at once |
| `Collections.disjoint(a, b)` | `true` if no common elements |
| `Collections.rotate(list, k)` | Rotate by `k` positions |
| `Collections.swap(list, i, j)` | Swap two elements by index |
| `Collections.binarySearch(list, key)` | Binary search on a sorted list |
| `Collections.binarySearch(list, key, comp)` | With custom comparator |
| `Collections.unmodifiableList(list)` | Read-only view |
| `Collections.synchronizedList(list)` | Thread-safe wrapper |
| `Collections.singletonList(o)` | Immutable single-element list |
| `Collections.emptyMap()` / `emptySet()` / `emptyList()` | Immutable empty collections |
| `Collections.nCopies(n, o)` | Immutable list of `n` copies |
| `Collections.fill(list, o)` | Replace all elements with `o` |
| `Collections.reverseOrder()` | Comparator for reverse sort |

```java
List<Integer> scores = new ArrayList<>(List.of(30, 10, 20));
Collections.sort(scores);
Collections.reverse(scores);
System.out.println(scores); // [30, 20, 10]
```

> [!info] Collection vs Collections
> `Collection` is the root **interface** of the framework (`List`, `Set`, `Queue`). `Collections` (plural) is a **utility class** with static helpers like `sort`, `reverse`, `max`, `unmodifiableList`.

---

## Big O Notation

Time complexity of common operations. `*` = amortized average case.

### List Implementations

| Operation | ArrayList | LinkedList |
|---|---|---|
| `add(e)` (end) | O(1)* | O(1) |
| `add(i, e)` (middle) | O(n) | O(n) |
| `get(i)` | O(1) | O(n) |
| `remove(i)` | O(n) | O(n) |
| `contains(o)` | O(n) | O(n) |
| `size()` | O(1) | O(1) |

> [!caution] ArrayList add complexity
> `ArrayList.add(e)` is O(1) on average because most appends go to the end of the backing array. When the array is full, it must grow (allocate new array + copy), which is O(n) — but amortized over many calls it is O(1). `LinkedList.add(e)` is always O(1) because it just links a new node.

### Set Implementations

| Operation | HashSet | TreeSet | LinkedHashSet |
|---|---|---|---|
| `add(o)` | O(1)* | O(log n) | O(1)* |
| `remove(o)` | O(1)* | O(log n) | O(1)* |
| `contains(o)` | O(1)* | O(log n) | O(1)* |
| `size()` | O(1) | O(1) | O(1) |

> [!warning] HashSet worst case
> `HashSet` is O(1) on average. In the worst case (many hash collisions), Java 8+ converts bucket chains to balanced trees at depth 8, giving O(log n). A broken `hashCode()` that returns the same value for all elements degrades to O(log n), not O(n).

### Map Implementations

| Operation | HashMap | TreeMap | LinkedHashMap |
|---|---|---|---|
| `put(k, v)` | O(1)* | O(log n) | O(1)* |
| `get(k)` | O(1)* | O(log n) | O(1)* |
| `remove(k)` | O(1)* | O(log n) | O(1)* |
| `containsKey(k)` | O(1)* | O(log n) | O(1)* |
| `containsValue(v)` | O(n) | O(n) | O(n) |
| `size()` | O(1) | O(1) | O(1) |

> [!tip] When to choose which Map
> - `HashMap` — default choice, fastest average operations, no order guarantee
> - `LinkedHashMap` — when you need insertion order or access-order (LRU cache)
> - `TreeMap` — when you need sorted keys or range queries (`subMap`, `headMap`, `tailMap`)

### Deque (ArrayDeque / LinkedList as Deque)

| Operation | ArrayDeque | LinkedList |
|---|---|---|
| `addFirst(e)` / `addLast(e)` | O(1)* | O(1) |
| `removeFirst()` / `removeLast()` | O(1)* | O(1) |
| `peekFirst()` / `peekLast()` | O(1) | O(1) |
| `size()` | O(1) | O(1) |

---

## Iteration and Common Operations

You often need to loop through arrays and collections.

### For Loop

Good when you need the index.

```java
String[] names = {"Ann", "Bob", "Kate"};
for (int i = 0; i < names.length; i++) {
    System.out.println(i + ": " + names[i]);
}
```

### Enhanced for

Good when you only need values.

```java
List<String> cities = List.of("Minsk", "Warsaw", "Berlin");
for (String city : cities) {
    System.out.println(city);
}
```

### Iterator and ListIterator

An **`Iterator`** steps through a collection one element at a time. Every `Collection` provides an `iterator()` method.

| Method | What it does |
|---|---|
| `hasNext()` | `true` if there are more elements |
| `next()` | Returns the next element |
| `remove()` | Removes the last element returned by `next()` (optional) |

```java
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    String s = it.next();
    if (s.isEmpty()) it.remove(); // safe removal during iteration
}
```

A **`ListIterator`** extends `Iterator` and is available only on `List`s. It moves in both directions and can modify the list:

| Method | What it does |
|---|---|
| `hasPrevious()` / `previous()` | Move backwards |
| `nextIndex()` / `previousIndex()` | Current index |
| `add(e)` / `set(e)` | Insert / replace the last element returned |

> [!info] Iterator vs ListIterator
> `Iterator` goes forward only and works on any `Collection`. `ListIterator` goes both directions, supports `add`/`set`, and is available only on `List`s.

### A Realistic Example

Collect test results, then process them.

```java
List<String> results = new ArrayList<>(List.of("pass", "fail", "pass", "skip", "fail"));

results.set(0, "PASS");                       // replace by index
results.removeIf(r -> r.equals("skip"));      // safe removal by condition

System.out.println(results.indexOf("fail"));  // 1
System.out.println(results.contains("PASS")); // true

Map<String, Integer> stats = new HashMap<>();
for (String r : results) {
    stats.merge(r, 1, Integer::sum);
}
System.out.println(stats); // {PASS=1, fail=2, pass=1}
```

> [!danger] ConcurrentModificationException
> Do not remove elements from a collection inside an enhanced `for` using `list.remove()`. The iterator tracks a `modCount` and checks it on each `next()` — if the collection was structurally changed, it throws `ConcurrentModificationException` (fail-fast). Use `Iterator.remove()`, `removeIf()`, or collect items to remove into a new list.

```java
// Safe: removeIf
list.removeIf(s -> s.length() < 3);

// Safe: Iterator
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    if (it.next().length() < 3) it.remove();
}
```

---

## Arrays and Collections in AQA

In test automation, arrays and collections are everywhere.

### Typical Examples

```java
List<String> browsers = List.of("chrome", "firefox", "edge");
Map<String, String> headers = Map.of(
    "Content-Type", "application/json",
    "Authorization", "Bearer token"
);
Set<String> uniqueUserIds = new HashSet<>();
```

### Where You Use Them

- `List<WebElement>` from Selenium: many elements on a page
- `Map<String, Object>` for API payloads or parsed JSON
- `Set<String>` to check uniqueness of IDs, links, or values
- Arrays in method parameters like `String[] args`

### Common Mistakes

- Using an array when size changes often
- Using `HashMap` and expecting a stable order
- Forgetting that `Set` removes duplicates
- Accessing a wrong index and getting `ArrayIndexOutOfBoundsException`
- Calling `get()` on an empty list

> [!info] A Good Rule for AQA
> If you need an ordered, flexible group of items, start with `ArrayList`. If you need uniqueness, use `HashSet`. If you need key-value data, use `HashMap`.

> [!tip] Choose a collection by task
> | Task | Best choice |
> |---|---|
> | Ordered, flexible list | `ArrayList` |
> | Unique elements | `HashSet` |
> | Unique elements, keep insertion order | `LinkedHashSet` |
> | Lookup a value by key | `HashMap` |
> | Key-value, keep insertion order / LRU | `LinkedHashMap` |
> | Sorted unique elements | `TreeSet` |
> | Sorted keys | `TreeMap` |
> | Stack (LIFO) | `ArrayDeque` |
> | Queue (FIFO) | `ArrayDeque` |
> | Next-priority element first | `PriorityQueue` |
> | Thread-safe map | `ConcurrentHashMap` |

---

## Interview Questions

### Beginner Questions

**1. What is the difference between an array and a collection?**
An array has fixed size and can store primitives or objects. A collection is flexible in size and provides ready-made methods such as `add()`, `remove()`, and `contains()`. Collections store objects, not primitives.

**2. What is the difference between `List` and `Set`?**
`List` keeps order and allows duplicates. `Set` stores only unique elements and usually does not guarantee order unless you use a special implementation.

**3. What is the difference between `ArrayList` and `LinkedList`?**
`ArrayList` is better for reading by index and is usually faster for general use. `LinkedList` is better for frequent insertions/removals at the ends, but slower for random access.

**4. Can a collection store primitive types?**
No. Collections work with objects. Use wrapper classes like `Integer`, `Double`, and `Boolean`.

**5. What is the difference between `HashMap` and `HashSet`?**
`HashMap` stores key-value pairs. `HashSet` stores only unique values. Internally, `HashSet` is built on top of a `HashMap` (each element is a key with a shared dummy value).

**6. What happens if you access an invalid array index?**
Java throws `ArrayIndexOutOfBoundsException`.

**7. What is the difference between `size()` and `length`?**
Arrays use the field `length`. Collections use the method `size()`.

**8. Does `HashMap` keep insertion order?**
No. If you need insertion order, use `LinkedHashMap`.

**9. Can `ArrayList` contain duplicates and `null`?**
Yes. `ArrayList` allows duplicates and can contain `null`.

**10. When would you use a `Map`?**
When you need to find a value by key, for example user fields, config properties, headers, or test data.

**11. What is the Java Collections Framework?**
A unified architecture of interfaces and classes for storing and manipulating groups of objects. It provides ready-made data structures (`List`, `Set`, `Queue`, `Map`) so you do not have to implement them yourself.

**12. What are the main interfaces of the Collections Framework?**
`List` (ordered, duplicates), `Set` (unique elements), `Queue` (processing order), and `Map` (key-value pairs). `List`, `Set`, and `Queue` extend `Collection`; `Map` does not.

**13. Is `Map` part of the `Collection` interface?**
No. `Map` is part of the Java Collections Framework, but it does not extend `Collection`, because it stores key-value pairs rather than single elements.

**14. What is the difference between `Collection` and `Collections`?**
`Collection` is the root interface of the hierarchy. `Collections` (plural) is a utility class with static helpers like `sort()`, `reverse()`, and `max()`.

**15. How do you declare and initialize an array?**
Several ways: `int[] a = new int[5];`, `int[] a = {1, 2, 3};`, or `int[] a = new int[]{1, 2, 3};`. The size is fixed at creation.

**16. What are the default values of array elements?**
`0` for numeric primitives, `false` for `boolean`, `'\u0000'` for `char`, and `null` for object arrays.

**17. What is the difference between `length` and `length()`?**
`length` is a field on arrays; `length()` is a method on `String`. Collections use the method `size()`.

**18. Can a collection contain `null`?**
Most can — `ArrayList`, `HashMap`, and `HashSet` allow `null`. Exceptions: `TreeSet`, `TreeMap`, `ConcurrentHashMap`, and `PriorityQueue` do not allow `null`.

**19. Can `HashMap` have a `null` key?**
Yes, exactly one. `Hashtable` and `ConcurrentHashMap` do not allow `null` keys or values.

**20. How do you convert an array to a List?**
Use `Arrays.asList(arr)` (fixed-size, backed by the array) or `new ArrayList<>(Arrays.asList(arr))` (fully mutable). For a truly immutable list, use `List.of(...)`.

**21. How do you convert a List to an array?**
Use `list.toArray(new String[0])` (typed) or `list.toArray()` (returns `Object[]`).

**22. How do you sort a List?**
Use `Collections.sort(list)` or `list.sort(comparator)`. Elements must be `Comparable`, or you pass a `Comparator`.

**23. What is the difference between `Comparable` and `Comparator`?**
`Comparable` defines the natural ordering inside the class (`compareTo`). `Comparator` is an external strategy you can pass to `sort()` for a custom order.

**24. What is the default initial capacity of `ArrayList`? Of `HashMap`?**
`ArrayList` starts empty and allocates 10 on the first `add`. `HashMap` defaults to 16 buckets with a load factor of 0.75.

**25. How does `ArrayList` grow?**
When its internal array fills, it creates a new array about 1.5× larger and copies the elements across. A single resize is O(n), amortized to O(1) per add.

**26. What is the difference between `HashSet` and `TreeSet`?**
`HashSet` is unordered, O(1) average, uses `hashCode`/`equals`. `TreeSet` keeps elements sorted, O(log n), uses `Comparable`/`Comparator`, and does not allow `null`.

**27. What is a `PriorityQueue`?**
A queue where the head is always the smallest element (a min-heap by default). `offer` and `poll` are O(log n), `peek` is O(1).

**28. Why should you avoid the `Stack` class?**
It extends `Vector` (synchronized and slow) and leaks `List` methods into a stack. Use `ArrayDeque` with `push()`/`pop()` instead.

**29. What is the difference between `ArrayDeque` and `LinkedList`?**
`ArrayDeque` is a circular array — faster and lighter, ideal for a stack or queue. `LinkedList` uses a node per element and uses more memory; prefer it only for list-style indexed access.

**30. How do you create an immutable collection?**
Use `List.of(...)`, `Set.of(...)`, or `Map.of(...)` (Java 9+, fully immutable), `Collections.unmodifiableList(list)` (a view of an existing collection), or `List.copyOf(list)` (an immutable snapshot).

**31. Why do we need `equals()` and `hashCode()`?**
Collections like `HashSet` and `HashMap` use `hashCode()` to quickly find a bucket and `equals()` to check whether the element inside the bucket matches. If you don't override them, two logically equal objects are treated as different.

**32. What is an `Iterator` and why do we need it?**
An `Iterator` walks through a collection one element at a time and is available on any `Collection`. Its main benefit is safe removal during iteration via `iterator.remove()`.

**33. What is autoboxing and unboxing?**
Autoboxing is the automatic conversion of a primitive into its wrapper class (`int` → `Integer`). Unboxing is the reverse. Collections only store objects, so when you add a primitive it is automatically boxed: `list.add(5)` turns `5` into `Integer.valueOf(5)`.

**34. How does `TreeMap` differ from `HashMap`?**
`HashMap` does not guarantee order and works in O(1) average. `TreeMap` stores keys sorted via `Comparable`/`Comparator`, works in O(log n), and does not allow `null` keys.

**35. How do you sort an array and print it?**
`Arrays.sort(arr)` sorts the array in place. `Arrays.toString(arr)` returns a readable string: `[1, 2, 3]`. For multidimensional arrays use `Arrays.deepToString(arr)`.

**36. What is the difference between `Queue` and `Deque`?**
`Queue` is a regular queue: add to the end, take from the front (FIFO). `Deque` is double-ended: you can add and remove from both ends. `Deque` can work as both a queue and a stack.

**37. Why do we need generics in collections?**
Generics (`List<String>`, `Map<Integer, String>`) specify the element type. The compiler checks types at compile time, and you don't need a cast when reading from the collection.

**38. Does `subList()` return a copy or a view?**
`subList(from, to)` returns a **view** of the original list, not a copy. Changes to the subList (including `clear()`) are reflected in the original list.

---

### Intermediate Questions

**1. Is `Map` a subtype of `Collection`?**
No. `Map` belongs to the Java Collections Framework, but it does not implement `Collection`.

**2. Why is `ArrayList` usually better than `LinkedList` in practice?**
Because many real tasks need fast reads, and the CPU cache works well with contiguous arrays. `LinkedList` has more object overhead and slower indexed access.

**3. Can a `Set` have duplicates if `equals()` and `hashCode()` are wrong?**
Yes. If a custom class has broken `equals()` and `hashCode()`, a hash-based set may store duplicates.

**4. What is the difference between `remove(int index)` and `remove(Object o)` in `List`?**
One removes by position, the other removes by value. With `List<Integer>`, this is confusing: `remove(1)` removes the element at index `1`, not the value `1`.

**5. Why can `Arrays.asList()` be dangerous?**
It returns a fixed-size list backed by the array. You can change elements with `set()`, but you cannot add or remove, or you get `UnsupportedOperationException`.

**6. What is the difference between `peek()` and `poll()` on a `Queue`?**
`peek()` returns the head without removing it; `poll()` removes and returns the head. Both return `null` if the queue is empty.

**7. What does `retainAll()` do?**
It keeps only the elements that are also present in the given collection — i.e. it computes an intersection, in place.

**8. Can you sort a `HashMap` directly?**
No — `HashMap` is unordered. To work with sorted data, use a `TreeMap` (sorted keys) or copy the `entrySet()` into a `List` and sort it.

**9. Why does `TreeSet` not allow `null`?**
Because it orders elements with `compareTo()` or a `Comparator`, and comparing `null` throws a `NullPointerException`.

**10. If you wrap a list with `Collections.unmodifiableList()`, can the original list still change?**
Yes. The wrapper is only a read-only view — the underlying list is still mutable, and any change to it is visible through the wrapper.

**11. What is the difference between `offer()` and `add()` on a `Queue`?**
`offer()` returns `false` when the element cannot be added; `add()` throws an exception in the same case.

**12. When would you choose `LinkedHashSet` over `HashSet`?**
When you need uniqueness **and** a predictable iteration order — `LinkedHashSet` keeps the insertion order, while `HashSet` does not guarantee any order.

**13. Does `PriorityQueue` iterate in sorted order?**
No. Only the head is guaranteed to be the smallest element; the rest are not fully ordered during iteration.

**14. What does `computeIfAbsent()` do?**
It returns the value for a key if it exists; otherwise it computes a value with the given function, stores it, and returns it.

**15. What is the difference between `iterator()` and `listIterator()`?**
`iterator()` is forward-only and works on any `Collection`; `listIterator()` works only on a `List`, moves in both directions, and supports `add()`/`set()`.

**16. What is the difference between an ordered and a sorted collection?**
Ordered means elements come out in a predictable sequence (e.g. insertion order); sorted means they are arranged by their value using `Comparable`/`Comparator`.

**17. What is the difference between `contains()` and `containsAll()`?**
`contains(o)` checks for a single element; `containsAll(c)` checks whether every element of collection `c` is present.

**18. Can a `HashMap` hold multiple `null` values?**
Yes — any number of values can be `null`, but there can be at most one `null` key.

**19. What is the difference between `put()` and `putIfAbsent()`?**
`put()` always overwrites the value; `putIfAbsent()` sets the value only if the key is not already present.

**20. Why doesn't `TreeMap` need `hashCode()` and `equals()` for ordering?**
Because it orders and identifies keys using `compareTo()` (or a `Comparator`), not the hashing contract.

---

### Advanced Questions

**1. How does `HashMap` work internally?**
It stores entries in an array of **buckets**, each holding a `Node<K,V>` (key, value, hash, next). On `put`, the key's `hashCode()` is mapped to a bucket. If the bucket is empty, the node is placed there; otherwise keys are compared with `equals()` — a match overwrites the value, a miss chains a new node (a collision). Since Java 8, a bucket with more than 8 entries becomes a balanced red-black tree, improving worst-case lookup from O(n) to O(log n). `get` works the same way: hash → bucket → search with `equals()`.

**2. What are capacity and load factor in `HashMap`?**
Capacity is the number of buckets (default 16). The load factor (default 0.75) is the fill threshold: when `size > capacity × loadFactor`, the map doubles capacity and rehashes all entries. Setting an initial capacity avoids repeated resizing for large maps.

**3. Why must `equals()` and `hashCode()` agree?**
Hash-based collections find the bucket via `hashCode()`, then compare with `equals()`. If two "equal" objects return different hash codes, they land in different buckets and the collection treats them as distinct — you get duplicates or failed lookups. The contract: equal objects must have equal hash codes.

**4. How does `HashSet` store elements?**
It is backed by a `HashMap`: each element is stored as a **key**, and all entries share a single dummy object as the **value**. So `HashSet` behavior (hashing, load factor, no order) follows directly from `HashMap`.

**5. What happens if a `HashMap` key's hash code changes after insertion?**
The entry stays in its original bucket, but lookups compute the new hash and search a different bucket — so you can no longer find it. Never use mutable objects as keys; prefer immutable keys like `String` or `Integer`.

**6. `HashMap` vs `LinkedHashMap` vs `TreeMap`?**
`HashMap` — no order, O(1) average ops. `LinkedHashMap` — keeps insertion (or access) order via a linked list, O(1) average. `TreeMap` — keeps keys sorted, O(log n) ops, backed by a red-black tree.

**7. `HashSet` vs `TreeSet`?**
`HashSet` — O(1) add/remove/contains, no order, needs a correct `hashCode()`. `TreeSet` — O(log n), keeps elements sorted (via `Comparable`/`Comparator`), does not allow `null`, ignores `hashCode`/`equals` for uniqueness. Use `HashSet` for pure uniqueness and speed; use `TreeSet` when you need a sorted set or range queries.

**8. `HashMap` vs `ConcurrentHashMap`?**
`HashMap` is not synchronized and not thread-safe. `ConcurrentHashMap` is thread-safe: it locks at the bucket level (not the whole map), allows concurrent reads without locking, and does not throw `ConcurrentModificationException` during iteration. It does not allow `null` keys or values.

**9. Why avoid `Stack`? What should you use instead?**
`Stack` is a legacy class that extends `Vector` (synchronized but slow) and breaks LSP — since it "is a" `Vector`, you can call `List` methods like `get(index)` on it. Use `ArrayDeque` with `push()`/`pop()` instead: it is faster, lighter, and designed for LIFO.

**10. `ArrayDeque` vs `LinkedList` as a `Deque`?**
`ArrayDeque` is a circular array — faster and lighter, with no node object per element. `LinkedList` uses a node per element (prev + next + value), so it uses two to three times the memory. Prefer `ArrayDeque` unless you need indexed access in the middle, which a `Deque` does not offer.

**11. How does `PriorityQueue` work?**
It is backed by a min-heap (a binary tree where each parent is smaller than its children). `offer()`/`add()` insert and sift up (O(log n)); `poll()` removes the root and sifts down (O(log n)); `peek()` reads the root (O(1)). Only the root is guaranteed to be the minimum — the rest are not fully ordered. Used for schedulers, "top K", Dijkstra.

**12. What is the difference between `Comparable` and `Comparator`?**
`Comparable` defines the natural ordering **inside** the class (`compareTo(T o)`) — one default order. `Comparator` is an external strategy (`compare(a, b)`) — you can have many for the same class, passed to `sort()` or `TreeSet`.

**13. What is a fail-fast iterator, and how does `ConcurrentModificationException` happen?**
Most collections (`ArrayList`, `HashMap`) keep a `modCount`. Their iterators snapshot it and check it on each `next()`. If the collection is structurally modified during iteration (e.g. `list.remove()` inside a for-each), `modCount` no longer matches and the iterator throws `ConcurrentModificationException`. Use `Iterator.remove()` or `removeIf()` instead. This is best-effort detection, not a guarantee.

**14. Fail-fast vs fail-safe iterators?**
Fail-fast (standard collections) throw on concurrent modification. Fail-safe iterators (`CopyOnWriteArrayList`, `ConcurrentHashMap`) iterate over a snapshot or tolerate changes, so they never throw — but may not reflect the latest state.

**15. How do you remove elements from a collection during iteration?**
Three safe ways: (1) `Iterator.remove()` — removes the current element; (2) `Collection.removeIf(predicate)` — concise Java 8+; (3) collect items to remove into a separate list and call `removeAll()` afterwards. Calling `list.remove()` inside an enhanced for is wrong and throws `ConcurrentModificationException`.

**16. What is the difference between `Arrays.asList()`, `List.of()`, and `new ArrayList<>()`?**
`new ArrayList<>()` is fully mutable. `Arrays.asList()` is fixed-size and backed by the array — `set()` works, but `add`/`remove` throw `UnsupportedOperationException`, and it allows `null`. `List.of()` is fully **immutable** — any modification throws, and it rejects `null`.

**17. How do you create an immutable collection?**
`List.of(...)` / `Set.of(...)` / `Map.of(...)` (Java 9+) are immutable and null-hostile. `Collections.unmodifiableList(list)` wraps an existing collection — the original can still change and the view reflects it. `List.copyOf(list)` (Java 10+) makes a true immutable snapshot.

**18. Difference between `Collection` and `Collections`?**
`Collection` is the root **interface** of the hierarchy (`List`, `Set`, `Queue`). `Collections` is a **utility class** with static methods: `sort()`, `reverse()`, `max()`, `frequency()`, `unmodifiableList()`, `synchronizedList()`, etc.

**19. How does `ArrayList` grow internally?**
With the default constructor the internal array starts empty. The first `add()` allocates `DEFAULT_CAPACITY = 10`. When full, `grow()` creates a new array of `oldCapacity + (oldCapacity >> 1)` (about 1.5×) and copies elements via `Arrays.copyOf()`. A single resize is O(n), amortized to O(1) per add.

**20. `ArrayList` vs `LinkedList` in memory?**
`ArrayList` is one contiguous array of references — roughly 4–8 bytes per element. `LinkedList` stores a `Node` object per element (value + prev + next), so it uses several times more memory. For 1 million elements, `ArrayList` is a few MB while `LinkedList` can be tens of MB.

**21. Why prefer `ArrayList` over `LinkedList` even for inserts?**
`LinkedList` gives O(1) insertion only when you already hold the node. Inserting at an index still costs O(n) to walk there, plus per-node overhead and poor cache locality. In practice `ArrayList` usually wins even for middle inserts at realistic sizes.

**22. When would you use `WeakHashMap`? `EnumMap`/`EnumSet`?**
`WeakHashMap` holds keys via weak references, so entries vanish when the key is no longer referenced outside — useful for caches and listener registries. `EnumMap`/`EnumSet` are specialized for enum keys/elements: they use an array indexed by `ordinal()` (or a bit vector), giving O(1) operations and minimal memory.

---

### Code Questions

**1. What does this code print?**
```java
List<String> list = new ArrayList<>();
list.add("A"); list.add("B"); list.add("C");
for (String s : list) {
    if (s.equals("B")) list.remove(s);
}
System.out.println(list);
```
**Answer:** `ConcurrentModificationException`. The enhanced for uses an iterator internally, and `list.remove()` changes the collection without notifying it. Correct: `list.removeIf(s -> s.equals("B"))`.

**2. What does this code print?**
```java
Set<Short> set = new HashSet<>();
for (short i = 0; i < 10; i++) {
    set.add(i);
    set.remove(i - 1); // (int) i - 1
}
System.out.println(set.size());
```
**Answer:** 10. The bug is that `i - 1` is `int`, not `short`. `set.remove(Integer.valueOf(i-1))` looks for an `Integer`, but the set stores `Short`. Nothing is ever removed.

**3. What does this code print?**
```java
Map<String, String> map = new HashMap<>();
map.put("a", "1");
map.put("b", "2");
map.put("c", "3");
map.computeIfAbsent("a", k -> "10");
map.computeIfAbsent("d", k -> "40");
System.out.println(map.get("a") + map.get("d"));
```
**Answer:** `"140"`. `computeIfAbsent` runs only if the key is missing. `"a"` already exists — unchanged. `"d"` is missing — added as `"40"`.

**4. What does this code print?**
```java
List<Integer> list = new ArrayList<>(List.of(1, 2, 3, 4, 5));
list.subList(1, 3).clear();
System.out.println(list);
```
**Answer:** `[1, 4, 5]`. `subList()` returns a **view** of the original list, not a copy. Calling `clear()` on the sublist removes those elements from the original list.

**5. What does this code print?**
```java
Map<String, Integer> map = new HashMap<>();
map.put("x", 1);
map.put("y", 2);
map.merge("x", 10, Integer::sum);
map.merge("z", 30, Integer::sum);
System.out.println(map.get("x") + " " + map.get("z"));
```
**Answer:** `11 30`. `merge()` on an existing key applies the function (1 + 10 = 11). On a missing key it just inserts the value (30).

---

## Practical Tasks

Tasks are ordered by the lecture sequence: Arrays → ArrayList → Set → Map → Queue → combo. Each task includes a solution, explanation, and complexity analysis.

> [!tip] How to practice
> Try to solve each task yourself first, then check the solution. Pay attention to the data structure choice — that is half the answer in an interview.

---

### 1. Reverse Array — reverse an array in place

**Task:** Given an integer array, reverse it **in place** without using another array.

```java
public void reverse(int[] arr) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int tmp = arr[left];
        arr[left] = arr[right];
        arr[right] = tmp;
        left++;
        right--;
    }
}
```

**Explanation:** Two-pointer technique. One starts at the beginning, one at the end — swap and move towards the center.

| Metric | Value |
|---|---|
| Complexity | O(n) time, O(1) memory |
| Key technique | Two pointers (left/right) |

---

### 2. Find Missing Number — find the missing number

**Task:** Given an array of `n` numbers in the range `[0, n]`, one number is missing. Find it.

```java
// Solution 1 — using HashSet (for collections understanding):
public int missingNumberSet(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int n : nums) set.add(n);
    for (int i = 0; i <= nums.length; i++) {
        if (!set.contains(i)) return i;
    }
    return -1;
}

// Solution 2 — math (O(1) memory):
public int missingNumberMath(int[] nums) {
    int n = nums.length;
    int expected = n * (n + 1) / 2;
    int sum = 0;
    for (int num : nums) sum += num;
    return expected - sum;
}
```

**Explanation:** HashSet gives O(1) membership checks — straightforward. The math version uses the arithmetic series sum formula and is lighter on memory.

| Metric | Value |
|---|---|
| Complexity | O(n) time, O(n) or O(1) memory |
| Key structure | `HashSet<Integer>` or math sum |

---

### 3. Remove Duplicates from ArrayList

**Task:** Given an `ArrayList<String>` with duplicates, return a new list of unique values while keeping the first occurrence order.

```java
public List<String> removeDuplicates(List<String> input) {
    Set<String> seen = new LinkedHashSet<>(input); // keeps order
    return new ArrayList<>(seen);
}

// Manual version (shows the logic):
public List<String> removeDuplicatesManual(List<String> input) {
    Set<String> seen = new HashSet<>();
    List<String> result = new ArrayList<>();
    for (String s : input) {
        if (seen.add(s)) {          // add() returns false if already present
            result.add(s);
        }
    }
    return result;
}
```

**Explanation:** `LinkedHashSet` is the best of both worlds: HashSet uniqueness + ArrayList order. The manual version shows the underlying mechanism.

| Metric | Value |
|---|---|
| Complexity | O(n) time, O(n) memory |
| Key structures | `LinkedHashSet<T>`, `HashSet<T>` + `ArrayList<T>` |

---

### 4. Merge Two Sorted Lists

**Task:** Given two sorted `List<Integer>`, return a new sorted list that contains all elements from both.

```java
public List<Integer> mergeSorted(List<Integer> a, List<Integer> b) {
    List<Integer> result = new ArrayList<>(a.size() + b.size());
    int i = 0, j = 0;

    while (i < a.size() && j < b.size()) {
        result.add(a.get(i) <= b.get(j) ? a.get(i++) : b.get(j++));
    }
    while (i < a.size()) result.add(a.get(i++));
    while (j < b.size()) result.add(b.get(j++));

    return result;
}
```

**Explanation:** Two-pointer technique on ArrayLists. Take the smaller element, advance its pointer. When one list is exhausted, append the rest of the other. `get(i)` on ArrayList is O(1).

| Metric | Value |
|---|---|
| Complexity | O(a + b) time, O(a + b) memory |
| Key structures | `ArrayList<Integer>` + two pointers |

---

### 5. Rotate List — shift an ArrayList by k positions

**Task:** Given an `ArrayList<Integer>` and a number `k`, shift all elements right by `k` positions. The last k elements become the first.

```java
public void rotate(List<Integer> list, int k) {
    int n = list.size();
    if (n == 0) return;
    k = k % n;             // handle k > size
    if (k == 0) return;

    Collections.reverse(list);                     // [7,6,5,4,3,2,1] for n=7,k=3
    Collections.reverse(list.subList(0, k));       // first k
    Collections.reverse(list.subList(k, n));       // the rest
    // Result: [5,6,7,1,2,3,4]
}
```

**Explanation:** Triple reverse — an elegant trick commonly asked in interviews. Works in O(n) time and in-place. `Collections.reverse()` + `subList()` is a powerful combination.

| Metric | Value |
|---|---|
| Complexity | O(n) time, O(1) memory |
| Key methods | `Collections.reverse()`, `List.subList()` |

---

### 6. Find Middle — find the middle element

**Task:** Given a `List<Integer>`, return the middle element. For even size, return the left of the two central elements.

```java
// Simple way (ArrayList only):
public int findMiddleSimple(List<Integer> list) {
    return list.get((list.size() - 1) / 2);
}

// Universal way (two-pointer, works with LinkedList too):
public int findMiddleTwoPointer(List<Integer> list) {
    int slow = 0, fast = 0;
    while (fast < list.size() - 1) {
        slow++;
        fast += 2;
    }
    return list.get(slow);
}
```

**Explanation:** `get(index)` on ArrayList is O(1) — trivial solution. But the two-pointer technique (fast/slow) is essential: it works for singly linked lists where there is no fast index access.

| Metric | Value |
|---|---|
| Complexity | O(1) / O(n) time, O(1) memory |
| Key technique | Two pointers (fast / slow) |

---

### 7. Intersection of Two Arrays

**Task:** Given two arrays, return their intersection — elements that appear in both, no duplicates.

```java
public Set<Integer> intersection(int[] a, int[] b) {
    Set<Integer> setA = new HashSet<>();
    for (int n : a) setA.add(n);

    Set<Integer> result = new HashSet<>();
    for (int n : b) {
        if (setA.contains(n)) {
            result.add(n);
        }
    }
    return result;
}

// Compact version using retainAll:
public Set<Integer> intersectionRetain(int[] a, int[] b) {
    Set<Integer> setA = Arrays.stream(a).boxed().collect(Collectors.toSet());
    Set<Integer> setB = Arrays.stream(b).boxed().collect(Collectors.toSet());
    setA.retainAll(setB);
    return setA;
}
```

**Explanation:** `retainAll()` is the set-specific method for intersection. First collect one array into a HashSet (O(1) lookups), then filter the second.

| Metric | Value |
|---|---|
| Complexity | O(a + b) time, O(min(a, b)) memory |
| Key structure | `HashSet<Integer>` + `retainAll()` |

---

### 8. Two Sum — find indexes of two numbers that add up to target

**Task:** Given an array `nums` and `target`, return the indexes of the two numbers whose sum is `target`. Exactly one solution exists.

```java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>(); // value -> index
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[0]; // not found
}
```

**Explanation:** The most famous HashMap problem. Walk through the array once. At each step, check if we have already seen the complement. O(1) map lookup makes it linear instead of quadratic brute force.

| Metric | Value |
|---|---|
| Complexity | O(n) time, O(n) memory |
| Key structure | `HashMap<Integer, Integer>` |

---

### 9. Count Character Frequency

**Task:** Given a string, return a `Map<Character, Integer>` showing how many times each character appears.

```java
public Map<Character, Integer> charFrequency(String s) {
    Map<Character, Integer> freq = new HashMap<>();
    for (char c : s.toCharArray()) {
        freq.merge(c, 1, Integer::sum);
    }
    return freq;
}

// Clearer version (for beginners):
public Map<Character, Integer> charFrequencyClassic(String s) {
    Map<Character, Integer> freq = new HashMap<>();
    for (char c : s.toCharArray()) {
        if (freq.containsKey(c)) {
            freq.put(c, freq.get(c) + 1);
        } else {
            freq.put(c, 1);
        }
    }
    return freq;
}
```

**Explanation:** `merge(c, 1, Integer::sum)` replaces a whole if-else block. If the key is missing → insert 1. If it exists → add to the current value.

| Metric | Value |
|---|---|
| Complexity | O(n) time, O(n) memory |
| Key structure | `HashMap<Character, Integer>` + `merge()` |

---

### 10. Most Frequent Element

**Task:** Given an integer array, return the element that appears most often. If there is a tie, return any.

```java
public int mostFrequent(int[] nums) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : nums) {
        freq.merge(n, 1, Integer::sum);
    }
    return Collections.max(freq.entrySet(), Map.Entry.comparingByValue()).getKey();
}
```

**Explanation:** Two steps: count with HashMap, find max with `Collections.max()` using a value comparator. For production use PriorityQueue on large data, but this concise version is fine for interviews.

| Metric | Value |
|---|---|
| Complexity | O(n) time, O(n) memory |
| Key structures | `HashMap<Integer, Integer>` + `Collections.max()` |

---

### 11. Valid Parentheses

**Task:** Given a string of brackets `(){}[]`, determine whether they are correctly opened, closed, and nested.

```java
public boolean isValid(String s) {
    Map<Character, Character> pairs = Map.of(')', '(', '}', '{', ']', '[');
    Deque<Character> stack = new ArrayDeque<>();

    for (char c : s.toCharArray()) {
        if (pairs.containsValue(c)) {           // opening bracket
            stack.push(c);
        } else {                                  // closing bracket
            if (stack.isEmpty() || stack.pop() != pairs.get(c)) {
                return false;
            }
        }
    }
    return stack.isEmpty();
}
```

**Explanation:** `Deque` with `ArrayDeque` is the modern replacement for the legacy `Stack` class. Push opening brackets, check the top on closing brackets. Mismatch or empty stack = error.

| Metric | Value |
|---|---|
| Complexity | O(n) time, O(n) memory |
| Key structure | `Deque<Character>` (`ArrayDeque`) |

---

### 12. Top K Frequent Elements

**Task:** Given an integer array and `k`, return the `k` most frequent elements.

```java
public List<Integer> topKFrequent(int[] nums, int k) {
    // 1. Count frequency
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : nums) freq.merge(n, 1, Integer::sum);

    // 2. Sort by frequency descending
    List<Map.Entry<Integer, Integer>> entries = new ArrayList<>(freq.entrySet());
    entries.sort((a, b) -> b.getValue() - a.getValue());

    // 3. First k elements
    List<Integer> result = new ArrayList<>();
    for (int i = 0; i < k && i < entries.size(); i++) {
        result.add(entries.get(i).getKey());
    }
    return result;
}
```

**Explanation:** Combination of all three structures: HashMap for counting, ArrayList for sorting entrySet by value. In production use PriorityQueue (O(n log k) vs O(n log n)), but this version is more readable for interviews.

| Metric | Value |
|---|---|
| Complexity | O(n log n) time, O(n) memory |
| Key structures | `HashMap` → `ArrayList<Entry>` → sort |

---

> [!tip] What to remember for interviews
> - **HashMap** — for "find it fast" and "count it"
> - **HashSet** — for uniqueness and intersections
> - **ArrayList** — default choice, get() is O(1)
> - **Deque/ArrayDeque** — for stack and queue (parentheses, palindromes)
> - **Two pointers** — a technique for arrays and lists (reverse, merge, find middle)
> - **Always state O(...)** after your solution — it shows depth
