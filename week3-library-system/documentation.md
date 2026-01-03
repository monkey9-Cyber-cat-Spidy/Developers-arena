# Console-Based Library Management System – Documentation

## 1. Project Overview

### 1.1 Goals
The Console-Based Library Management System is a Java application that helps librarians manage books and members through a simple command-line interface. It demonstrates core Java programming concepts, including object-oriented design, collections, and file-based persistence.

### 1.2 Objectives
- Maintain a collection of books with details such as ISBN, title, author, and publication year.
- Manage library members and track which books each member has borrowed.
- Support borrowing and returning books with automatic due date calculation.
- Persist books and members to text files so data is retained between program runs.
- Provide clear, validated console input and informative feedback messages.

---

## 2. Setup Instructions

### 2.1 Prerequisites
- Java Development Kit (JDK) 17 or compatible.
- (Optional) Apache Maven for building and running the project.
- Command-line terminal (PowerShell, Command Prompt, or similar).

### 2.2 Project Structure
The project is organized as follows:

- `src/main/java/library/`
  - `Book.java`
  - `Member.java`
  - `Library.java`
  - `FileHandler.java`
  - `Main.java`
- `src/main/resources/` (currently unused, reserved for future resources)
- `data/books.txt`
- `data/members.txt`
- `pom.xml`
- `README.md`
- `documentation.md`

### 2.3 Build and Run with Maven
1. Open a terminal in the project root directory (`week3-library-system`).
2. Compile the project:
   ```bash
   mvn compile
   ```
3. Run the application:
   ```bash
   mvn exec:java -Dexec.mainClass="library.Main"
   ```

### 2.4 Build and Run with `javac` / `java`
1. Open a terminal in the project root directory (`week3-library-system`).
2. Compile the Java source files into the `bin` directory:
   ```bash
   javac -d bin src/main/java/library/*.java
   ```
3. Run the application:
   ```bash
   java -cp bin library.Main
   ```

---

## 3. Code Structure

### 3.1 Packages and Files

- **Package:** `library`
  - `Book.java` – Represents a book entity with fields such as ISBN, title, author, publication year, availability, borrower, and due date. Includes an `isOverdue()` helper.
  - `Member.java` – Represents a library member with an ID, name, and a list of borrowed book ISBNs.
  - `Library.java` – Core business logic for managing books and members (add/remove/search books, register members, borrow/return, statistics, fine calculation).
  - `FileHandler.java` – Handles file input/output operations for loading and saving books and members from/to text files.
  - `Main.java` – Entry point and console-based user interface that displays menus, reads input, and delegates operations to `Library`.

- **Data files:**
  - `data/books.txt` – Persistent storage for book records.
  - `data/members.txt` – Persistent storage for member records.

### 3.2 Responsibilities
- **Main** handles menu display and input validation.
- **Library** manages in-memory collections of books and members and coordinates operations.
- **FileHandler** converts in-memory objects to text file format and back.
- **Book** and **Member** are simple domain models representing entities.

---

## 4. Technical Details

### 4.1 Architecture
The application follows a simple layered architecture:
- **Presentation layer:** `Main` (console UI and user input handling).
- **Domain layer:** `Book`, `Member`, `Library` (domain models and business logic).
- **Persistence layer:** `FileHandler` (reading and writing text files in the `data` folder).

### 4.2 Data Structures
- `ArrayList<Book>` to store the list of books in `Library`.
- `ArrayList<Member>` to store the list of members in `Library`.
- `List<String>` in `Member` for tracking borrowed book ISBNs.
- Java Streams are used for searching and counting (e.g., `searchBooks`, `displayStatistics`).

### 4.3 Algorithms and Logic

#### 4.3.1 Book Search
- Input: keyword string from the user.
- Logic: filter the books list where the keyword (case-insensitive) appears in the book's title or author.
- Implementation: `books.stream().filter(...).collect(Collectors.toList())`.

#### 4.3.2 Borrowing a Book
1. Find the book by ISBN.
2. Find the member by ID.
3. Validate:
   - Book exists and is available.
   - Member exists.
