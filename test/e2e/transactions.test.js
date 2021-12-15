const test = require('ava');
const request = require('supertest');

test.beforeEach(async (t) => {
  const app = require('../../src/transporters/rest/application');

  t.context.app = app;
});

test('should create a transaction successfully', async (t) => {
  const { app } = t.context;

  const res = await request(app).post('/transactions').send({
    description: 'Tyrannosaurus Rex',
    payment_method: 'credit_card',
    amount: 10000000000,
    card_number: '5219981851495587',
    card_holder_name: 'Elon Musk',
    card_expiration_date: '10/10',
    card_verification_code: '343',
  });

  t.is(res.status, 201);
});

test('should not process transaction due to missing cardHolderName', async (t) => {
  const { app } = t.context;

  const res = await request(app).post('/transactions').send({
    description: 'Tyrannosaurus Rex',
    payment_method: 'credit_card',
    amount: 10000000000,
    card_number: '5219981851495587',
    card_expiration_date: '10/10',
    card_verification_code: '343',
  });

  t.is(res.status, 422);
});

test('should not process transaction due to negative amount', async (t) => {
  const { app } = t.context;

  const res = await request(app).post('/transactions').send({
    description: 'Tyrannosaurus Rex',
    payment_method: 'credit_card',
    amount: -10000000000,
    card_number: '5219981851495587',
    card_holder_name: 'Elon Musk',
    card_expiration_date: '10/10',
    card_verification_code: '343',
  });

  t.is(res.status, 422);
});
