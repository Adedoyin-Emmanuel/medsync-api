import Joi from "joi";

export const createDrugSchema = Joi.object({
  name: Joi.string().required().max(250),
  description: Joi.string().required().max(2500),
  dosage: Joi.string().required().max(2500),
  price: Joi.number().required(),
  status: Joi.string().allow("active", "inactive").default("active"),
});

export const updateDrugSchema = Joi.object({
  name: Joi.string().optional().max(250),
  description: Joi.string().optional().max(2500),
  dosage: Joi.string().optional().max(2500),
  price: Joi.number().optional(),
  status: Joi.string().optional().allow("active", "inactive"),
  imageUrl: Joi.string().optional(),
});

export const getDrugsSchema = Joi.object({
  skip: Joi.number().optional(),
  take: Joi.number().optional(),
  where: Joi.string().optional(),
  orderBy: Joi.string().optional(),
});
