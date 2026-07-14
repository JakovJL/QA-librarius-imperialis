# Locators

## Содержание

- [[#Область матрицы]]
- [[#Вопросы и ответы]]
	- [[#Что такое Locator и какие attributes лучше использовать?]]
	- [[#Чем CSS отличается от XPath?]]
	- [[#Как работают Relative XPath и axes?]]
	- [[#Как задавать условия в CSS и XPath?]]
	- [[#Что такое document.querySelector() и jQuery?]]
	- [[#Как создавать Dynamic или Parameterised Locators?]]
	- [[#Можно ли найти ::before, ::after или элементы Shadow DOM?]]
- [[#Ссылки на теорию]]

**Связанные заметки:** [[00 Индекс Skills Matrix AQA]]

---

## Область матрицы

Эта заметка покрывает:

- CSS, XPath, `document.querySelector()` и jQuery.
- Стабильные attributes, relative paths, axes, conditions и parameterised locators.
- Pseudo-elements и Shadow DOM.

---

## Вопросы и ответы

### Что такое Locator и какие attributes лучше использовать?

**Короткий ответ:**

Locator идентифицирует элемент в DOM. Я предпочитаю уникальные стабильные attributes для тестирования, например `data-testid`, или стабильные семантические attributes: `id`, `name`, role и accessible name. Я избегаю indexes, generated classes и длинных paths, зависящих от layout.

### Чем CSS отличается от XPath?

**Короткий ответ:**

CSS selectors удобны для attributes, classes, hierarchy и pseudo-classes. XPath может перемещаться вниз и вверх по DOM и искать по тексту или сложным связям. Я выбираю самый простой стабильный selector; XPath сам по себе не хуже, но абсолютный XPath обычно хрупкий.

### Как работают Relative XPath и axes?

**Короткий ответ:**

`//` ищет descendants от document context, `.//` — descendants текущего element, а `./` начинает путь от текущего element. Axes `parent`, `ancestor`, `following-sibling` и `preceding-sibling` помогают выражать связи, когда стабильных attributes нет.

### Как задавать условия в CSS и XPath?

**Короткий ответ:**

CSS поддерживает attribute selectors и pseudo-classes, например `:not()`. XPath поддерживает predicates, `contains()`, `not()` и boolean `and` или `or`. Я сохраняю условия читаемыми и проверяю уникальность в Developer Tools.

### Что такое document.querySelector() и jQuery?

**Короткий ответ:**

`document.querySelector()` — Browser DOM API, возвращающий первый element по CSS selector; `querySelectorAll()` возвращает static collection. jQuery — отдельная JavaScript library со своим selector и utility API. Selenium не требует jQuery, и библиотека может отсутствовать на странице.

### Как создавать Dynamic или Parameterised Locators?

**Короткий ответ:**

Я храню locator template с контролируемым parameter и экранирую или проверяю значение. Нельзя небезопасно собирать selectors из произвольного текста. Parameterised locator должен оставаться читаемым, уникальным и находиться в соответствующем Page Object или component.

### Можно ли найти ::before, ::after или элементы Shadow DOM?

**Короткий ответ:**

`::before` и `::after` являются CSS-generated pseudo-elements, а не обычными DOM nodes, поэтому Selenium не возвращает их как WebElement; computed style можно прочитать через JavaScript. Для открытого Shadow DOM Selenium получает shadow root и ищет внутри него. Для closed shadow root нужна поддержка приложения или другой подход.

---

## Ссылки на теорию

- [[17 Основы Selenium WebDriver]]

