# Selenium API

## Содержание

- [[#Вопросы и ответы]]
	- [[#Что это такое и что нужно знать?]]
	- [[#Какие практические навыки нужны Automation QA?]]
	- [[#Какие ошибки и риски важны?]]
- [[#Требования Intern и Junior]]
- [[#Требования Middle]]
- [[#Требования Senior]]
	- [[#Как проверить versions Selenium и driver?]]
	- [[#Какие methods WebDriver, WebElement и By важны?]]
	- [[#Как использовать Actions и JavaScriptExecutor?]]
	- [[#Что такое Expected Conditions и когда они нужны?]]
	- [[#Как работать с alerts, frames и windows?]]
	- [[#Как диагностировать Selenium exceptions?]]
	- [[#Что такое capabilities и session?]]
	- [[#Что добавляет Selenium wrapper?]]
	- [[#Чем отличаются Grid и Selenoid?]]
	- [[#Как test может использовать HTTP proxy?]]
	- [[#Что такое mocks, stubs и fakes?]]
	- [[#Как исправить flaky test?]]
- [[#Ссылки на теорию]]

**Связанные заметки:** [[00 Индекс Skills Matrix AQA]]

---

## Вопросы и ответы

### Что это такое и что нужно знать?

**Короткий ответ:**

WebDriver управляет browser; WebElement представляет element; By находит его. Actions, Expected Conditions, JavaScriptExecutor, alerts, frames и window handles покрывают сложное interaction.

### Какие практические навыки нужны Automation QA?

**Короткий ответ:**

Использовать Grid или Selenoid для remote parallel browsers и собирать logs, screenshots, video, DOM и network evidence.

### Какие ошибки и риски важны?

**Короткий ответ:**

Исправлять locator, timing, stale element, overlay, data и environment causes вместо sleeps или blind retries.

---

## Требования Intern и Junior

- Version Selenium проверяется в build file, например `pom.xml`, или во время работы через package библиотеки. Version browser driver проверяется командой `--version` или driver log. Совместимость browser, driver и Selenium нужно анализировать вместе.
- `WebDriver` открывает страницы и управляет session: `get`, `getCurrentUrl`, `getTitle`, `findElement`, `manage`, `navigate`, `switchTo`, `close` и `quit`. `WebElement` представляет один DOM node: частые methods — `click`, `sendKeys`, `clear`, `getText`, `getAttribute`, `isDisplayed` и `findElement`.
- `By` создаёт locator strategies: `id`, `name`, `cssSelector`, `xpath`, `className`, `tagName` и `linkText`. Locator должен быть стабильным и уникальным; нельзя использовать длинный absolute XPath только потому, что он сейчас работает.

---

## Требования Middle

- `Actions` создаёт сложной user input: hover, drag-and-drop, key combinations и context click; `perform()` отправляет собранную sequence действий. `JavascriptExecutor` запускает небольшой script в browser, только когда обычного WebDriver interaction недостаточно.
- Expected Conditions — predicates для explicit wait: visibility, clickability, frame availability, alert presence или invisibility. Они решают известный переход state, а не любую проблему timing.
- Для alert используется `driver.switchTo().alert()`, затем можно прочитать текст, принять, отклонить или передать text. Для iframe нужно переключиться в frame до поиска его content и вернуться через `defaultContent()`. Переключение window и tab использует window handle; WebDriver не считает их разными concept.
- Частые Selenium exceptions: `NoSuchElementException`, `TimeoutException`, `StaleElementReferenceException` и `ElementClickInterceptedException`. Нужно изучать cause: stale element обычно требует нового поиска после изменения DOM, а не retry loop.
- `Capabilities` описывают запрошенную session. Builder или options object создаёт capabilities; session — browser session на server с session ID. Selenide — пример Selenium wrapper с кратким API и ожиданиями, но он не заменяет понимание WebDriver.

---

## Требования Senior

- Proxy может наблюдать или менять HTTP traffic только если browser и test environment направляют traffic через него. Selenium сам по себе не читает каждый request. Используется отдельный proxy или browser protocol tool; secrets нельзя собирать без необходимости.
- Stub возвращает заранее заданный answer, mock проверяет ожидаемое interaction, а fake — работающую, но упрощённую implementation. Они изолируют test от нестабильных, дорогих или недоступных dependencies.
- Selenium Grid направляет remote sessions на подходящие nodes для parallel execution. Selenoid — другой remote browser service, часто работающий в containers. Выбор зависит от compatibility, operations, browser images, observability и поддержки команды.
- Для исправления flaky UI или API tests сначала определяется cause: product defect, locator, synchronisation, test data, dependency, environment или test code. Нужно сохранить evidence, сделать condition детерминированным и устранить root cause. Retry допустим только как временная диагностическая мера с явным limit.

---

## Подробные вопросы и ответы

### Как проверить versions Selenium и driver?

**Ответ:**

Version Selenium проверяется в dependency `pom.xml` или Gradle configuration. Version browser видна на странице About, а version driver — через executable `--version` или startup log. Если browser test начал падать после update, сначала сравниваются все три versions, а не меняется test code.

### Какие methods WebDriver, WebElement и By важны?

**Ответ:**

`WebDriver` открывает pages через `get()`, находит elements через `findElement()`, меняет context через `switchTo()`, настраивает browser через `manage()` и завершает session через `quit()`. `WebElement` выполняет `click()`, `sendKeys()`, `clear()` и читает state через `getText()`, `getAttribute()`, `isDisplayed()` и `isEnabled()`. `By` создаёт locator, например `By.id()`, `By.cssSelector()` или `By.xpath()`.

### Как использовать Actions и JavaScriptExecutor?

**Ответ:**

`Actions` применяется для реального user input, который трудно выразить одним WebElement call: hover, drag-and-drop, context click и key combinations. Сначала строится sequence, затем вызывается `perform()`. `JavascriptExecutor` нужен только для browser-level задачи, например чтения computed style или scroll element в view; он не должен заменять обычный click без причины.

### Что такое Expected Conditions и когда они нужны?

**Ответ:**

Expected Condition — predicate для explicit wait. Типичные conditions ожидают, что element станет visible или clickable, появится text, будет alert, станет доступен frame или исчезнет loader. Выбирается condition, отражающий следующее реальное действие user. Например, перед чтением result ожидается его visible text, а не произвольное число секунд.

### Как работать с alerts, frames и windows?

**Ответ:**

Для alert нужно дождаться его и применить `driver.switchTo().alert()`, чтобы прочитать text, принять, отклонить или ввести text. Для iframe сначала выполняется switch в frame, затем ищутся его inner elements, после чего используется `defaultContent()`. Для нового tab или window сохраняется original handle, ожидается другой handle, выполняется switch, проверяется нужная page и при необходимости возвращается original handle.

### Как диагностировать Selenium exceptions?

**Ответ:**

`NoSuchElementException` означает неверный locator или context. `TimeoutException` означает, что ожидаемый state не наступил вовремя. `StaleElementReferenceException` означает, что DOM заменил element, поэтому его нужно найти заново после изменения. `ElementClickInterceptedException` может означать overlay или другой element, блокирующий click. До вывода о cause собираются screenshot, URL, DOM, logs и точное condition.

### Что такое capabilities и session?

**Ответ:**

Capabilities описывают session, запрошенную у browser или Grid: browser name, version, platform и browser options. `ChromeOptions` — удобный Java builder capabilities Chrome. Session — remote browser instance, созданный server и имеющий session ID. Builder configuration должна находиться в одном factory, чтобы tests не задавали conflicting options.

### Что добавляет Selenium wrapper?

**Ответ:**

Wrapper, например Selenide, предоставляет более высокий API поверх Selenium: краткие element actions, built-in waiting и понятную diagnostics. Он может уменьшить повторяющийся code, но команде всё равно нужно понимать locators, browser state, WebDriver errors и configuration wrapper. Wrapper выбирается только если его behaviour и maintenance подходят framework.

### Чем отличаются Grid и Selenoid?

**Ответ:**

Оба запускают remote browsers для parallel tests. Selenium Grid — distributed solution Selenium, которая сопоставляет requested capabilities с available nodes. Selenoid — отдельный service, обычно запускающий browser containers и предоставляющий video и logs. Выбор зависит от browser support, skills поддержки, observability, security и CI environment.

### Как test может использовать HTTP proxy?

**Ответ:**

Test настраивает browser отправлять traffic через approved proxy, после чего proxy записывает или изменяет проходящие requests и responses. Это полезно для diagnostics или controlled test cases, например проверки expected header request. Proxy не заменяет API tests, а production credentials и private payloads нельзя хранить в reports.

### Что такое mocks, stubs и fakes?

**Ответ:**

Stub возвращает predefined data. Mock также проверяет, что required interaction состоялся. Fake — упрощённая, но working implementation, например in-memory repository. Они изолируют tests от slow, paid, unstable или unavailable dependencies, но должны сохранять contract реальной dependency.

### Как исправить flaky test?

**Ответ:**

Нельзя начинать с retries. Failure классифицируется как product, locator, timing, data, environment, dependency или test-code problem. Затем state делается deterministic: используется stable locator, ожидание нужного condition, isolated data, controlled dependency или исправленный test. Retry остаётся только краткой diagnostic защитой с evidence и owner.

---

## Ссылки на теорию

- [[17 Основы Selenium WebDriver]]
