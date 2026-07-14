# Waiters

## Table of Contents

- [[#Questions and Answers]]
	- [[#What Is It and What Should You Know?]]
	- [[#What Practical Skills Should an Automation QA Demonstrate?]]
	- [[#Which Mistakes and Risks Matter?]]
- [[#Intern and Junior Requirements]]
- [[#Middle and Senior Requirements]]
	- [[#What Types of Waits Does Selenium Provide?]]
	- [[#Why Should You Not Mix Implicit and Explicit Waits?]]
	- [[#How Do You Wait for DOM and Application Readiness?]]
	- [[#How Do You Write an Explicit or Custom Expected Condition?]]
	- [[#How Do You Wait for a Loader or Multiple Events?]]
	- [[#How Does FluentWait Differ From WebDriverWait?]]
	- [[#How Do You Design and Diagnose Waits in a Framework?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Questions and Answers

### What Is It and What Should You Know?

**Short answer:**

Implicit wait affects lookup globally; explicit wait targets one condition; FluentWait customises polling and ignored exceptions. Mixing implicit and explicit waits makes timing unpredictable.

### What Practical Skills Should an Automation QA Demonstrate?

**Short answer:**

Wait for meaningful DOM, UI, network, or domain state and build reusable conditions with timeout diagnostics.

### Which Mistakes and Risks Matter?

**Short answer:**

Avoid `Thread.sleep()`, excessive timeouts, blind retries, and treating `document.readyState` as proof that the whole application is ready.

---

## Intern and Junior Requirements

- An implicit wait is one global timeout for element lookup. An explicit wait polls one condition for a limited time. `FluentWait` is the flexible base: it can set timeout, polling interval, and ignored exceptions. Do not mix implicit and explicit waits because their timeouts combine unpredictably.
- `Thread.sleep()` always waits the full time, even when the page is ready, and fails when the page needs longer. Wait for a meaningful state instead.
- `document.readyState == "complete"` means the document load event finished. It does not prove that single-page application data, AJAX requests, animations, or loaders finished. A custom JavaScript condition is appropriate only when the application exposes a reliable state.

---

## Middle and Senior Requirements

- Use `WebDriverWait` with a condition such as visible, clickable, invisible, text present, frame available, or alert present. Example: wait until a loader is invisible before clicking a result. A custom `ExpectedCondition` can repeatedly check that an element text contains the required value.
- FluentWait differs from a default WebDriverWait by allowing a chosen polling period and ignored exception set. Do not ignore broad exceptions, because that hides a real defect.
- Put reusable waits in a small `WaitUtils` or condition factory. Separate DOM readiness, network completion, UI visibility, and business state. A negative wait proves that something does not appear within a short agreed timeout.
- For flaky tests, log the condition, timeout, elapsed time, URL, locator, and screenshot. Combine conditions only when the user flow requires both, for example “result is visible and spinner is gone”. Dynamic timeouts must be justified by an environment or data characteristic, not used to hide slow behaviour.

---

## Detailed Question and Answer

### What Types of Waits Does Selenium Provide?

**Answer:**

An implicit wait is a session-wide timeout for locating an element. An explicit wait polls one chosen condition until it succeeds or times out. `WebDriverWait` is Selenium's common explicit-wait class. `FluentWait` is the more configurable base class. `Thread.sleep()` is not a Selenium wait: it pauses the test for a fixed time.

### Why Should You Not Mix Implicit and Explicit Waits?

**Answer:**

Implicit wait affects every element lookup. An explicit wait performs repeated lookups while waiting for its condition. When both are set, one poll can wait for the implicit timeout and make the total timeout longer and hard to predict. I normally keep implicit wait at zero and use explicit waits for meaningful states.

### How Do You Wait for DOM and Application Readiness?

**Answer:**

`document.readyState == "complete"` confirms that the browser finished loading the document. It does not prove that a SPA finished API requests, rendering, or animation. I use it only as one low-level signal, then wait for a user-visible or business-ready state such as a loaded result list or enabled Pay button. A custom JavaScript check is acceptable only when the application exposes a stable state.

### How Do You Write an Explicit or Custom Expected Condition?

**Answer:**

I create a `WebDriverWait` with a clear timeout and wait for one condition. A custom condition returns `true` only when the required state exists.

```java
new WebDriverWait(driver, Duration.ofSeconds(10))
    .until(d -> d.findElement(message).getText().contains("Saved"));
```

This is better than sleeping because the test continues as soon as the message is correct and fails with a useful timeout if it never appears.

### How Do You Wait for a Loader or Multiple Events?

**Answer:**

First wait for a loader or overlay to become invisible, then wait for the result that the user needs. For a compound state, use one condition that checks both parts: the result is visible **and** the spinner is gone. A negative wait checks that an unwanted element does not appear during a short agreed period; use it only when absence is the expected behaviour.

### How Does FluentWait Differ From WebDriverWait?

**Answer:**

`WebDriverWait` is a specialised FluentWait for WebDriver and is usually enough. FluentWait lets me choose the polling interval and exceptions to ignore. I ignore only expected transient exceptions, such as a stale element during a known redraw; ignoring broad exceptions hides defects.

### How Do You Design and Diagnose Waits in a Framework?

**Answer:**

Put reusable waits in a small `WaitUtils` or condition factory. Keep DOM, network, UI, and business-state waits separate. When a wait fails, log the condition name, timeout, elapsed time, URL, locator, screenshot, and relevant browser or network evidence. Do not increase every timeout after one slow run; find whether the cause is data, environment, a missing synchronisation event, or a real performance problem.

---

## Theory Links

- [[17 Selenium WebDriver Basics]]
