const JoiDate = require('@hapi/joi-date');
const Joi = require('@hapi/joi').extend(JoiDate);

const createSchema = Joi.object({
  description: Joi
      .string()
      .allow('')
      .required(),

  amount: Joi
      .number()
      .positive()
      .required(),

  payment_method: Joi
      .valid('credit_card', 'debit_card')
      .required(),

  card_number: Joi
      .string()
      .creditCard()
      .required(),

  card_holder_name: Joi
      .string()
      .required(),

  card_expiration_date: Joi
      .date()
      .format('MM/YY')
      .required(),

  card_verification_code: Joi
      .string()
      .length(3)
      .required(),
});


module.exports = {
  createSchema,
};
