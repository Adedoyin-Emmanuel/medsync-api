"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AppointmentSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        max: 50,
    },
    description: {
        type: String,
        required: true,
        max: 1000,
    },
    hospitalId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: false,
        default: "pending",
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    reviews: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Review", required: false },
    ],
    medication: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Medication",
        required: false,
    },
}, { timestamps: true, versionKey: false });
const Appointment = mongoose_1.default.model("Appointment", AppointmentSchema);
exports.default = Appointment;
