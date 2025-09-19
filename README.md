# 📚 Library Management System (PostgreSQL)

## Overview
This project implements a Library Management System using **PostgreSQL**.  
It manages:
- Books (title, author, genres, year, availability)
- Authors (name, nationality, lifespan)
- Patrons (borrowers and their borrowed books)

The system supports **CRUD operations** and **advanced queries**.

---

## 🚀 Setup Instructions

### 1. Install PostgreSQL
- Download: [PostgreSQL Downloads](https://www.postgresql.org/download/)
- Install with **pgAdmin** or ensure `psql` CLI is available.

### 2. Create Database
Open `psql` and run:
```sql
CREATE DATABASE LibraryDB;
```

### 3. Run Schema & Data
Run the provided SQL script:
```bash
psql -U postgres -d LibraryDB -f LibraryDB.sql
```

Or in `psql`:
```sql
\c LibraryDB
\i LibraryDB.sql
```

### 4. Run Queries
You can now execute CRUD and advanced queries from the script, or write new ones.

---

## 📖 Features

### Core CRUD
- Add, view, update, delete books
- Add, view, delete authors
- Manage patron borrowed books

### Advanced Queries
- Find books published after 1950
- Find all American authors
- Bulk update availability
- Search authors by name
- Increment published years

---

## 🛠 Example Queries

```sql
-- All available books
SELECT * FROM books WHERE available = TRUE;

-- Borrow book #1
UPDATE books SET available = FALSE WHERE id = 1;

-- Add borrowed book to patron
UPDATE patrons SET borrowed_books = array_append(borrowed_books, 1) WHERE id = 1;

-- Delete an author
DELETE FROM authors WHERE id = 5;
```

---

## ✅ Notes
- Run all commands in `psql` or `pgAdmin`.
- Ensure foreign key constraints are respected (`ON DELETE CASCADE` is enabled for books).
# express-library-api