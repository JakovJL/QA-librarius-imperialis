# Docker и тестовые окружения

## Содержание

- [[#Что такое тестовое окружение]]
- [[#Виртуализация и контейнеризация]]
	- [[#Snapshot VM]]
- [[#Основы Docker]]
- [[#Docker в AQA]]
- [[#Частые проблемы]]
- [[#Вопросы для собеседования]]
	- [[#Вопросы начального уровня]]
	- [[#Вопросы среднего уровня]]
	- [[#Вопросы повышенного уровня]]
	- [[#Вопросы с кодом]]

**Связанные заметки:** [[AQA Java rus]]

---

## Что такое тестовое окружение

**Тестовое окружение** — это место, где тестировщики выполняют проверки приложения.

Оно может включать:

- application build
- database
- browser
- test data
- mocks внешних сервисов
- configuration

**Цель:** сделать результаты тестов повторяемыми и достаточно близкими к реальному использованию.

---

## Виртуализация и контейнеризация

**Virtualization** запускает полноценную virtual machine со своей operating system.

**Containerization** запускает изолированный process, который разделяет kernel host operating system.

| | Virtual machine | Container |
|---|---|---|
| Startup | медленнее | быстрее |
| Size | больше | меньше |
| Isolation | сильнее | хорошая, но легче |
| Common tool | VMware, VirtualBox | Docker |
ц
### Snapshot VM

**Snapshot** — это сохранённое состояние virtual machine в конкретный момент времени.

**Цель:** быстро вернуться к тому же состоянию окружения без полной переустановки.

**Когда использовать:**
- восстановить чистое test state
- переключаться между конфигурациями
- вернуться к известной точке после failed deploy или сломанной настройки

**Snapshot vs backup:**
- snapshot быстрый и привязан к состоянию VM
- backup — более полная долгосрочная копия для восстановления

---

## Основы Docker

**Docker** — это tool для сборки и запуска containers.

Важные термины:

| Термин | Значение |
|---|---|
| image | шаблон для container |
| container | запущенный instance image |
| Dockerfile | файл с шагами сборки image |
| Docker Compose | tool для запуска нескольких containers вместе |
| volume | постоянное или общее хранилище |

Частые команды:

```bash
docker ps
docker run nginx
docker compose up
docker compose down
```

---

## Docker в AQA

AQA-инженеры используют Docker, чтобы:

- запускать databases для tests
- поднимать mock services
- запускать Selenium Grid → см. [[25 Selenium Grid]]
- создавать стабильные CI environments
- воспроизводить bugs локально

Идея `docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:16
    ports:
      - "5432:5432"
```

---

## Частые проблемы

| Проблема | Причина |
|---|---|
| Работает локально, но не в CI | разные environment variables или ports |
| Container стартует медленно | test не ждёт service readiness |
| Данные загрязнены | database не очищается перед tests |
| Port conflict | другой service уже использует port |

Хорошие практики:

- держи setup окружения в scripts
- жди service readiness, а не только container start
- очищай test data
- держи secrets вне Docker files

---

## Вопросы для собеседования

### Вопросы начального уровня

**1. Что такое Docker?**
Docker — это tool для запуска приложений в containers.

**2. Что такое container?**
Container — это изолированный запущенный instance на основе image.

### Вопросы среднего уровня

**3. Почему Docker полезен для AQA?**
Он даёт повторяемые environments для databases, services и CI runs.

**4. Что такое Docker Compose?**
Docker Compose запускает несколько связанных containers вместе.

### Вопросы повышенного уровня

**5. Почему container может быть running, но service ещё не готов?**
Process мог стартовать, но application внутри ещё нужно время для initialization.

### Вопросы с кодом

**6. Что делает эта команда?**

```bash
docker compose up
```

Она запускает services, описанные в Docker Compose file.
