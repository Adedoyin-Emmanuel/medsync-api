import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().required().max(50),
  username: Joi.string().required().max(20),
  email: Joi.string().required().email(),
  password: Joi.string().min(6).max(30).required(),
  state: Joi.string().required().max(250),
  country: Joi.string().max(250).default("Nigeria"),
});

export const createHospitalSchema = Joi.object({
  name: Joi.string().required().max(50),
  username: Joi.string().required().max(20),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6).max(30),
  state: Joi.string().required().max(250),
  country: Joi.string().max(250).default("Nigeria"),
  tags: Joi.array().items(Joi.string()).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6).max(30),
});
