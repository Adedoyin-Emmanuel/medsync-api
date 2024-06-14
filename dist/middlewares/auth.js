"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../utils");
const useAuth = (req, res, next) => {
    const refreshTokenCookie = req.cookies.refreshToken;
    if (!refreshTokenCookie)
        return (0, utils_1.response)(res, 401, "Access denied, invalid or expired token");
    const JWT_SECRET = process.env.JWT_PRIVATE_KEY;
    let decodeCookie = jsonwebtoken_1.default.verify(refreshTokenCookie, JWT_SECRET);
    if (decodeCookie) {
        req.user = decodeCookie;
        if (decodeCookie.role == "user") {
            req.userType = "user";
            next();
        }
        else if (decodeCookie.role == "hospital") {
            req.userType = "hospital";
            next();
        }
        else {
            return (0, utils_1.response)(res, 401, "Invalid auth token");
        }
    }
    else {
        return (0, utils_1.response)(res, 401, "Invalid auth token");
    }
};
exports.default = useAuth;
