import { Router } from "express";
import * as bookController from "../controllers/book.controller.js";
import * as authorController from "../controllers/author.controller.js";
import * as publisherController from "../controllers/publisher.controller.js";
import * as reviewController from "../controllers/review.controller.js";
import * as genreController from "../controllers/genre.controller.js";
import { validateId } from "../middleware/validateId.js";

const router = Router();

const id = validateId("id");
const bookId = validateId("bookId");

// Books
router.get("/books", bookController.getAllBooks);
router.post("/books", bookController.createBook);
router.get("/books/:id", id, bookController.getBookById);
router.put("/books/:id", id, bookController.updateBook);
router.delete("/books/:id", id, bookController.deleteBook);
router.get("/books/:id/reviews", id, bookController.getBookReviews);
router.get("/books/:id/average-rating", id, bookController.getAverageRating);

// Reviews
router.post("/books/:bookId/reviews", bookId, reviewController.createReview);
router.get("/reviews/:id", id, reviewController.getReviewById);
router.put("/reviews/:id", id, reviewController.updateReview);
router.delete("/reviews/:id", id, reviewController.deleteReview);

// Authors
router.get("/authors", authorController.getAllAuthors);
router.post("/authors", authorController.createAuthor);
router.get("/authors/:id", id, authorController.getAuthorById);
router.put("/authors/:id", id, authorController.updateAuthor);
router.delete("/authors/:id", id, authorController.deleteAuthor);
router.get("/authors/:id/books", id, authorController.getAuthorBooks);

// Publishers
router.get("/publishers", publisherController.getAllPublishers);
router.post("/publishers", publisherController.createPublisher);
router.get("/publishers/:id", id, publisherController.getPublisherById);
router.put("/publishers/:id", id, publisherController.updatePublisher);
router.delete("/publishers/:id", id, publisherController.deletePublisher);
router.get("/publishers/:id/books", id, publisherController.getPublisherBooks);

// Genres
router.get("/genres", genreController.getAllGenres);
router.post("/genres", genreController.createGenre);
router.get("/genres/:id", id, genreController.getGenreById);
router.get("/genres/:id/books", id, genreController.getGenreBooks);

export default router;
