import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Types
export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  birthYear: number;
  nationality: string;
  biography?: string;
  createdAt: string;
}

export interface Publisher {
  id: number;
  name: string;
  country: string;
  foundedYear: number;
  website?: string;
  createdAt: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  publishedYear: number;
  pageCount: number;
  language: string;
  description: string;
  coverImage?: string;
  authorId: number;
  publisherId: number;
  author: Author;
  publisher: Publisher;
  genres: Genre[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  bookId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AverageRating {
  bookId: number;
  averageRating: number | null;
  reviewCount: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedBooks {
  data: Book[];
  pagination: Pagination;
}

export interface BookQuery {
  title?: string;
  language?: string;
  year?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export interface CreateBookData {
  title: string;
  isbn: string;
  publishedYear: number;
  pageCount: number;
  language: string;
  description: string;
  authorId: number;
  publisherId: number;
  genres: number[];
}

export interface CreateReviewData {
  userName: string;
  rating: number;
  comment: string;
}

// Book API calls
export const getBooks = (query: BookQuery, signal?: AbortSignal) =>
  api.get<PaginatedBooks>("/books", { params: query, signal });

export const getBookById = (id: number, signal?: AbortSignal) =>
  api.get<Book>(`/books/${id}`, { signal });

export const createBook = (data: CreateBookData) =>
  api.post<Book>("/books", data);

export const updateBook = (id: number, data: Partial<CreateBookData>) =>
  api.put<Book>(`/books/${id}`, data);

export const deleteBook = (id: number) => api.delete(`/books/${id}`);

// Review API calls
export const getBookReviews = (bookId: number, signal?: AbortSignal) =>
  api.get<Review[]>(`/books/${bookId}/reviews`, { signal });

export const getAverageRating = (bookId: number, signal?: AbortSignal) =>
  api.get<AverageRating>(`/books/${bookId}/average-rating`, { signal });

export const createReview = (bookId: number, data: CreateReviewData) =>
  api.post<Review>(`/books/${bookId}/reviews`, data);

// Author API calls
export const getAuthors = (signal?: AbortSignal) =>
  api.get<Author[]>("/authors", { signal });

// Publisher API calls
export const getPublishers = (signal?: AbortSignal) =>
  api.get<Publisher[]>("/publishers", { signal });

// Genre API calls
export const getGenres = (signal?: AbortSignal) =>
  api.get<Genre[]>("/genres", { signal });
