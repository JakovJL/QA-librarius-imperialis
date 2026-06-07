# Selenium WebDriver Basics

## Table of Contents

- [[#Why Selenium Matters]]
- [[#What WebDriver Is]]
- [[#Browser Setup and Navigation]]
- [[#Locators]]
- [[#Working with Web Elements]]
- [[#Basic Wait Idea]]
- [[#Common Selenium Errors]]
- [[#Selenium Basics in AQA]]
- [[#Interview Questions]]

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

## Browser Setup and Navigation

### Open Browser

```java
WebDriver driver = new ChromeDriver();
```

### Open URL

```java
driver.get("https://example.com");
```

### Get Page Information

```java
System.out.println(driver.getTitle());
System.out.println(driver.getCurrentUrl());
```

### Close Browser

```java
driver.quit();
```

`quit()` closes the whole browser session and is usually the correct choice in tests.

### Basic Navigation

```java
driver.navigate().to("https://example.com/login");
driver.navigate().back();
driver.navigate().forward();
driver.navigate().refresh();
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

### Common Operations

```java
WebElement input = driver.findElement(By.id("username"));
input.sendKeys("admin");

WebElement button = driver.findElement(By.id("loginBtn"));
button.click();
```

### Read Information

```java
WebElement message = driver.findElement(By.id("message"));

System.out.println(message.getText());
System.out.println(message.isDisplayed());
System.out.println(message.isEnabled());
System.out.println(message.getAttribute("class"));
```

### Clear Input

```java
input.clear();
input.sendKeys("new value");
```

### Checkboxes and Radio Buttons

```java
WebElement checkbox = driver.findElement(By.id("remember"));
if (!checkbox.isSelected()) {
    checkbox.click();
}
```

### Dropdown Basics

For classic HTML `<select>`, Selenium provides `Select`.

```java
Select country = new Select(driver.findElement(By.id("country")));
country.selectByVisibleText("Poland");
```

---

## Basic Wait Idea

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

### Top 10

**1. What is Selenium WebDriver?**  
It is a tool and API for automating browser actions.

**2. What is `WebDriver` in Selenium?**  
It is the main interface used to control the browser.

**3. What is the difference between `findElement()` and `findElements()`?**  
`findElement()` returns one element or throws exception if nothing is found. `findElements()` returns a list and gives an empty list if nothing is found.

**4. What are locators?**  
Locators are ways to find elements on a page, for example `id`, `name`, `cssSelector`, or `xpath`.

**5. What does `driver.get()` do?**  
It opens the given URL in the browser.

**6. What is the difference between `close()` and `quit()`?**  
`close()` closes the current window. `quit()` closes the whole browser session.

**7. Why do Selenium tests need waits?**  
Because web elements may load or become clickable asynchronously.

**8. What is `WebElement`?**  
It is Selenium's interface for a page element.

**9. What is a common locator priority?**  
Usually `id`, then `name`, then CSS, then XPath if needed.

**10. What exception is common when element is not found?**  
`NoSuchElementException`.

---

### Tricky Questions

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
