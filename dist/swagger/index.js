"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const swaggerRouter = express_1.default.Router();
const swaggerDocumentPath = path_1.default.join(__dirname, "swagger.json");
swaggerRouter.get("/swagger.json", (req, res) => {
    res.sendFile(swaggerDocumentPath);
});
swaggerRouter.get("/redoc-docs", (req, res) => {
    const redocHtmlPath = path_1.default.join(__dirname + "/ui", "redoc.html");
    res.setHeader("Content-Security-Policy", "script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'; worker-src 'self' blob:;");
    res.sendFile(redocHtmlPath);
});
swaggerRouter.get("/swagger-ui", (req, res) => {
    const swaggerUiHtmlPath = path_1.default.join(__dirname, "/ui", "swagger.html");
    res.setHeader("Content-Security-Policy", "script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline';");
    res.sendfile(swaggerUiHtmlPath);
});
swaggerRouter.get("/", (req, res) => {
    res.send("Swagger Server 🔥 - use /swagger-ui or /api-docs");
});
exports.default = swaggerRouter;
