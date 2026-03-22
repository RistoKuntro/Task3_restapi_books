import * as mockBookService from "./book.service.js";
import * as mockAuthorService from "./author.service.js";
import * as mockPublisherService from "./publisher.service.js";
import * as mockReviewService from "./review.service.js";
import * as mockGenreService from "./genre.service.js";

const useDb = process.env.USE_DB === "true";

console.log(`Data layer: ${useDb ? "PostgreSQL (Prisma)" : "In-memory mock data"}`);

export const bookService      = mockBookService;
export const authorService    = mockAuthorService;
export const publisherService = mockPublisherService;
export const reviewService    = mockReviewService;
export const genreService     = mockGenreService;