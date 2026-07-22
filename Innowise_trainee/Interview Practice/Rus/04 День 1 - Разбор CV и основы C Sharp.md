# День 1 — разбор CV и основы C Sharp

## Содержание

- [[#Цель и результат дня]]
- [[#Расписание]]
- [[#Карта CV]]
	- [[#Факты из документа]]
	- [[#Самые рискованные утверждения]]
- [[#Самопрезентация]]
- [[#Как рассказывать о проекте]]
- [[#Мост Java → C Sharp]]
	- [[#Классы и свойства]]
	- [[#Интерфейсы]]
	- [[#Collections и LINQ]]
	- [[#Async и await]]
- [[#Практика]]
- [[#Вопросы для самопроверки]]
- [[#Чек-лист дня]]
- [[#Источники]]

**Связанные заметки:** [[03 Подготовка к собеседованию по CV - Индекс]]

---

## Цель и результат дня

Цель — понять каждое утверждение CV и научиться объяснять перенос знаний из Java в C#. К концу дня должна быть готова самопрезентация и две простые схемы проектов.

> [!warning] Что нельзя восстанавливать по CV
> В документе нет состава команды, Scrum-процессов, количества автотестов, test coverage, частоты релизов и конкретных найденных дефектов. Эти сведения нельзя добавлять как факты.

---

## Расписание

| Время | Блок | Результат |
|---|---|---|
| 45 минут | Разбор CV | Все термины разделены на знакомые и незнакомые |
| 45 минут | Самопрезентация | Запись ответа на 60–90 секунд |
| 90 минут | Java → C# | Понимание основных различий синтаксиса |
| 45 минут | Карты проектов | Две схемы на одном листе |
| 30 минут | Ответы вслух | Не менее десяти коротких ответов |

---

## Карта CV

### Факты из документа

| Область | Заявлено в CV |
|---|---|
| Опыт | Около двух лет AQA |
| Основной стек | C#, .NET, xUnit, Selenium, RestSharp |
| Backend testing | REST API, SOAP, PostgreSQL, MongoDB |
| Message brokers | Kafka, RabbitMQ |
| Cache | Redis, Hazelcast |
| Infrastructure | Docker, Docker Compose, Kubernetes |
| CI/CD | GitLab CI/CD, Jenkins |
| Проект 1 | Финансовая аналитическая система, с октября 2025 года |
| Проект 2 | Интернет-магазин, июнь 2024 — октябрь 2025 года |

### Самые рискованные утверждения

Необходимо подготовить техническое объяснение следующих пунктов:

- архитектура UI automation framework на C#;
- API automation через RestSharp;
- component tests с xUnit и Moq;
- проверка Kafka и RabbitMQ;
- проверка cache invalidation;
- запуск тестов в GitLab CI/CD и Jenkins;
- локальное окружение в Docker;
- взаимодействие UI, API, database и message broker.

Если практического опыта по пункту нет, корректный ответ состоит из двух частей: сначала честно обозначить уровень опыта, затем объяснить, как ты решил бы задачу технически.

---

## Самопрезентация

Используй структуру, а не заученный текст:

1. Текущая специализация.
2. Сильные стороны в QA.
3. Практический стек.
4. Что изучаешь сейчас.
5. Почему интересна вакансия.

Безопасный вариант при расхождении CV и реального опыта:

> Меня зовут Яков. Я развиваюсь в направлении QA Automation. У меня есть база Manual QA, API, SQL, Selenium и проектирования автотестов. Мой основной практический язык — Java. Сейчас я переношу эти знания на C#/.NET: изучаю xUnit, RestSharp, FluentAssertions и Moq. Я понимаю архитектуру заявленных систем и могу спроектировать для них проверки, но не хочу выдавать изученные сценарии за production-опыт.

> [!caution] Типичная ошибка
> Не перечисляй весь стек одним длинным предложением. Интервьюер выберет самое слабое слово и сразу попросит пример.

---

## Как рассказывать о проекте

Используй пять шагов:

1. **Контекст:** какую бизнес-задачу решает продукт.
2. **Пользователь:** кто работает с системой.
3. **Поток данных:** откуда приходит запрос и куда сохраняется результат.
4. **QA scope:** какие уровни системы нужно проверять.
5. **Граница знания:** что является фактом, а что техническим предположением.

Пример формулировки:

> По описанию CV это финансовая платформа, которая собирает данные из нескольких источников и показывает отчётность в веб-портале. Вероятный поток выглядит как Kafka → .NET services → PostgreSQL или MongoDB → Redis → REST API → UI. Точная внутренняя декомпозиция сервисов в CV не указана. Для E2E-проверки я бы сопоставил исходное событие, записи в database, ответ API и итоговые значения в UI.

---

## Мост Java → C Sharp

| Java | C# | Что запомнить |
|---|---|---|
| `String` | `string` | `string` — alias для `System.String` |
| getter/setter | property | Обычно используется `{ get; set; }` |
| `ArrayList<T>` | `List<T>` | Основная изменяемая коллекция |
| `HashMap<K,V>` | `Dictionary<TKey,TValue>` | Хранение key-value |
| Stream API | LINQ | `Where`, `Select`, `Any`, `FirstOrDefault` |
| `CompletableFuture` | `Task` / `Task<T>` | Асинхронная операция |
| `@Test` | `[Fact]` | Обычный xUnit test |
| parameterized test | `[Theory]` | xUnit test с наборами данных |
| `try-with-resources` | `using` | Освобождение ресурсов через `IDisposable` |
| package | namespace | Логическая группировка типов |

### Классы и свойства

**Definition** — property предоставляет контролируемый доступ к данным объекта. Это близко к getter/setter в Java, но является частью синтаксиса C#.

```csharp
public class Order
{
    public int Id { get; init; }
    public required string Status { get; set; }
    public decimal TotalAmount { get; set; }
}

var order = new Order
{
    Id = 123,
    Status = "Created",
    TotalAmount = 99.90m
};
```

Для денег используется `decimal`, а суффикс `m` обозначает decimal literal. `init` позволяет задать значение при создании объекта, но не менять его позднее обычным присваиванием.

### Интерфейсы

**Definition** — interface задаёт contract. По соглашению его имя начинается с `I`.

```csharp
public interface IMessageProducer
{
    Task SendAsync(Order order);
}

public class OrderService
{
    private readonly IMessageProducer _producer;

    public OrderService(IMessageProducer producer)
    {
        _producer = producer;
    }
}
```

Интерфейс позволяет подменить реальный producer через Moq. Так проверяется логика `OrderService` без настоящего Kafka или RabbitMQ.

### Collections и LINQ

**Definition** — LINQ предоставляет операции запроса и преобразования collections.

```csharp
var paidOrders = orders
    .Where(order => order.Status == "Paid")
    .OrderBy(order => order.Id)
    .Select(order => order.Id)
    .ToList();
```

Нужно знать минимум:

- `Where` — фильтрация;
- `Select` — преобразование;
- `Any` — существует ли элемент;
- `All` — соответствуют ли все элементы условию;
- `FirstOrDefault` — первый элемент или default value;
- `OrderBy` — сортировка;
- `ToList` — выполнение запроса и создание списка.

### Async и await

**Definition** — `Task` представляет асинхронную операцию, а `await` ожидает её без синхронной блокировки текущего потока.

```csharp
public async Task<Order?> GetOrderAsync(int id)
{
    return await _apiClient.GetOrderAsync(id);
}
```

Ключевые правила:

- метод с `await` обычно помечается `async`;
- метод без результата возвращает `Task`;
- метод с результатом возвращает `Task<T>`;
- в тестах следует использовать `await`, а не `.Result` или `.Wait()`;
- `Thread.Sleep` не заменяет ожидание условия.

---

## Практика

1. Выпиши все технологии из CV и поставь рядом оценку от 0 до 3.
2. Нарисуй по памяти две архитектурные схемы.
3. Перепиши один простой Java DTO как C# class с properties.
4. Отфильтруй список заказов через LINQ.
5. Запиши самопрезентацию дважды и сократи её до 90 секунд.

**Обязательно:** объясни вслух, почему `decimal` подходит для денег лучше, чем `double`.

---

## Вопросы для самопроверки

1. Чем C# property отличается от public field?
2. Что возвращают `Task` и `Task<T>`?
3. Почему `.Result` может быть проблемой?
4. Что делают `Where` и `Select`?
5. Чем `List<T>` отличается от `Dictionary<TKey,TValue>`?
6. Зачем вводить `IMessageProducer`, если уже есть Kafka client?
7. Какие сведения о проектах действительно присутствуют в CV?
8. Какие сведения являются только реконструкцией?
9. Как ты объяснишь расхождение между Java и C# в CV?
10. Как выглядит E2E-проверка через UI, API и database?

---

## Чек-лист дня

- [ ] Подготовлена самопрезентация на 60–90 секунд
- [ ] Все технологии CV оценены по уровню знания
- [ ] Нарисованы две схемы проектов
- [ ] Написан C# class с properties
- [ ] Выполнен один LINQ-запрос
- [ ] Понятна разница между `Task` и `Task<T>`
- [ ] Подготовлено честное объяснение границ опыта
- [ ] На вопросы для самопроверки даны ответы вслух

---

## Источники

- [Classes in C#](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/classes)
- [Properties in C#](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/properties)
- [Interfaces in C#](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/interfaces)
- [LINQ](https://learn.microsoft.com/en-us/dotnet/csharp/linq/)
- [Asynchronous programming with async and await](https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/)
