"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDrugsSchema = exports.updateDrugSchema = exports.createDrugSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createDrugSchema = joi_1.default.object({
    name: joi_1.default.string().required().max(250),
    description: joi_1.default.string().required().max(2500),
    dosage: joi_1.default.string().required().max(2500),
    price: joi_1.default.number().required(),
    status: joi_1.default.string().allow("active", "inactive").default("active"),
});
exports.updateDrugSchema = joi_1.default.object({
    name: joi_1.default.string().optional().max(250),
    description: joi_1.default.string().optional().max(2500),
    dosage: joi_1.default.string().optional().max(2500),
    price: joi_1.default.number().optional(),
    status: joi_1.default.string().optional().allow("active", "inactive"),
    imageUrl: joi_1.default.string().optional(),
});
exports.getDrugsSchema = joi_1.default.object({
    skip: joi_1.default.number().optional(),
    take: joi_1.default.number().optional(),
    where: joi_1.default.string().optional(),
    orderBy: joi_1.default.string().optional(),
});
