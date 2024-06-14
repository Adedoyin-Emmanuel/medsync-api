"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logDir = path_1.default.join(__dirname, "../logs");
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
const accessLogPath = path_1.default.join(logDir, "access.log");
if (!fs_1.default.existsSync(accessLogPath)) {
    fs_1.default.writeFileSync(accessLogPath, "");
}
const accessLogStream = fs_1.default.createWriteStream(accessLogPath, { flags: "a" });
exports.default = accessLogStream;
