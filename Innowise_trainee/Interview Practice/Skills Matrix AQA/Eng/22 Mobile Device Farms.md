# Mobile Device Farms

## Table of Contents

- [[#Questions and Answers]]
	- [[#What Is a Mobile Device Farm and How Do Emulators, Simulators, and Real Devices Differ?]]
	- [[#How Do You Run a Test on a Local Android Emulator or an iOS Simulator?]]
	- [[#When Should a Team Use a Device Farm?]]
	- [[#What Are the Main Benefits and Limitations of a Device Farm?]]
	- [[#Which Device Farms Should You Know and Which Names Are Legacy?]]
	- [[#How Do You Build a Risk-Based Device Matrix?]]
	- [[#How Do You Configure a Remote Device Session?]]
	- [[#How Do You Upload a Build and Reach a Private Test Environment Safely?]]
	- [[#Which Logs and Artifacts Should You Collect from a Farm?]]
	- [[#How Do You Diagnose a Failure with a Live Session or Remote Debugger?]]
	- [[#How Do You Handle Videos and Screenshots?]]
	- [[#How Do You Connect a Device Farm to CI/CD Securely?]]
	- [[#How Do You Scale with Parallel Runs, Sharding, and Session Control?]]
	- [[#How Do You Measure Stability and Support More Than One Provider?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Questions and Answers

### What Is a Mobile Device Farm and How Do Emulators, Simulators, and Real Devices Differ?

**Answer:**

A mobile device farm provides remote devices and test infrastructure through a web UI, CLI, API, or Appium endpoint. An Android emulator emulates Android hardware and software. An iOS Simulator simulates iOS behaviour on macOS but is not an iPhone or iPad. A real device has actual hardware, OS build, sensors, performance limits, vendor changes, and network behaviour. Use emulators and simulators for fast feedback, but use real devices for risks that depend on real hardware or an OEM version of Android.

### How Do You Run a Test on a Local Android Emulator or an iOS Simulator?

**Answer:**

Create and start an Android Virtual Device (AVD) from Android Studio Device Manager, confirm it is visible to `adb`, then start an Appium session with its device configuration. For iOS, start a Simulator from Xcode or `simctl` on macOS and run an XCUITest or Appium XCUITest-driver session. Local virtual devices are useful before using a farm because they make locator, build, and basic capability problems faster to diagnose. A farm connection normally uses the provider's UI, CLI, API, or remote WebDriver endpoint.

### When Should a Team Use a Device Farm?

**Answer:**

Use a farm when the required real-device coverage, OS versions, locations, or parallel capacity is difficult or too expensive to maintain locally. It is especially useful for release validation, compatibility testing, and investigating a device-specific defect. Do not send every local test to a farm: small unit, API, and fast emulator checks usually give cheaper feedback. The decision should compare risk, feedback time, privacy, device availability, and cost.

### What Are the Main Benefits and Limitations of a Device Farm?

**Answer:**

Benefits include access to many real models, less hardware maintenance, controlled device reset, parallel execution, and provider artifacts. Limitations include queue time, subscription or device-minute cost, limited control over a remote device, network latency, and provider-specific features. Availability changes during busy periods, so a test must handle a queued or unavailable device as infrastructure information, not silently retry forever. Never use a farm as the only source of truth when a defect must be reproduced on a specific customer device.

### Which Device Farms Should You Know and Which Names Are Legacy?

**Answer:**

Common services include BrowserStack App Live and App Automate, Sauce Labs, Firebase Test Lab, AWS Device Farm, BitBar Testing Cloud, Kobiton, and LambdaTest. They differ in device inventory, supported frameworks, regions, private-network support, artifacts, concurrency, and pricing. Firebase Test Lab supports device matrices and integrates with Firebase, Android Studio, `gcloud`, and CI. BrowserStack App Automate supports Appium on real Android and iOS devices. Xamarin Test Cloud is a legacy name: it was part of the retired Visual Studio App Center Test service. Check a provider's current documentation and contract before choosing it.

### How Do You Build a Risk-Based Device Matrix?

**Answer:**

Start from real user data and product risk, not from every theoretical combination. Include supported OS versions, high-usage models, different screen sizes, important Android OEMs, locale, orientation, and accessibility or network risks. Choose a small smoke matrix for every change and a broader regression matrix for scheduled runs or release candidates. Review failed and untested combinations regularly. A matrix is useful only when its selection rule and ownership are clear.

### How Do You Configure a Remote Device Session?

**Answer:**

Set the model, OS version, application build, automation framework, test name, and required locale, orientation, region, or geolocation through the provider's documented capabilities or UI. A capability selects an available device configuration; it does not guarantee that the physical device is free immediately. Keep provider-specific options in one configuration adapter and validate them before a large run. Do not put a user password, access token, or private build URL into source code or a public report.

### How Do You Upload a Build and Reach a Private Test Environment Safely?

**Answer:**

Upload the signed test build through the provider's secure UI, CLI, or API and retain the returned build identifier only as long as needed. If the app needs an internal backend, use the provider's approved local tunnel or private-network integration instead of exposing the backend publicly. Store farm credentials and tunnel keys in the CI secret store, restrict access by project, and use test accounts with non-production data. Confirm retention and deletion rules for uploaded applications and artifacts before using a third-party farm.

### Which Logs and Artifacts Should You Collect from a Farm?

**Answer:**

Collect the test result, device or system log, Appium or framework log, screenshots, video when available, application crash report, and initialization or provisioning error. On Android, Logcat often explains a crash or permission issue. On iOS, inspect XCTest and device logs, then the crash report if one exists. Link artifacts to the CI build, test case, device, and session identifier. Collect enough evidence to diagnose a failure, but redact tokens and personal data.

### How Do You Diagnose a Failure with a Live Session or Remote Debugger?

**Answer:**

First decide whether the failure is product, test, device, provider, or environment related. Read the exception and device logs, then compare the app build, capabilities, device, and test data with a passing run. Reproduce the case in the provider's live or interactive session when it offers one; observe the same screen and action before changing a locator or adding a wait. A remote debugger can help inspect a connected session, but it must not expose customer data or leave a device locked for other users.

### How Do You Handle Videos and Screenshots?

**Answer:**

Video shows the full sequence and is useful for gestures, animation, or a failure that is hard to describe. A screenshot is faster to inspect and should be captured at a meaningful failure point. Enable provider recording and visual logs according to the run type; full video for every high-volume smoke run may increase duration and storage cost. Name artifacts with the session and test identifier, define retention, and make them available from the report or CI job.

### How Do You Connect a Device Farm to CI/CD Securely?

**Answer:**

The pipeline uploads the build, starts or requests a run, waits for the result, downloads or links artifacts, and applies the agreed quality gate. Jenkins, GitHub Actions, and GitLab CI can use a provider plugin, SDK, REST API, or CLI. Keep access keys, local-tunnel credentials, and build-signing material in the CI secret store. Use masked variables, least-privilege project access, and an explicit cleanup or expiry policy. A CI job must report a provider outage differently from a failed product test.

### How Do You Scale with Parallel Runs, Sharding, and Session Control?

**Answer:**

Parallelism runs independent sessions on several devices at the same time. Sharding splits one suite into deterministic groups, for example by test class or tag, so the groups can run in parallel. Set concurrency from the provider quota, device availability, backend capacity, and budget—not only from the number of tests. Each session needs isolated data, account, artifact path, and retry policy. Use provider APIs or CLI to monitor queue, session status, cancellation, and dynamic load distribution.

### How Do You Measure Stability and Support More Than One Provider?

**Answer:**

Track pass/fail/blocked results, queue time, device availability, duration, retry count, flaky rate, infrastructure failures, and artifact completeness by provider and device. Do not call a test flaky until repeated evidence separates test instability from a product or provider defect. Keep the test code provider-neutral where possible: use one layer for remote URL, authentication, capabilities, upload, and artifact links. A second provider is useful for resilience or regional needs only when the team can maintain and regularly verify the integration.

---

## Theory Links

- [[12 Mobile App Testing]]
