"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMedicationsSchema = exports.updateMedicationSchema = exports.createMedicationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createMedicationSchema = joi_1.default.object({
    userId: joi_1.default.string().required(),
    name: joi_1.default.string().required().max(250),
    description: joi_1.default.string().required().max(2500),
    dosage: joi_1.default.string().required().max(2500),
    totalPrice: joi_1.default.number().required(),
    drugs: joi_1.default.array().items().required(),
    sideEffects: joi_1.default.array().items().optional(),
});
exports.updateMedicationSchema = joi_1.default.object({
    name: joi_1.default.string().optional().max(250),
    description: joi_1.default.string().optional().max(2500),
    dosage: joi_1.default.string().optional().max(2500),
    totalPrice: joi_1.default.number().optional(),
    drugs: joi_1.default.array().items().optional(),
    sideEffects: joi_1.default.array().items().optional(),
});
exports.getMedicationsSchema = joi_1.default.object({
    skip: joi_1.default.number().optional(),
    take: joi_1.default.number().optional(),
    where: joi_1.default.string().optional(),
    orderBy: joi_1.default.string().optional(),
});
