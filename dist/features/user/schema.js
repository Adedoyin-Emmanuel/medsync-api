"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHospitalSchema = exports.updateUserSchema = exports.getUserByIdSchema = exports.getUsersSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.getUsersSchema = joi_1.default.object({
    skip: joi_1.default.number().optional(),
    take: joi_1.default.number().optional(),
    where: joi_1.default.string().optional(),
    orderBy: joi_1.default.string().optional(),
});
exports.getUserByIdSchema = joi_1.default.object({
    id: joi_1.default.string().uuid().required(),
});
exports.updateUserSchema = joi_1.default.object({
    name: joi_1.default.string().optional().max(50),
    username: joi_1.default.string().optional().max(20),
    state: joi_1.default.string().optional().max(250),
    country: joi_1.default.string().max(250).default("Nigeria"),
    bio: joi_1.default.string().optional(),
    location: joi_1.default.string().optional(),
    phoneNumber: joi_1.default.number().optional(),
});
exports.updateHospitalSchema = joi_1.default.object({
    name: joi_1.default.string().optional().max(50),
    username: joi_1.default.string().optional().max(20),
    state: joi_1.default.string().optional().max(250),
    country: joi_1.default.string().max(250).default("Nigeria"),
    tags: joi_1.default.array().items(joi_1.default.string()).optional(),
    location: joi_1.default.string().optional(),
    bio: joi_1.default.string().optional(),
    profilePicture: joi_1.default.string().optional().uri(),
    phoneNumber: joi_1.default.number().optional(),
});
