import {
  books,
  authors,
  publishers,
  genres,
  reviews,
  incrementBookId,
} from "../data/mockData.js";
import { AppError } from "../middleware/errorHandler.js";
import { paginate, parsePagination } from "../utils/pagination.js";
import { BookQuery } from "../models/index.js";
import { CreateBookInput, UpdateBookInput } from "../validators/schemas.js";

function enrichBook(book: (typeof books)[0]) {
  const author = authors.find((a) => a.id === book.authorId);
  const publisher = publishers.find((p) => p.id === book.publisherId);
  const bookGenres = genres.filter((g) => book.genres.includes(g.id));
  return { ...book, author, publisher, genres: bookGenres };
}

export function getAllBooks(query: BookQuery) {
  let result = [...books];

  if (query.title) {
    const t = query.title.toLowerCase();
    result = result.filter((b) => b.title.toLowerCase().includes(t));
  }
  if (query.author) {
    const a = query.author.toLowerCase();
    result = result.filter((b) => {
      const author = authors.find((au) => au.id === b.authorId);
      return (
        author?.firstName.toLowerCase().includes(a) ||
        author?.lastName.toLowerCase().includes(a)
      );
    });
  }
  if (query.genre) {
    const g = query.genre.toLowerCase();
    result = result.filter((b) => {
      const bookGenres = genres.filter((ge) => b.genres.includes(ge.id));
      return bookGenres.some((ge) => ge.name.toLowerCase().includes(g));
    });
  }
  if (query.language) {
    const l = query.language.toLowerCase();
    result = result.filter((b) => b.language.toLowerCase().includes(l));
  }
  if (query.year) {
    const y = parseInt(query.year);
    if (!isNaN(y)) result = result.filter((b) => b.publishedYear === y);
  }
  if (query.publisher) {
    const p = query.publisher.toLowerCase();
    result = result.filter((b) => {
      const pub = publishers.find((pu) => pu.id === b.publisherId);
      return pub?.name.toLowerCase().includes(p);
    });
  }

  const order = query.order === "desc" ? -1 : 1;
  if (query.sortBy === "title") {
    result.sort((a, b) => a.title.localeCompare(b.title) * order);
  } else if (query.sortBy === "publishedYear") {
    result.sort((a, b) => (a.publishedYear - b.publishedYear) * order);
  }

  const { page, limit } = parsePagination(query.page, query.limit);
  const paginated = paginate(result, page, limit);
  return { ...paginated, data: paginated.data.map(enrichBook) };
}

export function getBookById(id: number) {
  const book = books.find((b) => b.id === id);
  if (!book) throw new AppError(404, `Book with id ${id} not found`);
  return enrichBook(book);
}

export function createBook(data: CreateBookInput) {
  if (!authors.find((a) => a.id === data.authorId))
    throw new AppError(404, `Author with id ${data.authorId} not found`);
  if (!publishers.find((p) => p.id === data.publisherId))
    throw new AppError(404, `Publisher with id ${data.publisherId} not found`);
  if (books.find((b) => b.isbn === data.isbn))
    throw new AppError(409, `Book with ISBN ${data.isbn} already exists`);

  const newBook = {
    ...data,
    id: incrementBookId(),
    genres: data.genres ?? [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  books.push(newBook);
  return enrichBook(newBook);
}

export function updateBook(id: number, data: UpdateBookInput) {
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) throw new AppError(404, `Book with id ${id} not found`);
  if (data.isbn && data.isbn !== books[index].isbn) {
    if (books.find((b) => b.isbn === data.isbn))
      throw new AppError(409, `Book with ISBN ${data.isbn} already exists`);
  }
  books[index] = { ...books[index], ...data, updatedAt: new Date() };
  return enrichBook(books[index]);
}

export function deleteBook(id: number) {
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) throw new AppError(404, `Book with id ${id} not found`);
  books.splice(index, 1);
}

export function getBookReviews(
  bookId: number,
  query: { rating?: string; sortBy?: string; order?: string },
) {
  if (!books.find((b) => b.id === bookId))
    throw new AppError(404, `Book with id ${bookId} not found`);

  let result = reviews.filter((r) => r.bookId === bookId);

  if (query.rating) {
    const r = parseInt(query.rating);
    if (!isNaN(r)) result = result.filter((rev) => rev.rating === r);
  }

  const order = query.order === "asc" ? 1 : -1;
  if (query.sortBy === "createdAt") {
    result.sort(
      (a, b) => (a.createdAt.getTime() - b.createdAt.getTime()) * order,
    );
  }

  return result;
}

export function getAverageRating(bookId: number) {
  if (!books.find((b) => b.id === bookId))
    throw new AppError(404, `Book with id ${bookId} not found`);

  const bookReviews = reviews.filter((r) => r.bookId === bookId);
  if (bookReviews.length === 0)
    return { bookId, averageRating: null, reviewCount: 0 };

  const avg =
    bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length;
  return {
    bookId,
    averageRating: Math.round(avg * 100) / 100,
    reviewCount: bookReviews.length,
  };
}
