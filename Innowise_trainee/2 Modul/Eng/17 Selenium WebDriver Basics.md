# Selenium WebDriver Basics

## Table of Contents

- [[#Why Selenium Matters]]
- [[#What WebDriver Is]]
	- [[#Common Browser Drivers]]
- [[#Selenium API Overview]]
- [[#Browser Initialization and Navigation]]
	- [[#WebDriver Methods]]
- [[#Locators]]
	- [[#Common Locator Types]]
	- [[#`findElement()` vs `findElements()`]]
	- [[#Locator Priority]]
- [[#Working with Web Elements]]
	- [[#WebElement Methods]]
	- [[#Dropdown Basics]]
- [[#Advanced Interactions]]
	- [[#Actions (Mouse and Keyboard)]]
	- [[#Alerts (JavaScript Popups)]]
	- [[#Frames and Iframes]]
	- [[#Windows and Tabs]]
	- [[#Screenshots]]
- [[#Waiters and Synchronization]]
	- [[#Implicit Wait]]
	- [[#Explicit Wait Idea]]
	- [[#Common Expected Conditions]]
- [[#Common Selenium Errors]]
	- [[#`NoSuchElementException`]]
	- [[#`TimeoutException`]]
	- [[#`StaleElementReferenceException`]]
	- [[#`ElementClickInterceptedException`]]
	- [[#`NoSuchSessionException`]]
- [[#Page Object Model]]
- [[#Selenium Basics in AQA]]
- [[#Interview Questions]]
	- [[#Beginner Questions]]
	- [[#Intermediate Questions]]
	- [[#Advanced Questions]]
	- [[#Code Questions]]

**Related notes:** [[AQA Java eng]]

> [!caution] Not in the video course
> Zaur's courses end at Java Core — Selenium is not covered. This is the AQA layer: learn from this note + practice, and find video separately.

---

## Why Selenium Matters

Modern web applications are one of the main targets of test automation. To automate browser actions, Java AQA engineers often use **Selenium WebDriver**.

Selenium matters because it lets tests:

- open browser pages
- find elements
- click buttons and links
- enter text into fields
- verify page behavior

It is one of the core tools in UI automation with Java.

---

## What WebDriver Is

**WebDriver** is an API for controlling a browser programmatically.

In simple words, it acts like a remote control for Chrome, Firefox, Edge, and other browsers.

For remote and parallel browser execution, see [[25 Selenium Grid]].

### Main Idea

Your test talks to:

- `WebDriver` interface
- browser-specific driver
- real browser

Example:

```java
WebDriver driver = new ChromeDriver();
```

Here:

- `WebDriver` is the main interface
- `ChromeDriver` is a concrete implementation for Chrome

### Common Browser Drivers

- `ChromeDriver`
- `FirefoxDriver`
- `EdgeDriver`

> [!tip] Core Rule
> In code, prefer the `WebDriver` interface on the left side and the concrete driver on the right side: `WebDriver driver = new ChromeDriver();`

---

## Selenium API Overview

Selenium API is the set of classes and methods used to control the browser.

The most important parts are:

| API part | Purpose |
|---|---|
| `WebDriver` | controls browser session and navigation |
| `WebElement` | represents one element on the page |
| `By` | describes how to find an element |
| `Actions` | performs advanced mouse and keyboard actions |
| `WebDriverWait` | waits until a condition becomes true |
| `ExpectedConditions` | common ready-made wait conditions |

**Goal:** know which object is responsible for which browser action.

---

## Browser Initialization and Navigation

`WebDriver` manages the browser session, opens pages, finds elements, and switches between browser contexts.

### WebDriver Methods

| Method | Returns | Purpose | Example |
|---|---|---|---|
| `get(String url)` | `void` | Opens a URL in the current window | `driver.get("https://example.com")` |
| `getCurrentUrl()` | `String` | Returns the current page URL | `driver.getCurrentUrl()` |
| `getTitle()` | `String` | Returns the page title | `driver.getTitle()` |
| `getPageSource()` | `String` | Returns the current page source | `driver.getPageSource()` |
| `findElement(By by)` | `WebElement` | Returns the first matching element; throws `NoSuchElementException` if none is found | `driver.findElement(By.id("login"))` |
| `findElements(By by)` | `List<WebElement>` | Returns all matching elements; returns an empty list if none are found | `driver.findElements(By.cssSelector(".item"))` |
| `getWindowHandle()` | `String` | Returns the handle of the current window or tab | `driver.getWindowHandle()` |
| `getWindowHandles()` | `Set<String>` | Returns handles of all open windows and tabs | `driver.getWindowHandles()` |
| `navigate()` | `WebDriver.Navigation` | Gives access to browser history and page reload methods | `driver.navigate().refresh()` |
| `switchTo()` | `WebDriver.TargetLocator` | Gives access to frames, windows, alerts, and the active element | `driver.switchTo().frame("payment")` |
| `manage()` | `WebDriver.Options` | Gives access to cookies, timeouts, and window settings | `driver.manage().window().maximize()` |
| `close()` | `void` | Closes only the current window or tab | `driver.close()` |
| `quit()` | `void` | Closes all windows and ends the WebDriver session | `driver.quit()` |

Common commands returned by `navigate()`:

| Method | Purpose | Example |
|---|---|---|
| `to(String url)` | Opens a URL through the navigation API | `driver.navigate().to("https://example.com/login")` |
| `back()` | Goes to the previous page | `driver.navigate().back()` |
| `forward()` | Goes to the next page in browser history | `driver.navigate().forward()` |
| `refresh()` | Reloads the current page | `driver.navigate().refresh()` |

Example:

```java
WebDriver driver = new ChromeDriver();

try {
    driver.get("https://example.com");
    System.out.println(driver.getTitle());
    System.out.println(driver.getCurrentUrl());
} finally {
    driver.quit();
}
```

> [!warning] Always Close Driver
> If a test opens browser and does not call `quit()`, browser processes may stay running and create memory or environment problems.

---

## Locators

To work with an element, Selenium first needs to find it. This is done with a **locator**.

### Common Locator Types

- `By.id()`
- `By.name()`
- `By.className()`
- `By.tagName()`
- `By.linkText()`
- `By.cssSelector()`
- `By.xpath()`

Examples:

```java
WebElement loginInput = driver.findElement(By.id("login"));
WebElement passwordInput = driver.findElement(By.name("password"));
WebElement button = driver.findElement(By.cssSelector("button.submit"));
```

### `findElement()` vs `findElements()`

```java
WebElement one = driver.findElement(By.id("submit"));
List<WebElement> many = driver.findElements(By.cssSelector(".item"));
```

- `findElement()` returns one element and throws exception if not found
- `findElements()` returns a list and gives an empty list if nothing found

### Locator Priority

Usually a practical order is:

1. stable `id`
2. stable `name`
3. clean `cssSelector`
4. `xpath` if needed

> [!tip] Prefer Stable Locators
> The best locator is readable, stable, and tied to business meaning. Avoid brittle locators based only on deep layout structure.

---

## Working with Web Elements

Selenium represents page elements with the `WebElement` interface.

### WebElement Methods

| Method | Returns | Purpose | Example |
|---|---|---|---|
| `click()` | `void` | Clicks the element | `button.click()` |
| `submit()` | `void` | Submits the form that contains the element | `form.submit()` |
| `sendKeys(CharSequence... keys)` | `void` | Types text or keyboard keys into the element | `input.sendKeys("admin")` |
| `clear()` | `void` | Clears an editable field | `input.clear()` |
| `getText()` | `String` | Returns the visible text of the element | `message.getText()` |
| `getTagName()` | `String` | Returns the HTML tag name | `element.getTagName()` |
| `getAttribute(String name)` | `String` or `null` | Returns an attribute or property value using Selenium's convenience logic | `input.getAttribute("value")` |
| `getDomAttribute(String name)` | `String` or `null` | Returns the value of the HTML attribute | `input.getDomAttribute("required")` |
| `getDomProperty(String name)` | `String` or `null` | Returns the current DOM property value | `input.getDomProperty("value")` |
| `getCssValue(String name)` | `String` | Returns the computed CSS property value | `button.getCssValue("color")` |
| `isDisplayed()` | `boolean` | Checks whether the element is visible | `message.isDisplayed()` |
| `isEnabled()` | `boolean` | Checks whether the element is enabled | `button.isEnabled()` |
| `isSelected()` | `boolean` | Checks whether a checkbox, radio button, or option is selected | `checkbox.isSelected()` |
| `getLocation()` | `Point` | Returns the element's top-left position | `element.getLocation()` |
| `getSize()` | `Dimension` | Returns the element's width and height | `element.getSize()` |
| `getRect()` | `Rectangle` | Returns the element's position and size together | `element.getRect()` |
| `findElement(By by)` | `WebElement` | Finds the first matching descendant inside the element | `form.findElement(By.name("email"))` |
| `findElements(By by)` | `List<WebElement>` | Finds all matching descendants inside the element | `menu.findElements(By.tagName("a"))` |
| `getShadowRoot()` | `SearchContext` | Returns the element's open Shadow DOM root | `host.getShadowRoot()` |
| `getAccessibleName()` | `String` | Returns the computed accessible name | `button.getAccessibleName()` |
| `getAriaRole()` | `String` | Returns the computed ARIA role | `button.getAriaRole()` |
| `getScreenshotAs(OutputType<X> target)` | `X` | Takes a screenshot of only this element | `element.getScreenshotAs(OutputType.FILE)` |

> [!info] Attribute vs Property
> An HTML attribute is written in the markup, while a DOM property is the current JavaScript state. Use `getDomAttribute()` or `getDomProperty()` when you need an exact result. `getAttribute()` is a convenient method that may check both.

Example:

```java
WebElement input = driver.findElement(By.id("username"));
input.clear();
input.sendKeys("admin");

WebElement checkbox = driver.findElement(By.id("remember"));
if (!checkbox.isSelected()) {
    checkbox.click();
}

WebElement button = driver.findElement(By.id("loginBtn"));
if (button.isDisplayed() && button.isEnabled()) {
    button.click();
}
```

### Dropdown Basics

For classic HTML `<select>`, Selenium provides `Select`.

```java
Select country = new Select(driver.findElement(By.id("country")));

country.selectByVisibleText("Poland"); // pick by visible text
country.selectByValue("pl");           // pick by the option's value attribute
country.selectByIndex(0);              // pick by position (first option)

WebElement chosen = country.getFirstSelectedOption(); // currently selected option
List<WebElement> all = country.getOptions();          // every option in the list
```

> [!warning] Select Works Only on `<select>`
> The `Select` class works only with native HTML `<select>` tags. Custom
> dropdowns built from `<div>`/`<ul>` need normal `click()` interactions instead.

---

## Advanced Interactions

Beyond click and type, real pages need richer actions: hovering, dragging,
handling popups, switching frames and windows, taking screenshots.

### Actions (Mouse and Keyboard)

The `Actions` class builds a chain of mouse/keyboard steps. Call `perform()`
at the end to run them.

```java
Actions actions = new Actions(driver);

WebElement menu = driver.findElement(By.id("menu"));
actions.moveToElement(menu).perform();   // hover to reveal a submenu

WebElement row = driver.findElement(By.id("row"));
actions.doubleClick(row).perform();      // double-click
actions.contextClick(row).perform();     // right-click (context menu)

WebElement source = driver.findElement(By.id("drag"));
WebElement target = driver.findElement(By.id("drop"));
actions.dragAndDrop(source, target).perform(); // drag one element onto another
```

### Alerts (JavaScript Popups)

A browser alert is not a normal element — you switch to it first.

```java
Alert alert = driver.switchTo().alert();

System.out.println(alert.getText()); // read the message
alert.sendKeys("some text");         // type (only for prompt dialogs)
alert.accept();                      // press OK
// alert.dismiss();                  // press Cancel
```

### Frames and Iframes

Elements inside an `<iframe>` are invisible until you switch into the frame.

```java
driver.switchTo().frame("frameName"); // switch by name or id
// ... interact with elements inside the frame ...
driver.switchTo().defaultContent();   // switch back to the main page
```

### Windows and Tabs

When a click opens a new tab or window, switch by its handle.

```java
String original = driver.getWindowHandle();        // remember the current window

for (String handle : driver.getWindowHandles()) {  // all open windows
    if (!handle.equals(original)) {
        driver.switchTo().window(handle);          // switch to the new one
    }
}

driver.close();                      // close the new window
driver.switchTo().window(original);  // switch back to the first one
```

### Screenshots

Very common in AQA — capture the screen when a test fails.

```java
File shot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
Files.copy(shot.toPath(), Path.of("target/screenshots/login-fail.png"));
```

---

## Waiters and Synchronization

Web pages are dynamic. An element may not be ready immediately after page load or after a click.

This is why waiting is important.

### Problem Example

```java
driver.findElement(By.id("result")).click();
```

This may fail if the element appears a bit later.

### Implicit Wait

```java
driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
```

This tells Selenium to wait a bit when trying to find elements.

### Explicit Wait Idea

The better long-term approach is explicit wait, which waits for a specific condition.

```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement button = wait.until(
    ExpectedConditions.elementToBeClickable(By.id("submit"))
);
button.click();
```

### Common Expected Conditions

| Condition | Waits until |
|---|---|
| `presenceOfElementLocated(by)` | the element exists in the DOM |
| `visibilityOfElementLocated(by)` | the element exists **and** is visible |
| `elementToBeClickable(by)` | the element is visible and enabled |
| `invisibilityOfElementLocated(by)` | the element is gone or hidden |
| `textToBePresentInElementLocated(by, text)` | the element contains the text |
| `titleContains(text)` | the page title contains the text |
| `alertIsPresent()` | a JavaScript alert appears |

> [!info] Beginner Rule
> For serious automation, explicit waits are usually better than relying only on implicit wait or `Thread.sleep()`.

---

## Common Selenium Errors

### `NoSuchElementException`

Element was not found.

Typical reasons:

- wrong locator
- element not loaded yet
- wrong page

### `TimeoutException`

The expected condition was not met in time.

### `StaleElementReferenceException`

The page changed, and Selenium is trying to use an old element reference.

### `ElementClickInterceptedException`

Another element covers the target, or click happens too early.

### `NoSuchSessionException`

The browser session is already closed, but code still tries to use the driver.

> [!caution] Avoid `Thread.sleep()`
> Hard sleeps make tests slower and less stable. Prefer waits based on real conditions.

---

## Page Object Model

The **Page Object Model (POM)** is the most common way to organize Selenium
code. Each page becomes a class that holds its locators and actions. Tests then
call clear methods instead of repeating `findElement(...)` everywhere.

```java
// LoginPage.java — locators and actions for one page, no test logic inside
public class LoginPage {

    private final WebDriver driver;

    private final By usernameField = By.id("login");
    private final By passwordField = By.id("password");
    private final By submitButton  = By.cssSelector("button.submit");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
    }

    // a business action, named in the user's language
    public void login(String user, String password) {
        driver.findElement(usernameField).sendKeys(user);
        driver.findElement(passwordField).sendKeys(password);
        driver.findElement(submitButton).click();
    }
}
```

The test stays short and readable — page details are hidden behind `login(...)`:

```java
@Test
void userCanLogIn() {
    driver.get("https://example.com/login");

    LoginPage loginPage = new LoginPage(driver);
    loginPage.login("admin", "secret");

    assertTrue(driver.findElement(By.id("dashboard")).isDisplayed());
}
```

> [!tip] Why POM Helps
> If a locator changes, you fix it in **one** page class, not in every test.
> Tests describe *what* the user does; page objects describe *how* it is done.

---

## Selenium Basics in AQA

Selenium is often one layer inside a larger automation framework.

### Typical Structure

- JUnit or TestNG runs the tests
- Selenium controls browser
- Page Object Model organizes page logic
- Allure or logs provide reports

### Basic Test Example

```java
class LoginTest {

    private WebDriver driver;

    @BeforeEach
    void setUp() {
        driver = new ChromeDriver();
    }

    @AfterEach
    void tearDown() {
        driver.quit();
    }

    @Test
    void shouldOpenLoginPage() {
        driver.get("https://example.com/login");
        WebElement login = driver.findElement(By.id("login"));
        assertTrue(login.isDisplayed());
    }
}
```

### Good Practices

- keep locators readable
- close driver after tests
- avoid duplicated browser setup code
- use waits instead of hard sleeps
- separate test logic from page logic

> [!tip] Good Rule for Beginners
> First learn how to open page, find element, click, type text, and check result. Framework patterns come after that foundation.

---

## Interview Questions

### Beginner Questions

**1. What is Selenium WebDriver?**
It is a tool and API for automating browser actions.

**2. What is `WebDriver` in Selenium?**
It is the main interface used to control the browser.

**3. What are locators?**
Locators are ways to find elements on a page, for example `id`, `name`, `cssSelector`, or `xpath`.

**4. What does `driver.get()` do?**
It opens the given URL in the browser.

**5. What is `WebElement`?**
It is Selenium's interface for a page element.

**6. What exception is common when element is not found?**
`NoSuchElementException`.

### Intermediate Questions

**1. What is the difference between `findElement()` and `findElements()`?**
`findElement()` returns one element or throws exception if nothing is found. `findElements()` returns a list and gives an empty list if nothing is found.

**2. What is the difference between `close()` and `quit()`?**
`close()` closes the current window. `quit()` closes the whole browser session.

**3. Why do Selenium tests need waits?**
Because web elements may load or become clickable asynchronously.

**4. What is a common locator priority?**
Usually `id`, then `name`, then CSS, then XPath if needed.

### Advanced Questions

**1. Is Selenium enough for the whole automation framework?**
No. Selenium handles browser interaction, but tests usually also need a test framework, reports, configuration, and project structure.

**2. Why is XPath sometimes criticized?**
Because complex XPath locators can become hard to read and fragile when page structure changes. But XPath is still useful in some cases.

**3. Why can saving a `WebElement` too early be dangerous?**
Because DOM can change and later the stored reference becomes stale.

**4. Is implicit wait enough for all real projects?**
Usually no. Explicit waits are more precise and better for dynamic behavior.

**5. Why is browser setup often moved to `@BeforeEach` or base classes?**
To avoid duplication and keep tests cleaner and more maintainable.

### Code Questions

**1. No element matches the selector. What happens to `one` and `many`?**

```java
WebElement one = driver.findElement(By.id("submit"));
List<WebElement> many = driver.findElements(By.cssSelector(".missing"));
```

**Answer:** `findElement(By.id("submit"))` throws `NoSuchElementException` if no element matches. `findElements(By.cssSelector(".missing"))` does **not** throw — it returns an empty list when nothing matches.

**2. What exactly does this wait wait for, and what happens if it never becomes true?**

```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement button = wait.until(
    ExpectedConditions.elementToBeClickable(By.id("submit"))
);
button.click();
```

**Answer:** It waits until the `#submit` element is both **visible and enabled** (clickable), polling repeatedly, up to 10 seconds. If the condition is never met in time, it throws a `TimeoutException`.

**3. This code runs after a page refresh. What goes wrong?**

```java
WebElement el = driver.findElement(By.id("name"));
driver.navigate().refresh();
el.getText();
```

**Answer:** After `refresh()`, the DOM is rebuilt, so the old `el` reference is no longer valid. Calling `el.getText()` throws a `StaleElementReferenceException`. The element must be found again after navigation.
