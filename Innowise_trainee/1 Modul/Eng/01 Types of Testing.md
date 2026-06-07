## Table of Contents

- [[#Main Testing Groups]]
- [[#Functional Testing]]
	- [[#Purpose]]
	- [[#Approaches]]
	- [[#Types]]
	- [[#Test Run Depth]]
- [[#Non-Functional Testing]]
	- [[#Purpose]]
	- [[#Types]]
- [[#Regression Testing]]
	- [[#Purpose]]
	- [[#Practices]]
	- [[#Retesting]]
- [[#Execution Approach]]
	- [[#Manual Testing]]
	- [[#Automated Testing]]
- [[#Testing Levels]]
- [[#User Acceptance Testing (UAT)]]
	- [[#Purpose]]
	- [[#Types]]
- [[#Interview Questions]]
	- [[#Top 15]]
	- [[#Tricky Questions]]

**Related notes:** [[QA manual eng]]

---

## Main Testing Groups

- **Functional** testing verifies that individual functions meet requirements. Functional testing includes unit, integration, and end-to-end tests.
- **Non-functional** testing verifies the system's qualities beyond its functional requirements. It includes performance assessments (responsiveness, stability, resource utilization under load), security (searching for vulnerabilities and weaknesses), usability, and the system's scalability.
- **Regression Testing** — ensures new changes do not break existing functionality.
- **User Acceptance Testing (UAT)** — checks whether the product meets user expectations.
- **Testing Approaches** — white‑box, black‑box, static, dynamic.
  - **Static** — examining code, documents, or requirements *without executing* the software (e.g. code reviews, walkthroughs).
  - **Dynamic** — testing by *running* the software and observing its behavior against expected results.

---

## Functional Testing

### Purpose

Validate correctness of features and compliance with requirements.

### Approaches

> [!tip] Positive vs Negative Testing
> - **Positive Testing** — valid inputs, verify that the system behaves **as expected**
> - **Negative Testing** — invalid inputs, verify that the system **handles errors correctly** and doesn't crash

### Types

- **Scripted Testing** (checklist‑based, test‑case‑based, outline‑based)
- **Exploratory Testing**. Tester simultaneously learns the product, designs tests, and executes them to quickly find unexpected defects.
- **Ad‑hoc Testing**. Unstructured, spontaneous testing without preparation, used for quick checks and obvious bug discovery.
- **Risk‑based Testing**. Testing is prioritized based on risk: probability of failure and impact on the system.
- **End‑to‑End Testing**. Validation of a complete user workflow across all integrated systems from start to finish.
- **Role‑based Testing**. Verification that the system behaves correctly for different user roles and permission levels.

> [!info] Exploratory vs Ad‑hoc — what's the difference?
> **Exploratory** — the tester *learns* the product and *simultaneously* designs tests. There is a goal, but no script.
> **Ad‑hoc** — completely unstructured, no goal, no documentation. Just a quick intuitive check.

### Test Run Depth

> [!warning] Hierarchy: from fastest to most thorough
> **Smoke** → **Sanity** → **Critical Path** → **Extended**
> Each next level is deeper, broader, and longer than the previous one.

- **Smoke Test**. Basic check that the application starts and core features work.
- **Sanity Test**. Focused check after small changes to confirm specific functionality works as expected.
- **Critical Path Test**. Testing of the most important user flows that must always work.
- **Extended Test**. Full, detailed testing of all features with maximum coverage.

---

## Non-Functional Testing

### Purpose

Assess system quality characteristics.

### Types

- **Installation Testing**. Verifies that the software installs, updates, and uninstalls correctly on all supported environments.
- **Internationalization Testing**. Checks that the product can support multiple languages, formats, and regions _without code changes_.
- **Localization Testing**. Ensures the product is correctly adapted for a specific language/region (translations, formats, cultural norms).
- **GUI/UI Testing**. Validates the correctness, consistency, and behavior of the graphical user interface.
- **Accessibility Testing**. Ensures the product is usable by people with disabilities (screen readers, keyboard navigation, contrast, ARIA).
- **Performance Testing**. Evaluates speed, responsiveness, stability, and resource usage under expected conditions.

    - **Load**. Checks system behavior under expected user load.
    - **Stress**. Pushes the system beyond normal limits to see how it fails and recovers.
    - **Soak**. Runs the system under continuous load for a long time to detect memory leaks, degradation, or stability issues.
    - **Volume**. Tests system behavior with large amounts of data.
    - **Capacity**. Determines the maximum load the system can handle before performance degrades to an unacceptable level.
    - **Scalability**. Tests how well the system handles increasing load — users, data, or transactions — and whether it scales up without breaking.

- **Usability Testing**. Evaluates how easy and intuitive the product is for users.
- **Security Testing**. Identifies vulnerabilities, weaknesses, and risks to protect data and prevent unauthorized access.
- **Compatibility Testing**. Checks that the product works correctly across different devices, OS versions, browsers, and hardware.
- **Configuration Testing**. Checks system behavior under different configurations — operating systems, browsers, hardware, and application parameters — to ensure correct operation across all supported setups.
- **Reliability Testing**. Verifies that the system performs its functions without failure over a specified period of time under normal conditions.
- **Recovery Testing**. Checks the system's ability to recover after failures such as power outages, network errors, or crashes.
- **Maintainability Testing**. Assesses how easily changes, fixes, and improvements can be made to the system.
- **Portability Testing**. Verifies that the software can be transferred from one environment to another without loss of functionality.
- **Compliance Testing**. Evaluates whether the software meets applicable industry standards, regulations, and legal requirements.

---

## Regression Testing

### Purpose

Ensure that updates do not introduce defects.

### Practices

- **Risk analysis**. Evaluating which areas of the system are most likely to fail and how severe the impact would be. High‑risk areas get tested first.
- **Change impact analysis**. Identifying which parts of the system are affected by recent code changes and must be retested to avoid regressions.
- **Prioritization of test cases.** Selecting and ordering test cases based on importance, risk, business value, and frequency of use.
- **Exploratory checks for hidden regressions.** Unscripted testing aimed at discovering unexpected issues that scripted tests might miss.
- **Automation**. Using automated tests to quickly and repeatedly verify core functionality after every change.
- **CI integration**. Running regression tests automatically in the Continuous Integration pipeline to catch regressions early.

### Retesting

Retesting confirms that **a specific defect has been fixed**. Unlike regression testing, it focuses exclusively on the functionality that was broken — using the same test steps and data that originally revealed the bug.

> [!tip] Regression vs Retesting
> | Criterion | Regression Testing | Retesting |
> |---|---|---|
> | Goal | Ensure new changes didn't break existing functionality | Confirm a specific defect was fixed |
> | Scope | Entire system or significant parts of it | Only the area where the defect was found |
> | When | After any code change, bug fix, or new feature | After a specific bug has been fixed |
> | Test cases | Previously passing tests (automated or manual) | The same tests that originally failed and caught the defect |
> | Focus | Overall system stability | Successful resolution of a known issue |

---

## User Acceptance Testing (UAT)

### Purpose

Validate that the product satisfies real user needs.

### Types

- **OAT** (Operational Acceptance Testing). Verifies that the system is operationally ready for production: backups work, logging is active, monitoring is in place, recovery procedures function, and security is configured.

> [!info] Alpha vs Beta Testing
> - **Alpha** — internal team tests in a **controlled environment** before release
> - **Beta** — real users test in **real-world conditions** after limited release

---

## Testing Approaches

### Black-Box Testing

Testing conducted **without knowledge** of the internal structure, design, or implementation. The tester interacts with the system purely through its inputs and outputs.

**Goal:** Verify that the system behaves according to requirements and meets user expectations.

**Advantages:**
- No programming knowledge required
- Simulates real user behavior
- Effective for catching requirement gaps and missing functionality

**Disadvantages:**
- No guarantee of full code coverage
- Internal logic errors may go undetected

**Example:** Testing a login form by submitting valid and invalid credentials and observing the responses — without knowing how password hashing or database validation works.

---

### White-Box Testing

Testing conducted with **full knowledge** of the internal structure and source code. The tester understands how the system works under the hood.

**Goal:** Verify internal logic, code paths, conditional branches, loops, and data flow.

**Advantages:**
- Deep code coverage
- Can catch errors invisible through the UI
- Helps identify dead code and optimize logic

**Disadvantages:**
- Requires programming skills
- Labor-intensive for large systems
- Does not guarantee the system meets external requirements

**Example:** Writing unit tests for `calculateDiscount(price, percentage)` that cover all branches — including edge cases like zero price or percentage > 100.

---

### Grey-Box Testing

A **combination** of black-box and white-box approaches. The tester has partial knowledge of internal structure (e.g., API specs, architecture diagrams, DB schemas) but not the full source code.

**Goal:** Use architectural knowledge to design more targeted tests while still evaluating external behavior.

**Advantages:**
- More targeted than black-box testing
- Less effort than full white-box analysis
- Covers both functional and some non-functional aspects

**Disadvantages:**
- Requires more knowledge than black-box
- Does not provide the same depth of coverage as white-box

**Example:** Using Swagger/OpenAPI documentation to send requests via Postman or Playwright `APIRequestContext`, verifying API responses directly — without access to the implementation code.

> [!tip] Quick comparison
> | | Black-Box | Grey-Box | White-Box |
> |---|---|---|---|
> | Knowledge of internals | None | Partial | Full |
> | Requires coding skills | No | Sometimes | Yes |
> | Coverage depth | Low | Medium | High |
> | Who typically runs it | QA engineers | QA / SDET | Developers / SDET |

---

## Execution Approach

### Manual Testing

A process in which a tester executes test scenarios by hand, interacting with the software as an end user would, in order to find defects and verify that the product meets requirements.

**Advantages:**
- **Flexibility** — testers can adapt on the fly and change their approach during a session
- **Intuition and experience** — help discover complex, non-obvious bugs and assess usability
- **Low initial cost** — no tooling setup or scripting required to get started

**Disadvantages:**
- **Time-consuming** — repeated execution of the same tests (especially regression) is slow and resource-heavy
- **Human error** — prone to mistakes caused by fatigue, distraction, or subjectivity
- **Limited coverage** — the number of tests is constrained by available people and time

**When to use:**
- Exploratory and ad-hoc testing
- Usability and UX testing
- Visual and design verification
- New or unstable features not yet ready for automation
- One-off tests that won't be repeated

---

### Automated Testing

A process in which specialized tools and scripts automatically execute test scenarios, compare actual results against expected ones, and generate reports.

**Advantages:**
- **Speed** — automated tests run significantly faster than manual ones
- **Repeatability** — tests execute identically every time, eliminating human error
- **Long-term efficiency** — higher upfront cost, but saves substantial time and effort over the project lifecycle
- **Broad coverage** — can cover more scenarios and run in parallel across platforms and configurations
- **Early defect detection** — CI/CD integration allows tests to run after every code change

**Disadvantages:**
- **High initial investment** — requires tooling, specialist skills, and time to write scripts
- **Requires programming skills** — automation engineers must be able to code
- **Maintenance overhead** — scripts must be updated whenever functionality or UI changes; fragile UI tests are especially costly
- **Cannot replace manual testing entirely** — unsuitable for usability, exploratory, and visual testing
- **Tests only what was programmed** — automation has no intuition and won't find unexpected defects outside its scripts

**When to use:**
- Regression testing that runs frequently
- Smoke and sanity checks for build stability
- Load and stress testing
- API testing
- Long-term projects with frequent releases and CI/CD pipelines
- Testing across multiple browsers, OS versions, or configurations

> [!tip] Manual vs Automated — at a glance
> | Criterion | Manual | Automated |
> |---|---|---|
> | Initial cost | Low | High |
> | Long-term cost | High | Low |
> | Speed | Slow | Fast |
> | Repeatability | Low | High |
> | Good for | Exploratory, usability, visual | Regression, load, API, CI/CD |
> | Requires coding | No | Yes |

---

## Testing Levels

> [!warning] Hierarchy: from smallest unit to the full system
> **Unit** → **Integration** → **System** → **Acceptance**
> Each level tests a broader scope and involves different stakeholders.

- **Unit Testing**. Testing of the smallest isolated pieces of code — individual functions, methods, or classes — to verify each component works correctly in isolation. Primarily performed by **developers**, often written alongside the code itself. Sometimes also by **automation engineers**.

- **Integration Testing**. Testing of interactions between multiple modules or components combined together. Goal: detect defects in interfaces and data exchange between parts of the system. Performed by **developers** or **QA / automation engineers**.

- **System Testing**. Testing of the fully integrated system against its requirements and specifications. Covers functional behavior, performance, security, usability, and other non-functional requirements under conditions close to real production. Performed primarily by **QA engineers**.

- **Acceptance Testing**. Formal testing to confirm that the system meets business requirements and is ready for deployment. Often includes alpha and beta testing. Performed by **clients, end users, business analysts**, or designated QA representatives acting on behalf of users. → see [[#User Acceptance Testing (UAT)]]

> [!tip] Quick comparison
> | Level | What is tested | Who runs it | Goal |
> |---|---|---|---|
> | Unit | Individual functions / classes | Developers | Verify isolated logic |
> | Integration | Interactions between modules | Developers / QA | Verify data flow between components |
> | System | Entire integrated system | QA engineers | Verify full system against requirements |
> | Acceptance | Business requirements and user needs | Client / end users | Confirm readiness for release |

---

## Interview Questions

### Top 15

**1. What is the difference between functional and non-functional testing?**
Functional testing checks *what* the system does — whether features work according to requirements. Non-functional testing checks *how well* the system does it — performance, security, usability, reliability, and other quality characteristics.

**2. What is the difference between Black-box, White-box, and Grey-box testing?**
Black-box: no knowledge of internal code, tested through inputs/outputs only. White-box: full access to source code, internal logic is verified directly. Grey-box: partial knowledge (e.g. API specs, architecture diagrams) — more targeted than black-box, less exhaustive than white-box.

**3. What is regression testing and when is it performed?**
Regression testing verifies that new changes (bug fixes, new features, refactoring) did not break existing functionality. It is performed after any code change, covering the areas of the system most likely to be affected.

**4. What is the difference between regression testing and retesting?**
Retesting confirms that a *specific known defect* has been fixed — using the same steps that originally found the bug. Regression testing checks that the fix (and other recent changes) did not break anything else in the system.

**5. What is smoke testing? How is it different from sanity testing?**
Smoke testing is a broad, shallow check of the most critical features immediately after a new build — to decide whether the build is stable enough for further testing (Go/No-Go). Sanity testing is a narrow, deeper check of a specific area after a small change — to confirm that the change works and didn't break its immediate surroundings.

**6. What is exploratory testing? How is it different from ad-hoc testing?**
Exploratory testing: the tester has a goal, learns the product, and designs tests simultaneously during execution — structured but without a predefined script. Ad-hoc testing: completely unstructured, no goal or documentation, just a quick intuitive check.

**7. What are the four levels of testing, from smallest to largest scope?**
Unit → Integration → System → Acceptance. Each level tests a broader scope: from isolated functions (Unit) to full business requirements validated by end users (Acceptance).

**8. What is integration testing and what does it verify?**
Integration testing checks the interactions between modules or components that have been combined together. Its goal is to detect defects in interfaces and data exchange between parts of the system — not the internal logic of individual modules.

**9. What is UAT and who performs it?**
User Acceptance Testing is formal testing to confirm that the system meets business requirements and is ready for deployment. It is performed by clients, end users, business analysts, or QA representatives acting on behalf of users.

**10. What is the difference between alpha and beta testing?**
Alpha testing is conducted by the internal team in a controlled environment before release. Beta testing is conducted by real users in real-world conditions after a limited release.

**11. What is performance testing and what subtypes does it include?**
Performance testing evaluates speed, responsiveness, stability, and resource usage. Subtypes: Load (expected user load), Stress (beyond normal limits), Soak (sustained load over time to detect memory leaks or degradation), Volume (large amounts of data), Capacity (maximum load the system can handle), Scalability (how the system handles increasing load).

**12. What is the difference between load testing and stress testing?**
Load testing checks the system under *expected* user load — verifying it performs within acceptable limits during normal operation. Stress testing pushes the system *beyond* its normal limits — to see how and where it fails, and whether it recovers.

**13. What is positive and negative testing?**
Positive testing uses valid inputs to verify the system behaves as expected under normal conditions. Negative testing uses invalid or unexpected inputs to verify the system handles errors gracefully and does not crash.

**14. What is risk-based testing?**
Risk-based testing prioritizes test cases based on two factors: the probability that a feature will fail, and the impact of that failure on the system or users. High-risk areas are tested first to get the most value from limited time.

**15. What are the main advantages and disadvantages of automated testing over manual testing?**
Advantages: faster execution, consistent repeatability, no human error, scales well for regression and CI/CD pipelines. Disadvantages: high initial investment, requires coding skills, maintenance overhead when UI changes, cannot replace manual testing for exploratory, usability, or visual checks.

---

### Tricky Questions

**1. After a developer fixes a bug, the QA runs retesting and it passes. Is the job done?**
No. Retesting only confirms the specific defect is fixed. Regression testing still needs to be run to make sure the fix didn't break something else in the system. Both are required — they answer different questions.

**2. Smoke testing is always done manually. True or false?**
False. Smoke testing is frequently automated and integrated into CI/CD pipelines — it runs automatically after every build to decide whether the build is worth testing further. The *decision* to automate or not depends on the project, not on the nature of smoke testing itself.

**3. If all functional tests pass, is the product ready for release?**
Not necessarily. Functional tests only verify that features work according to requirements. Non-functional aspects — performance under load, security vulnerabilities, usability, reliability — are separate concerns that require their own testing. A product can pass every functional test and still be too slow, insecure, or difficult to use.

**4. Black-box testing can achieve 100% code coverage. True or false?**
False. By definition, the black-box tester has no visibility into the source code. They cannot know which code paths exist or which ones have been executed. Full code coverage requires white-box testing, where the tester can see and target specific branches and conditions directly.

**5. Unit testing is the responsibility of the QA team. True or false?**
Primarily false. Unit testing is mainly performed by developers, who write unit tests alongside the code itself. However, automation engineers sometimes write or maintain unit tests as well. The key distinction: unit tests require knowledge of the internal code structure, which is typically in the developer's domain.
