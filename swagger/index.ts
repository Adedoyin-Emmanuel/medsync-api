import express from "express";
import path from "path";

const swaggerRouter = express.Router();

const swaggerDocumentPath = path.join(__dirname, "swagger.json");
swaggerRouter.get("/swagger.json", (req, res) => {
  res.sendFile(swaggerDocumentPath);
});

swaggerRouter.get("/redoc-docs", (req, res) => {
  const redocHtmlPath = path.join(__dirname + "/ui", "redoc.html");
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'; worker-src 'self' blob:;"
  );
  res.sendFile(redocHtmlPath);
});

swaggerRouter.get("/swagger-ui", (req, res) => {
  const swaggerUiHtmlPath = path.join(__dirname, "/ui", "swagger.html");
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline';"
  );
  res.sendfile(swaggerUiHtmlPath);
});

swaggerRouter.get("/", (req, res) => {
  res.send("Swagger Server 🔥 - use /swagger-ui or /api-docs");
});

export default swaggerRouter;
