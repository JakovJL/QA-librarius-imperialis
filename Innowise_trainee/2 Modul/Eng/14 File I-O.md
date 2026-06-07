# File I/O

## Table of Contents

- [[#Why File I-O Matters]]
- [[#Path File and Files]]
- [[#Reading Files]]
- [[#Writing Files]]
- [[#Byte Streams and Character Streams]]
- [[#Try-With-Resources and File Errors]]
- [[#File I-O in AQA]]
- [[#Interview Questions]]

**Related notes:** [[AQA Java eng]]

> [!info] Video Course (Zaur Tregulov)
> Course 2 (Black Belt): File I/O and NIO.

---

## Why File I-O Matters

Programs often need to work not only with memory, but also with files on disk. For example:

- read config files
- save logs
- load test data from JSON or CSV
- write reports
- check whether a download exists

This is called **File I/O**, where:

- `I` means input
- `O` means output

In Java, file work is usually done through the `java.nio.file` package and stream/reader/writer classes.

---

## Path File and Files

Modern Java usually prefers `Path` and `Files` from `java.nio.file`.

### `Path`

`Path` represents a file or directory path.

```java
Path path = Path.of("data", "users.txt");
System.out.println(path); // data\users.txt or data/users.txt
```

You can build paths in a platform-friendly way without manually writing separators.

### `Files`

`Files` is a utility class with common operations for paths.

```java
Path path = Path.of("data/users.txt");

System.out.println(Files.exists(path));
System.out.println(Files.isRegularFile(path));
System.out.println(Files.isDirectory(path));
```

### Older `File`

Before NIO.2, Java used `java.io.File`.

```java
File file = new File("data/users.txt");
System.out.println(file.exists());
```

`File` is still seen in old code, but for new code `Path` and `Files` are usually clearer and more powerful.

> [!tip] Default Choice
> In modern Java, start with `Path` and `Files`. Learn `File` too, because older codebases still use it.

---

## Reading Files

### Read All Text

```java
Path path = Path.of("data/config.txt");
String text = Files.readString(path);
System.out.println(text);
```

This is convenient for small text files.

### Read All Lines

```java
List<String> lines = Files.readAllLines(Path.of("data/users.txt"));
lines.forEach(System.out::println);
```

This gives a list where each element is one line.

### Buffered Reading

For larger files, use `BufferedReader`.

```java
try (BufferedReader reader = Files.newBufferedReader(Path.of("data/users.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}
```

### Read Bytes

```java
byte[] bytes = Files.readAllBytes(Path.of("image.png"));
System.out.println(bytes.length);
```

Use this for binary files such as images, PDFs, or downloaded archives.

---

## Writing Files

### Write Full Text

```java
Path path = Path.of("output/result.txt");
Files.writeString(path, "Test passed");
```

If the file exists, its content is replaced by default.

### Write Lines

```java
List<String> report = List.of("Test 1: PASS", "Test 2: FAIL");
Files.write(Path.of("output/report.txt"), report);
```

### Append to File

```java
Files.writeString(
    Path.of("logs/app.log"),
    "New log line\n",
    StandardOpenOption.CREATE,
    StandardOpenOption.APPEND
);
```

### Create Directories

```java
Path dir = Path.of("output/reports");
Files.createDirectories(dir);
```

This is useful before saving screenshots or reports.

> [!warning] Parent Folder Must Exist
> If you try to write to a file inside a folder that does not exist, Java may throw an exception. Create directories first when needed.

---

## Byte Streams and Character Streams

Java has two big groups of I/O classes.

### Byte Streams

Used for binary data.

Common classes:

- `InputStream`
- `OutputStream`
- `FileInputStream`
- `FileOutputStream`

Example:

```java
try (InputStream in = new FileInputStream("photo.png")) {
    int b;
    while ((b = in.read()) != -1) {
        // process byte
    }
}
```

### Character Streams

Used for text data.

Common classes:

- `Reader`
- `Writer`
- `FileReader`
- `FileWriter`
- `BufferedReader`
- `BufferedWriter`

Example:

```java
try (BufferedWriter writer = Files.newBufferedWriter(Path.of("output.txt"))) {
    writer.write("Hello");
}
```

### Which One to Use

- Use byte streams for images, PDFs, archives, executables
- Use character streams for text files like `.txt`, `.csv`, `.json`, `.xml`

> [!info] Encoding Matters
> Text is stored as bytes on disk. Java converts bytes to characters using an encoding like UTF-8. If encoding is wrong, text may look broken.

---

## Try-With-Resources and File Errors

File work often involves resources that must be closed. The best way is **try-with-resources**.

```java
try (BufferedReader reader = Files.newBufferedReader(Path.of("data.txt"))) {
    System.out.println(reader.readLine());
} catch (IOException e) {
    e.printStackTrace();
}
```

### Why It Helps

- closes file automatically
- code is shorter
- safer than manual close in `finally`

### Common Exceptions

- `IOException`
- `FileNotFoundException`
- `NoSuchFileException`
- `AccessDeniedException`

### Typical Problems

- wrong path
- missing file
- no permission
- file locked by another process
- wrong encoding

> [!caution] Relative Paths
> Relative paths depend on the working directory of the application. In tests, this can be confusing. When debugging file problems, always check from which folder the program is actually running.

---

## File I/O in AQA

File operations are very common in test automation.

### Typical Cases

- read test data from JSON, CSV, or properties files
- save API responses for debugging
- check downloaded files
- write custom logs
- store screenshots and attachments

### Example: Read Test Data

```java
String json = Files.readString(Path.of("src/test/resources/data/user.json"));
System.out.println(json);
```

### Example: Check Download

```java
Path downloaded = Path.of("downloads/report.pdf");
if (!Files.exists(downloaded)) {
    throw new AssertionError("Downloaded file not found");
}
```

### Good Practices

- keep test data in `src/test/resources`
- use `Path.of(...)` instead of hardcoded separators
- use try-with-resources
- do not hardcode absolute paths unless necessary
- clean temporary files if tests create them

> [!tip] Good Rule for AQA
> If a test works with files, think about three things: where the file comes from, where it will be saved, and who will clean it after the test.

---

## Interview Questions

### Top 10

**1. What is File I/O in Java?**  
It is reading data from files and writing data to files or other external sources.

**2. What is the difference between `Path` and `File`?**  
`File` is the older API. `Path` is the modern NIO.2 API and works better with `Files` utility methods.

**3. What does `Files.readString()` do?**  
It reads the whole text file into one `String`.

**4. What is the difference between byte streams and character streams?**  
Byte streams work with raw bytes, usually for binary data. Character streams work with text data.

**5. Why is try-with-resources important for file work?**  
It closes readers, writers, and streams automatically, making code safer and shorter.

**6. What exception is common in file operations?**  
`IOException` and its subclasses are very common.

**7. What does `Files.exists(path)` check?**  
It checks whether a path exists on disk.

**8. How do you append text to a file?**  
Use `Files.writeString()` with `StandardOpenOption.APPEND` and usually `CREATE`.

**9. Where is test data usually stored in Java test projects?**  
Often in `src/test/resources`.

**10. When would you read a file as bytes instead of text?**  
When the file is binary, such as image, PDF, zip, or other non-text content.

---

### Tricky Questions

**1. Does `Files.readAllLines()` work well for huge files?**  
Not always. It loads all lines into memory. For very large files, buffered reading is safer.

**2. Why can a file path work on one machine and fail on another?**  
Because of different working directories, separators, permissions, or missing files.

**3. Can `Files.writeString()` create a file?**  
Yes, depending on options and method behavior. But parent directories must still exist.

**4. What is the difference between `Files.createDirectory()` and `Files.createDirectories()`?**  
`createDirectory()` creates one directory and fails if parent is missing. `createDirectories()` creates missing parent directories too.

**5. Why is hardcoding absolute paths in tests usually bad?**  
Because such tests become environment-dependent and break on other machines or CI servers.
