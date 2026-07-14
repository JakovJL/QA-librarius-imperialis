# Framework Architecture

## Table of Contents

- [[#Questions and Answers]]
	- [[#What Is a Page Object and What Does It Contain?]]
	- [[#How Do Page Objects, Element Objects, and Component Objects Differ?]]
	- [[#What Is a Three-Level Test Architecture?]]
	- [[#When Should a Framework Use Four or Five Layers?]]
	- [[#What Is MVC and When Is It Useful in Test Automation?]]
	- [[#What Makes an Automated Test Good?]]
	- [[#Where Do Setup, Teardown, and Configuration Belong?]]
	- [[#How Should a Framework Separate UI, API, Integration, and E2E Tests?]]
	- [[#How Should Gherkin and Ordinary Tests Share One Framework?]]
	- [[#How Do Clean, Hexagonal, CQRS, and Frontend Architectures Affect Tests?]]
	- [[#How Should a Framework Support Microservices and Multiple Platforms?]]
	- [[#How Do You Scale a Framework for Parallel Runs and Dynamic Environments?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Questions and Answers

### What Is a Page Object and What Does It Contain?

**Answer:**

A Page Object is a class that represents one page or screen of the application under test. It keeps page-specific locators and actions in one place, so a UI change normally requires one fix. Its public methods describe user actions or readable page services, such as `loginAs()` or `getErrorMessage()`. A test owns business assertions; a Page Object may only check that the expected page is loaded.

```java
public final class LoginPage {
    private final WebDriver driver;
    private final By email = By.id("email");
    private final By password = By.id("password");

    public HomePage loginAs(String user, String secret) {
        driver.findElement(email).sendKeys(user);
        driver.findElement(password).sendKeys(secret);
        driver.findElement(By.cssSelector("button[type='submit']")).click();
        return new HomePage(driver);
    }
}
```

### How Do Page Objects, Element Objects, and Component Objects Differ?

**Answer:**

A Page Object represents a whole screen. An Element Object wraps a small reusable control, such as a custom dropdown or date picker, and hides its low-level Selenium interaction. A Component Object represents a larger repeated UI part, such as a product card, header, or table row. Use composition: a page has components, and a component can have elements. Do not expose public `WebElement` fields or duplicate locators across tests.

### What Is a Three-Level Test Architecture?

**Answer:**

For a simple UI framework, use `test → step/workflow → page`. The test explains the behaviour and makes assertions. The Step or Workflow Layer combines several business actions, such as creating an order through UI and API. The Page Layer works with one screen. This separation keeps test scenarios readable without making every small click a separate business step.

### When Should a Framework Use Four or Five Layers?

**Answer:**

Four or five layers are useful only when they remove repeated code or make a boundary clear. For example, use `test → workflow → page → component → element` for a large product with repeated complex controls. Do not create layers only to match a diagram: a one-page application with simple controls becomes harder to maintain if every action passes through five classes.

### What Is MVC and When Is It Useful in Test Automation?

**Answer:**

Model-View-Controller separates data and business rules (Model), presentation (View), and interaction flow (Controller). A test framework does not have to copy MVC, but the idea helps: test data or API models should not be mixed with browser code, and orchestration should not live inside a locator class. Use the simplest design that gives clear responsibilities.

### What Makes an Automated Test Good?

**Answer:**

A good test is readable, focused on one behaviour, independent of test order, deterministic, and has meaningful assertions. It creates required data explicitly, uses stable waits instead of sleeps, cleans up changed state, and reports enough context to diagnose a failure. The test name should state behaviour and expected result, not implementation details such as a locator or method name.

### Where Do Setup, Teardown, and Configuration Belong?

**Answer:**

`setUp` creates only the resources needed before a test, for example a driver, client, or test data. `tearDown` closes or deletes them even after a failure. Configuration—base URL, browser, credentials reference, timeout, locale, and environment—comes from typed configuration and CI variables, not hard-coded values. Keep setup, data creation, reporting, and business assertions in separate responsibilities.

### How Should a Framework Separate UI, API, Integration, and E2E Tests?

**Answer:**

Place UI, API, integration, contract, and E2E tests in clear packages or modules with shared low-level utilities only where useful. API tests should call API clients directly, not navigate the UI first. Integration tests verify collaboration between real components; E2E tests cover a critical user journey across boundaries and should be few. This structure gives faster feedback and makes failures easier to locate.

### How Should Gherkin and Ordinary Tests Share One Framework?

**Answer:**

A Gherkin flow can be `Feature → Scenario → Step Definition → Step/Workflow Layer → Page or API Layer`. Step Definitions should translate readable Gherkin into calls to shared workflow code; they should not contain locators or large business logic. JUnit and Cucumber can use the same clients, Page Objects, test-data builders, configuration, and reporting. Keep the test adapters separate so a change in Cucumber does not break ordinary JUnit tests.

### How Do Clean, Hexagonal, CQRS, and Frontend Architectures Affect Tests?

**Answer:**

Clean Architecture and Hexagonal Architecture separate business rules from external adapters. Ports and Adapters means tests can call a domain port or replace an external dependency with a test adapter. CQRS separates commands that change state from queries that read state; tests should check each contract and resulting state. For SPA, SSR, or BFF applications, choose the right test boundary: browser tests cover visible user behaviour, while API and contract tests cover backend and BFF rules without repeating everything through the UI.

### How Should a Framework Support Microservices and Multiple Platforms?

**Answer:**

Use a small core for configuration, reporting, and common utilities, then separate reusable modules for Web, Mobile, API, messaging, and service-specific clients. A microservice test suite needs stable service contracts, version compatibility checks, controlled test data, and clear ownership. The framework should support relevant platform adapters, such as Selenium for Web, Appium for Mobile, HTTP clients for backend, and consumers or producers for Kafka or RabbitMQ—without forcing one test type through another adapter.

### How Do You Scale a Framework for Parallel Runs and Dynamic Environments?

**Answer:**

Parallel tests need isolated drivers, accounts, test data, files, ports, and report artifacts. Do not share mutable static state between threads. Environment configuration must be isolated per run and safe to override in CI. Testcontainers can create disposable dependency containers for tests; the suite must wait for readiness and clean up resources. The CI pipeline should decide which suite runs on each change and provide logs, screenshots, and traces for failed jobs.

---

## Theory Links

- [[20 Automation Framework Architecture]]
