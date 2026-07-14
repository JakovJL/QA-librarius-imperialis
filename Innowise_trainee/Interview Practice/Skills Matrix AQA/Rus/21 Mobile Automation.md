# Mobile Automation

## Содержание

- [[#Вопросы и ответы]]
	- [[#Какие типы mobile applications существуют?]]
	- [[#Какие tools для mobile automation выбирать?]]
	- [[#Как работает Appium?]]
	- [[#Какие programs и components нужны для local run?]]
	- [[#Какие Appium capabilities запускают Android или iOS session?]]
	- [[#Что такое Android package, Activity, UiAutomator2 и AppiumDriver?]]
	- [[#Как работают mobile locators и чем ID отличается от Accessibility ID?]]
	- [[#Как Appium project должен использовать Screen Objects и configuration?]]
	- [[#Как запускать Appium и использовать Appium Inspector?]]
	- [[#Что произошло с MobileElement в современном Appium Java Client?]]
	- [[#Как работают XCUIApplication, launch, activate, launchArguments и launchEnvironment?]]
	- [[#Что такое XCUIElement, XCUIElementQuery, XCTWaiter, XCTestExpectation и XCTAssert?]]
	- [[#Как работают XCTest setup, teardown, XCUIDevice и XCTContext?]]
	- [[#Как тестировать permissions, system alerts и notifications?]]
	- [[#Как тестировать background, foreground, orientation, language, region и network conditions?]]
	- [[#Как запускать mobile tests в CI, на Grid или Device Farm и parallel?]]
- [[#Ссылки на теорию]]

**Связанные заметки:** [[00 Индекс Skills Matrix AQA]]

---

## Вопросы и ответы

### Какие типы mobile applications существуют?

**Ответ:**

Native app использует platform UI controls и устанавливается на device. Hybrid app содержит native screens и web view; test может потребовать переключения между native и web contexts. Mobile-web app работает в browser на phone или tablet. Type application меняет tool, locators, test boundary и необходимость real device. Critical flows нужно тестировать и на real devices, и на emulators или simulators, потому что hardware, OS, network и permissions могут вести себя по-разному.

### Какие tools для mobile automation выбирать?

**Ответ:**

Appium — cross-platform tool на W3C WebDriver protocol, поэтому один client API может управлять Android и iOS через platform drivers. Espresso — Android-native option; Kaspresso добавляет higher-level Android test support поверх Espresso и UI Automator. XCUITest — native UI-test framework Apple. Detox часто используется для React Native applications. Tool выбирается по technology application, required platforms, team language, speed и device-farm support. Selendroid — legacy Android tool, TestProject достиг end of life в 2023 году, а Xamarin.UITest следует считать legacy для новых cloud-device projects, потому что Visual Studio App Center был retired в 2025 году.

### Как работает Appium?

**Ответ:**

Appium client отправляет WebDriver commands на Appium server. Server выбирает installed driver, например UiAutomator2 для Android или XCUITest для iOS. Этот driver взаимодействует с platform automation services на device или simulator и возвращает result client. Session настраивается capabilities. Appium 2 и позднее устанавливают drivers отдельно от server, поэтому одной установки server недостаточно для automation device.

### Какие programs и components нужны для local run?

**Ответ:**

Для Android нужны Android SDK, platform tools, emulator или connected real device и выбранный Appium Android driver. Android Studio удобно использовать для управления SDK и emulators. Для iOS нужны macOS, Xcode, simulator или configured real device и XCUITest driver. Также устанавливаются test-language client library, Appium server и нужный ему driver. Appium Inspector помогает находить elements, а Gradle, Maven, npm или другой test runner запускает suite. Exact setup зависит от platform: iOS automation нельзя полностью настроить на Windows.

### Какие Appium capabilities запускают Android или iOS session?

**Ответ:**

Capabilities описывают session, которую должен создать Appium. Единого universal required list нет: каждый driver документирует собственные requirements. Common values: standard `platformName`, а также `appium:automationName`, `appium:deviceName`, platform version и один из вариантов: app path, package/activity, bundle ID или browser name. В W3C sessions Appium-specific capabilities используют prefix `appium:`. Нужно указывать только capabilities, нужные scenario, а device IDs, credentials и cloud options держать вне source code.

```json
{
  "platformName": "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "Pixel_API_35",
  "appium:appPackage": "com.example.shop",
  "appium:appActivity": ".MainActivity"
}
```

### Что такое Android package, Activity, UiAutomator2 и AppiumDriver?

**Ответ:**

Android package — unique identifier application, например `com.example.shop`. Activity — Android component, обычно представляющий одну user-facing screen; `appium:appActivity` сообщает Appium, какую entry activity нужно открыть, когда это необходимо. UiAutomator2 — maintained Appium driver для Android native, hybrid и web automation. В Java `AppiumDriver` — общий driver type; `AndroidDriver` или `IOSDriver` используются, когда code становится понятнее от platform-specific APIs. Нельзя hard-code production package или зависеть от одной Activity, если test configuration не владеет этим value.

### Как работают mobile locators и чем ID отличается от Accessibility ID?

**Ответ:**

Лучше использовать stable accessibility identifier, предоставленный application team. Appium Accessibility ID strategy использует platform accessibility property: на Android это обычно `content-desc`, а на iOS — accessibility identifier. Android `resource-id` — отдельный Android resource identifier, который находится ID strategy. Другие варианты: class name, Android UI Automator, iOS predicate или class chain и XPath. XPath обычно выбирают последним: large mobile hierarchy делает его slow и fragile. Нельзя считать visible text stable locator, если application локализуется.

### Как Appium project должен использовать Screen Objects и configuration?

**Ответ:**

Screen Objects — mobile equivalent Page Objects: они хранят locators и screen actions вне test scenarios. Test описывает behaviour и assertions, а Screen Object — interaction с одной screen или reusable component. Capabilities, base URL, timeouts, device selection и environment values хранятся в versioned non-secret configuration и безопасно переопределяются CI. Appium server configuration отделена от test capabilities. Current Appium поддерживает JSON, YAML и CommonJS configuration files; `.appiumrc.yaml` и `appium.config.js` — recognised names, а custom file можно передать явно.

### Как запускать Appium и использовать Appium Inspector?

**Ответ:**

Нужно установить server, затем required driver и запустить server через `appium` или `appium server`. Например, Android driver устанавливается command `appium driver install uiautomator2`. Appium Inspector создаёт session с выбранными capabilities и показывает screen hierarchy, attributes, screenshot и available commands. Он помогает понять application и проверить locator, после чего stable locator переносится в Screen Object. Это development tool, а не замена automated assertions.

### Что произошло с MobileElement в современном Appium Java Client?

**Ответ:**

В старых Java examples Appium используется `MobileElement`. Этот class был удалён из Appium Java Client 8, поэтому новый code обычно использует Selenium `WebElement` вместе с `AndroidDriver`, `IOSDriver` или `AppiumDriver`. Driver всё ещё предоставляет mobile-specific commands; изменился element type для соответствия W3C WebDriver model. При чтении старых examples нужно проверить versions Appium Java Client и Selenium, прежде чем копировать imports или APIs.

### Как работают XCUIApplication, launch, activate, launchArguments и launchEnvironment?

**Ответ:**

`XCUIApplication` представляет iOS application under test. `launch()` запускает его; standard `start()` API XCTest для этого не использует. `activate()` выводит уже running app на foreground, а `terminate()` завершает его. До `launch()` задаются `launchArguments` и `launchEnvironment`, чтобы передать flags и environment values, например test server URL или feature flag. Эти values должны быть test-specific; production secrets нельзя передавать launch arguments.

### Что такое XCUIElement, XCUIElementQuery, XCTWaiter, XCTestExpectation и XCTAssert?

**Ответ:**

`XCUIElement` представляет один UI element. `XCUIElementQuery` описывает поиск elements, например всех buttons или button с identifier. `XCTestExpectation` описывает asynchronous condition, а `XCTWaiter` ждёт его с timeout. Методы `XCTAssert…` проверяют expected result, например existence element или correct text. Нельзя использовать fixed sleep, если element, notification или network-driven state имеет meaningful condition для ожидания.

### Как работают XCTest setup, teardown, XCUIDevice и XCTContext?

**Ответ:**

`setUp()` готовит только resources, нужные каждому test, а `tearDown()` освобождает shared resources. `addTeardownBlock()` регистрирует test-specific cleanup и выполняет его после test method, до case teardown methods. `XCUIDevice` представляет current device и может управлять supported device actions, например orientation. `XCTContext.runActivity` создаёт named activities в test report и полезен для grouping meaningful action и attachments. Cleanup также должен удалить test accounts, files и changed state, где это требуется.

### Как тестировать permissions, system alerts и notifications?

**Ответ:**

Нужно тестировать paths с разрешёнными и отклонёнными permissions при known initial permission state. Expected alert, являющийся частью flow, нужно найти и обработать напрямую. В XCUITest interruption monitor предназначен для unrelated UI, блокирующего текущее interaction; это не normal way тестировать expected alert. Для notifications используются test accounts, controllable push providers или app test hooks, чтобы test не зависел от real external notification в неизвестный момент. Между tests нужно reset permissions и app data, если этого требует scenario.

### Как тестировать background, foreground, orientation, language, region и network conditions?

**Ответ:**

Нужно проверить application state до и после перевода в background и foreground. Старый command `runAppInBackground` deprecated; вместо него применяются current driver-supported lifecycle commands: query state, terminate и activate, когда это подходит. Orientation меняется supported platform или driver API, после чего проверяются layout и state. Language и region задаются через supported simulator, emulator или session configuration; locators не должны зависеть от translated text. Network conditions контролируются emulator tools, proxy или test environment: нельзя считать, что каждый real device или farm поддерживает одинаковое network toggle.

### Как запускать mobile tests в CI, на Grid или Device Farm и parallel?

**Ответ:**

Нужно parameterize platform, OS version, device, app build, locale и test tags. CI должна публиковать JUnit/TestNG или Allure results, а также screenshots, device logs, Appium logs и video, если provider его даёт. Appium Grid или Device Farm предоставляет remote devices; capability format, authentication и supported features нужно проверять у конкретного provider. Parallel sessions требуют отдельных devices, Appium ports, app data, accounts, files и report names. Начинать следует с small stable smoke suite, а затем добавлять carefully selected regression tests, а не запускать все cases на каждой device combination.

---

## Ссылки на теорию

- [[12 Тестирование мобильных приложений]]
