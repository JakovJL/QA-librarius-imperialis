# Build Tools Maven Gradle

## Table of Contents

- [[#Why Build Tools Matter]]
- [[#What Maven and Gradle Solve]]
- [[#Maven Basics]]
- [[#Gradle Basics]]
- [[#Dependencies Plugins and Lifecycle]]
- [[#Maven vs Gradle]]
- [[#Build Tools in AQA]]
- [[#Interview Questions]]

**Related notes:** [[AQA Java eng]]

> [!caution] Not in the video course
> Zaur's courses end at Java Core — Maven/Gradle is not covered. This is the AQA layer: learn from this note + practice, and find video separately.

---

## Why Build Tools Matter

A Java project usually needs more than source code. It also needs:

- external libraries
- test dependencies
- compilation
- running tests
- packaging
- plugins for reports and code quality

Doing all of this manually would be slow and error-prone. **Build tools** automate these tasks.

The two most common Java build tools are:

- `Maven`
- `Gradle`

---

## What Maven and Gradle Solve

Both tools help manage a project in a structured way.

They can:

- download dependencies from repositories
- compile source code
- run tests
- package the project into JAR/WAR
- run plugins like Allure or Checkstyle

In simple words, a build tool answers: "How do I build, test, and run this project in a repeatable way?"

### Common Terms

| Term | Meaning |
|---|---|
| dependency | external library used by the project |
| plugin | extra tool that build system can run |
| repository | place where dependencies are downloaded from |
| build lifecycle | ordered steps of build process |

---

## Maven Basics

**Maven** is a declarative build tool. You describe the project in `pom.xml`, and Maven follows a standard lifecycle.

### Main File

```xml
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>1.0.0</version>
</project>
```

### Important Coordinates

- `groupId` - project group, often company or package style
- `artifactId` - project name
- `version` - project version

Together they identify the artifact uniquely.

### Dependencies Example

```xml
<dependencies>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.10.2</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### Common Maven Commands

```bash
mvn clean
mvn compile
mvn test
mvn package
```

> [!tip] Maven Idea
> Maven prefers convention over configuration. If the project follows standard structure, you often need less custom setup.

---

## Gradle Basics

**Gradle** is a build tool that is more flexible and script-based. It often uses `build.gradle` or `build.gradle.kts`.

### Simple Example

```groovy
plugins {
    id 'java'
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'
}
```

### Common Gradle Commands

```bash
gradle clean
gradle test
gradle build
```

Often projects use the wrapper:

```bash
./gradlew test
gradlew.bat test
```

The wrapper is useful because it keeps the Gradle version consistent for the whole team.

### Why People Like Gradle

- more flexible
- powerful scripting
- good for complex builds
- popular in many modern projects

> [!info] Groovy and Kotlin DSL
> Gradle build scripts can be written in Groovy (`build.gradle`) or Kotlin DSL (`build.gradle.kts`).

---

## Dependencies Plugins and Lifecycle

### Dependencies

Dependencies are external libraries your project needs.

Examples in AQA:

- JUnit
- Selenium
- REST Assured
- Allure
- Lombok

The build tool downloads them from repositories such as Maven Central.

### Plugins

Plugins extend the build process.

Examples:

- Surefire/Failsafe for tests in Maven
- Allure plugin
- compiler plugin
- JaCoCo for coverage

### Maven Lifecycle

Maven has a standard ordered lifecycle.

Common phases:

- `validate`
- `compile`
- `test`
- `package`
- `verify`
- `install`
- `deploy`

If you run `mvn test`, Maven runs all needed earlier phases before `test`.

### Gradle Tasks

Gradle works with **tasks** instead of the same strict lifecycle idea.

Examples:

- `clean`
- `compileJava`
- `test`
- `build`

The build is a graph of tasks with dependencies between them.

> [!warning] Dependency Scope Matters
> In Maven, scopes like `test`, `compile`, and `provided` affect where dependencies are available. For example, a test dependency should not be needed in production runtime.

---

## Maven vs Gradle

Both tools solve similar problems, but their style is different.

> [!tip] Quick Comparison
> | Tool | Strength | Typical trade-off |
> |---|---|---|
> | Maven | simple, standardized, predictable | less flexible |
> | Gradle | flexible, powerful, scriptable | can become more complex |

### Maven

- XML-based configuration
- stronger conventions
- easier to read for standard projects
- very common in backend and enterprise projects

### Gradle

- script-based configuration
- easier to customize deeply
- often faster in complex builds
- common in modern Java and Android projects

In interviews, a good answer is usually:

- Maven is simpler and more standardized
- Gradle is more flexible and programmable

---

## Build Tools in AQA

Build tools are central in automation projects.

### What They Usually Manage

- Selenium dependencies
- JUnit or TestNG
- REST Assured
- Allure reports
- execution of smoke/regression suites
- CI commands

### Maven Example for AQA

```xml
<dependencies>
    <dependency>
        <groupId>org.seleniumhq.selenium</groupId>
        <artifactId>selenium-java</artifactId>
        <version>4.22.0</version>
    </dependency>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.10.2</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### Why This Matters in AQA

- one command can run the whole test suite
- CI can run the same command on every build
- new developers can start project faster
- dependency versions stay controlled

### Good Practices

- keep dependency versions clear
- remove unused dependencies
- use wrapper for Gradle projects
- avoid random manual jar files in the project
- keep build config readable

> [!caution] Version Conflicts
> If two libraries require different versions of the same dependency, the build may still compile but fail in runtime. Dependency management is one of the reasons build tools are so important.

---

## Interview Questions

### Top 10

**1. What is a build tool in Java?**  
A build tool automates tasks such as dependency management, compilation, testing, packaging, and plugin execution.

**2. What is Maven?**  
Maven is a declarative Java build tool based on conventions and `pom.xml`.

**3. What is Gradle?**  
Gradle is a flexible build tool that uses scripts and tasks to define the build.

**4. What is a dependency?**  
An external library the project needs, for example JUnit or Selenium.

**5. What is `pom.xml`?**  
The main Maven configuration file where project coordinates, dependencies, plugins, and other settings are declared.

**6. What is the Gradle wrapper?**  
A project-provided script that runs Gradle with the correct version, so developers do not need to install the exact version manually.

**7. What happens when you run `mvn test`?**  
Maven runs all required earlier lifecycle phases and then executes the test phase.

**8. What is the difference between Maven and Gradle?**  
Maven is more standardized and convention-based. Gradle is more flexible and scriptable.

**9. Why are build tools important in AQA?**  
They manage automation dependencies, test execution, reports, and CI integration.

**10. What is a plugin in a build tool?**  
A plugin extends build functionality, for example running tests, generating reports, or checking code quality.

---

### Tricky Questions

**1. Can a project work without Maven or Gradle?**  
Yes, technically, but managing dependencies and build steps manually becomes hard very quickly.

**2. Why is Maven often easier for beginners?**  
Because it has strong conventions and predictable structure, so there are fewer decisions to make.

**3. Why can Gradle be more powerful in complex projects?**  
Because it is more programmable and flexible, so complex workflows can be modeled more easily.

**4. What is the risk of unused dependencies?**  
They increase build size, can slow downloads, create conflicts, and make the project harder to maintain.

**5. Why is it better to use repository-based dependencies than local jar files?**  
Because repository-based dependencies are versioned, repeatable, easier for CI, and easier for the whole team to manage.
