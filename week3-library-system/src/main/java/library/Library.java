package library;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Library {
    private List<Book> books;
    private List<Member> members;
    private FileHandler fileHandler;
    
    public Library() {
        this.books = new ArrayList<>();
        this.members = new ArrayList<>();
        this.fileHandler = new FileHandler();
        loadData();
    }
    
    private void loadData() {
        books = fileHandler.loadBooks();
        members = fileHandler.loadMembers();
        System.out.println("Loaded " + books.size() + " books and " + members.size() + " members");
    }
    
    // BOOKS
    
    public void addBook(Book book) {
        books.add(book);
        fileHandler.saveBooks(books);
        System.out.println("Book added successfully: " + book.getTitle());
    }
    
    public void removeBook(String isbn) {
        Book bookToRemove = findBookByIsbn(isbn);
        if (bookToRemove != null) {
            books.remove(bookToRemove);
            fileHandler.saveBooks(books);
            System.out.println("Book removed successfully");
        } else {
            System.out.println("Book not found with ISBN: " + isbn);
        }
    }
    
    public Book findBookByIsbn(String isbn) {
        return books.stream()
            .filter(book -> book.getIsbn().equals(isbn))
            .findFirst()
            .orElse(null);
    }
    
    public List<Book> searchBooks(String keyword) {
        return books.stream()
            .filter(book -> book.getTitle().toLowerCase().contains(keyword.toLowerCase()) ||
                           book.getAuthor().toLowerCase().contains(keyword.toLowerCase()))
            .collect(Collectors.toList());
    }
    
    public void displayAllBooks() {
        if (books.isEmpty()) {
            System.out.println("No books in the library.");
            return;
        }
        
        System.out.println("\n=== ALL BOOKS ===");
        System.out.println("Total books: " + books.size());
        System.out.println("-".repeat(80));
        
        for (int i = 0; i < books.size(); i++) {
            System.out.println((i + 1) + ". " + books.get(i));
        }
    }
    
    // MEMBERS
    
    public void registerMember(Member member) {
        members.add(member);
        fileHandler.saveMembers(members);
        System.out.println("Member registered successfully: " + member.getName());
    }
    
    public Member findMemberById(String id) {
        return members.stream()
            .filter(member -> member.getId().equals(id))
            .findFirst()
            .orElse(null);
    }
    
    public void displayAllMembers() {
        if (members.isEmpty()) {
            System.out.println("No members registered.");
            return;
        }
        
        System.out.println("\n=== ALL MEMBERS ===");
        System.out.println("Total members: " + members.size());
        System.out.println("-".repeat(80));
        
        for (int i = 0; i < members.size(); i++) {
            System.out.println((i + 1) + ". " + members.get(i));
        }
    }
    
    // BORROW / RETURN
    
    public void borrowBook(String isbn, String memberId) {
        Book book = findBookByIsbn(isbn);
        Member member = findMemberById(memberId);
        
        if (book == null) {
            System.out.println("Book not found!");
            return;
        }
        
        if (member == null) {
            System.out.println("Member not found!");
            return;
        }
        
        if (!book.isAvailable()) {
            System.out.println("Book is already borrowed!");
            return;
        }
        
        book.setAvailable(false);
        book.setBorrowedBy(memberId);
        book.setDueDate(LocalDate.now().plusWeeks(2)); // 2 weeks loan period
        
        member.borrowBook(isbn);
        
        fileHandler.saveBooks(books);
        fileHandler.saveMembers(members);
        
        System.out.println("Book borrowed successfully!");
        System.out.println("Due date: " + book.getDueDate());
    }
    
    public void returnBook(String isbn, String memberId) {
        Book book = findBookByIsbn(isbn);
        Member member = findMemberById(memberId);

        if (book == null) {
            System.out.println("Book not found!");
            return;
        }
        if (member == null) {
            System.out.println("Member not found!");
            return;
        }
        if (book.isAvailable()) {
            System.out.println("Book is not currently borrowed.");
            return;
        }
        if (!member.getBorrowedIsbns().contains(isbn)) {
            System.out.println("This member did not borrow that book.");
            return;
        }

        double fine = calculateFine(book);

        member.returnBook(isbn);
        book.setAvailable(true);
        book.setBorrowedBy(null);
        book.setDueDate(null);

        fileHandler.saveBooks(books);
        fileHandler.saveMembers(members);

        System.out.printf("Book returned successfully. Overdue fine: %.2f%n", fine);
    }

    public double calculateFine(Book book) {
        if (!book.isOverdue()) {
            return 0.0;
        }
        LocalDate dueDate = book.getDueDate();
        long daysOverdue = ChronoUnit.DAYS.between(dueDate, LocalDate.now());
        if (daysOverdue <= 0) {
            return 0.0;
        }
        double finePerDay = 1.0; // adjust as needed
        return daysOverdue * finePerDay;
    }
    
    // STATS
    
    public void displayStatistics() {
        long availableBooks = books.stream()
            .filter(Book::isAvailable)
            .count();
        
        long borrowedBooks = books.size() - availableBooks;
        
        System.out.println("\n=== LIBRARY STATISTICS ===");
        System.out.println("Total Books: " + books.size());
        System.out.println("Available Books: " + availableBooks);
        System.out.println("Borrowed Books: " + borrowedBooks);
        System.out.println("Registered Members: " + members.size());
        
        if (borrowedBooks > 0) {
            long overdueBooks = books.stream()
                .filter(book -> !book.isAvailable() && book.isOverdue())
                .count();
            System.out.println("Overdue Books: " + overdueBooks);
        }
    }
}
