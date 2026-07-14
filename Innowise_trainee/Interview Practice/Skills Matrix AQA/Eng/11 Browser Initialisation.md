# Browser Initialisation

## Table of Contents

- [[#Questions and Answers]]
	- [[#What Is It and What Should You Know?]]
	- [[#What Practical Skills Should an Automation QA Demonstrate?]]
	- [[#Which Mistakes and Risks Matter?]]
- [[#Intern and Junior Requirements]]
	- [[#How Do You Set Up and Create a Local WebDriver?]]
	- [[#Which Browser Engines, Options, and Cleanup Rules Matter?]]
- [[#Middle Requirements]]
	- [[#How Do Factory Patterns, Capabilities, and Remote WebDriver Work?]]
	- [[#How Do You Run Headless and Parallel Tests Safely?]]
- [[#Senior Requirements]]
	- [[#How Do Element Wrappers, Multiton, Prototype, and Logging Work?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Questions and Answers

### What Is It and What Should You Know?

**Short answer:**

WebDriver is created with browser options locally or through RemoteWebDriver. The instance, timeouts, and cleanup must be isolated for parallel tests.

### What Practical Skills Should an Automation QA Demonstrate?

**Short answer:**

Use a Factory for browser choice, control capabilities, engines, Grid or Selenoid, and verify important flows in headed mode because headless can differ.

### Which Mistakes and Risks Matter?

**Short answer:**

Avoid a global Singleton, leaked sessions, shared drivers, hidden defaults, and missing `quit()`.

---

## Intern and Junior Requirements

### How Do You Set Up and Create a Local WebDriver?

**Answer:**

Selenium WebDriver is the browser-automation API. In Java, a test usually creates a browser-specific driver such as `ChromeDriver`, `FirefoxDriver`, or `EdgeDriver`; all implement the `WebDriver` interface.

Modern Selenium Manager can normally find or download a compatible driver. If a project manages drivers itself, its path is configured before driver creation. The driver version must be compatible with the installed browser.

```java
ChromeOptions options = new ChromeOptions();
WebDriver driver = new ChromeDriver(options);
driver.manage().window().maximize();
// test actions
driver.quit();
```

`quit()` closes the whole browser session and releases the driver process. `close()` closes only the current window, so it is not enough as general cleanup.

### Which Browser Engines, Options, and Cleanup Rules Matter?

**Answer:**

Browsers use different engines: Chromium is used by Chrome and modern Edge, Gecko by Firefox, and WebKit by Safari. The same user flow can behave differently because rendering, permissions, downloads, and browser settings differ.

Browser options configure one local session: headless mode, download directory, window size, language, proxy, certificates, or arguments. Options should be created from explicit test configuration, not hidden inside a test. Use `try/finally` or an after hook so cleanup also runs after a failure.

---

## Middle Requirements

### How Do Factory Patterns, Capabilities, and Remote WebDriver Work?

**Answer:**

A Driver Factory selects the driver from a value such as `chrome`, `firefox`, or `edge`. It keeps browser-specific creation outside tests. An Abstract Factory is useful when one family of objects must be created together, for example a driver, options, and supporting services for a local or remote environment.

Capabilities describe the requested browser session, such as browser name, version, platform, and supported options. In W3C WebDriver, browser-specific options are nested under the browser option capability. Older `multiCapabilities` configurations are tool-specific; for current Selenium parallel sessions, create one independent capability set per session.

`RemoteWebDriver` sends WebDriver commands to a remote server such as Selenium Grid. The test provides the Grid URL and capabilities; the server creates a matching browser node.

```java
WebDriver driver = new RemoteWebDriver(
    URI.create("https://grid.example/wd/hub").toURL(),
    new ChromeOptions());
```

### How Do You Run Headless and Parallel Tests Safely?

**Answer:**

Headless mode runs without a visible window. It is useful in CI, but it can differ from headed mode in viewport size, GPU behaviour, fonts, downloads, timing, permissions, or browser version. Set a fixed window size and investigate an important failure in headed mode before calling it a product defect.

For parallel execution, every test needs its own driver, user, files, ports, and test data. Do not share one static driver. A Singleton is usually unsafe for parallel tests; a driver per thread or dependency injection with a test scope is safer.

---

## Senior Requirements

### How Do Element Wrappers, Multiton, Prototype, and Logging Work?

**Answer:**

An element wrapper adds safe common behaviour around a `WebElement`, for example a visible click, clear error message, screenshot, or explicit wait. It must not hide business actions or add blind retries.

A Multiton keeps one controlled instance for each key, for example one driver per thread ID. It needs reliable cleanup. A Prototype creates new objects by copying a configured prototype; it is useful only when copying is clearer than normal construction. These patterns are choices, not requirements: prefer the simplest lifecycle that keeps sessions isolated.

Enable Selenium or driver logs only at the level needed for diagnosis. Collect browser console logs, driver logs, screenshots, page source, and Grid session information as test artifacts. Never store passwords, tokens, or private data in logs.

---

## Theory Links

- [[17 Selenium WebDriver Basics]]
