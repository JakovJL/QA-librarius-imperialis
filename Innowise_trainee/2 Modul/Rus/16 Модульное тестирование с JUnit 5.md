# Модульное тестирование с JUnit 5

## Содержание

- [[#Почему модульное тестирование важно]]
- [[#Основы JUnit 5]]
- [[#Аннотации JUnit]]
- [[#Assertions]]
- [[#Жизненный цикл теста]]
- [[#Параметризованные тесты]]
- [[#JUnit 5 в AQA]]
- [[#Вопросы для собеседования]]

**Связанные заметки:** [[AQA Java rus]]

> [!caution] Нет в видео-курсе
> Курсы Заура заканчиваются на Java Core — JUnit 5 не разбирается. Это AQA-надстройка: учись по заметке и практике, видео ищи отдельно.

---

## Почему модульное тестирование важно

Модульные тесты проверяют отдельные части кода (методы, классы) изолированно. Они помогают:

- Ловить ошибки на ранних этапах
- Упрощать рефакторинг
- Документировать ожидаемое поведение
- Ускорять разработку за счёт быстрой обратной связи

В AQA модульные тесты используются для проверки утилит, парсеров, валидаторов и других вспомогательных классов.

---

## Основы JUnit 5

JUnit 5 — это современный фреймворк для модульного тестирования в Java. Он состоит из трёх основных модулей:

- **JUnit Platform** — основа для запуска тестов
- **JUnit Jupiter** — API для написания тестов
- **JUnit Vintage** — поддержка старых версий JUnit

Минимальный тест выглядит так:

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {
    @Test
    void shouldAddTwoNumbers() {
        int result = Calculator.add(2, 3);
        assertEquals(5, result);
    }
}
```

---

## Аннотации JUnit

| Аннотация | Назначение |
|---|---|
| `@Test` | Помечает метод как тестовый |
| `@BeforeEach` | Выполняется перед каждым тестом |
| `@AfterEach` | Выполняется после каждого теста |
| `@BeforeAll` | Выполняется один раз перед всеми тестами (статический метод) |
| `@AfterAll` | Выполняется один раз после всех тестов (статический метод) |
| `@Disabled` | Отключает тест |
| `@DisplayName` | Задаёт читаемое имя теста |

Пример:

```java
@DisplayName("Тесты калькулятора")
class CalculatorTest {
    private Calculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new Calculator();
    }

    @Test
    @DisplayName("Сложение двух чисел")
    void shouldAddTwoNumbers() {
        assertEquals(5, calculator.add(2, 3));
    }
}
```

---

## Assertions

JUnit предоставляет множество методов для проверки условий:

```java
assertEquals(expected, actual);
assertTrue(condition);
assertFalse(condition);
assertNull(object);
assertNotNull(object);
assertSame(expected, actual); // проверка на идентичность объектов
assertThrows(Exception.class, () -> { /* код */ });
```

Пример с исключением:

```java
@Test
void shouldThrowExceptionWhenDivideByZero() {
    assertThrows(ArithmeticException.class, () -> {
        calculator.divide(1, 0);
    });
}
```

---

## Жизненный цикл теста

1. **@BeforeAll** (один раз для класса)
2. **@BeforeEach** (перед каждым тестом)
3. **@Test** (сам тест)
4. **@AfterEach** (после каждого теста)
5. **@AfterAll** (один раз для класса)

> [!tip] Совет
> Используйте `@BeforeEach` для инициализации тестовых данных и `@AfterEach` для очистки ресурсов (например, закрытия файлов или соединений).

---

## Параметризованные тесты

Позволяют запускать один тест с разными входными данными:

```java
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class StringUtilsTest {
    @ParameterizedTest
    @ValueSource(strings = {"", "  ", "\t"})
    void shouldReturnTrueForEmptyStrings(String input) {
        assertTrue(StringUtils.isEmpty(input));
    }
}
```

Другие источники данных:
- `@CsvSource` — данные из CSV
- `@MethodSource` — данные из метода
- `@EnumSource` — значения перечисления

---

## JUnit 5 в AQA

В автотестировании JUnit 5 используется для:

- Тестирования утилит (парсеры, генераторы данных)
- Проверки вспомогательных классов (конфиги, билдеры)
- Модульных тестов для Page Object

Пример теста для утилиты чтения файлов:

```java
class FileReaderTest {
    @Test
    void shouldReadFileContent() throws IOException {
        String content = FileReader.read("test.txt");
        assertEquals("Hello, World!", content);
    }
}
```

---

## Вопросы для собеседования

### Топ-10

**1. Что такое модульное тестирование?**
Проверка отдельных частей программы (методов, классов) в изоляции от остального кода.

**2. Какие аннотации JUnit 5 ты знаешь?**
`@Test`, `@BeforeEach`, `@AfterEach`, `@BeforeAll`, `@AfterAll`, `@Disabled`, `@DisplayName`.

**3. В чём разница между assertEquals и assertSame?**
`assertEquals` проверяет равенство значений (через equals), `assertSame` — что это один и тот же объект (сравнение ссылок).

**4. Как написать тест, который проверяет выброс исключения?**
Использовать `assertThrows(Exception.class, () -> { /* код */ })`.

**5. Зачем нужен @BeforeEach?**
Для инициализации объектов или данных, которые нужны каждому тесту в классе.

**6. Что такое параметризованные тесты?**
Тесты, которые запускаются с разными входными данными, определёнными через `@ValueSource`, `@CsvSource` и т.д.

**7. Как запустить тесты только из одного класса?**
`mvn test -Dtest=MyTestClass` или через IDE.

**8. В чём разница между @BeforeAll и @BeforeEach?**
`@BeforeAll` выполняется один раз перед всеми тестами класса, `@BeforeEach` — перед каждым тестом.

**9. Как игнорировать тест?**
Использовать аннотацию `@Disabled`.

**10. Какие assertions ты знаешь?**
`assertEquals`, `assertTrue`, `assertFalse`, `assertNull`, `assertNotNull`, `assertSame`, `assertThrows`.

---

### Хитрые вопросы

**1. Можно ли использовать JUnit 5 для интеграционного тестирования?**
Да, но обычно для этого используют специализированные фреймворки (Testcontainers, Spring Test). JUnit 5 больше подходит для модульных тестов.

**2. Как передать параметры в тест через командную строку?**
Использовать `@TestInstance(Lifecycle.PER_CLASS)` и `@BeforeAll`, который принимает параметры.

**3. В чём разница между JUnit 4 и JUnit 5?**
JUnit 5 — это новая архитектура с модулями, поддержкой лямбд, расширенными аннотациями и параметризованными тестами.

**4. Как запустить только один метод теста?**
`mvn test -Dtest=MyTestClass#testMethod` или через IDE.

**5. Зачем нужен @DisplayName?**
Чтобы дать тесту или классу тестов читаемое имя, которое будет отображаться в отчётах.