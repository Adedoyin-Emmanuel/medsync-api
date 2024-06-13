import { eventEmitter } from "../utils";
import { ACCOUNT_CREATED, IS_PRODUCTION } from "../constants/app";
import sendEmail from "../services/email/sendEmail";

eventEmitter.on(ACCOUNT_CREATED, (data) => {
  const { email, token } = data;

  const url = IS_PRODUCTION
    ? `http://localhost:2800/api/auth/verify-email?token=${token}`
    : `https://medsync-api.com/api/auth/verify-email?token=${token}`;

  const message = `Welcome. Please verify your email by clicking the link below. 
    ${url}
    `;
  sendEmail("Verify your account", message, email);
});
