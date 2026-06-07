# Test Artifacts

## Table of Contents

- [[#Planning Artifacts]]
	- [[#Test Strategy]]
	- [[#Test Plan]]
- [[#Design Artifacts]]
	- [[#Test Case]]
	- [[#Checklist]]
	- [[#RTM]]
- [[#Execution Artifacts]]
	- [[#Bug Report]]
	- [[#Test Log]]
- [[#Completion Artifacts]]
	- [[#Test Summary Report]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]

**Related notes:** [[QA manual eng]]

---

## Planning Artifacts

Documents created before testing begins. They define the scope, approach, and resources for the testing effort.

### Test Strategy

**Purpose:** Define the overall approach to testing at the organizational or project level.

**Key Question:** "HOW will we test in general?"

**Characteristics (ISTQB):**
- **Level:** Organizational or project-level (high-level).
- **Audience:** Managers, architects, QA leads.
- **Lifespan:** Long-term (applicable to multiple projects).

**Key Sections:**
1. **Scope of Testing** — types of testing (functional, non-functional, regression). *Example:* "We will test APIs, UI, and databases but exclude third-party payment gateways."
2. **Testing Approach** — methodologies (Agile, Waterfall, DevOps) and testing levels (unit, integration, system, acceptance). *Example:* "Shift-Left Testing: unit tests are written before code (TDD), integration tests during sprint development."
3. **Tools and Environments** — tools (e.g. Jira + TestRail + Selenium) and required environments (DEV, STAGING, PROD-like).
4. **Defect Management** — bug reporting process (e.g. via Jira with P0–P3 priorities) and escalation rules for critical bugs.
5. **Metrics and Reporting** — metrics to collect (e.g. test coverage, bug counts by priority).
6. **Roles and Responsibilities** — who does what (e.g. developers write unit tests, QA writes integration/E2E tests).
7. **Risks and Mitigations** — potential risks (e.g. delays in environment setup) and mitigation strategies.

**Real-World Example:**
> *"For all microservice projects in our company:
> - Unit tests are written by developers (coverage ≥ 80%).
> - Integration tests are automated using Testcontainers.
> - E2E tests are limited to critical user flows (≤ 10% of total tests).
> - Reporting uses Allure + Confluence integration."*

**Example:** → see [[Example Test Strategy]]

---

### Test Plan

**Purpose:** Define the scope, schedule, resources, and approach for one specific testing effort (a single release or sprint).

**Key Question:** "WHAT exactly will we test, WHEN, and with what resources?"

**Characteristics (ISTQB):**
- **Level:** Release or sprint-level (detailed).
- **Audience:** QA team, Project Manager.
- **Lifespan:** Short-term (one release or sprint).

**Key Sections (IEEE 829):**
1. **Test Items** — what is being tested (modules, features, builds). *Example:* "Payment screen v2.4, checkout API, order history page."
2. **Features to Be Tested / Not Tested** — in-scope and out-of-scope items. *Example:* "In scope: card payment. Out of scope: PayPal (not ready)."
3. **Test Approach** — levels and types for THIS release (manual/auto, functional/regression).
4. **Entry / Exit Criteria** — when testing can start and when it is considered done. *Example:* "Exit: 100% critical cases passed, no open P0–P1 defects."
5. **Test Schedule** — timeline, milestones, effort estimation.
6. **Resources and Environment** — people, roles, test environments, tools.
7. **Risks and Contingencies** — release-specific risks and backup plans.
8. **Deliverables** — outputs: test cases, bug reports, test summary report.

**Real-World Example:**
> *"For the v2.4 mobile release:
> - Functional testing of the new payment screen (manual + automated).
> - Regression of the checkout flow (~120 automated cases).
> - Entry: build on STAGING, smoke passed. Exit: 0 open P0–P1 defects.
> - Schedule: 5 working days, 2 QA engineers.
> - Deliverables: results in TestRail + summary in Confluence."*

**Example:** → see [[Example Test Plan]]

> [!tip] Strategy vs Plan
> | | Test Strategy | Test Plan |
> |---|---|---|
> | **Scope** | Whole project or organization | One release or sprint |
> | **Created by** | QA Lead / Test Manager | QA Lead / Test Manager |
> | **Updated** | Rarely (once per project) | Each release cycle |
> | **Contains** | Approach, standards, tools, types of testing | Scope, schedule, resources, entry/exit criteria |
> | **Audience** | Management, all stakeholders | QA team, Project Manager |
> | **Level** | High-level ("what approach") | Detailed ("what exactly to test") |

---

## Design Artifacts

Documents created during the analysis and design phase. They describe what to test and how to test it.

### Test Case

**Definition** — A document describing a specific scenario: preconditions, input data, steps to execute, and the expected result.

**Goal:** To verify a specific requirement or piece of functionality in a repeatable, documented way.

**Attributes:**

| # | Field | Description |
|---|---|---|
| 1 | **ID** | Unique identifier (e.g. TC-001) |
| 2 | **Title** | Short description of what is being tested |
| 3 | **Priority** | Importance of the test (High / Medium / Low) |
| 4 | **Pre-conditions** | State the system must be in before execution |
| 5 | **Test Data** | Specific input values needed to run the test |
| 6 | **Steps** | Numbered sequence of actions to perform |
| 7 | **Expected Result** | What should happen after the steps are completed |
| 8 | **Actual Result** | What actually happened (filled during execution) |
| 9 | **Status** | Pass / Fail / Blocked / Skipped |
| 10 | **Post-conditions** | State the system should be in after execution |

**Advantages:**
- High precision — every step is documented
- Repeatable — anyone can execute it and get the same result
- Provides evidence of testing for audits and reports

**Disadvantages:**
- Time-consuming to create and maintain
- Can become stale if requirements change and cases are not updated

**Example:** → see [[Example Test Case]]

### Checklist

**Definition** — A simplified list of items or conditions to verify during testing, without detailed steps.

**Goal:** To ensure no important functionality is missed, while keeping the process fast and flexible.

**Advantages:**
- Fast to create — suitable for early stages or tight deadlines
- Flexible — the tester decides how to verify each item
- Good for exploratory and smoke testing

**Disadvantages:**
- Results depend heavily on tester experience
- No steps recorded — hard to reproduce an issue found via checklist
- Not sufficient for formal audits or compliance testing

> [!tip] Test Case vs Checklist
> | | Test Case | Checklist |
> |---|---|---|
> | **Detail level** | High (step-by-step) | Low (items to check) |
> | **Creation time** | High | Low |
> | **Maintenance** | High effort | Minimal effort |
> | **Flexibility** | Low | High |
> | **Reproducibility** | High | Low |
> | **Best for** | Regression, formal testing | Smoke, exploratory testing |

### RTM

**Definition** — **Requirements Traceability Matrix**. A table that links each requirement to the test cases that verify it.

**Goal:** To ensure 100% test coverage of all requirements and to show the impact of a requirement change.

**Advantages:**
- Immediately shows which requirements have no test coverage
- Helps during impact analysis — change one requirement, see which tests are affected
- Required for formal and regulated projects (banking, medical)

**Disadvantages:**
- Takes time to create and keep synchronized with changing requirements
- Adds overhead in fast-moving Agile teams

---

## Execution Artifacts

Documents created during or immediately after test execution.

### Bug Report

**Definition** — A document that describes a defect found during testing in enough detail for a developer to reproduce and fix it.

**Goal:** To communicate a defect clearly so it can be assigned, tracked, and resolved.

→ Full coverage of Bug Report structure, severity, priority, and defect life cycle: [[07 Bug Report and Defect Life Cycle]]

### Test Log

**Definition** — A chronological record of what happened during a test session: which tests were run, at what time, and with what result.

**Goal:** To provide a traceable record of the test execution for later analysis and reporting.

---

## Completion Artifacts

Documents created after testing is finished to summarize what was done and what was found.

### Test Summary Report

**Definition** — A document that summarizes the entire testing effort: scope covered, tests executed, defects found, and remaining risks.

**Goal:** To give stakeholders the information they need to make a Go / No-Go release decision.

**Typical contents:**
- Total tests planned vs executed vs passed vs failed
- Number and severity of open defects
- Features not tested (out of scope or blocked)
- Risks and recommendations

**Advantages:**
- Gives a clear picture of product quality at release time
- Highlights known risks that stakeholders must accept
- Serves as a historical record for future projects

---

## Interview Questions

### Top 10

**1. What is a test artifact? Name the main ones.**
A test artifact is any document produced during the testing process. Main artifacts: Test Strategy, Test Plan, Test Case, Checklist, RTM, Bug Report, Test Log, Test Summary Report.

**2. What is the difference between a Test Strategy and a Test Plan?**
Test Strategy is a high-level document covering the whole project or organization — it defines the approach, tools, and types of testing. It is created once and rarely changes. A Test Plan is release-specific — it defines scope, schedule, resources, and entry/exit criteria for one testing cycle. A project can have one Strategy and many Plans.

**3. What fields does a Test Case contain?**
ID, Title, Priority, Pre-conditions, Test Data, Steps, Expected Result, Actual Result, Status, Post-conditions.

**4. What is the difference between a Test Case and a Checklist?**
A Test Case has detailed numbered steps and a specific expected result — it is repeatable and formal. A Checklist is a list of items to verify without steps — it is fast to create and flexible, but relies on tester experience and is not easily reproducible.

**5. When would you use a Checklist instead of Test Cases?**
Checklists are used when time is limited, during smoke testing, exploratory sessions, or early-stage testing where requirements are not yet stable. Test Cases are used for regression testing, formal acceptance, and compliance scenarios.

**6. What is an RTM and why is it needed?**
RTM (Requirements Traceability Matrix) maps each requirement to the test cases that verify it. It ensures full coverage — no requirement is left untested — and helps with impact analysis when requirements change.

**7. What is a Test Summary Report and who reads it?**
A Test Summary Report summarizes the testing effort: tests planned vs executed, pass/fail counts, open defects, and remaining risks. It is read by project managers, product owners, and stakeholders to decide whether to release.

**8. What is the difference between a Test Log and a Test Summary Report?**
A Test Log is a raw, chronological record of what happened during execution — which test ran, at what time, what was the result. A Test Summary Report is a processed summary of the whole testing cycle for decision-making.

**9. Can a project have both a Test Strategy and a Test Plan?**
Yes, and it is the normal setup. The Strategy is written once for the project (or organization) and covers the overall approach. The Plan is written for each release and contains the specific details for that cycle.

**10. Who creates the Test Plan?**
Typically the QA Lead or Test Manager. In smaller teams, a senior QA engineer may create it. It is reviewed and approved by the Project Manager and sometimes the client.

---

### Tricky Questions

**1. Can you do testing without writing test cases?**
Yes — using checklists, exploratory testing, or experience-based techniques. In fast-moving Agile teams this is common. However, without test cases there is no documented proof of testing, no easy way to reproduce found defects, and no stable base for regression. It is a trade-off between speed and formality.

**2. Is a Bug Report a test artifact?**
Yes. It is created by QA during the execution phase and documents a discovered defect. It is tracked in the bug tracker and is part of the formal testing output. The Test Summary Report summarizes the defects found, so Bug Reports feed into other artifacts.

**3. If requirements change mid-sprint, what happens to the RTM?**
The RTM must be updated. Old test cases that covered the changed requirement need to be revised or marked obsolete, and new test cases for the updated requirement must be added and linked. If the RTM is not maintained, it becomes misleading — it will show coverage that no longer reflects reality.

**4. What is the difference between a Test Summary Report and a Test Report?**
In practice these terms are often used interchangeably. Strictly, a Test Report can be any report about testing (a daily status report, a defect density report), while a Test Summary Report specifically summarizes the entire testing cycle and is the final document before a release decision. Always clarify which is meant in your project context.
