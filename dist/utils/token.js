"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const dayjs_1 = __importDefault(require("dayjs"));
const generateVerificationToken = (userId) => {
    return {
        token: crypto_1.default.randomBytes(16).toString("hex"),
        userId: userId,
        type: "verify",
        expiresIn: (0, dayjs_1.default)().add(24, "hour").toISOString(),
    };
};
exports.generateVerificationToken = generateVerificationToken;
