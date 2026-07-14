# Test Documentation and Bug Tracking Systems

## Table of Contents

- [[#How to Use This Note]]
- [[#Matrix Coverage]]
- [[#Questions and Answers]]
	- [[#1. What Test Documentation Do You Know?]]
	- [[#2. What Is the Difference Between a Test Case and a Checklist?]]
	- [[#3. What Makes a Good Bug Report?]]
	- [[#4. What Is the Difference Between a Test Plan and a Test Strategy?]]
	- [[#5. What Is a Test Suite and How Do You Structure Test Documentation?]]
	- [[#6. How Do You Use Traceability and Coverage Metrics?]]
	- [[#7. How Do You Use Jira, TFS, or Redmine?]]
	- [[#8. How Do Filters and Queries Help QA Work?]]
	- [[#9. How Do Boards, Dashboards, and Reports Differ?]]
	- [[#10. How Would You Standardise and Improve the Process?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## How to Use This Note

Start with the purpose of an artifact or tool, then name its key parts and give one practical example. An Automation QA engineer still needs to create and maintain manual test documentation and clear bug reports.

---

## Matrix Coverage

| Matrix requirement | Covered in questions |
|---|---|
| Test cases, checklists, bug reports, Test Plan, and Test Strategy | 1–4 |
| Test suites and documentation structure | 5 |
| Traceability matrix, coverage maps, templates, and quality metrics | 6, 10 |
| Jira, TFS, Redmine, task and defect attributes | 7 |
| Filters, queries, plugins, integrations, and tuning | 8, 10 |
| Boards, dashboards, and reports | 9 |
| Custom workflows, permissions, custom fields, and automation | 10 |
| Team standards, reviews, and training | 10 |

---

## Questions and Answers

### 1. What Test Documentation Do You Know?

**Short answer:**

Test documentation records how testing is planned, designed, executed, and completed. Common artifacts are Test Strategy, Test Plan, test case, checklist, test suite, RTM, bug report, test log, test progress report, and Test Summary Report.

**By stage:**

- **Planning:** Test Strategy and Test Plan.
- **Design:** test cases, checklists, test suites, test data, and RTM.
- **Execution:** test results, logs, bug reports, and progress reports.
- **Closure:** Test Summary Report, remaining risks, and lessons learned.

The project should create documentation that gives useful evidence and supports decisions. More documents do not automatically mean better quality.

### 2. What Is the Difference Between a Test Case and a Checklist?

**Short answer:**

A test case contains preconditions, test data, steps, and an expected result, so another person can repeat the check. A checklist is a shorter list of items to verify and gives the tester more freedom in execution.

> [!tip] Test Case vs Checklist
> | | Test Case | Checklist |
> |---|---|---|
> | Detail | High | Low |
> | Repeatability | High | Depends more on tester experience |
> | Maintenance cost | Higher | Lower |
> | Useful for | Regression, acceptance, formal evidence | Smoke, exploratory work, fast-changing features |

**How to choose:**

I consider risk, required evidence, team experience, change frequency, and available time. A critical payment flow may need detailed test cases, while a quick exploratory session can use a checklist.

### 3. What Makes a Good Bug Report?

**Short answer:**

A good bug report is clear, reproducible, and supported by evidence. It contains a specific title, environment, preconditions, steps, expected and actual results, severity, priority, attachments, and links to requirements or related tasks.

**Example title:**

`[Checkout][Chrome] Order is created twice after double-clicking the Pay button`

**Important details:**

- use the smallest reliable set of reproduction steps;
- attach screenshots, video, logs, request and response data, or stack traces when useful;
- remove passwords, tokens, and personal data from evidence;
- link duplicates, blocked tasks, test cases, or the affected requirement;
- describe facts, not guesses about the cause.

Severity describes impact. Priority describes how soon the defect should be fixed and depends on business context.

### 4. What Is the Difference Between a Test Plan and a Test Strategy?

**Short answer:**

A Test Strategy is a high-level approach for a project or organisation. It describes principles, test levels, types, tools, environments, roles, and risk approach. A Test Plan applies that approach to a specific release or testing effort and defines scope, schedule, resources, entry and exit criteria, and deliverables.

> [!tip] Test Strategy vs Test Plan
> | | Test Strategy | Test Plan |
> |---|---|---|
> | Main question | How do we test in general? | What, when, and by whom do we test now? |
> | Level | Project or organisation | Release, phase, or testing effort |
> | Change rate | Relatively stable | Changes with scope and schedule |

Both documents must stay consistent. For example, a release Test Plan should not select tools or test levels that contradict the approved Test Strategy without explaining the change.

### 5. What Is a Test Suite and How Do You Structure Test Documentation?

**Short answer:**

A test suite is a logical group of test cases prepared for a common goal, feature, level, or execution type. I structure documentation so that people can find tests, understand coverage, and maintain it without unnecessary duplication.

**Possible structure:**

```text
Product
├── Authentication
│   ├── Smoke
│   ├── Functional
│   └── Regression
├── Orders
│   ├── API
│   └── UI
└── Payments
    ├── Positive
    └── Negative
```

Useful rules include clear naming, stable IDs, reusable preconditions, links to requirements, ownership, review status, and an archive for obsolete tests. The structure should reflect how the team searches, executes, and reports tests.

### 6. How Do You Use Traceability and Coverage Metrics?

**Short answer:**

An RTM links requirements to test cases and results. A coverage map shows which features, risks, platforms, or code areas are covered. These tools help find gaps and support change-impact analysis, but the numbers must be interpreted with risk and test quality.

**Useful checks and metrics:**

- requirements with no linked tests;
- tests with no current requirement or purpose;
- critical business flows without Regression testing;
- executed, passed, failed, blocked, and not-run tests;
- automated coverage by layer or feature;
- escaped defects and defect distribution by area.

> [!caution] Metric limitation
> A high coverage percentage does not prove that the tests are useful. Weak assertions or missing negative scenarios can produce a good-looking number and poor protection.

### 7. How Do You Use Jira, TFS, or Redmine?

**Short answer:**

Jira, TFS or Azure DevOps, and Redmine can manage tasks, defects, links, comments, attachments, status changes, and reports. I create items using the project template, set correct fields and relationships, follow the agreed workflow, and keep the information current.

**Typical QA work:**

- create and update defects and testing tasks;
- link a defect to a story, requirement, test, duplicate, or blocked item;
- use labels, components, versions, severity, priority, and assignee;
- participate in triage and follow the defect life cycle;
- attach safe evidence and record Retest results;
- monitor sprint or release progress.

The exact names of fields and statuses depend on the project configuration.

### 8. How Do Filters and Queries Help QA Work?

**Short answer:**

Filters and queries select items by conditions such as project, type, status, assignee, component, version, priority, or date. Saved queries make repeated checks faster and can provide data for boards, dashboards, reports, and automation.

**Examples:**

- open critical defects for the current release;
- defects waiting for Retest;
- issues without an owner;
- reopened defects by component;
- tasks blocked longer than two days;
- defects created after the latest build.

A useful query must have a clear purpose. A complex filter that nobody understands is difficult to maintain and can hide important work.

### 9. How Do Boards, Dashboards, and Reports Differ?

**Short answer:**

A board visualises items moving through a workflow. A dashboard combines widgets and metrics for ongoing monitoring. A report analyses status or results for a period, milestone, sprint, release, or audience.

> [!tip] Board vs Dashboard vs Report
> | | Board | Dashboard | Report |
> |---|---|---|---|
> | Main purpose | Manage work flow | Monitor key information | Explain status and results |
> | Typical content | Cards and workflow columns | Charts, counters, trends, filters | Scope, results, defects, risks, conclusions |
> | Typical use | Daily team work | Regular monitoring | Sprint, release, audit, or decision point |

Good visualisation focuses on decisions. A QA dashboard can show testing progress, blocking defects, automation results, and trends, while the Test Summary Report explains remaining risks for a release decision.

### 10. How Would You Standardise and Improve the Process?

**Short answer:**

I first analyse the current problems and users of the system. Then I agree on minimum templates, naming rules, required fields, workflows, responsibilities, reviews, and useful metrics. I introduce changes gradually, document them, train the team, and check whether they improve quality and transparency.

**Senior-level configuration can include:**

- custom workflows and transition rules;
- permissions for viewing, editing, and approving items;
- custom fields and field validation;
- plugins and integrations with TMS, CI, source control, or reporting tools;
- automation for assignment, notifications, status changes, or stale items;
- standard dashboards and saved queries for different audiences.

> [!caution] Common mistake
> Do not add fields, statuses, plugins, or reports without a clear need. Extra configuration increases maintenance and can make the process slower.

---

## Theory Links

- Test Strategy, Test Plan, test cases, checklists, RTM, and reports: [[03 Test Artifacts]]
- Bug-report fields, severity, priority, and defect workflow: [[07 Bug Report and Defect Life Cycle]]
- Jira, Redmine, TFS, reporting, and process control: [[14 Test Management]]

