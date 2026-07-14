# REST SOAP и WebSockets

## Содержание

- [[#Вопросы и ответы]]
	- [[#Что это такое и что нужно знать?]]
	- [[#Какие практические навыки нужны Automation QA?]]
	- [[#Какие ошибки и риски важны?]]
- [[#Требования Intern и Junior]]
- [[#Требования Middle и Senior]]
	- [[#В чём разница между REST, SOAP и WebSocket?]]
	- [[#Как работают HTTP methods и idempotency?]]
	- [[#Что содержат HTTP request и response?]]
	- [[#Чем отличаются JSON и XML?]]
	- [[#Какие tools помогают тестировать API?]]
	- [[#Что такое serialization и common Java HTTP libraries?]]
	- [[#Как тестировать WebSocket?]]
	- [[#Как тестировать API security, CORS и error responses?]]
	- [[#Какие advanced API topics нужно знать?]]
- [[#Ссылки на теорию]]

**Связанные заметки:** [[00 Индекс Skills Matrix AQA]]

---

## Вопросы и ответы

### Что это такое и что нужно знать?

**Короткий ответ:**

REST обычно использует HTTP resources и JSON; SOAP — XML protocol с formal contracts; WebSocket предоставляет persistent full-duplex events.

### Какие практические навыки нужны Automation QA?

**Короткий ответ:**

Проверять methods, idempotency, status, headers, schema, serialization, authorization, errors, events, timeouts, contracts и side effects через Postman, curl, REST Assured или clients.

### Какие ошибки и риски важны?

**Короткий ответ:**

Покрывать version compatibility, retries, rate limits, CORS, OAuth, OWASP risks, API mocks и multi-environment CI.

---

## Требования Intern и Junior

- REST — architectural style, обычно используемый поверх HTTP; SOAP — message protocol с XML envelopes и часто WSDL contract; WebSocket — long-lived full-duplex connection. REST обычно использует JSON, а SOAP — XML.
- `GET` читает, `POST` создаёт или отправляет action, `PUT` заменяет representation, `PATCH` меняет его часть, а `DELETE` удаляет. GET, PUT и DELETE должны быть idempotent; повтор одного POST может создать ещё один result.
- Проверяются request method, URL, headers, body, response status, headers и body. JSON лёгкий и object-oriented; XML использует nested tags и schemas. `204 No Content` успешен и не содержит response body.
- Postman отправляет saved requests в collections, `curl` — requests из terminal, Swagger/OpenAPI описывает endpoints и schemas, а browser DevTools показывает browser network requests.

---

## Требования Middle и Senior

- Serialization преобразует object в JSON или XML, а deserialization создаёт object из них. Примеры Java: Jackson, Gson, Java `HttpClient`, REST Assured и Retrofit. Нужно валидировать JSON Schema и намеренно обрабатывать empty body и non-success responses.
- WebSocket client подключается, subscribes или отправляет message, ждёт с timeout, фильтрует нужный event и проверяет payload и side effects. Проверяются reconnects, duplicate events, ordering assumptions и authorization.
- Bearer, Basic и OAuth-based access тестируются без secrets в source или reports. CORS — browser rule для cross-origin browser requests, а не API authentication mechanism.
- Senior API work включает version compatibility, OpenAPI или Pact contracts, GraphQL query/mutation/schema checks, SOAP WS-Security, OWASP API risks, rate limits, retries, mocks или virtual services, CI execution и отдельные environments.

---

## Подробные вопросы и ответы

### В чём разница между REST, SOAP и WebSocket?

**Ответ:**

REST — architectural style, обычно использующий HTTP resources, methods, status codes и JSON. SOAP — protocol с XML envelopes, строгими message rules и часто WSDL contract. WebSocket создаёт persistent full-duplex connection для events в обоих направлениях. Test approach выбирается по protocol и contract, а не по названию tool.

### Как работают HTTP methods и idempotency?

**Ответ:**

`GET` читает data, `POST` создаёт resource или отправляет action, `PUT` заменяет resource, `PATCH` меняет его часть, а `DELETE` удаляет. Повтор idempotent request имеет тот же intended effect, что и один request. GET, PUT и DELETE должны быть idempotent, а POST обычно нет. `PUT` обычно заменяет representation, а `POST` создаёт child resource или начинает action.

### Что содержат HTTP request и response?

**Ответ:**

Request содержит method, URL, path/query parameters, headers и optional body. Response содержит status code, headers и optional body. Проверяются и status, и business data. Например, `200` — success с response, `201` — обычно created, `204` — success без body, `400` — invalid client input, `401` — нужна authentication, `403` — access denied, `404` — resource not found.

### Чем отличаются JSON и XML?

**Ответ:**

JSON представляет objects и arrays через key-value syntax и часто используется REST API. XML использует nested tagged elements, attributes и namespaces; SOAP использует XML. Оба формата можно проверять schemas. Проверяются correct types, required fields, boundary values, encoding и обработка unknown или missing fields по specification.

### Какие tools помогают тестировать API?

**Ответ:**

Postman отправляет requests вручную и хранит их в collections. `curl` отправляет requests из command line и удобен для reproducible diagnostics. Swagger/OpenAPI описывает endpoints, parameters, authentication и schemas. Browser DevTools показывает requests web application, но не заменяет API assertions automated tests.

### Что такое serialization и common Java HTTP libraries?

**Ответ:**

Serialization преобразует object в JSON или XML, а deserialization преобразует response обратно в object. В Java Jackson и Gson работают с JSON. Java `HttpClient`, REST Assured и Retrofit отправляют HTTP requests; выбор зависит от low-level client, fluent API testing или application client.

### Как тестировать WebSocket?

**Ответ:**

Нужно подключить client, при необходимости выполнить authentication, отправить или subscribe на message, ждать с timeout и проверить expected event и payload. Также проверяются disconnect и reconnect behaviour, message filtering, duplicates, ordering assumptions, invalid messages и side effects system. WebSocket test не должен бесконечно ждать event.

### Как тестировать API security, CORS и error responses?

**Ответ:**

Basic Auth, Bearer tokens и OAuth flows тестируются через approved test credentials. Проверяются forbidden roles, missing или expired tokens, invalid input, rate limits и empty successful responses, например `204`. CORS — browser rule cross-origin browser requests, а не authentication. Secrets и tokens нельзя помещать в source code, logs или reports.

### Какие advanced API topics нужно знать?

**Ответ:**

Contract testing проверяет agreement consumer и provider, например через OpenAPI или Pact. Versioning требует compatibility rules, чтобы old clients не ломались неожиданно. GraphQL использует queries для чтения и mutations для изменения data, а schema validation — часть contract. Senior work также включает SOAP WS-Security, OWASP API risks, retries с безопасной idempotency, mocks или virtual services, multi-environment CI и передачу context между requests без shared unsafe test state.

---

## Ссылки на теорию

- [[09 Основы тестирования API]]
