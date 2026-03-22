import { reviews, books, incrementReviewId } from "../data/mockData.js";
import { AppError } from "../middleware/errorHandler.js";
import { CreateReviewInput, UpdateReviewInput } from "../validators/schemas.js";

export function createReview(bookId: number, data: CreateReviewInput) {
  if (!books.find((b) => b.id === bookId))
    throw new AppError(404, `Book with id ${bookId} not found`);

  const newReview = {
    ...data,
    id: incrementReviewId(),
    bookId,
    createdAt: new Date(),
  };
  reviews.push(newReview);
  return newReview;
}

export function getReviewById(id: number) {
  const review = reviews.find((r) => r.id === id);
  if (!review) throw new AppError(404, `Review with id ${id} not found`);
  return review;
}

export function updateReview(id: number, data: UpdateReviewInput) {
  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) throw new AppError(404, `Review with id ${id} not found`);
  reviews[index] = { ...reviews[index], ...data };
  return reviews[index];
}

export function deleteReview(id: number) {
  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) throw new AppError(404, `Review with id ${id} not found`);
  reviews.splice(index, 1);
}
