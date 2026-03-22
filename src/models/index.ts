export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  birthYear: number;
  nationality: string;
  biography?: string;
  createdAt: Date;
}

export interface Publisher {
  id: number;
  name: string;
  country: string;
  foundedYear: number;
  website?: string;
  createdAt: Date;
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
  genres: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: number;
  bookId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface BookQuery {
  title?: string;
  author?: string;
  genre?: string;
  language?: string;
  year?: string;
  publisher?: string;
  sortBy?: string;
  order?: string;
  page?: string;
  limit?: string;
}

export interface AuthorQuery {
  lastName?: string;
  nationality?: string;
  sortBy?: string;
  order?: string;
}

export interface PublisherQuery {
  name?: string;
  country?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
