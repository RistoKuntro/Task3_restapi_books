import * as mockBookService from "./book.service.js";
import * as mockAuthorService from "./author.service.js";
import * as mockPublisherService from "./publisher.service.js";
import * as mockReviewService from "./review.service.js";
import * as mockGenreService from "./genre.service.js";

import * as dbBookService from "./db/book.db.service.js";
import * as dbAuthorService from "./db/author.db.service.js";
import * as dbPublisherService from "./db/publisher.db.service.js";
import * as dbReviewService from "./db/review.db.service.js";
import * as dbGenreService from "./db/genre.db.service.js";

const useDb = process.env.USE_DB === "true";

console.log(
  `Data layer: ${useDb ? "PostgreSQL (Prisma)" : "In-memory mock data"}`,
);

export const bookService = useDb ? dbBookService : mockBookService;
export const authorService = useDb ? dbAuthorService : mockAuthorService;
export const publisherService = useDb
  ? dbPublisherService
  : mockPublisherService;
export const reviewService = useDb ? dbReviewService : mockReviewService;
export const genreService = useDb ? dbGenreService : mockGenreService;
