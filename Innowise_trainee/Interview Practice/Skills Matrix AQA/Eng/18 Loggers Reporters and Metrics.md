# Loggers Reporters and Metrics

## Table of Contents

- [[#Questions and Answers]]
	- [[#How Do Logs, Reports, and Metrics Differ?]]
	- [[#What Should a Test Status Report Contain?]]
	- [[#Which Evidence Should Be Attached to a Failed Test?]]
	- [[#How Do Allure, ReportPortal, and Framework Reports Differ?]]
	- [[#How Do You Read an Allure Report?]]
	- [[#Which Test Execution Metrics Are Useful?]]
	- [[#What Do Coverage and Test-Case Progress Mean?]]
	- [[#Which Defect Metrics Are Useful?]]
	- [[#How Do You Report a Smoke or Regression Run?]]
	- [[#How Should CI Generate, Publish, and Store Reports?]]
	- [[#How Do You Communicate Quality Status and Release Risk?]]
	- [[#What Does Senior-Level Reporting Governance Include?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Questions and Answers

### How Do Logs, Reports, and Metrics Differ?

**Answer:**

Logs are chronological technical records that help diagnose an execution: time, event, level, context, and error details. A report summarises one test run for a reader: scope, results, evidence, and risk. A metric is a defined number or trend used for a decision. A log is not a report, and one metric is not proof that a release is ready. Never write passwords, tokens, personal data, or other secrets to logs or report attachments.

### What Should a Test Status Report Contain?

**Answer:**

A useful report states the purpose and scope, application build and environment, dates, executed/passed/failed/blocked/not-run counts, linked defects, evidence, and remaining risks. It also says what was not tested and gives a clear recommendation, such as “ready for limited release” or “blocked by payment defect.” The level of detail depends on the reader: an engineer needs a failing stack trace; a customer needs impact and risk.

### Which Evidence Should Be Attached to a Failed Test?

**Answer:**

Attach only evidence that helps reproduce or diagnose the failure: a screenshot for a visible UI state, video when the sequence matters, browser or device logs, request and response details with secrets redacted, and the test parameters and environment. Include a link to the CI job and defect when available. Do not attach large files by default or hide the actual error under many unstructured logs.

### How Do Allure, ReportPortal, and Framework Reports Differ?

**Answer:**

JUnit and TestNG integrations usually produce machine-readable result files and basic suite reports for CI. Allure turns test results into an interactive HTML report with steps, attachments, categories, environment, history, and trends. ReportPortal is a TestOps service for central, real-time result analysis, dashboards, and collaborative failure triage. Choose the smallest tool that gives the team the required history, evidence, access control, and CI integration.

### How Do You Read an Allure Report?

**Answer:**

Start with the build, environment, and suite scope. Then open failed tests and read their steps, assertion difference, exception, and attachments. Categories group similar failures, such as product defects or infrastructure errors. History and retries help identify an unstable test, but a retry does not make the original failure disappear. Compare results only when environments and selected tests are comparable.

### Which Test Execution Metrics Are Useful?

**Answer:**

Useful run metrics are passed, failed, blocked, skipped or not-run, duration, retry count, and flaky-test rate. Pass rate must state its denominator; for example, `passed / executed`, where executed means passed plus failed. A blocked test is not a passed test, and a skipped test can hide missing coverage. Track critical-flow results separately from the total so a large number of low-risk passes does not hide a failed payment or login flow.

### What Do Coverage and Test-Case Progress Mean?

**Answer:**

Test-case progress shows how many planned cases were designed, ready, executed, and completed. Requirement coverage shows which agreed requirements or risks have one or more suitable tests. Code coverage shows which code was executed and is not the same as test quality or requirement coverage. A good coverage report names the scope and gaps, for example: “all high-risk checkout requirements are covered; refund on partial payment is not covered.”

### Which Defect Metrics Are Useful?

**Answer:**

Useful defect metrics include total open defects, severity distribution, trend over time, defect density, and escaped defects found after release. Defect density needs an agreed size denominator, such as story points or function points, and is useful only when the same definition is used over time. An escaped defect signals that a release process or test strategy missed a problem; it is a learning signal, not an automatic measure of one person's performance.

### How Do You Report a Smoke or Regression Run?

**Answer:**

State the build and environment, the selected smoke or regression scope, counts by result, critical failures, blockers, linked defects, and remaining risk. A smoke report answers whether the build is stable enough for deeper testing. A regression report also highlights changed areas, failed previously passing tests, flaky results, and comparison with the previous run. Send a short factual status to the team chat or stand-up and link the full report.

### How Should CI Generate, Publish, and Store Reports?

**Answer:**

The CI job should collect results and artifacts even when tests fail, then publish the HTML report and machine-readable JUnit/TestNG results. Give artifacts a build identifier and retain them for an agreed period. Store long-term history in the reporting platform, object storage, or a database only when the team needs trend analysis. Restrict access and redact secrets before upload. A successful upload does not mean the tests passed.

### How Do You Communicate Quality Status and Release Risk?

**Answer:**

Use a Test Summary Report or dashboard to answer: what was tested, what passed or failed, what evidence exists, what risk remains, and what decision is recommended. Explain impact in product language: “checkout is blocked for guest users,” not only “three tests failed.” Include agreed SLA or release criteria where they exist, but name uncertainty honestly. QA provides evidence and a recommendation; the release decision belongs to the agreed decision-makers.

### What Does Senior-Level Reporting Governance Include?

**Answer:**

Senior QA defines report templates, metric formulas, owners, data sources, retention, access rules, and a common failure taxonomy. They choose and maintain coverage and reporting tools, configure CI/CD publication, and create useful dashboard widgets or integrations when the built-in view is insufficient. They teach the team to use consistent evidence and metric definitions, review trends with stakeholders, and remove vanity metrics that do not change a decision.

---

## Theory Links

- [[21 Logging Reporting and Metrics]]
