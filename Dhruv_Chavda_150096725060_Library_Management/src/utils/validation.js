const { body, param, query } = require("express-validator");

// Auth validations
const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Must be a valid email address")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("role")
        .optional()
        .isIn(["student", "librarian"])
        .withMessage("Role must be either 'student' or 'librarian'")
];

const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Must be a valid email address"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
];

const updateProfileValidation = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long")
];

// Book validations
const createBookValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required"),
    body("author")
        .trim()
        .notEmpty()
        .withMessage("Author is required"),
    body("isbn")
        .trim()
        .notEmpty()
        .withMessage("ISBN is required"),
    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required"),
    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive integer of at least 1")
];

const updateBookValidation = [
    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty"),
    body("author")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Author cannot be empty"),
    body("isbn")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("ISBN cannot be empty"),
    body("category")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category cannot be empty"),
    body("quantity")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Quantity must be a non-negative integer"),
    body("status")
        .optional()
        .isIn(["available", "borrowed"])
        .withMessage("Status must be either 'available' or 'borrowed'")
];

// User role validation
const updateRoleValidation = [
    body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(["student", "librarian"])
        .withMessage("Role must be either 'student' or 'librarian'")
];

// ID param validation
const idParamValidation = [
    param("id")
        .trim()
        .notEmpty()
        .withMessage("Valid ID parameter is required")
];

// Search query validation
const searchQueryValidation = [
    query("q")
        .optional()
        .trim(),
    query("title")
        .optional()
        .trim(),
    query("author")
        .optional()
        .trim()
];

module.exports = {
    registerValidation,
    loginValidation,
    updateProfileValidation,
    createBookValidation,
    updateBookValidation,
    updateRoleValidation,
    idParamValidation,
    searchQueryValidation
};
