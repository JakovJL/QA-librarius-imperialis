# Examples: Test Cases

## 1. Login Functionality
**ID:** TC-LOGIN-01
**Title:** Verify user can login with valid credentials
**Priority:** High
**Type:** Functional / Positive

### Preconditions
- User account `tester@innowise.com` exists and is active.
- Browser is opened on the login page: `https://demo-store.innowise.com/login`

### Test Steps
| # | Step Description | Expected Result |
|---|---|---|
| 1 | Enter `tester@innowise.com` in the "Email" field | Email is displayed correctly. |
| 2 | Enter `Password123!` in the "Password" field | Input is masked (dots or stars). |
| 3 | Click the "Login" button | User is redirected to the Dashboard. |

### Expected Result
User is successfully authenticated and redirected to the Dashboard page with a "Welcome" message.

### Postconditions
- User session is active.
- Session cookie is stored in the browser.

---

## 2. Password Reset
**ID:** TC-AUTH-05
**Title:** Verify user can request a password reset email
**Priority:** Medium
**Type:** Functional / Positive

### Preconditions
- User with email `active-user@example.com` exists in the system.
- User is on the "Forgot Password" page.

### Test Steps
| # | Step Description | Expected Result |
|---|---|---|
| 1 | Enter `active-user@example.com` in the email field | Email is accepted. |
| 2 | Click the "Send Reset Link" button | System shows a success message. |

### Expected Result
A password reset email is sent to the user's inbox, and the user sees a confirmation message on the screen: "If your email is in our system, you will receive a link shortly."

### Postconditions
- A reset token is generated in the database.
- The token expires in 24 hours.

---
**Related to:** [[03 Test Artifacts]]
