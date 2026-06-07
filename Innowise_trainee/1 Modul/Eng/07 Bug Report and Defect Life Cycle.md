# 07 Bug Report and Defect Life Cycle

## Table of Contents

- [[#What is a Defect]]
- [[#Bug Report Structure]]
- [[#Writing a Good Title]]
- [[#Severity and Priority]]
	- [[#Severity Levels]]
	- [[#Priority Levels]]
	- [[#Severity vs Priority Matrix]]
- [[#Defect Life Cycle]]
- [[#Common Mistakes]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]

**Related notes:** [[QA manual eng]]

---

## What is a Defect

A **defect** (bug) is a flaw in the software that causes it to behave in an unintended or incorrect way. It is the difference between **actual behavior** and **expected behavior** as defined by requirements.

> [!info] Error vs Defect vs Failure
> - **Error** — a human mistake made by a developer or analyst (e.g. wrong logic in code)
> - **Defect** — the result of that error in the product (the flaw in the code or document)
> - **Failure** — what the user sees when the defect is triggered during execution

A **bug report** is a document that describes a defect in enough detail for a developer to reproduce, understand, and fix it.

---

## Bug Report Structure

| Field | Description |
|---|---|
| **ID** | Unique identifier assigned automatically by the bug tracker |
| **Title** | Short, specific summary of the issue → see [[#Writing a Good Title]] |
| **Environment** | OS, browser/app version, device, test data used |
| **Steps to Reproduce** | Numbered, step-by-step instructions to trigger the bug |
| **Expected Result** | What should happen according to requirements |
| **Actual Result** | What actually happens — include error messages verbatim |
| **Severity** | Technical impact on the system → see [[#Severity Levels]] |
| **Priority** | Business urgency of the fix → see [[#Priority Levels]] |
| **Attachments** | Screenshots, screen recordings, logs, network traces |
| **Status** | Current state in the defect life cycle → see [[#Defect Life Cycle]] |
| **Assignee** | Developer responsible for the fix |
| **Reporter** | Tester who found and logged the bug |

**Example:**

> **ID:** BUG-247
> **Title:** Login button does nothing when password field is empty on iOS 17 Safari
> **Environment:** iPhone 14, iOS 17.2, Safari 17, staging env, user: test@example.com
> **Steps to reproduce:**
> 1. Open the login page
> 2. Enter a valid email address
> 3. Leave the password field empty
> 4. Tap the "Login" button
>
> **Expected:** Validation error "Password is required" is shown
> **Actual:** Nothing happens — no error, no request, no visual feedback
> **Severity:** Major
> **Priority:** High
> **Attachments:** screen_recording.mp4

---

## Writing a Good Title

The title is the first thing a developer reads. It must answer: **what broke, where, and under what condition**.

**Formula:** `[Object] [Action] [Result] [Condition]`

| ❌ Bad | ✅ Good |
|---|---|
| Login doesn't work | Login button does nothing when password field is empty |
| Bug on checkout page | Order total shows $0 after applying a 100% discount coupon |
| App crashes | App crashes on Android 14 when camera permission is denied mid-upload |
| Wrong text | "Confirm" button label shows "Canfirm" on the payment screen |
| Error | 500 Internal Server Error when submitting registration form with emoji in name field |

**Rules:**
- No vague words: "doesn't work", "broken", "issue", "problem"
- Mention the specific element, screen, action, and condition
- Include platform/browser/OS if the bug is environment-specific
- Keep it under 100 characters

---

## Severity and Priority

**Severity** = technical impact. How badly does the bug break the system? Set by the **QA engineer**.

**Priority** = business urgency. How fast does it need to be fixed? Set by the **project manager or product owner**.

### Severity Levels

| Level | Meaning | Example |
|---|---|---|
| **Critical** (S1) | Core functionality is broken, data loss, security breach | Login impossible for all users; payment data exposed |
| **Major** (S2) | Significant feature broken, no workaround | File upload fails; search returns no results |
| **Medium** (S3) | Feature partially broken, workaround exists | Filter doesn't save; report exports wrong date range |
| **Minor** (S4) | Cosmetic issue, barely affects usage | Typo in footer; button slightly misaligned |

### Priority Levels

| Level | Meaning |
|---|---|
| **P1 — Critical** | Fix immediately, blocks release or current work |
| **P2 — High** | Fix in current sprint, significant impact |
| **P3 — Medium** | Fix in next sprint, standard queue |
| **P4 — Low** | Fix when time allows, minimal impact |

### Severity vs Priority Matrix

![[Разное/img/07_severity_priority.png]]

The key insight: **severity and priority are independent**. A bug can have any combination.

| Combination                       | Example                                     | Why                                            |
| --------------------------------- | ------------------------------------------- | ---------------------------------------------- |
| **High Severity + High Priority** | Payment system crashes                      | Breaks core flow AND must be fixed now         |
| **High Severity + Low Priority**  | Bug in a feature being deprecated next week | Technically bad but irrelevant to business     |
| **Low Severity + High Priority**  | CEO's name misspelled on the homepage       | Minor technically but embarrassing and visible |
| **Low Severity + Low Priority**   | Typo in a rarely visited help article       | Neither critical nor urgent                    |

> [!tip] Who sets what?
> - **Severity** → QA engineer (based on technical impact)
> - **Priority** → Project Manager / Product Owner (based on business context)
> A QA engineer should never set priority unilaterally — they lack the business context.

---

## Defect Life Cycle

The defect life cycle describes all the states a bug passes through from discovery to closure.

```
[New] → [Assigned] → [Open] → [Fixed] → [Retest]
                                              ↓          ↓
                                          [Closed]   [Reopened] → [Open]
```

| Status       | Who acts         | Description                                            |
| ------------ | ---------------- | ------------------------------------------------------ |
| **New**      | QA               | Bug is logged for the first time, not yet reviewed     |
| **Assigned** | Lead / PM        | Bug is reviewed, accepted, and assigned to a developer |
| **Open**     | Developer        | Developer starts investigating and working on the fix  |
| **Fixed**    | Developer        | Fix is implemented and deployed to test environment    |
| **Retest**   | QA               | Tester verifies that the fix resolves the issue        |
| **Closed**   | QA               | Fix confirmed — bug is resolved                        |
| **Reopened** | QA               | Fix did not work — bug is sent back to developer       |
| **Rejected** | Developer / Lead | Bug is not reproducible, not a bug, or duplicate       |
| **Deferred** | PM               | Valid bug but postponed to a future release            |

> [!warning] Retest ≠ Regression Testing
> **Retest** — verifying that this specific bug is fixed (same steps that found it)
> **Regression Testing** — verifying that the fix didn't break anything else
> Both must happen after a fix. → see [[01 Types of Testing#Retesting]]

---

## Common Mistakes

**In the title:**
- Too vague: "Something is wrong on the login page"
- Too long: describing the whole bug in the title instead of a summary

**In steps to reproduce:**
- Missing preconditions (user must be logged in, specific test data needed)
- Skipping obvious steps — what's obvious to you may not be to the developer
- Not being specific: "click on the button" → which button?

**In expected vs actual:**
- Writing the same thing in both fields
- Expected result says "it should work" — that's not a result, that's a wish
- Actual result missing the exact error message or code

**In severity/priority:**
- Marking everything as Critical (priority inflation)
- Confusing severity with priority: a Critical bug is not automatically P1

**General:**
- Reporting a bug without being able to reproduce it consistently
- Not attaching evidence — screenshots, logs, recordings
- Reporting the same bug twice (duplicate)
- Speculating about the cause: "probably the database query is wrong"

---

## Interview Questions

### Top 10

**1. What is a bug report and what fields does it contain?**
A bug report is a document describing a defect in enough detail for a developer to reproduce and fix it. Key fields: ID, title, environment, steps to reproduce, expected result, actual result, severity, priority, status, attachments, assignee, reporter.

**2. What is the difference between severity and priority?**
Severity measures the technical impact of a bug on the system — how badly it breaks functionality. Priority measures business urgency — how fast it needs to be fixed. Severity is set by QA, priority by the project manager or product owner. They are independent of each other.

**3. Give an example of a high severity but low priority bug.**
A critical bug in a feature that is scheduled to be removed from the product in the next sprint. The bug technically breaks core functionality but fixing it has no business value since the feature is being deprecated.

**4. Give an example of a low severity but high priority bug.**
A typo in the CEO's name on the company homepage, or a misalignment in a promotional banner on the day of a marketing campaign launch. The technical impact is minimal but the business visibility makes it urgent.

**5. What are the stages of the defect life cycle?**
New → Assigned → Open → Fixed → Retest → Closed. Additional states: Reopened (fix didn't work), Rejected (not a bug or not reproducible), Deferred (postponed to future release).

**6. When is a bug marked as Reopened vs Rejected?**
Reopened: the bug was "Fixed" but QA verified that it still occurs. Rejected: the developer (or lead) determines it is not a real bug — not reproducible, works as designed, or is a duplicate of another report.

**7. What is the difference between Retest and Regression Testing?**
Retest verifies that a specific fixed bug is now resolved — using the same exact steps that originally found it. Regression Testing verifies that the fix (and other recent changes) did not break anything else in the system.

**8. What makes a good bug report title?**
A good title is specific and answers: what broke, where, and under what condition. Formula: [Object] [Action] [Result] [Condition]. Example: "Login button does nothing when password field is empty on iOS Safari" instead of "Login doesn't work".

**9. What is a Deferred bug?**
A valid bug that the team agrees to postpone fixing to a later release. It is not rejected (the bug is real) but fixing it now is not a priority. It stays in the backlog for a future sprint.

**10. What should you do if you cannot reproduce a bug?**
Try to reproduce it in different environments, browsers, accounts, and with different test data. Check logs for the time of the incident. Ask the reporter or user for more details. If still not reproducible after thorough investigation, mark as "Cannot Reproduce" and ask the developer to review — do not close it immediately.

---

### Tricky Questions

**1. A developer says your bug is "not a bug, it works as designed." What do you do?**
Check the requirements. If the requirements support the developer's claim, accept the decision and close the report. If the requirements contradict their claim, escalate with evidence — quote the relevant requirement. If there are no requirements, escalate to the product owner to make a product decision. Never argue about opinions — argue about documented requirements.

**2. Should QA set the priority of a bug?**
QA should suggest priority based on their understanding of the feature's importance, but the final decision belongs to the project manager or product owner. They have context about business deadlines, client visibility, and release plans that QA may lack. A tester who marks everything P1 loses credibility over time.

**3. The bug you reported was marked Closed but you think it is still present. What do you do?**
Verify again carefully — make sure you are testing the correct build. If the bug still reproduces, reopen it with evidence: new screenshots, the build number, and the exact steps. Do not silently accept a Closed status that you disagree with.

**4. Is it possible for a bug to go from Closed directly to Reopened?**
Yes, if the same bug reappears in a later build after having been genuinely fixed — for example, due to a regression introduced by another change. In this case, reopen the original bug report rather than creating a new one, and note in the comments which build broke it again.
