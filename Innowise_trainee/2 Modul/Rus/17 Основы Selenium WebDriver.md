# Основы Selenium WebDriver

## Содержание

- [[#Зачем нужен Selenium WebDriver]]
- [[#Архитектура WebDriver]]
- [[#Selenium API]]
- [[#Настройка проекта]]
- [[#Инициализация браузера и навигация]]
	- [[#Методы WebDriver]]
- [[#Локаторы элементов]]
- [[#Работа с элементами]]
	- [[#Методы WebElement]]
- [[#Ожидания Waiters]]
- [[#Типичные ошибки]]
- [[#Selenium в AQA]]
- [[#Вопросы для собеседования]]
	- [[#Вопросы начального уровня]]
	- [[#Вопросы среднего уровня]]
	- [[#Вопросы повышенного уровня]]
	- [[#Вопросы с кодом]]

**Связанные заметки:** [[AQA Java rus]]

> [!caution] Нет в видео-курсе
> Курсы Заура заканчиваются на Java Core — Selenium не разбирается. Это AQA-надстройка: учись по заметке и практике, видео ищи отдельно.

---

## Зачем нужен Selenium WebDriver

Selenium WebDriver — это инструмент для автоматизации браузеров. Он позволяет:

- Открывать веб-страницы
- Взаимодействовать с элементами (клики, ввод текста)
- Проверять состояние страницы
- Автоматизировать тесты

WebDriver поддерживает все основные браузеры: Chrome, Firefox, Edge, Safari.

---

## Архитектура WebDriver

WebDriver работает по модели клиент-сервер:

1. **Клиент** — ваш код на Java
2. **WebDriver API** — команды для браузера
3. **Driver** — специфичная для браузера реализация
4. **Браузер** — выполняет действия

Пример: `ChromeDriver` — это драйвер для браузера Chrome.

Удалённый и параллельный запуск браузеров рассматривается в [[25 Selenium Grid]].

---

## Selenium API

Selenium API — это набор classes и methods для управления browser.

Самые важные части:

| Часть API | Назначение |
|---|---|
| `WebDriver` | управляет browser session и navigation |
| `WebElement` | представляет один element на странице |
| `By` | описывает, как найти element |
| `Actions` | выполняет сложные mouse и keyboard actions |
| `WebDriverWait` | ждёт, пока condition станет true |
| `ExpectedConditions` | готовые wait conditions |

**Цель:** понимать, какой object отвечает за какое действие в browser.

---

## Настройка проекта

Минимальные зависимости для Maven:

```xml
<dependency>
    <groupId>org.seleniumhq.selenium</groupId>
    <artifactId>selenium-java</artifactId>
    <version>4.1.2</version>
</dependency>
```

Пример простого теста:

```java
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class FirstTest {
    public static void main(String[] args) {
        WebDriver driver = new ChromeDriver();
        driver.get("https://example.com");
        System.out.println(driver.getTitle());
        driver.quit();
    }
}
```

---

## Инициализация браузера и навигация

`WebDriver` управляет сессией браузера, открывает страницы, находит элементы и переключается между контекстами браузера.

### Методы WebDriver

| Метод | Возвращает | Назначение | Пример |
|---|---|---|---|
| `get(String url)` | `void` | Открывает URL в текущем окне | `driver.get("https://example.com")` |
| `getCurrentUrl()` | `String` | Возвращает URL текущей страницы | `driver.getCurrentUrl()` |
| `getTitle()` | `String` | Возвращает заголовок страницы | `driver.getTitle()` |
| `getPageSource()` | `String` | Возвращает исходный код текущей страницы | `driver.getPageSource()` |
| `findElement(By by)` | `WebElement` | Возвращает первый подходящий элемент; бросает `NoSuchElementException`, если элемент не найден | `driver.findElement(By.id("login"))` |
| `findElements(By by)` | `List<WebElement>` | Возвращает все подходящие элементы; возвращает пустой список, если ничего не найдено | `driver.findElements(By.cssSelector(".item"))` |
| `getWindowHandle()` | `String` | Возвращает идентификатор текущего окна или вкладки | `driver.getWindowHandle()` |
| `getWindowHandles()` | `Set<String>` | Возвращает идентификаторы всех открытых окон и вкладок | `driver.getWindowHandles()` |
| `navigate()` | `WebDriver.Navigation` | Даёт доступ к истории браузера и перезагрузке страницы | `driver.navigate().refresh()` |
| `switchTo()` | `WebDriver.TargetLocator` | Даёт доступ к фреймам, окнам, `Alert` и активному элементу | `driver.switchTo().frame("payment")` |
| `manage()` | `WebDriver.Options` | Даёт доступ к файлам cookie, тайм-аутам и настройкам окна | `driver.manage().window().maximize()` |
| `close()` | `void` | Закрывает только текущее окно или вкладку | `driver.close()` |
| `quit()` | `void` | Закрывает все окна и завершает WebDriver session | `driver.quit()` |

Основные команды, которые возвращает `navigate()`:

| Метод | Назначение | Пример |
|---|---|---|
| `to(String url)` | Открывает URL через `Navigation API` | `driver.navigate().to("https://example.com/login")` |
| `back()` | Возвращает на предыдущую страницу | `driver.navigate().back()` |
| `forward()` | Переходит на следующую страницу в истории браузера | `driver.navigate().forward()` |
| `refresh()` | Перезагружает текущую страницу | `driver.navigate().refresh()` |

Пример:

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

> [!warning] Всегда закрывай WebDriver
> Если тест открывает браузер, но не вызывает `quit()`, процессы браузера могут продолжить работу и занимать ресурсы.

---

## Локаторы элементов

Локаторы нужны, чтобы находить элементы на странице:

| Тип локатора | Пример |
|---|---|
| `By.id` | `By.id("username")` |
| `By.name` | `By.name("email")` |
| `By.className` | `By.className("btn")` |
| `By.tagName` | `By.tagName("input")` |
| `By.linkText` | `By.linkText("Click here")` |
| `By.partialLinkText` | `By.partialLinkText("Click")` |
| `By.cssSelector` | `By.cssSelector("input[type='submit']")` |
| `By.xpath` | `By.xpath("//input[@name='q']")` |

Пример использования:

```java
WebElement element = driver.findElement(By.id("login"));
element.click();
```

---

## Работа с элементами

Selenium представляет элемент страницы через интерфейс `WebElement`.

### Методы WebElement

| Метод | Возвращает | Назначение | Пример |
|---|---|---|---|
| `click()` | `void` | Нажимает на элемент | `button.click()` |
| `submit()` | `void` | Отправляет форму, в которой находится элемент | `form.submit()` |
| `sendKeys(CharSequence... keys)` | `void` | Вводит текст или клавиши в элемент | `input.sendKeys("admin")` |
| `clear()` | `void` | Очищает редактируемое поле | `input.clear()` |
| `getText()` | `String` | Возвращает видимый текст элемента | `message.getText()` |
| `getTagName()` | `String` | Возвращает имя HTML-тега | `element.getTagName()` |
| `getAttribute(String name)` | `String` или `null` | Возвращает значение HTML-атрибута или DOM-свойства по правилам Selenium | `input.getAttribute("value")` |
| `getDomAttribute(String name)` | `String` или `null` | Возвращает значение HTML-атрибута | `input.getDomAttribute("required")` |
| `getDomProperty(String name)` | `String` или `null` | Возвращает текущее значение DOM-свойства | `input.getDomProperty("value")` |
| `getCssValue(String name)` | `String` | Возвращает вычисленное значение CSS-свойства | `button.getCssValue("color")` |
| `isDisplayed()` | `boolean` | Проверяет, виден ли элемент | `message.isDisplayed()` |
| `isEnabled()` | `boolean` | Проверяет, доступен ли элемент | `button.isEnabled()` |
| `isSelected()` | `boolean` | Проверяет, выбран ли checkbox, radio button или option | `checkbox.isSelected()` |
| `getLocation()` | `Point` | Возвращает координаты левого верхнего угла элемента | `element.getLocation()` |
| `getSize()` | `Dimension` | Возвращает ширину и высоту элемента | `element.getSize()` |
| `getRect()` | `Rectangle` | Возвращает координаты и размер элемента вместе | `element.getRect()` |
| `findElement(By by)` | `WebElement` | Находит первый подходящий дочерний элемент внутри текущего элемента | `form.findElement(By.name("email"))` |
| `findElements(By by)` | `List<WebElement>` | Находит все подходящие дочерние элементы внутри текущего элемента | `menu.findElements(By.tagName("a"))` |
| `getShadowRoot()` | `SearchContext` | Возвращает открытый корень Shadow DOM элемента | `host.getShadowRoot()` |
| `getAccessibleName()` | `String` | Возвращает вычисленное доступное имя элемента | `button.getAccessibleName()` |
| `getAriaRole()` | `String` | Возвращает вычисленную ARIA role | `button.getAriaRole()` |
| `getScreenshotAs(OutputType<X> target)` | `X` | Создаёт снимок экрана только этого элемента | `element.getScreenshotAs(OutputType.FILE)` |

> [!info] HTML-атрибут и DOM-свойство
> HTML-атрибут записан в разметке, а DOM-свойство показывает текущее состояние в JavaScript. Используй `getDomAttribute()` или `getDomProperty()`, когда нужен точный результат. `getAttribute()` — удобный метод, который может проверять оба варианта.

Пример:

```java
WebElement input = driver.findElement(By.name("username"));
input.clear();
input.sendKeys("testuser");

WebElement checkbox = driver.findElement(By.id("remember"));
if (!checkbox.isSelected()) {
    checkbox.click();
}

WebElement button = driver.findElement(By.id("submit"));
if (button.isDisplayed() && button.isEnabled()) {
    button.click();
}
```

---

## Ожидания Waiters

Многие страницы загружают данные асинхронно. Если Selenium ищет element слишком рано, test падает.

Основные виды ожиданий:

| Вид | Описание |
|---|---|
| Implicit wait | общий timeout для поиска elements |
| Explicit wait | ожидание конкретного condition |
| Fluent wait | explicit wait с настройкой polling и ignored exceptions |

Пример explicit wait:

```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement button = wait.until(ExpectedConditions.elementToBeClickable(By.id("save")));
button.click();
```

> [!caution] Не смешивай waits без причины
> Обычно explicit waits проще контролировать и debug, чем fixed sleeps или неявные ожидания везде.

---

## Типичные ошибки

| Ошибка | Причина |
|---|---|
| `NoSuchElementException` | Элемент не найден на странице |
| `ElementNotInteractableException` | Элемент невидим или недоступен для взаимодействия |
| `TimeoutException` | Действие не выполнено за отведённое время |
| `StaleElementReferenceException` | Элемент устарел (страница обновилась) |

---

## Selenium в AQA

В автотестировании Selenium используется для:

- Тестирования UI
- Проверки функциональности
- Автоматизации регрессионных тестов

Пример теста для страницы логина:

```java
@Test
public void testLogin() {
    driver.get("https://example.com/login");
    driver.findElement(By.id("username")).sendKeys("user");
    driver.findElement(By.id("password")).sendKeys("pass");
    driver.findElement(By.id("submit")).click();
    assertTrue(driver.getCurrentUrl().contains("dashboard"));
}
```

---

## Вопросы для собеседования

### Вопросы начального уровня

**1. Что такое Selenium WebDriver?**
Это инструмент и API для автоматизации действий в браузере.

**2. Что такое `WebDriver` в Selenium?**
Это основной интерфейс для управления браузером.

**3. Что такое локаторы?**
Локаторы — способы находить элементы на странице, например `id`, `name`, `cssSelector` или `xpath`.

**4. Что делает `driver.get()`?**
Открывает указанный URL в браузере.

**5. Что такое `WebElement`?**
Это интерфейс Selenium для элемента страницы.

**6. Какое исключение часто возникает, когда элемент не найден?**
`NoSuchElementException`.

---

### Вопросы среднего уровня

**1. В чём разница между `findElement()` и `findElements()`?**
`findElement()` возвращает один элемент или бросает исключение, если ничего не найдено. `findElements()` возвращает список и даёт пустой список, если ничего не найдено.

**2. В чём разница между `close()` и `quit()`?**
`close()` закрывает текущее окно. `quit()` закрывает всю сессию браузера.

**3. Почему Selenium-тестам нужны waits?**
Потому что веб-элементы могут загружаться или становиться кликабельными асинхронно.

**4. Какой обычно приоритет локаторов?**
Обычно `id`, затем `name`, затем CSS, затем XPath при необходимости.

---

### Вопросы повышенного уровня

**1. Достаточно ли Selenium для всего automation-фреймворка?**
Нет. Selenium отвечает за взаимодействие с браузером, но тестам обычно также нужны тестовый фреймворк, отчёты, конфигурация и структура проекта.

**2. Почему XPath иногда критикуют?**
Потому что сложные XPath-локаторы могут стать трудночитаемыми и хрупкими при изменении структуры страницы. Но XPath всё равно полезен в некоторых случаях.

**3. Почему сохранять `WebElement` слишком рано может быть опасно?**
Потому что DOM может измениться, и позже сохранённая ссылка станет устаревшей (stale).

**4. Хватит ли implicit wait для всех реальных проектов?**
Обычно нет. Explicit waits точнее и лучше подходят для динамического поведения.

**5. Почему setup браузера часто выносят в `@BeforeEach` или базовые классы?**
Чтобы избежать дублирования и сделать тесты чище и проще в поддержке.

---

### Вопросы с кодом

**1. Ни один элемент не подходит под селектор. Что произойдёт с `one` и `many`?**

```java
WebElement one = driver.findElement(By.id("submit"));
List<WebElement> many = driver.findElements(By.cssSelector(".missing"));
```

**Ответ:** `findElement(By.id("submit"))` бросает `NoSuchElementException`, если ни один элемент не подходит. `findElements(By.cssSelector(".missing"))` **не** бросает исключение — если ничего не найдено, он возвращает пустой список.

**2. Что именно ждёт это ожидание и что будет, если условие так и не станет true?**

```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement button = wait.until(
    ExpectedConditions.elementToBeClickable(By.id("submit"))
);
button.click();
```

**Ответ:** Оно ждёт, пока элемент `#submit` не станет одновременно **видимым и активным** (clickable), периодически опрашивая страницу, до 10 секунд. Если условие за это время не выполняется, бросается `TimeoutException`.

**3. Этот код выполняется после обновления страницы. Что пойдёт не так?**

```java
WebElement el = driver.findElement(By.id("name"));
driver.navigate().refresh();
el.getText();
```

**Ответ:** После `refresh()` DOM перестраивается, поэтому старая ссылка `el` больше недействительна. Вызов `el.getText()` бросает `StaleElementReferenceException`. Элемент нужно найти заново после навигации.
