# 15 Security Testing Basics

## Table of Contents

- [[#What Is Security Testing]]
- [[#Types of Vulnerabilities]]
	- [[#Injection]]
	- [[#Broken Authentication]]
	- [[#Cross-Site Scripting (XSS)]]
	- [[#Cross-Site Request Forgery (CSRF)]]
	- [[#Sensitive Data Exposure]]
	- [[#Broken Access Control]]
	- [[#Security Misconfiguration]]
- [[#Keycloak]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]

**Related notes:** [[QA manual eng]]

---

## What Is Security Testing

Security testing checks whether an application protects data and functionality from threats. It verifies that the system keeps data confidential, correct, and available only to the right users.

**Goal:** Find weaknesses (vulnerabilities) before an attacker does.

**Core principles — the CIA triad:**

| Principle | Meaning | Example of a failure |
|---|---|---|
| **Confidentiality** | Data is seen only by authorized users | A user reads another user's private messages |
| **Integrity** | Data cannot be changed in an unauthorized way | An attacker edits a price before payment |
| **Availability** | The system stays up for legitimate users | A flood of requests takes the site down (DoS) |

**Key concepts:**
- **Authentication** — proving *who* you are (login, password, token)
- **Authorization** — deciding *what* you are allowed to do (roles, permissions)
- **Vulnerability** — a weakness that can be exploited
- **Threat** — a possible danger that could exploit a vulnerability
- **Exploit** — the actual attack that uses a vulnerability

> [!info] Where QA fits
> Deep security testing (penetration testing) is done by specialists. A manual QA still does a lot: check authorization rules, test input validation, verify HTTPS, look for data leaks in responses, and confirm error messages do not reveal internal details.

**When security testing happens:**
- During functional testing — basic checks (e.g. can a normal user reach an admin page?)
- As a dedicated phase before release
- Continuously, via automated security scanners in CI

---

## Types of Vulnerabilities

The most common web vulnerabilities are tracked by **OWASP** (Open Worldwide Application Security Project) in the **OWASP Top 10** list. Below are the ones a QA engineer meets most often.

### Injection

Untrusted input is sent to an interpreter (database, OS, etc.) as part of a command. The classic case is **SQL Injection**.

**Goal of the test:** Confirm input is validated and queries are parameterized.

**Example:** A login form builds a query as `... WHERE name = '" + input + "'`. Entering `' OR '1'='1` makes the condition always true and bypasses the login.

**How a QA checks it:**
- Enter special characters in inputs: `'`, `"`, `;`, `--`, `<`, `>`
- Watch for database errors or unexpected results
- Verify the app rejects or safely escapes them

---

### Broken Authentication

Weak login, session, or password handling lets attackers take over accounts.

**Goal of the test:** Confirm only valid users get in and sessions are protected.

**How a QA checks it:**
- Weak passwords are rejected (e.g. `12345`)
- Account locks after several failed attempts
- Session token changes after login and is cleared on logout
- The same session cannot be reused after logout (no "back button" access)

---

### Cross-Site Scripting (XSS)

The app stores or reflects user input and renders it as code in another user's browser. The attacker's script then runs in the victim's session.

**Goal of the test:** Confirm user input is escaped before being shown.

**Example:** A comment field accepts `<script>alert('XSS')</script>`. If the alert pops up when the page is viewed, the input is not escaped.

**How a QA checks it:**
- Enter HTML/JS payloads in text fields, names, comments, search boxes
- Reload the page and view it as another user
- The script must appear as plain text, never execute

---

### Cross-Site Request Forgery (CSRF)

A logged-in user is tricked into sending a request they did not intend (e.g. clicking a malicious link that changes their email).

**Goal of the test:** Confirm state-changing requests require a secret CSRF token.

**How a QA checks it:**
- Inspect forms/requests for a CSRF token
- Try to repeat a request without the token — it must be rejected

---

### Sensitive Data Exposure

Private data (passwords, tokens, card numbers) is stored or sent without proper protection.

**Goal of the test:** Confirm sensitive data is encrypted and never leaked.

**How a QA checks it:**
- The site uses HTTPS everywhere (no HTTP pages)
- Passwords are never returned in API responses
- Tokens and card numbers are not written to logs or URLs
- DevTools → Network shows no secrets in plain text

---

### Broken Access Control

Users can reach data or actions that should be forbidden for their role.

**Goal of the test:** Confirm authorization is enforced on the server, not just hidden in the UI.

**How a QA checks it:**
- Log in as a regular user, then open an admin URL directly
- Change an id in the URL (`/orders/123` → `/orders/124`) to reach another user's data (IDOR)
- Confirm the server returns 403/404, not the data

> [!caution] UI hiding is not security
> Hiding a button does not protect an action. If the underlying request still works when sent directly, access control is broken. Always test at the request level, not only the UI.

---

### Security Misconfiguration

Default settings, verbose errors, or open services leave the system exposed.

**Goal of the test:** Confirm the environment does not reveal internal details.

**How a QA checks it:**
- Error pages do not show stack traces, file paths, or framework versions
- Default credentials (admin/admin) do not work
- Directory listing is disabled
- Security headers are present (e.g. `Content-Security-Policy`, `X-Frame-Options`)

> [!tip] Quick QA security checklist
> | Area | Check |
> |---|---|
> | Transport | All pages use HTTPS |
> | Input | Special characters are validated/escaped |
> | Auth | Lockout after failed logins; session cleared on logout |
> | Access | Direct URL/id access is blocked for other roles |
> | Data | No secrets in responses, URLs, or logs |
> | Errors | No stack traces or internal paths shown |

---

## Keycloak

**Keycloak** is an open-source **Identity and Access Management (IAM)** system. Instead of every application building its own login, password, and role logic, applications delegate that to Keycloak.

**What it provides:**
- **Single Sign-On (SSO)** — log in once, access many applications
- **Centralized user management** — users, passwords, roles in one place
- **Standard protocols** — OAuth 2.0, OpenID Connect (OIDC), SAML
- **Social login** — sign in with Google, GitHub, etc.
- **Multi-factor authentication (MFA)**

**Key terms:**

| Term | Meaning |
|---|---|
| **Realm** | An isolated space with its own users, roles, and clients |
| **Client** | An application that uses Keycloak to authenticate users |
| **User** | A person who logs in |
| **Role** | A permission group assigned to users (e.g. `admin`, `user`) |
| **Token** | A signed proof of identity, usually a JWT |

**How login works (simplified OIDC flow):**
1. The user opens the app and is redirected to Keycloak's login page
2. The user enters credentials; Keycloak verifies them
3. Keycloak issues an **access token** (a JWT) and redirects back to the app
4. The app sends the token with each request
5. The server checks the token's signature, expiry, and roles before responding

**What a QA tests with Keycloak:**
- Login and logout work across all connected apps (SSO)
- A user sees only what their **role** allows
- An **expired** or **invalid** token is rejected (try editing or removing it)
- A token from one realm/client does not work on another
- MFA is enforced when configured

> [!info] Token testing tip
> An access token is usually a **JWT**. You can paste it into a JWT decoder (or DevTools) to read its claims — roles, expiry (`exp`), user id. A QA verifies the app actually enforces these claims server-side and does not just trust the UI.

---

## Interview Questions

### Top 10

**1. What is security testing?**
Security testing checks whether an application protects its data and functionality from threats. Its goal is to find vulnerabilities (weaknesses that can be exploited) before an attacker does.

**2. What is the CIA triad?**
Confidentiality (data is seen only by authorized users), Integrity (data cannot be changed in an unauthorized way), and Availability (the system stays up for legitimate users). These are the three core principles of security.

**3. What is the difference between authentication and authorization?**
Authentication proves who you are (login, password, token). Authorization decides what you are allowed to do (roles, permissions). Authentication comes first; authorization controls access afterward.

**4. What is OWASP?**
OWASP (Open Worldwide Application Security Project) is a community that publishes security resources, including the OWASP Top 10 — a list of the most common and critical web application vulnerabilities.

**5. What is SQL Injection and how do you test for it?**
SQL Injection is when untrusted input is inserted into a database query as part of the command, letting an attacker change its logic. You test by entering special characters (`'`, `--`, `' OR '1'='1`) and watching for database errors or bypassed logic.

**6. What is Cross-Site Scripting (XSS)?**
XSS is when an app renders user input as code in another user's browser, so the attacker's script runs in the victim's session. You test by entering HTML/JS payloads like `<script>alert('XSS')</script>` and confirming they display as plain text, never execute.

**7. What is broken access control?**
When users can reach data or actions forbidden for their role — for example a regular user opening an admin URL, or changing an id in the URL to see another user's data (IDOR). Authorization must be enforced on the server, not just hidden in the UI.

**8. What is the difference between a vulnerability, a threat, and an exploit?**
A vulnerability is a weakness. A threat is a possible danger that could use it. An exploit is the actual attack that takes advantage of the vulnerability.

**9. What is Keycloak?**
Keycloak is an open-source Identity and Access Management (IAM) system. Applications delegate login, user management, and roles to it, gaining Single Sign-On (SSO) and standard protocols like OAuth 2.0, OIDC, and SAML.

**10. What can a manual QA check for security without being a penetration tester?**
HTTPS everywhere, input validation/escaping, account lockout and session handling, that direct URL/id access is blocked for other roles, no secrets in responses or logs, and that error pages do not reveal internal details.

---

### Tricky Questions

**1. A button is hidden for normal users, so the admin action is protected. True or false?**
False. Hiding a button in the UI is not security. If the underlying request still works when sent directly, access control is broken. Authorization must be enforced server-side, and you should test at the request level, not only the UI.

**2. The login page uses HTTPS. Does that make authentication secure?**
Not on its own. HTTPS only encrypts data in transit. The app can still allow weak passwords, no account lockout, predictable session tokens, or sessions that stay valid after logout. Authentication security needs more than transport encryption.

**3. You can read the roles inside a JWT. Does that mean you can escalate your privileges?**
A JWT is readable but signed. If you edit the roles, the signature becomes invalid and a correctly implemented server rejects the token. The real test is whether the server actually verifies the signature and enforces the claims — a server that trusts an unverified token is vulnerable.

**4. An input field escapes `<script>` tags. Is the app safe from XSS?**
Not necessarily. XSS has many vectors — attributes, event handlers, URLs, and other contexts where simple tag escaping is not enough. You must test multiple payloads and contexts, and ideally confirm output encoding is applied everywhere user input is rendered.

**5. A test environment uses default credentials (admin/admin). Is that only a test problem?**
No. Default credentials and other misconfigurations often leak into production or staging that is reachable from outside. Security misconfiguration is itself an OWASP risk, so default credentials, verbose errors, and open services should be flagged wherever they appear.
