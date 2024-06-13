import transporter from "../../utils/mail.config";
import { logger } from "../../utils";

const sendEmail = (
  subject: string,
  data: string,
  toEmail: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.MAIL_FROM_ADDRESS,
      to: toEmail,
      subject: subject,
      html: data,
    };
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        logger.error(error);
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
};

export default sendEmail;
