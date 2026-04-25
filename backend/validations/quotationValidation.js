const Joi = require('joi');

const createQuotationSchema = Joi.object({
  notes: Joi.string().allow('', null)
});

const addItemSchema = Joi.object({
  productId: Joi.number().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required()
});

module.exports = {
  createQuotationSchema,
  addItemSchema
};
