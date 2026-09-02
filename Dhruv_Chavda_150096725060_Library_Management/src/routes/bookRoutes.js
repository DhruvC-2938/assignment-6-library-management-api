const express = require("express");

const {
    getAllBooks,
    getSingleBook,
    searchBooks,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook
} = require("../controllers/bookController");

const authenticate = require("../middleware/auth");
const authorize = require("../middleware/role");
const validate = require("../middleware/validator");
const {
    createBookValidation,
    updateBookValidation,
    idParamValidation,
    searchQueryValidation
} = require("../utils/validation");

const router = express.Router();

// Search books (placed before /:id route)
router.get("/search", searchQueryValidation, validate, searchBooks);

// Get all books with optional query filters (?category=...&status=...&author=...)
router.get("/", getAllBooks);

// Get single book details
router.get("/:id", idParamValidation, validate, getSingleBook);

// Librarian only: Add new book
router.post(
    "/",
    authenticate,
    authorize("librarian"),
    createBookValidation,
    validate,
    addBook
);

// Librarian only: Update book
router.put(
    "/:id",
    authenticate,
    authorize("librarian"),
    idParamValidation,
    updateBookValidation,
    validate,
    updateBook
);

// Librarian only: Delete book
router.delete(
    "/:id",
    authenticate,
    authorize("librarian"),
    idParamValidation,
    validate,
    deleteBook
);

// Student only: Borrow a book
router.post(
    "/:id/borrow",
    authenticate,
    authorize("student"),
    idParamValidation,
    validate,
    borrowBook
);

// Student only: Return a book
router.post(
    "/:id/return",
    authenticate,
    authorize("student"),
    idParamValidation,
    validate,
    returnBook
);

module.exports = router;
