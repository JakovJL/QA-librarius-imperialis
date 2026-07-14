# Selenium API

## Table of Contents

- [[#Questions and Answers]]
	- [[#What Is It and What Should You Know?]]
	- [[#What Practical Skills Should an Automation QA Demonstrate?]]
	- [[#Which Mistakes and Risks Matter?]]
- [[#Intern and Junior Requirements]]
- [[#Middle Requirements]]
- [[#Senior Requirements]]
	- [[#How Do You Check Selenium and Driver Versions?]]
	- [[#Which WebDriver, WebElement, and By Methods Matter?]]
	- [[#How Do You Use Actions and JavaScriptExecutor?]]
	- [[#What Are Expected Conditions and When Should You Use Them?]]
	- [[#How Do You Work With Alerts, Frames, and Windows?]]
	- [[#How Do You Diagnose Selenium Exceptions?]]
	- [[#What Are Capabilities and a Session?]]
	- [[#What Does a Selenium Wrapper Add?]]
	- [[#How Do Grid and Selenoid Differ?]]
	- [[#How Can a Test Use an HTTP Proxy?]]
	- [[#What Are Mocks, Stubs, and Fakes?]]
	- [[#How Do You Fix a Flaky Test?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Questions and Answers

### What Is It and What Should You Know?

**Short answer:**

WebDriver manages the browser; WebElement represents an element; By locates it. Actions, Expected Conditions, JavaScriptExecutor, alerts, frames, and window handles cover advanced interaction.

### What Practical Skills Should an Automation QA Demonstrate?

**Short answer:**

Use Grid or Selenoid for remote parallel browsers and collect logs, screenshots, video, DOM, and network evidence for failures.

### Which Mistakes and Risks Matter?

**Short answer:**

Fix locator, timing, stale-element, overlay, data, and environment causes instead of adding sleeps or blind retries.

---

## Intern and Junior Requirements

- Check the Selenium version in the build file, for example `pom.xml`, or at runtime from the library package. Check the browser driver version with its `--version` command or driver log. Browser, driver, and Selenium compatibility must be investigated together.
- `WebDriver` navigates and controls a session: `get`, `getCurrentUrl`, `getTitle`, `findElement`, `manage`, `navigate`, `switchTo`, `close`, and `quit`. `WebElement` represents one node: `click`, `sendKeys`, `clear`, `getText`, `getAttribute`, `isDisplayed`, and `findElement` are common methods.
- `By` creates locator strategies such as `id`, `name`, `cssSelector`, `xpath`, `className`, `tagName`, and `linkText`. A locator should be stable and unique; the test should not use a long absolute XPath only because it works today.

---

## Middle Requirements

- `Actions` builds complex user input such as hover, drag-and-drop, key combinations, and context click; call `perform()` to send the built action sequence. `JavascriptExecutor` runs small browser-side scripts only when normal WebDriver interaction is not enough.
- Expected Conditions are predicates used with an explicit wait, for example visibility, clickability, frame availability, alert presence, or invisibility. They solve a known state transition, not every timing problem.
- For an alert use `driver.switchTo().alert()` then read, accept, dismiss, or send text. For an iframe, switch to the frame before locating its content and use `defaultContent()` afterwards. Window and tab switching uses a window handle; WebDriver does not treat them as different concepts.
- Common Selenium exceptions include `NoSuchElementException`, `TimeoutException`, `StaleElementReferenceException`, and `ElementClickInterceptedException`. Read the cause: a stale element often needs a fresh lookup after the DOM changed, not a retry loop.
- `Capabilities` describe a requested session. A builder or options object creates those capabilities; a session is the server-side browser session identified by a session ID. Selenide is an example of a Selenium wrapper that adds concise API and waiting behaviour, but it does not remove the need to understand WebDriver.

---

## Senior Requirements

- A proxy can observe or modify HTTP traffic only when the browser and test environment route traffic through it. It is not a built-in way for Selenium to read every request. Use a dedicated proxy or browser protocol tool, and do not capture secrets unnecessarily.
- A stub returns predefined answers, a mock verifies expected interaction, and a fake is a working but simpler implementation. Use them to isolate a test from unstable, costly, or unavailable dependencies.
- Selenium Grid routes remote sessions to matching nodes for parallel execution. Selenoid is another remote browser service, commonly container-based. Choose by compatibility, operations, browser images, observability, and team support.
- To fix flaky UI or API tests, first classify the cause: product defect, locator, synchronisation, test data, dependency, environment, or test code. Preserve evidence, make the condition deterministic, and remove the root cause. A retry is only a temporary diagnostic measure with a clear limit.

---

## Detailed Question and Answer

### How Do You Check Selenium and Driver Versions?

**Answer:**

I check the Selenium dependency version in `pom.xml` or Gradle configuration. I check the browser version in its About page and the driver version with its executable `--version` command or startup log. If a browser test suddenly fails after an update, I compare all three versions before changing test code.

### Which WebDriver, WebElement, and By Methods Matter?

**Answer:**

`WebDriver` opens pages with `get()`, finds elements with `findElement()`, changes context with `switchTo()`, configures the browser through `manage()`, and ends the session with `quit()`. `WebElement` performs `click()`, `sendKeys()`, `clear()`, and reads state with `getText()`, `getAttribute()`, `isDisplayed()`, and `isEnabled()`. `By` creates a locator, for example `By.id()`, `By.cssSelector()`, or `By.xpath()`.

### How Do You Use Actions and JavaScriptExecutor?

**Answer:**

I use `Actions` for real user input that is difficult to express with one WebElement call: hover, drag-and-drop, context click, and key combinations. I build the sequence and call `perform()`. I use `JavascriptExecutor` only for a browser-level need, such as reading a computed style or scrolling an element into view; it should not replace a normal click without a reason.

### What Are Expected Conditions and When Should You Use Them?

**Answer:**

An Expected Condition is a predicate for an explicit wait. Typical conditions wait for an element to be visible or clickable, text to appear, an alert to be present, a frame to become available, or a loader to disappear. I choose the condition that represents the next real user action. For example, before reading a result, I wait for its visible text rather than waiting for an arbitrary number of seconds.

### How Do You Work With Alerts, Frames, and Windows?

**Answer:**

For an alert, I wait for it and use `driver.switchTo().alert()` to read text, accept, dismiss, or enter text. For an iframe, I switch into it before locating inner elements, then return with `defaultContent()`. For a new tab or window, I save the original handle, wait for another handle, switch to it, check the expected page, and switch back when needed.

### How Do You Diagnose Selenium Exceptions?

**Answer:**

`NoSuchElementException` can mean a wrong locator or wrong context. `TimeoutException` means the expected state did not happen in time. `StaleElementReferenceException` means the DOM replaced the element, so I locate it again after the change. `ElementClickInterceptedException` can mean an overlay or another element blocks the click. I collect screenshot, URL, DOM, logs, and the exact condition before deciding the cause.

### What Are Capabilities and a Session?

**Answer:**

Capabilities describe the session requested from a browser or Grid: browser name, version, platform, and browser options. `ChromeOptions` is a convenient Java builder for Chrome capabilities. A session is the remote browser instance created by the server and identified by a session ID. Builder-style configuration must stay in one factory so tests do not set conflicting options.

### What Does a Selenium Wrapper Add?

**Answer:**

A wrapper such as Selenide gives a higher-level API around Selenium: concise element actions, built-in waiting, and clearer diagnostics. It can reduce repeated code, but the team still needs to know locators, browser state, WebDriver errors, and how the wrapper is configured. I would choose a wrapper only when its behaviour and maintenance fit the framework.

### How Do Grid and Selenoid Differ?

**Answer:**

Both run remote browsers for parallel tests. Selenium Grid is Selenium's distributed solution that matches requested capabilities with available nodes. Selenoid is a separate service that commonly runs browser containers and provides video and logs. I choose based on browser support, maintenance skills, observability, security, and CI environment.

### How Can a Test Use an HTTP Proxy?

**Answer:**

A test configures the browser to send traffic through an approved proxy, then the proxy records or changes the requests and responses that pass through it. This is useful for diagnostics or controlled test cases, for example checking that a request contains an expected header. A proxy is not a replacement for API tests, and it must not store production credentials or private payloads in reports.

### What Are Mocks, Stubs, and Fakes?

**Answer:**

A stub returns predefined data. A mock also verifies that a required interaction happened. A fake is a simpler working implementation, such as an in-memory repository. They isolate tests from slow, paid, unstable, or unavailable dependencies; they must still reflect the contract that the real dependency exposes.

### How Do You Fix a Flaky Test?

**Answer:**

I do not start with retries. I classify the failure as product, locator, timing, data, environment, dependency, or test-code problem. Then I make the state deterministic: use a stable locator, wait for the right condition, isolate data, control the dependency, or repair the test. I keep a retry only as a short diagnostic guard with evidence and an owner.

---

## Theory Links

- [[17 Selenium WebDriver Basics]]
