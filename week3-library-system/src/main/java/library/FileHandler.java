package library;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.FileWriter;
import java.io.FileReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class FileHandler {

    private static final String DATA_DIR = "data";
    private static final String BOOKS_FILE = DATA_DIR + File.separator + "books.txt";
    private static final String MEMBERS_FILE = DATA_DIR + File.separator + "members.txt";

    public FileHandler() {
        ensureDataDirectory();
    }

    private void ensureDataDirectory() {
        File dir = new File(DATA_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    // ===== Books =====
    public List<Book> loadBooks() {
        List<Book> books = new ArrayList<>();
        Path path = Paths.get(BOOKS_FILE);

        if (!Files.exists(path)) {
            return books; // no books yet
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(BOOKS_FILE))) {
            String line;
            while ((line = reader.readLine()) != null) {
                // isbn;title;author;year;available;borrowedBy;dueDate
                String[] parts = line.split(";", -1);
                if (parts.length < 7) continue;

                String isbn = parts[0];
                String title = parts[1];
                String author = parts[2];
                int year = Integer.parseInt(parts[3]);
                boolean available = Boolean.parseBoolean(parts[4]);
                String borrowedBy = parts[5].isEmpty() ? null : parts[5];
                LocalDate dueDate = parts[6].isEmpty() ? null : LocalDate.parse(parts[6]);

                Book book = new Book(isbn, title, author, year);
                book.setAvailable(available);
                book.setBorrowedBy(borrowedBy);
                book.setDueDate(dueDate);

                books.add(book);
            }
        } catch (IOException | NumberFormatException e) {
            System.out.println("Error loading books: " + e.getMessage());
        }

        return books;
    }

    public void saveBooks(List<Book> books) {
        try (PrintWriter writer = new PrintWriter(new BufferedWriter(new FileWriter(BOOKS_FILE)))) {
            for (Book book : books) {
                String borrowedBy = book.getBorrowedBy() == null ? "" : book.getBorrowedBy();
                String dueDate = book.getDueDate() == null ? "" : book.getDueDate().toString();

                // isbn;title;author;year;available;borrowedBy;dueDate
                writer.printf("%s;%s;%s;%d;%b;%s;%s%n",
                        book.getIsbn(),
                        book.getTitle(),
                        book.getAuthor(),
                        book.getYear(),
                        book.isAvailable(),
                        borrowedBy,
                        dueDate);
            }
        } catch (IOException e) {
            System.out.println("Error saving books: " + e.getMessage());
        }
    }

    // ===== Members =====
    public List<Member> loadMembers() {
        List<Member> members = new ArrayList<>();
        Path path = Paths.get(MEMBERS_FILE);

        if (!Files.exists(path)) {
            return members; // no members yet
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(MEMBERS_FILE))) {
            String line;
            while ((line = reader.readLine()) != null) {
                // id;name;isbn1,isbn2,isbn3
                String[] parts = line.split(";", -1);
                if (parts.length < 3) continue;

                String id = parts[0];
                String name = parts[1];
                String borrowedStr = parts[2];

                Member member = new Member(id, name);

                if (!borrowedStr.isEmpty()) {
                    String[] isbns = borrowedStr.split(",");
                    member.setBorrowedIsbns(new ArrayList<>(Arrays.asList(isbns)));
                }

                members.add(member);
            }
        } catch (IOException e) {
            System.out.println("Error loading members: " + e.getMessage());
        }

        return members;
    }

    public void saveMembers(List<Member> members) {
        try (PrintWriter writer = new PrintWriter(new BufferedWriter(new FileWriter(MEMBERS_FILE)))) {
            for (Member member : members) {
                String borrowed = String.join(",", member.getBorrowedIsbns());
                // id;name;isbn1,isbn2
                writer.printf("%s;%s;%s%n",
                        member.getId(),
                        member.getName(),
                        borrowed);
            }
        } catch (IOException e) {
            System.out.println("Error saving members: " + e.getMessage());
        }
    }
}
