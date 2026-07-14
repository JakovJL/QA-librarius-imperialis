# Loggers reporters и metrics

## Содержание

- [[#Вопросы и ответы]]
	- [[#Чем отличаются logs, reports и metrics?]]
	- [[#Что должен содержать test status report?]]
	- [[#Какие evidence нужно прикладывать к failed test?]]
	- [[#Чем отличаются Allure, ReportPortal и framework reports?]]
	- [[#Как читать Allure report?]]
	- [[#Какие test execution metrics полезны?]]
	- [[#Что означают coverage и test-case progress?]]
	- [[#Какие defect metrics полезны?]]
	- [[#Как отчитываться о smoke или regression run?]]
	- [[#Как CI должна генерировать, публиковать и хранить reports?]]
	- [[#Как сообщать quality status и release risk?]]
	- [[#Что включает Senior-level reporting governance?]]
- [[#Ссылки на теорию]]

**Связанные заметки:** [[00 Индекс Skills Matrix AQA]]

---

## Вопросы и ответы

### Чем отличаются logs, reports и metrics?

**Ответ:**

Logs — chronological technical records для диагностики execution: time, event, level, context и error details. Report суммирует один test run для читателя: scope, results, evidence и risk. Metric — определённое number или trend для решения. Log не является report, а одна metric не доказывает готовность release. Нельзя записывать passwords, tokens, personal data или другие secrets в logs и report attachments.

### Что должен содержать test status report?

**Ответ:**

Полезный report указывает purpose и scope, application build и environment, dates, executed/passed/failed/blocked/not-run counts, linked defects, evidence и remaining risks. Также он говорит, что не тестировалось, и даёт понятную recommendation, например «готово к limited release» или «заблокировано defect в payment». Уровень detail зависит от читателя: engineer нужен failing stack trace, а customer — impact и risk.

### Какие evidence нужно прикладывать к failed test?

**Ответ:**

Нужно прикладывать только evidence, помогающие воспроизвести или диагностировать failure: screenshot для видимого UI state, video, если важна sequence, browser или device logs, request и response details с redacted secrets, а также test parameters и environment. При наличии добавляется link на CI job и defect. Не нужно прикладывать large files по умолчанию или скрывать actual error под множеством unstructured logs.

### Чем отличаются Allure, ReportPortal и framework reports?

**Ответ:**

JUnit и TestNG integrations обычно создают machine-readable result files и basic suite reports для CI. Allure превращает test results в interactive HTML report со steps, attachments, categories, environment, history и trends. ReportPortal — TestOps service для central, real-time result analysis, dashboards и collaborative failure triage. Следует выбирать smallest tool, который даёт команде нужные history, evidence, access control и CI integration.

### Как читать Allure report?

**Ответ:**

Начать нужно с build, environment и suite scope. Затем открыть failed tests и прочитать steps, assertion difference, exception и attachments. Categories группируют похожие failures, например product defects или infrastructure errors. History и retries помогают найти unstable test, но retry не отменяет original failure. Results можно сравнивать, только если environments и selected tests сопоставимы.

### Какие test execution metrics полезны?

**Ответ:**

Полезные run metrics: passed, failed, blocked, skipped или not-run, duration, retry count и flaky-test rate. Pass rate должна указывать denominator; например, `passed / executed`, где executed — passed плюс failed. Blocked test не является passed test, а skipped test может скрывать gap в coverage. Critical-flow results нужно отслеживать отдельно от total, чтобы большое число low-risk passes не скрыло failed payment или login flow.

### Что означают coverage и test-case progress?

**Ответ:**

Test-case progress показывает, сколько planned cases designed, ready, executed и completed. Requirement coverage показывает, для каких agreed requirements или risks есть suitable tests. Code coverage показывает, какой code выполнялся, и не равен test quality или requirement coverage. Хороший coverage report называет scope и gaps, например: «все high-risk checkout requirements покрыты; refund при partial payment не покрыт».

### Какие defect metrics полезны?

**Ответ:**

Полезные defect metrics: total open defects, severity distribution, trend во времени, defect density и escaped defects, найденные после release. Defect density требует agreed size denominator, например story points или function points, и полезна только при одинаковом definition во времени. Escaped defect показывает, что release process или test strategy пропустили problem; это сигнал для обучения, а не automatic measure performance одного человека.

### Как отчитываться о smoke или regression run?

**Ответ:**

Нужно указать build и environment, выбранный smoke или regression scope, counts по results, critical failures, blockers, linked defects и remaining risk. Smoke report отвечает, достаточно ли build стабилен для deeper testing. Regression report также выделяет changed areas, ранее passed tests, которые теперь failed, flaky results и comparison с previous run. В team chat или на stand-up отправляется краткий factual status со ссылкой на full report.

### Как CI должна генерировать, публиковать и хранить reports?

**Ответ:**

CI job должна собирать results и artifacts даже после test failure, затем публиковать HTML report и machine-readable JUnit/TestNG results. Artifacts получают build identifier и хранятся agreed period. Long-term history можно хранить в reporting platform, object storage или database, только если команде нужен trend analysis. Перед upload нужно ограничить access и скрыть secrets. Successful upload не означает, что tests passed.

### Как сообщать quality status и release risk?

**Ответ:**

Test Summary Report или dashboard должен отвечать: что тестировалось, что passed или failed, какие evidence есть, какой risk остаётся и какое решение рекомендуется. Impact нужно объяснять product language: «checkout заблокирован для guest users», а не только «три tests failed». При наличии включаются agreed SLA или release criteria, но uncertainty нужно называть честно. QA предоставляет evidence и recommendation; release decision принимают agreed decision-makers.

### Что включает Senior-level reporting governance?

**Ответ:**

Senior QA определяет report templates, metric formulas, owners, data sources, retention, access rules и common failure taxonomy. Он выбирает и поддерживает coverage и reporting tools, настраивает CI/CD publication и создаёт useful dashboard widgets или integrations, когда built-in view недостаточно. Он обучает команду consistent evidence и metric definitions, обсуждает trends со stakeholders и удаляет vanity metrics, которые не меняют решение.

---

## Ссылки на теорию

- [[21 Логирование отчёты и метрики]]
