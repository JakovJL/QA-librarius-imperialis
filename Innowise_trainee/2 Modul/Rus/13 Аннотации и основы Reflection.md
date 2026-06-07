# Аннотации и основы Reflection

## Содержание

- [[#Почему метапрограммирование важно]]
- [[#Что такое аннотации]]
- [[#Встроенные аннотации]]
- [[#Пользовательские аннотации]]
- [[#Основы Reflection]]
- [[#Поля методы и конструкторы через Reflection]]
- [[#Аннотации и Reflection в AQA]]
- [[#Вопросы для собеседования]]

**Связанные заметки:** [[AQA Java rus]]

> [!info] Видео-курс (Заур Трегулов)
> Курс 2 (Чёрный Пояс): раздел «Другое» — Reflection и Annotations.

---

## Почему метапрограммирование важно

Иногда коду нужна информация **о самом коде**. Например:

- JUnit находит тестовые методы, помеченные `@Test`
- Spring находит компоненты, помеченные `@Service`
- Библиотеки сериализации динамически исследуют поля и классы

Именно здесь становятся важными **аннотации** и **reflection**.

- **Аннотации** прикрепляют метаданные к классам, методам, полям и параметрам
- **Reflection** позволяет программе исследовать классы, методы, поля и конструкторы во время выполнения

Эти инструменты очень мощные, но использовать их нужно аккуратно, потому что при злоупотреблении они уменьшают читаемость и безопасность кода.

---

## Что такое аннотации

**Аннотация** — это метаданные, записанные через `@`. Сама по себе она напрямую не меняет логику программы, но инструменты и framework могут её прочитать и отреагировать.

```java
@Override
public String toString() {
    return "User";
}
```

### Где можно использовать аннотации

- классы
- методы
- поля
- параметры
- конструкторы
- локальные переменные

### Важная идея

Аннотации описывают такую информацию, как:

- "этот метод переопределяет метод родителя"
- "этот метод является тестом"
- "это поле нужно сериализовать"

Сама аннотация — только метаданные. Настоящее поведение появляется, когда её обрабатывает компилятор, JVM или framework.

---

## Встроенные аннотации

У Java есть несколько встроенных аннотаций, которые встречаются очень часто.

### `@Override`

Показывает, что метод переопределяет метод родителя.

```java
class Animal {
    public void sound() {}
}

class Dog extends Animal {
    @Override
    public void sound() {
        System.out.println("Woof");
    }
}
```

Почему это полезно:

- Помогает компилятору ловить ошибки
- Делает код понятнее

### `@Deprecated`

Помечает код, который не стоит использовать в новой разработке.

```java
@Deprecated
public void oldMethod() {
}
```

### `@SuppressWarnings`

Говорит компилятору скрыть определённые предупреждения.

```java
@SuppressWarnings("unchecked")
List<String> names = (List<String>) rawList;
```

### `@FunctionalInterface`

Помечает интерфейс, который должен иметь ровно один абстрактный метод.

```java
@FunctionalInterface
interface Printer {
    void print(String text);
}
```

> [!tip] Используй встроенные аннотации
> `@Override` и `@FunctionalInterface` очень простые, но очень полезные. Они повышают безопасность почти без дополнительных затрат.

---

## Пользовательские аннотации

Ты можешь создавать собственные аннотации.

```java
public @interface SmokeTest {
}
```

Потом такую аннотацию можно использовать так:

```java
@SmokeTest
public void loginTest() {
}
```

### Аннотация со значениями

```java
public @interface TestInfo {
    String author();
    int priority() default 1;
}
```

Использование:

```java
@TestInfo(author = "Ann", priority = 2)
public void checkoutTest() {
}
```

### Мета-аннотации

Сами аннотации тоже могут иметь аннотации.

Частые meta-annotations:

- `@Target`
- `@Retention`
- `@Documented`
- `@Inherited`

Пример:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface SmokeTest {
}
```

### Почему важна `@Retention`

- `SOURCE` - существует только в исходном коде
- `CLASS` - хранится в `.class`, но не всегда доступна во время выполнения
- `RUNTIME` - доступна через reflection во время выполнения

Если ты хочешь читать аннотацию через reflection, используй `RetentionPolicy.RUNTIME`.

> [!warning] Без `RUNTIME`
> Если пользовательская аннотация не сохраняется до runtime, reflection её не увидит.

---

## Основы Reflection

**Reflection** — это способность программы на Java исследовать классы и их члены во время выполнения.

Через reflection можно получить:

- имя класса
- список полей
- список методов
- конструкторы
- интерфейсы
- аннотации

### Получение объекта `Class`

```java
Class<String> c1 = String.class;

String text = "hello";
Class<?> c2 = text.getClass();

Class<?> c3 = Class.forName("java.lang.String");
```

### Базовый пример Reflection

```java
Class<?> clazz = ArrayList.class;

System.out.println(clazz.getName());         // java.util.ArrayList
System.out.println(clazz.getSimpleName());   // ArrayList
```

Reflection полезен, когда класс заранее не полностью известен во время компиляции или когда framework нужно автоматически исследовать код.

---

## Поля методы и конструкторы через Reflection

### Поля

```java
class User {
    private String name = "Alice";
}

Field field = User.class.getDeclaredField("name");
field.setAccessible(true);

User user = new User();
System.out.println(field.get(user)); // Alice
```

### Методы

```java
class User {
    public void sayHello() {
        System.out.println("Hello");
    }
}

Method method = User.class.getDeclaredMethod("sayHello");
method.invoke(new User());
```

### Конструкторы

```java
class User {
    public User(String name) {
        System.out.println(name);
    }
}

Constructor<User> constructor = User.class.getConstructor(String.class);
User user = constructor.newInstance("Bob");
```

### Частые reflection-методы

| Метод | Смысл |
|---|---|
| `getDeclaredFields()` | все поля, объявленные в классе |
| `getDeclaredMethods()` | все методы, объявленные в классе |
| `getDeclaredConstructors()` | все конструкторы, объявленные в классе |
| `getDeclaredField(name)` | одно поле по имени |
| `getDeclaredMethod(name, types...)` | один метод по имени |
| `newInstance()` | создать объект динамически |
| `invoke()` | вызвать метод динамически |

> [!caution] Reflection имеет цену
> Reflection медленнее прямого кода, обходит часть compile-time проверок и может ухудшать читаемость. Используй его по необходимости, а не по умолчанию.

---

## Аннотации и Reflection в AQA

Эти темы очень важны для автотестирования.

### Типичные примеры

- JUnit находит методы, помеченные `@Test`, `@BeforeEach`, `@AfterEach`
- Пользовательские аннотации могут помечать `@Smoke`, `@Regression` или `@ApiTest`
- Reflection может динамически загружать page objects, классы тестовых данных или utility-методы

### Пример с JUnit

```java
@Test
void loginShouldWork() {
}
```

JUnit читает аннотацию `@Test` и понимает, что этот метод нужно выполнить как тест.

### Пример пользовательской аннотации

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Smoke {
}
```

```java
@Smoke
public void checkLogin() {
}
```

### Пример Reflection во framework-коде

```java
Class<?> clazz = Class.forName("pages.LoginPage");
Object page = clazz.getDeclaredConstructor(WebDriver.class).newInstance(driver);
```

Это может быть полезно во внутренних частях framework, но для beginner-level AQA-кода лучше по возможности использовать более простой прямой код.

### Хорошие практики

- Используй аннотации для понятных метаданных
- Используй reflection в основном во framework или infrastructure code
- Избегай reflection в обычной бизнес-логике без необходимости
- Держи пользовательские аннотации простыми и осмысленными

> [!info] Хорошее правило для AQA
> Аннотации — частый и дружественный инструмент. Reflection мощный, но его лучше держать в основном внутри framework internals, а не в каждом тесте.

---

## Вопросы для собеседования

### Топ-10

**1. Что такое аннотация в Java?**  
Аннотация — это метаданные, прикреплённые к элементам кода, таким как классы, методы или поля. Инструменты, framework или компилятор могут прочитать их и использовать.

**2. Что такое reflection в Java?**  
Reflection — это способность программы исследовать и использовать классы, поля, методы и конструкторы во время выполнения.

**3. Что делает `@Override`?**  
Она говорит компилятору, что метод должен переопределять метод родителя. Если это не так, компиляция завершится ошибкой.

**4. Почему важна `@Retention(RetentionPolicy.RUNTIME)`?**  
Потому что только аннотации, сохранённые до runtime, доступны через reflection во время выполнения.

**5. В чём разница между аннотацией и reflection?**  
Аннотация — это метаданные. Reflection — это механизм для исследования и использования структуры кода во время выполнения. Reflection умеет читать аннотации.

**6. Можно ли создавать пользовательские аннотации?**  
Да. Java позволяет определять собственные типы аннотаций с дополнительными значениями и meta-annotations.

**7. К чему можно получить доступ через reflection?**  
К классам, полям, методам, конструкторам, интерфейсам, аннотациям и многому другому.

**8. Почему reflection может быть опасен?**  
Он медленнее, обходит часть compile-time безопасности и может делать код сложнее для понимания и поддержки.

**9. Где в тестовых framework встречаются аннотации?**  
В аннотациях JUnit вроде `@Test`, `@BeforeEach`, `@AfterEach`, а также в пользовательских тегах и служебных метаданных framework.

**10. Когда на практике используют reflection?**  
В основном во framework, библиотеках, dependency injection, test runners, object mappers и динамических утилитах.

---

### Хитрые вопросы

**1. Меняет ли аннотация поведение кода сама по себе?**  
Обычно нет. Это только метаданные. Поведение меняется только тогда, когда аннотацию обрабатывает инструмент, framework или компилятор.

**2. Может ли reflection получить доступ к private полям и методам?**  
Да, во многих случаях через `setAccessible(true)`, хотя использовать это нужно осторожно.

**3. В чём разница между `getFields()` и `getDeclaredFields()`?**  
`getFields()` возвращает public-поля, включая унаследованные. `getDeclaredFields()` возвращает все поля, объявленные именно в этом классе, включая private.

**4. Почему многие framework используют reflection?**  
Потому что им нужно динамически исследовать классы, не хардкодя каждый класс и метод на этапе компиляции.

**5. Может ли reflection создавать объекты динамически?**  
Да. Можно получить конструктор и вызвать `newInstance()`, чтобы создать объект во время выполнения.
