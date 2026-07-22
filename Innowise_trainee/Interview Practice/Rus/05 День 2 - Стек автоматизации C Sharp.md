# День 2 — стек автоматизации C Sharp

## Содержание

- [[#Цель и результат дня]]
- [[#Расписание]]
- [[#Структура automation framework]]
- [[#xUnit]]
	- [[#Fact и Theory]]
	- [[#Setup и cleanup]]
- [[#FluentAssertions]]
- [[#RestSharp]]
- [[#Moq]]
- [[#Selenium]]
- [[#Практическое задание]]
- [[#Вопросы для самопроверки]]
- [[#Чек-лист дня]]
- [[#Источники]]

**Связанные заметки:** [[03 Подготовка к собеседованию по CV - Индекс]]

---

## Цель и результат дня

Цель — понять взаимодействие инструментов из CV и написать минимальные тесты на C#. К концу дня нужно уметь объяснить, почему каждый инструмент находится в framework и какую задачу решает.

---

## Расписание

| Время | Блок | Результат |
|---|---|---|
| 60 минут | xUnit и FluentAssertions | Параметризованный test с понятными assertions |
| 75 минут | RestSharp | API-test с проверкой status, body и business data |
| 60 минут | Moq | Изолированный test с `Setup` и `Verify` |
| 75 минут | Selenium | UI-test с Page Object и explicit wait |
| 45 минут | Архитектура framework | Схема layers и назначение папок |
| 30 минут | Ответы вслух | Не менее 15 вопросов |

---

## Структура automation framework

Минимальная структура может выглядеть так:

```text
Tests/
├── Ui/
├── Api/
├── Component/
Core/
├── Configuration/
├── Drivers/
├── Http/
├── Database/
Pages/
Clients/
Models/
Fixtures/
Utilities/
```

Ответственность layers:

- `Tests` содержит сценарий и assertions, но не низкоуровневую работу с WebDriver или HTTP.
- `Pages` скрывает locators и действия с UI.
- `Clients` скрывает endpoints и сборку requests.
- `Models` содержит request/response DTO.
- `Fixtures` управляет общими ресурсами и test data.
- `Configuration` читает URL и параметры environment.
- `Drivers` создаёт и завершает WebDriver.

> [!danger] Ключевое правило
> Test должен описывать поведение системы. Locators, HTTP serialization, connection strings и credentials не должны быть разбросаны по test methods.

---

## xUnit

**Definition** — xUnit является test framework для .NET. Он обнаруживает tests, управляет их запуском и предоставляет assertions и lifecycle mechanisms.

### Fact и Theory

- `[Fact]` — один test без входных наборов данных.
- `[Theory]` — параметризованный test.
- `[InlineData]` — простой набор аргументов для `Theory`.

```csharp
public class DiscountTests
{
    [Fact]
    public void Calculate_NoDiscount_ReturnsOriginalPrice()
    {
        var result = DiscountCalculator.Calculate(100m, 0);

        result.Should().Be(100m);
    }

    [Theory]
    [InlineData(100, 10, 90)]
    [InlineData(200, 25, 150)]
    public void Calculate_ValidDiscount_ReturnsExpectedAmount(
        decimal price,
        int percent,
        decimal expected)
    {
        var result = DiscountCalculator.Calculate(price, percent);

        result.Should().Be(expected);
    }
}
```

### Setup и cleanup

В xUnit constructor выполняется перед каждым test method. Для synchronous cleanup class может реализовать `IDisposable`; для asynchronous lifecycle используется `IAsyncLifetime`. Общие дорогие resources выносятся в fixtures.

```csharp
public sealed class ApiFixture : IDisposable
{
    public RestClient Client { get; } =
        new("https://api.example.test");

    public void Dispose()
    {
        Client.Dispose();
    }
}
```

Конкретные signatures `IAsyncLifetime` отличаются между xUnit v2 и v3. На интервью сначала уточни или назови используемую версию, если вопрос касается asynchronous lifecycle.

---

## FluentAssertions

**Definition** — FluentAssertions предоставляет читаемый chain-style синтаксис assertions.

```csharp
response.StatusCode.Should().Be(HttpStatusCode.OK);
response.Data.Should().NotBeNull();
response.Data!.Status.Should().Be("Paid");
response.Data.Items.Should().HaveCount(2);
response.Data.Total.Should().BeGreaterThan(0m);
```

Преимущества:

- assertions читаются как ожидаемое поведение;
- failure messages обычно содержат больше контекста;
- удобно проверять collections, objects, strings и exceptions.

Недостаток: длинная fluent chain может скрыть, какая именно бизнес-проверка важна. Не объединяй несвязанные ожидания в одну строку.

---

## RestSharp

**Definition** — RestSharp является HTTP client library для .NET. Он помогает собирать requests, добавлять headers, path/query parameters и body, а также десериализовать responses.

```csharp
public record OrderDto(int Id, string Status, decimal Total);

public class OrderApiTests
{
    private readonly RestClient _client =
        new("https://api.example.test");

    [Fact]
    public async Task GetOrder_ExistingId_ReturnsOrder()
    {
        var request = new RestRequest("/orders/{id}")
            .AddUrlSegment("id", 123);

        var response = await _client.ExecuteGetAsync<OrderDto>(request);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Data.Should().NotBeNull();
        response.Data!.Id.Should().Be(123);
        response.Data.Status.Should().BeOneOf("Created", "Paid", "Shipped");
    }
}
```

Проверять нужно не только HTTP status:

- response headers;
- schema и обязательные fields;
- business values;
- database side effects;
- authorization;
- error body;
- response time в пределах требования.

`Execute...Async` возвращает `RestResponse` и позволяет проверить неуспешный HTTP response. Некоторые сокращённые методы могут выбрасывать exception при unsuccessful response, поэтому необходимо понимать выбранный API.

---

## Moq

**Definition** — Moq создаёт test doubles для interfaces или подходящих class members. Он позволяет настроить поведение dependency и проверить взаимодействие с ней.

```csharp
public interface IMessageProducer
{
    Task SendAsync(OrderCreated message);
}

public record OrderCreated(int OrderId);

public class OrderServiceTests
{
    [Fact]
    public async Task CreateOrder_ValidRequest_PublishesEvent()
    {
        var producer = new Mock<IMessageProducer>();
        producer
            .Setup(x => x.SendAsync(It.IsAny<OrderCreated>()))
            .Returns(Task.CompletedTask);

        var service = new OrderService(producer.Object);

        await service.CreateAsync(orderId: 123);

        producer.Verify(
            x => x.SendAsync(
                It.Is<OrderCreated>(message => message.OrderId == 123)),
            Times.Once);
    }
}
```

Ключевые понятия:

- `Setup` задаёт поведение dependency;
- `Returns` или `ReturnsAsync` задаёт результат;
- `It.IsAny<T>` принимает любой аргумент нужного типа;
- `It.Is<T>` проверяет условие для аргумента;
- `Verify` проверяет вызов;
- `Times.Once` задаёт ожидаемое количество вызовов.

> [!caution] Moq и message broker
> Такой test не проверяет настоящий Kafka/RabbitMQ, network, serialization или delivery. Он проверяет, что application code правильно вызывает абстракцию producer. Для настоящего broker нужен integration или component test с реальным container/service.

---

## Selenium

**Definition** — Selenium WebDriver управляет браузером через driver protocol. В framework locators и действия обычно инкапсулируются в Page Object или Component Object.

```csharp
public class CheckoutPage
{
    private readonly IWebDriver _driver;
    private readonly WebDriverWait _wait;

    public CheckoutPage(IWebDriver driver)
    {
        _driver = driver;
        _wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
    }

    private IWebElement SubmitButton =>
        _driver.FindElement(By.CssSelector("[data-testid='submit-order']"));

    public void SubmitOrder()
    {
        _wait.Until(_ => SubmitButton.Enabled);
        SubmitButton.Click();
    }
}
```

На интервью нужно объяснить:

- почему stable attributes лучше сложных XPath;
- чем implicit wait отличается от explicit wait;
- почему `Thread.Sleep` создаёт медленные и flaky tests;
- что вызывает `StaleElementReferenceException`;
- почему assertions обычно остаются в test layer;
- как закрывать browser даже после падения test.

→ см. [[17 Основы Selenium WebDriver]] и [[14 Waiters]].

---

## Практическое задание

Создай мысленный mini-framework для Orders API:

1. `OrderDto` — response model.
2. `OrdersClient` — методы `GetOrderAsync` и `CreateOrderAsync`.
3. `OrderApiTests` — positive и negative tests.
4. `OrderServiceTests` — Moq для `IMessageProducer`.
5. `CheckoutPage` — Page Object для кнопки оформления.

**Обязательно:** объясни, что проверяет каждый test level и какие dependencies остаются реальными.

---

## Вопросы для самопроверки

1. Чем `[Fact]` отличается от `[Theory]`?
2. Когда использовать fixture?
3. Почему test data нельзя хранить внутри Page Object?
4. Чем RestSharp отличается от Postman?
5. Что находится в `RestResponse<T>`?
6. Почему status code 200 ещё не доказывает корректность API?
7. Чем state assertion отличается от interaction verification?
8. Что именно проверяет `Verify` в Moq?
9. Почему mock broker не заменяет integration test?
10. Где должны находиться locators?
11. Что вызывает flaky UI tests?
12. Где хранить base URL и credentials?
13. Как запускать UI- и API-tests для разных environments?
14. Нужно ли создавать новый browser для каждого test?
15. Как очищать test data после выполнения?

---

## Чек-лист дня

- [ ] Написан один `[Fact]`
- [ ] Написан один `[Theory]`
- [ ] Использованы FluentAssertions
- [ ] Написан RestSharp API-test
- [ ] Написан Moq test с `Setup` и `Verify`
- [ ] Создан простой Page Object
- [ ] Понятна разница между mock и реальным integration
- [ ] Нарисована структура automation framework
- [ ] На 15 вопросов даны ответы вслух

---

## Источники

- [Getting started with xUnit](https://xunit.net/docs/getting-started/v3/getting-started)
- [RestSharp quick start](https://restsharp.dev/docs/intro/)
- [Executing RestSharp requests](https://restsharp.dev/docs/v111/usage/execute/)
- [Moq repository and quick examples](https://github.com/devlooped/moq)
- [FluentAssertions introduction](https://fluentassertions.com/introduction)
- [[17 Основы Selenium WebDriver]]
