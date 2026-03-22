import { Request, Response, NextFunction } from "express";
import { bookService } from "../services/index.js";
import { createBookSchema, updateBookSchema } from "../validators/schemas.js";
import { BookQuery } from "../models/index.js";

export async function getAllBooks(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await bookService.getAllBooks(req.query as BookQuery));
  } catch (err) { next(err); }
}

export async function createBook(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createBookSchema.parse(req.body);
    res.status(201).json(await bookService.createBook(data));
  } catch (err) { next(err); }
}

export async function getBookById(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await bookService.getBookById(parseInt(req.params.id as string)));
  } catch (err) { next(err); }
}

export async function updateBook(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateBookSchema.parse(req.body);
    res.json(await bookService.updateBook(parseInt(req.params.id as string), data));
  } catch (err) { next(err); }
}

export async function deleteBook(req: Request, res: Response, next: NextFunction) {
  try {
    await bookService.deleteBook(parseInt(req.params.id as string));
    res.status(204).send();
  } catch (err) { next(err); }
}

export async function getBookReviews(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await bookService.getBookReviews(
      parseInt(req.params.id as string),
      req.query as { rating?: string; sortBy?: string; order?: string }
    ));
  } catch (err) { next(err); }
}

export async function getAverageRating(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await bookService.getAverageRating(parseInt(req.params.id as string)));
  } catch (err) { next(err); }
}