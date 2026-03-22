import { genres, books, incrementGenreId } from "../data/mockData.js";
import { AppError } from "../middleware/errorHandler.js";
import { CreateGenreInput } from "../validators/schemas.js";

export function getAllGenres() {
  return genres;
}

export function getGenreById(id: number) {
  const genre = genres.find((g) => g.id === id);
  if (!genre) throw new AppError(404, `Genre with id ${id} not found`);
  return genre;
}

export function createGenre(data: CreateGenreInput) {
  if (genres.find((g) => g.name.toLowerCase() === data.name.toLowerCase()))
    throw new AppError(409, `Genre "${data.name}" already exists`);

  const newGenre = { ...data, id: incrementGenreId() };
  genres.push(newGenre);
  return newGenre;
}

export function getGenreBooks(id: number) {
  if (!genres.find((g) => g.id === id))
    throw new AppError(404, `Genre with id ${id} not found`);
  return books.filter((b) => b.genres.includes(id));
}
