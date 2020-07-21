const test = require('ava');

const { req, res, next } = require('../helpers/handlers');
const { create } = require('../../src/resources/transaction');

test('Should create transaction successfully', async (t) => {
  const payload = {
    description: 'Tyrannosaurus Rex',
    payment_method: 'credit_card',
    amount: 10000000000,
    card_number: '5219981851495587',
    card_holder_name: 'Elon Musk',
    card_expiration_date: '10/10',
    card_verification_code: '343',
  };

  const { statusCode } = await create({ ...req, body: payload }, res, next);
  t.is(statusCode, 201);
});

test.skip('Should not create transaction due to invalid paymentMethod', async (t) => {
  const payload = {
    description: 'Tyrannosaurus Rex',
    payment_method: 'credit',
    amount: 10000000000,
    card_number: '5219981851495587',
    card_holder_name: 'Elon Musk',
    card_expiration_date: '10/10',
    card_verification_code: '343',
  };

  const response = await create({ ...req, body: payload }, res, next);
  t.is(response.statusCode, 422);
});
