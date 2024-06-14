import Joi from "joi";

export const getUsersSchema = Joi.object({
  skip: Joi.number().optional(),
  take: Joi.number().optional(),
  where: Joi.string().optional(),
  orderBy: Joi.string().optional(),
});

export const getUserByIdSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().optional().max(50),
  username: Joi.string().optional().max(20),
  state: Joi.string().optional().max(250),
  country: Joi.string().max(250).default("Nigeria"),
  bio: Joi.string().optional(),
  location: Joi.string().optional(),
  phoneNumber: Joi.number().optional(),
});

export const updateHospitalSchema = Joi.object({
  name: Joi.string().optional().max(50),
  username: Joi.string().optional().max(20),
  state: Joi.string().optional().max(250),
  country: Joi.string().max(250).default("Nigeria"),
  tags: Joi.array().items(Joi.string()).optional(),
  location: Joi.string().optional(),
  bio: Joi.string().optional(),
  profilePicture: Joi.string().optional().uri(),
  phoneNumber: Joi.number().optional(),
});
