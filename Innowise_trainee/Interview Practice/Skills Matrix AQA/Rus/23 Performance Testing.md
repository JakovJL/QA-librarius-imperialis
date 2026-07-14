# Performance Testing

## Содержание

- [[#Вопросы и ответы]]
	- [[#Что такое Performance testing и на какие вопросы оно отвечает?]]
	- [[#Чем отличаются Load, Stress, Spike, Soak, Volume, Capacity и Scalability testing?]]
	- [[#Как определить baseline workload profile?]]
	- [[#Как работают user scenarios, think time, delay и pacing?]]
	- [[#Чем отличаются concurrency, parallelism и load steps?]]
	- [[#Как рассчитать и смоделировать test load?]]
	- [[#Чем отличаются response time, latency, throughput, RPS, TPS и error rate?]]
	- [[#Почему percentiles важнее average?]]
	- [[#Какие infrastructure metrics и profiler data нужно читать?]]
	- [[#Как выбрать tool для Performance testing?]]
	- [[#Как запустить JMeter в CLI mode и сгенерировать report?]]
	- [[#Как понять, что bottleneck находится в load generator?]]
	- [[#Как monitoring dashboards и CI/CD поддерживают Performance tests?]]
	- [[#Как анализировать results и составлять Performance report?]]
- [[#Ссылки на теорию]]

**Связанные заметки:** [[00 Индекс Skills Matrix AQA]]

---

## Вопросы и ответы

### Что такое Performance testing и на какие вопросы оно отвечает?

**Ответ:**

Performance testing оценивает реакцию system на определённый workload. Его цели — найти risks response time, stability, capacity, scalability и resource use до того, как их обнаружат users. Оно отвечает на измеримый вопрос, например: «Может ли checkout сохранить P95 response time ниже двух секунд для 200 concurrent users при менее чем одном проценте business errors?» Это не просто «послать много requests и посмотреть, что будет».

### Чем отличаются Load, Stress, Spike, Soak, Volume, Capacity и Scalability testing?

**Ответ:**

Load testing проверяет ожидаемый или планируемый traffic. Stress testing увеличивает load выше ожидаемого limit, чтобы наблюдать failure и recovery. Spike testing проверяет sudden increase или decrease traffic. Soak testing запускает normal или high load на длительное время для поиска leaks, slow degradation или resource exhaustion. Volume testing использует large data sets. Capacity testing находит maximum supported workload по stated criteria. Scalability testing проверяет, как capacity меняется при добавлении или удалении resources. Для этих tests можно использовать один tool, но нужны разные workload и acceptance criteria.

### Как определить baseline workload profile?

**Ответ:**

Baseline строится по production traffic, analytics, business forecasts, seasonal peaks, non-functional requirements и known product changes. Нужно определить important user journeys, их business weight, arrival pattern, target devices или regions, data size и dependencies. Если production data нет, assumptions документируются и валидируются с product и operations. Скопированное значение «100 users» не является load profile.

### Как работают user scenarios, think time, delay и pacing?

**Ответ:**

User scenario — реалистичная sequence business actions, например browse → add to cart → pay. Think time — пауза, моделирующая время user на чтение или решение между actions. Delay может моделировать technical или business wait. Pacing контролирует, как часто virtual user начинает следующую iteration, поэтому предотвращает unrealistically fast loop. Values берутся из analytics или agreed assumptions; randomization допустима только в documented range. Нельзя добавлять sleep только для того, чтобы graph выглядел realistic.

### Чем отличаются concurrency, parallelism и load steps?

**Ответ:**

Concurrency — количество active users, requests или transactions, пересекающихся во времени; нужно точно определить, что именно считает test. Parallelism — сколько tasks выполняются в один момент, например сколько workers load generator исполняет. Load step — controlled increase users или arrival rate с последующим steady period для наблюдения system. Ramp-up предотвращает случайный spike; results steps показывают место, где response time, errors или resources резко меняются.

### Как рассчитать и смоделировать test load?

**Ответ:**

Нужно начать с business rate, например orders per minute, затем сопоставить его user journeys и requests. Если journey создаёт три API requests, а users завершают её 100 раз в minute, expected request mix — не просто 300 identical requests: у каждого endpoint собственная share и timing. Моделируются warm-up, ramp-up, steady state, ramp-down, test data, caching и retries. До оценки application нужно подтвердить, что generator способен создать target rate.

### Чем отличаются response time, latency, throughput, RPS, TPS и error rate?

**Ответ:**

Response time — elapsed time от отправки request до получения complete response. Для latency нужно локальное definition: в зависимости от tool это network delay или time до first response byte, поэтому её нельзя автоматически считать response time или round-trip time. Throughput — completed work за unit времени. RPS считает HTTP requests per second; TPS считает defined business transactions per second. Error rate — failed requests или transactions, разделённые на выбранный total. Нужно указать denominator и то, что считается business error.

### Почему percentiles важнее average?

**Ответ:**

Average может скрыть группу slow users. P95 означает, что 95 процентов measured values меньше либо равны этому value; P99 показывает более медленный один процент. Service с average в одну секунду и P99 в десять секунд всё равно может давать unacceptable experience. Percentiles читаются вместе с sample count, error rate и time period. Сравнивать можно только одинаковые metric, endpoint, workload и environment с baseline или acceptance criterion.

### Какие infrastructure metrics и profiler data нужно читать?

**Ответ:**

Нужно сопоставлять test results с CPU, memory, disk I/O, network, database connections, queue depth и container либо VM limits. Для JVM или .NET services проверяются garbage-collection frequency, pause time, heap growth и allocation pressure. Profiler может показать CPU hot paths, allocations, locks и slow calls при controlled investigation; его обычно не подключают к каждому high-load production-like run, потому что он добавляет overhead. Перед объявлением bottleneck нужна корреляция по времени.

### Как выбрать tool для Performance testing?

**Ответ:**

Выбор зависит от protocol support, scripting language, team skill, distributed execution, reporting, CI integration, cost и generator capacity. Apache JMeter — open-source tool с поддержкой многих protocols через samplers. Gatling использует code-based scenarios, k6 — JavaScript, а Locust — Python. LoadRunner — enterprise commercial product, BlazeMeter даёт hosted load-testing services. LoadUI Pro встречается в старых tool lists, поэтому перед выбором для нового project нужно проверить current vendor support. Tool не делает unrealistic workload валидным.

### Как запустить JMeter в CLI mode и сгенерировать report?

**Ответ:**

При необходимости test plan создаётся и debugging в GUI, но load test запускается в CLI mode. Нужно сохранить raw result file и сгенерировать HTML dashboard после run. Перед записью JMeter folder report должен быть empty или отсутствовать. Environment values нужно parameterize через properties, а не менять JMX file перед каждым run.

```bash
jmeter -n -t checkout.jmx -l results.jtl -e -o report
```

### Как понять, что bottleneck находится в load generator?

**Ответ:**

Нужно мониторить CPU, memory, network, open connections и actual sent rate generator. Если generator saturated, он может отправить меньше planned load или добавить собственную latency, поэтому результат мало говорит о system under test. Нужны appropriately sized generators, меньше heavy listeners во время run и distributed load, когда это оправдано. До expensive full test полезно провести small calibration test против simple endpoint или service.

### Как monitoring dashboards и CI/CD поддерживают Performance tests?

**Ответ:**

Dashboards объединяют application и infrastructure telemetry с test metrics. Например, JMeter Backend Listener может отправлять metrics в time-series backend, такой как InfluxDB, для Grafana, а k6 — передавать metrics через Prometheus remote write в Grafana. Zabbix может мониторить hosts и infrastructure. CI stage должна запускать controlled repeatable smoke или baseline performance test, публиковать raw results и dashboards и падать только по agreed thresholds. Нельзя запускать uncontrolled destructive stress test на каждом commit.

### Как анализировать results и составлять Performance report?

**Ответ:**

Нужно указать goal, environment, application version, data, tool и generator capacity, scenario mix, load schedule, warm-up и acceptance criteria. Report содержит throughput, percentiles, errors, resource metrics, bottlenecks и comparison с baseline. Confirmed facts нужно отделять от hypotheses, а limits, anomalies и actions записывать. Полезный вывод конкретен: «При 150 RPS P95 checkout превысил criterion две секунды, когда database CPU достиг 95%; нужно исследовать payment-query plan».

---

## Ссылки на теорию

- [[17 Тестирование производительности]]
