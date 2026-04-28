import { Request, Response, NextFunction } from "express";
import { reviewService } from "../services/index.js";
import { createReviewSchema, updateReviewSchema } from "../validators/schemas.js";

export async function createReview(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createReviewSchema.parse(req.body);
    res.status(201).json(await reviewService.createReview(parseInt(req.params.bookId as string), data));
  } catch (err) { next(err); }
}

export async function getReviewById(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await reviewService.getReviewById(parseInt(req.params.id as string)));
  } catch (err) { next(err); }
}

export async function updateReview(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateReviewSchema.parse(req.body);
    res.json(await reviewService.updateReview(parseInt(req.params.id as string), data));
  } catch (err) { next(err); }
}

export async function deleteReview(req: Request, res: Response, next: NextFunction) {
  try {
    await reviewService.deleteReview(parseInt(req.params.id as string));
    res.status(204).send();
  } catch (err) { next(err); }
}