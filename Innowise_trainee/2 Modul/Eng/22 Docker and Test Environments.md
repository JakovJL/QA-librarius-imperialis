# Docker and Test Environments

## Table of Contents

- [[#What a Test Environment Is]]
- [[#Virtualization and Containerization]]
	- [[#Snapshot VM]]
- [[#Docker Basics]]
- [[#Docker in AQA]]
- [[#Common Problems]]
- [[#Interview Questions]]
	- [[#Beginner Questions]]
	- [[#Intermediate Questions]]
	- [[#Advanced Questions]]
	- [[#Code Questions]]

**Related notes:** [[AQA Java eng]]

---

## What a Test Environment Is

A **test environment** is a place where testers run checks against an application.

It can include:

- application build
- database
- browser
- test data
- external service mocks
- configuration

**Goal:** make test results repeatable and close enough to real usage.

---

## Virtualization and Containerization

**Virtualization** runs a full virtual machine with its own operating system.

**Containerization** runs an isolated process that shares the host operating system kernel.

| | Virtual machine | Container |
|---|---|---|
| Startup | slower | faster |
| Size | larger | smaller |
| Isolation | stronger | good but lighter |
| Common tool | VMware, VirtualBox | Docker |

### Snapshot VM

A **snapshot** is a saved state of a virtual machine at a specific moment.

**Goal:** return quickly to the same environment state without reinstalling everything.

**When to use:**
- restore a clean test state
- switch between configurations
- return to a known point after a failed deploy or broken setup

**Snapshot vs backup:**
- a snapshot is fast and tied to the VM state
- a backup is a more complete long-term copy used for recovery

---

## Docker Basics

**Docker** is a tool for building and running containers.

Important terms:

| Term | Meaning |
|---|---|
| image | template for a container |
| container | running instance of an image |
| Dockerfile | file with image build steps |
| Docker Compose | tool for running several containers together |
| volume | persistent or shared storage |

Common commands:

```bash
docker ps
docker run nginx
docker compose up
docker compose down
```

---

## Docker in AQA

AQA engineers use Docker to:

- run databases for tests
- start mock services
- run Selenium Grid → see [[25 Selenium Grid]]
- create stable CI environments
- reproduce bugs locally

Example `docker-compose.yml` idea:

```yaml
services:
  db:
    image: postgres:16
    ports:
      - "5432:5432"
```

---

## Common Problems

| Problem | Cause |
|---|---|
| Works locally but not in CI | different environment variables or ports |
| Container starts slowly | test does not wait for service readiness |
| Data is dirty | database is not cleaned before tests |
| Port conflict | another service already uses the port |

Good practices:

- keep environment setup scripted
- wait for service readiness, not only for container start
- clean test data
- keep secrets outside Docker files

---

## Interview Questions

### Beginner Questions

**1. What is Docker?**
Docker is a tool for running applications in containers.

**2. What is a container?**
A container is an isolated running instance based on an image.

### Intermediate Questions

**3. Why is Docker useful for AQA?**
It gives repeatable environments for databases, services, and CI runs.

**4. What is Docker Compose?**
Docker Compose runs several related containers together.

### Advanced Questions

**5. Why can a container be running but the service still not be ready?**
The process may have started, but the application inside still needs time to initialize.

### Code Questions

**6. What does this command do?**

```bash
docker compose up
```

It starts services described in the Docker Compose file.
