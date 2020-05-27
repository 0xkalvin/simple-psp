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

  paymentMethod: Joi
      .valid('credit_card', 'debit_card')
      .required(),

  cardNumber: Joi
      .string()
      .creditCard()
      .required(),

  cardHolderName: Joi
      .string()
      .required(),

  cardExpirationDate: Joi
      .date()
      .format('MM/YY')
      .required(),

  cardVerificationCode: Joi
      .string()
      .length(3)
      .required(),
});


module.exports = {
  createSchema,
};
