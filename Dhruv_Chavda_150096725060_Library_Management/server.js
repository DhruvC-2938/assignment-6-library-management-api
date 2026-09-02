const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Initialize Firebase
const { db } = require("./src/config/firebase");

// Import Middleware
const requestLogger = require("./src/middleware/logger");
const { apiLimiter } = require("./src/middleware/rateLimiter");
const { setupSwagger } = require("./src/config/swagger");

// Import Routes
const authRoutes = require("./src/routes/authRoutes");
const bookRoutes = require("./src/routes/bookRoutes");
const userRoutes = require("./src/routes/userRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Request logging middleware
app.use(requestLogger);

// General API rate limiter
app.use(apiLimiter);

// Setup Swagger API Documentation
setupSwagger(app);

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

// Root route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Library Management API is running",
        documentation: "/api-docs"
    });
});

// Firebase connection test
app.get("/api/test-firebase", async (req, res) => {
    try {
        await db.collection("test").limit(1).get();

        res.status(200).json({
            success: true,
            message: "Firebase Firestore connected successfully"
        });
    } catch (error) {
        console.error("Firebase Error:", error);

        res.status(500).json({
            success: false,
            message: "Firebase connection failed",
            error: error.message
        });
    }
});

// 404 Not Found Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.method} ${req.originalUrl} not found`
    });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;