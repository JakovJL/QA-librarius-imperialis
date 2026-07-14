# Automation Testing Basic Theory

## Table of Contents

- [[#How to Use This Note]]
- [[#Matrix Coverage]]
- [[#Questions and Answers]]
	- [[#1. What Is Test Automation and Why Do We Need It?]]
	- [[#2. Is Test Automation Suitable for Every Project?]]
	- [[#3. What Types of Testing Can Be Automated?]]
	- [[#4. How Does Automation Relate to QA, QC, and Testing?]]
	- [[#5. What Is the Classic Test Pyramid?]]
	- [[#6. What Is the Reverse Test Pyramid?]]
	- [[#7. How Can Test Distribution Differ for Frontend and Backend Projects?]]
	- [[#8. How Would You Introduce Automation on a Project?]]
	- [[#9. What Problems Can Prevent a Team From Following the Test Pyramid?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## How to Use This Note

These questions move from basic definitions to automation strategy. Explain the business or engineering goal before naming a tool. Automation is useful when it provides reliable feedback at an acceptable cost.

---

## Matrix Coverage

| Matrix requirement | Covered in questions |
|---|---|
| Definition, tasks, goals, and value of automation | 1 |
| Project suitability and implementation criteria | 2 |
| Acceptance, unit, integration, UI, E2E, load, security, regression, and functional testing | 3 |
| Automation in QA, QC, and testing | 4 |
| Classic and reverse test pyramids | 5–6 |
| General, frontend, and backend test distribution | 7 |
| Automation strategy and implementation stages | 8 |
| Real project problems and corrections | 9 |

---

## Questions and Answers

### 1. What Is Test Automation and Why Do We Need It?

**Short answer:**

Test automation uses software to prepare data, execute checks, compare actual and expected results, and report outcomes with limited manual work. Its goals are faster feedback, repeatable Regression testing, wider useful coverage, and earlier detection of defects.

**Tasks automation can support:**

- run repetitive checks on every build;
- verify many data combinations;
- test APIs, services, UI, performance, or security rules;
- prepare test data and environments;
- collect logs, screenshots, and reports;
- provide feedback in CI/CD.

> [!danger] Core rule
> Automation does not replace testing or human judgement. It executes programmed checks; people still explore, analyse risks, clarify requirements, and evaluate unexpected behaviour.

### 2. Is Test Automation Suitable for Every Project?

**Short answer:**

No. Automation is valuable when checks are repeated, requirements are stable enough, results are objective, and saved execution effort is greater than development and maintenance cost. A short project or rapidly changing prototype may not recover the investment.

**Good candidates:**

- critical business flows;
- stable Regression testing scenarios;
- repeated checks across builds, browsers, data sets, or environments;
- API and integration checks with clear expected results;
- time-consuming manual setup or calculation;
- tests that must provide fast CI feedback.

**Poor candidates:**

- one-time checks;
- rapidly changing features before the behaviour is understood;
- subjective usability or visual judgement without a suitable tool;
- scenarios blocked by CAPTCHA or uncontrolled third parties;
- low-value checks with high maintenance cost.

The decision should consider expected lifetime, execution frequency, risk, testability, team skills, tools, environment, and maintenance.

### 3. What Types of Testing Can Be Automated?

**Short answer:**

Many types can be partly or fully automated: unit, integration, API, UI, E2E, Regression, functional, acceptance, load, and some security testing. The correct level depends on the risk and the fastest reliable place to verify the behaviour.

**Examples:**

- **Unit:** business rule inside one class or function.
- **Integration:** database, service, queue, or component interaction.
- **API:** contract, status, data, authorization, and error handling.
- **UI:** critical user flow and browser behaviour.
- **E2E:** a small number of complete business flows.
- **Acceptance:** executable examples agreed with business stakeholders.
- **Load:** response time, throughput, and stability under traffic.
- **Security:** dependency, static, dynamic, or configuration scans plus specific checks.

Not every test of these types should be automated. The team selects valuable, repeatable, and maintainable checks.

### 4. How Does Automation Relate to QA, QC, and Testing?

**Short answer:**

QA is process-oriented and aims to prevent quality problems. QC is product-oriented and checks the result. Testing is one QC activity. Test automation supports testing and other technical quality checks, but it is only one part of the wider QA process.

> [!tip] QA vs QC vs Testing vs Automation
> | Term | Main focus | Example |
> |---|---|---|
> | QA | Improve and prevent problems in the process | Review Definition of Done |
> | QC | Evaluate product quality | Review test results and defects |
> | Testing | Execute checks and investigate behaviour | Test the checkout flow |
> | Test automation | Execute suitable checks with software | Run checkout API tests in CI |

Automation can also support QA goals indirectly by providing fast feedback, trends, and evidence for process improvement.

### 5. What Is the Classic Test Pyramid?

**Short answer:**

The classic Test Pyramid recommends many fast and isolated unit tests, fewer integration or service tests, and a small number of slow E2E or UI tests. The goal is fast, stable, and cost-effective feedback.

```text
        E2E / UI        few, slow, expensive
       Integration     medium amount
      Unit tests       many, fast, isolated
```

The pyramid is a guideline, not a required percentage. A team should place a check at the lowest level that can verify the risk with enough confidence.

### 6. What Is the Reverse Test Pyramid?

**Short answer:**

The reverse pyramid, often called the Ice Cream Cone anti-pattern, has many UI or E2E tests and too few lower-level tests. It usually creates slow feedback, flaky failures, difficult diagnosis, and high maintenance cost.

**How to improve it:**

- move business-rule checks to unit tests;
- move service behaviour to API or integration tests;
- keep UI tests for browser-specific behaviour and critical user flows;
- improve testability, stable data, and environment control;
- remove duplicate or low-value E2E tests.

The goal is not to delete all UI tests. It is to avoid verifying the same rule through the most expensive layer when a lower layer gives enough confidence.

### 7. How Can Test Distribution Differ for Frontend and Backend Projects?

**Short answer:**

The distribution depends on architecture and risk. A frontend-heavy project can have unit tests for logic, many component and integration tests, and fewer browser E2E tests. A backend project usually has many unit, service-integration, API, contract, database, and messaging tests with very few UI tests.

> [!tip] Frontend vs Backend Test Distribution
> | Project | Main automated layers |
> |---|---|
> | Frontend | Unit, component, integration, accessibility, limited browser E2E |
> | Backend | Unit, API, service integration, contract, database, messaging |
> | Full product team | Balanced unit, component or service, integration, API, and critical E2E |

There is no universal shape for every project. The team should cover important risks without creating unnecessary slow tests.

### 8. How Would You Introduce Automation on a Project?

**Short answer:**

I start with product goals and current problems, not with a tool. I assess testability, risks, architecture, existing tests, team skills, environments, data, and CI. Then I define a strategy, select a small high-value pilot, measure it, and expand only when the approach is reliable.

**Implementation stages:**

1. Define the problem, goals, scope, and success metrics.
2. Analyse architecture, risks, test levels, and current manual effort.
3. Select automation candidates and decide what should remain manual.
4. Choose the stack and framework architecture based on project needs.
5. Prepare environments, data, reporting, ownership, and CI execution.
6. Implement a small pilot for critical and stable scenarios.
7. Review reliability, feedback time, maintenance effort, and value.
8. Scale coverage, document standards, train the team, and remove low-value tests.

Useful metrics include execution time, pass reliability, flaky-test rate, feedback time, maintenance effort, defect detection, and coverage of critical risks.

### 9. What Problems Can Prevent a Team From Following the Test Pyramid?

**Short answer:**

Common problems are legacy code without unit-test support, poor testability, separate teams with unclear ownership, unstable environments and data, pressure to automate only through UI, and missing access to lower layers. I identify the constraint and improve the distribution gradually instead of forcing a perfect shape immediately.

**Practical responses:**

- add API or component tests around changed areas;
- ask developers to cover new business logic with unit tests;
- introduce test hooks, dependency injection, stable test data, or service virtualisation;
- quarantine and fix flaky tests instead of accepting unreliable results;
- keep a small critical UI suite and move duplicated checks down;
- agree on ownership and quality gates across frontend, backend, and QA.

**Interview example structure:**

Explain the initial problem, why the team could not follow the ideal pyramid, what change you made, and what improved. Do not claim a perfect pyramid if the project did not have one.

---

## Theory Links

- Automation goals, selection criteria, rollout, CI, and common mistakes: [[16 Test Automation Fundamentals]]
- Pyramid layers and anti-patterns: [[04 Test Pyramid]]
- Regression testing selection: [[10 Regression Testing]]
- Performance automation: [[17 Performance Testing]]
- Security checks and tool limits: [[15 Security Testing Basics]]
