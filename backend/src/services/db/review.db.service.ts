import prisma from "../../lib/prisma.js";
import { AppError } from "../../middleware/errorHandler.js";
import { CreateReviewInput, UpdateReviewInput } from "../../validators/schemas.js";

export async function createReview(bookId: number, data: CreateReviewInput) {
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) throw new AppError(404, `Book with id ${bookId} not found`);
  return prisma.review.create({ data: { ...data, bookId } });
}

export async function getReviewById(id: number) {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new AppError(404, `Review with id ${id} not found`);
  return review;
}

export async function updateReview(id: number, data: UpdateReviewInput) {
  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, `Review with id ${id} not found`);
  return prisma.review.update({ where: { id }, data });
}

export async function deleteReview(id: number) {
  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, `Review with id ${id} not found`);
  await prisma.review.delete({ where: { id } });
}