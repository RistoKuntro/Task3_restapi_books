import prisma from "../../lib/prisma.js";
import { AppError } from "../../middleware/errorHandler.js";
import { CreateGenreInput } from "../../validators/schemas.js";

export async function getAllGenres() {
  return prisma.genre.findMany({ orderBy: { name: "asc" } });
}

export async function getGenreById(id: number) {
  const genre = await prisma.genre.findUnique({ where: { id } });
  if (!genre) throw new AppError(404, `Genre with id ${id} not found`);
  return genre;
}

export async function createGenre(data: CreateGenreInput) {
  const existing = await prisma.genre.findFirst({
    where: { name: { equals: data.name, mode: "insensitive" } },
  });
  if (existing) throw new AppError(409, `Genre "${data.name}" already exists`);
  return prisma.genre.create({ data });
}

export async function getGenreBooks(id: number) {
  const genre = await prisma.genre.findUnique({ where: { id } });
  if (!genre) throw new AppError(404, `Genre with id ${id} not found`);
  return prisma.book.findMany({
    where: { genres: { some: { genreId: id } } },
    include: { author: true, publisher: true },
  });
}
