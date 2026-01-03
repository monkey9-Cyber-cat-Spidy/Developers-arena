package library;

import java.util.List;
import java.util.Scanner;

public class Main {

    private static final Scanner scanner = new Scanner(System.in);
    private static final Library library = new Library();

    public static void main(String[] args) {
        boolean exit = false;

        while (!exit) {
            printMenu();
            int choice = readInt("Enter your choice: ");

            switch (choice) {
                case 1 -> handleAddBook();
                case 2 -> library.displayAllBooks();
                case 3 -> handleSearchBooks();
                case 4 -> handleRegisterMember();
                case 5 -> handleBorrowBook();
                case 6 -> handleReturnBook();
                case 7 -> library.displayStatistics();
                case 8 -> {
                    System.out.println("Exiting... Goodbye!");
                    exit = true;
                }
                default -> System.out.println("Invalid choice. Please try again.");
            }
        }

        scanner.close();
    }

    private static void printMenu() {
        System.out.println("\n=== LIBRARY MANAGEMENT SYSTEM ===");
        System.out.println("1. Add New Book");
        System.out.println("2. View All Books");
        System.out.println("3. Search Books");
        System.out.println("4. Register Member");
        System.out.println("5. Borrow Book");
        System.out.println("6. Return Book");
        System.out.println("7. View Library Statistics");
        System.out.println("8. Exit");
    }

    private static int readInt(String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = scanner.nextLine();
            try {
                return Integer.parseInt(input.trim());
            } catch (NumberFormatException e) {
                System.out.println("Please enter a valid number.");
            }
        }
    }

    private static String readNonEmpty(String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = scanner.nextLine().trim();
            if (!input.isEmpty()) {
                return input;
            }
            System.out.println("Input cannot be empty.");
        }
    }

    private static void handleAddBook() {
        String isbn = readNonEmpty("Enter ISBN: ");
        String title = readNonEmpty("Enter title: ");
        String author = readNonEmpty("Enter author: ");
        int year = readInt("Enter publication year: ");

        Book book = new Book(isbn, title, author, year);
        library.addBook(book);
    }

    private static void handleSearchBooks() {
        String keyword = readNonEmpty("Enter keyword (title/author): ");
        List<Book> results = library.searchBooks(keyword);

        if (results.isEmpty()) {
            System.out.println("No books found for keyword: " + keyword);
            return;
        }

        System.out.println("\n=== SEARCH RESULTS ===");
        for (int i = 0; i < results.size(); i++) {
            System.out.println((i + 1) + ". " + results.get(i));
        }
    }

    private static void handleRegisterMember() {
        String id = readNonEmpty("Enter member ID: ");
        String name = readNonEmpty("Enter member name: ");
        Member member = new Member(id, name);
        library.registerMember(member);
    }

    private static void handleBorrowBook() {
        String isbn = readNonEmpty("Enter ISBN to borrow: ");
        String memberId = readNonEmpty("Enter member ID: ");
        library.borrowBook(isbn, memberId);
    }

    private static void handleReturnBook() {
        String isbn = readNonEmpty("Enter ISBN to return: ");
        String memberId = readNonEmpty("Enter member ID: ");
        library.returnBook(isbn, memberId);
    }
}
