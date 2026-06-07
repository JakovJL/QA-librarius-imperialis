# 04 Test Pyramid

## Table of Contents

- [[#Test Pyramid]]
- [[#Layers of the Pyramid]]
	- [[#Unit Tests]]
	- [[#Integration Tests]]
	- [[#End-to-End (E2E) Tests]]
- [[#Why the Shape Matters]]
- [[#Anti-Patterns]]
	- [[#Ice Cream Cone]]
	- [[#Hourglass]]
	- [[#Cupcake]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]

**Related notes:** [[QA manual eng]]

---

## Test Pyramid

The Test Pyramid is a model that describes the ideal distribution of tests across different levels of a system. It was introduced by Mike Cohn.

```
        /  E2E  \           ← few, slow, expensive
       /----------\
      / Integration \       ← moderate amount
     /----------------\
    /    Unit Tests     \   ← many, fast, cheap
   /____________________\
```

**Core idea:** the lower the level, the more tests you should have. Lower-level tests are faster, cheaper, and easier to maintain. Higher-level tests give more confidence but cost more to write and run.

---

## Layers of the Pyramid

→ For detailed definitions of each testing level, see [[01 Types of Testing#Testing Levels]]

### Unit Tests

The foundation of the pyramid. Test individual functions, methods, or classes in isolation.

- **Speed:** milliseconds per test
- **Cost:** low to write and maintain
- **Written by:** developers
- **Feedback loop:** immediate — runs on every save or commit
- **What they catch:** logic errors, calculation mistakes, edge cases in individual components

**Example:** Testing that `calculateTotal(items)` returns the correct sum, including cases with discounts, empty cart, and negative quantities.

---

### Integration Tests

The middle layer. Test how multiple components work together — modules, services, databases, APIs.

- **Speed:** seconds per test
- **Cost:** moderate — may need test databases, mock services, or containers
- **Written by:** developers or QA / automation engineers
- **Feedback loop:** minutes — typically runs in CI pipeline
- **What they catch:** broken contracts between modules, incorrect data flow, configuration issues

**Example:** Testing that a user registration endpoint correctly saves the user to the database, sends a confirmation email via the email service, and returns the expected response.

---

### End-to-End (E2E) Tests

The top of the pyramid. Test complete user workflows through the real UI, simulating how a real user interacts with the system.

- **Speed:** seconds to minutes per test
- **Cost:** high — requires full environment, fragile due to UI changes
- **Written by:** QA / automation engineers
- **Feedback loop:** slow — runs on schedule or before releases
- **What they catch:** broken user flows, integration issues across the full stack, deployment problems

**Example:** Testing the full purchase flow: login → search product → add to cart → checkout → confirm order → verify order appears in history.

> [!tip] Quick comparison
> | | Unit | Integration | E2E |
> |---|---|---|---|
> | Quantity | Many | Moderate | Few |
> | Speed | Milliseconds | Seconds | Seconds–minutes |
> | Cost | Low | Medium | High |
> | Stability | Very stable | Stable | Fragile |
> | Confidence | Low (isolated) | Medium | High (real user path) |
> | Written by | Developers | Dev / QA | QA / Automation |

---

## Why the Shape Matters

The pyramid shape is not arbitrary. It reflects key trade-offs:

- **Speed of feedback.** Unit tests run in seconds, giving developers instant feedback. E2E tests can take minutes or hours — slow feedback means bugs are found later and cost more to fix.
- **Cost of maintenance.** A UI change can break dozens of E2E tests but zero unit tests. The higher the level, the more fragile and expensive the tests become.
- **Debugging difficulty.** When a unit test fails, the bug is in one function. When an E2E test fails, the bug could be anywhere in the entire stack — finding it takes much longer.
- **Confidence.** Unit tests prove that individual parts work. Only E2E tests prove that the whole system works together for real users. You need both, but in different proportions.

> [!danger] The Golden Rule
> If you can test something at a lower level — do it at a lower level. Push tests down the pyramid whenever possible. Reserve E2E tests for critical user paths that cannot be verified any other way.

---

## Anti-Patterns

### Ice Cream Cone

The pyramid flipped upside down: most tests are E2E and manual, few are unit tests.

```
   ____________________
   \   Manual / E2E   /   ← most tests here
    \----------------/
     \ Integration /
      \----------/
       \  Unit  /          ← almost none
        \______/
```

**Why it happens:**
- Testing is added late in the project, when only the UI exists
- QA team writes tests without developer involvement
- "If it works in the browser, it works" mindset

**Why it is bad:**
- Test suite is extremely slow — CI takes hours
- Tests are fragile — a small CSS change breaks dozens of tests
- Debugging is hard — a failure could be caused by any layer
- Developers get no fast feedback and stop trusting the tests

**How to fix:**
- Introduce unit tests for all new code
- Gradually replace E2E tests with lower-level tests where possible
- Keep E2E tests only for critical user paths

---

### Hourglass

Many unit tests, many E2E tests, but almost no integration tests. The middle layer is missing.

```
        /  E2E  \           ← many
       /----------\
      |            |        ← almost none
       \----------/
    /    Unit Tests     \   ← many
   /____________________\
```

**Why it happens:**
- Developers write unit tests, QA writes E2E tests — nobody owns the middle
- Integration tests are harder to set up (test databases, containers, mocks)
- Teams skip integration tests thinking E2E will catch everything

**Why it is bad:**
- Unit tests pass but components fail when combined — broken interfaces go undetected
- E2E tests catch integration bugs but are slow and hard to debug
- The gap creates a false sense of security: "all tests pass" but the system breaks between layers

**How to fix:**
- Add integration tests for key module boundaries and API contracts
- Use tools like Testcontainers or in-memory databases to simplify setup
- Make integration tests a shared responsibility between developers and QA

---

### Cupcake

The same checks are duplicated at every level of the pyramid. Each layer tests the same thing instead of testing what it does best.

```
        / E2E: checks login validation \
       /--------------------------------\
      / Integration: checks login validation \
     /----------------------------------------\
    / Unit: checks login validation             \
   /______________________________________________\
```

**Why it happens:**
- No clear strategy for which level tests what
- Teams copy-paste test cases across levels "just to be safe"
- Fear of missing bugs leads to over-testing

**Why it is bad:**
- Wasted effort — maintaining the same check in three places
- One change triggers failures at every level, making it hard to find the real issue
- Slower CI pipeline with no additional confidence

**How to fix:**
- Define a clear testing strategy: each level tests what it does best
- Unit tests → logic and edge cases
- Integration tests → data flow and contracts between components
- E2E tests → critical user paths only
- Remove duplicate checks from higher levels when a lower level already covers them

> [!tip] Anti-patterns at a glance
> | Anti-pattern | Shape | Problem | Root cause |
> |---|---|---|---|
> | Ice Cream Cone | Inverted pyramid | Slow, fragile, hard to debug | Testing added late, no unit tests |
> | Hourglass | Squeezed middle | Integration bugs slip through | Nobody owns integration tests |
> | Cupcake | Same checks everywhere | Wasted effort, slow CI | No testing strategy |

---

## Interview Questions

### Top 10

**1. What is the Test Pyramid and who introduced it?**
The Test Pyramid is a model introduced by Mike Cohn that describes the ideal distribution of tests: many fast unit tests at the base, fewer integration tests in the middle, and a small number of slow E2E tests at the top.

**2. Why should there be more unit tests than E2E tests?**
Unit tests are fast, cheap, stable, and easy to debug. E2E tests are slow, expensive, fragile, and hard to debug. Having more unit tests gives faster feedback at lower cost while still covering most logic.

**3. What does each layer of the pyramid test?**
Unit: individual functions and classes in isolation. Integration: interactions between modules, services, and databases. E2E: complete user workflows through the real UI.

**4. What is the Ice Cream Cone anti-pattern?**
An inverted pyramid where most tests are E2E or manual and very few are unit tests. It leads to a slow, fragile, and expensive test suite with poor developer feedback.

**5. What is the Hourglass anti-pattern?**
A shape where there are many unit tests and many E2E tests but almost no integration tests. The missing middle layer means integration bugs go undetected until E2E, where they are slow and hard to debug.

**6. Why are E2E tests more fragile than unit tests?**
E2E tests depend on the entire stack — UI, backend, database, network, third-party services. A change in any layer can break the test. Unit tests depend only on one function, so they are much more stable.

**7. When is it acceptable to have more E2E tests than the pyramid suggests?**
When the system is heavily UI-driven with complex user flows that cannot be tested at a lower level, or during early development when the architecture is not yet stable enough for comprehensive unit testing. But this should be temporary.

**8. What is the golden rule of the Test Pyramid?**
If you can test something at a lower level — do it at a lower level. Push tests down the pyramid whenever possible.

**9. What is the Cupcake anti-pattern?**
When the same checks are duplicated at every level of the pyramid — unit, integration, and E2E all test the same thing. It wastes effort and slows down CI with no added confidence.

**10. How would you fix an Ice Cream Cone test suite?**
Add unit tests for all new code, gradually replace E2E tests with lower-level equivalents where possible, and keep E2E tests only for critical user paths. Involve developers in writing tests, not just QA.

---

### Tricky Questions

**1. If all unit tests pass, can you be confident the system works?**
No. Unit tests verify isolated components, not their interactions. A function can work perfectly alone but fail when connected to other modules. Integration and E2E tests are needed to verify the system works as a whole.

**2. Is the Test Pyramid the only valid model?**
No. The pyramid works well for most applications, but some projects may use variations. For example, a microservices architecture may benefit from a "Testing Diamond" with more integration tests. The pyramid is a guideline, not a strict rule.

**3. A team has 90% unit test coverage and zero E2E tests. Is this a good test suite?**
Not necessarily. High unit test coverage proves individual components work but says nothing about whether the full system works for users. Critical user paths should always have at least basic E2E coverage. Coverage percentage alone does not measure quality.

**4. E2E tests keep failing randomly. Should you just delete them?**
No. Flaky tests are a symptom, not the cause. First, investigate why they fail — common causes are timing issues, test data dependencies, or environment instability. Fix the root cause. If a test is genuinely untestable at E2E level, move the check to a lower level instead of deleting it.
