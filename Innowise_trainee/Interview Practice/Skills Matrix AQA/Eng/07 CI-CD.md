# CI-CD

## Table of Contents

- [[#Matrix Scope]]
- [[#Questions and Answers]]
	- [[#What Is Continuous Integration?]]
	- [[#What Is the Difference Between Continuous Delivery and Continuous Deployment?]]
	- [[#What Happens in a Basic Pipeline After a Commit?]]
	- [[#How Do You Configure a Basic CI Job?]]
	- [[#How Does a Microservice Pipeline Differ?]]
	- [[#What Are Quality Gates and Infrastructure as Code?]]
	- [[#What Should You Know About Pipeline Scripts?]]
	- [[#How Do Common CI Tools Differ?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Matrix Scope

This note covers:

- Continuous Integration, Continuous Delivery, and Continuous Deployment.
- Basic jobs and pipelines in Jenkins, TeamCity, GitLab CI, CircleCI, Bamboo, or Azure DevOps.
- Test-pyramid stages, quality gates, microservices, Infrastructure as Code, linters, and static analysis.

---

## Questions and Answers

### What Is Continuous Integration?

**Short answer:**

Continuous Integration means developers merge small changes frequently and an automated pipeline builds and checks them. A typical CI run compiles code, runs fast tests, performs static analysis, packages artifacts, and reports feedback quickly.

### What Is the Difference Between Continuous Delivery and Continuous Deployment?

**Short answer:**

Continuous Delivery keeps every approved change ready for production, but production release still needs a manual business decision. Continuous Deployment automatically releases every change that passes the pipeline. Both require reliable tests, monitoring, rollback, and controlled configuration.

### What Happens in a Basic Pipeline After a Commit?

**Short answer:**

The pipeline checks out code, restores dependencies, builds it, runs linters and unit tests, then integration or API tests, packages an artifact, and may deploy to a test environment for a small E2E suite. Faster lower-level checks run first so failures stop expensive later stages.

### How Do You Configure a Basic CI Job?

**Short answer:**

I define the trigger, repository and branch, runtime and dependencies, environment variables or secret references, build commands, test commands, timeouts, artifacts, reports, and notification rules. I keep secrets in the CI secret store and make the job reproducible from version-controlled configuration.

### How Does a Microservice Pipeline Differ?

**Short answer:**

A microservice pipeline should build and test only affected services where possible. It commonly adds contract tests, container-image scanning, service integration tests, image publishing, environment deployment, smoke checks, and progressive rollout. Shared dependencies and compatibility between service versions are important risks.

### What Are Quality Gates and Infrastructure as Code?

**Short answer:**

A Quality Gate blocks promotion when agreed conditions fail, such as tests, linting, security scanning, coverage policy, or critical static-analysis issues. Infrastructure as Code stores environment definitions in version control so they can be reviewed and reproduced. A gate must reflect real risk rather than one isolated metric.

### What Should You Know About Pipeline Scripts?

**Short answer:**

Pipeline scripts may use YAML, Groovy, shell, or PowerShell. I keep steps small, quote variables safely, check exit codes, use `try/finally` or post-actions for cleanup and reports, and avoid printing secrets. Complex reusable logic should be tested and maintained like application code.

### How Do Common CI Tools Differ?

Jenkins commonly uses a `Jenkinsfile` and Groovy pipeline syntax. TeamCity uses build configurations and Kotlin DSL when configuration is stored as code. Bamboo and Azure DevOps also define jobs, agents, variables, artifacts, and permissions; Azure DevOps can work with Git or TFVC repositories. GitLab CI uses `.gitlab-ci.yml`, while CircleCI uses `.circleci/config.yml`. The exact syntax differs, but a job always needs a trigger, runner or agent, commands, inputs, artifacts, reports, and secret handling.

**Sonar and linters:**

A linter checks code style and simple correctness rules. SonarQube or SonarCloud adds static analysis and can apply a Quality Gate. For example, a pipeline can run unit tests and coverage first, send the analysis to Sonar, and block promotion only when the agreed gate fails.

**Continuous Delivery in practice:**

After tests and checks pass, the pipeline publishes a versioned artifact or image, deploys it to a test or staging environment, runs Smoke checks, and waits for an authorised release action before production. Continuous Deployment removes that final manual release action, so monitoring, rollback, and safe deployment strategies become essential.

---

## Theory Links

- [[19 CI-CD with GitHub Actions]]
