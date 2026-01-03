# Console-Based Library Management System

## Project Description
A Java console application for managing library operations including book tracking, member management, and borrowing system with file-based data persistence.

## Features
- Add, remove, and search for books
- Register and manage library members
- Borrow and return books with due dates
- Calculate overdue fines
- File-based data persistence using text files
- Console-based menu with input validation
- Library statistics generation

## How to Run

### Using `javac` / `java`
```bash
javac -d bin src/main/java/library/*.java
java -cp bin library.Main
```

### Using Maven
```bash
mvn compile
mvn exec:java -Dexec.mainClass="library.Main"
```

## Code Structure
- `src/main/java/library/Book.java` – Book entity
- `src/main/java/library/Member.java` – Member entity
- `src/main/java/library/Library.java` – Core library logic
- `src/main/java/library/FileHandler.java` – File I/O (books and members)
- `src/main/java/library/Main.java` – Console user interface
- `data/books.txt` – Stored books data
- `data/members.txt` – Stored members data

## Testing
- Manually test operations from the console menu:
  - Add books and list them
  - Register members
  - Borrow and return books
  - Verify due dates and overdue fine calculation
  - Restart the program and verify data is loaded from files
