# 11 Web Technologies

## Table of Contents

- [[#Network Models]]
	- [[#OSI Model]]
	- [[#TCP/IP Model]]
- [[#Protocols]]
	- [[#HTTP vs HTTPS]]
	- [[#TLS and SSL]]
	- [[#WebSocket]]
	- [[#Email and File Transfer Protocols]]
- [[#Addressing]]
	- [[#DNS]]
	- [[#URI, URL, and URN]]
- [[#Client-Side Technologies]]
	- [[#HTML]]
	- [[#CSS]]
	- [[#DOM]]
	- [[#JavaScript]]
	- [[#Ajax]]
- [[#Browser and DevTools]]
- [[#Storage]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]

**Related notes:** [[QA manual eng]]

---

## Network Models

### OSI Model

The OSI (Open Systems Interconnection) model is a conceptual framework that describes how data travels across a network. It has 7 layers, each with a specific responsibility.

| Layer | Name | Responsibility | Examples |
|---|---|---|---|
| 7 | Application | User-facing protocols | HTTP, FTP, SMTP |
| 6 | Presentation | Data format, encryption | TLS, JPEG, JSON |
| 5 | Session | Managing connections | NetBIOS, RPC |
| 4 | Transport | Reliable delivery | TCP, UDP |
| 3 | Network | Routing between networks | IP, ICMP |
| 2 | Data Link | Local delivery, MAC addressing | Ethernet, Wi-Fi |
| 1 | Physical | Raw bit transmission | Cables, radio waves |

> [!warning] How to remember the layers
> **Top-down:** All People Seem To Need Data Processing (Application → Physical)
> **Bottom-up:** Please Do Not Throw Sausage Pizza Away (Physical → Application)

Data flows **down** the layers when sending (adding headers at each step) and **up** when receiving (stripping headers).

---

### TCP/IP Model

The TCP/IP model is the practical model used on the internet. It combines some OSI layers into 4.

| TCP/IP Layer | Equivalent OSI Layers | Key Protocols |
|---|---|---|
| Application | 5, 6, 7 | HTTP, FTP, SMTP, DNS |
| Transport | 4 | TCP, UDP |
| Internet | 3 | IP, ICMP |
| Network Access | 1, 2 | Ethernet, Wi-Fi |

> [!info] OSI vs TCP/IP
> OSI is used for **teaching** — it describes the ideal model. TCP/IP is used in **practice** — it describes how the internet actually works. QA engineers need OSI for conceptual discussions and TCP/IP for diagnosing real network issues.

---

## Protocols

### HTTP vs HTTPS

**HTTP** (HyperText Transfer Protocol) — the foundation of data exchange on the web. It is a request-response protocol: the client sends a request, the server sends a response.

**HTTPS** = HTTP + TLS encryption. The data is encrypted in transit.

| | HTTP | HTTPS |
|---|---|---|
| Port | 80 | 443 |
| Encrypted | No | Yes (TLS) |
| Certificate | Not required | Required (SSL/TLS cert) |
| Use | Internal tools, local dev | Any public-facing site |

**HTTP request structure:**
- Method (GET, POST, PUT, DELETE, PATCH)
- URL
- Headers (Content-Type, Authorization, etc.)
- Body (for POST/PUT)

**HTTP response structure:**
- Status code (200 OK, 404 Not Found, 500 Internal Server Error)
- Headers
- Body (HTML, JSON, etc.)

**Common status code groups:**

| Range | Meaning | Examples |
|---|---|---|
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirection | 301 Moved Permanently, 302 Found |
| 4xx | Client error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found |
| 5xx | Server error | 500 Internal Server Error, 503 Service Unavailable |

---

### TLS and SSL

**SSL** (Secure Sockets Layer) — an older encryption protocol, now deprecated and insecure.
**TLS** (Transport Layer Security) — the modern replacement for SSL. TLS 1.2 and 1.3 are current standards.

Despite SSL being deprecated, the term "SSL certificate" is still widely used to mean TLS certificates.

**What TLS provides:**
- **Encryption** — data cannot be read in transit
- **Authentication** — the server proves its identity via a certificate
- **Integrity** — data cannot be altered without detection

**TLS Handshake (simplified):**
1. Client says hello and lists supported encryption methods
2. Server responds with its certificate and chosen method
3. Client verifies the certificate (issued by a trusted CA)
4. Both sides derive a shared session key
5. Encrypted communication begins

---

### WebSocket

WebSocket is a protocol that establishes a **persistent, bi-directional connection** between client and server over a single TCP connection.

| | HTTP | WebSocket |
|---|---|---|
| Connection | New request per exchange | One connection, stays open |
| Direction | Client → Server (request-response) | Both directions simultaneously |
| Overhead | High (headers per request) | Low (small frames) |
| Use cases | Regular web pages | Chat, live scores, real-time dashboards |

WebSocket connections start as HTTP and then "upgrade" via the `Upgrade: websocket` header.

---

### Email and File Transfer Protocols

**SMTP** (Simple Mail Transfer Protocol) — used to **send** email. Port 25 (server-to-server) or 587 (client-to-server, encrypted).

**POP3** (Post Office Protocol v3) — used to **download** email from a server to a local client. Downloads and typically deletes from server. Port 110 (plain) / 995 (TLS).

**IMAP** (Internet Message Access Protocol) — used to **access** email stored on a server. Email stays on the server, synced across devices. Port 143 / 993 (TLS). The modern standard.

**FTP** (File Transfer Protocol) — used to transfer files between a client and a server. Port 21. Not encrypted. FTPS/SFTP are secure alternatives.

**XMPP** (Extensible Messaging and Presence Protocol) — an open standard for instant messaging, used in some chat applications (WhatsApp historically, Jabber).

---

## Addressing

### DNS

**DNS** (Domain Name System) translates human-readable domain names into IP addresses.

**Example:** `google.com` → `142.250.74.46`

**DNS resolution flow:**
1. Browser checks its local cache
2. OS checks its cache (hosts file)
3. Query goes to the Recursive Resolver (usually your ISP or a public resolver like 8.8.8.8)
4. Resolver queries Root Nameserver → TLD Nameserver (for `.com`) → Authoritative Nameserver
5. Authoritative Nameserver returns the IP address
6. Browser connects to the IP

**Common DNS record types:**

| Record | Purpose | Example |
|---|---|---|
| A | Maps domain to IPv4 address | `example.com → 93.184.216.34` |
| AAAA | Maps domain to IPv6 address | |
| CNAME | Alias — points to another domain | `www.example.com → example.com` |
| MX | Mail server for the domain | |
| TXT | Text info (SPF, DKIM, verification) | |

---

### URI, URL, and URN

**URI** (Uniform Resource Identifier) — the general concept. Identifies a resource. Both URL and URN are types of URI.

**URL** (Uniform Resource Locator) — a URI that tells you **where** a resource is and **how** to access it.

**URN** (Uniform Resource Name) — a URI that gives a resource a **permanent name**, independent of location.

> [!tip] URI vs URL vs URN
> | | URI | URL | URN |
> |---|---|---|---|
> | **What it is** | General identifier | Location + access method | Persistent name |
> | **Example** | Both below | `https://example.com/page` | `urn:isbn:978-3-16-148410-0` |
> | **Changes if resource moves?** | Depends | Yes | No |

**URL structure:**

```
https://user:pass@example.com:443/path/to/page?key=value&k2=v2#section
│       │         │           │   │             │               │
scheme  credentials host       port path         query           fragment
```

- **Scheme:** protocol (`https`, `http`, `ftp`)
- **Host:** domain name or IP
- **Port:** optional, default is 80 (HTTP) or 443 (HTTPS)
- **Path:** resource location on the server
- **Query string:** key-value pairs after `?`, separated by `&`
- **Fragment:** anchor within the page, processed by the browser only

---

## Client-Side Technologies

### HTML

**HTML** (HyperText Markup Language) defines the **structure** and content of a web page using elements (tags).

```html
<html>
  <head><title>Page Title</title></head>
  <body>
    <h1>Heading</h1>
    <p>Paragraph with <a href="/other">a link</a>.</p>
    <input type="text" id="name" placeholder="Enter name" />
  </body>
</html>
```

**QA relevance:** HTML attributes (`id`, `name`, `data-*`) are used as locators in automated tests and in manual test steps.

---

### CSS

**CSS** (Cascading Style Sheets) controls the **visual presentation** — layout, colors, fonts, spacing.

Styles can be applied via:
- External stylesheet (`<link rel="stylesheet" href="style.css">`)
- `<style>` block in HTML
- Inline `style` attribute

**QA relevance:** Visual bugs (wrong colors, broken layout, overlapping elements) are CSS issues. DevTools lets you inspect and edit CSS live.

---

### DOM

The **DOM** (Document Object Model) is the browser's in-memory tree representation of an HTML page. JavaScript reads and modifies the DOM to update the page without reloading.

```
document
└── html
    ├── head
    │   └── title
    └── body
        ├── h1
        └── p
            └── a
```

**QA relevance:**
- Automated tests (Selenium, Playwright) interact with DOM elements
- DevTools Elements tab shows the live DOM, not the raw HTML source
- DOM manipulation by JS can change elements after page load — what you see in DevTools may differ from the source

---

### JavaScript

**JavaScript (JS)** adds **interactive behavior** to web pages — form validation, dynamic content, API calls, animations.

JS runs in the browser (client-side) and on the server (Node.js).

**QA relevance:**
- JS errors appear in the DevTools Console tab — always check it during manual testing
- Dynamic content loaded by JS may not be visible in raw page source
- Race conditions and async behavior are common sources of intermittent bugs

---

### Ajax

**Ajax** (Asynchronous JavaScript and XML) is a technique for sending HTTP requests from the browser **without reloading the entire page**. The name is historical — modern Ajax uses JSON, not XML.

**How it works:** JS sends a request to the server in the background, receives the response, and updates only the relevant part of the page.

**QA relevance:**
- Ajax requests are visible in the DevTools Network tab (look for XHR/Fetch requests)
- A page that looks loaded may still have pending Ajax calls — test for loading states and partial failures
- Response data (JSON) can be inspected in Network → Response

---

## Browser and DevTools

**How a browser renders a page:**
1. DNS resolution → get IP address
2. TCP + TLS handshake → establish secure connection
3. HTTP GET request → receive HTML
4. Parse HTML → build DOM
5. Parse CSS → build CSSOM
6. Combine DOM + CSSOM → Render Tree
7. Layout → calculate positions
8. Paint → draw pixels

**DevTools tabs relevant to QA:**

| Tab | What to use it for |
|---|---|
| **Elements** | Inspect and edit DOM and CSS live. Find element locators for test automation. |
| **Console** | See JS errors, warnings, and logs. Run JS expressions. |
| **Network** | Inspect every HTTP request and response — URL, method, status, headers, body, timing. |
| **Application** | View and edit cookies, localStorage, sessionStorage. Clear cache. |
| **Sources** | View loaded JS files. Set breakpoints for debugging. |
| **Performance** | Record and analyze page rendering and scripting performance. |

> [!tip] Network tab workflow for API testing
> Open DevTools → Network tab → reload the page or trigger an action → click the request in the list → check: Status code, Request headers, Request payload, Response body.

---

## Storage

### Cache

A **cache** stores copies of resources (HTML, CSS, JS, images) locally so they do not need to be downloaded again on the next visit.

**Types:**
- **Browser cache** — stored on the user's disk
- **CDN cache** — stored on edge servers close to users
- **Server-side cache** — stored on the server (Redis, Memcached)

**Cache-Control headers** control how long a resource is cached:
- `Cache-Control: no-cache` — always revalidate with server
- `Cache-Control: max-age=3600` — cache for 1 hour
- `Cache-Control: no-store` — never store

**QA relevance:** Cached content can cause you to test an old version of a page. Use Ctrl+Shift+R (hard reload) or clear cache in DevTools to force a fresh load.

---

### Cookie

A **cookie** is a small piece of data the server sends to the browser, which the browser stores and sends back with every subsequent request to the same domain.

**Common uses:**
- Session ID (keeps the user logged in)
- User preferences (language, theme)
- Tracking and analytics

**Cookie attributes:**

| Attribute | Purpose |
|---|---|
| `Expires` / `Max-Age` | When the cookie expires. Session cookie if absent. |
| `HttpOnly` | Prevents JS from reading the cookie (security) |
| `Secure` | Only sent over HTTPS |
| `SameSite` | Controls cross-site sending (Strict / Lax / None) |
| `Domain` / `Path` | Which requests include the cookie |

> [!tip] Cache vs Cookie
> | | Cache | Cookie |
> |---|---|---|
> | **Stores** | Resources (HTML, images, CSS) | Small data values |
> | **Purpose** | Speed up page loads | Maintain state between requests |
> | **Sent to server?** | No | Yes, automatically |
> | **Controlled by** | Server headers | Server + client JS |
> | **View in DevTools** | Network tab (from disk/memory) | Application tab |

---

## Interview Questions

### Top 10

**1. What is the difference between the OSI model and the TCP/IP model?**
OSI is a 7-layer conceptual model used for teaching and describing how networks work in theory. TCP/IP is a practical 4-layer model that describes how the internet actually works. QA uses OSI for conceptual discussions and TCP/IP for diagnosing real network issues.

**2. What is the difference between HTTP and HTTPS?**
HTTP transfers data in plain text on port 80. HTTPS is HTTP plus TLS encryption on port 443, and it requires a certificate. HTTPS protects data in transit from being read or altered.

**3. What do the HTTP status code groups mean?**
2xx — success (200 OK, 201 Created), 3xx — redirection (301, 302), 4xx — client error (400, 401, 403, 404), 5xx — server error (500, 503). The first digit tells you the category at a glance.

**4. What does TLS provide?**
Encryption (data cannot be read in transit), authentication (the server proves its identity with a certificate), and integrity (data cannot be altered without detection).

**5. What is DNS and what does it do?**
DNS (Domain Name System) translates human-readable domain names into IP addresses. For example, it resolves `google.com` to an IP so the browser can connect to the server.

**6. What is the difference between a URI, a URL, and a URN?**
URI is the general identifier. URL is a URI that says where a resource is and how to access it (`https://example.com/page`). URN is a URI that gives a resource a permanent name regardless of location.

**7. What is the difference between cache and cookie?**
Cache stores copies of resources (HTML, CSS, images) to speed up page loads and is not sent to the server. A cookie stores small data values to maintain state and is sent to the server with every request automatically.

**8. What is the difference between GET and POST?**
GET requests data and passes parameters in the URL; it should not change server state. POST sends data in the request body to create or change something on the server. GET is cacheable and idempotent; POST is not.

**9. What is the DOM?**
The DOM (Document Object Model) is the browser's in-memory tree representation of the page. JavaScript reads and modifies the DOM to update the page without reloading. Automated tests interact with DOM elements.

**10. Which DevTools tab is most useful for QA, and why?**
The Network tab — it shows every HTTP request and response with URL, method, status code, headers, payload, and timing. It lets a QA verify API calls, find failed requests, and inspect response data during manual testing.

---

### Tricky Questions

**1. A page looks fully loaded but some data is missing. How do you investigate?**
The data is likely loaded by an Ajax request that failed or is still pending. Open DevTools → Network, filter XHR/Fetch, and check the request's status and response. The DOM may also differ from the page source because JS changed it after load.

**2. The site uses HTTPS, so the data is fully secure. True or false?**
False. HTTPS only encrypts data in transit. It does not protect against weak passwords, broken access control, XSS, or data leaked in responses. Transport security is one layer, not the whole picture.

**3. You changed the page but the browser still shows the old version. Why?**
The browser is serving a cached copy. Force a hard reload (Ctrl+Shift+R) or clear the cache in DevTools. Cache-Control headers decide how long resources are cached.

**4. What is the difference between an HttpOnly cookie and a normal one, and why does it matter for security?**
An HttpOnly cookie cannot be read by JavaScript, which protects it from being stolen via XSS. Session cookies are usually marked HttpOnly. A QA should verify sensitive cookies have HttpOnly and Secure set.

**5. Why might a WebSocket connection be used instead of regular HTTP requests?**
WebSocket keeps a single persistent, bi-directional connection open, so the server can push data to the client in real time with low overhead. It suits chats, live scores, and dashboards, where repeated HTTP requests would be slow and wasteful.
