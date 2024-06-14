"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins = ["http://localhost:2800"];
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOriginPatterns = allowedOrigins.map((origin) => new RegExp(`^${origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`));
        if (!origin ||
            allowedOriginPatterns.some((pattern) => pattern.test(origin))) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
exports.default = corsOptions;
