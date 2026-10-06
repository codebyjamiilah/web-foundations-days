# Library API Design

A REST API for the `books` resource of a library.

## Endpoints

### 1. List all books
- **Method:** GET
- **Path:** `/books`
- **Description:** Returns every book in the library.
- **Success status:** 200 OK

### 2. Get one book
- **Method:** GET
- **Path:** `/books/{id}`
- **Description:** Returns the single book with that id.
- **Success status:** 200 OK

### 3. Create a book
- **Method:** POST
- **Path:** `/books`
- **Description:** Adds a new book.
- **Example request body:**
```json
  { "title": "The Hobbit", "author": "J.R.R. Tolkien", "year": 1937 }
```
- **Success status:** 201 Created

### 4. Update a book
- **Method:** PUT
- **Path:** `/books/{id}`
- **Description:** Replaces the details of an existing book.
- **Example request body:**
```json
  { "title": "The Hobbit", "author": "J.R.R. Tolkien", "year": 1937 }
```
- **Success status:** 200 OK

### 5. Delete a book
- **Method:** DELETE
- **Path:** `/books/{id}`
- **Description:** Removes the book.
- **Success status:** 204 No Content

### 6. List books by an author
- **Method:** GET
- **Path:** `/books?author=Tolkien`
- **Description:** Returns only the books written by that author (the author name is a query parameter).
- **Success status:** 200 OK

## Error codes

### 400 Bad Request
- The request is wrong or incomplete.
- **Example:** POST `/books` with no `title`.

### 404 Not Found
- The thing you asked for doesn't exist.
- **Example:** GET `/books/9999` when there is no book with id 9999.
