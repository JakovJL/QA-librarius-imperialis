# Databases

## Table of Contents

- [[#Questions and Answers]]
	- [[#What Types of Databases Should an Automation QA Know?]]
	- [[#What Are Primary Keys, Foreign Keys, and Constraints?]]
	- [[#How Do SELECT, INSERT, UPDATE, and DELETE Differ?]]
	- [[#When Do You Use DISTINCT and ORDER BY?]]
	- [[#How Do INNER JOIN and OUTER JOIN Differ?]]
	- [[#What Are Subqueries, UNION, INTERSECT, and EXCEPT?]]
	- [[#How Do Aggregate Functions, GROUP BY, and HAVING Work?]]
	- [[#How Should an Automated Test Connect to a Database?]]
	- [[#How Do You Keep Database Test Data Safe and Isolated?]]
	- [[#What Is an Index and When Does It Help?]]
	- [[#What Are Views, Stored Procedures, and Triggers?]]
	- [[#What Is PL/SQL and How Can It Be Tested?]]
	- [[#How Do NoSQL, Big Data, and TimescaleDB Fit In?]]
	- [[#How Do You Test and Diagnose a Database-Backed Feature?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Questions and Answers

### What Types of Databases Should an Automation QA Know?

**Answer:**

A relational database stores data in related tables and is usually queried with SQL. PostgreSQL, Oracle Database, and Microsoft SQL Server are examples. It is a good choice when relationships, transactions, and consistent rules are important.

NoSQL is a broad group of databases with different models: document, key-value, wide-column, and graph. It is not one product and does not guarantee the same query language, transaction model, or consistency behaviour as a relational database. Learn the model and guarantees of the specific database on the project.

### What Are Primary Keys, Foreign Keys, and Constraints?

**Answer:**

A primary key uniquely identifies a row and cannot be `NULL`. A foreign key refers to a primary key or unique key in another table and protects referential integrity. For example, an `orders.customer_id` foreign key should point to an existing customer.

Other common constraints are `NOT NULL`, `UNIQUE`, `CHECK`, and a default value. A database should reject data that violates a constraint. Tests must assert both the valid path and the expected error for invalid data.

### How Do SELECT, INSERT, UPDATE, and DELETE Differ?

**Answer:**

`SELECT` reads rows. `INSERT` creates rows. `UPDATE` changes existing rows. `DELETE` removes rows. `UPDATE` and `DELETE` without a correct `WHERE` condition can affect many rows, so they are high-risk commands.

In an automated test, use parameterised queries or a prepared statement. Never build SQL by joining untrusted text into a query. Check the affected-row count and read the result again when that makes the assertion clearer.

### When Do You Use DISTINCT and ORDER BY?

**Answer:**

`DISTINCT` removes duplicate rows from a query result. `ORDER BY` defines the returned order by one or more columns. Without `ORDER BY`, SQL does not promise a stable row order, even if a result looks ordered in a test environment.

Use explicit ordering when a test compares a list or checks the first result. Do not use `DISTINCT` to hide an incorrect join that creates duplicates.

### How Do INNER JOIN and OUTER JOIN Differ?

**Answer:**

An `INNER JOIN` returns rows that have matching values on both sides. A `LEFT OUTER JOIN` returns every row from the left table and matching rows from the right table; unmatched right-side columns are `NULL`. A `RIGHT OUTER JOIN` is the opposite direction. A `FULL OUTER JOIN` returns matched and unmatched rows from both tables when the database supports it.

Choose the join by the question. For example, use a left join to find customers who have no orders. Always state the join condition; a missing or wrong condition can produce an incorrect Cartesian product.

### What Are Subqueries, UNION, INTERSECT, and EXCEPT?

**Answer:**

A subquery is a query inside another SQL statement. It can provide a value, a list of values, or a temporary result table. `UNION` combines compatible result sets and removes duplicates; `UNION ALL` keeps duplicates. `INTERSECT` returns common rows, and `EXCEPT` returns rows from the first result that are absent from the second.

These operators require compatible columns and their exact support can differ by database dialect. Read the documentation of the database used by the project.

### How Do Aggregate Functions, GROUP BY, and HAVING Work?

**Answer:**

`COUNT`, `SUM`, `MIN`, `MAX`, and `AVG` calculate a value for many rows. `GROUP BY` makes one aggregate result for each group, such as each customer or day. `HAVING` filters groups after aggregation; `WHERE` filters individual rows before grouping.

For example, to find customers with more than three orders, group orders by customer and use `HAVING COUNT(*) > 3`.

### How Should an Automated Test Connect to a Database?

**Answer:**

In Java, a test normally uses JDBC and the project driver. Keep the URL, user, password, schema, and SSL settings in environment-specific configuration or a secret store, not in source code. Use a least-privilege test account.

Open connections, statements, and result sets only for the needed scope and close them reliably, for example with `try-with-resources`. Use a connection pool only when the project needs repeated connections; do not share one mutable connection between parallel tests.

### How Do You Keep Database Test Data Safe and Isolated?

**Answer:**

Prefer a dedicated test database or schema and unique test data, for example a generated customer ID. Create only the data required by the scenario and clean it up in a defined order that respects foreign keys.

A transaction can make a group of changes all-or-nothing, so a test may roll back its own direct database setup. However, a system under test can write through another connection and transaction; rolling back the test connection will not undo that data. In that case, use an API or database cleanup designed for the test environment. Never run destructive cleanup against production.

### What Is an Index and When Does It Help?

**Answer:**

An index is an additional data structure that can help a database find rows for a `WHERE` or `JOIN` condition without scanning the whole table. It can improve read speed, but the database must maintain it when rows change, so it adds storage and write cost.

Do not assume an index is used because it exists. Check the execution plan in the target database and test realistic data volume before making a performance conclusion.

### What Are Views, Stored Procedures, and Triggers?

**Answer:**

A view is a named query that applications can read like a table; a materialized view, where supported, stores a refreshed result. A stored procedure is database-side program code that is called explicitly. A trigger runs automatically when a configured database event happens, for example before or after an `INSERT`, `UPDATE`, or `DELETE`.

For testing, know hidden effects: a trigger can change data or create an audit row, and a procedure can commit, validate, or update several tables. Test its input, result, errors, permissions, and side effects.

### What Is PL/SQL and How Can It Be Tested?

**Answer:**

PL/SQL is Oracle Database's procedural extension of SQL. It adds variables, conditions, loops, exception handling, functions, packages, and procedures around SQL statements. Microsoft SQL Server uses T-SQL, which is a different dialect.

To test PL/SQL automation code, call the procedure or function with known input, verify its returned values or output parameters, database changes, errors, transaction behaviour, and permissions. Use a safe test schema and clean up created data.

### How Do NoSQL, Big Data, and TimescaleDB Fit In?

**Answer:**

For a NoSQL database, test the project contract with its own query API, data model, indexes, partitioning or sharding, and consistency guarantees. A test written for PostgreSQL cannot be copied unchanged to MongoDB, Redis, Cassandra, or a graph database.

Big Data systems often process large or streaming datasets with distributed storage and computation. TimescaleDB is a PostgreSQL extension for time-series data, such as metrics or sensor events. It is useful in that domain but is not a general replacement for every Big Data system.

### How Do You Test and Diagnose a Database-Backed Feature?

**Answer:**

Start with the business action: call the UI or API, then verify the expected database state with a focused read-only query. Check stored values, relationships, constraints, timestamps, and any expected audit or event record. Do not make the database query the only assertion when the user-visible result is important.

When a test fails, keep the correlation ID, request data, query, result, database error, and time window. Check transaction commit or rollback, connection settings, permissions, locks or deadlocks, trigger and procedure side effects, and eventual-consistency delay before deciding that the product logic is wrong.

---

## Theory Links

- [[13 Databases]]
