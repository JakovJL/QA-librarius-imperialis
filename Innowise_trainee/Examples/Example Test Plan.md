# Example: Test Plan (IEEE 829 Standard)

## 1. Test Plan Identifier
TP-STORE-2026-01

## 2. Introduction
This test plan describes the comprehensive testing process for the "User Login" feature of the Innowise Demo Store web application.

## 3. Test Items
- Login module (v1.2.4)
- User database schema (v3.0)
- "Forgot Password" API service.
- Related documentation: SRS-Login-01.

## 4. Features to be Tested
- Authentication with valid and invalid credentials.
- Error messaging for incorrect inputs (empty fields, wrong email format).
- Account lockout after 5 failed attempts.
- Password masking and "Show Password" toggle in the UI.

## 5. Features Not to be Tested
- Social media login (Google/Facebook integration) - out of scope for this release.
- Registration of new users (handled in a separate test plan).
- Performance under load (handled by the performance team).

## 6. Test Strategy
- **Levels**: System Testing (E2E flows).
- **Types**: Functional, Regression, UI/UX.
- **Approach**: Black-box manual testing using scripted test cases.

## 7. Item Pass/Fail Criteria
- **Pass**: All critical and major test cases are executed, and actual results match expected results.
- **Fail**: A "Critical" or "Major" defect is found that prevents the user from logging in or causes data loss.

## 8. Suspension Criteria and Resumption Requirements
- **Suspension**: Testing is suspended if the staging environment is inaccessible (500 Error) or if more than 30% of test cases fail due to a single blocker.
- **Resumption**: Testing resumes after the development team provides a fix and confirms environment stability.

## 9. Test Deliverables
- Test Plan (this document).
- Test Cases (documented in TestRail).
- Bug Reports (in Jira).
- Test Summary Report.

## 10. Testing Tasks
- Requirement analysis and clarification.
- Test case design and review.
- Test execution and result logging.
- Defect reporting and retesting.

## 11. Environmental Needs
- Staging environment URL: `https://staging.store.innowise.com/login`
- Web browsers: Chrome (latest), Safari (latest).
- Test user accounts with various roles (Admin, Customer, Guest).

## 12. Responsibilities
- **QA Engineer**: Test execution, defect reporting, and retesting.
- **QA Lead**: Test strategy definition and final sign-off.
- **Developers**: Bug fixing and deployment to staging.

## 13. Staffing and Training Needs
- 2 Manual QA Engineers required.
- Training on the internal "Auth-Service" logs access is needed.

## 14. Schedule
- **Planning & Design**: Apr 28 - Apr 29.
- **Execution**: Apr 30 - May 02.
- **Reporting & Closure**: May 03.

## 15. Risks and Contingencies
- **Risk**: Unstable staging environment due to concurrent deployments.
- **Contingency**: Shift testing to the "UAT" environment or a stable local build if staging is down for more than 4 hours.

## 16. Approvals
- **Project Manager**: [Name] / [Date]
- **QA Lead**: [Name] / [Date]

---
**Related to:** [[03 Test Artifacts]]
