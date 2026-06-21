# Arrays and Collections

## Table of Contents

- [[#Why This Topic Matters]]
- [[#Arrays]]
- [[#Collection Framework Overview]]
- [[#List Set Queue and Map]]
- [[#ArrayList vs LinkedList]]
- [[#Key Methods Cheat Sheet]]
- [[#Iteration and Common Operations]]
- [[#Arrays and Collections in AQA]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]
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
int[] nums = new int[3];       // [0, 0, 0]
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

Important note: `Map` is part of the framework, but it does **not** extend `Collection`.

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

---

## List Set Queue and Map

### List

A `List` keeps insertion order and allows duplicates.

```java
List<String> browsers = new ArrayList<>();
browsers.add("Chrome");
browsers.add("Firefox");
browsers.add("Chrome");

System.out.println(browsers); // [Chrome, Firefox, Chrome]
System.out.println(browsers.get(0)); // Chrome
```

Use `List` when order matters or when duplicate values are normal.

### Set

A `Set` stores only unique values.

```java
Set<String> roles = new HashSet<>();
roles.add("admin");
roles.add("user");
roles.add("admin");

System.out.println(roles); // duplicate "admin" is ignored
```

Use `Set` when you need uniqueness, for example unique IDs or visited pages.

### Queue

A `Queue` is useful when elements are processed one by one, often in FIFO order.

```java
Queue<String> tasks = new LinkedList<>();
tasks.add("open browser");
tasks.add("login");
tasks.add("logout");

System.out.println(tasks.poll()); // open browser
System.out.println(tasks.poll()); // login
```

Use `Queue` for pipelines, background tasks, or waiting lists.

### Map

A `Map` stores data as `key -> value`.

```java
Map<String, String> user = new HashMap<>();
user.put("name", "Alice");
user.put("role", "admin");

System.out.println(user.get("name")); // Alice
```

Use `Map` when you need to find a value by key, such as config values, JSON fields, or request headers.

> [!warning] Order in HashSet and HashMap
> `HashSet` and `HashMap` do not guarantee iteration order. If stable order is important, use `LinkedHashSet` or `LinkedHashMap`.

---

## ArrayList vs LinkedList

These are the two most common `List` implementations.

### ArrayList

`ArrayList` is backed by a dynamic array.

- Fast random access by index
- Usually the best default choice
- Slow insertions/removals in the middle because elements shift

### LinkedList

`LinkedList` is built from linked nodes.

- Fast insert/remove at the ends
- Slow random access by index
- Uses more memory than `ArrayList`

> [!tip] Quick Comparison
> | Structure | Best for | Weak point |
> |---|---|---|
> | `ArrayList` | Reading by index, most general tasks | Insert/remove in the middle |
> | `LinkedList` | Frequent add/remove at the ends | Slow `get(index)` |

In real projects and tests, `ArrayList` is the default choice most of the time.

---

## Key Methods Cheat Sheet

These are the methods you actually use day to day. Memorize the common ones; look up the rest.

### List and ArrayList

| Method             | What it does                                        |
| ------------------ | --------------------------------------------------- |
| `add(e)`           | Add to the end                                      |
| `add(i, e)`        | Insert at index `i`, shift the rest right           |
| `get(i)`           | Read element at index `i`                           |
| `set(i, e)`        | Replace element at index `i`, returns the old value |
| `remove(int i)`    | Remove **by index**                                 |
| `remove(Object o)` | Remove **by value** (first match)                   |
| `removeIf(pred)`   | Remove all elements matching a condition            |
| `indexOf(o)`       | First index of value, or `-1`                       |
| `contains(o)`      | `true` if the value is present                      |
| `size()`           | Number of elements                                  |
| `isEmpty()`        | `true` if size is `0`                               |
| `clear()`          | Remove everything                                   |

```java
List<String> users = new ArrayList<>(List.of("ann", "bob", "kate"));
users.set(0, "alice");          // [alice, bob, kate]
users.add(1, "dave");           // [alice, dave, bob, kate]
users.removeIf(u -> u.length() > 3); // remove "alice", "dave", "kate"
System.out.println(users.indexOf("bob")); // 0
```

### Set and HashSet

| Method | What it does |
|---|---|
| `add(e)` | Add; returns `false` if already present |
| `remove(o)` | Remove a value |
| `contains(o)` | Membership check (very fast) |
| `addAll(c)` | Union with another collection |
| `retainAll(c)` | Keep only elements also in `c` (intersection) |
| `removeAll(c)` | Remove all elements found in `c` (difference) |

```java
Set<String> a = new HashSet<>(List.of("chrome", "firefox", "edge"));
Set<String> b = new HashSet<>(List.of("firefox", "safari"));
a.retainAll(b);                 // intersection -> [firefox]
System.out.println(a.add("firefox")); // false, already there
```

### Map and HashMap

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

### Queue

| Method | What it does |
|---|---|
| `offer(e)` / `add(e)` | Add to the tail |
| `poll()` | Remove and return the head, or `null` if empty |
| `peek()` | Look at the head without removing, or `null` |

```java
Queue<String> tasks = new LinkedList<>();
tasks.offer("login");
tasks.offer("checkout");
System.out.println(tasks.peek()); // login (not removed)
System.out.println(tasks.poll()); // login (removed)
```

### Arrays and Collections Utilities

| Call | What it does |
|---|---|
| `Arrays.sort(arr)` | Sort an array in place |
| `Arrays.toString(arr)` | Readable string of an array |
| `Arrays.asList(...)` | Fixed-size list backed by the array |
| `Collections.sort(list)` | Sort a list in place |
| `Collections.reverse(list)` | Reverse order |
| `Collections.max(list)` / `min(list)` | Largest / smallest element |
| `Collections.frequency(list, o)` | How many times `o` appears |

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

### Common Operations

A more realistic example: collect test results, then process them.

```java
List<String> results = new ArrayList<>(List.of("pass", "fail", "pass", "skip", "fail"));

// Replace by index
results.set(0, "PASS");

// Remove by condition (safe, no ConcurrentModificationException)
results.removeIf(r -> r.equals("skip"));

// Search
System.out.println(results.indexOf("fail")); // 1
System.out.println(results.contains("PASS")); // true

// Count failures with a Map
Map<String, Integer> stats = new HashMap<>();
for (String r : results) {
    stats.merge(r, 1, Integer::sum);
}
System.out.println(stats); // {PASS=1, fail=2, pass=1}
```

### Arrays Utility Class

The `Arrays` class gives helper methods for arrays.

```java
int[] nums = {3, 1, 2};
Arrays.sort(nums);
System.out.println(Arrays.toString(nums)); // [1, 2, 3]
```

### Collections Utility Class

The `Collections` class gives helper methods for collections.

```java
List<Integer> scores = new ArrayList<>(List.of(30, 10, 20));
Collections.sort(scores);
Collections.reverse(scores);
System.out.println(scores); // [30, 20, 10]
```

> [!caution] ConcurrentModificationException
> Do not remove elements from a collection inside enhanced `for` in the usual way. This can throw `ConcurrentModificationException`. Use `Iterator`, `removeIf()`, or collect items into a new list.

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

- Using array when size changes often
- Using `HashMap` and expecting stable order
- Forgetting that `Set` removes duplicates
- Accessing wrong index and getting `ArrayIndexOutOfBoundsException`
- Calling `get()` on an empty list

> [!info] A Good Rule for AQA
> If you need an ordered, flexible group of items, start with `ArrayList`. If you need uniqueness, use `HashSet`. If you need key-value data, use `HashMap`.

---

## Interview Questions

### Top 10

**1. What is the difference between an array and a collection?**  
An array has fixed size and can store primitives or objects. A collection is flexible in size and provides ready-made methods such as `add()`, `remove()`, and `contains()`. Collections store objects, not primitives.

**2. What is the difference between `List` and `Set`?**  
`List` keeps order and allows duplicates. `Set` stores only unique elements and usually does not guarantee order unless you use a special implementation.

**3. What is the difference between `ArrayList` and `LinkedList`?**  
`ArrayList` is better for reading by index and is usually faster for general use. `LinkedList` is better for frequent insertions/removals at the ends, but slower for random access.

**4. Can a collection store primitive types?**  
No. Collections work with objects. Use wrapper classes like `Integer`, `Double`, and `Boolean`.

**5. What is the difference between `HashMap` and `HashSet`?**  
`HashMap` stores key-value pairs. `HashSet` stores only unique values. Internally, `HashSet` is built on top of a `HashMap`.

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

---

### Tricky Questions

**1. Is `Map` a subtype of `Collection`?**  
No. `Map` belongs to the Java Collections Framework, but it does not implement `Collection`.

**2. Why is `ArrayList` usually better than `LinkedList` in practice?**  
Because many real tasks need fast reads, and CPU cache works well with arrays. `LinkedList` has more object overhead and slower indexed access.

**3. Can a `Set` have duplicates if `equals()` and `hashCode()` are wrong?**  
Yes. If a custom class has broken `equals()` and `hashCode()`, a hash-based set may behave incorrectly.

**4. What is the difference between `remove(int index)` and `remove(Object o)` in `List`?**  
One removes by position, the other removes by value. With `List<Integer>`, this can be confusing: `remove(1)` removes the element at index `1`, not the value `1`.

**5. Why can `Arrays.asList()` be dangerous?**  
It returns a fixed-size list backed by the array. You can change elements, but you cannot add or remove them, or you will get `UnsupportedOperationException`.

---

### Advanced Questions

**1. How does `HashMap` work internally?**  
It stores entries in an array of **buckets**. The key's `hashCode()` is spread and mapped to a bucket index. Multiple keys in the same bucket form a chain (a linked list). Since Java 8, if one bucket grows past `8` entries (and the table is large enough), that chain is converted into a balanced tree, improving worst-case lookup from `O(n)` to `O(log n)`.

**2. What are the load factor and capacity in `HashMap`?**  
Capacity is the number of buckets (default `16`). The load factor (default `0.75`) is the fill threshold: when `size > capacity * loadFactor`, the map **resizes** (doubles capacity) and rehashes all entries. Setting a sensible initial capacity avoids repeated resizing for large maps.

**3. Why must `equals()` and `hashCode()` agree?**  
Hash-based collections find the bucket via `hashCode()`, then compare with `equals()`. If two "equal" objects return different hash codes, they land in different buckets and the set/map treats them as distinct — you get duplicates or failed lookups. The contract: equal objects must have equal hash codes.

**4. What is a fail-fast iterator, and how does `ConcurrentModificationException` happen?**  
Most collections (`ArrayList`, `HashMap`) keep a `modCount`. Their iterators snapshot it and check it on each `next()`. If the collection is structurally modified during iteration (e.g. `list.remove()` inside a for-each), `modCount` no longer matches and the iterator throws `ConcurrentModificationException`. Use `Iterator.remove()` or `removeIf()` instead. This is "best-effort" detection, not a guarantee.

**5. Fail-fast vs fail-safe iterators?**  
Fail-fast (standard collections) throw on concurrent modification. Fail-safe iterators (e.g. `CopyOnWriteArrayList`, `ConcurrentHashMap`) iterate over a snapshot or tolerate changes, so they never throw — but may not reflect the latest state.

**6. `ConcurrentHashMap` vs `Collections.synchronizedMap()`?**  
`synchronizedMap` wraps every method in a single lock — only one thread at a time, and compound operations still need external synchronization. `ConcurrentHashMap` locks only segments/bins, allowing concurrent reads and writes with much better throughput. It also does not allow `null` keys or values.

**7. What is the difference between `Arrays.asList()`, `List.of()`, and `new ArrayList<>()`?**  
`new ArrayList<>()` is fully mutable. `Arrays.asList()` is fixed-size (set allowed, add/remove not) and backed by the array. `List.of()` is fully **immutable** — any modification throws `UnsupportedOperationException`, and it rejects `null` elements.

**8. When should you use `WeakHashMap`?**  
`WeakHashMap` uses weak references for keys. If a key has no strong references outside the map, the GC can remove the key and the entry disappears automatically. This is useful for caches where entries should die when the key is no longer used externally, or for event listeners (the listener disappears from the registry when it is no longer referenced).

**9. Why should you avoid `Stack`? What should you use instead?**  
`Stack` is a legacy class that extends `Vector` (synchronized but slow). It breaks LSP — since `Stack` "is a" `Vector`, you can call `List` methods like `get(index)` or `add(index, value)` on it. Use `ArrayDeque` with `push()/pop()` instead. It is faster, lighter, and was designed for LIFO.

```java
// ❌ Legacy:
Stack<String> stack = new Stack<>();

// ✅ Correct:
Deque<String> stack = new ArrayDeque<>();
stack.push("a"); stack.pop();
```

**10. `EnumMap` and `EnumSet` — when to use them?**  
`EnumMap` and `EnumSet` are very fast (O(1)) and memory-efficient collections for enum keys. `EnumMap` stores values in an array indexed by the enum's `ordinal()` — no hash code calculation needed. `EnumSet` uses a bit mask inside `long[]`, making it extremely compact. Use them when the key is an enum and you want maximum performance.

```java
enum Status { ACTIVE, INACTIVE, BANNED }
Map<Status, List<User>> usersByStatus = new EnumMap<>(Status.class);
Set<Status> activeStatuses = EnumSet.of(Status.ACTIVE, Status.INACTIVE);
```

---

### Code Questions

**1. What does this code print?**  
```java
List<String> strings = new ArrayList<>();
List<Integer> integers = new ArrayList<>();
System.out.println(strings.getClass() == integers.getClass());
```
**Answer:** `true`. At runtime, both are `ArrayList`. The `<String>` and `<Integer>` type information is erased by type erasure.

**2. Will this code compile?**  
```java
List<? extends Number> nums = new ArrayList<Integer>();
nums.add(42);
```
**Answer:** No. `nums` is covariant — it could be `List<Integer>`, `List<Double>`, or any other subtype. The compiler cannot guarantee that `42` is the correct type for the unknown subtype of `Number`. Reading is safe — writing is not.

**3. Will this code compile?**  
```java
public void addToList(List<?> list) {
    list.add("hello");
}
```
**Answer:** No. `List<?>` means "unknown type." You can read elements as `Object`, but the only thing you can add is `null`. The compiler blocks writes to prevent breaking type safety.

**4. What does this code print?**  
```java
Set<Short> set = new HashSet<>();
for (short i = 0; i < 10; i++) {
    set.add(i);
    set.remove(i - 1); // (int) i - 1
}
System.out.println(set.size());
```
**Answer:** 10. The bug is that `i - 1` is `int`, not `short`. `set.remove(Integer.valueOf(i-1))` looks for an `Integer`, but the set stores `Short` values. Nothing is ever removed.

**5. What does this code print?**  
```java
List<Integer> list = new ArrayList<>(List.of(1, 2, 3, 4, 5));
list.subList(1, 3).clear();
System.out.println(list);
```
**Answer:** `[1, 4, 5]`. `subList()` returns a **view** of the original list, not a copy. Calling `clear()` on the sublist removes those elements from the original list.

---

### Practical Tasks

Tasks are ordered by the lecture sequence: Arrays → ArrayList → Set → Map → Queue → combo. Each task includes a solution, explanation, and complexity analysis.

> [!tip] How to practice
> Try to solve each task yourself first, then check the solution. Pay attention to the data structure choice — that is half the answer in an interview.

---

#### 1. Reverse Array — reverse an array in place

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

#### 2. Find Missing Number — find the missing number

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

#### 3. Remove Duplicates from ArrayList

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

#### 4. Merge Two Sorted Lists

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

#### 5. Rotate List — shift an ArrayList by k positions

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

#### 6. Find Middle — find the middle element

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

#### 7. Intersection of Two Arrays

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

#### 8. Two Sum — find indexes of two numbers that add up to target

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

#### 9. Count Character Frequency

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

#### 10. Most Frequent Element

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

#### 11. Valid Parentheses

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

#### 12. Top K Frequent Elements

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

**8. Why prefer `ArrayList` over `LinkedList` even for inserts?**  
`LinkedList` has `O(1)` insertion only if you already hold the node. Inserting at an index still costs `O(n)` to walk to it, plus per-node object overhead and poor CPU-cache locality. In practice `ArrayList` usually wins even for middle inserts at realistic sizes.

**9. How does `HashSet` store elements?**  
It is backed by a `HashMap`: each element is a key, and a single shared dummy object is the value. So `HashSet`'s behavior (hashing, load factor, no order) follows directly from `HashMap`.

**10. What happens to a `HashMap` if a key's hash code changes after insertion (mutable key)?**  
The entry stays in its original bucket, but lookups compute the new hash and search a different bucket — so you can no longer find the entry. Never use mutable objects as keys; prefer immutable keys like `String` or `Integer`.

**11. `HashMap` vs `TreeMap` vs `LinkedHashMap`?**  
`HashMap` — no order, `O(1)` average ops. `LinkedHashMap` — keeps insertion (or access) order via a linked list, `O(1)` average. `TreeMap` — keeps keys sorted, `O(log n)` ops, backed by a red-black tree.
