import { Request, Response, NextFunction } from "express";
import { authorService } from "../services/index.js";
import { createAuthorSchema, updateAuthorSchema } from "../validators/schemas.js";
import { AuthorQuery } from "../models/index.js";

export async function getAllAuthors(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await authorService.getAllAuthors(req.query as AuthorQuery));
  } catch (err) { next(err); }
}

export async function getAuthorById(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await authorService.getAuthorById(parseInt(req.params.id as string)));
  } catch (err) { next(err); }
}

export async function createAuthor(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createAuthorSchema.parse(req.body);
    res.status(201).json(await authorService.createAuthor(data));
  } catch (err) { next(err); }
}

export async function updateAuthor(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateAuthorSchema.parse(req.body);
    res.json(await authorService.updateAuthor(parseInt(req.params.id as string), data));
  } catch (err) { next(err); }
}

export async function deleteAuthor(req: Request, res: Response, next: NextFunction) {
  try {
    await authorService.deleteAuthor(parseInt(req.params.id as string));
    res.status(204).send();
  } catch (err) { next(err); }
}

export async function getAuthorBooks(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await authorService.getAuthorBooks(parseInt(req.params.id as string)));
  } catch (err) { next(err); }
}