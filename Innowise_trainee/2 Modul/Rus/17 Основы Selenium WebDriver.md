# Основы Selenium WebDriver

## Содержание

- [[#Зачем нужен Selenium WebDriver]]
- [[#Архитектура WebDriver]]
- [[#Настройка проекта]]
- [[#Основные команды]]
- [[#Локаторы элементов]]
- [[#Работа с элементами]]
- [[#Типичные ошибки]]
- [[#Selenium в AQA]]
- [[#Вопросы для собеседования]]

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

## Основные команды

| Команда | Описание |
|---|---|
| `driver.get(url)` | Открывает страницу |
| `driver.getTitle()` | Возвращает заголовок страницы |
| `driver.getCurrentUrl()` | Возвращает текущий URL |
| `driver.findElement(locator)` | Находит элемент |
| `driver.findElements(locator)` | Находит несколько элементов |
| `driver.quit()` | Закрывает браузер и завершает сессию |
| `driver.close()` | Закрывает текущее окно |

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

Основные действия с элементами:

```java
WebElement button = driver.findElement(By.id("submit"));
button.click(); // клик

WebElement input = driver.findElement(By.name("username"));
input.sendKeys("testuser"); // ввод текста

String text = element.getText(); // получение текста
boolean displayed = element.isDisplayed(); // проверка видимости
```

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

### Топ-10

**1. Что такое Selenium WebDriver?**
Инструмент для автоматизации браузеров, позволяющий взаимодействовать с веб-страницами программно.

**2. Какие браузеры поддерживает WebDriver?**
Chrome, Firefox, Edge, Safari, Opera.

**3. В чём разница между driver.close() и driver.quit()?**
`close()` закрывает текущее окно, `quit()` закрывает все окна и завершает сессию.

**4. Какие локаторы ты знаешь?**
`id`, `name`, `className`, `tagName`, `linkText`, `partialLinkText`, `cssSelector`, `xpath`.

**5. Как найти несколько элементов?**
Использовать `driver.findElements(locator)` — возвращает список элементов.

**6. Какие исключения в Selenium ты знаешь?**
`NoSuchElementException`, `ElementNotInteractableException`, `TimeoutException`, `StaleElementReferenceException`.

**7. Зачем нужен WebDriverWait?**
Для ожидания появления элемента или выполнения условия на странице.

**8. Как ввести текст в поле?**
Найти элемент и вызвать `sendKeys("text")`.

**9. Как проверить, что элемент отображается?**
Использовать `element.isDisplayed()`.

**10. Как получить текст элемента?**
Использовать `element.getText()`.

---

### Хитрые вопросы

**1. Как работать с фреймами?**
Сначала переключиться на фрейм с помощью `driver.switchTo().frame()`, затем взаимодействовать с элементами внутри фрейма.

**2. Как обработать всплывающее окно (alert)?**
Использовать `driver.switchTo().alert()` для работы с алертами.

**3. В чём разница между findElement и findElements?**
`findElement` возвращает первый найденный элемент или выбрасывает исключение, `findElements` возвращает список (пустой, если ничего не найдено).

**4. Как сделать скриншот страницы?**
Использовать `TakesScreenshot` интерфейс: `((TakesScreenshot)driver).getScreenshotAs(OutputType.FILE)`.

**5. Как работать с несколькими окнами?**
Использовать `driver.getWindowHandles()` для получения списка окон и `driver.switchTo().window(handle)` для переключения.