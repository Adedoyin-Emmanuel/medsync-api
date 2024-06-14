import Joi from "joi";

export const createAppointmentSchema = Joi.object({
  title: Joi.string().required().max(50),
  description: Joi.string().required().max(1000),
  hospitalId: Joi.string().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
  medicalRecordAccess: Joi.boolean().default(false),
});

export const updateAppointmentSchema = Joi.object({
  title: Joi.string().optional().max(50),
  description: Joi.string().optional().max(1000),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  medicalRecordAccess: Joi.boolean().default(false),
});
