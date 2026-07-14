# Project Management and Package Manager

## Table of Contents

- [[#Matrix Scope]]
- [[#Questions and Answers]]
	- [[#Why Do We Need Package and Build Tools?]]
	- [[#How Does Maven Work?]]
	- [[#How Does Gradle Differ From Maven?]]
- [[#How Do npm and Yarn Manage a JavaScript Project?]]
- [[#How Are Dependencies and Versions Managed?]]
- [[#What Are Lock Files and Should They Be Committed?]]
	- [[#How Do Repositories and Build Parameters Work?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Matrix Scope

This note covers:

- Purpose of package and build tools: Maven, Gradle, Ant, npm, Yarn, pip, NuGet, and Poetry.
- Dependencies, repositories, lifecycle tasks, configuration, versions, and lock files.
- Third-party repositories and parameterised builds.

---

## Questions and Answers

### Why Do We Need Package and Build Tools?

**Short answer:**

They download and manage dependencies, resolve versions, compile code, run tests, package artifacts, and provide repeatable commands for local and CI work. Examples include Maven and Gradle for Java, npm or Yarn for JavaScript, pip or Poetry for Python, and NuGet for .NET.

### How Does Maven Work?

**Short answer:**

Maven uses `pom.xml` to define project coordinates, properties, dependencies, plugins, repositories, and build settings. Maven has three built-in lifecycles: `default`, `clean`, and `site`. `clean` is a phase of the `clean` lifecycle; `compile`, `test`, `package`, `verify`, and `install` are phases of the `default` lifecycle. Commands should produce the same result locally and in CI when inputs are controlled.

### How Does Gradle Differ From Maven?

**Short answer:**

Gradle uses a programmable build model with Groovy or Kotlin DSL and task graphs. It is flexible and supports incremental builds and caching. Maven is more convention-driven and uses XML. Both can manage Java dependencies and tests; the project should avoid unnecessary custom build logic.

### How Do npm and Yarn Manage a JavaScript Project?

**Short answer:**

`package.json` describes a JavaScript project: its name, version, scripts, dependencies, development dependencies, and configuration. I run a script with `npm run <script>` or `yarn <script>` and pass a value through an environment variable when the project supports it, for example `BASE_URL=https://test.example npm run test`.

**Dependencies:**

- `dependencies` are needed when the application runs in production.
- `devDependencies` are used for development, testing, linting, or building.
- `npm install <package>` adds a runtime dependency; `npm install -D <package>` adds a development dependency. Yarn has equivalent commands.
- A production installation can omit development dependencies, for example with `npm ci --omit=dev`.

### How Are Dependencies and Versions Managed?

**Short answer:**

A dependency declaration includes group, artifact, version, and scope or configuration. I prefer controlled versions, review transitive dependencies, and use dependency locking or a Bill of Materials where appropriate. SemVer uses `major.minor.patch`; a major change can break compatibility, while minor and patch releases should be backward compatible under SemVer rules.

For npm ranges, `1.2.3` means one exact version, `^1.2.3` allows compatible versions below `2.0.0`, `~1.2.3` allows patch updates below `1.3.0`, and `*` allows any version. A committed lock file wins for normal reproducible installation: the package manager installs its exact resolved version rather than selecting a newer version allowed by `^` or `~`.

### What Are Lock Files and Should They Be Committed?

**Short answer:**

Tools such as npm, Yarn, and Poetry use lock files to record exact resolved versions. `package-lock.json` belongs to npm; `yarn.lock` belongs to Yarn. They are normally committed for applications so local and CI installations stay reproducible. Maven and Gradle use different dependency-locking mechanisms rather than `package-lock.json`.

### How Do Repositories and Build Parameters Work?

**Short answer:**

Dependencies can come from public or private repositories such as Maven Central, an internal Nexus, or Artifactory. Credentials belong in secure settings, not source files. Build parameters can select environment, tags, browser, or feature flags, but the build should validate values and keep defaults clear. Examples are Maven `-Denv=test`, Gradle `-Penv=test`, or an npm environment variable.

**Installing a library:**

- Java: declare the dependency in `pom.xml` or `build.gradle`; Maven or Gradle resolves it from configured repositories.
- JavaScript: use `npm install <package>` or `yarn add <package>`.
- Python: use `pip install <package>`.
- Ant: add the library to the project classpath, usually by a dependency-management task or a repository tool.

---

## Theory Links

- [[15 Build Tools Maven Gradle]]
