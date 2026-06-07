# 16 Test Automation Fundamentals

## Table of Contents

- [[#What Is Test Automation]]
- [[#What to Automate and What Not]]
- [[#The Automation Pyramid]]
- [[#How to Start Automation]]
- [[#Reporting]]
- [[#CI/CD and Automation]]
- [[#Common Mistakes]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]

**Related notes:** [[QA manual eng]]

---

## What Is Test Automation

Test automation is using software to run tests automatically, compare the result to the expected outcome, and report whether the test passed or failed — without a human repeating the steps by hand.

**Goal:** Run repeatable checks faster, more often, and more reliably than manual testing can.

**Advantages:**
- Fast — runs hundreds of checks in minutes
- Repeatable — the same steps every time, no human error
- Runs unattended — overnight, on every code change
- Frees QA time for exploratory and complex testing

**Disadvantages:**
- Costs time and money to build and maintain
- Cannot judge usability, look-and-feel, or "does this feel right"
- Tests break when the application changes (maintenance cost)
- A bad test can give false confidence (passes but checks the wrong thing)

> [!info] Automation does not replace manual testing
> Automation is good at **checking** known things repeatedly. Humans are good at **exploring**, judging quality, and finding the unexpected. A healthy project uses both.

---

## What to Automate and What Not

Not every test is worth automating. Choose by **value vs cost**.

**Good candidates for automation:**
- Repetitive tests run in every release (regression)
- Smoke tests — quick "is the build alive?" checks
- Tests with many data combinations (data-driven)
- Stable features that rarely change
- Tests that are hard or slow to do by hand (calculations, large datasets)

**Poor candidates for automation:**
- Tests run only once or very rarely
- Features that change often (high maintenance)
- Usability, look-and-feel, and exploratory testing
- Tests where the expected result is unclear or subjective

> [!tip] Quick rule
> Automate what is **stable, repetitive, and high-value**. Keep human testing for what is **new, changing, or subjective**.

---

## The Automation Pyramid

The automation pyramid shows how many tests of each type you should have. More tests at the bottom (cheap, fast), fewer at the top (expensive, slow).

| Level | Speed | Cost | How many |
|---|---|---|---|
| **UI / E2E** | Slow | High | Few |
| **API / Integration** | Medium | Medium | Some |
| **Unit** | Fast | Low | Many |

**Why this shape:**
- Unit tests are fast and pinpoint the exact broken function — make most tests here
- API tests check business logic without a slow browser — a solid middle layer
- UI tests are slow and fragile — keep only the most important user journeys

> [!warning] The ice-cream cone anti-pattern
> If most tests are at the UI level and few are unit tests, the suite becomes slow, flaky, and expensive to maintain. This upside-down pyramid is called the "ice-cream cone" and should be avoided.

→ see [[04 Test Pyramid]] for the full breakdown of test levels.

---

## How to Start Automation

A practical order for setting up automation on a project:

1. **Define the goal.** What problem are you solving — slow regression? Flaky releases? Be specific.
2. **Choose the scope.** Start small: pick a few stable, high-value test cases (often smoke tests).
3. **Pick the tools.** Match the tool to the layer and stack:

| Layer | Common tools |
|---|---|
| Unit | JUnit, TestNG (Java); pytest (Python) |
| API | Postman/Newman, REST Assured, Playwright API |
| UI (web) | Selenium, Playwright, Cypress |
| UI (mobile) | Appium, Espresso, XCUITest |

4. **Set up the framework.** Project structure, test runner, reporting, configuration.
5. **Write the first tests.** Keep them simple, independent, and reliable.
6. **Run them in CI.** Automation has real value only when it runs automatically on every change.
7. **Maintain.** Fix flaky tests, update locators, remove obsolete tests.

> [!info] Hands-on with Java
> Module 2 builds a real automation framework step by step — see [[AQA Java eng]] for JUnit 5 and Selenium WebDriver.

---

## Reporting

A test run is only useful if people can understand the result quickly. A good report answers: how many passed/failed, which tests failed, and why.

**What a good report shows:**
- Total tests run, passed, failed, skipped
- Name of each failed test and the failure reason
- Screenshots or logs for failed UI tests
- Execution time and trends over time

**Common reporting tools:**
- **Allure** — rich, visual HTML reports; very popular in Java/AQA
- **Built-in runner reports** — JUnit/TestNG XML output
- **CI dashboards** — Jenkins, GitHub Actions show pass/fail per run

> [!tip] A failing test must be diagnosable
> If a test fails and no one can tell *why* from the report, the report is incomplete. Attach logs, screenshots, and clear assertion messages.

---

## CI/CD and Automation

**CI (Continuous Integration)** — developers merge code frequently, and an automated build + test run checks every change.
**CD (Continuous Delivery/Deployment)** — passing builds are automatically prepared for (or pushed to) release.

**Why automation lives in CI/CD:**
- Tests run on **every** commit or pull request, catching bugs early
- A failing test can **block** a broken change from merging
- No one has to remember to run the tests — the pipeline does it

**A typical CI pipeline:**
1. Developer pushes code
2. Pipeline builds the application
3. Unit tests run (fast — fail early)
4. API and UI tests run
5. Report is published
6. If everything passes, the build is deployed

**Common CI/CD tools:** GitHub Actions, GitLab CI, Jenkins, TeamCity.

> [!caution] Flaky tests poison CI
> A test that passes and fails randomly (without a real bug) destroys trust in the pipeline. People start ignoring red builds. Fix or quarantine flaky tests immediately.

---

## Common Mistakes

- **Automating everything.** Some tests are not worth the maintenance — be selective.
- **Tests that depend on each other.** Each test must set up its own data and run independently in any order.
- **Hard-coded waits (`sleep`).** Use smart waits for conditions, not fixed delays — they are slow and flaky.
- **Weak assertions.** A test that only checks "page loaded" misses real bugs. Assert the actual expected result.
- **No maintenance plan.** Automation is code; it needs upkeep. Abandoned suites rot and get ignored.
- **Ignoring flaky tests.** Unstable tests must be fixed, not re-run until they pass.

---

## Interview Questions

### Top 10

**1. What is test automation?**
Test automation uses software to run tests automatically, compare the result to the expected outcome, and report pass or fail — without a human repeating the steps. Its goal is fast, repeatable, reliable checks.

**2. Does automation replace manual testing?**
No. Automation is good at repeatedly checking known things; humans are good at exploring, judging usability, and finding the unexpected. A healthy project uses both.

**3. What should you automate and what should you not?**
Automate stable, repetitive, high-value tests — regression, smoke, data-driven cases. Do not automate one-off tests, frequently-changing features, or usability/exploratory testing where the result is subjective.

**4. What is the automation pyramid?**
A model showing how many tests of each type to have: many fast cheap unit tests at the bottom, some API/integration tests in the middle, and few slow expensive UI/E2E tests at the top.

**5. What is the ice-cream-cone anti-pattern?**
The inverted pyramid — most tests at the UI level and few unit tests. It makes the suite slow, flaky, and expensive to maintain, and should be avoided.

**6. Why are flaky tests dangerous?**
A test that randomly passes and fails without a real bug destroys trust in the suite. People start ignoring red builds, and real failures get missed. Flaky tests must be fixed or quarantined immediately.

**7. What is the role of CI/CD in automation?**
CI/CD runs the automated tests on every commit or pull request, catching bugs early and blocking broken changes from merging. Automation has real value only when it runs automatically, not manually.

**8. What are good practices for writing automated tests?**
Keep tests independent, use clear names, test behavior rather than implementation, use simple test data, prefer smart waits over hard sleeps, and use strong assertions on the actual expected result.

**9. What makes a good test report?**
It shows totals (passed/failed/skipped), the name and reason for each failure, and logs or screenshots for failed UI tests. If you cannot tell why a test failed from the report, the report is incomplete.

**10. How do you start automation on a new project?**
Define the goal, pick a small high-value scope (often smoke tests), choose tools that match the layer and stack, set up the framework and reporting, write simple reliable tests, run them in CI, and maintain them.

---

### Tricky Questions

**1. A test passes locally but fails in CI. What could be the cause?**
Differences in environment — browser version, screen size, timing, test data, or parallel execution. It can also be a hidden dependency on local state. The fix is to make tests independent and environment-agnostic, and to reproduce the CI conditions.

**2. Management wants to automate 100% of test cases. Is that a good idea?**
No. Some tests are not worth the maintenance cost — one-off cases, fast-changing features, and subjective usability checks. Automation should target stable, repetitive, high-value tests; chasing 100% wastes effort and creates a fragile suite.

**3. Your UI test suite is slow and breaks often. How do you improve it?**
Move checks down the pyramid — cover business logic with fast unit and API tests, and keep only the most important user journeys at the UI level. Replace hard sleeps with smart waits and stabilize locators. This addresses the ice-cream-cone problem.

**4. A test uses `Thread.sleep(5000)` and works. Why change it?**
Fixed sleeps make tests slow (they always wait the full time) and flaky (the element may still not be ready, or be ready much sooner). Use an explicit wait for the actual condition instead — faster and more reliable.

**5. All your tests are green, but bugs still reach production. What might be wrong?**
The tests may have weak assertions (only checking "page loaded"), cover the wrong areas, or rely on the same flawed assumptions as the code. Green does not mean correct — review what the tests actually verify and add coverage for the missed scenarios.
