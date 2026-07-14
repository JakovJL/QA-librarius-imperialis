# Processes and Methodologies

## Table of Contents

- [[#How to Use This Note]]
- [[#Matrix Coverage]]
- [[#Questions and Answers]]
	- [[#1. What Are SDLC and STLC, and What Is the QA Role?]]
	- [[#2. How Do Waterfall and Agile Differ?]]
	- [[#3. How Do Scrum and Kanban Work?]]
	- [[#4. What Happens During a Sprint?]]
	- [[#5. What Is the Difference Between a Test Strategy and a Test Plan?]]
	- [[#6. How Do You Organise Regression, Acceptance, and Exploratory Testing?]]
	- [[#7. How Do You Organise Defect Management?]]
	- [[#8. What Is the Difference Between BDD, TDD, and ATDD?]]
	- [[#9. How Does QA Participate in Requirements Work?]]
	- [[#10. How Would You Build or Improve a QA Process?]]
	- [[#11. What Is the Role of an Automation QA Engineer in QA Processes?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## How to Use This Note

This topic checks whether an Automation QA engineer understands the whole product and testing process, not only automated test code. Give a short definition first, then explain the QA role and provide a practical example.

---

## Matrix Coverage

| Matrix requirement | Covered in questions |
|---|---|
| SDLC, STLC, and the QA role in every phase | 1 |
| Waterfall, Agile, Scrum, and Kanban | 2–4 |
| Sprint planning, backlog, Daily Stand-up, and other ceremonies | 4 |
| Test Strategy, Test Plan, and test documentation | 5 |
| Regression, acceptance, and exploratory testing | 6 |
| Bug reporting and defect management | 7 |
| BDD, TDD, and ATDD | 8 |
| Requirements collaboration | 9 |
| QA process creation, audit, retrospective, training, and adaptation | 10 |
| Manual testing competence for Automation QA | 11 |

---

## Questions and Answers

### 1. What Are SDLC and STLC, and What Is the QA Role?

**Short answer:**

SDLC is the complete Software Development Life Cycle, from idea and requirements to development, release, operation, and maintenance. STLC is the testing life cycle inside SDLC: requirements analysis, test planning, test design, environment preparation, execution, reporting, and closure. QA should participate throughout SDLC to prevent defects early and provide quality information.

**QA contribution by phase:**

| Phase | QA contribution |
|---|---|
| Requirements | Check clarity, consistency, acceptance criteria, and testability |
| Design | Review risks, architecture, interfaces, and test approach |
| Development | Prepare tests, data, environments, and automation; support early checks |
| Testing | Execute tests, report defects, Retest fixes, and run Regression testing |
| Release | Report quality and risks; support the go/no-go decision |
| Production | Analyse incidents and improve tests and processes |

### 2. How Do Waterfall and Agile Differ?

**Short answer:**

Waterfall uses sequential phases with most planning completed early. Agile delivers software in small increments and uses frequent feedback and changing priorities. Waterfall fits stable and regulated work, while Agile fits products that need learning and regular change.

> [!tip] Waterfall vs Agile
> | | Waterfall | Agile |
> |---|---|---|
> | Flow | Sequential phases | Short iterations or continuous flow |
> | Requirements | Expected to be stable early | Can evolve with feedback |
> | Testing | Often concentrated after development | Runs throughout development |
> | Delivery | Usually one large release | Frequent small releases |
> | Change cost | Often high | Managed through backlog reprioritisation |

**How to choose:**

Consider requirement stability, regulation, release frequency, customer feedback, technical risk, and the team's ability to collaborate. A real project can use a hybrid approach.

### 3. How Do Scrum and Kanban Work?

**Short answer:**

Scrum organises work into fixed-length sprints and defines roles, events, and a sprint goal. Kanban manages continuous flow using a visual board and work-in-progress limits. Scrum is useful for planned increments; Kanban is useful when priorities change often or work arrives continuously.

> [!tip] Scrum vs Kanban
> | | Scrum | Kanban |
> |---|---|---|
> | Work cycle | Fixed sprint | Continuous flow |
> | Commitment | Sprint backlog and sprint goal | Pull the next item when capacity is free |
> | Main control | Sprint events and agreed work | Work-in-progress limits and flow metrics |
> | Change during work | Usually protected inside a sprint | Can be reprioritised more easily |

### 4. What Happens During a Sprint?

**Short answer:**

During Sprint Planning, the team selects backlog items and defines a sprint goal. During the sprint, the team develops and tests the increment and uses the Daily Stand-up to inspect progress and blockers. At the Sprint Review, stakeholders inspect the result. At the Retrospective, the team improves its way of working.

**Important terms:**

- **Product backlog:** ordered list of product work.
- **Sprint backlog:** selected work and the plan for the current sprint.
- **Backlog refinement:** clarification, decomposition, and estimation of future items.
- **Daily Stand-up:** short coordination event, not a detailed status report to a manager.
- **Definition of Done:** shared quality conditions that an increment must meet.

**QA role:**

QA clarifies acceptance criteria, estimates testing, prepares tests and data, tests within the sprint, reports risks, and helps keep the increment potentially releasable.

### 5. What Is the Difference Between a Test Strategy and a Test Plan?

**Short answer:**

A Test Strategy is a high-level approach to quality and testing for a project or organisation. It describes principles, test levels, test types, tools, environments, roles, and risk approach. A Test Plan applies the approach to a specific release or testing effort and defines scope, schedule, resources, entry and exit criteria, and deliverables.

> [!tip] Test Strategy vs Test Plan
> | | Test Strategy | Test Plan |
> |---|---|---|
> | Main question | How do we test in general? | What, when, and by whom do we test now? |
> | Level | Project or organisation | Release, phase, or testing effort |
> | Change rate | Relatively stable | Updated when scope and schedule change |

**Maintenance:**

Both documents must match the current product risks and architecture. A document that is not updated does not guide the team and creates false confidence.

### 6. How Do You Organise Regression, Acceptance, and Exploratory Testing?

**Short answer:**

Regression testing checks that changes have not broken existing behaviour. Acceptance testing checks whether the product meets business needs and acceptance criteria. Exploratory testing combines learning, test design, and execution during a time-boxed session. I plan them according to risk, change impact, and release goals.

**Practical approach:**

- Select Regression testing by business criticality, changed areas, integrations, and defect history.
- Define acceptance scenarios with the product owner, analyst, customer, or users.
- Give exploratory testing a charter, time box, target area, notes, and result summary.
- Record coverage, defects, untested areas, and remaining risks.

### 7. How Do You Organise Defect Management?

**Short answer:**

I define how defects are reported, triaged, assigned, fixed, verified, and closed. A bug report contains a clear title, environment, steps, expected and actual results, evidence, severity, and relevant links. The team agrees on statuses, responsibilities, and escalation rules.

**Typical flow:**

```text
New → Triaged → Assigned → In Progress → Fixed → Retest → Closed
```

A defect can also be rejected, marked as a duplicate, postponed, or reopened. The exact workflow depends on the project.

**Important distinction:**

Severity describes technical or user impact. Priority describes how soon the team should fix the defect and depends on business context.

### 8. What Is the Difference Between BDD, TDD, and ATDD?

**Short answer:**

TDD is a development practice where a developer writes a failing technical test before production code, implements the minimum code, and then refactors. BDD uses examples and shared business language to describe behaviour. ATDD defines acceptance examples collaboratively before implementation to confirm that the feature meets business needs.

> [!tip] BDD vs TDD vs ATDD
> | | TDD | BDD | ATDD |
> |---|---|---|---|
> | Main focus | Code design and correctness | Behaviour understood by the team | Business acceptance |
> | Typical participants | Developers | Developers, QA, analysts, business | Customer or product, QA, developers |
> | Typical form | Unit tests | Given–When–Then scenarios | Acceptance examples or tests |

These approaches can be used together. BDD is not only a Cucumber test script, and TDD is not the same as writing unit tests after the code.

### 9. How Does QA Participate in Requirements Work?

**Short answer:**

QA reviews requirements before development, asks questions, finds ambiguity and contradictions, checks acceptance criteria, and identifies missing negative, boundary, security, performance, and integration cases. This is a Shift-Left activity because it prevents defects before they reach code.

**Questions QA can ask:**

- Who is the user and what business problem is solved?
- What are the valid, invalid, and boundary conditions?
- What happens when a dependency is unavailable?
- Which roles and permissions are involved?
- How will we know that the feature is accepted?
- What logs, metrics, or audit data are required?

### 10. How Would You Build or Improve a QA Process?

**Short answer:**

I first study the product, risks, team workflow, current problems, and delivery goals. Then I define responsibilities, quality criteria, test levels, environments, defect workflow, automation approach, reporting, and feedback loops. I introduce changes step by step and measure whether they solve real problems.

**Improvement cycle:**

1. Observe the current process and collect evidence.
2. Find the largest quality or delivery risk.
3. Agree on one measurable improvement.
4. Run it for a defined period.
5. Review results in a retrospective or quality audit.
6. Keep, change, or remove the practice.

**Examples of evidence:** escaped defects, flaky tests, long feedback time, repeated production incidents, unclear requirements, slow defect resolution, or large untested areas.

> [!caution] Common mistake
> Do not copy a process only because another project uses it. Adapt the process to the product, risks, regulation, team size, and release model.

### 11. What Is the Role of an Automation QA Engineer in QA Processes?

**Short answer:**

An Automation QA engineer is still a QA engineer. I need manual testing fundamentals, test design, requirements analysis, risk thinking, defect reporting, and knowledge of SDLC and STLC. Automation is one way to make suitable checks repeatable and fast; it does not replace the whole testing process.

**Practical responsibilities:**

- choose valuable scenarios for automation;
- keep automated tests reliable and maintainable;
- provide fast feedback in CI;
- analyse failures instead of reporting every failed test as a product defect;
- support exploratory and manual testing with tools and data;
- communicate quality risks to the team.

---

## Theory Links

- Development models, Agile, Scrum, SDLC, and STLC: [[02 SDLC and STLC]]
- Test Strategy and Test Plan: [[03 Test Artifacts]]
- Defect reporting and workflow: [[07 Bug Report and Defect Life Cycle]]
- Regression testing: [[10 Regression Testing]]
- Planning, monitoring, risks, and process control: [[14 Test Management]]
- Role and limits of automation: [[16 Test Automation Fundamentals]]
