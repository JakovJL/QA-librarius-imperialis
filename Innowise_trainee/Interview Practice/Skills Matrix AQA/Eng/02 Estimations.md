# Estimations

## Table of Contents

- [[#How to Use This Note]]
- [[#Matrix Coverage]]
- [[#Questions and Answers]]
	- [[#1. What Is Test Estimation and How Do You Estimate a Task?]]
	- [[#2. How Do You Estimate Manual and Automated Testing Work?]]
	- [[#3. What Is the Difference Between Function Points and Story Points?]]
	- [[#4. How Does Planning Poker Work?]]
	- [[#5. How Do You Choose an Estimation Technique?]]
	- [[#6. How Do You Handle Risks, Dependencies, and Uncertainty?]]
	- [[#7. How Are Estimates Used in Sprint, Release, and Project Planning?]]
	- [[#8. How Do You Improve Estimation Accuracy?]]
	- [[#9. How Do You Defend and Align an Estimate With the Team?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## How to Use This Note

Answer each question aloud before reading the suggested answer. Start with the short answer, then add the example or explanation if the interviewer asks for more detail.

Automation QA engineers need estimation skills for both manual testing and automation work. An estimate is a forecast based on current information, not a promise.

---

## Matrix Coverage

| Matrix requirement | Covered in questions |
|---|---|
| Estimation of test cases, manual testing, exploratory testing, and automated tests | 1–2 |
| Function points and story points | 3 |
| Planning Poker and team discussion | 4, 9 |
| T-shirt sizing and selection of a model | 5 |
| Risks, dependencies, uncertainty, buffers, and decomposition | 1, 6 |
| Sprint, release, project planning, and Gantt charts | 7 |
| Retrospectives and estimation improvement | 8 |
| Cross-functional estimation and coordination | 9 |

---

## Questions and Answers

### 1. What Is Test Estimation and How Do You Estimate a Task?

**Short answer:**

Test estimation is the process of forecasting the effort, time, and resources needed for testing. I clarify the scope, split the work into small tasks, estimate each task, identify risks and dependencies, add a reasonable buffer, and then review the estimate with the team.

**Example:**

For a login feature, I separate requirement analysis, test design, test data, environment setup, execution, bug reporting, Retest, Regression testing, and reporting. I estimate every part instead of giving one number for the whole feature.

**Important distinction:**

Effort is the amount of work, such as 24 person-hours. Duration is the calendar time needed to finish it. Twenty-four hours of effort may take more than three working days because of meetings, blockers, and dependencies.

### 2. How Do You Estimate Manual and Automated Testing Work?

**Short answer:**

For manual testing, I include analysis, test-case or checklist creation, test data, execution, defect work, Retest, Regression testing, and reporting. For automation, I also include framework analysis, coding, code review, debugging, CI integration, maintenance, and investigation of failed tests.

**Example:**

Automating ten tests is not only the time needed to write ten methods. I must check whether reusable page objects or API clients exist, prepare data, review the code, run it in CI, fix unstable tests, and update documentation or reports.

> [!caution] Common mistake
> Do not estimate only the happy-path execution or the time spent writing code. Supporting work is part of the task.

### 3. What Is the Difference Between Function Points and Story Points?

**Short answer:**

Function points estimate the functional size of software by analysing user-visible inputs, outputs, queries, files, and interfaces. Story points are a team's relative estimate of effort, complexity, and uncertainty for a backlog item. Function points can support project-level comparison, while story points are team-specific and are commonly used for sprint planning.

> [!tip] Function Points vs Story Points
> | | Function Points | Story Points |
> |---|---|---|
> | Measures | Functional size | Relative effort, complexity, and uncertainty |
> | Typical use | Project or product estimation | Backlog and sprint planning |
> | Team-specific | Less dependent on one team's speed | Yes |
> | Converted directly to hours | No | No |

> [!info] Matrix wording
> The matrix says `functionality points`. The common theory term is **function points** or **Function Point Analysis**.

### 4. How Does Planning Poker Work?

**Short answer:**

In Planning Poker, the team discusses a backlog item, and every participant chooses an estimate privately, often from a Fibonacci scale. Everyone reveals the estimates at the same time. People with the highest and lowest values explain their reasoning, the team clarifies risks, and then votes again until it reaches a shared estimate.

**Goal:**

Planning Poker is not only a voting tool. The discussion exposes different assumptions, missing requirements, dependencies, and hidden work.

**Example:**

A developer selects 3 points, but QA selects 8 because the feature needs several environments and a large Regression testing scope. The discussion reveals work that was not visible in the original task description.

### 5. How Do You Choose an Estimation Technique?

**Short answer:**

I choose the technique based on the available information, task size, uncertainty, and planning level. I can combine techniques when one method is not enough.

| Situation | Suitable technique |
|---|---|
| Detailed task with clear scope | Work Breakdown Structure |
| High uncertainty | Three-Point Estimation or PERT |
| Agile backlog item | Story points with Planning Poker |
| Very early rough planning | T-shirt sizing: S, M, L, XL |
| Similar task completed before | Analogy or historical data |
| Project functional size | Function Point Analysis |

**When to use a combination:**

For example, I can use WBS to decompose a feature, PERT for uncertain parts, and historical data to check whether the result is realistic.

### 6. How Do You Handle Risks, Dependencies, and Uncertainty?

**Short answer:**

I write down assumptions, risks, dependencies, and unknowns instead of hiding them inside one number. I use a range or Three-Point Estimation for uncertain work, add a justified buffer, and explain what may change the estimate.

**Typical factors:**

- unclear or changing requirements;
- unavailable environment, access, build, or test data;
- dependency on another team or third-party service;
- unfamiliar technology;
- large Regression testing scope;
- possible defect investigation and Retest;
- team availability and parallel work.

**Follow-up:** What do you do when information changes?

I update the estimate, explain the reason, and communicate the impact on scope or schedule. Re-estimation is normal when assumptions change.

### 7. How Are Estimates Used in Sprint, Release, and Project Planning?

**Short answer:**

At sprint level, estimates help the team choose a realistic amount of work. At release level, they help sequence features and QA activities. At project level, they support resource planning, milestones, dependencies, and risk management.

**Gantt chart:**

A Gantt chart shows tasks on a timeline with their start dates, durations, overlaps, dependencies, and milestones. It is useful for release or project planning, but it must be updated when scope, dependencies, or estimates change.

**QA example:**

The plan may show that system testing cannot start before the environment and integrated build are ready, while test design and test-data preparation can start earlier.

### 8. How Do You Improve Estimation Accuracy?

**Short answer:**

I compare estimates with actual results, analyse the difference during a retrospective, and use the findings in future work. I improve decomposition, keep historical data, update team reference stories, and record repeated risks.

**Useful questions for a retrospective:**

- What work did we forget?
- Which assumption was wrong?
- Was the task too large or unclear?
- Did a dependency or environment cause a delay?
- Should our reference story or buffer change?

The goal is better forecasting, not blaming the person who made the estimate.

### 9. How Do You Defend and Align an Estimate With the Team?

**Short answer:**

I explain the scope, assumptions, breakdown, risks, and dependencies behind my estimate. I listen to developers, analysts, and managers because they may know information that I do not. The team should agree on what is included before it agrees on a number.

**Scenario:** A manager asks you to cut the estimate in half. What do you do?

I do not silently change the number. I explain the effect: less test coverage, skipped environments, reduced Regression testing, or higher release risk. Then I offer options such as reducing scope, prioritising critical business flows, moving work to another release, or adding resources.

---

## Theory Links

- Detailed estimation techniques and calculation examples: [[05 Test Estimation]]
- Planning, monitoring, risks, and reporting: [[14 Test Management]]
