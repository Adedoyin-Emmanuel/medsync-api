import Joi from "joi";

export const createMedicationSchema = Joi.object({
  userId: Joi.string().required(),
  appointmentId: Joi.string().required(),
  name: Joi.string().required().max(250),
  description: Joi.string().required().max(2500),
  dosage: Joi.string().required().max(2500),
  totalPrice: Joi.number().required(),
  drugs: Joi.array().items().required(),
  sideEffects: Joi.array().items().optional(),
});

export const updateMedicationSchema = Joi.object({
  name: Joi.string().optional().max(250),
  description: Joi.string().optional().max(2500),
  dosage: Joi.string().optional().max(2500),
  totalPrice: Joi.number().optional(),
  drugs: Joi.array().items().optional(),
  sideEffects: Joi.array().items().optional(),
});

export const getMedicationsSchema = Joi.object({
  skip: Joi.number().optional(),
  take: Joi.number().optional(),
  where: Joi.string().optional(),
  orderBy: Joi.string().optional(),
});
