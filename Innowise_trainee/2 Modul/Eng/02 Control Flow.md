# Control Flow

## Table of Contents

- [[#if-else]]
- [[#switch]]
- [[#Ternary Operator]]
- [[#for Loop]]
- [[#while and do-while Loops]]
- [[#break and continue]]
- [[#Looping Through Arrays]]

**Related notes:** [[AQA Java eng]]

> [!info] Video Course (Zaur Tregulov)
> Course 1 (OCA): L12 if/else & ternary, L13 switch, L14 for & break/continue, L15 while & do-while.

---

## if-else

The `if` statement executes a block only if a condition is `true`.

```java
int age = 18;
if (age >= 18) {
    System.out.println("You can vote");
}
```

### if-else

```java
int temperature = 30;
if (temperature > 25) {
    System.out.println("It's hot outside");
} else {
    System.out.println("It's not too hot");
}
```

### if-else if-else

```java
int score = 85;
if (score >= 90) {
    System.out.println("Grade: A");
} else if (score >= 75) {
    System.out.println("Grade: B");
} else if (score >= 60) {
    System.out.println("Grade: C");
} else {
    System.out.println("Grade: F");
}
```

> [!tip] Braces Convention
> Always use curly braces `{}` even for single-line blocks.

### Nested if

```java
int age = 20;
boolean hasID = true;

if (age >= 18) {
    if (hasID) {
        System.out.println("Welcome");
    } else {
        System.out.println("Need ID");
    }
} else {
    System.out.println("Too young");
}
```

---

## switch

`switch` is cleaner than a long `if-else if` chain when comparing one variable against many values.

```java
int day = 3;
String dayName;

switch (day) {
    case 1: dayName = "Monday"; break;
    case 2: dayName = "Tuesday"; break;
    case 3: dayName = "Wednesday"; break;
    case 4: dayName = "Thursday"; break;
    case 5: dayName = "Friday"; break;
    case 6:
    case 7: dayName = "Weekend"; break;
    default: dayName = "Invalid day";
}
```

> [!warning] break is mandatory
> Without `break`, execution "falls through" to the next case.

### Enhanced switch (Java 14+)

```java
String dayType = switch (day) {
    case 1, 2, 3, 4, 5 -> "Weekday";
    case 6, 7 -> "Weekend";
    default -> "Invalid";
};
```

---

## Ternary Operator

```java
// Syntax: condition ? value_if_true : value_if_false
int age = 20;
String status = (age >= 18) ? "Adult" : "Minor";

int x = 10, y = 20;
int max = (x > y) ? x : y;     // max = 20
```

> [!caution] Readability
> Nested ternary operators are hard to read. Use if-else for complex conditions.

---

## for Loop

Use `for` when you know how many times to repeat.

```java
for (int i = 0; i < 5; i++) {
    System.out.println("Count: " + i);
}
```

**How it works:** 1) initialization 2) condition check 3) body 4) update → repeat from step 2.

### Common patterns

```java
// Count down
for (int i = 5; i > 0; i--) { }

// Step by 2
for (int i = 0; i <= 10; i += 2) { }

// Multiple variables
for (int i = 0, j = 10; i < j; i++, j--) { }
```

### For-each (enhanced for)

Use when you don't need the index.

```java
int[] numbers = {10, 20, 30, 40};
for (int num : numbers) {
    System.out.println(num);
}

String[] names = {"Alice", "Bob", "Charlie"};
for (String name : names) {
    System.out.println("Hello, " + name);
}
```

---

## while and do-while Loops

### while

Checks condition **before** entering. May never run.

```java
int i = 0;
while (i < 5) {
    System.out.println(i);
    i++;
}
```

### do-while

Checks condition **after**. Runs **at least once**.

```java
int i = 0;
do {
    System.out.println(i);
    i++;
} while (i < 5);
```

> [!tip] while vs do-while
> Use `while` when the loop may need to skip entirely. Use `do-while` when the body must run at least once (e.g., input validation).

---

## break and continue

### break — exits the loop immediately

```java
int[] numbers = {5, 3, 8, -1, 9};
for (int num : numbers) {
    if (num < 0) break;     // stops at -1
    System.out.println(num);
}
```

### continue — skips to next iteration

```java
for (int i = 0; i <= 10; i++) {
    if (i % 2 != 0) continue;  // skip odd
    System.out.println(i);       // 0 2 4 6 8 10
}
```

### Labeled break

```java
outer: for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (i == 1 && j == 1) break outer;  // exits BOTH loops
    }
}
```

---

## Looping Through Arrays

```java
int[] scores = {85, 90, 78, 92, 88};

// 1. For loop with index
for (int i = 0; i < scores.length; i++) {
    System.out.println("Score " + i + ": " + scores[i]);
}

// 2. For-each
for (int score : scores) {
    System.out.println("Score: " + score);
}

// 3. Calculate average
int sum = 0;
for (int score : scores) {
    sum += score;
}
double average = (double) sum / scores.length;
System.out.println("Average: " + average);
```



---

## Interview Questions

### Top 10

**1. What is the difference between `for` and `while` loops?**
Use `for` when you know the number of iterations in advance (`for (int i = 0; i < 10; i++)`). Use `while` when the number of iterations depends on a condition that may change during execution (`while (input != null)`).

**2. What is the difference between `break` and `continue`?**
`break` exits the loop immediately. `continue` skips the rest of the current iteration and goes to the next one.

**3. How does `switch` differ from `if-else`?**
`switch` is cleaner when comparing one variable against many specific values. `if-else` is better for range checks, boolean conditions, or complex logical expressions.

**4. What is fall-through in `switch`?**
Fall-through happens when a `case` block does not end with `break`. Execution continues into the next `case`, regardless of whether its value matches. This can be intentional (grouping cases) but is usually a bug.

**5. What is the enhanced `switch` (Java 14+)?**
Enhanced switch uses arrow syntax (`->`) and does not require `break`. It can be used as an expression that returns a value: `String result = switch (x) { case 1 -> "one"; default -> "other"; };`.

**6. What is the ternary operator and when should you use it?**
The ternary operator (`condition ? ifTrue : ifFalse`) is a compact `if-else` that returns a value. Use it for simple binary conditions. Avoid nesting ternary operators — it hurts readability.

**7. What is the difference between `while` and `do-while`?**
`while` checks the condition *before* the body — it may never execute. `do-while` checks the condition *after* the body — it executes at least once. Use `do-while` when the body must run at least once (e.g., input validation).

**8. How does the for-each loop work? Can you modify elements inside it?**
For-each iterates over an array or Iterable without using an index. The loop variable is a copy of the element, so reassigning it (`num = 99`) does not change the array. However, if elements are objects, you *can* modify their state through the loop variable (`user.setName("new")`). For collections, you *cannot* add or remove elements during iteration (will throw `ConcurrentModificationException`).

**9. What is an infinite loop? How do you create one intentionally?**
An infinite loop runs forever unless interrupted. `while (true) { }` or `for (;;) { }`. Used in server loops, event listeners, or waiting for external events with a break condition.

**10. What is a labeled break in Java?**
A labeled break exits a specific outer loop: `outer: for (...) { for (...) { break outer; } }`. Without a label, `break` only exits the innermost loop.

---

### Tricky Questions

**1. What is the output of this code?**
```java
for (int i = 0; i < 5; i++) {
    if (i == 3) break;
    System.out.print(i);
}
// Output: 012
```
The loop stops when `i == 3` because `break` exits the loop immediately. Only 0, 1, and 2 are printed.

**2. What is the output of this code?**
```java
for (int i = 0; i < 5; i++) {
    if (i == 3) continue;
    System.out.print(i);
}
// Output: 0124
```
`continue` skips the rest of the iteration when `i == 3`, so 3 is not printed but the loop continues with 4.

**3. What happens if you omit `break` in a `switch` statement?**
Execution falls through to the next `case`. For example, `case 1: System.out.println("one");` (no break) followed by `case 2: System.out.println("two"); break;` will print both "one" and "two" when the value is 1.

**4. Can you declare a variable inside a `for` loop and use it outside?**
No. The loop variable is scoped to the loop block. `for (int i = 0; ...) { }` — `i` is not accessible after the loop. Declare the variable before the loop if you need it later.

**5. What is the difference between `++i` and `i++` inside a for loop update?**
For standard use (`for (int i = 0; i < 5; i++)`), there is no practical difference because the update happens after each iteration, and the value is not used. The difference matters when the increment is part of an expression, e.g., `while (i++ < 5)` vs `while (++i < 5)`.

