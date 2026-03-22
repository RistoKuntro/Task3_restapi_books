import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  isbn: z.string().min(10, "ISBN must be at least 10 characters"),
  publishedYear: z.number().int().min(1000).max(new Date().getFullYear()),
  pageCount: z.number().int().min(1),
  language: z.string().min(1),
  description: z.string().min(1),
  coverImage: z.string().url().optional(),
  authorId: z.number().int().positive(),
  publisherId: z.number().int().positive(),
  genres: z.array(z.number().int().positive()).optional().default([]),
});

export const updateBookSchema = createBookSchema.partial();

export const createAuthorSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  birthYear: z.number().int().min(1000).max(new Date().getFullYear()),
  nationality: z.string().min(1),
  biography: z.string().optional(),
});

export const updateAuthorSchema = createAuthorSchema.partial();

export const createPublisherSchema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.string().min(1),
  foundedYear: z.number().int().min(1000).max(new Date().getFullYear()),
  website: z.string().url().optional(),
});

export const updatePublisherSchema = createPublisherSchema.partial();

export const createReviewSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1),
});

export const updateReviewSchema = createReviewSchema.partial();

export const createGenreSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type CreateAuthorInput = z.infer<typeof createAuthorSchema>;
export type UpdateAuthorInput = z.infer<typeof updateAuthorSchema>;
export type CreatePublisherInput = z.infer<typeof createPublisherSchema>;
export type UpdatePublisherInput = z.infer<typeof updatePublisherSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type CreateGenreInput = z.infer<typeof createGenreSchema>;