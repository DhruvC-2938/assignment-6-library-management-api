const express = require("express");

const {
    getAllTransactions,
    getMyTransactions
} = require("../controllers/bookController");

const authenticate = require("../middleware/auth");
const authorize = require("../middleware/role");

const router = express.Router();

// Require authentication for all transaction routes
router.use(authenticate);

// GET /api/transactions/my - Get logged-in user's transaction history (Student/User)
router.get("/my", getMyTransactions);

// GET /api/transactions - Get all transactions across the library (Librarian only)
router.get("/", authorize("librarian"), getAllTransactions);

module.exports = router;
