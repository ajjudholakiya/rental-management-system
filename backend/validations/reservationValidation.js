const Joi = require('joi');

const availabilitySchema = Joi.object({
  productId: Joi.number().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required()
});

const createReservationSchema = Joi.object({
  productId: Joi.number().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required()
});

module.exports = {
  availabilitySchema,
  createReservationSchema
};
