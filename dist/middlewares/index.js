"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFileSizeLimitException = exports.fileUpload = exports.upload = exports.useCheckRole = exports.useAuth = exports.useNotFound = exports.useErrorHandler = void 0;
const auth_1 = __importDefault(require("./auth"));
exports.useAuth = auth_1.default;
const error_1 = __importDefault(require("./error"));
exports.useErrorHandler = error_1.default;
const notFound_1 = __importDefault(require("./notFound"));
exports.useNotFound = notFound_1.default;
const checkRole_1 = __importDefault(require("./checkRole"));
exports.useCheckRole = checkRole_1.default;
const upload_1 = require("./upload");
Object.defineProperty(exports, "upload", { enumerable: true, get: function () { return upload_1.upload; } });
Object.defineProperty(exports, "fileUpload", { enumerable: true, get: function () { return upload_1.fileUpload; } });
Object.defineProperty(exports, "handleFileSizeLimitException", { enumerable: true, get: function () { return upload_1.handleFileSizeLimitException; } });
