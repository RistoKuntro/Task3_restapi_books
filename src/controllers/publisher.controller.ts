import { Request, Response, NextFunction } from "express";
import { publisherService } from "../services/index.js";
import { createPublisherSchema, updatePublisherSchema } from "../validators/schemas.js";
import { PublisherQuery } from "../models/index.js";

export async function getAllPublishers(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await publisherService.getAllPublishers(req.query as PublisherQuery));
  } catch (err) { next(err); }
}

export async function getPublisherById(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await publisherService.getPublisherById(parseInt(req.params.id as string)));
  } catch (err) { next(err); }
}

export async function createPublisher(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createPublisherSchema.parse(req.body);
    res.status(201).json(await publisherService.createPublisher(data));
  } catch (err) { next(err); }
}

export async function updatePublisher(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updatePublisherSchema.parse(req.body);
    res.json(await publisherService.updatePublisher(parseInt(req.params.id as string), data));
  } catch (err) { next(err); }
}

export async function deletePublisher(req: Request, res: Response, next: NextFunction) {
  try {
    await publisherService.deletePublisher(parseInt(req.params.id as string));
    res.status(204).send();
  } catch (err) { next(err); }
}

export async function getPublisherBooks(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await publisherService.getPublisherBooks(parseInt(req.params.id as string)));
  } catch (err) { next(err); }
}