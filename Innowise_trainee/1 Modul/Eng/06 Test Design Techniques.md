# 06 Test Design Techniques

## Table of Contents

- [[#What is Test Design]]
- [[#Black-Box Techniques]]
	- [[#Equivalence Partitioning (EP)]]
	- [[#Boundary Value Analysis (BVA)]]
	- [[#Decision Table Testing]]
	- [[#State Transition Testing]]
	- [[#Pairwise Testing]]
- [[#Experience-Based Techniques]]
	- [[#Error Guessing]]
	- [[#Checklist-Based Testing]]
- [[#White-Box Techniques]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]

**Related notes:** [[QA manual eng]]

---

## What is Test Design

Test design is the process of creating test cases from requirements and specifications. Instead of testing randomly, you apply structured techniques to get maximum coverage with minimum effort.

**Why it matters:**
- You cannot test everything — techniques help you choose **what** to test
- Structured approach finds more bugs than random clicking
- Reduces the number of test cases while keeping coverage high
- Makes your testing explainable and repeatable

**Three families of techniques:**

| Family | Based on | Who uses it |
|---|---|---|
| Black-box | Requirements and specifications | QA engineers |
| White-box | Internal code structure | Developers / SDET |
| Experience-based | Tester's knowledge and intuition | Senior QA |

---

## Black-Box Techniques

### Equivalence Partitioning (EP)

Divide all possible inputs into groups (partitions) where every value in the group is expected to behave the same way. Then test **one value per partition** instead of all possible values.

**How it works:**
1. Identify the input and its valid/invalid ranges
2. Divide into partitions where all values produce the same result
3. Pick one representative value from each partition
4. Create one test case per partition

**Example — age field for a job application:**

![[06_ep_bva 1.png]]

| Partition | Range | Expected result | Test value |
|---|---|---|---|
| Invalid (too young) | 0–15 | Rejected | 10 |
| Valid (part-time) | 16–17 | Part-time offer | 16 |
| Valid (full-time) | 18–54 | Full-time offer | 30 |
| Invalid (too old) | 55–99 | Rejected | 70 |

4 test cases instead of 100. Each partition needs only one representative.

**Advantages:**
- Dramatically reduces test case count
- Simple to understand and apply
- Works for any type of input — numbers, text, dropdowns

**Disadvantages:**
- Misses bugs that hide at partition boundaries
- Assumes all values in a partition behave identically (not always true)

---

### Boundary Value Analysis (BVA)

Test at the **edges** of equivalence partitions, where bugs are most likely to hide. Off-by-one errors, wrong comparison operators (`<` vs `<=`), and edge cases cluster at boundaries.

**How it works:**
1. Identify equivalence partitions (use EP first)
2. For each boundary, test three values: **on the boundary**, **just below**, **just above**
3. Create test cases for all boundary points

**Example — same age field:**

Using the boundaries from EP (15|16, 17|18, 54|55):

| Boundary | Values to test | Why |
|---|---|---|
| Lower edge of part-time | 15, **16**, 17 | Does 16 get accepted? Does 15 get rejected? |
| Between part-time and full-time | 17, **18**, 19 | Does the switch happen at exactly 18? |
| Upper edge of full-time | 53, **54**, 55 | Does 55 get rejected correctly? |
| Lower extreme | -1, **0**, 1 | Does 0 get handled? Does -1 get rejected? |
| Upper extreme | 98, **99**, 100 | Does 99 get handled? Does 100 get rejected? |

> [!tip] EP + BVA = standard combo
> Almost always used together. EP reduces the space, BVA catches the edge bugs. On interviews, if you mention one, always mention the other.

---

### Decision Table Testing

For features where **combinations of conditions** lead to different outcomes. Each column in the table is a rule — a unique combination of conditions and its expected action.

**How it works:**
1. List all conditions (inputs)
2. List all actions (outputs)
3. Fill in all possible combinations of True/False for conditions
4. For each combination, define the expected action
5. One test case per rule (column)

**Example — online store discount:**

Conditions: Is the customer a member? Is the order above $100?

|                   | Rule 1 | Rule 2 | Rule 3 | Rule 4 |
| ----------------- | ------ | ------ | ------ | ------ |
| **Member?**       | Yes    | Yes    | No     | No     |
| **Order > $100?** | Yes    | No     | Yes    | No     |
| **Discount**      | 20%    | 10%    | 5%     | 0%     |

4 rules → 4 test cases. Covers every scenario.

**Formula:** With N conditions (True/False each), you get **2^N** rules.

| Conditions | Rules |
|---|---|
| 2 | 4 |
| 3 | 8 |
| 4 | 16 |
| 5 | 32 |

**Advantages:**
- Forces you to think about all combinations — finds missing requirements
- Perfect for complex business logic
- Easy to review with stakeholders

**Disadvantages:**
- Grows exponentially — 5+ conditions become unwieldy
- Not all combinations may be realistic

> [!caution] When the table gets too big
> With 5+ conditions, use **rule collapsing** — merge rules that produce the same action regardless of one condition's value. Mark collapsed cells with `—` (don't care).

---

### State Transition Testing

For systems that **behave differently based on their current state** and the sequence of previous events. The same input can produce different outputs depending on what happened before.

**How it works:**
1. Identify all possible states
2. Identify events (triggers) that cause transitions
3. Draw a state transition diagram
4. Define a transition table (state + event → new state + action)
5. Create test cases to cover all transitions

**Example — login with 3-attempt lockout:**

![[06_state_transition 1.png]]

| Current state | Event | Next state | Action |
|---|---|---|---|
| Logged Out | Valid credentials | Logged In | Grant access |
| Logged Out | Invalid credentials (attempt 1) | Logged Out | Show error, counter = 1 |
| Logged Out | Invalid credentials (attempt 2) | Logged Out | Show error, counter = 2 |
| Logged Out | Invalid credentials (attempt 3) | Locked | Lock account |
| Logged In | Logout | Logged Out | End session |
| Locked | Wait 30 min | Logged Out | Unlock account |

**Advantages:**
- Catches sequence-dependent bugs that other techniques miss
- Visual diagram makes complex flows understandable
- Reveals invalid or missing transitions

**Disadvantages:**
- Becomes complex with many states
- Number of paths can grow infinitely with loops
- Requires clear understanding of the system's behavior

---

### Pairwise Testing

When a feature has **many parameters with multiple values**, testing all combinations is impossible. Pairwise testing covers all unique **pairs** of parameter values — enough to catch ~70–85% of defects with a fraction of the test cases.

**The problem:**

| Parameter | Values                  |
| --------- | ----------------------- |
| Browser   | Chrome, Firefox, Safari |
| OS        | Windows, macOS, Linux   |
| Language  | EN, RU, DE              |

Full combinations: 3 × 3 × 3 = **27** test cases.
Pairwise: **9** test cases — every pair of values appears at least once.

**Pairwise test set:**

| # | Browser | OS | Language |
|---|---|---|---|
| 1 | Chrome | Windows | EN |
| 2 | Chrome | macOS | RU |
| 3 | Chrome | Linux | DE |
| 4 | Firefox | Windows | RU |
| 5 | Firefox | macOS | DE |
| 6 | Firefox | Linux | EN |
| 7 | Safari | Windows | DE |
| 8 | Safari | macOS | EN |
| 9 | Safari | Linux | RU |

Every pair (e.g. Chrome+Windows, Firefox+RU, macOS+DE) appears at least once.

**Tools:** PICT (Microsoft), AllPairs, pairwise.org

**Advantages:**
- Catches most interaction bugs with far fewer tests
- Scales well — the savings grow as parameters increase
- Backed by research: most bugs involve 1–2 factor interactions

**Disadvantages:**
- Misses bugs caused by 3+ factor interactions
- Requires tooling for large parameter sets
- Not a substitute for targeted boundary/logic testing

---

## Experience-Based Techniques

### Error Guessing

The tester uses **personal experience and intuition** to predict where bugs are likely to hide. No formal rules — just a mental checklist built from years of finding similar bugs.

**Common guesses:**
- Empty inputs, null values, zero, negative numbers
- Very long strings, special characters, SQL injection patterns
- Boundary values (0, 1, -1, MAX_INT)
- Network timeouts, slow connections
- Concurrent users doing the same action
- Date edge cases (Feb 29, Dec 31, timezone changes)

**Advantages:**
- Finds bugs that structured techniques miss
- Fast — no setup or documentation needed
- Gets better with experience

**Disadvantages:**
- Highly dependent on the tester's skill
- Not repeatable or transferable
- Cannot be measured or reported as coverage

**When to use:** As a supplement to structured techniques, never as the only approach.

---

### Checklist-Based Testing

Testing based on a **pre-made list of checks** — often built from past bugs, common patterns, or team experience. Less formal than test cases, more structured than error guessing.

**Example checklist items for a form:**
- All required fields show validation errors when empty
- Max length is enforced on text fields
- Date picker does not allow past dates (if applicable)
- Error messages are clear and in the correct language
- Tab order follows visual layout
- Form submits correctly and shows confirmation

**Advantages:**
- Quick to create and execute
- Captures team knowledge
- Good for smoke testing and regression

**Disadvantages:**
- Less rigorous than formal test cases
- Can become stale if not updated
- Coverage depends on checklist quality

---

## White-Box Techniques

White-box techniques require access to the source code. Primarily used by developers and SDETs.

- **Statement Coverage.** Every line of code executes at least once. The minimum standard.
- **Branch Coverage (Decision Coverage).** Every `if/else` branch is taken at least once — both `true` and `false` paths.
- **Condition Coverage.** Each individual boolean sub-expression evaluates to both `true` and `false` at least once.

> [!warning] Coverage hierarchy
> **Statement** → **Branch** → **Condition**
> Each level is stricter than the previous. 100% branch coverage guarantees 100% statement coverage, but not vice versa.

**Example:**

```
if (age >= 18 && hasID) {
    allowEntry();   // Branch 1
} else {
    denyEntry();    // Branch 2
}
```

- Statement coverage: 1 test hits `allowEntry()`, 1 test hits `denyEntry()` → 2 tests minimum.
- Branch coverage: same 2 tests — both branches covered.
- Condition coverage: need to test `age >= 18` as true/false AND `hasID` as true/false independently → may need 3–4 tests.

---

## Interview Questions

### Top 10

**1. What are test design techniques and why do we need them?**
Test design techniques are structured methods for creating test cases from requirements. We need them because testing everything is impossible — techniques help select the most effective test cases to maximize coverage with limited time and resources.

**2. What is Equivalence Partitioning?**
EP divides all possible inputs into groups where every value in the group is expected to behave identically. You test one representative value per partition. This dramatically reduces the number of test cases while covering all meaningful input categories.

**3. What is Boundary Value Analysis and how does it relate to EP?**
BVA tests values at the edges of equivalence partitions — on the boundary, just below, and just above. It complements EP because most bugs hide at boundaries (off-by-one errors, wrong operators). EP + BVA is the standard combo.

**4. When would you use a Decision Table?**
When a feature has multiple conditions that combine to produce different outcomes. Decision tables force you to consider every combination of conditions, which often reveals missing requirements. Best for complex business logic with 2–4 conditions.

**5. What is State Transition Testing?**
A technique for testing systems where output depends on the current state and previous events. You map all states, events, and transitions, then create tests that cover every transition. Catches sequence-dependent bugs.

**6. What is Pairwise Testing and why does it work?**
Pairwise testing covers all unique pairs of parameter values instead of all combinations. It works because research shows ~70–85% of defects are caused by interaction of at most 2 factors. It can reduce thousands of combinations to dozens.

**7. What is the difference between black-box and white-box techniques?**
Black-box techniques are based on requirements — the tester does not know the code. White-box techniques are based on code structure — the tester targets specific code paths. Black-box answers "does it do what it should?" White-box answers "does every code path work?"

**8. What is Error Guessing?**
An experience-based technique where the tester predicts likely failure points using intuition and past experience. Common guesses: empty inputs, special characters, boundary values, timeouts. Fast but subjective — best used alongside structured techniques.

**9. What is the difference between Statement Coverage and Branch Coverage?**
Statement coverage requires every line of code to execute at least once. Branch coverage requires every branch (true/false) of every decision to execute. Branch coverage is stricter — 100% branch coverage guarantees 100% statement coverage, but not the reverse.

**10. You have a form with 5 fields, each accepting 3 types of input. How many test cases would full combination testing require? How would you reduce this?**
Full: 3^5 = 243 test cases. To reduce: use Equivalence Partitioning for each field (test representative values), apply Pairwise Testing to cover all pairs (~15–20 tests), and add BVA for critical fields. You can get to ~25–30 well-chosen tests.

---

### Tricky Questions

**1. EP says one value per partition is enough. Is that really true?**
In theory, yes — all values in a partition should behave identically. In practice, implementations have hidden sub-partitions. EP is a starting point, not a guarantee. Combine it with BVA (for edges) and Error Guessing (for special values within partitions) to strengthen coverage.

**2. Can you achieve 100% test coverage with any technique?**
No. Even 100% code coverage (white-box) does not guarantee all bugs are found — it only means every line ran, not that every input combination was tested. And 100% input coverage (all combinations) is mathematically infeasible for real systems. The goal is **effective** coverage, not **total** coverage.

**3. A Decision Table has 6 conditions. That is 64 rules. Is this practical?**
Usually not — 64 test cases for one feature is expensive. In practice, you collapse rules where a condition does not affect the outcome (mark as "don't care"), reducing the table significantly. Also, not all 64 combinations may be logically possible. A good tester identifies the meaningful subset.

**4. Pairwise testing catches 70–85% of defects. What about the other 15–30%?**
Those are caused by 3+ factor interactions. For critical systems (medical, financial), pairwise may not be enough — you might need 3-wise or even full combination testing for the highest-risk areas. For most applications, pairwise plus targeted boundary and error guessing tests are sufficient.
