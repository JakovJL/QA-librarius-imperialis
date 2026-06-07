# 17 Performance Testing

## Table of Contents

- [[#What Is Performance Testing]]
- [[#Types of Performance Testing]]
	- [[#Load Testing]]
	- [[#Stress Testing]]
	- [[#Spike Testing]]
	- [[#Endurance Testing]]
	- [[#Scalability Testing]]
- [[#Key Metrics]]
- [[#How to Do Performance Testing]]
- [[#Performance Test Tools]]
- [[#Performance Tests Using Postman]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]

**Related notes:** [[QA manual eng]]

---

## What Is Performance Testing

Performance testing checks how a system behaves under a given workload — how fast it responds, how much load it can handle, and how stable it stays over time. It is a type of **non-functional** testing: it does not ask "does it work?" but "how well does it work?".

**Goal:** Confirm the system meets speed, stability, and scalability requirements before real users hit it.

**Questions it answers:**
- How fast does the system respond under normal load?
- How many users can it handle before it slows down or breaks?
- Does it stay stable over hours of use?
- What happens at the breaking point, and does it recover?

> [!info] Functional vs Performance
> Functional testing checks **correctness** — the right result. Performance testing checks **behavior under load** — speed and stability. A feature can be 100% correct and still fail performance if it takes 30 seconds to respond.

---

## Types of Performance Testing

### Load Testing

Test the system under an **expected, normal** level of load.

**Goal:** Confirm the system meets its response-time and throughput targets under typical usage.

**Example:** Simulate 1,000 users browsing a shop at the same time and confirm pages load within 2 seconds.

---

### Stress Testing

Push the system **beyond** its normal capacity until it breaks.

**Goal:** Find the breaking point and see how the system fails — and whether it recovers gracefully.

**Example:** Increase users from 1,000 to 10,000 until the server starts rejecting requests; check it returns clear errors instead of crashing.

---

### Spike Testing

Apply a **sudden, sharp** increase in load for a short time.

**Goal:** Check how the system handles a fast surge (e.g. a flash sale or a viral post).

**Example:** Jump from 100 to 5,000 users in a few seconds, then drop back, and verify the system copes and stabilizes.

---

### Endurance Testing

Apply a normal load for a **long** period (hours or days). Also called **soak testing**.

**Goal:** Find problems that appear only over time — memory leaks, resource exhaustion, degraded response.

**Example:** Run normal load for 12 hours and check memory usage does not keep climbing.

---

### Scalability Testing

Gradually increase load and resources to see how well the system **scales**.

**Goal:** Confirm that adding resources (servers, CPU) actually increases capacity, and find the limit.

**Example:** Measure throughput with 1, then 2, then 4 servers — does capacity grow as expected?

> [!tip] Quick comparison
> | Type | Load pattern | Main question |
> |---|---|---|
> | Load | Normal, steady | Do we meet targets under normal use? |
> | Stress | Beyond limit | Where does it break, and how? |
> | Spike | Sudden surge | Can it survive a sharp jump? |
> | Endurance | Normal, long time | Is it stable over hours? |
> | Scalability | Growing | Does it scale with more resources? |

---

## Key Metrics

Performance is measured with numbers, not opinions. The main metrics:

| Metric | Meaning |
|---|---|
| **Response time** | How long one request takes to get a response |
| **Latency** | Delay before the response starts arriving |
| **Throughput** | Requests processed per second (RPS) |
| **Error rate** | Percentage of failed requests under load |
| **Concurrent users** | How many users act at the same time |
| **CPU / Memory usage** | Server resource consumption under load |

> [!caution] Use percentiles, not just averages
> An average response time hides problems. If the average is 200 ms but the **95th percentile** is 4 seconds, 5% of users have a bad experience. Report p90/p95/p99, not only the average.

---

## How to Do Performance Testing

1. **Define requirements.** Get clear targets: e.g. "p95 response time under 2s with 1,000 concurrent users". Without targets you cannot pass or fail.
2. **Identify scenarios.** Pick the most important and most-used flows (login, search, checkout).
3. **Prepare the environment.** Use an environment close to production. Results from a weak test environment are misleading.
4. **Prepare test data.** Enough realistic data so the system behaves like production (e.g. a full product catalog).
5. **Create the test scripts.** Model user actions and the number of virtual users.
6. **Run the test.** Start with a baseline (low load), then increase as planned.
7. **Analyze results.** Compare metrics against the targets. Find bottlenecks (slow queries, low memory, etc.).
8. **Report and retest.** Share findings, let the team fix bottlenecks, then run again to confirm improvement.

> [!warning] Environment matters
> Performance results are only valid for the environment they ran in. Numbers from a laptop do not predict production. State the environment with every result.

---

## Performance Test Tools

| Tool | Notes |
|---|---|
| **Apache JMeter** | Free, open source, very popular. GUI + scripting, supports many protocols |
| **k6** | Modern, scripts in JavaScript, developer-friendly, great for CI |
| **Gatling** | High performance, scripts in Scala, good reports |
| **Locust** | Open source, scripts in Python, easy to scale |
| **LoadRunner** | Powerful commercial tool, enterprise use |
| **Postman** | Mainly an API tool, but can run a basic performance run |

> [!tip] Where to start
> For beginners, **JMeter** (no coding required) or **k6** (simple JavaScript) are the easiest entry points. Both are free.

---

## Performance Tests Using Postman

Postman is primarily an API client (→ see [[09 API Testing Basics]]), but it includes a basic **performance run** feature, useful for a quick check before reaching for a full tool like JMeter.

**How it works:**
- Open a saved **Collection** in Postman
- Choose **Run collection → Performance**
- Set the number of **virtual users** and the **test duration**
- Postman simulates concurrent users sending the requests and shows live metrics

**What Postman shows:**
- Average response time
- Throughput (requests per second)
- Error rate during the run
- A graph of response time over the run

**Strengths and limits:**
- **Good for:** a quick performance smoke check on existing API collections, no extra setup
- **Not for:** large-scale load (thousands of users), complex scenarios, or detailed reporting — use JMeter, k6, or Gatling for serious load testing

> [!info] Reuse your API collection
> If you already built an API collection for functional testing, you can reuse it for a quick performance run — no new scripts needed. This makes Postman a convenient first step.

---

## Interview Questions

### Top 10

**1. What is performance testing?**
Performance testing checks how a system behaves under a given workload — how fast it responds, how much load it handles, and how stable it stays over time. It is non-functional: it asks "how well does it work?", not "does it work?".

**2. What is the difference between functional and performance testing?**
Functional testing checks correctness — the right result. Performance testing checks behavior under load — speed and stability. A feature can be 100% correct and still fail performance if it responds too slowly.

**3. What is the difference between load and stress testing?**
Load testing applies an expected, normal level of load to confirm the system meets its targets. Stress testing pushes the system beyond its capacity until it breaks, to find the breaking point and see how it fails and recovers.

**4. What is spike testing?**
Applying a sudden, sharp increase in load for a short time — for example jumping from 100 to 5,000 users in seconds — to check how the system handles a fast surge like a flash sale.

**5. What is endurance (soak) testing?**
Applying a normal load over a long period (hours or days) to find problems that appear only over time, such as memory leaks or gradual performance degradation.

**6. What are the key performance metrics?**
Response time, latency, throughput (requests per second), error rate, concurrent users, and CPU/memory usage. These quantify how fast and stable the system is under load.

**7. Why use percentiles instead of averages?**
An average hides outliers. If the average is 200 ms but the 95th percentile is 4 seconds, 5% of users have a bad experience. Percentiles (p90/p95/p99) reveal the slow tail that averages mask.

**8. What is throughput?**
Throughput is the number of requests the system processes per unit of time, usually requests per second (RPS). It measures the system's capacity to handle work.

**9. Name some performance testing tools.**
Apache JMeter (free, very popular), k6 (JavaScript, CI-friendly), Gatling (Scala), Locust (Python), and LoadRunner (commercial). Postman can do a basic performance run for quick checks.

**10. What are the main steps of a performance test?**
Define requirements/targets, identify key scenarios, prepare a production-like environment and realistic data, create the scripts, run from a baseline upward, analyze results against targets to find bottlenecks, then report and retest.

---

### Tricky Questions

**1. The performance test passed on your laptop. Can you trust the numbers for production?**
No. Performance results are valid only for the environment they ran in. A laptop does not reflect production hardware, network, or data volume. You must run in a production-like environment and state the environment with every result.

**2. Average response time is 200 ms and the team says performance is fine. What might they be missing?**
The average hides the tail. The p95 or p99 could be several seconds, meaning a meaningful share of users have a poor experience. Always check percentiles and the error rate, not just the average.

**3. Is a performance test useful if you have no defined targets?**
Not really. Without targets (e.g. "p95 under 2s at 1,000 users") you cannot say whether the result is a pass or a fail — you only have numbers with no meaning. Requirements must be defined first.

**4. Can you run a serious load test with thousands of users in Postman?**
No. Postman's performance run is fine for a quick smoke check on an existing collection, but it is not built for large-scale load, complex scenarios, or detailed reporting. Use JMeter, k6, or Gatling for serious load testing.

**5. Response time is good but the error rate rises sharply as load increases. What does that tell you?**
The system is hitting a capacity limit — it may be running out of resources (connections, memory, threads) and rejecting requests rather than slowing down. A low response time alone is misleading if many requests are failing; you must read it together with the error rate.
