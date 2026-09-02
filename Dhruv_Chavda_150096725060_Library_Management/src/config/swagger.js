const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const swaggerUi = require("swagger-ui-express");

// Load the Swagger YAML documentation
const swaggerFilePath = path.join(__dirname, "../../docs/swagger.yaml");
let swaggerDocument = {};

try {
    const file = fs.readFileSync(swaggerFilePath, "utf8");
    swaggerDocument = YAML.parse(file);
} catch (error) {
    console.error("Failed to load swagger.yaml file:", error.message);
}

/**
 * Configure and attach Swagger UI to the Express app
 * @param {import('express').Application} app
 */
const setupSwagger = (app) => {
    // Serve OpenAPI spec as JSON
    app.get("/api/docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerDocument);
    });

    // Serve Swagger UI
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = {
    setupSwagger,
    swaggerDocument
};
