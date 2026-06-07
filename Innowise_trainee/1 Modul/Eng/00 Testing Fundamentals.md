# 00 Testing Fundamentals

## Table of Contents

- [[#QA and QC]]
- [[#What is Software Testing?]]
- [[#Importance of Testing]]
- [[#Testing Objectives and Goals]]
	- [[#Identifying Defects and Errors in Software]]
	- [[#Validating Functionality and Performance]]
- [[#Key Principles of Effective Testing]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]

**Related notes:** [[QA manual eng]]

---

## QA and QC

**Quality Assurance (QA)** is a set of planned processes and actions that ensure a product or process meets established quality standards and technical requirements.

- Focus: **process**
- Goal: **prevent** defects from occurring
- Approach: proactive — build quality into the process
- Scope: entire development lifecycle
- Example: process audits, defining standards, code review guidelines

**Quality Control (QC)** is a set of activities focused on inspecting and evaluating the actual product to find defects before it reaches the end user.

- Focus: **product**
- Goal: **find** defects in what has been built
- Approach: reactive — check quality after something is created
- Scope: specific phases or deliverables
- Example: product inspection, test execution, reviewing outputs

> [!tip] QA vs QC vs Testing
> | | QA | QC | Testing |
> |---|---|---|---|
> | Focus | Process | Product | Product |
> | Goal | Prevent defects | Find defects | Find defects |
> | Approach | Proactive | Reactive | Reactive |
> | Example | Process audit, standards | Inspection, review | Running test cases |
>
> **Relationship:** QA ⊇ QC ⊇ Testing
> Testing is a subset of QC. QC is a subset of QA.

---

## What is Software Testing?

**Software testing** is the process of checking the quality, functionality, and performance of a software product before launching.

Definition of Testing:
	✅Testing is the process of evaluating a software application or system to identify any differences between expected and actual results.
	✅Testing includes various activities such as planning, designing test cases, executing tests, and analyzing results to ensure the software meets specified requirements and functions correctly.
	✅Testing is not only about finding bugs but also about verifying that the software behaves as intended and meets user expectations.

> [!info] Verification vs Validation
> - **Verification** — **static** process of checking documents, design, code, and program to see if the software is built according to requirements. *(Are we building the product **right**?)*
> - **Validation** — **dynamic** process of testing and validating the actual product to meet the exact needs of the customer. *(Are we building the **right** product?)*

---

## Importance of Testing

- Testing finds defects early, which makes them cheaper and easier to fix.
- It reduces the risk of failures that can cause financial loss, reputation damage, or legal problems.
- Testing improves the quality and reliability of the software, increasing user trust and satisfaction.
- It gives stakeholders (everyone involved in the project: clients, managers, developers) confidence in the software's functionality, performance, and security, helping them make better decisions.

> [!danger] Main Goal of Testing
> The **main goal** of software testing is to **reduce the risk of failure** in production by identifying defects as early as possible. Modern software consists of many connected parts that must work together smoothly — one broken part can cause the entire application to fail. The sooner a defect is found, the less damage it does.
>
> From a practical standpoint, the primary activity that achieves this goal is **finding bugs**. This is not in conflict with the broader definition: testing is not *only* about finding bugs, but finding bugs is the main tool for reducing risk and ensuring a reliable, high-quality product is delivered.

> [!tip] Customer Trust and Satisfaction
> - Thorough testing increases customer trust.
> - No software can be completely bug‑free, but a **stable and reliable product** creates a positive long‑term user experience.
> - Following quality management best practices shows stakeholders and customers that the product has been tested thoroughly and can be trusted.

---

## Testing Objectives and Goals

### Identifying Defects and Errors in Software

> [!info] Error → Defect → Failure
> - **Error** — a mistake made by a **human** (developer, analyst, designer). Example: a developer misunderstands a requirement and writes incorrect logic.
> - **Defect** — a flaw introduced into the **code or documentation** as a result of an error. This is what testers find.
> - **Failure** — an **observable incorrect behavior** that occurs when the defective code is **executed** in a real environment.
>
> The chain: a human makes an **error** → which introduces a **defect** → which causes a **failure** at runtime.
>
> Common sources of errors: **Coding mistakes** / **Design mistakes** / **Requirements mistakes**.

Testing helps find defects in software by:

- **Running the software and checking its behavior:** testers manually use the app and look for unexpected results.
- **Using automated tools:** automated tests run predefined scenarios and report failures across web, mobile, or desktop apps.
- **Analyzing source code:** static analysis tools scan the code for syntax, logic, or structural errors.

### Validating Functionality and Performance

The goal of validation and performance testing is to ensure that the software:
- Correctly checks user input according to rules and constraints.
- Works efficiently under different loads and meets performance requirements.

**Validation** Testing checks that the software:
- Accepts valid input and rejects invalid input.
- Keeps data consistent and accurate.
- Detects errors and handles them properly.

**Performance** Testing measures:
- Response time under different loads.
- Scalability (the ability to handle more users or data without problems).
- Resource usage such as CPU and memory.

The goal of testing for compliance with requirements and specifications is to confirm that the software meets all defined functional and non‑functional expectations. This includes:
- **Checking functional requirements:** Making sure all features work as intended and satisfy user needs.
- **Checking non‑functional requirements:** Verifying performance, reliability, usability, security, and other quality attributes.
- **Finding deviations:** Identifying any differences between expected and actual behavior so they can be corrected.
- **Providing proof of compliance:** Using test results and documentation to show that the product meets required standards.

---

## Key Principles of Effective Testing

> [!warning] Seven Key Principles
> - Exhaustive testing is **impossible** — prioritize test coverage based on **risk**
> - Testing should start **early** in the development process and be conducted continuously
> - A small number of modules typically contain the **majority of defects**
> - Testing shows the **presence** of defects, not their **absence** — passing all tests does not mean the product is bug-free
> - **Pesticide Paradox** — repeating the same tests over and over stops finding new bugs. Test cases must be regularly updated and expanded
> - Testing is **context-dependent** — the approach, tools, and depth of testing depend on the type of product (banking app, game, medical software)
> - **Absence of errors fallacy** — fixing all bugs does not guarantee success. A technically clean product can still fail if it does not meet real user needs

> [!caution] Challenges & Limitations
> - **Resource Constraints**
> - **Time Pressure**
> - **Evolving Requirements**

---

## Interview Questions

### Top 10

**1. What is QA, QC, and how do they differ from software testing?**
QA is a broad set of planned processes and standards that govern how a product is built — its goal is to **prevent** defects. QC is a set of activities focused on inspecting the actual product to **find** defects before it reaches users. Testing is a specific technical activity within QC — it executes the software and compares actual results to expected ones. Relationship: QA ⊇ QC ⊇ Testing. QA is proactive and process-oriented; QC and testing are reactive and product-oriented.

**2. What is the main goal of software testing?**
To reduce the risk of failure in production by identifying defects as early as possible. From a practical standpoint, the primary activity that achieves this is finding bugs — which is the main tool for ensuring a reliable, high-quality product.

**3. What is the difference between an Error, a Defect, and a Failure?**
An Error is a mistake made by a human (developer, analyst, designer). A Defect is a flaw introduced into the code or documentation as a result of that error — this is what testers find. A Failure is the observable incorrect behavior that occurs when the defective code is executed in a real environment. The chain: Error → Defect → Failure.

**4. What is the difference between Verification and Validation?**
Verification is a static process that checks whether the software is built *right* — it examines documents, design, and code against requirements without running the software. Validation is a dynamic process that checks whether the *right* software was built — it tests the actual running product against real user needs.

**5. Why should testing start early in development?**
Defects found early are significantly cheaper and easier to fix than those discovered late. A bug caught in the requirements stage costs far less to address than one found after deployment. Early testing also prevents defects from compounding through later phases.

**6. What is the Pesticide Paradox?**
If the same tests are run repeatedly without change, they eventually stop finding new bugs. The software builds resistance to the test suite. To counter this, test cases must be regularly reviewed, updated, and expanded to cover new areas and scenarios.

**7. What does "testing is context-dependent" mean?**
The approach, tools, techniques, and depth of testing must match the nature of the product. A banking application requires rigorous security and compliance testing; a mobile game prioritizes UX and performance; medical software demands exhaustive validation. There is no one-size-fits-all testing strategy.

**8. What is the "absence of errors fallacy"?**
The incorrect belief that fixing all known bugs guarantees a successful product. A technically clean product can still fail if it does not meet real user needs or business goals. Passing all tests does not mean the product is useful, usable, or fit for purpose.

**9. What are the main sources of software errors?**
The three main categories are coding mistakes (incorrect logic, typos, off-by-one errors), design mistakes (flawed architecture or feature design), and requirements mistakes (misunderstood, incomplete, or contradictory requirements). Requirements mistakes are the most expensive to fix because they propagate through all downstream phases.

**10. Why does thorough testing improve stakeholder confidence?**
Stakeholders — clients, managers, investors — need assurance that the product behaves as expected before making decisions about release, investment, or deployment. Test results and documentation provide measurable evidence that the software has been checked against requirements, reducing uncertainty and risk.

---

### Tricky Questions

**1. If QA processes are thorough enough, the product will have no bugs. True or false?**
False. QA reduces the probability of defects by improving processes, but it cannot guarantee a zero-defect product. No software of meaningful complexity is entirely bug-free. QA minimizes risk; it does not eliminate it.

**2. Passing all tests means the product has no defects. True or false?**
False. Testing shows the *presence* of defects, not their *absence*. A test suite can only verify the scenarios it covers. Untested paths, edge cases, and integration points may still contain defects that no test has yet reached.

**3. A developer writes incorrect code because they misunderstood a requirement. At which point does a Failure occur?**
The misunderstanding is an **Error** (human mistake). The incorrect code that results is a **Defect** (flaw in the artifact). The Failure occurs later — only when that defective code is *executed* in a real environment and produces incorrect observable behavior. The Failure may not happen immediately; it depends on whether and how that code path is triggered.

**4. The same test suite has been running for 6 months without finding any new bugs. Does this mean the software is now stable and well-tested?**
Not necessarily. This is a textbook example of the Pesticide Paradox. The tests have likely been exhausted — they can only find defects in the areas they already cover. New features, changed requirements, or untested code paths may contain defects the existing suite will never reach. The correct response is to expand and refresh the test cases.
