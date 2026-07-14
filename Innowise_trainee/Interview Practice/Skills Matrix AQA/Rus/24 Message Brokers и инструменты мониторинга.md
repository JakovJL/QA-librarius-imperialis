# Message Brokers и инструменты мониторинга

## Содержание

- [[#Вопросы и ответы]]
	- [[#Что такое message broker и зачем он нужен?]]
	- [[#Какие message brokers и messaging patterns нужно знать?]]
	- [[#Что такое Kafka topics, partitions, offsets и consumer groups?]]
	- [[#Из каких components состоит современный Kafka cluster?]]
	- [[#Как RabbitMQ направляет и доставляет messages?]]
	- [[#Чем отличаются Kafka и RabbitMQ?]]
	- [[#Что такое delivery guarantees, ordering, retries и dead-letter handling?]]
	- [[#Что такое Kafka schema и зачем нужен Schema Registry?]]
	- [[#Как тестировать producing и consuming message?]]
	- [[#Что помогают исследовать Kibana, Splunk, Logcat и Sentry?]]
	- [[#Что мониторят Zabbix, Datadog и Grafana?]]
	- [[#Чем отличаются logs, metrics, traces и network monitoring?]]
	- [[#Как диагностировать asynchronous messaging failure?]]
	- [[#Какие broker и monitoring checks нужны в CI?]]
- [[#Ссылки на теорию]]

**Связанные заметки:** [[00 Индекс Skills Matrix AQA]]

---

## Вопросы и ответы

### Что такое message broker и зачем он нужен?

**Ответ:**

Message broker передаёт messages между приложениями. Producer отправляет message, не ожидая, пока consumer его обработает. Это ослабляет связь между services, поддерживает asynchronous work и помогает переживать временную недоступность consumer или всплеск нагрузки.

Например, order service может опубликовать `OrderCreated`; email service и analytics service обработают это событие независимо друг от друга.

### Какие message brokers и messaging patterns нужно знать?

**Ответ:**

Kafka, RabbitMQ и ActiveMQ — распространённые message brokers. Queue обычно распределяет work между consumers. Publish/subscribe отправляет одно event нескольким независимым consumers. В request/reply есть message и response message, но инфраструктура всё равно остаётся asynchronous.

Выбирать pattern нужно по бизнес-задаче, а не по названию инструмента. Тестировать следует message contract и наблюдаемый бизнес-результат.

### Что такое Kafka topics, partitions, offsets и consumer groups?

**Ответ:**

Kafka topic — именованный stream records. Он разделён на partitions, чтобы Kafka могла хранить и обрабатывать records параллельно. Offset — позиция record внутри одной partition.

Consumer group распределяет partitions topic между своими consumers. Внутри одной group одна partition назначается максимум одному active consumer. Разные groups могут читать один topic независимо. Kafka сохраняет порядок records только внутри одной partition, а не во всём topic.

### Из каких components состоит современный Kafka cluster?

**Ответ:**

Kafka cluster содержит brokers: они хранят topic partitions и обслуживают clients. В современном Kafka KRaft controller quorum управляет metadata cluster и controller work. Producers записывают records, consumers читают их, replicas обеспечивают fault tolerance. Kafka Connect и Kafka Streams — дополнительные tools экосистемы Kafka, а не обязательные components cluster.

ZooKeeper — legacy architecture Kafka; в современном KRaft-based deployment он не используется.

### Как RabbitMQ направляет и доставляет messages?

**Ответ:**

В RabbitMQ producer публикует message в exchange. Bindings определяют, как exchange направляет message в одну или несколько queues. Consumers получают messages из queues и обычно подтверждают успешную обработку acknowledgement. При ошибке application может повторить обработку, отклонить или вернуть message в queue либо направить его через dead-letter exchange в dead-letter queue.

### Чем отличаются Kafka и RabbitMQ?

**Ответ:**

Kafka — устойчивый partitioned event log. Он подходит для high-throughput event streams и replay: consumers хранят offsets и могут снова читать records, пока действует retention. RabbitMQ хорошо подходит для work queues и гибкой маршрутизации через exchanges, bindings и queues. При обычной обработке успешно acknowledged message удаляется из queue.

Оба инструмента поддерживают asynchronous communication. Выбор зависит от retention, replay, routing, ordering, throughput и operational requirements.

### Что такое delivery guarantees, ordering, retries и dead-letter handling?

**Ответ:**

At-most-once delivery может потерять message, но исключает duplicates. At-least-once delivery повторяет отправку после неопределённой ошибки, поэтому consumer может получить duplicate. Поэтому важные операции consumer должны быть idempotent: повторная обработка одного event не должна создать два payments или два orders.

Для ordering нужно явно определить scope. Kafka упорядочивает records внутри partition; обычно для этого выбирают стабильный key, например order ID. Retry policy нужны limit, delay и место для poison messages. Dead-letter queue сохраняет messages, которые не удалось обработать после допустимых retries, чтобы команда могла их исследовать и исправить.

### Что такое Kafka schema и зачем нужен Schema Registry?

**Ответ:**

Message schema задаёт структуру payload: fields, их types, обязательные values и допустимые изменения. Распространены JSON Schema, Avro и Protobuf. Producer и consumer должны соблюдать этот contract.

Apache Kafka хранит keys и values records как bytes; встроенного Schema Registry в ней нет. Schema Registry — отдельный service или managed feature: он хранит schemas, назначает versions и проверяет compatibility rules. Это помогает новому producer или consumer оставаться совместимым с существующими messages.

### Как тестировать producing и consuming message?

**Ответ:**

Использовать approved test client и test topic или queue. Создать уникальный correlation ID, опубликовать известный валидный payload, затем выполнить poll или subscribe с ограниченным timeout. Проверить key, headers, payload, schema version и ожидаемый business side effect через API, database или UI.

Также проверить invalid payloads, authorization failures, duplicate delivery, retry и dead-letter flow, а также consumer lag. Нельзя читать произвольные production messages или message другого test. Временно созданные test data нужно очищать, если это допускает environment.

### Что помогают исследовать Kibana, Splunk, Logcat и Sentry?

**Ответ:**

Kibana и Splunk ищут и анализируют собранные logs. Android Logcat показывает device и application logs при mobile testing. Sentry собирает application errors и может показать crash details, stack traces, releases и traces. Correlation ID помогает найти все log events одного asynchronous test flow.

Эти tools помогают объяснить произошедшее, но не заменяют assertions в automated test.

### Что мониторят Zabbix, Datadog и Grafana?

**Ответ:**

Zabbix и Datadog собирают или получают infrastructure и application metrics, проверяют availability и создают alerts. Grafana строит dashboards и alerts на основе настроенных data sources, например Prometheus, Loki, Elasticsearch или cloud monitoring systems. Grafana в основном visualisation и alerting layer, а не универсальный data collector.

Для broker нужно следить за consumer lag, queue depth, publish и consume rate, error rate, недоступными nodes, disk usage, CPU, memory и network latency.

### Чем отличаются logs, metrics, traces и network monitoring?

**Ответ:**

Logs — подробные records events. Metrics — числовые values во времени, например queue depth или error rate. Trace проводит один request или event через services. Network monitoring проверяет connectivity, availability, latency, packet loss, traffic и protocol errors.

Metrics и alerts показывают, что проблема существует; traces и logs помогают найти путь и причину. Network problem нельзя доказать одной строкой application log.

### Как диагностировать asynchronous messaging failure?

**Ответ:**

Начать с correlation ID и time window. Проверить, получил ли producer acknowledgement, дошло ли message до нужного topic или queue, есть ли active consumer у consumer group или queue. Затем проверить consumer lag или queue depth, retries, dead-letter messages, consumer logs, schema compatibility, permissions и итоговый business side effect.

Не следует считать test failed только потому, что результат не появился сразу: asynchronous systems требуют реалистичных timeout и polling interval.

### Какие broker и monitoring checks нужны в CI?

**Ответ:**

В CI запускать быстрые contract и integration checks: опубликовать и прочитать test message, проверить schema, headers и correlation IDs, а также один scenario с retry или dead-letter, если test environment это поддерживает. Такие tests должны быть изолированными и deterministic.

Для monitoring при возможности проверить, что failed test оставляет полезные logs и создаёт понятный alert в выделенном test environment. CI не должен зависеть от production dashboard или чувствительных production data.

---

## Ссылки на теорию

- [[09 Основы тестирования API]]
