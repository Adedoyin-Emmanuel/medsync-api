"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.createHospitalSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserSchema = joi_1.default.object({
    name: joi_1.default.string().required().max(50),
    username: joi_1.default.string().required().max(20),
    email: joi_1.default.string().required().email(),
    password: joi_1.default.string().min(6).max(30).required(),
    state: joi_1.default.string().required().max(250),
    country: joi_1.default.string().max(250).default("Nigeria"),
});
exports.createHospitalSchema = joi_1.default.object({
    name: joi_1.default.string().required().max(50),
    username: joi_1.default.string().required().max(20),
    email: joi_1.default.string().required().email(),
    password: joi_1.default.string().required().min(6).max(30),
    state: joi_1.default.string().required().max(250),
    country: joi_1.default.string().max(250).default("Nigeria"),
    tags: joi_1.default.array().items(joi_1.default.string()).required(),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().required().email(),
    password: joi_1.default.string().required().min(6).max(30),
});
