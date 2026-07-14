# Waiters

## Содержание

- [[#Вопросы и ответы]]
	- [[#Что это такое и что нужно знать?]]
	- [[#Какие практические навыки нужны Automation QA?]]
	- [[#Какие ошибки и риски важны?]]
- [[#Требования Intern и Junior]]
- [[#Требования Middle и Senior]]
	- [[#Какие виды waits предоставляет Selenium?]]
	- [[#Почему нельзя смешивать implicit и explicit waits?]]
	- [[#Как ждать готовность DOM и application?]]
	- [[#Как написать explicit или custom Expected Condition?]]
	- [[#Как ждать loader или несколько events?]]
	- [[#Чем FluentWait отличается от WebDriverWait?]]
	- [[#Как проектировать и диагностировать waits во framework?]]
- [[#Ссылки на теорию]]

**Связанные заметки:** [[00 Индекс Skills Matrix AQA]]

---

## Вопросы и ответы

### Что это такое и что нужно знать?

**Короткий ответ:**

Implicit wait глобально влияет на lookup; explicit wait ожидает одно condition; FluentWait настраивает polling и ignored exceptions. Смешивание ожиданий делает timing непредсказуемым.

### Какие практические навыки нужны Automation QA?

**Короткий ответ:**

Ожидать значимый DOM, UI, network или domain state и создавать reusable conditions с timeout diagnostics.

### Какие ошибки и риски важны?

**Короткий ответ:**

Избегать `Thread.sleep()`, excessive timeouts, blind retries и считать `document.readyState` доказательством готовности application.

---

## Требования Intern и Junior

- Implicit wait — один global timeout для element lookup. Explicit wait периодически проверяет одно condition в течение ограниченного времени. `FluentWait` является гибкой основой: в нём задаются timeout, polling interval и ignored exceptions. Implicit и explicit waits нельзя смешивать, потому что их timeouts непредсказуемо сочетаются.
- `Thread.sleep()` всегда ждёт всё заданное время, даже если page уже ready, и падает, если page требуется больше времени. Нужно ждать meaningful state.
- `document.readyState == "complete"` означает завершение document load event. Это не доказывает завершение data single-page application, AJAX requests, animations или loaders. Custom JavaScript condition допустим только при надёжном state, который предоставляет application.

---

## Требования Middle и Senior

- `WebDriverWait` используется с condition visible, clickable, invisible, text present, frame available или alert present. Например, сначала ожидается invisibility loader, а затем выполняется click result. Custom `ExpectedCondition` может повторно проверять, что text element содержит нужное value.
- FluentWait отличается от обычного WebDriverWait возможностью выбрать polling period и ignored exception set. Нельзя игнорировать широкие exceptions: это скрывает реальный defect.
- Reusable waits размещаются в небольшом `WaitUtils` или condition factory. Отдельно рассматриваются DOM readiness, network completion, UI visibility и business state. Negative wait доказывает, что element не появился за короткий согласованный timeout.
- Для flaky tests логируются condition, timeout, elapsed time, URL, locator и screenshot. Conditions объединяются только если user flow действительно требует оба события, например «result visible и spinner gone». Dynamic timeouts должны обосновываться особенностью environment или data, а не скрывать slow behaviour.

---

## Подробные вопросы и ответы

### Какие виды waits предоставляет Selenium?

**Ответ:**

Implicit wait — session-wide timeout для поиска element. Explicit wait периодически проверяет выбранное condition до успеха или timeout. `WebDriverWait` — частый class explicit wait Selenium. `FluentWait` — более configurable base class. `Thread.sleep()` не является Selenium wait: он останавливает test на fixed time.

### Почему нельзя смешивать implicit и explicit waits?

**Ответ:**

Implicit wait влияет на каждый element lookup. Explicit wait повторно делает lookups, пока ждёт condition. При двух waits один poll может ждать implicit timeout, из-за чего общий timeout становится больше и непредсказуемее. Обычно implicit wait остаётся равным нулю, а explicit waits используются для meaningful states.

### Как ждать готовность DOM и application?

**Ответ:**

`document.readyState == "complete"` подтверждает, что browser завершил загрузку document. Это не доказывает завершение API requests, rendering или animation SPA. Этот signal используется только как низкоуровневый, затем ожидается user-visible или business-ready state: loaded result list или enabled Pay button. Custom JavaScript check допустим, только если application предоставляет stable state.

### Как написать explicit или custom Expected Condition?

**Ответ:**

Создаётся `WebDriverWait` с понятным timeout и ожиданием одного condition. Custom condition возвращает `true`, только когда есть нужный state.

```java
new WebDriverWait(driver, Duration.ofSeconds(10))
    .until(d -> d.findElement(message).getText().contains("Saved"));
```

Это лучше sleep: test продолжается сразу после correct message и получает полезный timeout, если message не появилось.

### Как ждать loader или несколько events?

**Ответ:**

Сначала ожидается invisibility loader или overlay, затем result, нужный user. Для compound state создаётся condition, проверяющий обе части: result visible **и** spinner gone. Negative wait проверяет, что unwanted element не появился за короткий agreed period; он применяется, только если absence — ожидаемое behaviour.

### Чем FluentWait отличается от WebDriverWait?

**Ответ:**

`WebDriverWait` — specialised FluentWait для WebDriver и обычно достаточен. FluentWait позволяет выбрать polling interval и ignored exceptions. Игнорируются только ожидаемые transient exceptions, например stale element при известном redraw; broad exceptions скрывают defects.

### Как проектировать и диагностировать waits во framework?

**Ответ:**

Reusable waits размещаются в небольшом `WaitUtils` или condition factory. DOM, network, UI и business-state waits отделяются. При failure логируются condition name, timeout, elapsed time, URL, locator, screenshot и relevant browser или network evidence. Нельзя повышать все timeouts после одного slow run: нужно найти data, environment, missing synchronisation event или реальную performance problem.

---

## Ссылки на теорию

- [[17 Основы Selenium WebDriver]]
