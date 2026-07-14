# Authorization Protocols

## Table of Contents

- [[#Questions and Answers]]
	- [[#How Do Authentication and Authorization Differ?]]
	- [[#What Are OpenID, OAuth, and OAuth 2.0?]]
	- [[#What Roles and Endpoints Does OAuth 2.0 Use?]]
	- [[#How Does Authorization Code with PKCE Work?]]
	- [[#What Are Access Tokens, Refresh Tokens, Scopes, and Roles?]]
	- [[#What Is a JWT and How Is It Validated?]]
	- [[#What Does OIDC Add to OAuth 2.0?]]
	- [[#How Does an Automated Test Obtain and Send a Token?]]
	- [[#How Do You Test Authentication and Authorization Failures?]]
	- [[#What Are SAML, JWK, and Identity Platforms?]]
	- [[#What Senior Authorization Checks Are Needed?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Questions and Answers

### How Do Authentication and Authorization Differ?

**Answer:**

Authentication answers “Who are you?”: for example, a user proves identity with a password, MFA, or an external identity provider. Authorization answers “What may you do?” after identity is known: for example, read a report but not delete it. An API must enforce authorization on the server; hiding a button in the UI is not enough.

### What Are OpenID, OAuth, and OAuth 2.0?

**Answer:**

OpenID is a family of identity standards. OpenID Connect (OIDC) is the modern identity layer built on OAuth 2.0. OAuth is delegated authorization: it lets a client receive limited access without receiving the user's password. OAuth 2.0 replaced OAuth 1.0 and has a different protocol design; they are not compatible. OAuth 2.0 alone does not define user login or identity information.

### What Roles and Endpoints Does OAuth 2.0 Use?

**Answer:**

The Resource Owner can grant access to protected data. The Client is the application requesting access. The Authorization Server authenticates the user when needed and issues tokens. The Resource Server hosts the protected API and accepts a valid access token. The Authorization Endpoint starts an interactive authorization request; the Token Endpoint exchanges an authorization code, refresh token, or client credentials for tokens. These servers may be separate services or parts of one Identity Server.

### How Does Authorization Code with PKCE Work?

**Answer:**

The client creates a high-entropy `code_verifier` and sends its derived `code_challenge` with the authorization request. After the user authorizes, the client receives a short-lived authorization code through a registered redirect URI. It sends that code and the original verifier to the Token Endpoint. The server issues tokens only if the verifier matches the challenge. PKCE protects a public client if an authorization code is intercepted; it is not a replacement for redirect-URI validation or TLS.

### What Are Access Tokens, Refresh Tokens, Scopes, and Roles?

**Answer:**

An access token is presented to a Resource Server to call a protected API. A refresh token, when issued, is sent only to the Authorization Server to obtain a new access token and needs stronger protection. A scope is delegated permission requested by a client, such as `orders.read`. A role is an application's authorization attribute, such as `admin`; it is not defined by OAuth itself. Tests must check both scope and role rules defined by the application.

### What Is a JWT and How Is It Validated?

**Answer:**

A JSON Web Token (JWT) is a token format, not a synonym for OAuth or OIDC. A signed JWT normally has three Base64URL-encoded parts: header, payload with claims, and signature. Decoding is not validation. The Resource Server must validate its signature with a trusted key and check claims such as issuer (`iss`), audience (`aud`), expiry (`exp`), and allowed algorithm. A JWT may be an access token or an ID token; access tokens can also be opaque strings.

### What Does OIDC Add to OAuth 2.0?

**Answer:**

OIDC lets a client authenticate a user as well as obtain authorization. It adds the `openid` scope, an ID Token with identity claims, standard discovery metadata, and a UserInfo endpoint. An ID Token is for the client to learn about authentication; it is not a substitute for an access token when calling an API. In tests, verify that each token is used by its intended recipient.

### How Does an Automated Test Obtain and Send a Token?

**Answer:**

For machine-to-machine API tests, a dedicated test client can use the client-credentials grant at the Token Endpoint. For an end-user flow, test through the Authorization Endpoint with a test account and PKCE, or use an approved test-only method. Store credentials in the CI secret store, request the smallest required scopes, do not commit tokens, and redact them from reports and logs. The test then sends the access token in the HTTP Authorization header.

```java
given()
    .header("Authorization", "Bearer " + accessToken)
.when()
    .get("/api/orders")
.then()
    .statusCode(200);
```

### How Do You Test Authentication and Authorization Failures?

**Answer:**

Use a valid token first to prove the endpoint works, then make one controlled negative change per test. Check no token, malformed token, expired token, bad signature, wrong issuer or audience, missing scope, wrong role, and a token from another tenant. Assert the expected status and safe error response: typically `401` when authentication is absent or invalid and `403` when identity is known but permission is missing. The response and logs must not reveal a token, key, or unnecessary security detail.

### What Are SAML, JWK, and Identity Platforms?

**Answer:**

SAML is a separate XML-based federation protocol, often used for enterprise browser single sign-on. A JSON Web Key (JWK) describes a cryptographic key, commonly a public signing key published in a JWK Set for JWT validation. Keycloak, Auth0, Microsoft Entra ID (formerly Azure AD), and Active Directory are identity products or directories, not protocols. A QA engineer learns the endpoints, claims, and test setup of the chosen platform instead of assuming all platforms behave identically.

### What Senior Authorization Checks Are Needed?

**Answer:**

Senior tests cover tenant isolation, privilege escalation, role and scope combinations, refresh-token rotation and revocation where supported, and token introspection for opaque tokens where supported. They can use a mock Authorization Server to make failure cases repeatable. CI must obtain secrets safely and clean up test users or grants. Audit logs and session monitoring should show useful events without exposing credentials or complete tokens.

---

## Theory Links

- [[15 Security Testing Basics]]
