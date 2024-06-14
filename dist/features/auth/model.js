"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = exports.User = void 0;
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        max: 50,
    },
    username: {
        type: String,
        required: true,
        max: 20,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        min: 6,
        max: 30,
        required: true,
        select: false,
    },
    profilePicture: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: false,
        default: "Bridging health with technology",
        max: 500,
    },
    isVerified: {
        type: Boolean,
        required: false,
        default: false,
    },
    location: {
        type: String,
        required: false,
        max: 150,
        default: "",
    },
    state: {
        type: String,
        required: true,
        max: 250,
    },
    country: {
        type: String,
        required: false,
        max: 250,
        default: "Nigeria",
    },
    allTotalAppointments: {
        type: Number,
        required: false,
        default: 0,
    },
    phoneNumber: {
        type: Number,
        required: false,
        default: null,
    },
    online: {
        type: Boolean,
        required: false,
        default: false,
    },
    tags: [
        {
            type: String,
            required: false,
            max: 250,
        },
    ],
    merchantId: {
        type: String,
        required: false,
    },
    appointments: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Appointments",
        },
    ],
    role: {
        type: String,
        required: true,
        enum: ["user", "hospital", "admin"],
        default: "user",
    },
    medicalRecordsAccess: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, { timestamps: true, versionKey: false });
const TokenSchema = new mongoose_1.default.Schema({
    token: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["refresh", "access", "verify"],
        required: true,
    },
    expiresIn: {
        type: Date,
        required: true,
    },
}, { timestamps: true, versionKey: false });
UserSchema.methods.generateAccessToken = function (role) {
    const payload = {
        _id: this._id,
        username: this.username,
        name: this.name,
        role,
    };
    const JWT_SECRET = process.env.JWT_PRIVATE_KEY;
    const tokenExpiration = config_1.default.get("App.tokenExpiration");
    const options = {
        expiresIn: tokenExpiration,
    };
    const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
    return token;
};
UserSchema.methods.generateRefreshToken = function (role) {
    const payload = {
        _id: this._id,
        username: this.username,
        name: this.name,
        role,
    };
    const JWT_SECRET = process.env.JWT_PRIVATE_KEY;
    const options = {
        expiresIn: config_1.default.get("App.refreshTokenExpiration"),
    };
    const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
    return token;
};
exports.User = mongoose_1.default.model("User", UserSchema);
exports.Token = mongoose_1.default.model("Token", TokenSchema);
