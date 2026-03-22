# Books API

RESTful API for a library management system built with TypeScript, Express.js, Zod and Prisma ORM.

## Installation
```bash
npm install
```

Copy `.env.example` to `.env` and fill in your values.

## Running

### Part 1 — Mock data (no database needed)
```bash
npm run dev
```

### Part 2 — PostgreSQL
```bash
npm run migrate
npm run generate
npm run seed
npm run dev:db
```

## Features

### Part 1 (Mock Data)
- **Books**: Full CRUD with filters, sorting and pagination
- **Authors**: Full CRUD with search by name and nationality
- **Publishers**: Full CRUD with search by name and country
- **Reviews**: Create, read, update and delete reviews per book
- **Genres**: Create and list genres with their books
- **Average Rating**: Calculate average rating per book
- **Validation**: Zod runtime validation on all inputs
- **Error Handling**: Consistent error responses with correct HTTP status codes

### Part 2 (PostgreSQL)
- All Part 1 endpoints work with a real PostgreSQL database
- Prisma ORM with migrations and seed data
- Database-level filtering, sorting and pagination

## API Endpoints

All routes are prefixed with `/api/v1`.

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/books` | Get all books |
| POST | `/books` | Create a book |
| GET | `/books/:id` | Get book by ID |
| PUT | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |
| GET | `/books/:id/reviews` | Get reviews for a book |
| GET | `/books/:id/average-rating` | Get average rating |

**Query parameters:** `title`, `author`, `genre`, `language`, `year`, `publisher`, `sortBy`, `order`, `page`, `limit`

### Authors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/authors` | Get all authors |
| POST | `/authors` | Create an author |
| GET | `/authors/:id` | Get author by ID |
| PUT | `/authors/:id` | Update an author |
| DELETE | `/authors/:id` | Delete an author |
| GET | `/authors/:id/books` | Get books by author |

**Query parameters:** `lastName`, `nationality`, `sortBy`, `order`

### Publishers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/publishers` | Get all publishers |
| POST | `/publishers` | Create a publisher |
| GET | `/publishers/:id` | Get publisher by ID |
| PUT | `/publishers/:id` | Update a publisher |
| DELETE | `/publishers/:id` | Delete a publisher |
| GET | `/publishers/:id/books` | Get books by publisher |

**Query parameters:** `name`, `country`

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/books/:bookId/reviews` | Create a review |
| GET | `/books/:bookId/reviews` | Get reviews for a book |
| GET | `/reviews/:id` | Get review by ID |
| PUT | `/reviews/:id` | Update a review |
| DELETE | `/reviews/:id` | Delete a review |

**Query parameters:** `rating`, `sortBy`, `order`

### Genres
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/genres` | Get all genres |
| POST | `/genres` | Create a genre |
| GET | `/genres/:id` | Get genre by ID |
| GET | `/genres/:id/books` | Get books in genre |

## Project Structure
```
src/
    server.ts               # Entry point
    models/                 # TypeScript interfaces
    data/                   # Mock data (Part 1)
    validators/             # Zod schemas
    middleware/
        |__errorHandler.ts  # Global error handler
        |__validateId.ts    # Route param validation
    utils/
        |__pagination.ts    # Pagination helper
    services/               # Mock services (Part 1)
        db/                 # Prisma services (Part 2)
    controllers/            # HTTP request handlers
    routes/                 # Express routes
    lib/
        |__prisma.ts        # Prisma client
prisma/
    schema.prisma           # Database schema
    seed.ts                 # Seed data
```

## cURL Examples

### Get all books
```bash
curl http://localhost:3000/api/v1/books
```

### Filter and sort books
```bash
curl "http://localhost:3000/api/v1/books?author=martin&sortBy=publishedYear&order=desc"
```

### Paginate
```bash
curl "http://localhost:3000/api/v1/books?page=1&limit=5"
```

### Create a book
```bash
curl -X POST http://localhost:3000/api/v1/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Book",
    "isbn": "9781234567890",
    "publishedYear": 2023,
    "pageCount": 300,
    "language": "English",
    "description": "A great new book.",
    "authorId": 1,
    "publisherId": 1,
    "genres": [1, 2]
  }'
```

### Create a review
```bash
curl -X POST http://localhost:3000/api/v1/books/1/reviews \
  -H "Content-Type: application/json" \
  -d '{ "userName": "alice", "rating": 5, "comment": "Excellent!" }'
```

### Get average rating
```bash
curl http://localhost:3000/api/v1/books/1/average-rating
```

### Delete a book
```bash
curl -X DELETE http://localhost:3000/api/v1/books/1
```