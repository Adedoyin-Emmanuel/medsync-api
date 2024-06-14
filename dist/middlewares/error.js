"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/");
const logger_1 = __importDefault(require("../utils/logger"));
const errors_1 = require("../constants/errors");
const joi_1 = __importDefault(require("joi"));
const useErrorHandler = (err, req, res, next) => {
    logger_1.default.error(err.stack);
    if (err instanceof joi_1.default.ValidationError) {
        return (0, utils_1.response)(res, 400, err.details[0].message);
    }
    const isProduction = process.env.NODE_ENV === "production";
    return (0, utils_1.response)(res, 500, `${errors_1.SOMETHING_WENT_WRONG} ${isProduction ? "" : err.stack}`);
};
exports.default = useErrorHandler;
