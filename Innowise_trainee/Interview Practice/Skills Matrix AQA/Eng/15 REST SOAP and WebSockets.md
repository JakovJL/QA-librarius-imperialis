# REST SOAP and WebSockets

## Table of Contents

- [[#Questions and Answers]]
	- [[#What Is It and What Should You Know?]]
	- [[#What Practical Skills Should an Automation QA Demonstrate?]]
	- [[#Which Mistakes and Risks Matter?]]
- [[#Intern and Junior Requirements]]
- [[#Middle and Senior Requirements]]
	- [[#What Is the Difference Between REST, SOAP, and WebSocket?]]
	- [[#How Do HTTP Methods and Idempotency Work?]]
	- [[#What Does an HTTP Request and Response Contain?]]
	- [[#How Do JSON and XML Differ?]]
	- [[#Which Tools Help You Test an API?]]
	- [[#What Are Serialization and Common Java HTTP Libraries?]]
	- [[#How Do You Test a WebSocket?]]
	- [[#How Do You Test API Security, CORS, and Error Responses?]]
	- [[#What Advanced API Topics Should You Know?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Questions and Answers

### What Is It and What Should You Know?

**Short answer:**

REST commonly uses HTTP resources and JSON; SOAP is an XML protocol with formal contracts; WebSocket provides persistent full-duplex events.

### What Practical Skills Should an Automation QA Demonstrate?

**Short answer:**

Test methods, idempotency, status, headers, schema, serialization, authorization, errors, events, timeouts, contracts, and side effects using Postman, curl, REST Assured, or clients.

### Which Mistakes and Risks Matter?

**Short answer:**

Cover version compatibility, retries, rate limits, CORS, OAuth, OWASP risks, API mocks, and multi-environment CI.

---

## Intern and Junior Requirements

- REST is an architectural style commonly used over HTTP; SOAP is a message protocol with XML envelopes and often a WSDL contract; WebSocket is a long-lived full-duplex connection. REST commonly uses JSON, while SOAP commonly uses XML.
- `GET` reads, `POST` creates or submits an action, `PUT` replaces a representation, `PATCH` changes part of it, and `DELETE` removes it. GET, PUT, and DELETE are intended to be idempotent; repeating the same POST can create another result.
- Check request method, URL, headers, body, response status, headers, and body. JSON is lightweight and object-oriented; XML uses nested tags and schemas. `204 No Content` is successful and has no response body.
- Postman sends saved requests in collections; `curl` sends requests from a terminal; Swagger/OpenAPI describes endpoints and schemas; browser DevTools shows browser network requests.

---

## Middle and Senior Requirements

- Serialization converts an object to JSON or XML; deserialization creates an object from it. Java examples are Jackson, Gson, Java `HttpClient`, REST Assured, and Retrofit. Validate JSON Schema and handle empty bodies and non-success responses deliberately.
- A WebSocket client connects, subscribes or sends a message, waits with a timeout, filters the event it needs, and verifies payload and side effects. Test reconnects, duplicate events, ordering assumptions, and authorization.
- Test Bearer, Basic, and OAuth-based access without placing secrets in source or reports. CORS is a browser rule that controls cross-origin browser requests; it is not an API authentication mechanism.
- Senior API work also covers version compatibility, OpenAPI or Pact contracts, GraphQL query/mutation/schema checks, SOAP WS-Security, OWASP API risks, rate limits, retries, mocks or virtual services, CI execution, and separate environments.

---

## Detailed Question and Answer

### What Is the Difference Between REST, SOAP, and WebSocket?

**Answer:**

REST is an architectural style that commonly uses HTTP resources, methods, status codes, and JSON. SOAP is a protocol with XML envelopes, strict message rules, and often a WSDL contract. WebSocket creates one persistent, full-duplex connection for events in both directions. I choose the test approach from the protocol and contract, not from the name of the tool.

### How Do HTTP Methods and Idempotency Work?

**Answer:**

`GET` reads data, `POST` creates a resource or submits an action, `PUT` replaces a resource, `PATCH` changes part of it, and `DELETE` removes it. Repeating an idempotent request has the same intended effect as sending it once. GET, PUT, and DELETE are intended to be idempotent; POST usually is not. `PUT` normally represents replacement, while `POST` commonly creates a child resource or starts an action.

### What Does an HTTP Request and Response Contain?

**Answer:**

A request contains method, URL, path/query parameters, headers, and an optional body. A response contains status code, headers, and an optional body. I verify both status and business data. For example, `200` means success with a response, `201` usually means created, `204` means success without body, `400` means invalid client input, `401` means authentication is needed, `403` means access is denied, and `404` means the resource was not found.

### How Do JSON and XML Differ?

**Answer:**

JSON represents objects and arrays with key-value syntax and is common in REST APIs. XML uses nested tagged elements, attributes, and namespaces; SOAP uses XML. Both can be validated against schemas. I check correct types, required fields, boundary values, encoding, and whether the API handles unknown or missing fields as specified.

### Which Tools Help You Test an API?

**Answer:**

Postman sends requests manually and stores them in collections. `curl` sends requests from the command line and is useful for reproducible diagnostics. Swagger/OpenAPI describes endpoints, parameters, authentication, and schemas. Browser DevTools shows requests sent by a web application, but it does not replace API assertions in automated tests.

### What Are Serialization and Common Java HTTP Libraries?

**Answer:**

Serialization converts an object to JSON or XML; deserialization converts the response back to an object. In Java, Jackson and Gson work with JSON. Java `HttpClient`, REST Assured, and Retrofit send HTTP requests; the choice depends on whether the test needs a low-level client, fluent API testing, or an application client.

### How Do You Test a WebSocket?

**Answer:**

I connect a client, authenticate if needed, send or subscribe to a message, wait with a timeout, and assert the expected event and payload. I also test disconnect and reconnect behaviour, message filtering, duplicates, ordering assumptions, invalid messages, and side effects in the system. A WebSocket test must not wait forever for an event.

### How Do You Test API Security, CORS, and Error Responses?

**Answer:**

I test Basic Auth, Bearer tokens, and OAuth flows through approved test credentials. I verify forbidden roles, missing or expired tokens, invalid input, rate limits, and empty successful responses such as `204`. CORS is a browser rule that controls cross-origin browser requests; it is not authentication. Secrets and tokens must not appear in source code, logs, or reports.

### What Advanced API Topics Should You Know?

**Answer:**

Contract testing checks that consumer and provider agree, for example through OpenAPI or Pact. Versioning needs compatibility rules so old clients do not break unexpectedly. GraphQL uses queries to read and mutations to change data; schema validation is part of its contract. Senior work also includes SOAP WS-Security, OWASP API risks, retries with safe idempotency, mocks or virtual services, multi-environment CI, and passing context between requests without sharing unsafe test state.

---

## Theory Links

- [[09 API Testing Basics]]
