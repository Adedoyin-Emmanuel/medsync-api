"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DrugSchema = new mongoose_1.default.Schema({
    hospitalId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Hospital",
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
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    imageUrl: {
        type: String,
        required: true,
    },
}, { timestamps: true, versionKey: false });
const Drug = mongoose_1.default.model("Drug", DrugSchema);
exports.default = Drug;
