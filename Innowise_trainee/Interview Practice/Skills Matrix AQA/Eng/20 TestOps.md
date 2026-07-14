# TestOps

## Table of Contents

- [[#Questions and Answers]]
	- [[#What Is TestOps and How Does It Relate to DevOps and DevTestOps?]]
	- [[#What Does a TestOps Process Own?]]
	- [[#Which Cloud Services Should an Automation QA Know First?]]
	- [[#Why Use Cloud Test Environments?]]
	- [[#How Do You Secure Cloud Access for Testing?]]
	- [[#How Do You Design an Isolated Test Environment and Test Data?]]
	- [[#How Should a Team Store Test Artifacts and Data?]]
	- [[#How Do Automated Tests Run Through CI/CD in the Cloud?]]
	- [[#What Is Infrastructure as Code and How Does It Help Testing?]]
	- [[#How Do You Monitor and Alert on Test Environments?]]
	- [[#How Do Scalability and Resilience Apply to Test Environments?]]
	- [[#How Do Managed Databases, Queues, Serverless Functions, and Kubernetes Support Tests?]]
	- [[#How Do You Control Cloud Cost and Environment Lifetime?]]
	- [[#What Does a Senior TestOps Strategy Include?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Questions and Answers

### What Is TestOps and How Does It Relate to DevOps and DevTestOps?

**Answer:**

TestOps applies operational practices to testing: environments, test data, execution, reporting, observability, access, cost, and ownership. DevOps improves the delivery flow between development and operations. DevTestOps makes testing a first-class part of that flow. TestOps is not only a tool or a job title; it is a repeatable way to give fast, trustworthy feedback about quality.

### What Does a TestOps Process Own?

**Answer:**

A TestOps process defines how an environment is created, configured, discovered, monitored, used by tests, reported on, and removed. It assigns owners for environments, test data, secrets, reports, and failures. It also defines service-level expectations: how quickly a test environment is ready, what evidence a failed run keeps, and when a broken environment blocks a pipeline. Without ownership and cleanup, cloud testing becomes slow and expensive.

### Which Cloud Services Should an Automation QA Know First?

**Answer:**

Start with compute, storage, identity and access, networking, and logging. On AWS these include EC2, S3, IAM, and CloudWatch; on Azure, Virtual Machines, Blob Storage, RBAC or managed identities, and Azure Monitor; on GCP, Compute Engine, Cloud Storage, IAM, and Cloud Monitoring. A junior QA should be able to use the cloud console under guidance to start or stop a test VM, view a job's logs, and find the relevant artifact. Learn concepts first; the exact service name differs by provider.

### Why Use Cloud Test Environments?

**Answer:**

Cloud environments can be created from versioned configuration, scaled for parallel test runs, and removed after use. They let a team test close to production-like managed services without maintaining all hardware locally. A cloud environment is not automatically reproducible: its network rules, versions, data, identities, and configuration must be declared and controlled. Do not test against production unless the organisation explicitly permits a safe, limited scenario.

### How Do You Secure Cloud Access for Testing?

**Answer:**

Use least-privilege roles or service identities: a test job receives only the actions and resources it needs. Prefer short-lived credentials issued to the workload over long-lived keys stored in CI. Keep secrets in an approved secret manager or CI secret store, restrict network access with security groups, NSGs, firewalls, or network policies, and review access regularly. Test data needs the same protection as production data when it contains personal or confidential information.

### How Do You Design an Isolated Test Environment and Test Data?

**Answer:**

Give each environment or parallel run a clear identifier, isolated namespace or account/project where possible, own test data, and explicit network boundaries. The test must create required data through supported APIs or fixtures and clean it up, or use a disposable database. Avoid a permanent shared “QA” environment with unknown state. Record the application version, environment configuration, data seed, and test parameters so a failure can be reproduced.

### How Should a Team Store Test Artifacts and Data?

**Answer:**

Use object storage such as S3, Azure Blob Storage, or Google Cloud Storage for reports, screenshots, videos, logs, and large test artifacts. Name objects with project, environment, build, and run identifiers; define retention and access rules. Store structured results in a reporting platform or database when historical analysis needs queries. Encrypt data in transit and at rest according to policy, redact secrets from artifacts, and delete temporary data when its retention period ends.

### How Do Automated Tests Run Through CI/CD in the Cloud?

**Answer:**

A CI pipeline can build an application image, create or select a test environment, obtain a short-lived test identity, run the right suite, publish results, and remove temporary resources. Jenkins, GitLab CI, Azure DevOps, GitHub Actions, and similar systems can run cloud jobs or trigger cloud services. Use quality gates based on agreed criteria, not only pass rate. A failed test must still upload diagnostics, and a failed cleanup must be visible to an owner.

### What Is Infrastructure as Code and How Does It Help Testing?

**Answer:**

Infrastructure as Code (IaC) defines infrastructure in versioned files instead of manual console steps. Terraform can manage cloud and on-premises resources through providers; CloudFormation, ARM or Bicep, and Google Cloud tools are provider-specific alternatives. IaC makes an environment reviewable, repeatable, and safe to change through a plan-and-apply workflow. Protect IaC state and secrets because they can reveal infrastructure details.

```hcl
resource "aws_instance" "test_runner" {
  ami           = var.test_ami_id
  instance_type = "t3.small"

  tags = {
    Environment = "qa-${var.run_id}"
    Owner       = "testops"
  }
}
```

### How Do You Monitor and Alert on Test Environments?

**Answer:**

Collect application and infrastructure logs, metrics, traces where useful, and test execution results. Monitor availability, error rate, latency, resource saturation, queue depth, database connections, and environment readiness. Use CloudWatch, Azure Monitor, Google Cloud Monitoring, Prometheus, Grafana, or an equivalent stack according to the platform. Alerts need an owner, a useful threshold, and a runbook; an alert that nobody can act on is noise.

### How Do Scalability and Resilience Apply to Test Environments?

**Answer:**

Scalability means the environment can handle more parallel users, tests, or data by adding capacity. Resilience means it continues or recovers when a dependency fails. Test environments can check autoscaling behaviour, retry rules, failover, backup restore, and timeouts, but those tests need controlled load and clear acceptance criteria. A smaller test environment may not prove production capacity, so report its limits honestly.

### How Do Managed Databases, Queues, Serverless Functions, and Kubernetes Support Tests?

**Answer:**

Managed databases such as RDS, Azure SQL, or Cloud SQL provide realistic persistence for integration tests. Queues and topics let tests verify asynchronous messaging and retries. Serverless functions such as Lambda, Azure Functions, or Cloud Functions support event-driven scenarios. Kubernetes services such as EKS, AKS, and GKE can create isolated namespaces and dynamic test workloads. Use real managed dependencies only when their value is greater than cost, speed, and data risk; use stubs or emulators for many fast tests.

### How Do You Control Cloud Cost and Environment Lifetime?

**Answer:**

Tag every resource with owner, project, environment, and expiry time. Use budgets, cost alerts, quotas, and scheduled cleanup. Prefer short-lived test environments and right-sized compute; stop or remove idle resources. Review unusually expensive test runs and storage growth. Cost control is part of quality engineering because an unaffordable test platform will not be used consistently.

### What Does a Senior TestOps Strategy Include?

**Answer:**

A senior strategy defines target feedback time, environment tiers, access model, data policy, IaC modules, observability, quality gates, disaster and cleanup rules, cost controls, and ownership. It can work across AWS, Azure, and GCP when that solves a real business need, rather than creating multi-cloud complexity by default. A senior engineer selects tools from requirements, mentors the team, documents safe practices, and measures whether the platform improves feedback speed, reliability, and decision quality. Cloud certifications can support learning, but practical, secure delivery is the evidence of skill.

---

## Theory Links

- [[22 Docker and Test Environments]]
