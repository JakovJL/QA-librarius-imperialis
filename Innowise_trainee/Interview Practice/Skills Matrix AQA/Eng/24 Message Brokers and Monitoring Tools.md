# Message Brokers and Monitoring Tools

## Table of Contents

- [[#Questions and Answers]]
	- [[#What Is a Message Broker and Why Is It Used?]]
	- [[#Which Message Brokers and Messaging Patterns Should You Know?]]
	- [[#What Are Kafka Topics, Partitions, Offsets, and Consumer Groups?]]
	- [[#Which Components Make Up a Modern Kafka Cluster?]]
	- [[#How Does RabbitMQ Route and Deliver Messages?]]
	- [[#How Do Kafka and RabbitMQ Differ?]]
	- [[#What Are Delivery Guarantees, Ordering, Retries, and Dead-Letter Handling?]]
	- [[#What Is a Kafka Schema and What Does a Schema Registry Do?]]
	- [[#How Do You Test Producing and Consuming a Message?]]
	- [[#What Do Kibana, Splunk, Logcat, and Sentry Help You Investigate?]]
	- [[#What Do Zabbix, Datadog, and Grafana Monitor?]]
	- [[#How Do Logs, Metrics, Traces, and Network Monitoring Differ?]]
	- [[#How Do You Diagnose an Asynchronous Messaging Failure?]]
	- [[#Which Broker and Monitoring Checks Belong in CI?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Questions and Answers

### What Is a Message Broker and Why Is It Used?

**Answer:**

A message broker transfers messages between applications. A producer sends a message without waiting for the consumer to process it. This decouples services, supports asynchronous work, and helps a system handle temporary consumer failures or traffic peaks.

For example, an order service can publish `OrderCreated`; an email service and an analytics service can process it independently.

### Which Message Brokers and Messaging Patterns Should You Know?

**Answer:**

Kafka, RabbitMQ, and ActiveMQ are common message brokers. A queue usually distributes work to one consumer. Publish/subscribe sends one event to multiple independent consumers. Request/reply uses a message and a response message, but it is still asynchronous infrastructure.

Choose a pattern by the business need, not by the tool name. Test the message contract and the observable business result.

### What Are Kafka Topics, Partitions, Offsets, and Consumer Groups?

**Answer:**

A Kafka topic is a named stream of records. It is split into partitions so Kafka can store and process records in parallel. An offset is the position of a record inside one partition.

A consumer group shares a topic's partitions between its consumers. Within one group, one partition is assigned to at most one active consumer. Different groups can read the same topic independently. Kafka preserves record order only inside one partition, not across the whole topic.

### Which Components Make Up a Modern Kafka Cluster?

**Answer:**

A Kafka cluster has brokers, which store topic partitions and serve clients. In modern Kafka, a KRaft controller quorum manages cluster metadata and controller work. Producers write records; consumers read records; replicas provide fault tolerance. Kafka Connect and Kafka Streams are optional tools in the Kafka ecosystem, not required cluster components.

ZooKeeper is a legacy Kafka architecture and is not part of a current KRaft-based Kafka deployment.

### How Does RabbitMQ Route and Deliver Messages?

**Answer:**

In RabbitMQ, a producer publishes a message to an exchange. Bindings define how the exchange routes the message to one or more queues. Consumers receive messages from queues and normally acknowledge successful processing. If processing fails, the application can retry, reject, requeue, or route a message to a dead-letter exchange and queue.

### How Do Kafka and RabbitMQ Differ?

**Answer:**

Kafka is a durable, partitioned event log. It is useful for high-throughput event streams and replay: consumers keep their offsets and can read retained records again. RabbitMQ is strong for work queues and flexible routing through exchanges, bindings, and queues. Its normal flow removes a successfully acknowledged message from the queue.

Both can support asynchronous communication. The right choice depends on retention, replay, routing, ordering, throughput, and operational requirements.

### What Are Delivery Guarantees, Ordering, Retries, and Dead-Letter Handling?

**Answer:**

At-most-once delivery can lose a message but avoids duplicates. At-least-once delivery retries after an uncertain failure, so a consumer can receive a duplicate. Consumers should therefore make important operations idempotent: processing the same event twice must not create two payments or two orders.

Ordering needs a clear scope. Kafka orders records inside a partition, usually by choosing a stable key such as an order ID. A retry policy needs a limit, a delay, and a place for poison messages. A dead-letter queue keeps messages that cannot be processed after the allowed retries so that a team can inspect and repair them.

### What Is a Kafka Schema and What Does a Schema Registry Do?

**Answer:**

A message schema defines the payload structure: fields, their types, required values, and allowed changes. JSON Schema, Avro, and Protobuf are common schema formats. A producer and a consumer must agree on this contract.

Apache Kafka stores record keys and values as bytes; it does not include a Schema Registry as a core component. A Schema Registry is a separate service or managed feature that stores schemas, assigns versions, and checks compatibility rules. It helps a new producer or consumer remain compatible with existing messages.

### How Do You Test Producing and Consuming a Message?

**Answer:**

Use an approved test client and a test topic or queue. Create a unique correlation ID, publish a known valid payload, then poll or subscribe with a bounded timeout. Assert the key, headers, payload, schema version, and the expected business side effect through an API, database, or UI.

Also test invalid payloads, authorization failures, duplicate delivery, retry and dead-letter flow, and consumer lag. Do not consume arbitrary production messages or another test's message. Clean up temporary data when the environment allows it.

### What Do Kibana, Splunk, Logcat, and Sentry Help You Investigate?

**Answer:**

Kibana and Splunk search and analyse collected logs. Android Logcat shows device and application logs during mobile testing. Sentry collects application errors and can show crash details, stack traces, releases, and traces. Use a correlation ID to find all log events for one asynchronous test flow.

These tools help explain what happened; they do not replace assertions in an automated test.

### What Do Zabbix, Datadog, and Grafana Monitor?

**Answer:**

Zabbix and Datadog collect or receive infrastructure and application metrics, check availability, and trigger alerts. Grafana builds dashboards and alerts from configured data sources such as Prometheus, Loki, Elasticsearch, or cloud monitoring systems. Grafana is mainly a visualisation and alerting layer, not a universal data collector by itself.

For a broker, watch consumer lag, queue depth, publish and consume rate, error rate, unavailable nodes, disk usage, CPU, memory, and network latency.

### How Do Logs, Metrics, Traces, and Network Monitoring Differ?

**Answer:**

Logs are detailed event records. Metrics are numeric values over time, such as queue depth or error rate. A trace follows one request or event across services. Network monitoring checks connectivity, availability, latency, packet loss, traffic, and protocol errors.

Use metrics and alerts to see that a problem exists, then use traces and logs to find the path and cause. A network problem is not proved only by an application log line.

### How Do You Diagnose an Asynchronous Messaging Failure?

**Answer:**

Start with the correlation ID and time window. Check whether the producer received an acknowledgement, the message reached the expected topic or queue, and the consumer group or queue has an active consumer. Then check consumer lag or queue depth, retries, dead-letter messages, consumer logs, schema compatibility, permissions, and the final business side effect.

Do not conclude that a test failed only because the result is not immediate: asynchronous systems need a realistic timeout and polling interval.

### Which Broker and Monitoring Checks Belong in CI?

**Answer:**

Run fast contract and integration checks in CI: publish and consume a test message, validate the schema, verify headers and correlation IDs, and cover one retry or dead-letter scenario when the test environment supports it. Keep these tests isolated and deterministic.

For monitoring, verify that a failed test produces useful logs and an actionable alert in a dedicated test environment when feasible. Do not make CI depend on a production dashboard or sensitive production data.

---

## Theory Links

- [[09 API Testing Basics]]
