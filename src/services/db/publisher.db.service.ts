import prisma from "../../lib/prisma.js";
import { AppError } from "../../middleware/errorHandler.js";
import { AuthorQuery } from "../../models/index.js";
import {
  CreateAuthorInput,
  UpdateAuthorInput,
} from "../../validators/schemas.js";
import { Prisma } from "../../generated/prisma/client.js";

export async function getAllAuthors(query: AuthorQuery) {
  const where: Prisma.AuthorWhereInput = {};

  if (query.lastName) {
    where.lastName = { contains: query.lastName, mode: "insensitive" };
  }
  if (query.nationality) {
    where.nationality = { contains: query.nationality, mode: "insensitive" };
  }

  const order = (query.order === "desc" ? "desc" : "asc") as Prisma.SortOrder;
  const orderBy: Prisma.AuthorOrderByWithRelationInput =
    query.sortBy === "lastName" ? { lastName: order } : { createdAt: "desc" };

  return prisma.author.findMany({ where, orderBy });
}

export async function getAuthorById(id: number) {
  const author = await prisma.author.findUnique({ where: { id } });
  if (!author) throw new AppError(404, `Author with id ${id} not found`);
  return author;
}

export async function createAuthor(data: CreateAuthorInput) {
  return prisma.author.create({ data });
}

export async function updateAuthor(id: number, data: UpdateAuthorInput) {
  const existing = await prisma.author.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, `Author with id ${id} not found`);
  return prisma.author.update({ where: { id }, data });
}

export async function deleteAuthor(id: number) {
  const existing = await prisma.author.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, `Author with id ${id} not found`);
  await prisma.author.delete({ where: { id } });
}

export async function getAuthorBooks(id: number) {
  const existing = await prisma.author.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, `Author with id ${id} not found`);
  return prisma.book.findMany({
    where: { authorId: id },
    include: { publisher: true, genres: { include: { genre: true } } },
  });
}
