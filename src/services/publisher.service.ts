import { publishers, books, incrementPublisherId } from "../data/mockData.js";
import { AppError } from "../middleware/errorHandler.js";
import { PublisherQuery } from "../models/index.js";
import {
  CreatePublisherInput,
  UpdatePublisherInput,
} from "../validators/schemas.js";

export function getAllPublishers(query: PublisherQuery) {
  let result = [...publishers];

  if (query.name) {
    const n = query.name.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(n));
  }
  if (query.country) {
    const c = query.country.toLowerCase();
    result = result.filter((p) => p.country.toLowerCase().includes(c));
  }

  return result;
}

export function getPublisherById(id: number) {
  const publisher = publishers.find((p) => p.id === id);
  if (!publisher) throw new AppError(404, `Publisher with id ${id} not found`);
  return publisher;
}

export function createPublisher(data: CreatePublisherInput) {
  const newPublisher = {
    ...data,
    id: incrementPublisherId(),
    createdAt: new Date(),
  };
  publishers.push(newPublisher);
  return newPublisher;
}

export function updatePublisher(id: number, data: UpdatePublisherInput) {
  const index = publishers.findIndex((p) => p.id === id);
  if (index === -1)
    throw new AppError(404, `Publisher with id ${id} not found`);
  publishers[index] = { ...publishers[index], ...data };
  return publishers[index];
}

export function deletePublisher(id: number) {
  const index = publishers.findIndex((p) => p.id === id);
  if (index === -1)
    throw new AppError(404, `Publisher with id ${id} not found`);
  publishers.splice(index, 1);
}

export function getPublisherBooks(id: number) {
  if (!publishers.find((p) => p.id === id))
    throw new AppError(404, `Publisher with id ${id} not found`);
  return books.filter((b) => b.publisherId === id);
}
