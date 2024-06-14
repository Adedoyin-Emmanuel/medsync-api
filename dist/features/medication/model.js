"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MedicationSchema = new mongoose_1.default.Schema({
    hospitalId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
        required: true,
        max: 250,
    },
    description: {
        type: String,
        required: true,
        max: 2500,
    },
    dosage: {
        type: String,
        required: true,
        max: 2500,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    drugs: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Drug",
            required: true,
        },
    ],
    sideEffects: [
        {
            type: String,
            default: "none",
            required: false,
        },
    ],
}, { timestamps: true, versionKey: false });
const Medication = mongoose_1.default.model("Medication", MedicationSchema);
exports.default = Medication;
