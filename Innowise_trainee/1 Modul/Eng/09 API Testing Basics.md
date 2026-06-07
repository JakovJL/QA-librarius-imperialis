# 09 API Testing Basics

## Table of Contents

- [[#What Is an API]]
- [[#API Types]]
- [[#HTTP Methods]]
- [[#Status Codes]]
- [[#Request Structure]]
- [[#Authorization Types]]
- [[#Postman Basics]]
- [[#What to Test in API]]
- [[#OSI Model]]
- [[#TCP/IP]]
- [[#DNS]]
- [[#Serialization and Deserialization]]
- [[#GraphQL]]
- [[#Interview Questions]]

**Related notes:** [[QA manual eng]]

---

## What Is an API

**API** (Application Programming Interface) is a set of rules that allows two applications to communicate with each other.

**Client** — the one who sends the request (browser, mobile app, Postman).
**Server** — the one who processes the request and returns a response.

**Example:** When you press "Pay" in a mobile app, the app sends a request to the bank's API. The bank processes it and sends back a response.

> [!danger] Key Concept
> API is a contract between client and server: the client sends a ==request== — the server returns a ==response==.

---

## API Types

### REST

**Definition** — **REST** (Representational State Transfer) is an architectural style for building APIs over HTTP, where everything is a resource accessed by a URL.

- **Format:** JSON (sometimes XML)
- **Protocol:** HTTP / HTTPS

**Key principles (architectural constraints):**
- **Stateless** — every request contains all the information needed; the server stores no session state between requests. *Testing:* each request must be self-sufficient — do not rely on a previous one.
- **Uniform Interface** — all resources follow the same rules: standard HTTP methods, standard status codes, consistent URL structure. *Testing:* predictable behavior.
- **Resource-Based** — everything is a resource identified by a URL; actions come from HTTP methods, not URL names.
- Other constraints (less critical for QA): **Client-Server**, **Cacheable**, **Layered System**.

> [!caution] Common Mistake
> ❌ `POST /createUser` — action in the URL
> ✅ `POST /users` — resource in the URL, action from the method

**Advantages:**
- Simple and lightweight — easy to learn and use
- Language-independent — works with any tech stack
- Cacheable — responses can be cached to improve speed
- Huge tool and community support (Postman, browsers)

**Disadvantages:**
- Over-fetching / under-fetching — you often get more or less data than you need
- May need several requests to load related data
- No strict contract — the response structure can change without warning

**Example:** `GET /users/42` → `{ "id": 42, "name": "John" }`

**When to use:** web and mobile applications, public APIs.

---

### SOAP

**Definition** — **SOAP** (Simple Object Access Protocol) is a strict protocol for exchanging structured data in XML, based on a formal contract (WSDL).

- **Format:** XML only
- **Protocol:** HTTP, SMTP, and others

**Advantages:**
- Strict contract (WSDL) — both sides know the exact format
- Built-in error handling and standards
- High security (WS-Security) — fits banking and government
- Reliable for transactions (retries, ACID)

**Disadvantages:**
- Verbose — XML messages are large and heavy
- Slow compared to REST and gRPC
- Complex — hard to write and test manually

**Example:** a request is wrapped in a SOAP envelope:
```xml
<soap:Envelope>
  <soap:Body>
    <getUser><id>42</id></getUser>
  </soap:Body>
</soap:Envelope>
```

**When to use:** enterprise systems, banking, government services, legacy integrations.

---

### gRPC

**Definition** — **gRPC** (Google Remote Procedure Call) is a modern framework for fast service-to-service communication using binary data over HTTP/2.

- **Format:** Protocol Buffers (binary)
- **Protocol:** HTTP/2

**Advantages:**
- Very fast — small binary messages
- Strongly typed — the contract is defined in a `.proto` file
- Supports streaming (client, server, or both directions)
- Automatic code generation for many languages

**Disadvantages:**
- Not human-readable — binary format is hard to debug by eye
- Limited browser support — mainly for backend services
- Harder to test manually — needs special tools and `.proto` files

**Example `.proto` file:**
```protobuf
syntax = "proto3";

message UserRequest {
  int32 id = 1;
}

message UserResponse {
  string name = 1;
  int32 age = 2;
}

service UserService {
  rpc GetUser(UserRequest) returns (UserResponse);
}
```

**When to use:** microservices, internal high-performance service-to-service communication.

#### RPC Types (4 kinds)

**Unary** — client sends 1 request, server replies 1 time.
```
Client: ----[request]--->
Server: <---[response]---
```
*Example:* `rpc GetUser(UserRequest) returns (UserResponse)` — get a user.

**Server Streaming** — client sends 1 request, server replies with a stream.
```
Client: ----[request]--->
Server: <---[chunk1]----
         <---[chunk2]----
         <---[chunk3]----
```
*Example:* `rpc SubscribeNews(NewsRequest) returns (stream NewsResponse)` — news feed.

**Client Streaming** — client sends a stream of requests, server replies once.
```
Client: ----[chunk1]---->
         ----[chunk2]---->
         ----[chunk3]---->
Server: <---[response]---
```
*Example:* `rpc UploadLogs(stream LogEntry) returns (UploadStatus)` — upload logs in parts.

**Bidirectional Streaming** — both sides send streams in any order.
```
Client: ----[msg1]------>
         <---[reply1]----
         ----[msg2]------>
         ----[msg3]------>
         <---[reply2]----
```
*Example:* `rpc Chat(stream ChatMessage) returns (stream ChatReply)` — chat.

#### gRPC Error Codes (important for testers)

| Code | Number | Description | HTTP Equivalent |
|---|---|---|---|
| OK | 0 | Success | 200 |
| CANCELLED | 1 | Cancelled by client (timeout) | — |
| INVALID_ARGUMENT | 3 | Invalid arguments | 400 |
| DEADLINE_EXCEEDED | 4 | Timeout — server took too long | 504 |
| NOT_FOUND | 5 | Resource not found | 404 |
| PERMISSION_DENIED | 7 | No permission | 403 |
| UNIMPLEMENTED | 12 | Method not implemented on server | 501 |
| INTERNAL | 13 | Internal server error | 500 |
| UNAVAILABLE | 14 | Service unavailable | 503 |

#### Tools for Testing gRPC

| Tool | Description |
|---|---|
| **grpcurl** | curl for gRPC — call methods from terminal |
| **grpcui** | Web UI based on grpcurl (like Postman) |
| **Postman** | Supports gRPC since 2022 (import .proto) |
| **BloomRPC** | Desktop GUI client |
| **Evans** | Interactive REPL from terminal |

#### What to Test in gRPC

- **Unary:** standard checks — valid/invalid data, auth, boundary values
- **Streaming:** does the stream close correctly? what happens on disconnect? message order?
- **Contract:** response matches `.proto` schema
- **Timeouts/deadlines:** what happens if the server does not respond in time?
- **Error codes:** correct code for each scenario (INVALID_ARGUMENT, NOT_FOUND, etc.)
- **Load:** how does the server handle many concurrent streams?

**Negative scenario example:** after updating microservice B, client A started getting `UNIMPLEMENTED`. Reason: B removed or renamed an RPC method, but A still uses the old `.proto` file. Prevention: version `.proto` contracts and check compatibility in CI.

---

> [!tip] REST vs SOAP vs gRPC
> | | REST | SOAP | gRPC |
> |---|---|---|---|
> | Format | JSON | XML | Binary (Protobuf) |
> | Speed | Medium | Slow | Fast |
> | Complexity | Low | High | Medium |
> | Contract | Optional (OpenAPI) | Strict (WSDL) | Strict (.proto) |
> | Streaming | No | No | 4 types |
> | Use case | Web / mobile APIs | Enterprise systems | Microservices |

---

## HTTP Methods

HTTP methods define what action the client wants to perform on a resource.

### GET

**Goal:** retrieve data from the server. Does not change anything.

**Example:** `GET /users/42` — get user with id 42.

### POST

**Goal:** create a new resource on the server.

**Example:** `POST /users` — create a new user. Body contains user data.

### PUT

**Goal:** fully replace an existing resource.

**Example:** `PUT /users/42` — replace all data of user 42.

### PATCH

**Goal:** partially update an existing resource.

**Example:** `PATCH /users/42` — update only the email of user 42.

### DELETE

**Goal:** delete a resource.

**Example:** `DELETE /users/42` — delete user with id 42.

### Other Methods

- **HEAD** — like GET, but returns only headers, without a body. Used to check if a resource exists or get its size/date without downloading it.
- **OPTIONS** — returns which methods are allowed for a resource. Used by the browser in CORS preflight.
- **TRACE** — echoes the request back for debugging. Often disabled for security.
- **CONNECT** — creates a tunnel (e.g. HTTPS through a proxy).

> [!tip] Methods at a Glance
> | Method | Action | Safe | Idempotent | Has Body |
> |---|---|---|---|---|
> | GET | Read | ✅ | ✅ | No |
> | POST | Create | ❌ | ❌ | Yes |
> | PUT | Full update | ❌ | ✅ | Yes |
> | PATCH | Partial update | ❌ | ❌* | Yes |
> | DELETE | Delete | ❌ | ✅ | No |
> | HEAD | Read headers only | ✅ | ✅ | No |
> | OPTIONS | List allowed methods | ✅ | ✅ | No |
> | TRACE | Echo request (debug) | ✅ | ✅ | No |
> | CONNECT | Create a tunnel | ❌ | ❌ | No |
>
> \*PATCH may be idempotent depending on the implementation.
> **Safe** = does not change data. **Idempotent** = repeating the request gives the same result.

---

## Status Codes

HTTP status codes tell the client what happened with the request.

### 2xx — Success

| Code | Name | Meaning |
|---|---|---|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 202 | Accepted | Request accepted, still being processed |
| 204 | No Content | Success, no body in response |

### 3xx — Redirection

| Code | Name | Meaning |
|---|---|---|
| 301 | Moved Permanently | Resource moved to a new URL forever |
| 302 | Found | Temporary redirect |
| 304 | Not Modified | Cached version is still valid (used with ETag) |
| 307 | Temporary Redirect | Temporary redirect, method must stay the same |
| 308 | Permanent Redirect | Permanent redirect, method must stay the same |

### 4xx — Client Errors

| Code | Name | Meaning |
|---|---|---|
| 400 | Bad Request | Invalid request format or data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Authenticated but no permission |
| 404 | Not Found | Resource does not exist |
| 405 | Method Not Allowed | Method not supported for this resource |
| 408 | Request Timeout | Client took too long to send the request |
| 409 | Conflict | Conflict with the current state (e.g. duplicate) |
| 415 | Unsupported Media Type | Body format not supported (wrong Content-Type) |
| 422 | Unprocessable Entity | Valid format but invalid data |
| 429 | Too Many Requests | Rate limit exceeded |

### 5xx — Server Errors

| Code | Name | Meaning |
|---|---|---|
| 500 | Internal Server Error | Something broke on the server |
| 501 | Not Implemented | Method not supported by the server |
| 502 | Bad Gateway | Server got invalid response from upstream |
| 503 | Service Unavailable | Server is down or overloaded |
| 504 | Gateway Timeout | Upstream server did not respond in time |

> [!caution] 401 vs 403
> **401** — "Who are you?" — not logged in or invalid token.
> **403** — "I know who you are, but you cannot access this."

---

## Request Structure

Every HTTP request consists of the following parts:

### URL

The address of the resource.

`https://api.example.com/users/42?format=json`

- `https://api.example.com` — base URL
- `/users/42` — endpoint + ==path parameter== (resource id)
- `?format=json` — ==query parameter==

### Headers

Key-value pairs with metadata about the request.

**Common headers:**
- `Content-Type: application/json` — body format
- `Authorization: Bearer <token>` — authentication
- `Accept: application/json` — expected response format

### Body

Data sent with the request. Used in POST, PUT, PATCH.

```json
{
  "name": "John",
  "email": "john@example.com"
}
```

GET and DELETE requests typically have no body.

---

## Authorization Types

Authorization verifies that the client has permission to access a resource.

### Basic Auth

Login and password encoded in Base64, sent in the `Authorization` header.

```
Authorization: Basic dXNlcjpwYXNz
```

**Disadvantages:** password is visible if the connection is not encrypted. Use only with HTTPS.

---

### API Key

A unique key that identifies the client. Sent as a header or query parameter.

```
Authorization: ApiKey abc123xyz
```

**When to use:** simple integrations, public APIs with access control.

---

### Bearer Token (JWT)

A token issued after login. Sent in every request header.

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**When to use:** most modern REST APIs. Token contains user info and expiration time.

---

### OAuth 2.0

A protocol that allows a third-party app to access resources on behalf of a user without sharing the password.

**Example:** "Login with Google" — you give the app permission to read your profile, not your password.

---

> [!tip] Authorization Types Comparison
> | Type | Security | Complexity | Common Use |
> |---|---|---|---|
> | Basic Auth | Low | Low | Legacy systems |
> | API Key | Medium | Low | Public APIs |
> | Bearer Token | High | Medium | Modern REST APIs |
> | OAuth 2.0 | High | High | Third-party access |

---

## Postman Basics

**Postman** is a tool for sending HTTP requests and testing APIs without writing code.

### Sending a Request

1. Choose HTTP method (GET, POST, etc.)
2. Enter the URL
3. Add headers if needed (e.g., `Authorization`)
4. Add body for POST / PUT / PATCH requests
5. Click **Send**
6. Check the response: status code, body, headers, response time

### Collections

A **Collection** is a group of saved requests organized by feature or endpoint.

**Use:** save all requests for a project in one collection. Share with the team.

### Environments

An **Environment** is a set of variables used across requests.

**Example:** variable `{{base_url}}` = `https://api.dev.example.com`. Switch to production by changing one value — all requests update automatically.

### Auth in Postman

Postman has built-in support for all auth types in the **Authorization** tab:
- Basic Auth — enter login and password
- Bearer Token — paste the token
- OAuth 2.0 — Postman handles the full flow

---

## What to Test in API

### Positive Tests

Verify that the API works correctly with valid data.

- Correct method + valid data → expected status code (200, 201)
- Response body matches the expected structure and data types
- Response time is within acceptable limits

### Negative Tests

Verify that the API handles errors correctly.

- Missing required field → 400 Bad Request
- Invalid data format → 400 or 422
- No auth token → 401 Unauthorized
- Valid token, wrong role → 403 Forbidden
- Non-existent resource → 404 Not Found

### Boundary Tests

Test edge values.

- Maximum allowed string length
- Minimum and maximum numeric values
- Empty string vs null

### Auth Tests

- Request without token → 401
- Request with expired token → 401
- Request with a token for a different role → 403

---

## OSI Model

**OSI** (Open Systems Interconnection) is a model that describes 7 layers of network communication. Each layer handles a specific part of data transmission.

```
7. Application   — HTTP, FTP, DNS, SMTP
6. Presentation  — encryption, serialization, encoding
5. Session      — session management, open/close connections
4. Transport    — TCP, UDP — data delivery
3. Network      — IP — packet routing
2. Data Link    — Ethernet — device-to-device transfer
1. Physical     — cables, signals, Wi-Fi
```

### For Testers — What Matters

| Layer | What to Check |
|---|---|
| **7. Application** | HTTP requests, status codes, response body, headers |
| **6. Presentation** | Encoding (UTF-8, Base64), encryption (HTTPS), JSON/XML parsing |
| **5. Session** | Session timeouts, keep-alive, reconnection |
| **4. Transport** | Is the TCP port open? Is the TCP handshake successful? |
| **3. Network** | Is the server reachable (ping)? Correct IP? |

> [!info] OSI vs TCP/IP
> OSI is a theoretical model (7 layers). The real internet runs on TCP/IP (4 layers). OSI is good for learning, TCP/IP is for real work.

---

## TCP/IP

**TCP/IP** is the protocol stack that powers the entire internet. 4 layers instead of 7 in OSI.

| Layer | Protocols | Purpose |
|---|---|---|
| **4. Application** | HTTP, HTTPS, DNS, FTP, SMTP, gRPC | Application data |
| **3. Transport** | **TCP**, UDP | Delivery between applications |
| **2. Internet** | **IP**, ICMP (ping) | Routing — how packets get there |
| **1. Network Access** | Ethernet, Wi-Fi | Hardware — cables, radio signals |

### TCP — Reliable Delivery

TCP guarantees data arrives in the correct order without loss.

**3-Way Handshake — how a connection opens:**
```
Client:  SYN — "Hello, are you there?"
Server:  SYN-ACK — "Yes, I'm here"
Client:  ACK — "OK, let's go"
         === Connection open ===
         HTTP GET /users →
         ← HTTP 200 {data}
         === Connection closes ===
Client:  FIN — "Goodbye"
Server:  ACK — "Bye"
```

### UDP — Fast but Unreliable

UDP does not check delivery — sends and forgets. Used in DNS, streaming, gaming, VoIP. Not relevant for API testing.

### Ports

**IP address** = building, **port** = door.

| Port | Protocol | Service |
|---|---|---|
| 80 | HTTP | Web server |
| 443 | HTTPS | Web server with encryption |
| 22 | SSH | Remote access |
| 53 | DNS | Domain names |
| 3306 | MySQL | Database |
| 5432 | PostgreSQL | Database |
| 8080 | HTTP | Alternate / dev |

### For Testers

- **Port not open** → connection refused. Check which port you are calling
- **Timeout** → server does not respond at the TCP level (check ping / firewall)
- **Keep-alive** — HTTP/1.1 keeps the TCP connection open for multiple requests (faster)
- **Latency** — each TCP handshake adds delay. gRPC (HTTP/2) reduces this with multiplexing

```bash
# Check if a port is open
curl -v https://api.example.com:443

# Check server availability (ICMP)
ping api.example.com
```

---

## DNS

**DNS** (Domain Name System) is the "phone book" of the internet. It translates domain names (`api.example.com`) into IP addresses (`192.168.1.10`), where the server actually lives.

### How DNS Works (simplified)

```
1. Browser:   "What is the IP of api.example.com?"
2. ↓
3. DNS resolver (usually your ISP's)
4. ↓
5. .com → who is responsible for .com (root DNS)
6. example.com → who is responsible for example.com
7. api.example.com → A record: 192.168.1.10
8. ↑
9. Browser: "Hello 192.168.1.10, give me /users"
```

**In practice** DNS is cached at every level, so repeated lookups are faster.

### DNS Record Types

| Type | Stores | Example |
|---|---|---|
| **A** | IPv4 address | `example.com → 93.184.216.34` |
| **AAAA** | IPv6 address | `example.com → 2606:2800:220::1` |
| **CNAME** | Alias (nickname) | `www.example.com → example.com` |
| **MX** | Mail server | `@ → mail.example.com` |
| **TXT** | Text data | SPF, DKIM for email verification |

### For Testers

- **DNS does not resolve** → `curl: Could not resolve host`. Check the domain or use `--resolve` temporarily
- **DNS delay** — the first request to an API can be slower due to a DNS lookup. Account for this in performance tests
- **DNS caching** — if the server's IP changed, the old one may be cached and tests fail. Flush DNS cache: `ipconfig /flushdns` (Windows), `sudo systemd-resolve --flush-caches` (Linux)
- **TXT records** — used for domain verification
- **Check DNS manually:**

```bash
nslookup api.example.com
dig api.example.com
```

---

## Serialization and Deserialization

**Serialization** — converting an in-memory object into a format for network transmission.
**Deserialization** — the reverse: converting the received format back into an object.

### How It Works

```java
// In memory — a Java object
User user = new User("John", 30);

// Serialization (object → JSON for REST)
String json = "{\"name\":\"John\",\"age\":30}";
// → send in HTTP request

// On the server — deserialization (JSON → object)
User user = objectMapper.readValue(json, User.class);
// → now you can: user.getName(), user.getAge()
```

### Serialization in Different Protocols

| Protocol | Format | Size | Readable | Speed |
|---|---|---|---|---|
| **REST (JSON)** | Text | Medium | ✅ Yes | Medium |
| **SOAP (XML)** | Text | Large | ✅ Yes (hard) | Slow |
| **gRPC (Protobuf)** | Binary | Small | ❌ No | Fast |

**JSON** — `{"name":"John","age":30}` — readable but larger
**XML** — `<name>John</name><age>30</age>` — even larger due to tags
**Protobuf** — `\x0a\x04John\x10\x1e` — not readable, but very compact

### For Testers

1. **Structure check** — after deserialization, fields must match the expected schema
2. **Boundary values** — how is null serialized? empty string? special characters?
3. **.proto versions** — if client and server use different `.proto` versions, deserialization breaks
4. **Encoding** — Cyrillic, `"`, `<`, `>` in JSON/XML — are they escaped correctly?
5. **Performance** — serialization/deserialization of large XML (SOAP) takes noticeable time

---

## GraphQL

**GraphQL** is a query language for APIs, created by Facebook (Meta). Instead of the REST approach (different endpoints for different data), GraphQL gives **one endpoint** and lets the client decide which data to get.

### REST vs GraphQL

```
REST:
  GET /users → {id, name, email, age, address, phone, ...}
  → Always get the full object, even if you only need id and name

GraphQL:
  POST /graphql — query:
  { users { id name } }

  Response — only what you asked for:
  { "data": { "users": [{ "id": 1, "name": "John" }] } }
```

### Key Concepts

| Term | Description | REST Equivalent |
|---|---|---|
| **Query** | Read data (GET) | `GET /users` |
| **Mutation** | Modify data (create, update, delete) | `POST /users`, `PUT /users/1` |
| **Subscription** | Real-time updates via WebSocket | Server-Sent Events |
| **Schema** | Description of all available types and queries | OpenAPI / Swagger |
| **Resolver** | Function that fetches data for a field | Controller / Service |

### Advantages

- Client decides which fields to get — **no over-fetching**
- Get related data in one request — **no under-fetching**
- Strong typing — everything is described in the Schema

### Disadvantages

- Backend complexity — need to write resolvers for every field
- Caching — REST caches URLs, GraphQL has one URL for everything
- Expensive queries — client can request 10 levels of nesting (N+1 problem)
- Harder to test — need to understand the schema and GraphQL syntax

### Example Query and Response

```graphql
# Query
query {
  user(id: 42) {
    name
    email
    posts {
      title
      comments {
        text
      }
    }
  }
}
```

```json
// Response
{
  "data": {
    "user": {
      "name": "John",
      "email": "john@example.com",
      "posts": [
        {
          "title": "Hello World",
          "comments": [
            { "text": "Nice post!" }
          ]
        }
      ]
    }
  }
}
```

Mutation (changing data):
```graphql
mutation {
  createUser(name: "John", email: "john@test.com") {
    id
    name
  }
}
```

### Tools for Testing GraphQL

| Tool | Description |
|---|---|
| **GraphQL Playground / GraphiQL** | Built-in IDE for queries (usually ships with the server) |
| **Postman** | Supports GraphQL (switch type to GraphQL) |
| **Altair GraphQL Client** | Specialized client |
| **Apollo Studio** | Platform from GraphQL creators |

### What to Test in GraphQL

- **Query:** requested only needed fields → only those returned
- **Mutation:** created/updated/deleted → verify the result
- **Unauthorized query:** request without token → error
- **Deeply nested query:** what if the client requests 10 levels of nesting? Does the server handle it?
- **Nullable vs Required:** required field missing → correct schema error
- **Subscription:** WebSocket opened, data arrives in real time

---

## Interview Questions

### Fundamentals

**1. What is API Testing?**
API testing is a type of software testing that checks the API directly — its functionality, reliability, and security — at the business-logic layer, without a graphical interface. The tester sends requests to API endpoints and validates the responses: status code, body, headers, and response time.

**2. Why is API Testing Important?**
- APIs are the core of modern apps — web, mobile, and other services all rely on them.
- Bugs are found earlier and cheaper — API tests can run before the UI is ready (shift-left).
- Faster and more stable than UI tests — no browser, less flakiness.
- Better coverage — business logic, edge cases, and security can be tested directly.
- One API serves many clients — a single defect can break web, mobile, and partners at once.

**3. What is API Test Automation and How Does It Work?**
API test automation means running API tests automatically with scripts or tools instead of sending each request by hand. How it works:
1. Write test scripts that send requests to endpoints (e.g. Postman/Newman, REST Assured, Karate, or Python + requests/pytest).
2. Each test sends a request (method, headers, body), then asserts the response (status code, body fields, schema, response time).
3. Tests are grouped into a suite and run automatically — locally or in a CI/CD pipeline (e.g. Jenkins, GitHub Actions) on every build.
4. A report shows which tests passed or failed.

Benefits: fast regression, repeatable results, no manual effort, and early detection of breakages.

**4. What Are the Types of API Testing?**
- **Functional** — does the API return correct results for given inputs?
- **Validation** — does it meet requirements, with correct behavior and data?
- **Load / Performance** — how does it behave under many requests?
- **Security** — authentication, authorization, encryption, injection attacks.
- **Reliability** — stable connection and consistent responses.
- **Negative / Error** — correct handling of invalid input and error codes.
- **Integration** — several APIs working together correctly.

**5. What Exactly Do We Check During API Testing?**
For each request we validate the response and its behavior:
- **Status code** — the correct code for the scenario (200, 201, 400, 401, 404, 500…).
- **Response body** — correct data, structure, and data types; matches the expected JSON schema.
- **Headers** — `Content-Type`, caching, and security headers are correct.
- **Response time** — the request responds within acceptable limits.
- **Error handling** — invalid input returns the right error code and a clear message.
- **Data correctness** — values match the database / business logic (e.g. a created resource really exists).
- **Authentication & authorization** — only allowed users can access the resource (401 / 403).
- **Boundary & negative cases** — empty, too long, null, or wrong-type inputs are handled correctly.
- **Idempotency & side effects** — repeated calls behave as expected and cause no unwanted data changes.

---

### Top Questions

**1. What is an API?**
An API is a set of rules that allows two applications to communicate. The client sends a request — the server returns a response.

**2. What is the difference between REST, SOAP, and gRPC?**
REST uses JSON over HTTP — simple, lightweight, and widely used for web/mobile, but it can over-fetch or under-fetch data. SOAP uses XML with a strict contract (WSDL) and strong security — slower and heavier, used in banking and enterprise. gRPC uses a binary format (Protocol Buffers) over HTTP/2 — very fast and strongly typed, used for microservices, but it is not human-readable.

**3. What HTTP methods do you know? What does each do?**
GET — read, POST — create, PUT — full update, PATCH — partial update, DELETE — delete.

**4. What do status codes 200, 201, 400, 401, 403, 404, 500 mean?**
200 — OK, 201 — Created, 400 — Bad Request, 401 — Unauthorized, 403 — Forbidden, 404 — Not Found, 500 — Internal Server Error.

**5. What is the difference between 401 and 403?**
401 — the user is not authenticated (no token or invalid token). 403 — the user is authenticated but does not have permission.

**6. What does a REST request consist of?**
URL (base URL + endpoint + path/query params), HTTP method, headers, and body (for POST / PUT / PATCH).

**7. What authorization types do you know?**
Basic Auth, API Key, Bearer Token (JWT), OAuth 2.0.

**8. What is the difference between Bearer Token and API Key?**
Bearer Token is issued after login and contains user info with an expiration time. API Key is a static key that identifies the client application.

**9. What do you test in API testing?**
Positive cases (valid data → correct response), negative cases (invalid data, missing fields → correct error codes), boundary values, and auth checks.

**10. What is Postman used for?**
Postman is a tool for sending HTTP requests and checking API responses without writing code. Used for exploratory testing, saving request collections, and managing environments.

**11. What is the difference between authentication and authorization?**
Authentication answers "who are you?" — it verifies identity (login, token). Authorization answers "what are you allowed to do?" — it checks permissions. Status 401 relates to authentication, 403 to authorization.

**12. What is an endpoint?**
An endpoint is a specific URL where an API resource or action is available. In `GET /users/42`, the endpoint is `/users/42`. Each endpoint usually maps to one resource and accepts certain HTTP methods.

**13. What is the difference between path parameters and query parameters?**
Path parameters are part of the URL path and point to a specific resource: `/users/42` (42 is a path param). Query parameters come after `?` and are used for filtering, sorting, or pagination: `/users?role=admin&page=2`.

**14. What is the difference between PUT and POST?**
POST creates a new resource and is not idempotent — calling it twice creates two resources. PUT creates or fully replaces a resource at a known URL and is idempotent — calling it twice gives the same result.

**15. What tools are used for API testing?**
Postman and Insomnia (manual/exploratory), Newman (run Postman collections in CI), REST Assured and Karate (Java), Python + requests/pytest, SoapUI (SOAP), and Swagger/OpenAPI for documentation and contract checks.

**16. What is HTTP, and why is it stateless?**
HTTP (HyperText Transfer Protocol) is the protocol for sending requests and responses between client and server. It is stateless — the server does not remember anything between requests, so each request must carry all the information it needs (e.g. a token).

**17. What is the difference between HTTP and HTTPS?**
HTTP sends data in plain text. HTTPS is HTTP over TLS/SSL — the data is encrypted, so it cannot be read or changed in transit, and the server's identity is verified with a certificate. HTTP uses port 80, HTTPS uses port 443.

**18. What is TLS/SSL?**
TLS (Transport Layer Security; SSL is its older name) is the encryption layer that turns HTTP into HTTPS. It encrypts the connection and uses certificates to prove the server is genuine.

**19. What ports do HTTP and HTTPS use?**
HTTP uses port 80 by default; HTTPS uses port 443.

**20. What is the difference between HTTP/1.1, HTTP/2, and HTTP/3?**
- **HTTP/1.1** — text-based, mostly one request at a time per connection (head-of-line blocking).
- **HTTP/2** — binary, multiplexing (many requests over one connection), header compression — faster.
- **HTTP/3** — runs over QUIC (UDP) instead of TCP, which removes connection-level blocking and connects faster.

**21. What is the difference between TCP and UDP?**
TCP is reliable and ordered — it guarantees delivery (used by HTTP/1.1 and HTTP/2). UDP is faster but does not guarantee delivery or order. HTTP/3 uses QUIC, built on UDP, to get speed plus its own reliability.

**22. What is a persistent connection (keep-alive)?**
Keep-alive lets several requests and responses reuse one TCP connection instead of opening a new one each time, which reduces delay. It is the default in HTTP/1.1.

**23. What is HTTP caching?**
Caching stores responses so they can be reused without asking the server again. It is controlled by headers like `Cache-Control` (how long to cache) and `ETag` (a version tag — the server can answer 304 Not Modified if nothing changed).

**24. How is state kept over a stateless HTTP?**
Since HTTP forgets between requests, state is kept with cookies, server sessions, or tokens (JWT). The client sends them on each request so the server knows who you are.

**25. What are HTTP headers? Name common ones.**
Headers are key-value pairs with metadata about the request or response. Common ones: `Content-Type`, `Authorization`, `Accept`, `User-Agent`, `Cache-Control`, `Set-Cookie`.

**26. What is CORS?**
CORS (Cross-Origin Resource Sharing) is a browser rule that controls whether a web page from one origin (domain) may call an API on another origin. The server allows it with headers like `Access-Control-Allow-Origin`.

**27. What is HSTS?**
HSTS (HTTP Strict Transport Security) is a header that tells the browser to always use HTTPS for a site and never plain HTTP — protecting against downgrade attacks.

**28. What is the difference between URL, URI, and URN?**
URI is the general identifier of a resource. URL is a URI that also says where it is and how to reach it (e.g. `https://site.com/users/42`). URN names a resource without its location (e.g. `urn:isbn:0451450523`). Every URL is a URI.

**29. What is content negotiation?**
Content negotiation lets the client ask for a specific response format with the `Accept` header (e.g. `Accept: application/json`). The server returns the best matching format.

**30. What is Protocol Buffers (protobuf)?**
Protocol Buffers is a compact binary data format created by Google and used by gRPC. The data structure is defined in a `.proto` file; messages are smaller and faster to parse than JSON, but they are not human-readable.

---

**31. What is WSDL and why does a tester need it?**
WSDL (Web Services Description Language) is an XML document that describes the contract of a SOAP service: available methods (operations), parameters for each method, response format, transport protocol, and the service URL.

**Why testers need WSDL:**
- **Documentation** — all info about the service in one file
- **Request generation** — SoapUI can import WSDL and auto-generate ready requests with the correct structure
- **Contract validation** — if WSDL changes (method added/removed, parameter changed), tests must be updated — this is a signal for regression
- **Hidden methods** — WSDL may contain operations not documented elsewhere but still callable
- **Response validation** — the WSDL schema can be used to verify that the response matches the expected structure

**Example WSDL structure:**
```xml
<wsdl:definitions>
  <wsdl:types>      <!-- data types -->
  <wsdl:message>    <!-- request/response messages -->
  <wsdl:portType>   <!-- operations (methods) -->
  <wsdl:binding>    <!-- protocol and format -->
  <wsdl:service>    <!-- service URL -->
</wsdl:definitions>
```

---

**32. What should you check in a SOAP response?**
When testing a SOAP response, verify the following:

1. **SOAP Envelope** — the response is wrapped in `<soap:Envelope>` with a correct namespace (`xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"`)
2. **SOAP Body** — contains `<soap:Body>` with the response data
3. **SOAP Fault** — if an error occurred, check `<soap:Fault>`:
   - `faultcode` — error code (e.g. `SOAP-ENV:Server`, `SOAP-ENV:Client`)
   - `faultstring` — human-readable error description
   - `detail` — error details (optional)
4. **Response data** — structure and data types match the WSDL schema
5. **HTTP status**: 200 OK — success, 500 Internal Server Error — SOAP Fault
6. **Content-Type** — should be `text/xml` or `application/soap+xml`
7. **Namespaces** — all XML namespaces are correct

```xml
<!-- Successful response example -->
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <getUserResponse>
      <name>John</name>
      <age>30</age>
    </getUserResponse>
  </soap:Body>
</soap:Envelope>

<!-- Error response (SOAP Fault) example -->
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <soap:Fault>
      <faultcode>soap:Server</faultcode>
      <faultstring>User not found</faultstring>
    </soap:Fault>
  </soap:Body>
</soap:Envelope>
```

---

### Tricky Questions

**1. Can GET have a request body?**
Technically yes, but it is not recommended by REST conventions. GET is designed only for reading data. Most servers ignore the body of a GET request.

**2. What is the difference between PUT and PATCH?**
PUT replaces the full resource — if you omit a field, it gets deleted or reset. PATCH updates only the specified fields.

**3. Is REST a protocol?**
No. REST is an architectural style — a set of constraints. HTTP is the protocol.

**4. Does status code 200 always mean the test passed?**
No. The server can return 200 with an error message in the body. Always check both the status code and the response body.

**5. Why is gRPC faster than REST?**
gRPC sends data in a compact binary format (Protocol Buffers) instead of text JSON, and uses HTTP/2, which lets several requests share one connection (multiplexing). Smaller messages plus a faster protocol give higher speed.

**6. Which HTTP methods are idempotent?**
Idempotent means that calling the request many times gives the same result as calling it once. GET, PUT, and DELETE are idempotent. POST is not — each call usually creates a new resource. PATCH may or may not be, depending on the implementation.

**7. Is it safe to pass a token or password in query parameters?**
No. Query parameters are part of the URL, which is often logged by servers and proxies, saved in browser history, and may be cached. Sensitive data should go in headers (e.g. `Authorization`) or the request body, always over HTTPS.

**8. What happens if you send DELETE for a resource that does not exist?**
It depends on the API. Many return 404 Not Found. Some return 204 No Content to keep DELETE idempotent — the end state (resource gone) is the same either way. Always check the API documentation for the expected behavior.

**9. Can a POST request be idempotent?**
By default no — calling POST twice usually creates two resources. But it can be made idempotent with an "idempotency key": the client sends a unique key, and the server ignores duplicate requests with the same key. This is common in payment APIs.
