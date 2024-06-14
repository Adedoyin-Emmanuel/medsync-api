"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppointmentSchema = exports.createAppointmentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAppointmentSchema = joi_1.default.object({
    title: joi_1.default.string().required().max(50),
    description: joi_1.default.string().required().max(1000),
    hospitalId: joi_1.default.string().required(),
    startDate: joi_1.default.date().iso().required(),
    endDate: joi_1.default.date().iso().required(),
    medicalRecordAccess: joi_1.default.boolean().default(false),
});
exports.updateAppointmentSchema = joi_1.default.object({
    title: joi_1.default.string().optional().max(50),
    description: joi_1.default.string().optional().max(1000),
    startDate: joi_1.default.date().iso().optional(),
    endDate: joi_1.default.date().iso().optional(),
    medicalRecordAccess: joi_1.default.boolean().default(false),
});
