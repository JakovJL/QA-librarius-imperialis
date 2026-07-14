# TestOps

## Содержание

- [[#Вопросы и ответы]]
	- [[#Что такое TestOps и как он связан с DevOps и DevTestOps?]]
	- [[#За что отвечает процесс TestOps?]]
	- [[#Какие cloud services Automation QA должен знать в первую очередь?]]
	- [[#Зачем использовать cloud test environments?]]
	- [[#Как обеспечить безопасность cloud access для testing?]]
	- [[#Как спроектировать isolated test environment и test data?]]
	- [[#Как команде хранить test artifacts и data?]]
	- [[#Как automated tests запускаются через CI/CD в cloud?]]
	- [[#Что такое Infrastructure as Code и как оно помогает testing?]]
	- [[#Как мониторить test environments и настраивать alerts?]]
	- [[#Как scalability и resilience относятся к test environments?]]
	- [[#Как managed databases, queues, serverless functions и Kubernetes поддерживают tests?]]
	- [[#Как контролировать cloud cost и environment lifetime?]]
	- [[#Что включает Senior TestOps strategy?]]
- [[#Ссылки на теорию]]

**Связанные заметки:** [[00 Индекс Skills Matrix AQA]]

---

## Вопросы и ответы

### Что такое TestOps и как он связан с DevOps и DevTestOps?

**Ответ:**

TestOps применяет operational practices к testing: environments, test data, execution, reporting, observability, access, cost и ownership. DevOps улучшает delivery flow между development и operations. DevTestOps делает testing первой частью этого flow. TestOps — не только tool или job title, а repeatable way давать быстрый и достоверный feedback о quality.

### За что отвечает процесс TestOps?

**Ответ:**

Процесс TestOps определяет, как environment создаётся, настраивается, обнаруживается, мониторится, используется tests, попадает в reports и удаляется. Он назначает owners для environments, test data, secrets, reports и failures. Он также определяет service-level expectations: как быстро test environment готово, какие evidence сохраняются при failed run и когда broken environment блокирует pipeline. Без ownership и cleanup cloud testing становится медленным и дорогим.

### Какие cloud services Automation QA должен знать в первую очередь?

**Ответ:**

Начать нужно с compute, storage, identity and access, networking и logging. В AWS это EC2, S3, IAM и CloudWatch; в Azure — Virtual Machines, Blob Storage, RBAC или managed identities и Azure Monitor; в GCP — Compute Engine, Cloud Storage, IAM и Cloud Monitoring. Junior QA должен уметь под руководством зайти в cloud console, запустить или остановить test VM, посмотреть job logs и найти нужный artifact. Сначала изучаются concepts: exact service name зависит от provider.

### Зачем использовать cloud test environments?

**Ответ:**

Cloud environments можно создавать из versioned configuration, масштабировать для parallel test runs и удалять после использования. Они позволяют test close to production-like managed services без поддержки всего hardware локально. Cloud environment не становится reproducible автоматически: network rules, versions, data, identities и configuration должны быть объявлены и контролироваться. Нельзя тестировать против production, если organization явно не разрешила безопасный ограниченный scenario.

### Как обеспечить безопасность cloud access для testing?

**Ответ:**

Нужно использовать least-privilege roles или service identities: test job получает только нужные actions и resources. Предпочтительны short-lived credentials, выданные workload, а не long-lived keys в CI. Secrets хранятся approved secret manager или CI secret store, network access ограничивается security groups, NSGs, firewalls или network policies, а access регулярно проверяется. Test data нуждаются в такой же защите, как production data, если содержат personal или confidential information.

### Как спроектировать isolated test environment и test data?

**Ответ:**

Каждому environment или parallel run нужен понятный identifier, isolated namespace или account/project, где возможно, собственные test data и explicit network boundaries. Test должен создать нужные data через supported APIs или fixtures и удалить их либо использовать disposable database. Нельзя полагаться на permanent shared «QA» environment с неизвестным state. Нужно записывать application version, environment configuration, data seed и test parameters, чтобы failure можно было воспроизвести.

### Как команде хранить test artifacts и data?

**Ответ:**

Object storage, например S3, Azure Blob Storage или Google Cloud Storage, подходит для reports, screenshots, videos, logs и large test artifacts. Objects нужно называть с project, environment, build и run identifiers, а также определить retention и access rules. Structured results хранятся reporting platform или database, когда historical analysis требует queries. Данные должны быть encrypted in transit и at rest согласно policy; secrets скрываются в artifacts, а temporary data удаляются после retention period.

### Как automated tests запускаются через CI/CD в cloud?

**Ответ:**

CI pipeline может build application image, создать или выбрать test environment, получить short-lived test identity, запустить нужную suite, опубликовать results и удалить temporary resources. Jenkins, GitLab CI, Azure DevOps, GitHub Actions и подобные systems могут запускать cloud jobs или вызывать cloud services. Quality gates строятся по agreed criteria, а не только pass rate. Failed test всё равно должна загрузить diagnostics, а failed cleanup должен быть виден owner.

### Что такое Infrastructure as Code и как оно помогает testing?

**Ответ:**

Infrastructure as Code (IaC) определяет infrastructure в versioned files вместо manual console steps. Terraform может управлять cloud и on-premises resources через providers; CloudFormation, ARM или Bicep и Google Cloud tools — provider-specific alternatives. IaC делает environment reviewable, repeatable и безопасным для change через plan-and-apply workflow. Нужно защищать IaC state и secrets, потому что они могут раскрыть infrastructure details.

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

### Как мониторить test environments и настраивать alerts?

**Ответ:**

Нужно собирать application и infrastructure logs, metrics, traces при необходимости и test execution results. Мониторятся availability, error rate, latency, resource saturation, queue depth, database connections и environment readiness. Используются CloudWatch, Azure Monitor, Google Cloud Monitoring, Prometheus, Grafana или equivalent stack для platform. У каждого alert должен быть owner, useful threshold и runbook; alert, на который никто не может реагировать, — это noise.

### Как scalability и resilience относятся к test environments?

**Ответ:**

Scalability означает, что environment может обработать больше parallel users, tests или data при добавлении capacity. Resilience означает, что оно продолжает работу или восстанавливается при failure dependency. Test environments могут проверять autoscaling behaviour, retry rules, failover, backup restore и timeouts, но таким tests нужны controlled load и clear acceptance criteria. Маленькое test environment может не доказать production capacity, поэтому его limits нужно честно сообщать.

### Как managed databases, queues, serverless functions и Kubernetes поддерживают tests?

**Ответ:**

Managed databases, например RDS, Azure SQL или Cloud SQL, дают realistic persistence для integration tests. Queues и topics позволяют tests проверить asynchronous messaging и retries. Serverless functions, например Lambda, Azure Functions или Cloud Functions, поддерживают event-driven scenarios. Kubernetes services EKS, AKS и GKE могут создавать isolated namespaces и dynamic test workloads. Real managed dependencies стоит использовать, только когда их value больше cost, speed и data risk; для многих fast tests подходят stubs или emulators.

### Как контролировать cloud cost и environment lifetime?

**Ответ:**

Каждый resource нужно tag с owner, project, environment и expiry time. Нужны budgets, cost alerts, quotas и scheduled cleanup. Лучше использовать short-lived test environments и right-sized compute, а idle resources останавливать или удалять. Следует проверять unusually expensive test runs и рост storage. Cost control — часть quality engineering: слишком дорогая test platform не будет использоваться consistently.

### Что включает Senior TestOps strategy?

**Ответ:**

Senior strategy определяет target feedback time, environment tiers, access model, data policy, IaC modules, observability, quality gates, disaster и cleanup rules, cost controls и ownership. Она может работать с AWS, Azure и GCP, когда это решает реальную business need, а не создаёт multi-cloud complexity по умолчанию. Senior engineer выбирает tools по requirements, менторит команду, документирует safe practices и измеряет, улучшает ли platform feedback speed, reliability и decision quality. Cloud certifications могут поддержать обучение, но доказательством skill остаётся practical secure delivery.

---

## Ссылки на теорию

- [[22 Docker и тестовые окружения]]
