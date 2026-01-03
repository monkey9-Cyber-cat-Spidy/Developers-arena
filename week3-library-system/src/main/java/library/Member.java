package library;

import java.util.ArrayList;
import java.util.List;

public class Member {
    private String id;
    private String name;
    private List<String> borrowedIsbns;

    public Member(String id, String name) {
        this.id = id;
        this.name = name;
        this.borrowedIsbns = new ArrayList<>();
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getBorrowedIsbns() {
        return borrowedIsbns;
    }

    public void setBorrowedIsbns(List<String> borrowedIsbns) {
        this.borrowedIsbns = borrowedIsbns;
    }

    // Business methods
    public void borrowBook(String isbn) {
        if (!borrowedIsbns.contains(isbn)) {
            borrowedIsbns.add(isbn);
        }
    }

    public void returnBook(String isbn) {
        borrowedIsbns.remove(isbn);
    }

    @Override
    public String toString() {
        return String.format("ID: %s | Name: %s | Borrowed: %s",
                id, name,
                borrowedIsbns.isEmpty() ? "None" : String.join(", ", borrowedIsbns));
    }
}
