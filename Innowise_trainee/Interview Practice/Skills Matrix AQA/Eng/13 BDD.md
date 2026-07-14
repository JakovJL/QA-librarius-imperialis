# BDD

## Table of Contents

- [[#Questions and Answers]]
	- [[#What Is It and What Should You Know?]]
	- [[#What Practical Skills Should an Automation QA Demonstrate?]]
	- [[#Which Mistakes and Risks Matter?]]
- [[#Intern and Junior Requirements]]
- [[#Middle and Senior Requirements]]
	- [[#What Do Given, When, Then, And, and But Mean?]]
	- [[#How Do Feature, Scenario, Background, Scenario Outline, and Examples Work?]]
	- [[#How Do Gherkin Steps Connect to Java Code?]]
	- [[#What Are Cucumber, SpecFlow, and Robot Framework?]]
	- [[#When Should a Team Use BDD?]]
	- [[#How Should Step Definitions and Hooks Be Structured?]]
	- [[#How Do You Maintain a Large BDD Suite in CI?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Questions and Answers

### What Is It and What Should You Know?

**Short answer:**

BDD describes behaviour with shared examples. Given sets context, When an action, and Then an observable result; Cucumber connects Gherkin steps to code.

### What Practical Skills Should an Automation QA Demonstrate?

**Short answer:**

Use Feature, Scenario, Background, Scenario Outline, Examples, tags, hooks, and reusable step layers; run selected tags and publish reports in CI.

### Which Mistakes and Risks Matter?

**Short answer:**

Avoid technical UI steps, duplicated scenarios, hidden setup, giant step definitions, and BDD when stakeholders do not use the examples.

---

## Intern and Junior Requirements

- A `Feature` describes a business capability; a `Scenario` is one example. `Given` defines context, `When` describes an action, and `Then` states an observable outcome. `And` and `But` continue the previous keyword without changing its meaning.
- `Background` contains short shared preconditions for every scenario in one feature. `Scenario Outline` is a parameterised scenario; every row in `Examples` becomes a separate execution. Tags group scenarios and filter a run, for example `@smoke`.
- Cucumber maps a Gherkin step to a Java method with step-definition annotations. Run a `.feature` file through the Cucumber runner or run selected tags. Cucumber, SpecFlow, and Robot Framework support readable executable examples, but have different language ecosystems.
- Write business language: “When the customer pays” is better than “When I click CSS selector”. Avoid duplicate scenarios; vary data with a Scenario Outline when the behaviour is the same.

---

## Middle and Senior Requirements

- BDD is useful when business, QA, and development can discuss examples together. It is not useful when feature files are written only after coding and nobody outside QA reads them. Review a feature for clear outcome, one behaviour, meaningful data, no hidden setup, and no duplicate rules.
- Hooks such as `@Before` and `@After` prepare and clean a scenario. Keep them small and visible; do not put business actions into hooks. Use a thin step definition, a reusable domain step layer, and UI/API clients below it. Atomic steps expose low-level actions; a reusable DSL expresses business actions. Prefer the latter in feature files.
- Measure requirement-to-scenario coverage, execution time, pass rate, and flaky rate. A large suite needs tag strategy, parallel-safe data, split features, and CI selection by tag, branch, or changed component.
- Configure Cucumber with tags, glue packages, dry run, formatter plugins, and report paths. CI publishes reports and may send results to Jira/Xray or a Test Management System. Contract examples can be aligned with OpenAPI or Pact, but a Gherkin scenario does not replace an API contract.

---

## Detailed Question and Answer

### What Do Given, When, Then, And, and But Mean?

**Answer:**

`Given` describes the starting context, `When` describes an action, and `Then` describes an observable result. `And` and `But` continue the previous step in readable language. A scenario should describe behaviour, not technical clicks or selectors.

```gherkin
Given a registered customer has an item in the cart
When the customer pays with a valid card
Then the order status is "Paid"
```

### How Do Feature, Scenario, Background, Scenario Outline, and Examples Work?

**Answer:**

A `Feature` describes one business capability. A `Scenario` is one concrete example. `Background` contains short shared preconditions for every scenario in that feature; it must not hide the main behaviour. A `Scenario Outline` is one parameterised scenario, and each row in `Examples` becomes a separate execution. Tags such as `@smoke` or `@api` group scenarios and filter a run.

### How Do Gherkin Steps Connect to Java Code?

**Answer:**

Cucumber finds Java methods annotated with `@Given`, `@When`, and `@Then`. The text or expression in the annotation matches the Gherkin step. A runner starts a selected feature, directory, or tag expression. Step definitions should call a workflow or page/API layer; they should not contain long Selenium code.

### What Are Cucumber, SpecFlow, and Robot Framework?

**Answer:**

Cucumber is a BDD tool that runs Gherkin scenarios with bindings in languages such as Java. SpecFlow is the .NET/C# equivalent that uses Gherkin. Robot Framework is a keyword-driven framework that can also express readable acceptance scenarios. The team selects a tool that fits its language, reporting, CI, and stakeholder workflow.

### When Should a Team Use BDD?

**Answer:**

BDD is useful when product, QA, and development need a shared example before implementation. It improves clarification and creates living documentation when people keep it current. It is a poor choice when scenarios are written after coding, only QA reads them, or the feature needs technical unit-level feedback rather than business examples.

### How Should Step Definitions and Hooks Be Structured?

**Answer:**

A step definition should be thin: it translates Gherkin text to a domain action. A reusable workflow or step layer performs the business action, while page objects or API clients perform technical interaction. `@Before` and `@After` hooks prepare and clean state; they must not silently perform the action that the scenario is meant to show. This avoids giant step definitions and hidden setup.

### How Do You Maintain a Large BDD Suite in CI?

**Answer:**

Use meaningful tags, fast feedback groups, parallel-safe data, and separate UI, API, and integration suites. Track requirement coverage, execution time, pass rate, and flaky rate. Configure Cucumber with tag filters, glue packages, dry run, formatter plugins, and report paths. CI can publish results to Jira/Xray or a Test Management System and run impacted scenarios, but contract checks from OpenAPI or Pact remain separate tests.

---

## Theory Links

- [[20 Automation Framework Architecture]]
