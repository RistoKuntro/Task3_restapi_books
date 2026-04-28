import { Request, Response, NextFunction } from "express";
import { genreService } from "../services/index.js";
import { createGenreSchema } from "../validators/schemas.js";

export async function getAllGenres(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await genreService.getAllGenres());
  } catch (err) { next(err); }
}

export async function getGenreById(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await genreService.getGenreById(parseInt(req.params.id as string)));
  } catch (err) { next(err); }
}

export async function createGenre(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createGenreSchema.parse(req.body);
    res.status(201).json(await genreService.createGenre(data));
  } catch (err) { next(err); }
}

export async function getGenreBooks(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await genreService.getGenreBooks(parseInt(req.params.id as string)));
  } catch (err) { next(err); }
}