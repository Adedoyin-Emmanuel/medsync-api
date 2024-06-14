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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const logger_1 = __importDefault(require("./../../utils/logger"));
function localStorage() {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            uploadFile(file) {
                var _a, _b, _c;
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const uploadDir = path_1.default.join(__dirname, "files");
                        const fileExtension = (_c = (_b = (_a = file === null || file === void 0 ? void 0 : file.originalname) === null || _a === void 0 ? void 0 : _a.split(".")) === null || _b === void 0 ? void 0 : _b.pop()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
                        const newFileName = `${(0, uuid_1.v4)().toString()}.${fileExtension}`;
                        const filePath = path_1.default.join(uploadDir, newFileName);
                        yield fs_1.default.promises.mkdir(uploadDir, { recursive: true });
                        yield fs_1.default.promises.writeFile(filePath, file.buffer);
                        return `/files/${newFileName}`;
                    }
                    catch (error) {
                        logger_1.default.error(error);
                    }
                });
            },
        };
    });
}
exports.default = localStorage;
