# Locators

## Table of Contents

- [[#Matrix Scope]]
- [[#Questions and Answers]]
	- [[#What Is a Locator and Which Attributes Are Best?]]
	- [[#What Is the Difference Between CSS and XPath?]]
	- [[#How Do Relative XPath and Axes Work?]]
	- [[#How Do You Write Conditions in CSS and XPath?]]
	- [[#What Are document.querySelector() and jQuery?]]
	- [[#How Do You Build Dynamic or Parameterised Locators?]]
	- [[#Can Selenium Locate ::before, ::after, or Shadow DOM Elements?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Matrix Scope

This note covers:

- CSS, XPath, `document.querySelector()`, and jQuery.
- Stable attributes, relative paths, axes, conditions, and parameterised locators.
- Pseudo-elements and Shadow DOM.

---

## Questions and Answers

### What Is a Locator and Which Attributes Are Best?

**Short answer:**

A locator identifies an element in the DOM. I prefer unique stable attributes created for testing, such as `data-testid`, or stable semantic attributes such as `id`, `name`, role, and accessible name. I avoid indexes, generated classes, and long paths tied to layout.

### What Is the Difference Between CSS and XPath?

**Short answer:**

CSS selectors are concise and work well for attributes, classes, hierarchy, and pseudo-classes. XPath can navigate both down and up the DOM and match text or complex relationships. I choose the simplest stable selector; XPath is not automatically worse, but fragile absolute XPath is.

### How Do Relative XPath and Axes Work?

**Short answer:**

`//` searches descendants from the document context, `.//` searches descendants from the current element, and `./` starts from the current element's direct path. Axes such as `parent`, `ancestor`, `following-sibling`, and `preceding-sibling` help express relationships when stable attributes are not available.

### How Do You Write Conditions in CSS and XPath?

**Short answer:**

CSS supports attribute selectors and pseudo-classes such as `:not()`. XPath supports predicates, `contains()`, `not()`, and boolean `and` or `or`. I keep conditions readable and test uniqueness in browser developer tools before adding them to automation.

### What Are document.querySelector() and jQuery?

**Short answer:**

`document.querySelector()` is a browser DOM API that returns the first element matching a CSS selector; `querySelectorAll()` returns a static collection. jQuery is a separate JavaScript library with its own selector and utility API. Selenium does not require jQuery, and a page may not include it.

### How Do You Build Dynamic or Parameterised Locators?

**Short answer:**

I keep a locator template with a controlled parameter and escape or validate the value. I avoid constructing selectors from untrusted text. A parameterised locator should still be readable, unique, and owned by the relevant Page Object or component.

### Can Selenium Locate ::before, ::after, or Shadow DOM Elements?

**Short answer:**

`::before` and `::after` are CSS-generated pseudo-elements, not normal DOM nodes, so Selenium cannot return them as WebElements; their computed style can be read with JavaScript. For Shadow DOM, Selenium can access an open shadow root and then search inside it. Closed shadow roots require application support or another testing approach.

---

## Theory Links

- [[17 Selenium WebDriver Basics]]

