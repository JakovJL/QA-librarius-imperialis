# Mobile Automation

## Table of Contents

- [[#Questions and Answers]]
	- [[#What Types of Mobile Application Are There?]]
	- [[#Which Mobile Automation Tools Should You Choose?]]
	- [[#How Does Appium Work?]]
	- [[#Which Programs and Components Are Needed for a Local Run?]]
	- [[#Which Appium Capabilities Start an Android or iOS Session?]]
	- [[#What Are Android Package, Activity, UiAutomator2, and AppiumDriver?]]
	- [[#How Do Mobile Locators Work and How Does ID Differ From Accessibility ID?]]
	- [[#How Should an Appium Project Use Screen Objects and Configuration?]]
	- [[#How Do You Run Appium and Use Appium Inspector?]]
	- [[#What Happened to MobileElement in Modern Appium Java Client?]]
	- [[#How Do XCUIApplication, launch, activate, launchArguments, and launchEnvironment Work?]]
	- [[#What Are XCUIElement, XCUIElementQuery, XCTWaiter, XCTestExpectation, and XCTAssert?]]
	- [[#How Do XCTest Setup, Teardown, XCUIDevice, and XCTContext Work?]]
	- [[#How Do You Test Permissions, System Alerts, and Notifications?]]
	- [[#How Do You Test Background, Foreground, Orientation, Language, Region, and Network Conditions?]]
	- [[#How Do You Run Mobile Tests in CI, on a Grid or Device Farm, and in Parallel?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Questions and Answers

### What Types of Mobile Application Are There?

**Answer:**

A native app uses platform UI controls and is installed on the device. A hybrid app has native screens and a web view; a test may need to switch between native and web contexts. A mobile-web app runs in a browser on a phone or tablet. The type changes the tool, locators, test boundary, and whether a real device is needed. Test critical flows on real devices as well as emulators or simulators because hardware, OS, network, and permission behaviour can differ.

### Which Mobile Automation Tools Should You Choose?

**Answer:**

Appium is cross-platform and uses the W3C WebDriver protocol, so one client API can drive Android and iOS through platform drivers. Espresso is an Android-native option; Kaspresso builds higher-level Android test support on top of Espresso and UI Automator. XCUITest is Apple's native UI-test framework. Detox is commonly used for React Native applications. Select the tool from the application technology, required platforms, team language, speed, and device-farm support. Selendroid is a legacy Android tool, TestProject reached end of life in 2023, and Xamarin.UITest should be treated as legacy for new cloud-device work because Visual Studio App Center retired in 2025.

### How Does Appium Work?

**Answer:**

An Appium client sends WebDriver commands to an Appium server. The server selects an installed driver, such as UiAutomator2 for Android or XCUITest for iOS. That driver communicates with platform automation services on the device or simulator and returns the result to the client. A session is configured with capabilities. Appium 2 and later install drivers separately from the server, so installing the server alone is not enough to automate a device.

### Which Programs and Components Are Needed for a Local Run?

**Answer:**

For Android, install the Android SDK, platform tools, an emulator or a connected real device, and the selected Appium Android driver. Android Studio is a convenient way to manage SDKs and emulators. For iOS, use macOS, Xcode, a simulator or a configured real device, and the XCUITest driver. Also install a test-language client library, the Appium server, and the driver it needs. Appium Inspector helps find elements; Gradle, Maven, npm, or another test runner executes the suite. The exact setup is platform-specific—iOS automation cannot be fully set up on Windows.

### Which Appium Capabilities Start an Android or iOS Session?

**Answer:**

Capabilities describe the session Appium must create. There is no one universal required list: each driver documents its own requirements. Common values include standard `platformName`, plus `appium:automationName`, `appium:deviceName`, platform version, and either an app path, package/activity, bundle ID, or browser name. In W3C sessions, Appium-specific capabilities use the `appium:` prefix. Use only capabilities needed for the scenario and keep device IDs, credentials, and cloud options outside source code.

```json
{
  "platformName": "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "Pixel_API_35",
  "appium:appPackage": "com.example.shop",
  "appium:appActivity": ".MainActivity"
}
```

### What Are Android Package, Activity, UiAutomator2, and AppiumDriver?

**Answer:**

An Android package is the application's unique identifier, for example `com.example.shop`. An Activity is an Android component that usually represents one user-facing screen; `appium:appActivity` tells Appium which entry activity to start when that is needed. UiAutomator2 is the maintained Appium driver for Android native, hybrid, and web automation. In Java, `AppiumDriver` is the general driver type; use `AndroidDriver` or `IOSDriver` when platform-specific APIs make the code clearer. Do not hard-code a production package or depend on one Activity unless the test configuration owns that value.

### How Do Mobile Locators Work and How Does ID Differ From Accessibility ID?

**Answer:**

Prefer a stable accessibility identifier supplied by the application team. Appium's Accessibility ID strategy uses the platform accessibility property: on Android this commonly comes from `content-desc`; on iOS it commonly comes from an accessibility identifier. An Android `resource-id` is a separate Android resource identifier and is found with the ID strategy. Other choices include class name, Android UI Automator, iOS predicate or class chain, and XPath. XPath is usually the last choice because a large mobile hierarchy makes it slow and fragile. Do not use visible text as a stable locator when the app is localized.

### How Should an Appium Project Use Screen Objects and Configuration?

**Answer:**

Use Screen Objects—the mobile equivalent of Page Objects—to keep locators and screen actions out of test scenarios. A test describes behaviour and assertions; a Screen Object describes how to interact with one screen or reusable component. Keep capabilities, base URL, timeouts, device selection, and environment values in versioned non-secret configuration, then override them safely in CI. Appium server configuration is separate from test capabilities. Current Appium supports JSON, YAML, and CommonJS configuration files; `.appiumrc.yaml` and `appium.config.js` are recognised names, while a custom file can be passed explicitly.

### How Do You Run Appium and Use Appium Inspector?

**Answer:**

Install the server, install the required driver, then start the server with `appium` or `appium server`. For example, install the Android driver with `appium driver install uiautomator2`. Appium Inspector creates a session with the chosen capabilities and shows the screen hierarchy, attributes, screenshot, and available commands. Use it to understand the app and validate a locator, then put a stable locator in a Screen Object. It is a development tool, not a replacement for automated assertions.

### What Happened to MobileElement in Modern Appium Java Client?

**Answer:**

Older Appium Java examples use `MobileElement`. It was removed in Appium Java Client 8, so new code should normally use Selenium `WebElement` with `AndroidDriver`, `IOSDriver`, or `AppiumDriver`. The driver still provides mobile-specific commands; the element type changed to align with the W3C WebDriver model. When reading old examples, check the Appium Java Client and Selenium versions before copying imports or APIs.

### How Do XCUIApplication, launch, activate, launchArguments, and launchEnvironment Work?

**Answer:**

`XCUIApplication` represents the iOS application under test. `launch()` starts it; XCTest does not use a standard `start()` API for this. `activate()` brings an already running app to the foreground, while `terminate()` ends it. Set `launchArguments` and `launchEnvironment` before `launch()` to pass flags and environment values, for example a test server URL or a feature flag. Keep those values test-specific and never pass production secrets through launch arguments.

### What Are XCUIElement, XCUIElementQuery, XCTWaiter, XCTestExpectation, and XCTAssert?

**Answer:**

`XCUIElement` represents one UI element. `XCUIElementQuery` describes how to find elements, such as all buttons or a button with an identifier. `XCTestExpectation` describes an asynchronous condition, and `XCTWaiter` waits for it with a timeout. `XCTAssert…` methods check the expected result, for example that an element exists or text is correct. Do not use a fixed sleep when an element, notification, or network-driven state has a meaningful condition to wait for.

### How Do XCTest Setup, Teardown, XCUIDevice, and XCTContext Work?

**Answer:**

Use `setUp()` to prepare only what each test needs and `tearDown()` to release shared resources. `addTeardownBlock()` registers test-specific cleanup and runs it after the test method, before the case teardown methods. `XCUIDevice` represents the current device and can control supported device actions such as orientation. `XCTContext.runActivity` creates named activities in the test report and is useful for grouping a meaningful action and its attachments. Cleanup must also remove test accounts, files, and changed state where applicable.

### How Do You Test Permissions, System Alerts, and Notifications?

**Answer:**

Test both allowed and denied permission paths with a known initial permission state. For an expected alert that is part of the flow, find and handle the alert directly. In XCUITest, an interruption monitor is for unrelated UI that blocks the current interaction; it is not the normal way to test an expected alert. Use test accounts, controllable push providers, or app test hooks for notification scenarios so the test does not depend on a real external notification at an unknown time. Reset permissions and app data between tests when the scenario requires it.

### How Do You Test Background, Foreground, Orientation, Language, Region, and Network Conditions?

**Answer:**

Verify the application state before and after moving it to background and foreground. The old `runAppInBackground` command is deprecated; use the current driver-supported lifecycle commands such as query state, terminate, and activate where appropriate. Change orientation through the supported platform or driver API, then verify layout and state. Set language and region through supported simulator, emulator, or session configuration and avoid locators based on translated text. Control network conditions through emulator tools, a proxy, or a test environment; do not assume every real device or farm allows the same network toggle.

### How Do You Run Mobile Tests in CI, on a Grid or Device Farm, and in Parallel?

**Answer:**

Parameterize platform, OS version, device, app build, locale, and test tags. CI should publish JUnit/TestNG or Allure results plus screenshots, device logs, Appium logs, and video when the provider offers it. An Appium Grid or device farm provides remote devices; its capability format, authentication, and supported features must be checked for that provider. Parallel sessions need separate devices, Appium ports, app data, accounts, files, and report names. Start with a small stable smoke suite, then add carefully selected regression tests instead of trying to run every case on every device combination.

---

## Theory Links

- [[12 Mobile App Testing]]
