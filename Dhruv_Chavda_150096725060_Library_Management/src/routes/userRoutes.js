const express = require("express");

const {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser
} = require("../controllers/userController");

const authenticate = require("../middleware/auth");
const authorize = require("../middleware/role");
const validate = require("../middleware/validator");
const {
    idParamValidation,
    updateRoleValidation
} = require("../utils/validation");

const router = express.Router();

// All user management routes require authentication and librarian role
router.use(authenticate);
router.use(authorize("librarian"));

// GET /api/users - Get all users
router.get("/", getAllUsers);

// GET /api/users/:id - Get user details
router.get("/:id", idParamValidation, validate, getUserById);

// PUT /api/users/:id/role - Update user role
router.put("/:id/role", idParamValidation, updateRoleValidation, validate, updateUserRole);

// DELETE /api/users/:id - Delete user
router.delete("/:id", idParamValidation, validate, deleteUser);

module.exports = router;
