"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const app_1 = require("../constants/app");
const sendEmail_1 = __importDefault(require("../services/email/sendEmail"));
utils_1.eventEmitter.on(app_1.MEDICATION_CREATED, (data) => {
    const { userDetails, hospitalName, medication } = data;
    const { name, email } = userDetails;
    const sideEffects = medication.sideEffects.join(", ") || "none";
    const message = ` 
     <p>Dear <strong>${name}</strong>,</p>
     <p>We hope this email finds you well.</p>
     <p>We are pleased to inform you that <strong>${hospitalName}</strong> has recently published a medication for you. The medication contains detailed information about the description, including usage instructions, dosage,  side effects, bills and more.</p>
       <p>Here are the details of the newly published medication information:</p>
        <ul>
            <li><strong>Medication Name</strong>: ${medication.name}</li>
            <li><strong>Usage</strong>:${medication.description}</li>
            <li><strong>Dosage</strong>:${medication.dosage}</li>
            <li><strong>Side Effects</strong>:${sideEffects}</li>
            <li><strong>Bills</strong>:${medication.totalPrice}</li>
        </ul>

        <p>Please note that the attached bill pertains to your recent appointment or doctor consultancy fee, and it is not related to the medication.</p>
        <br/>

        <p>You can view the full medication details by visiting your dashboard or by clicking the link below</p>
        <p><a href="http://localhost:3000/user/medications/${medication._id}" target="_blank">View Medication Information</a></p>

    `;
    (0, sendEmail_1.default)("Medication Information", message, email);
});
