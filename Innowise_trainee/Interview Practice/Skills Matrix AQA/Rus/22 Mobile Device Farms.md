# Mobile Device Farms

## Содержание

- [[#Вопросы и ответы]]
	- [[#Что такое mobile device farm и чем отличаются emulators, simulators и real devices?]]
	- [[#Как запустить test на local Android emulator или iOS Simulator?]]
	- [[#Когда команде нужна device farm?]]
	- [[#Какие преимущества и ограничения есть у device farm?]]
	- [[#Какие device farms нужно знать и какие названия устарели?]]
	- [[#Как построить risk-based device matrix?]]
	- [[#Как настроить remote device session?]]
	- [[#Как безопасно загрузить build и подключиться к private test environment?]]
	- [[#Какие logs и artifacts нужно получать из farm?]]
	- [[#Как диагностировать failure через live session или remote debugger?]]
	- [[#Как работать с video и screenshots?]]
	- [[#Как безопасно подключить device farm к CI/CD?]]
	- [[#Как масштабировать runs через parallel execution, sharding и session control?]]
	- [[#Как измерять stability и поддерживать несколько providers?]]
- [[#Ссылки на теорию]]

**Связанные заметки:** [[00 Индекс Skills Matrix AQA]]

---

## Вопросы и ответы

### Что такое mobile device farm и чем отличаются emulators, simulators и real devices?

**Ответ:**

Mobile device farm предоставляет remote devices и test infrastructure через web UI, CLI, API или Appium endpoint. Android emulator эмулирует Android hardware и software. iOS Simulator симулирует iOS behaviour на macOS, но не является iPhone или iPad. Real device имеет actual hardware, OS build, sensors, performance limits, vendor changes и network behaviour. Emulators и simulators подходят для fast feedback, но real devices нужны для risks, зависящих от real hardware или OEM version Android.

### Как запустить test на local Android emulator или iOS Simulator?

**Ответ:**

Android Virtual Device (AVD) создаётся и запускается через Android Studio Device Manager; затем нужно убедиться, что он виден `adb`, и открыть Appium session с его device configuration. Для iOS Simulator запускается из Xcode или `simctl` на macOS, после чего выполняется XCUITest или Appium XCUITest-driver session. Local virtual devices полезны до farm, потому что быстрее показывают problems locators, build и basic capabilities. Подключение к farm обычно идёт через provider UI, CLI, API или remote WebDriver endpoint.

### Когда команде нужна device farm?

**Ответ:**

Farm нужна, когда required real-device coverage, OS versions, locations или parallel capacity трудно либо дорого поддерживать локально. Она особенно полезна для release validation, compatibility testing и расследования device-specific defect. Не нужно отправлять в farm каждый local test: unit, API и fast emulator checks обычно дают более дешёвый feedback. Решение должно сравнивать risk, feedback time, privacy, device availability и cost.

### Какие преимущества и ограничения есть у device farm?

**Ответ:**

Преимущества: доступ к многим real models, меньше поддержки hardware, controlled device reset, parallel execution и provider artifacts. Ограничения: queue time, subscription или device-minute cost, limited control remote device, network latency и provider-specific features. Availability меняется в busy periods, поэтому test должна сообщать queued или unavailable device как infrastructure information, а не бесконечно retry. Farm не должна быть единственным source of truth, когда defect нужно воспроизвести на specific customer device.

### Какие device farms нужно знать и какие названия устарели?

**Ответ:**

Распространённые services: BrowserStack App Live и App Automate, Sauce Labs, Firebase Test Lab, AWS Device Farm, BitBar Testing Cloud, Kobiton и LambdaTest. Они отличаются device inventory, supported frameworks, regions, private-network support, artifacts, concurrency и pricing. Firebase Test Lab поддерживает device matrices и интегрируется с Firebase, Android Studio, `gcloud` и CI. BrowserStack App Automate поддерживает Appium на real Android и iOS devices. Xamarin Test Cloud — legacy name: это была часть retired Visual Studio App Center Test service. Перед выбором нужно проверить current documentation и contract конкретного provider.

### Как построить risk-based device matrix?

**Ответ:**

Нужно начать с real user data и product risks, а не со всех theoretical combinations. Matrix включает supported OS versions, high-usage models, разные screen sizes, важные Android OEMs, locale, orientation, а также accessibility или network risks. Для каждого change выбирается small smoke matrix, а для scheduled run или release candidate — более широкая regression matrix. Failed и untested combinations нужно регулярно пересматривать. Matrix полезна, только если rule выбора и ownership понятны.

### Как настроить remote device session?

**Ответ:**

Через documented capabilities или UI provider задаются model, OS version, application build, automation framework, test name и нужные locale, orientation, region или geolocation. Capability выбирает available device configuration, но не гарантирует, что physical device свободен сразу. Provider-specific options нужно хранить в одном configuration adapter и валидировать до large run. User password, access token и private build URL нельзя помещать source code или public report.

### Как безопасно загрузить build и подключиться к private test environment?

**Ответ:**

Signed test build загружается через secure UI, CLI или API provider, а возвращённый build identifier хранится только нужное время. Если application требует internal backend, нужно использовать approved local tunnel или private-network integration provider, а не открывать backend публично. Farm credentials и tunnel keys хранятся CI secret store; доступ ограничивается project, а test accounts используют non-production data. До использования third-party farm нужно подтвердить retention и deletion rules для uploaded applications и artifacts.

### Какие logs и artifacts нужно получать из farm?

**Ответ:**

Нужно получить test result, device или system log, Appium или framework log, screenshots, video при наличии, application crash report и initialization либо provisioning error. На Android Logcat часто объясняет crash или permission issue. На iOS проверяются XCTest и device logs, затем crash report, если он есть. Artifacts связываются с CI build, test case, device и session identifier. Evidence должно быть достаточно для диагностики failure, но tokens и personal data нужно скрыть.

### Как диагностировать failure через live session или remote debugger?

**Ответ:**

Сначала нужно решить, относится ли failure к product, test, device, provider или environment. Следует прочитать exception и device logs, затем сравнить application build, capabilities, device и test data с passing run. Если provider предлагает live или interactive session, case нужно воспроизвести там и увидеть тот же screen и action до изменения locator или добавления wait. Remote debugger помогает inspect connected session, но не должен раскрывать customer data или оставлять device locked для других users.

### Как работать с video и screenshots?

**Ответ:**

Video показывает всю sequence и полезно для gestures, animation или failure, которое трудно описать. Screenshot быстрее проверить, его нужно сделать в meaningful failure point. Provider recording и visual logs включаются согласно run type: full video для каждого high-volume smoke run может увеличить duration и storage cost. Artifacts нужно назвать с session и test identifier, задать retention и сделать доступными из report или CI job.

### Как безопасно подключить device farm к CI/CD?

**Ответ:**

Pipeline загружает build, начинает или запрашивает run, ждёт result, скачивает либо связывает artifacts и применяет agreed quality gate. Jenkins, GitHub Actions и GitLab CI могут использовать provider plugin, SDK, REST API или CLI. Access keys, local-tunnel credentials и build-signing material хранятся CI secret store. Нужны masked variables, least-privilege project access и explicit cleanup или expiry policy. CI job должна отличать provider outage от failed product test.

### Как масштабировать runs через parallel execution, sharding и session control?

**Ответ:**

Parallelism запускает independent sessions на нескольких devices одновременно. Sharding делит одну suite на deterministic groups, например по test class или tag, чтобы groups шли parallel. Concurrency задаётся по provider quota, device availability, backend capacity и budget, а не только числу tests. Каждая session требует isolated data, account, artifact path и retry policy. Provider APIs или CLI нужны для контроля queue, session status, cancellation и dynamic load distribution.

### Как измерять stability и поддерживать несколько providers?

**Ответ:**

Нужно отслеживать pass/fail/blocked results, queue time, device availability, duration, retry count, flaky rate, infrastructure failures и artifact completeness по provider и device. Test нельзя называть flaky, пока повторные evidence не отделили test instability от product или provider defect. Test code стоит держать provider-neutral, где возможно: отдельный layer содержит remote URL, authentication, capabilities, upload и artifact links. Второй provider нужен для resilience или regional needs, только если команда способна поддерживать и регулярно проверять integration.

---

## Ссылки на теорию

- [[12 Тестирование мобильных приложений]]
