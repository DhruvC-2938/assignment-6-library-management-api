const express = require("express");

const {
    register,
    login,
    getProfile,
    updateProfile
} = require("../controllers/authController");

const authenticate = require("../middleware/auth");
const validate = require("../middleware/validator");
const { authLimiter } = require("../middleware/rateLimiter");
const {
    registerValidation,
    loginValidation,
    updateProfileValidation
} = require("../utils/validation");

const router = express.Router();

// Public auth routes (with rate limiting and validation)
router.post("/register", authLimiter, registerValidation, validate, register);
router.post("/login", authLimiter, loginValidation, validate, login);

// Protected profile routes
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfileValidation, validate, updateProfile);

module.exports = router;