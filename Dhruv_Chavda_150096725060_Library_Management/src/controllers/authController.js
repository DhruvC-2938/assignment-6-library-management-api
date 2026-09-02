const bcrypt = require("bcrypt");

const {
    createUser,
    findUserByEmail,
    findUserById,
    updateUser
} = require("../models/userModel");

const { generateToken } = require("../utils/jwt");

// ==================== REGISTER ====================

const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // Only allow valid roles
        const userRole = role || "student";

        if (!["student", "librarian"].includes(userRole)) {
            return res.status(400).json({
                success: false,
                message: "Role must be student or librarian"
            });
        }

        // Check if email already exists
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await createUser({
            name,
            email,
            password: hashedPassword,
            role: userRole
        });

        // Never send password back
        const { password: _, ...safeUser } = user;

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: safeUser
        });

    } catch (error) {
        next(error);
    }
};


// ==================== LOGIN ====================

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = generateToken(user);

        // Don't return password
        const { password: _, ...safeUser } = user;

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: safeUser
        });

    } catch (error) {
        next(error);
    }
};


// ==================== GET PROFILE ====================

const getProfile = async (req, res, next) => {
    try {
        const user = await findUserById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { password: _, ...safeUser } = user;
        return res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            user: safeUser
        });
    } catch (error) {
        next(error);
    }
};


// ==================== UPDATE PROFILE ====================

const updateProfile = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required to update profile"
            });
        }

        const updatedUser = await updateUser(req.user.userId, { name: name.trim() });
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { password: _, ...safeUser } = updatedUser;
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: safeUser
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};