"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const app_1 = require("../constants/app");
const sendEmail_1 = __importDefault(require("../services/email/sendEmail"));
utils_1.eventEmitter.on(app_1.ACCOUNT_CREATED, (data) => {
    const { email, token } = data;
    const url = app_1.IS_PRODUCTION
        ? `http://localhost:2800/api/auth/verify-email?token=${token}`
        : `https://medsync-api.com/api/auth/verify-email?token=${token}`;
    const message = `Welcome. Please verify your email by clicking the link below. 
    ${url}
    `;
    (0, sendEmail_1.default)("Verify your account", message, email);
});
