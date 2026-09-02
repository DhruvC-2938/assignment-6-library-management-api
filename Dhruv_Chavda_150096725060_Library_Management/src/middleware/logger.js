/**
 * Request logging middleware
 * Logs HTTP method, URL, timestamp, and authenticated user (if available)
 */
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl || req.url;

    res.on("finish", () => {
        const user = req.user ? `[User: ${req.user.userId || req.user.email} (${req.user.role})]` : "[Guest]";
        const statusCode = res.statusCode;
        console.log(`[${timestamp}] ${method} ${url} -> Status: ${statusCode} ${user}`);
    });

    next();
};

module.exports = requestLogger;
