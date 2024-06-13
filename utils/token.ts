import crypto from "crypto";
import dayjs from "dayjs";

export const generateVerificationToken = (userId: string) => {
  return {
    token: crypto.randomBytes(16).toString("hex"),
    userId: userId,
    type: "verify",
    expiresIn: dayjs().add(24, "hour").toISOString(),
  };
};
