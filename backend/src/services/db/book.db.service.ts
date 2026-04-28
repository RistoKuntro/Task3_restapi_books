import prisma from "../../lib/prisma.js";
import { AppError } from "../../middleware/errorHandler.js";
import { paginate, parsePagination } from "../../utils/pagination.js";
import { BookQuery } from "../../models/index.js";
import { CreateBookInput, UpdateBookInput } from "../../validators/schemas.js";
import { Prisma } from "../../generated/prisma/client.js";

const bookInclude = {
  author: true,
  publisher: true,
  genres: { include: { genre: true } },
  _count: { select: { reviews: true } },
};

function flattenBook(book: Awaited<ReturnType<typeof findOneBook>>) {
  if (!book) return null;
  const { genres, ...rest } = book;
  return { ...rest, genres: genres.map((g: { genre: unknown }) => g.genre) };
}

async function findOneBook(id: number) {
  return prisma.book.findUnique({ where: { id }, include: bookInclude });
}

export async function getAllBooks(query: BookQuery) {
  const where: Prisma.BookWhereInput = {};

  if (query.title) {
    where.title = { contains: query.title, mode: "insensitive" };
  }
  if (query.author) {
    where.author = {
      OR: [
        { firstName: { contains: query.author, mode: "insensitive" } },
        { lastName: { contains: query.author, mode: "insensitive" } },
      ],
    };
  }
  if (query.genre) {
    where.genres = {
      some: { genre: { name: { contains: query.genre, mode: "insensitive" } } },
    };
  }
  if (query.language) {
    where.language = { contains: query.language, mode: "insensitive" };
  }
  if (query.year) {
    const y = parseInt(query.year);
    if (!isNaN(y)) where.publishedYear = y;
  }
  if (query.publisher) {
    where.publisher = { name: { contains: query.publisher, mode: "insensitive" } };
  }

  const order = (query.order === "desc" ? "desc" : "asc") as Prisma.SortOrder;
  let orderBy: Prisma.BookOrderByWithRelationInput = { createdAt: "desc" };
  if (query.sortBy === "title") orderBy = { title: order };
  else if (query.sortBy === "publishedYear") orderBy = { publishedYear: order };

  const totalItems = await prisma.book.count({ where });
  const { page, limit } = parsePagination(query.page, query.limit);

  const books = await prisma.book.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
    include: bookInclude,
  });

  const totalPages = Math.ceil(totalItems / limit);
  return {
    data: books.map(flattenBook),
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getBookById(id: number) {
  const book = await findOneBook(id);
  if (!book) throw new AppError(404, `Book with id ${id} not found`);
  return flattenBook(book);
}

export async function createBook(data: CreateBookInput) {
  const { genres: genreIds, authorId, publisherId, ...bookData } = data;

  const author = await prisma.author.findUnique({ where: { id: authorId } });
  if (!author) throw new AppError(404, `Author with id ${authorId} not found`);

  const publisher = await prisma.publisher.findUnique({ where: { id: publisherId } });
  if (!publisher) throw new AppError(404, `Publisher with id ${publisherId} not found`);

  const existing = await prisma.book.findUnique({ where: { isbn: bookData.isbn } });
  if (existing) throw new AppError(409, `Book with ISBN ${bookData.isbn} already exists`);

  const book = await prisma.book.create({
    data: {
      ...bookData,
      authorId,
      publisherId,
      genres: genreIds && genreIds.length > 0
        ? { create: genreIds.map((genreId: number) => ({ genreId })) }
        : undefined,
    },
    include: bookInclude,
  });

  return flattenBook(book);
}

export async function updateBook(id: number, data: UpdateBookInput) {
  const existing = await prisma.book.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, `Book with id ${id} not found`);

  if (data.isbn && data.isbn !== existing.isbn) {
    const dup = await prisma.book.findUnique({ where: { isbn: data.isbn } });
    if (dup) throw new AppError(409, `Book with ISBN ${data.isbn} already exists`);
  }

  const { genres: genreIds, ...bookData } = data;
  const bookId = id;

  const book = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (genreIds !== undefined) {
      await tx.bookGenre.deleteMany({ where: { bookId } });
      if (genreIds.length > 0) {
        await tx.bookGenre.createMany({
          data: genreIds.map((genreId: number) => ({ bookId, genreId })),
        });
      }
    }
    return tx.book.update({
      where: { id: bookId },
      data: bookData,
      include: bookInclude,
    });
  });

  return flattenBook(book);
}

export async function deleteBook(id: number) {
  const existing = await prisma.book.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, `Book with id ${id} not found`);
  await prisma.book.delete({ where: { id } });
}

export async function getBookReviews(
  bookId: number,
  query: { rating?: string; sortBy?: string; order?: string }
) {
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) throw new AppError(404, `Book with id ${bookId} not found`);

  const where: Prisma.ReviewWhereInput = { bookId };
  if (query.rating) {
    const r = parseInt(query.rating);
    if (!isNaN(r)) where.rating = r;
  }

  const order = (query.order === "asc" ? "asc" : "desc") as Prisma.SortOrder;
  const orderBy: Prisma.ReviewOrderByWithRelationInput =
    query.sortBy === "createdAt" ? { createdAt: order } : { createdAt: "desc" };

  return prisma.review.findMany({ where, orderBy });
}

export async function getAverageRating(bookId: number) {
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) throw new AppError(404, `Book with id ${bookId} not found`);

  const result = await prisma.review.aggregate({
    where: { bookId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return {
    bookId,
    averageRating: result._avg.rating
      ? Math.round(result._avg.rating * 100) / 100
      : null,
    reviewCount: result._count.rating,
  };
}