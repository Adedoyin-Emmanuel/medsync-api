"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_config_1 = __importDefault(require("../../utils/mail.config"));
const utils_1 = require("../../utils");
const sendEmail = (subject, data, toEmail) => {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: process.env.MAIL_FROM_ADDRESS,
            to: toEmail,
            subject: subject,
            html: data,
        };
        mail_config_1.default.sendMail(mailOptions, (error) => {
            if (error) {
                utils_1.logger.error(error);
                reject(error);
            }
            else {
                resolve(true);
            }
        });
    });
};
exports.default = sendEmail;
