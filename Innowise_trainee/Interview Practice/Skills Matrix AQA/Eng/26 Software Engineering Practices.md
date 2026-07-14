# Software Engineering Practices

## Table of Contents

- [[#Questions and Answers]]
	- [[#What Is OOP and Why Does It Matter in Test Automation?]]
	- [[#How Do Encapsulation, Inheritance, Polymorphism, and Abstraction Differ?]]
	- [[#When Should You Use Composition, Interfaces, or Inheritance?]]
	- [[#Which Design Patterns Help a Test Framework?]]
	- [[#What Is Functional Programming and When Is It Useful?]]
	- [[#How Do Lambdas, Higher-Order Functions, and Streams Help Test Code?]]
	- [[#What Does SOLID Mean in a Test Framework?]]
	- [[#Why Do Code Standards, Linters, and Static Analysis Matter?]]
	- [[#What Are Code Smells and How Do You Respond to Them?]]
	- [[#What Is Refactoring and How Do You Do It Safely?]]
	- [[#What Does a Useful Code Review Look Like?]]
	- [[#How Do You Debug a Simple Test Failure?]]
	- [[#How Do You Debug Complex Framework and Concurrency Failures?]]
	- [[#What Is Expected from a Senior Engineer in Engineering Practices?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Questions and Answers

### What Is OOP and Why Does It Matter in Test Automation?

**Answer:**

Object-oriented programming (OOP) organises code around objects that combine data and behaviour. In an automation framework, an object can represent a page, a UI component, an API client, test data, or configuration.

OOP can make changing a test easier when each class has a clear responsibility. It does not mean that every small value needs a separate class.

### How Do Encapsulation, Inheritance, Polymorphism, and Abstraction Differ?

**Answer:**

Encapsulation hides internal details behind a small public API. For example, a `LoginPage` can expose `login(user)` instead of letting tests manipulate its locators. Inheritance lets a child class reuse or extend a parent type. Polymorphism lets code use different implementations through one common type. Abstraction focuses on the needed behaviour and hides unnecessary detail.

Explain these ideas with a real framework example, not only with textbook definitions.

### When Should You Use Composition, Interfaces, or Inheritance?

**Answer:**

Use composition when a class has a dependency: for example, a page object has a `WebDriver` or an API client has an HTTP transport. Use an interface when callers need the same capability from several implementations, such as a real and stub notification client. Use inheritance only for a true "is-a" relationship and a stable shared contract.

Deep base classes often hide setup and create fragile tests. Prefer small composed objects over inheritance used only to reuse a few methods.

### Which Design Patterns Help a Test Framework?

**Answer:**

Page Object keeps page-specific actions and locators outside test scenarios. Factory creates a suitable driver, API client, or test object from configuration. Builder makes complex test data readable. Strategy selects an interchangeable behaviour, for example an authentication method or a retry policy. Singleton can be valid for truly shared immutable configuration, but it can make parallel tests and isolation harder.

Choose a pattern because it solves a present problem. Do not add patterns only to make the framework look advanced.

### What Is Functional Programming and When Is It Useful?

**Answer:**

Functional programming treats functions as values and favours predictable operations. A pure function returns the same result for the same input and has no visible side effect. Immutability means an operation returns new data instead of changing shared data.

These ideas are useful for test-data transformations, response checks, and small utilities. They reduce hidden state and make a unit test easier to write. Advanced ideas such as currying, memoization, or monads are useful only when they make the project clearer; do not use them only for style.

### How Do Lambdas, Higher-Order Functions, and Streams Help Test Code?

**Answer:**

A lambda is a short function expression. A higher-order function receives a function or returns one. In Java, streams can apply operations such as `filter`, `map`, and `reduce` to a sequence of elements. They are useful for selecting test data or turning API results into clear assertions.

Keep stream functions stateless and avoid modifying the source collection during a stream pipeline. A simple loop is better when it is clearer or when debugging a complex stream would be difficult.

### What Does SOLID Mean in a Test Framework?

**Answer:**

SOLID is five design guidelines:

- Single Responsibility: one class has one main reason to change.
- Open/Closed: extend behaviour through a stable design instead of changing many existing callers.
- Liskov Substitution: a replacement implementation must honour the same contract.
- Interface Segregation: clients should depend on small relevant interfaces, not a large interface with unused methods.
- Dependency Inversion: high-level test logic depends on abstractions, not directly on a concrete driver, client, or storage.

For example, a test scenario should not depend directly on a specific HTTP library if an `OrderClient` interface can express the needed action. Apply SOLID when it reduces change risk; excessive layers are also a maintenance cost.

### Why Do Code Standards, Linters, and Static Analysis Matter?

**Answer:**

Code standards make naming, formatting, imports, error handling, and test structure consistent. This reduces review noise and makes the code easier to read. A formatter, linter, and static analyser can automatically find many repeatable problems, such as unused code, risky constructs, or possible null errors.

Teams should agree on rules, run checks locally and in CI, and fix or explicitly justify warnings. Passing a linter does not prove that the test has correct business assertions.

### What Are Code Smells and How Do You Respond to Them?

**Answer:**

A code smell is a warning sign of possible design debt, not automatically a bug. Common smells are duplicate code, a long method, a large class, long parameter lists, complex conditionals, a feature that depends too much on another class, and hidden mutable state.

First identify the harm: hard review, slow change, flaky test, or high error risk. Then use a small suitable change, such as Extract Method, Rename, Introduce Parameter Object, or Replace Conditional with Polymorphism. Do not perform a large rewrite only because a smell has a name.

### What Is Refactoring and How Do You Do It Safely?

**Answer:**

Refactoring changes the internal design without changing the intended observable behaviour. Its goal is clearer, safer, and easier-to-maintain code. Rename, Extract Method, Extract Class, Move Method, and replacing duplication with a shared helper are common techniques.

Protect refactoring with relevant automated tests and make small reviewable commits. First understand the current behaviour, then change one concern, run checks, and review the diff. Do not mix a large refactoring with an unrelated feature or bug fix unless there is a clear reason.

### What Does a Useful Code Review Look Like?

**Answer:**

Code review checks correctness, test coverage, readability, maintainability, security, and risk. As an author, describe the goal, the important design choice, how you tested it, and known limits. As a reviewer, read the requirement and give specific, respectful feedback that explains the impact.

Start with correctness and risk before minor style comments. A good review asks questions, suggests alternatives when useful, and accepts a valid reasoned decision. Senior reviewers help resolve disagreements, mentor others, and keep the team standards practical.

### How Do You Debug a Simple Test Failure?

**Answer:**

Reproduce the failure and read the assertion message, stack trace, test logs, and screenshots or request/response evidence. Use a breakpoint, step into or over code, and inspect variables to find the first value that differs from the expectation.

Check test data, configuration, timing, locator or request details, and the environment before changing code. Fix the cause, then run the narrow test and relevant broader checks. Do not add a wait or retry only to hide an unexplained failure.

### How Do You Debug Complex Framework and Concurrency Failures?

**Answer:**

For a complex issue, narrow the failing path with correlation IDs, structured logs, and a minimal reproduction. Conditional breakpoints can stop only when the failing input appears. Remote debugging can inspect a process in a test environment, but it must be enabled securely and used with care.

For concurrency, inspect thread states, shared mutable data, locks, timeouts, and the order of events. A failure that disappears under a debugger can be a timing problem. Use a profiler for CPU, allocations, garbage collection, and memory growth instead of guessing from one slow test.

### What Is Expected from a Senior Engineer in Engineering Practices?

**Answer:**

A senior engineer makes deliberate architecture choices, recognises subtle smells and anti-patterns, and can plan a safe refactoring that crosses framework layers. They configure and improve quality checks, review complex changes, mentor teammates, and explain trade-offs clearly.

They can investigate unfamiliar code and production-like failures, including performance, memory leaks, garbage-collection pressure, integrations, and concurrency. The goal is not the most abstract design; it is a reliable framework that the team can understand and change.

---

## Theory Links

- [[23 Software Engineering Practices for AQA]]
