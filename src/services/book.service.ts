import prisma from "../lib/prisma.js";
export async function getAllBooks() {
  return prisma.book.findMany({
    include: {
      authors: {
        include: { author: true },
      },
    },
  });
}
export async function createBook(data: {
  title: string;
  publishedYear: number;
  authorIds?: number[];
}) {
  const { authorIds, ...bookData } = data;
  return prisma.book.create({
    data: {
      ...bookData,
      authors: authorIds
        ? { create: authorIds.map((authorId) => ({ authorId })) }
        : undefined,
    },
    include: {
      authors: { include: { author: true } },
    },
  });
}
