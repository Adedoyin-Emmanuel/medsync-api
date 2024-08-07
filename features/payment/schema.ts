import Joi from "joi";

export const createHospitalSubMerchantAccountSchema = Joi.object({
  displayName: Joi.string().required(),
  accountName: Joi.string().required(),
  bankCode: Joi.number().required(),
  accountNumber: Joi.number().required(),
  bank: Joi.string().required(),
});

export const createHospitalTransactionSchema = Joi.object({
  amount: Joi.number().required(),
  description: Joi.string().required(),
  userId: Joi.string().required(),
  callbackUrl: Joi.string().required(),
  appointmentId: Joi.string().required()
});

export const createUserTransactionSchema = createHospitalTransactionSchema;
