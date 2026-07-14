# Automation Tools and Frameworks

## Table of Contents

- [[#Matrix Scope]]
- [[#Questions and Answers]]
	- [[#What Automation Framework Do You Use?]]
	- [[#What Blocks Does an Automated Test Contain?]]
	- [[#How Do You Run, Skip, Group, and Parameterise Tests?]]
	- [[#What Are Lifecycle Hooks and Listeners?]]
	- [[#Can Tests Run in Parallel?]]
	- [[#How Do You Choose a Framework?]]
	- [[#How Do Configuration, Test Data, and Reporting Fit the Framework?]]
	- [[#How Do JUnit and TestNG Differ?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Matrix Scope

This note covers:

- JUnit, TestNG, NUnit, pytest, Robot Framework, MSTest, and related tools.
- Test structure, lifecycle hooks, tags, parallel runs, configuration, data, listeners, and reporters.
- Selection criteria, CI and TMS integration, extension, and generated test data.

---

## Questions and Answers

### What Automation Framework Do You Use?

**Short answer:**

For Java, I use JUnit 5 as the test runner and assertion framework, with Maven or Gradle for builds. Depending on the layer, I can combine it with Selenium, REST Assured, Mockito, and Allure. I explain the role of each tool instead of calling the whole stack JUnit.

### What Blocks Does an Automated Test Contain?

**Short answer:**

A clear test has setup or Arrange, action or Act, and verification or Assert. It also needs isolated data and cleanup when the test changes shared state. The test name should describe behaviour, and the assertion should verify the business result.

### How Do You Run, Skip, Group, and Parameterise Tests?

**Short answer:**

JUnit 5 supports individual class or method runs, `@Disabled`, tags, parameterized tests, and build-tool filters. Tags can separate smoke, regression, API, or slow tests. Skipping requires a reason; permanent disabled tests should be fixed or removed.

### What Are Lifecycle Hooks and Listeners?

**Short answer:**

Hooks such as `@BeforeEach`, `@AfterEach`, `@BeforeAll`, and `@AfterAll` prepare and clean state at different scopes. Extensions or listeners observe test events and can add screenshots, logging, retries, or reports. Hooks must not hide important test behaviour or create shared-state coupling.

### Can Tests Run in Parallel?

**Short answer:**

Yes, if the runner and build are configured for parallel execution and tests are independent. Drivers, users, files, ports, and data must not be shared unsafely. Parallelism should be limited by environment capacity, and failures must remain reproducible.

### How Do You Choose a Framework?

**Short answer:**

I consider language and ecosystem, project layer, team skills, maintainability, parallel execution, reporting, CI and IDE support, community maturity, license, and integration needs. A familiar popular tool is not automatically correct if it does not fit the architecture.

### How Do Configuration, Test Data, and Reporting Fit the Framework?

**Short answer:**

Configuration separates environment-specific values from code and protects secrets. Test data can come from builders, factories, files, databases, or generated sources, with cleanup and privacy rules. Reporters and listeners collect results and evidence; CI publishes them and can send results to a Test Management System.

### How Do JUnit and TestNG Differ?

**Short answer:**

Both support Java test automation, lifecycle methods, grouping, parameterisation, and parallel execution. TestNG historically provides rich suite XML, groups, dependencies, and parallel controls. JUnit 5 has a modular extension model and strong modern ecosystem support. The choice should follow project needs, not interview preference.

---

## Theory Links

- [[16 Unit Testing with JUnit 5]]

