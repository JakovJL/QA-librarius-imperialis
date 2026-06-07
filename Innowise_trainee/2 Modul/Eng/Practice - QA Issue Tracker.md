# Practice — QA Issue Tracker

## Table of Contents

- [[#How to Use This Project]]
- [[#Project Overview]]
- [[#Project Setup]]
- [[#Modeling a Bug with Variables]]
- [[#Triage Logic]]
- [[#The Bug Class]]
- [[#The Issue Hierarchy]]
- [[#Interfaces and Abstraction]]
- [[#Severity and Status Enums]]
- [[#The Report Formatter]]
- [[#References and Equality]]
- [[#The Generic Repository]]
- [[#Collections-Backed Repository]]
- [[#Validation and Custom Exceptions]]
- [[#Stream Queries and Optional]]
- [[#Annotations and Reflection]]
- [[#File Persistence]]
- [[#Mavenize the Project]]
- [[#Unit Tests with JUnit 5]]
- [[#Selenium UI Tests]]

**Related notes:** [[AQA Java eng]]

---

## How to Use This Project

This is **one continuous project**, not 18 separate tasks. You build a small **QA Issue Tracker** in Java, and every exercise reuses the code you wrote before. By the end you have a real Maven project with unit tests and UI tests — a portfolio piece that touches every topic of Module 2.

**Rules:**
- Work in the **same project** the whole way. Never delete previous code — extend it.
- Use the package root `com.innowise.tracker` and sub-packages (`model`, `repository`, `io`, etc.).
- Each exercise lists **Acceptance criteria** — treat them as a checklist. The task is done only when every box can be ticked.
- **Hints** point you in the right direction but never give the full solution. Struggling a little is the point.
- After each exercise, read **You now have** — it names the artifact the next exercise depends on.

> [!tip] How to study a topic before its exercise
> Read the linked theory note first (the `**Topic:**` line), then do the exercise. The exercise is the "lab" for that note.

> [!caution] Keep it compiling
> After every exercise the project must still compile and run. If something breaks, fix it before moving on — later exercises assume a working build.

---

## Project Overview

You are building a console application that stores and manages software issues (bugs, tasks, stories), the way a tiny Jira would. It grows in clear layers:

| Layer | Built in exercises | What it does |
|---|---|---|
| **Domain model** | 03–08 | `Issue` hierarchy, enums, equality, reports |
| **Repository** | 09–12 | Generic + collection-based storage, queries, exceptions |
| **Persistence** | 13–14 | Annotations, reflection, save/load to CSV |
| **Build & tests** | 15–17 | Maven project, JUnit unit tests, Selenium UI tests |

**The arc at a glance:**

```
variables → Bug class → Issue hierarchy → interfaces → enums → reports
   → generics → collections → exceptions → streams
   → annotations → file storage → Maven → JUnit → Selenium
```

Each step turns the previous "throwaway" code into something more solid: loose variables become a class, the class joins a hierarchy, the hierarchy gets stored in a repository, the repository gets persisted, and finally everything gets tested.

---

## Project Setup

**Topic:** [[00 Java Fundamentals]] · **Builds on:** nothing — this is the start

**Task:** Install the JDK (21+) and create a new IntelliJ IDEA project named `qa-tracker`. Create the base package `com.innowise.tracker` and a `Main` class inside it. In `main`, print a welcome banner such as `=== QA Issue Tracker v0.1 ===`. Store the application name and version in constants.

**Acceptance criteria:**
- [ ] `java -version` and `javac -version` both work in the terminal
- [ ] Project runs and prints the banner
- [ ] Class is `Main` in package `com.innowise.tracker`; file name matches the class
- [ ] App name is an `UPPER_SNAKE_CASE` constant; class is `PascalCase`
- [ ] No code lives in the default package

**Hints:** The entry point must be `public static void main(String[] args)`. Use `public static final String APP_NAME = "...";`. Reverse-domain package naming was covered in the topic note.

**You now have:** a running project skeleton with a correct package structure.

---

## Modeling a Bug with Variables

**Topic:** [[01 Variables Data Types Operators]] · **Builds on:** Project Setup

**Task:** Inside `main`, describe **one** bug using local variables only (no class yet): `id` (int), `title` (String), `reporter` (String), `severityLevel` (int, 1–4), `resolved` (boolean), and `createdDayOfYear` (int). Pick a "today" value and compute the bug's **age in days** with arithmetic. Compute a **priority score** = `severityLevel * 10` (use operators). Print every value and both computed numbers in a readable format.

**Acceptance criteria:**
- [ ] Correct primitive types chosen for each attribute
- [ ] Age is computed with a subtraction, priority score with multiplication
- [ ] At least one relational or logical operator is used (e.g. `severityLevel >= 3 && !resolved`)
- [ ] All values and computed results are printed clearly
- [ ] Still no class — variables only

**Hints:** Use `System.out.printf` or string concatenation for formatting. Think about which values can be negative and which cannot. Keep this list of attributes — it becomes the fields of the `Bug` class soon.

**You now have:** the full attribute list of a bug, validated by hand.

---

## Triage Logic

**Topic:** [[02 Control Flow]] · **Builds on:** Modeling a Bug with Variables

**Task:** Write triage logic that turns a `severityLevel` into a priority label. Use a `switch` on the severity (1→"Low", 2→"Medium", 3→"High", 4→"Critical", anything else→"Unknown"). Then use `if/else` to mark a bug as "Escalated" when it is `severity >= 3` **and** not resolved. Finally, loop over an `int[]` of several severities and **count** how many are High or Critical, printing the total.

**Acceptance criteria:**
- [ ] `switch` maps every valid severity and handles the invalid case
- [ ] `if/else` correctly combines severity and the `resolved` flag
- [ ] Both a `for` loop and a `while` loop appear at least once in the project
- [ ] The High/Critical counter prints the correct number
- [ ] Invalid severities do not crash the program

**Hints:** A `switch` expression (`->` arrows) is cleaner than the old `case:` style. Reuse the variables from the previous exercise as the loop's data. This logic will later move into the `Severity` enum and the triage tests.

**You now have:** working triage rules you will reuse in the enum and in unit tests.

---

## The Bug Class

**Topic:** [[03 OOP Basics]] · **Builds on:** Modeling a Bug with Variables, Triage Logic

**Task:** Turn the loose variables from exercise 01 into a real `Bug` class in `com.innowise.tracker.model`. Add a parameterized constructor and an overloaded one (constructor chaining with `this(...)`). Make fields `private` with getters/setters; the setters must validate (title not blank, severity 1–4). Override `toString()`, and override `equals()`/`hashCode()` based on `id` only. In `Main`, create several `Bug` objects and print them.

**Acceptance criteria:**
- [ ] All fields `private`; access only via getters/setters
- [ ] Setter rejects a blank title and an out-of-range severity
- [ ] `toString()` returns a readable line
- [ ] Two bugs with the same `id` are `equals()` and share the same `hashCode()`
- [ ] At least one constructor calls another via `this(...)`

**Hints:** IntelliJ `Alt+Insert` generates getters, `equals()`, `hashCode()`, and `toString()`. Make `id` effectively final once set. Use `Objects.hash(id)` and `Objects.equals(...)`.

**You now have:** the `Bug` domain object — the foundation for the whole model.

---

## The Issue Hierarchy

**Topic:** [[04 OOP Inheritance Polymorphism]] · **Builds on:** The Bug Class

**Task:** Extract a base class `Issue` holding the common fields (`id`, `title`, `reporter`) and a method `describe()`. Make `Bug extends Issue` (adds `stepsToReproduce`). Add two siblings: `Task extends Issue` (adds `estimateHours`) and `Story extends Issue` (adds `storyPoints`). Override `describe()` in each subclass so the output is type-specific. In `Main`, put mixed objects into an `Issue[]` and call `describe()` on each in a loop.

**Acceptance criteria:**
- [ ] `Bug`, `Task`, `Story` all extend `Issue`
- [ ] Subclass constructors call `super(...)`
- [ ] `describe()` is `@Override`-annotated and behaves differently per type
- [ ] A single loop over `Issue[]` prints different output per object (polymorphism)
- [ ] Common fields live only in `Issue`, not duplicated in subclasses

**Hints:** The compile-time type is `Issue`, but the runtime type decides which `describe()` runs — that is dynamic dispatch. Keep `Bug`'s `equals()`/`hashCode()` working after the refactor.

**You now have:** a polymorphic `Issue` hierarchy.

---

## Interfaces and Abstraction

**Topic:** [[05 OOP Interfaces Abstraction]] · **Builds on:** The Issue Hierarchy

**Task:** Make `Issue` an **abstract** class with an abstract method `getSummary()`. Define two interfaces: `Reportable { String generateReport(); }` and `Assignable { void assignTo(String user); String getAssignee(); }`. Have the concrete issues implement them. In `Main`, hold objects through an interface reference (e.g. `Reportable r = bug;`) and call the interface methods.

**Acceptance criteria:**
- [ ] `Issue` is `abstract` and cannot be instantiated directly (`new Issue(...)` fails to compile)
- [ ] `getSummary()` is abstract and implemented by every subclass
- [ ] `Reportable` and `Assignable` are implemented by the concrete classes
- [ ] At least one variable is declared with an interface type, not the class type
- [ ] `assignTo()` stores the assignee returned by `getAssignee()`

**Hints:** A class can implement multiple interfaces but extend only one class. Consider a `default` method in `Reportable` for a shared report header. Program to the interface, not the implementation.

**You now have:** clean abstractions (`abstract Issue` + capability interfaces).

---

## Severity and Status Enums

**Topic:** [[06 Enums]] · **Builds on:** Interfaces and Abstraction, Triage Logic

**Task:** Replace the raw `int severityLevel` with an enum `Severity { LOW(1), MEDIUM(2), HIGH(3), CRITICAL(4) }` that stores a `weight` field and exposes `getWeight()`. Add a `Status { NEW, IN_PROGRESS, RESOLVED, CLOSED, REOPENED }` enum and give `Issue` a `Status` field. Add a method `boolean canTransitionTo(Status next)` that allows only sensible transitions (e.g. `NEW → IN_PROGRESS`, not `CLOSED → IN_PROGRESS`). Move the triage `switch` to work on `Severity`.

**Acceptance criteria:**
- [ ] `Severity` has a constructor, a private field, and `getWeight()`
- [ ] The model uses `Severity`/`Status` instead of int/String
- [ ] `canTransitionTo()` rejects at least one invalid transition
- [ ] A `switch` over the enum handles every constant
- [ ] Triage logic now reads severity from the enum

**Hints:** Enum constructors are implicitly private. `Severity.values()` and `valueOf(String)` are useful. A `switch` over an enum does not need the enum prefix in each `case`.

**You now have:** type-safe `Severity` and `Status` in the model.

---

## The Report Formatter

**Topic:** [[07 String in Depth]] · **Builds on:** Severity and Status Enums

**Task:** Create `ReportFormatter` in `com.innowise.tracker.util`. Using a `StringBuilder`, build a multi-line text report for an `Issue` (key, title, severity, status, reporter, assignee). Validate the reporter's email with a **regex**. Produce a human-readable issue key like `BUG-001` with `String.format` and zero-padding, and write a method that parses such a key back into its number using `split`.

**Acceptance criteria:**
- [ ] The report is assembled with `StringBuilder`, not `+` in a loop
- [ ] A regex validates a basic email and rejects an invalid one
- [ ] The key is formatted as `PREFIX-NNN` with zero padding (`BUG-001`)
- [ ] Parsing `BUG-001` returns the int `1`
- [ ] At least one of `strip()`, `isBlank()`, `toLowerCase()` is used

**Hints:** `String.format("%s-%03d", prefix, id)` zero-pads. Email regex can be simple: `^[\\w.+-]+@[\\w-]+\\.[\\w.-]+$`. Add a short comment showing the difference between `==` and `.equals()` for strings (String pool) — it is tested mentally here, used for real in the next exercise.

**You now have:** a `ReportFormatter` plus validation helpers.

---

## References and Equality

**Topic:** [[08 Java Memory Model]] · **Builds on:** The Bug Class, The Report Formatter

**Task:** Create a `MemoryDemo` class that proves you understand references. Show that two variables pointing at the **same** `Bug` see each other's mutations. Add a **copy constructor** `Bug(Bug other)` that produces an independent copy. Put several bugs (including two with the same `id`) into a `HashSet<Bug>` and show that the duplicate is rejected. Add short comments explaining stack vs heap and `==` vs `equals()`.

**Acceptance criteria:**
- [ ] Demo proves shared-reference mutation (change via one variable, read via the other)
- [ ] `Bug(Bug other)` creates a deep-enough independent copy
- [ ] `HashSet<Bug>` rejects a second bug with a duplicate `id`
- [ ] A comment explains why the `HashSet` works (relies on `equals`/`hashCode` from exercise 03)
- [ ] `==` vs `equals()` difference is demonstrated for two equal bugs

**Hints:** If `HashSet` does **not** dedupe, your `equals()`/`hashCode()` are wrong — go back to exercise 03. The copy constructor matters later when you load data and want to avoid shared state.

**You now have:** a copy constructor on `Bug` and proof your equality contract works.

---

## The Generic Repository

**Topic:** [[09 Generics]] · **Builds on:** The Issue Hierarchy, References and Equality

**Task:** Define a generic interface `Repository<T>` with `add(T)`, `getById(int id)`, `getAll()`, and `remove(int id)`. Provide a first implementation `InMemoryRepository<T>` (storage can be a simple list for now — it gets upgraded next exercise). Add a bounded generic helper method `<T extends Issue> void printSummaries(List<T> issues)` that calls `getSummary()` on each.

**Acceptance criteria:**
- [ ] `Repository<T>` is generic and `InMemoryRepository<T>` implements it
- [ ] No raw types anywhere (no warnings about unchecked types)
- [ ] The bounded method `<T extends Issue>` compiles and uses `getSummary()`
- [ ] You can create both `InMemoryRepository<Bug>` and `InMemoryRepository<Issue>`
- [ ] `getById` returns the matching entity or `null` for now (improved in exercise 12)

**Hints:** The bound `<T extends Issue>` is what lets you call `getSummary()` inside the generic method. Think about why `Repository<Bug>` is not a `Repository<Issue>` (invariance) — the topic note covers PECS.

**You now have:** a generic storage layer.

---

## Collections-Backed Repository

**Topic:** [[10 Arrays and Collections]] · **Builds on:** The Generic Repository

**Task:** Upgrade `InMemoryRepository<T>` to store entities in a `Map<Integer, T>` keyed by id (fast lookup, no duplicate ids). Add an `IssueRepository` (or generic queries) with: `List<T> getAll()` returning a defensive copy, `getByStatus(Status)`, and `countBySeverity()` returning a `Map<Severity, Integer>`. Demonstrate a `Set` to prove ids are unique.

**Acceptance criteria:**
- [ ] Storage is a `Map<Integer, T>`; `getById` is an O(1) map lookup
- [ ] Adding a second entity with an existing id does not silently overwrite (decide and document behavior)
- [ ] `getByStatus` returns only matching issues
- [ ] `countBySeverity` returns correct counts per `Severity`
- [ ] `getAll()` returns a copy, so external code cannot mutate internal storage

**Hints:** `Map.values()` gives all entities. `new ArrayList<>(map.values())` is a quick defensive copy. Choose the collection by need: `Map` for id lookup, `List` for ordered output, `Set` for uniqueness.

**You now have:** `IssueRepository` — the real data store with basic queries.

---

## Validation and Custom Exceptions

**Topic:** [[11 Exception Handling]] · **Builds on:** Collections-Backed Repository

**Task:** Add custom exceptions in `com.innowise.tracker.exception`: `IssueNotFoundException` (unchecked), `InvalidIssueException`, and `DuplicateIssueException`. Make `getById` throw `IssueNotFoundException` when the id is missing, and `add` throw `DuplicateIssueException` on a repeated id. Make the `Bug`/`Issue` setters/constructor throw `InvalidIssueException` for bad data. In `Main`, wrap calls in `try/catch` and print friendly messages.

**Acceptance criteria:**
- [ ] Three custom exception classes exist, each with a message constructor
- [ ] A sensible choice of checked vs unchecked is made and consistent
- [ ] Repository throws on missing id and on duplicate id
- [ ] Invalid issue data throws `InvalidIssueException`
- [ ] `Main` catches the exceptions and the program does not crash

**Hints:** Extend `RuntimeException` for unchecked, `Exception` for checked. Put the failing id/value in the exception message — it makes debugging real. A `finally` block or try-with-resources will appear naturally in the File Persistence exercise.

**You now have:** a robust repository with meaningful validation errors.

---

## Stream Queries and Optional

**Topic:** [[12 Lambda, Streams and Optional]] · **Builds on:** Validation and Custom Exceptions

**Task:** Rewrite the repository queries using the Stream API. Add: `filterBySeverity(Severity)`, `sortedByWeightDesc()`, `titles()` (map each issue to its title), `countByStatus()` using `Collectors.groupingBy`. Change `getById` to return `Optional<T>`, and add `getByIdOrThrow` that uses `orElseThrow(() -> new IssueNotFoundException(...))`. Use lambdas and method references.

**Acceptance criteria:**
- [ ] At least one each of `filter`, `map`, `sorted`, and a `Collectors` collector are used
- [ ] `countByStatus()` returns a `Map<Status, Long>` via `groupingBy`
- [ ] `getById` returns `Optional<T>`; no `.get()` is called without a check
- [ ] `getByIdOrThrow` uses `orElseThrow`
- [ ] A method reference (e.g. `Issue::getTitle`) appears at least once

**Hints:** `Comparator.comparingInt(i -> i.getSeverity().getWeight()).reversed()` sorts by weight. Prefer `Optional` over returning `null`. `groupingBy(Issue::getStatus, Collectors.counting())` gives the counts.

**You now have:** a clean, declarative query layer over the repository.

---

## Annotations and Reflection

**Topic:** [[13 Annotations and Reflection Basics]] · **Builds on:** Stream Queries and Optional

**Task:** Create a runtime annotation `@CsvColumn(String name)` and put it on the `Bug` fields you want to export. Write a `CsvMapper` that uses **reflection** to read every `@CsvColumn` field of an object and build (a) a CSV header line from the column names and (b) a CSV data row from the field values.

**Acceptance criteria:**
- [ ] `@CsvColumn` has `@Retention(RUNTIME)` and `@Target(FIELD)`
- [ ] `CsvMapper` reads annotated fields via reflection (`getDeclaredFields`)
- [ ] Header line is built from the annotation `name` values
- [ ] Data row is built from the actual field values of an instance
- [ ] Fields without the annotation are skipped

**Hints:** `field.setAccessible(true)` lets you read private fields. `field.isAnnotationPresent(CsvColumn.class)` filters; `field.getAnnotation(CsvColumn.class).name()` gives the column name. Keep values comma-safe (wrap in quotes or replace commas).

**You now have:** an annotation plus a reflective CSV mapper — the bridge to file storage.

---

## File Persistence

**Topic:** [[14 File I-O]] · **Builds on:** Annotations and Reflection, Collections-Backed Repository

**Task:** Create `IssueFileStorage` in `com.innowise.tracker.io`. `save(repository, path)` writes all issues to `issues.csv` (header from `CsvMapper`, one row per issue). `load(path)` reads the file back, rebuilds `Bug` objects, and puts them into a fresh repository. Use try-with-resources and handle `IOException`.

**Acceptance criteria:**
- [ ] `save` produces a valid CSV file with a header and one row per issue
- [ ] `load` reconstructs the issues and adds them to the repository
- [ ] try-with-resources is used for the reader and writer
- [ ] `IOException` is handled (or wrapped) — no raw stack trace leaking to the user
- [ ] Saving then loading yields an equal set of issues (round-trip works)

**Hints:** `Files.newBufferedWriter` / `Files.newBufferedReader` are simple and safe. Reuse `CsvMapper` from the previous exercise for the header and rows. The copy constructor from exercise 08 helps avoid shared state when rebuilding objects.

**You now have:** persistent storage — the tracker survives a restart.

---

## Mavenize the Project

**Topic:** [[15 Build Tools Maven Gradle]] · **Builds on:** File Persistence (the whole codebase)

**Task:** Convert the project into a Maven project. Add a `pom.xml` (`groupId` `com.innowise`, `artifactId` `qa-tracker`, Java 21). Move your sources into `src/main/java` following the package folders, and create the empty `src/test/java` tree. Add the JUnit 5 dependency now (Selenium is added in the last exercise). Build from the terminal.

**Acceptance criteria:**
- [ ] Standard Maven layout: `src/main/java`, `src/test/java`, `pom.xml`
- [ ] `mvn clean compile` finishes with `BUILD SUCCESS`
- [ ] JUnit 5 (`junit-jupiter`) is a test-scoped dependency
- [ ] The app still runs (via IDE or `exec` plugin)
- [ ] `<maven.compiler.release>21</maven.compiler.release>` (or equivalent) is set

**Hints:** IntelliJ can convert a project to Maven, but write the `pom.xml` by hand at least once to understand it. Use `<scope>test</scope>` for JUnit. The `junit-jupiter` aggregator pulls in the API and engine together.

**You now have:** a Maven project ready for automated tests.

---

## Unit Tests with JUnit 5

**Topic:** [[16 Unit Testing with JUnit 5]] · **Builds on:** Mavenize the Project

**Task:** Write unit tests under `src/test/java` for the logic you built. Cover: `Bug` validation and equality, `Severity.getWeight()`, `Status.canTransitionTo()`, repository CRUD including `assertThrows` for not-found and duplicate, and at least one Stream query. Add a **parameterized test** for the triage logic. Use `@BeforeEach` to create a fresh repository per test.

**Acceptance criteria:**
- [ ] Tests follow Arrange–Act–Assert and have behavior-describing names
- [ ] `assertThrows` verifies `IssueNotFoundException` and `DuplicateIssueException`
- [ ] A `@ParameterizedTest` (e.g. `@CsvSource`) drives the triage logic with several inputs
- [ ] `@BeforeEach` sets up shared state; tests are independent (any order passes)
- [ ] `mvn test` runs and the whole suite is green

**Hints:** `assertThrows(IssueNotFoundException.class, () -> repo.getByIdOrThrow(999))` returns the exception so you can assert on its message. Reuse the triage rules from exercise 02 as the system under test. Keep each test focused on one scenario.

**You now have:** a green unit-test suite proving the domain and repository work.

---

## Selenium UI Tests

**Topic:** [[17 Selenium WebDriver Basics]] · **Builds on:** Unit Tests with JUnit 5

**Task:** Add the Selenium dependency and write a JUnit + Selenium test class against a public practice site — `https://www.saucedemo.com` or `https://the-internet.herokuapp.com/login`. Open the page, log in with valid credentials and assert success, then log in with invalid credentials and assert the error message. Create the driver in `@BeforeEach` and `quit()` it in `@AfterEach`. **Bonus:** when a UI assertion fails, build a `Bug` object (reusing your domain model) describing the defect and print its report via `ReportFormatter`.

**Acceptance criteria:**
- [ ] Selenium dependency added; driver created in `@BeforeEach`, `quit()` in `@AfterEach`
- [ ] Locators (`By.id`/`By.cssSelector`/…) find the login fields and button
- [ ] One test asserts a successful login, another asserts the error on bad credentials
- [ ] An explicit wait (`WebDriverWait` + `ExpectedConditions`) is used instead of `Thread.sleep`
- [ ] Bonus: a failed check produces a `Bug` and prints it with `ReportFormatter`

**Hints:** Selenium Manager (Selenium 4.6+) downloads the browser driver automatically — no manual setup. `saucedemo.com` credentials are listed on its login page. The bonus closes the loop: your tracker's domain model now records the very bugs your UI tests find.

**You now have:** a complete, Maven-built QA Issue Tracker with unit tests and Selenium UI tests — every Module 2 topic exercised in one project.
