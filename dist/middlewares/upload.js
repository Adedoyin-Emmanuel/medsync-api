"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFileSizeLimitException = exports.upload = exports.fileUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const utils_1 = require("../utils/");
const response_1 = __importDefault(require("../utils/response"));
const local_1 = __importDefault(require("../services/upload/local"));
const cloudinary_1 = __importDefault(require("../services/upload/cloudinary"));
const errors_1 = require("../constants/errors");
const app_1 = require("../constants/app");
const storage = multer_1.default.memoryStorage();
const handleFileSizeLimitException = (error, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (error.code === "LIMIT_FILE_SIZE") {
        return (0, response_1.default)(res, 413, errors_1.LIMIT_FILE_SIZE);
    }
});
exports.handleFileSizeLimitException = handleFileSizeLimitException;
const fileFilter = (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const allowedExtension = app_1.ALLOWED_FILE_UPLOAD_EXTENSIONS;
        const fileExtension = (_c = (_b = (_a = file === null || file === void 0 ? void 0 : file.originalname) === null || _a === void 0 ? void 0 : _a.split(".")) === null || _b === void 0 ? void 0 : _b.pop()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
        if (allowedExtension.includes(fileExtension)) {
            return cb(null, true);
        }
        const error = new Error(errors_1.UNSUPPORTED_FILE_TYPE);
        error.code = "UNSUPPORTED_FILE_TYPE";
        return cb(error);
    }
    catch (err) {
        utils_1.logger.error(err.message);
    }
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: app_1.MAX_FILE_SIZE,
    },
});
exports.upload = upload;
const fileUpload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        req.storage = app_1.IS_PRODUCTION
            ? yield (0, cloudinary_1.default)()
            : yield (0, local_1.default)();
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.fileUpload = fileUpload;
