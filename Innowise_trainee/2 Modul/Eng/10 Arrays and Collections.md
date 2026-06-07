# Arrays and Collections

## Table of Contents

- [[#Why This Topic Matters]]
- [[#Arrays]]
- [[#Collection Framework Overview]]
- [[#List Set Queue and Map]]
- [[#ArrayList vs LinkedList]]
- [[#Iteration and Common Operations]]
- [[#Arrays and Collections in AQA]]
- [[#Interview Questions]]

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

```java
List<String> items = new ArrayList<>();
items.add("A");
items.add("B");
items.remove("A");
System.out.println(items.contains("B")); // true
System.out.println(items.size());        // 1
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
