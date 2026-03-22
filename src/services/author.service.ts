import { authors, books, incrementAuthorId } from "../data/mockData.js";
import { AppError } from "../middleware/errorHandler.js";
import { AuthorQuery } from "../models/index.js";
import { CreateAuthorInput, UpdateAuthorInput } from "../validators/schemas.js";

export function getAllAuthors(query: AuthorQuery) {
  let result = [...authors];

  if (query.lastName) {
    const l = query.lastName.toLowerCase();
    result = result.filter((a) => a.lastName.toLowerCase().includes(l));
  }
  if (query.nationality) {
    const n = query.nationality.toLowerCase();
    result = result.filter((a) => a.nationality.toLowerCase().includes(n));
  }

  const order = query.order === "desc" ? -1 : 1;
  if (query.sortBy === "lastName") {
    result.sort((a, b) => a.lastName.localeCompare(b.lastName) * order);
  }

  return result;
}

export function getAuthorById(id: number) {
  const author = authors.find((a) => a.id === id);
  if (!author) throw new AppError(404, `Author with id ${id} not found`);
  return author;
}

export function createAuthor(data: CreateAuthorInput) {
  const newAuthor = { ...data, id: incrementAuthorId(), createdAt: new Date() };
  authors.push(newAuthor);
  return newAuthor;
}

export function updateAuthor(id: number, data: UpdateAuthorInput) {
  const index = authors.findIndex((a) => a.id === id);
  if (index === -1) throw new AppError(404, `Author with id ${id} not found`);
  authors[index] = { ...authors[index], ...data };
  return authors[index];
}

export function deleteAuthor(id: number) {
  const index = authors.findIndex((a) => a.id === id);
  if (index === -1) throw new AppError(404, `Author with id ${id} not found`);
  authors.splice(index, 1);
}

export function getAuthorBooks(id: number) {
  if (!authors.find((a) => a.id === id))
    throw new AppError(404, `Author with id ${id} not found`);
  return books.filter((b) => b.authorId === id);
}
