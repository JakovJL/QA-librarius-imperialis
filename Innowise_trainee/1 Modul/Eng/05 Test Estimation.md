# 05 Test Estimation

## Table of Contents

- [[#What is Test Estimation]]
- [[#Estimation Techniques]]
	- [[#Three-Point Estimation (PERT)]]
	- [[#Work Breakdown Structure (WBS)]]
	- [[#Planning Poker]]
	- [[#Expert Judgment and Analogies]]
	- [[#Wideband Delphi]]
	- [[#Percentage Distribution]]
- [[#What Often Gets Overlooked]]
- [[#Common Mistakes]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]

**Related notes:** [[QA manual eng]]

---

## What is Test Estimation

Test estimation is the process of forecasting the time, effort, and resources needed to complete testing activities.

> [!danger] Key distinction
> **Effort estimation** and **deadline forecasting** are not the same thing. Effort measures the amount of work (e.g. 40 person-hours). Deadline forecasting determines a realistic completion date, taking into account dependencies, team availability, and risks.

**Why it matters:**
- Without estimation, planning is guesswork — deadlines slip, resources are wasted
- Stakeholders need to know when testing will be done and what it will cost
- Estimation forces you to think through the scope before you start

**What affects estimation accuracy:**
- Volume and complexity of functionality
- Quality of requirements
- Team experience and size
- Stability of the test environment
- Available tools and automation
- Known risks

---

## Estimation Techniques

### Three-Point Estimation (PERT)

The most widely asked technique on interviews. Uses three scenarios to calculate a weighted estimate, reducing the impact of optimism or pessimism.

**Three scenarios:**
- **O** (Optimistic) — everything goes perfectly, no obstacles
- **M** (Most Likely) — realistic scenario with minor issues
- **P** (Pessimistic) — many problems, delays, blockers

**PERT formula:**

```
E = (O + 4M + P) / 6
```

**Standard Deviation** shows the range of uncertainty:

```
SD = (P - O) / 6
```

The real estimate falls in the range **E ± SD**.

**Example:**

| Task             | O       | M       | P       | E         | SD     |
| ---------------- | ------- | ------- | ------- | --------- | ------ |
| Write test cases | 10h     | 15h     | 30h     | 16.7h     | 3.3h   |
| Execute tests    | 8h      | 12h     | 20h     | 12.7h     | 2h     |
| Regression       | 4h      | 6h      | 14h     | 7h        | 1.7h   |
| **Total**        | **22h** | **33h** | **64h** | **36.4h** | **7h** |

The estimated effort is **36.4 hours**, with a realistic range of **29.4 – 43.4 hours**.

**Advantages:**
- Accounts for uncertainty and risk
- Produces a range, not a single number — more honest
- Easy to explain to stakeholders

**Disadvantages:**
- Requires experience to set O, M, P values accurately
- Still depends on subjective judgment

---

### Work Breakdown Structure (WBS)

The most practical technique for everyday work. Break a large task into small, easily estimable pieces.

**How it works:**
1. Take the big task (e.g. "Test the login module")
2. Break it into categories (fields, buttons, validations, error handling, localization)
3. Keep breaking down until each item takes no more than a few hours
4. Estimate each small item
5. Sum everything up

**Example:**

```
Test login module
├── Email field
│   ├── Valid email formats         → 30 min
│   ├── Invalid email formats       → 30 min
│   └── Empty field                 → 10 min
├── Password field
│   ├── Valid password              → 20 min
│   ├── Min/max length              → 20 min
│   ├── Special characters          → 15 min
│   └── Empty field                 → 10 min
├── "Login" button
│   ├── Enabled/disabled states     → 15 min
│   └── Double-click behavior       → 10 min
├── Error messages                  → 30 min
├── "Forgot password" link          → 20 min
└── Localization (2 languages)      → 40 min
                              Total: ~4 hours
```

**Advantages:**
- Simple and intuitive — even junior testers can do it
- Hard to forget tasks when everything is listed
- The breakdown itself becomes a checklist for testing

**Disadvantages:**
- Time-consuming for very large features
- Easy to underestimate small tasks that add up

---

### Planning Poker

An Agile estimation technique where the whole team estimates tasks together using numbered cards. Commonly used in Scrum.

**How it works:**
1. The product owner or lead describes a task
2. Each team member privately selects a card with their estimate (usually Fibonacci: 1, 2, 3, 5, 8, 13, 21)
3. Everyone reveals their cards simultaneously
4. If estimates differ significantly, the highest and lowest explain their reasoning
5. The team discusses and re-votes until they reach consensus

**Why Fibonacci?** Larger tasks have more uncertainty. The gaps between numbers grow to reflect this: the difference between 5 and 8 is acceptable, but forcing a choice between 13 and 14 creates false precision.

**Advantages:**
- Eliminates anchoring bias — everyone votes independently
- Discussion reveals hidden risks and misunderstandings
- Builds shared understanding of the task across the team

**Disadvantages:**
- Requires the whole team to be present
- Can be slow for a large backlog
- Estimates are relative (story points), not absolute time

> [!info] Story Points vs Hours
> Planning Poker typically uses **story points** — a relative measure of effort and complexity, not clock time. A task rated "5 points" is roughly 2.5× harder than a "2 point" task, but the actual hours depend on the team's velocity.

---

### Expert Judgment and Analogies

The simplest approach: ask an experienced person or compare with a similar past task.

**Expert Judgment:** A senior tester or lead estimates based on their experience with similar work. Fast and easy, but only as good as the expert's memory and objectivity.

**Analogies:** Find a past task of similar scope, check how long it actually took, and use that as a baseline for the new estimate.

**Advantages:**
- Fast — takes minutes, not hours
- Works well when the team has done similar work before
- No tools or calculations needed

**Disadvantages:**
- Highly subjective — depends on one person's experience
- No past project = no analogy
- Easy to be overconfident or forget hidden work

**When to use:** Quick estimates, early-stage planning, small tasks, or as a sanity check for other methods.

---

### Wideband Delphi

A structured group estimation technique. Similar to Planning Poker but more formal and used outside Agile contexts.

**How it works:**
1. A moderator presents the task and requirements to a panel of 3–7 experts
2. Each expert submits an anonymous estimate
3. The moderator shares all estimates (without names) and highlights differences
4. Experts discuss their reasoning
5. Re-vote anonymously
6. Repeat until estimates converge

**Advantages:**
- Anonymity reduces bias and groupthink
- Combines diverse perspectives
- Works for both high-level and detailed estimates

**Disadvantages:**
- Requires multiple experts and a moderator
- Multiple rounds take time
- Rarely used in practice outside large organizations

---

### Percentage Distribution

Allocate testing effort as a fixed percentage of overall development effort, based on historical data.

**Typical ratios** (vary by project):
- Testing effort ≈ 25–35% of total development effort
- Breakdown within testing: test planning 10%, test design 30%, test execution 45%, reporting 15%

**Advantages:**
- Very simple — no detailed analysis needed
- Works well for stable, predictable projects with historical data

**Disadvantages:**
- Inaccurate for new products with no history
- Assumes the current project is similar to past ones
- Ignores specific complexity and risks

> [!tip] Other techniques worth knowing
> - **Function Point Analysis** — measures software size by counting inputs, outputs, queries, files, and interfaces. Each gets a complexity weight. Rarely used in practice for test estimation, but may appear in theory questions.
> - **COCOMO** (Constructive Cost Model) — a mathematical model for estimating development cost. Primarily for developers, not QA. Mentioned for completeness.

---

## What Often Gets Overlooked

When estimating, teams frequently forget to account for:

- **Test environment setup** — installing tools, configuring servers, preparing test data
- **Bug reporting and verification** — writing bug reports, discussions with developers, retesting fixes
- **Regression testing** — time grows with each sprint as the product expands
- **Communication overhead** — meetings, requirement clarifications, reviews
- **Learning curve** — new team members, new tools, unfamiliar features
- **Vacations, holidays, sick days** — real people are not available 100% of the time
- **Blocked time** — waiting for builds, environments, access, or developer fixes

> [!caution] The hidden multiplier
> These "invisible" activities can add 20–40% on top of your pure testing estimate. Always add a buffer. A common practice is to multiply the base estimate by 1.2–1.5.

---

## Common Mistakes

- **Estimating only the "happy path"** — forgetting negative tests, edge cases, and error handling
- **Not accounting for regression** — each new feature means more regression to run
- **Anchoring to the first number** — once someone says "3 days," everyone adjusts around it instead of thinking independently
- **Confusing effort with duration** — 40 hours of work ≠ 1 week if you also have meetings, other tasks, and blockers
- **Ignoring the environment** — "works on my machine" is not a test plan
- **Not tracking actuals** — if you never compare estimates to reality, you never improve

---

## Interview Questions

### Top 10

**1. What is test estimation and why is it important?**
Test estimation is the process of forecasting time, effort, and resources needed for testing. It is important because it enables realistic planning, helps allocate resources, and sets stakeholder expectations. Without estimation, deadlines are unreliable and risks are hidden.

**2. Explain the Three-Point Estimation (PERT) technique and its formula.**
Three-Point Estimation uses three scenarios: Optimistic (O), Most Likely (M), and Pessimistic (P). The formula is E = (O + 4M + P) / 6. It produces a weighted average that accounts for uncertainty. Standard deviation SD = (P - O) / 6 gives the range of the estimate.

**3. What is WBS and how do you use it for test estimation?**
Work Breakdown Structure means breaking a large testing task into small, easily estimable subtasks. You decompose by feature, field, action, or scenario until each piece takes a few hours at most. Then you sum the estimates. The breakdown itself doubles as a testing checklist.

**4. How does Planning Poker work?**
Each team member privately selects a card with their estimate (Fibonacci numbers). Cards are revealed simultaneously to avoid bias. If estimates differ, the outliers explain their reasoning. The team discusses and re-votes until consensus is reached. It is used in Agile/Scrum.

**5. What is the difference between effort and duration?**
Effort is the total work required (e.g. 40 person-hours). Duration is the calendar time it takes to complete that work, considering meetings, blockers, dependencies, and availability. 40 hours of effort might take 2 weeks of duration.

**6. What factors affect test estimation accuracy?**
Functionality volume and complexity, quality of requirements, team experience and size, test environment stability, available tools and automation, and known project risks.

**7. What do you do if your estimate turns out to be wrong?**
Track the difference between estimated and actual time. Analyze what was missed — hidden complexity, unclear requirements, environment issues. Use this data to improve future estimates. Never punish wrong estimates — they improve with experience and feedback.

**8. What estimation techniques do you know?**
Three-Point Estimation (PERT), Work Breakdown Structure (WBS), Planning Poker, Expert Judgment and Analogies, Wideband Delphi, Percentage Distribution, Function Point Analysis. In practice, teams often combine two or more techniques.

**9. What is the difference between story points and hours?**
Hours are an absolute measure of time. Story points are a relative measure of effort and complexity — a "5" is harder than a "3" but the actual hours depend on team velocity. Story points are used in Agile to plan sprints; hours are used in traditional estimation.

**10. How would you estimate testing for a feature you have never seen before?**
Start with WBS — break the feature into parts based on requirements. Use Three-Point Estimation for uncertain areas. Consult experienced team members (Expert Judgment). Add a buffer for unknowns (20–40%). Refine the estimate as you learn more about the feature.

---

### Tricky Questions

**1. A manager asks you to reduce your estimate by half. What do you do?**
Never silently cut the estimate. Explain what the estimate includes and what will be lost if time is cut — reduced coverage, skipped regression, higher risk of bugs in production. Offer alternatives: prioritize critical paths, reduce scope, or add resources. The manager needs to make an informed trade-off, not just a shorter number.

**2. Your estimate was 40 hours but the task took 60. Was the estimate wrong?**
Not necessarily "wrong" — it may have been the best possible prediction with the information available at the time. The important part is analyzing why: were requirements unclear? Did the environment cause delays? Was regression underestimated? Use the gap to improve future estimates, not to blame the estimator.

**3. Can you estimate without requirements?**
You can produce a rough estimate based on analogies and expert judgment, but it will have very high uncertainty. Be explicit about this: "Based on similar past features, I estimate 30–80 hours. I'll refine this once requirements are clarified." Giving a range is more honest than a single number with hidden assumptions.

**4. Is it better to overestimate or underestimate?**
Overestimating is generally safer — it creates a buffer for unexpected issues and avoids deadline pressure that leads to skipped testing. However, consistently large overestimates waste resources and erode trust. The goal is accuracy, not padding. Track actuals and calibrate over time.