4. If valid:
   - Mark book as not available.
   - Set `borrowedBy` to the member's ID.
   - Set `dueDate` to `LocalDate.now().plusWeeks(2)`.
   - Add the book's ISBN to the member's `borrowedIsbns` list.
   - Save updated books and members using `FileHandler`.

#### 4.3.3 Returning a Book and Calculating Fines
1. Find the book by ISBN and the member by ID.
2. Validate:
   - Book exists and is currently borrowed.
   - Member exists and has that ISBN in their borrowed list.
3. Calculate fine:
   - If `book.isOverdue()` is `false`, fine is 0.
   - Otherwise, compute `daysOverdue` as the number of days between `dueDate` and `LocalDate.now()`.
   - Fine = `daysOverdue * finePerDay` (e.g., 1.0 per day).
4. Clear book's `borrowedBy` and `dueDate`, set available to `true`, and remove ISBN from member's list.
5. Save the updated state using `FileHandler`.

#### 4.3.4 Statistics
- Compute counts such as:
  - Total books = `books.size()`.
  - Available books = number of books with `isAvailable() == true`.
  - Borrowed books = `totalBooks - availableBooks`.
  - Registered members = `members.size()`.
  - Overdue books = count of books where `!isAvailable()` and `isOverdue()` is `true`.

### 4.4 File Formats

**Books (`data/books.txt`)**
- One book per line, with fields separated by `;`:
  - `isbn;title;author;year;available;borrowedBy;dueDate`
- `available` is `true` or `false`.
- `borrowedBy` is a member ID or empty if the book is not borrowed.
- `dueDate` is `YYYY-MM-DD` or empty if the book is not borrowed.

**Members (`data/members.txt`)**
- One member per line, with fields separated by `;`:
  - `id;name;isbn1,isbn2,isbn3`
- The third field is a comma-separated list of borrowed ISBNs, or empty if none.

---

## 5. Testing Evidence

### 5.1 Manual Test Cases

Below are example manual test scenarios used to validate the system:

1. **Add and List Books**
   - Steps:
     - Start the application.
     - Choose "1. Add New Book" and enter details for several books.
     - Choose "2. View All Books".
   - Expected Result: All added books appear in the list with correct details and marked as "Available".

2. **Search Books by Keyword**
   - Steps:
     - Add books with different titles and authors.
     - Choose "3. Search Books" and enter a partial title or author.
   - Expected Result: Only books whose title or author contains the keyword (case-insensitive) are displayed.

3. **Register Members**
   - Steps:
     - Choose "4. Register Member".
     - Enter new member IDs and names.
     - Restart the application.
   - Expected Result: Registered members are still available after restart, confirming file persistence.

4. **Borrow Book (Normal Case)**
   - Steps:
     - Ensure there is at least one available book and a registered member.
     - Choose "5. Borrow Book" and enter the book's ISBN and the member's ID.
   - Expected Result:
     - Book status changes to borrowed and shows the member ID when listed.
     - A due date 2 weeks from the current date is displayed.
     - Member's borrowed list is updated.

5. **Borrow Book (Error Cases)**
   - Steps:
     - Try borrowing with a non-existing ISBN.
     - Try borrowing with a non-existing member ID.
     - Try borrowing a book that is already borrowed.
   - Expected Result: User-friendly error messages are shown and no invalid state is saved.

6. **Return Book and Fine Calculation**
   - Steps:
     - Borrow a book for a member.
     - Choose "6. Return Book" with correct ISBN and member ID.
   - Expected Result (on time): Book becomes available, member no longer lists that ISBN, and fine is `0.00`.
   - For overdue testing: manually set the `dueDate` in `books.txt` to a past date, then return the book and confirm that a positive fine is displayed.

7. **Statistics Validation**
   - Steps:
     - Perform various operations: add books, register members, borrow and return books.
     - Choose "7. View Library Statistics".
   - Expected Result: The counts of total, available, borrowed, and overdue books, as well as registered members, match the current state of the data.

### 5.2 Persistence Verification
- After performing some operations (adding books, registering members, borrowing books), exit the application and run it again.
- Verify that books and members are reloaded properly and that borrowed statuses are preserved, confirming correct file I/O behavior.
