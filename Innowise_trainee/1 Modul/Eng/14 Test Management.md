# 14 Test Management

## Table of Contents

- [[#Test Management Responsibilities]]
- [[#Test Management Process and Phases]]
- [[#Test Planning]]
- [[#Test Estimation]]
- [[#Test Monitoring and Controlling]]
- [[#Issues Management]]
- [[#Reporting]]
- [[#Test Management Tools]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]

**Related notes:** [[QA manual eng]]

---

## Test Management Responsibilities

The **Test Manager** (or Test Lead) owns the quality process for a project. Their responsibilities span the entire testing lifecycle.

**Planning and strategy:**
- Define the test approach and strategy
- Create and maintain the Test Plan
- Estimate effort, schedule, and resource needs

**Team and process:**
- Assign tasks to QA engineers
- Ensure test cases, test data, and environments are ready on time
- Review and approve test artifacts (test plans, test cases, reports)

**Monitoring and communication:**
- Track progress against the plan and adjust when needed
- Identify, assess, and manage risks
- Report test status to stakeholders (developers, PMs, clients)
- Escalate blockers that the team cannot resolve independently

**Closure:**
- Evaluate the testing cycle — what worked, what did not
- Create the Test Summary Report
- Archive test artifacts for future reference

---

## Test Management Process and Phases

Test management follows the **STLC** (Software Testing Life Cycle). Each phase has defined inputs, activities, and outputs.

| Phase | Activities | Output |
|---|---|---|
| **Test Initiation** | Analyze requirements, define scope, identify risks | Feasibility report, risk register |
| **Test Planning** | Create test plan, estimate effort, allocate resources | Test Plan document |
| **Test Design** | Write test cases, prepare test data, set up environments | Test cases, test data, traceability matrix |
| **Test Execution** | Run tests, log defects, retest fixes | Executed test cases, defect reports |
| **Test Monitoring & Controlling** | Track metrics, manage deviations from plan | Status reports, updated plan |
| **Test Closure** | Evaluate cycle, create summary report, archive artifacts | Test Summary Report, lessons learned |

> [!info] Process vs STLC
> The STLC describes **what QA does**. Test Management describes **how a manager coordinates** all of it — planning, resourcing, tracking, and reporting across every STLC phase.

→ see [[02 SDLC and STLC]] for the full STLC breakdown.

---

## Test Planning

A **Test Plan** is a document that defines the scope, approach, resources, and schedule for testing a specific product or version.

**Key sections of a Test Plan:**

| Section | What it contains |
|---|---|
| **Scope** | What is in and out of scope for testing |
| **Objectives** | What testing must achieve |
| **Test approach** | Types of testing, techniques, levels |
| **Resources** | Team members, roles, environments, tools |
| **Schedule** | Milestones, deadlines, phase dates |
| **Entry and exit criteria** | Conditions to start and stop each phase |
| **Risks and mitigations** | Known risks and how to handle them |
| **Deliverables** | What artifacts will be produced |

**Entry criteria** — conditions that must be met before a testing phase starts.
Examples: build delivered to test environment, test cases reviewed and approved, test data ready.

**Exit criteria** — conditions that must be met before testing is considered complete.
Examples: 95% of test cases executed, no open P1/P2 defects, test summary report approved.

→ see [[03 Test Artifacts]] for the full Test Plan format and example.

---

## Test Estimation

Test estimation predicts how much time and effort the testing work requires.

→ Full coverage in [[05 Test Estimation]]: Expert-based estimation (analogy, Wideband Delphi), metric-based estimation (function points, historical data), and three-point estimation.

**Key principle:** Estimates must account for not just test execution but also planning, design, environment setup, defect reporting, retesting, and meetings.

---

## Test Monitoring and Controlling

**Test Monitoring** tracks the actual progress of testing against the plan.
**Test Controlling** takes corrective action when actual progress deviates from planned.

### Key Metrics

| Metric | Formula / Description |
|---|---|
| **Test execution progress** | Tests executed / total tests planned × 100% |
| **Pass rate** | Tests passed / tests executed × 100% |
| **Defect detection rate** | New defects found per day or per cycle |
| **Defect fix rate** | Defects fixed and retested per day |
| **Requirements coverage** | Requirements covered by at least one test / total requirements × 100% |
| **Defect density** | Defects found per module or feature |

### When to Stop Testing

Testing rarely achieves 100% coverage. Stopping decisions are based on:
- **Exit criteria met** — the agreed conditions are satisfied
- **Time/budget exhausted** — resources are depleted; document what was not tested
- **Risk accepted** — remaining risks are low enough for stakeholders to accept

> [!caution] Common mistake
> Stopping when "no new defects are found" is not a reliable criterion — it may mean the tests are not finding bugs, not that bugs don't exist. Use exit criteria defined upfront.

---

## Issues Management

**Issues** in a testing context include defects, risks, blocked items, and environment problems.

### Defect Management

The defect lifecycle describes the states a bug passes through from discovery to closure.

→ Full coverage in [[07 Bug Report and Defect Life Cycle]].

### Risk Management

A **risk** is a potential problem that has not happened yet. Risks are identified in the Test Plan.

**Risk management steps:**
1. **Identify** — what could go wrong?
2. **Assess** — how likely is it? How severe would the impact be?
3. **Mitigate** — what can reduce the likelihood or impact?
4. **Monitor** — track risks throughout the project

**Risk priority = Likelihood × Impact**

### Escalation

Not all issues can be resolved by the QA team. Escalate when:
- A defect is disputed and developers and QA cannot agree
- A blocker prevents the team from executing tests
- A risk is outside the QA team's authority to mitigate
- Exit criteria cannot be met within the current schedule

Escalation path: QA Lead → Test Manager → Project Manager → Stakeholders.

### Issue Tracking Tools

Common tools for logging and tracking issues: **Jira**, **Azure DevOps**, **YouTrack**, **Bugzilla**, **GitHub Issues**.

---

## Reporting

Test reports communicate the state of quality to stakeholders.

### Test Progress Report

Issued regularly during test execution (daily or per sprint).

**Typical content:**
- Test execution summary (planned vs actual)
- Pass / fail / blocked counts
- Open defects by severity
- Defects found and closed since last report
- Risks and blockers
- Planned activities for the next period

### Test Summary Report

Issued at the end of a testing phase or project.

**Typical content:**
- Overall test results vs objectives
- Total defects found, fixed, deferred, and rejected
- Coverage achieved (requirements, features)
- Exit criteria evaluation — met / not met
- Key risks that materialized
- Lessons learned and improvement suggestions

> [!tip] Report audience
> Tailor the level of detail to the audience. Developers need defect counts per component. Project managers need schedule and risk status. Executives need a pass/fail summary and go/no-go recommendation.

---

## Test Management Tools

Tools used to organize test cases, plan test runs, and track execution results.

| Tool | Type | Key features |
|---|---|---|
| **TestRail** | Standalone TMS | Test case repository, test runs, milestones, reports, integrates with Jira |
| **Zephyr Scale** | Jira plugin | Integrated with Jira issues, traceability, BDD support |
| **Xray** | Jira plugin | Popular alternative to Zephyr, strong CI/CD integration |
| **qTest** | Standalone TMS | Enterprise-grade, connects with Jira and CI tools |
| **Azure Test Plans** | Part of Azure DevOps | Deep integration with Microsoft ecosystem, exploratory testing support |
| **Jira** | Issue tracker | Used for defect management and basic task tracking (not a TMS itself) |
| **Confluence** | Wiki / documentation | Test plans, test strategies, reports — documentation alongside code |

> [!info] TMS vs Issue Tracker
> A **Test Management System (TMS)** stores test cases, organizes test runs, and tracks execution results. An **issue tracker** (Jira, YouTrack) stores defects and tasks. Most QA teams use both: TMS for test case management, issue tracker for defects. Some teams use Jira + Zephyr/Xray to combine both in one system.

---

## Interview Questions

### Top 10

**1. What are the main responsibilities of a test manager?**
Defining the test approach and strategy, creating the test plan, estimating effort and resources, assigning tasks, tracking progress, managing risks, reporting status to stakeholders, and producing the test summary report at closure.

**2. What does a test plan contain?**
Scope, objectives, test approach, resources, schedule, entry and exit criteria, risks and mitigations, and deliverables. It defines what will be tested, how, by whom, and when.

**3. What are entry and exit criteria?**
Entry criteria are conditions that must be met before a test phase starts (e.g. build delivered, test cases approved, test data ready). Exit criteria are conditions for considering testing complete (e.g. 95% of cases executed, no open P1/P2 defects, summary report approved).

**4. How do you decide when to stop testing?**
When the agreed exit criteria are met, when time or budget is exhausted (with remaining risk documented), or when remaining risk is low enough for stakeholders to accept. The criteria should be defined upfront, not improvised.

**5. What is the difference between test monitoring and test controlling?**
Monitoring tracks the actual progress of testing against the plan. Controlling takes corrective action when the actual progress deviates from the plan — for example, reassigning resources or adjusting scope.

**6. How is risk priority calculated?**
Risk priority = Likelihood × Impact. You assess how likely a problem is and how severe its impact would be, then prioritize mitigation for the highest-scoring risks.

**7. What metrics do you use to track test progress?**
Test execution progress (executed vs planned), pass rate, defect detection and fix rates, requirements coverage, and defect density. They show how testing is going and where the problems are.

**8. What is the difference between a TMS and an issue tracker?**
A Test Management System (TMS) stores test cases, organizes test runs, and tracks execution results. An issue tracker (Jira, YouTrack) stores defects and tasks. Most teams use both, sometimes combined via Jira + Zephyr/Xray.

**9. What is the difference between a test progress report and a test summary report?**
A progress report is issued regularly during execution (daily or per sprint) and shows current status. A summary report is issued at the end of a phase or project and evaluates overall results against objectives, including exit-criteria assessment and lessons learned.

**10. What are the phases of the test management process?**
Test initiation, test planning, test design, test execution, test monitoring and controlling, and test closure — aligned with the STLC.

---

### Tricky Questions

**1. The deadline is fixed and you cannot finish all planned testing. What do you do?**
Prioritize by risk — test the most critical and most-used features first. Communicate clearly which areas were not covered and the associated risk, so stakeholders can make an informed go/no-go decision. Do not silently drop scope.

**2. "No new defects were found this week, so we can stop testing." Is this a valid exit criterion?**
No. Finding no defects may mean the tests are weak or in the wrong area, not that the product is bug-free. Stopping decisions should be based on exit criteria defined upfront — coverage, open-defect counts, risk — not on the absence of new findings.

**3. A developer disputes a defect and you cannot reach agreement. What do you do?**
Escalate. Provide clear evidence (steps, expected vs actual, logs), and if the disagreement persists, raise it through the escalation path — QA lead, test manager, then project manager — so a decision is made by the right authority rather than left unresolved.

**4. Your estimate was 5 days but execution took 9. What went wrong and how do you improve?**
The estimate likely ignored non-execution work — environment setup, defect reporting, retesting, meetings, and blockers. Improve by using historical data, three-point estimation, and explicitly accounting for all testing activities, not just running test cases.

**5. Two reports go to developers and to executives. Should they be the same?**
No. Tailor the report to the audience. Developers need defect detail per component; executives need a high-level pass/fail summary, risk status, and a go/no-go recommendation. Same data, different level of detail.
