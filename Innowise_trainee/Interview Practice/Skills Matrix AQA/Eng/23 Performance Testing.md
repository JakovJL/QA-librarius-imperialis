# Performance Testing

## Table of Contents

- [[#Questions and Answers]]
	- [[#What Is Performance Testing and What Questions Does It Answer?]]
	- [[#How Do Load, Stress, Spike, Soak, Volume, Capacity, and Scalability Testing Differ?]]
	- [[#How Do You Define a Baseline Workload Profile?]]
	- [[#How Do User Scenarios, Think Time, Delay, and Pacing Work?]]
	- [[#What Is the Difference Between Concurrency, Parallelism, and Load Steps?]]
	- [[#How Do You Calculate and Model Test Load?]]
	- [[#How Do Response Time, Latency, Throughput, RPS, TPS, and Error Rate Differ?]]
	- [[#Why Do Percentiles Matter More Than an Average?]]
	- [[#Which Infrastructure Metrics and Profiler Data Should You Read?]]
	- [[#How Do You Choose a Performance Testing Tool?]]
	- [[#How Do You Run JMeter in CLI Mode and Generate a Report?]]
	- [[#How Do You Know Whether the Load Generator Is the Bottleneck?]]
	- [[#How Do Monitoring Dashboards and CI/CD Support Performance Tests?]]
	- [[#How Do You Analyse Results and Write a Performance Report?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Questions and Answers

### What Is Performance Testing and What Questions Does It Answer?

**Answer:**

Performance testing evaluates how a system responds to a defined workload. Its goals are to find response-time, stability, capacity, scalability, and resource-use risks before users find them. It answers a measurable question, such as: “Can checkout keep P95 response time below two seconds for 200 concurrent users with less than one percent business errors?” It is not only “send many requests and see what happens.”

### How Do Load, Stress, Spike, Soak, Volume, Capacity, and Scalability Testing Differ?

**Answer:**

Load testing checks expected or planned traffic. Stress testing increases load beyond the expected limit to observe failure and recovery. Spike testing checks a sudden increase or decrease in traffic. Soak testing runs normal or high load for a long time to find leaks, slow degradation, or resource exhaustion. Volume testing uses large data sets. Capacity testing finds the maximum supported workload against stated criteria. Scalability testing checks how capacity changes when resources are added or removed. These tests can share a tool but need different workload and acceptance criteria.

### How Do You Define a Baseline Workload Profile?

**Answer:**

Build a baseline from production traffic, analytics, business forecasts, seasonal peaks, non-functional requirements, and known product changes. Identify the important user journeys, their business weight, arrival pattern, target devices or regions, data size, and dependencies. If production data is unavailable, document the assumptions and validate them with product and operations. A copied “100 users” value is not a load profile.

### How Do User Scenarios, Think Time, Delay, and Pacing Work?

**Answer:**

A user scenario is a realistic sequence of business actions, such as browse → add to cart → pay. Think time is a pause that represents time a user spends reading or deciding between actions. A delay can model a technical or business wait. Pacing controls how often a virtual user starts the next iteration, so it prevents an unrealistically fast loop. Use values from analytics or agreed assumptions; randomize them only within a documented range. Do not add sleep only to make a chart look realistic.

### What Is the Difference Between Concurrency, Parallelism, and Load Steps?

**Answer:**

Concurrency is the number of active users, requests, or transactions that overlap in time; define exactly which one the test reports. Parallelism is how many tasks run at the same instant, for example how many load-generator workers execute. A load step is one controlled increase in users or arrival rate, followed by a steady period to observe the system. Ramp-up avoids an accidental spike; step results show where response time, errors, or resources change sharply.

### How Do You Calculate and Model Test Load?

**Answer:**

Start with a business rate, for example orders per minute, then map it to user journeys and requests. If a journey produces three API requests and users complete it at 100 journeys per minute, the expected request mix is not simply 300 identical requests: each endpoint has its own share and timing. Model warm-up, ramp-up, steady state, ramp-down, test data, caching, and retries. Validate that the generator can produce the target rate before judging the application.

### How Do Response Time, Latency, Throughput, RPS, TPS, and Error Rate Differ?

**Answer:**

Response time is the elapsed time from sending a request until the complete response is received. Latency needs a local definition: depending on the tool, it may mean network delay or time until the first response byte, so do not treat it automatically as response time or round-trip time. Throughput is completed work per unit of time. RPS counts HTTP requests per second; TPS counts defined business transactions per second. Error rate is failed requests or transactions divided by the chosen total. State the denominator and what counts as a business error.

### Why Do Percentiles Matter More Than an Average?

**Answer:**

An average can hide a slow group of users. P95 means 95 percent of measured values are at or below that value; P99 exposes the slower one percent. A service with a one-second average and a ten-second P99 may still give an unacceptable experience. Read percentiles together with sample count, error rate, and the time period. Compare the same metric, endpoint, workload, and environment against a baseline or acceptance criterion.

### Which Infrastructure Metrics and Profiler Data Should You Read?

**Answer:**

Correlate test results with CPU, memory, disk I/O, network, database connections, queue depth, and container or VM limits. For JVM or .NET services, examine garbage-collection frequency, pause time, heap growth, and allocation pressure. A profiler can show CPU hot paths, allocations, locks, and slow calls for a controlled investigation; it is not normally attached to every high-load production-like run because it adds overhead. Look for a time correlation before claiming a bottleneck.

### How Do You Choose a Performance Testing Tool?

**Answer:**

Choose from protocol support, scripting language, team skill, distributed execution, reporting, CI integration, cost, and generator capacity. Apache JMeter is open source and supports many protocols through samplers. Gatling uses code-based scenarios, k6 uses JavaScript, and Locust uses Python. LoadRunner is an enterprise commercial product; BlazeMeter provides hosted load-testing services. LoadUI Pro appears in older tool lists, so confirm current vendor support before selecting it for a new project. A tool does not make an unrealistic workload valid.

### How Do You Run JMeter in CLI Mode and Generate a Report?

**Answer:**

Build and debug a test plan in the GUI if needed, but run a load test in CLI mode. Save the raw result file and generate the HTML dashboard after the run. The report directory must be empty or not exist before JMeter writes it. Parameterize environment values through properties instead of editing the JMX file for every run.

```bash
jmeter -n -t checkout.jmx -l results.jtl -e -o report
```

### How Do You Know Whether the Load Generator Is the Bottleneck?

**Answer:**

Monitor the generator's CPU, memory, network, open connections, and actual sent rate. If the generator is saturated, it may send less load than planned or add its own latency, so the result says little about the system under test. Use appropriately sized generators, reduce heavy listeners during the run, and distribute load when justified. Run a small calibration test against a simple endpoint or service before an expensive full test.

### How Do Monitoring Dashboards and CI/CD Support Performance Tests?

**Answer:**

Dashboards combine application and infrastructure telemetry with test metrics. For example, a JMeter Backend Listener can send metrics to a time-series backend such as InfluxDB for Grafana, while k6 can send metrics through Prometheus remote write to Grafana. Zabbix can monitor hosts and infrastructure. A CI stage should run a controlled, repeatable smoke or baseline performance test, publish raw results and dashboards, and fail only on agreed thresholds. Do not run an uncontrolled destructive stress test on every commit.

### How Do You Analyse Results and Write a Performance Report?

**Answer:**

State the goal, environment, application version, data, tool and generator capacity, scenario mix, load schedule, warm-up, and acceptance criteria. Report throughput, percentiles, errors, resource metrics, bottlenecks, and comparison with the baseline. Separate confirmed facts from hypotheses and record limits, anomalies, and actions. A useful conclusion is specific: “At 150 RPS, P95 checkout time exceeded the two-second criterion while database CPU reached 95%; investigate the payment-query plan.”

---

## Theory Links

- [[17 Performance Testing]]
