import Joi from "joi";

export const updateExperienceSchema = Joi.object({
  title: Joi.string().min(2).optional(),
  description: Joi.string().optional(),
  location: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  available_places: Joi.number().integer().min(1).optional()
});