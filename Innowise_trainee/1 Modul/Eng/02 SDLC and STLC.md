# 02 SDLC and STLC

## Table of Contents

- [[#SDLC — Software Development Life Cycle]]
- [[#STLC — Software Testing Life Cycle]]
- [[#SDLC and STLC Comparison]]
- [[#SDLC Models Classification]]
- [[#Sequential Development Models]]
	- [[#Waterfall]]
	- [[#V-Model]]
- [[#Iterative Development Models]]
	- [[#Iterative]]
	- [[#Spiral]]
- [[#Agile Methodologies]]
	- [[#Agile]]
	- [[#Scrum]]
- [[#Alternative Models]]
	- [[#Big Bang]]
	- [[#RAD]]
	- [[#Hybrid]]
- [[#Stages of STLC]]
	- [[#Requirements Analysis]]
	- [[#Test Planning]]
	- [[#Test Case Development]]
	- [[#Test Execution]]
	- [[#Test Reporting]]
	- [[#Test Closure]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]

**Related notes:** [[QA manual eng]]

---

## SDLC — Software Development Life Cycle

**The Software Development Life Cycle** (SDLC) is a framework that defines the steps involved in developing software.
SDLC typically includes the following phases:

1. **Planning:** Gather requirements, define the project scope, and create a project plan.
2. **Analysis:** Analyze the requirements to understand what the software must do.
3. **Design:** Create detailed design documents that describe how the software will be built.
4. **Implementation:** Write the code according to the design documents.
5. **Testing:** Test the software to confirm it meets the requirements and is free of defects.
6. **Deployment:** Release the software to the production environment.
7. **Maintenance:** Fix bugs and add new features after the software has been released.

---

## STLC — Software Testing Life Cycle

> [!info] STLC — Software Testing Life Cycle
> STLC is a **subset of SDLC** focused entirely on testing activities. While SDLC covers the full product lifecycle, STLC defines the structured process from test planning to reporting.

**The Software Testing Life Cycle** (STLC) consists of six stages. Each stage is described in detail in the **Stages of STLC** section below.

---

## SDLC and STLC Comparison

| Phase          | SDLC                                          | STLC                                          |
| -------------- | --------------------------------------------- | --------------------------------------------- |
| Planning       | Define scope, requirements, and project plan  | Create test plan and identify resources       |
| Analysis       | Analyze requirements and design architecture  | Analyze requirements and identify what to test|
| Design         | Create detailed design documents              | Develop detailed test cases                   |
| Implementation | Code the software                             | Execute test cases and record results         |
| Reporting      | N/A                                           | Analyze results and prepare test report       |
| Closure        | N/A                                           | Sign off, archive documentation               |
| Deployment     | Deploy the software to production             | N/A                                           |
| Maintenance    | Maintain the software after release           | N/A                                           |

---

## SDLC Models Classification

SDLC models can be divided into three main groups by development approach:

- **Sequential models** — each phase completes fully before moving to the next
- **Iterative models** — development occurs in cycles, gradually adding functionality
- **Agile methodologies** — short iterations with constant feedback and adaptation

---

## Sequential Development Models

These models assume that each phase completes fully before moving to the next. Transitions go forward only.

---

### Waterfall

**Waterfall** is the classic SDLC model where development moves sequentially from one phase to the next, like a waterfall.


**Goal:** Create software by completing each phase sequentially without backtracking.

**Advantages:**
- Simple and clear structure
- Clear requirements at each stage
- Easy to manage and control
- Transparent deadlines and budget

**Disadvantages:**
- No way to return to previous phase
- Defects found late
- Customer sees result only at the end
- Inflexible to changing requirements

**Example:**
Large government contract with fixed requirements: banking system, accounting software.

**When to use:**
- Requirements are clear and stable
- Technology is well-known
- Small to medium project
- Low flexibility requirements

---


### V-Model

**V-Model** is an extension of Waterfall where each development phase has a corresponding testing phase on the descending branch of the V.

**Goal:** Ensure early test planning and clear link between development and testing phases.

**Advantages:**
- Testing planned early
- Clear correspondence between code and tests
- Defects found earlier
- Good structure for critical software

**Disadvantages:**
- Rigid structure like Waterfall
- No intermediate prototypes
- Difficulty making changes
- High documentation requirements

**Example:**
Medical equipment, safety systems, avionics — where errors are unacceptable.

**When to use:**
- High reliability requirements
- Medical or military systems
- Projects with strict regulatory requirements

---

## Iterative Development Models

These models assume repeating cycles where each iteration adds new functionality.

---

### Iterative

**Iterative** is a model where development happens in repeating cycles, each going through all SDLC phases.


**Goal:** Gradually increase product functionality through repeating cycles.

**Advantages:**
- Flexibility to changes
- Early working product
- Ability to adjust direction
- Defects found earlier

**Disadvantages:**
- Management complexity
- Risk of budget overrun
- Final outcome not always clear
- Requires good planning

**Example:**
Operating system development where base version is released first, then features added.


**When to use:**
- Large and complex projects
- Requirements not fully understood
- Long-term development

---

### Spiral

**Spiral** combines iterative approach with risk analysis at each spiral iteration.


**Goal:** Minimize risks through iterative analysis and prototyping.

**Advantages:**
- Focus on risks
- Flexibility and adaptability
- Early prototyping
- Customer participates in evaluating each iteration

**Disadvantages:**
- Management complexity
- High expertise requirements
- Documentation may lag
- Risk of timeline extension

**Example:**
Large corporate project with uncertain requirements and high risks.

**When to use:**
- High project risks
- Complex and large-scale projects
- Innovative projects

---


## Agile Methodologies

Methodologies based on short iterations, constant feedback, and adaptation to changes.


---

### Agile

**Agile** is an approach to software development based on the Agile Manifesto and short iterations called sprints.


**Goal:** Create working software through short iterations with constant customer feedback.


**Advantages:**
- Flexibility to changes
- Fast feedback
- Customer involved in development
- Working product visible often
- Self-organizing teams

**Disadvantages:**
- Difficult to estimate timelines
- Requires engaged customer
- Not suitable for large contracts
- Documentation is secondary

**Example:**
Web applications, startups, products with rapidly changing requirements.


**When to use:**
- Undefined or changing requirements
- Small cross-functional teams
- Projects where speed matters

---

### Scrum

**Scrum** is a framework within Agile methodology defining roles, ceremonies, and artifacts for flexible development.


**Goal:** Ensure predictable value delivery through sprints.

**Roles:**
- Product Owner — product owner, defines priorities
- Scrum Master — process facilitator
- Development Team — cross-functional team

**Ceremonies:**
- Sprint Planning — sprint planning
- Daily Scrum — daily standup
- Sprint Review — demo of results
- Sprint Retrospective — retrospective

**Artifacts:**
- Product Backlog — requirements list
- Sprint Backlog — sprint requirements
- Increment — ready increment

**Advantages:**
- Process transparency
- Predictable releases
- Continuous improvement
- High quality through retrospectives

**Disadvantages:**
- Requires discipline
- Complexity for large teams
- Trained roles needed

---

## Alternative Models

Models that don't fit main categories or combine approaches.


---

### Big Bang

**Big Bang** is a model where development starts without detailed planning, all resources go to creating the product.


**Goal:** Create product quickly, skipping planning phase.

**Advantages:**
- Maximum speed of start
- Minimal overhead
- Simplicity

**Disadvantages:**
- High failure risk
- No timeline or budget control
- Scaling difficulty
- Not suitable for large projects

**When to use:**
- Educational projects
- Hackathons
- Prototyping

---

### RAD

**RAD (Rapid Application Development)** is a model focused on rapid prototyping and iterative improvement.


**Goal:** Quickly create working prototype and develop it based on feedback.


**Advantages:**
- Fast feedback
- User involved in process
- Rapid prototyping
- Flexibility to changes

**Disadvantages:**
- Requires specialized tools
- Not suitable for large systems
- Dependency on experts

**When to use:**
- UI-intensive applications
- Projects with clear interface
- Tight deadlines

---

### Hybrid

**Hybrid** is a combination of two or more SDLC models, combining their advantages.


**Goal:** Use strengths of different models for a specific project.

**Advantages:**
- Flexibility of choice
- Process optimization
- Context adaptation

**Disadvantages:**
- Model selection complexity
- Requires expertise
- Risk of mixing approaches

**Example:**
Waterfall for core system, Agile for UI components.

**When to use:**
- Different parts require different approaches
- Migration between methodologies
- Large complex projects

---

## Stages of STLC

### Requirements Analysis

**Objective:** Understand what the software needs to do and identify what should be tested.

**Activities:**
- Review the software requirements specification (SRS) and any related documents.
- Identify both functional and non-functional requirements.
- Determine the test conditions needed to verify each requirement.

---

### Test Planning

**Objective:** Define the scope, resources, timeline, and approach for testing.

**Activities:**
- Create a test plan covering scope, required resources, schedule, and deliverables.
- Choose testing tools and techniques.
- Assign roles and responsibilities to the testing team.

---

### Test Case Development

**Objective:** Write detailed, step‑by‑step test cases to be executed later.

**Activities:**
- Develop test cases based on the test conditions identified earlier.
- Define the expected outcome for each step or test case.
- Review test cases to make sure they are complete and accurate.

---

### Test Execution

**Objective:** Run the tests and record what happens.

**Activities:**
- Execute test cases according to the test plan.
- Log the actual results for each test case.
- When a test fails, investigate and find the root cause of the failure.

---

### Test Reporting

**Objective:** Analyse the results and summarise the findings in a report.

**Activities:**
- Evaluate test results to assess whether the software meets its requirements.
- Prepare a test report that summarises what was tested, what passed/failed, and gives recommendations for improvement.

---

### Test Closure

**Objective:** Formally complete testing and obtain final approval.

**Activities:**
- Review the final test results together with the development team.
- Sign off on the software if it meets the acceptance criteria.
- Archive all test documentation for future reference.

---

## Interview Questions

### Top 10

**1. What is SDLC and what are its main phases?**
SDLC (Software Development Life Cycle) is a framework that defines the structured steps involved in building software. Its main phases are Planning, Analysis, Design, Implementation, Testing, Deployment, and Maintenance.

**2. What is STLC and how does it relate to SDLC?**
STLC (Software Testing Life Cycle) is a subset of SDLC that focuses exclusively on testing activities. While SDLC covers the full product lifecycle from requirements to maintenance, STLC defines a structured process specifically for testing: from requirements analysis through test closure.

**3. What is the objective of the Requirements Analysis stage in STLC?**
To understand what the software must do and determine what needs to be tested. This involves reviewing the SRS, identifying functional and non-functional requirements, and defining the test conditions needed to verify each requirement.

**4. What is the difference between Test Planning and Test Case Development?**
Test Planning defines the *strategy* — scope, resources, timeline, tools, and responsibilities. Test Case Development translates that strategy into *specific executable steps* — detailed test cases with expected outcomes, ready to be run during Test Execution.

**5. What happens during Test Execution?**
Testers run the prepared test cases according to the test plan, record actual results for each, compare them against expected outcomes, and investigate the root cause of any failures. Defects found are logged for the development team.

**6. What is the purpose of Test Reporting?**
To evaluate and communicate the results of testing. A test report summarizes what was tested, how many tests passed and failed, the overall quality assessment, and recommendations. It gives stakeholders the information they need to make a release decision.

**7. What is Test Closure and why is it important?**
Test Closure formally ends the testing cycle by reviewing final results with the development team, signing off on the software if it meets acceptance criteria, and archiving all test documentation. It ensures nothing is left undone and provides a record for future projects or audits.

**8. At which SDLC phase does testing ideally begin?**
Testing should begin as early as the Analysis phase, not just during the Testing phase. Reviewing requirements for ambiguity, gaps, and contradictions early prevents defects from propagating into design and code. This aligns with the principle that testing should start early to reduce the cost of fixing defects.

**9. What is a test plan and what does it typically cover?**
A test plan is a document created during Test Planning that defines the testing strategy for a project. It typically covers: scope (what will and won’t be tested), required resources (team, tools, environments), schedule and milestones, deliverables, and risk assessment.

**10. What is an SRS and why is it the starting point for STLC?**
SRS stands for Software Requirements Specification — a document that describes what the software must do. It is the primary input for STLC because it defines the requirements that must be tested. Without a clear SRS, testers cannot determine what “correct behavior” looks like or which scenarios need to be verified.

---

### Tricky Questions

**1. STLC starts only after development (implementation) is complete. True or false?**
False. STLC begins in parallel with SDLC, starting from the Requirements Analysis phase. Testers review requirements, create test plans, and develop test cases long before any code is written. Waiting until development is finished to begin testing is a costly anti-pattern that delays defect discovery.

**2. Test Closure means all bugs in the software have been fixed. True or false?**
False. Test Closure means testing activities have been formally completed and the software has been signed off as meeting the agreed acceptance criteria. Known open defects may still exist — they are documented, prioritized, and often deferred to a future release based on risk and business decisions.

**3. A project has no formal SRS. Can STLC still proceed?**
It can proceed, but with significantly higher risk. Without an SRS, testers must derive test conditions from other sources — user stories, wireframes, stakeholder interviews, or existing behavior. The risk is that “expected behavior” becomes ambiguous, making it harder to determine whether something is a defect or a feature. In Agile projects, acceptance criteria in user stories serve a similar purpose.

**4. If a product passes Test Closure sign-off, does that mean it has no remaining defects?**
No. Sign-off means the product meets the *agreed acceptance criteria* — not that it is defect-free. There may be known low-priority defects that were accepted, and there may be unknown defects that testing did not reach. Sign-off is a business decision based on risk tolerance, not a guarantee of perfection.
