"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const { combine, timestamp, json } = winston_1.default.format;
const logDir = "logs";
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir);
}
const errorLogPath = path_1.default.join(logDir, "error.log");
const combinedLogPath = path_1.default.join(logDir, "combined.log");
if (!fs_1.default.existsSync(errorLogPath)) {
    fs_1.default.writeFileSync(errorLogPath, "");
}
if (!fs_1.default.existsSync(combinedLogPath)) {
    fs_1.default.writeFileSync(combinedLogPath, "");
}
const logger = winston_1.default.createLogger({
    level: "info",
    format: combine(timestamp(), json()),
    defaultMeta: { service: "user-service" },
    transports: [
        new winston_1.default.transports.File({
            dirname: logDir,
            filename: "error.log",
            level: "error",
        }),
        new winston_1.default.transports.File({
            dirname: logDir,
            filename: "combined.log",
        }),
    ],
});
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.colorize(),
    }));
}
exports.default = logger;
