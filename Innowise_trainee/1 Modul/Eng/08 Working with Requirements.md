# 08 Working with Requirements

## Table of Contents

- [[#Basics of Working with Requirements]]
- [[#Types of Requirements]]
- [[#Requirement Levels]]
- [[#Requirement Sources]]
- [[#Working with Stakeholders]]
- [[#Attributes of Quality Requirements]]
- [[#Requirements Elicitation Techniques]]
- [[#Requirements Documentation]]
- [[#Requirements Testing]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]

**Related notes:** [[QA manual eng]]

---

## Basics of Working with Requirements

**Requirement** is a documented description of a function that the software must perform or a condition it must meet.

> [!danger] Why Requirements Matter
> Poor requirements are the most expensive source of defects — errors found at this stage cost 10–100× more to fix after development.

Quality requirements are the foundation of quality software.

---

## Types of Requirements

### Functional Requirements

**Functional requirement** describes a function that the software must perform.

**Example:** "When the 'Send' button is clicked, the email is sent to the recipient within 5 seconds."

### Non-Functional Requirements

**Non-functional requirement** describes a condition that the software must meet (performance, security, reliability).

**Example:** "System response time must not exceed 2 seconds with 1000 concurrent users."

---

## Requirement Levels

### Business Requirements

**Business requirement** describes a high-level business goal.

**Example:** "Increase order volume by 20% within one year."

### User Requirements

**User requirement** describes a user need.

**Example:** "As a user, I want to be able to pay for an order with a single click."

### Product Requirements

**Product requirement** describes a specific product feature.

**Example:** "The 'Quick Pay' button is displayed on the cart page."

---

## Requirement Sources

- **Stakeholders** — customers, users, management
- **Documentation** — SRS, business documents, standards
- **Competitors** — competitor product analysis
- **Legislation** — regulations
- **Feedback** — user reviews, support

---

## Working with Stakeholders

**Stakeholder** is a person interested in the project.

**Types of stakeholders:**

- Internal — management, developers, testers
- External — customers, users, regulators

**Recommendations:**

- Identify all stakeholders early
- Collect feedback regularly
- Document agreements

---

## Attributes of Quality Requirements

Quality requirements meet the following criteria:

### SMART Criteria

- **S**pecific — specific
- **M**easurable — measurable
- **A**chievable — achievable
- **R**elevant — relevant
- **T**ime-bound — time-bound

### Additional Criteria

| Attribute      | Description                                    |
| -------------- | ---------------------------------------------- |
| Correctness    | Requirement correctly describes what is needed |
| Unambiguous    | No different interpretations                   |
| Completeness   | All aspects of the requirement are described   |
| Consistency    | No conflicts with other requirements           |
| Testability    | Can be verified                                |
| Traceability   | Linked to other artifacts                      |
| Priority       | Importance is defined                          |
| Feasible       | Can be implemented within resources            |
| Atomic         | One requirement = one function                 |
| Understandable | Clear to all participants                      |

---

## Requirements Elicitation Techniques

### Interviews

Structured conversation with stakeholders.

**Advantages:** Deep understanding, ability to clarify.
**Disadvantages:** Time-consuming.

---

### Surveys

Questionnaire for collecting information from many stakeholders.

**Advantages:** Fast data collection.
**Disadvantages:** Surface-level data.

---

### Workshop

Collaborative session with stakeholders.

**Advantages:** Interactivity, fast agreement.
**Disadvantages:** Requires moderator.

---

### Observation

Observing users at work.

**Advantages:** Real behavior.
**Disadvantages:** Users may behave differently.

---

### Document Analysis

Reviewing existing documentation.

**Advantages:** No stakeholder access needed.
**Disadvantages:** May be outdated.

---

## Requirements Documentation

### Documentation Formats

- **SRS** — Software Requirements Specification
- **User Stories** — User stories
- **Use Cases** — Use case scenarios
- **Functional specifications**

### Best Practices

- Use consistent format
- Number requirements
- Specify priority
- Add version history

---

## Requirements Testing

### Requirements Review

**Objective:** Identify defects in requirements before development begins.

**Checklist:**

- Are all requirements clear?
- Any contradictions?
- Are all quality attributes met?
- Are there priorities?

---

### Defects in Requirements

**Typical defects:**

- Incompleteness — requirement misses important case
- Ambiguity — different interpretations possible
- Inconsistency — conflicts with another requirement
- Infeasibility — cannot be implemented
- Untestability — cannot be verified

---

### Requirements for Test Cases

Each requirement must have at least one corresponding test case.

**Rule:** Testability → requirements must be clear, measurable, and traceable.

---

## Interview Questions

### Top 10

**1. What is a requirement in QA context?**
A requirement is a documented description of a function or condition that the software must meet.

**2. How do functional requirements differ from non-functional?**
Functional describes what the software does. Non-functional describes how it does it (performance, security).

**3. What are attributes of quality requirements?**
These are criteria that good requirements must meet: correctness, unambiguity, completeness, consistency, testability, and others.

**4. What are SMART criteria?**
S — Specific, M — Measurable, A — Achievable, R — Relevant, T — Time-bound.

**5. Who are stakeholders?**
Interested parties: customers, users, developers, management, regulators.

**6. What requirements elicitation techniques do you know?**
Interviews, surveys, workshops, observation, document analysis.

**7. What are defects in requirements?**
Problems in the requirements themselves: incompleteness, ambiguity, inconsistency, infeasibility, untestability.

**8. Why is it important to test requirements?**
Defects in requirements are the most expensive to fix. The earlier found, the cheaper.

**9. What is requirements traceability?**
Ability to link a requirement to other artifacts: code, tests, design.

**10. How are requirements and test cases related?**
Each requirement must have at least one corresponding test case. This ensures test coverage.

---

### Tricky Questions

**1. Requirements cannot be changed after approval. True or false?**
False. Requirements can change, but changes must be documented and evaluated.

**2. Testers don't participate in creating requirements. True or false?**
False. Testers should participate in requirements review to ensure testability.

**3. Non-functional requirements are less important than functional. True or false?**
False. Both types are important. Non-functional requirements (security, performance) are often critical.

**4. Good requirements = good tests. True or false?**
Not always. Good requirements are necessary but not sufficient. Tests also depend on tester's skills.