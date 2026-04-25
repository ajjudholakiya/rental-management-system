const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('', null),
  quantity: Joi.number().integer().min(1).required(),
  rentable: Joi.boolean().required(),
  status: Joi.string().valid('available', 'inactive').required()
});

const updateProductSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow('', null),
  quantity: Joi.number().integer().min(1),
  rentable: Joi.boolean(),
  status: Joi.string().valid('available', 'inactive')
});

const pricingSchema = Joi.object({
  pricePerHour: Joi.number().precision(2).required(),
  pricePerDay: Joi.number().precision(2).required(),
  pricePerWeek: Joi.number().precision(2).required()
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  pricingSchema
};
