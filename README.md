# Books API

A RESTful API and React frontend for a library management system built with TypeScript, Express.js, Zod, Prisma ORM and React.

## Author

Risto Kuntro

## Installation

```bash
# Install all dependencies
npm install
npm install --prefix backend
npm install --prefix frontend
```

Copy `.env.example` to `.env` in the backend folder:

```bash
cp backend/.env.example backend/.env
```

Fill in your database credentials in `backend/.env`.

## Environment Setup

After cloning the repo you need to create two `.env` files manually, they are not included in Git for security reasons.

**1. Backend — create `backend/.env`:**

```bash
DB_HOST=dev.vk.edu.ee
DB_PORT=5432
DB_NAME=dbYourname
DB_USER=username
DB_PASSWORD=password
DB_SCHEMA=books_api

DATABASE_URL=postgresql://username:password@dev.vk.edu.ee:5432/dbYourname?schema=books_api

PORT=3000
NODE_ENV=development
USE_DB=false
```

**2. Frontend — create `frontend/.env`:**

```bash
VITE_API_URL=http://localhost:3000/api/v1
```

Both `.env.example` files are included in the repo as templates.

## Running

### Part 1 — Mock data (no database needed)

```bash
npm run dev
```

### Part 2 — PostgreSQL

```bash
cd backend
npm run migrate
npm run generate
npm run seed
cd ..
npm run dev:db
```

Both backend and frontend start at the same time:
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## Project Structure

**Backend** — Express REST API
- `src/server.ts` — Entry point
- `src/models/` — TypeScript interfaces
- `src/data/` — Mock data (Part 1)
- `src/validators/` — Zod schemas
- `src/middleware/` — Error handler and validateId
- `src/utils/` — Pagination helper
- `src/services/` — Mock services (Part 1)
- `src/services/db/` — Prisma services (Part 2)
- `src/controllers/` — HTTP request handlers
- `src/routes/` — Express routes
- `src/lib/prisma.ts` — Prisma client
- `prisma/schema.prisma` — Database schema
- `prisma/seed.ts` — Seed data

**Frontend** — React application
- `src/api.ts` — Axios client and all API functions
- `src/main.tsx` — Router setup
- `src/ThemeContext.tsx` — Dark mode context
- `src/pages/BooksPage.tsx` — Books list with search and pagination
- `src/pages/BookDetailPage.tsx` — Book detail, edit and delete
- `src/pages/AddBookPage.tsx` — Add new book form
- `src/components/Navbar.tsx` — Navigation and theme toggle

## API Endpoints

All routes prefixed with `/api/v1`.

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

### Publishers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/publishers` | Get all publishers |
| POST | `/publishers` | Create a publisher |
| GET | `/publishers/:id` | Get publisher by ID |
| PUT | `/publishers/:id` | Update a publisher |
| DELETE | `/publishers/:id` | Delete a publisher |
| GET | `/publishers/:id/books` | Get books by publisher |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/books/:bookId/reviews` | Create a review |
| GET | `/books/:bookId/reviews` | Get reviews for a book |
| GET | `/reviews/:id` | Get review by ID |
| PUT | `/reviews/:id` | Update a review |
| DELETE | `/reviews/:id` | Delete a review |

### Genres
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/genres` | Get all genres |
| POST | `/genres` | Create a genre |
| GET | `/genres/:id` | Get genre by ID |
| GET | `/genres/:id/books` | Get books in genre |

## cURL Examples

### Get all books
```bash
curl http://localhost:3000/api/v1/books
```

### Filter and sort
```bash
curl "http://localhost:3000/api/v1/books?author=martin&sortBy=publishedYear&order=desc"
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
