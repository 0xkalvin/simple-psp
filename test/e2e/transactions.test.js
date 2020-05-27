const test = require('ava');
const request = require('supertest');

test.beforeEach(async (t) => {
  const app = require('../../src/server/app');

  t.context.app = app;
});

test('should create a transaction successfully', async (t) => {
  const {app} = t.context;

  const res = await request(app).post('/transactions').send({
    description: 'Tyrannosaurus Rex',
    paymentMethod: 'credit_card',
    amount: 10000000000,
    cardNumber: '5219981851495587',
    cardHolderName: 'Elon Musk',
    cardExpirationDate: '10/10',
    cardVerificationCode: '343',
  });

  t.is(res.status, 201);
});

test('should not process transaction due to missing cardHolderName', async (t) => {
  const {app} = t.context;

  const res = await request(app).post('/transactions').send({
    description: 'Tyrannosaurus Rex',
    paymentMethod: 'credit_card',
    amount: 10000000000,
    cardNumber: '5219981851495587',
    cardExpirationDate: '10/10',
    cardVerificationCode: '343',
  });

  t.is(res.status, 422);
});

test('should not process transaction due to negative amount', async (t) => {
  const {app} = t.context;

  const res = await request(app).post('/transactions').send({
    description: 'Tyrannosaurus Rex',
    paymentMethod: 'credit_card',
    amount: -10000000000,
    cardNumber: '5219981851495587',
    cardHolderName: 'Elon Musk',
    cardExpirationDate: '10/10',
    cardVerificationCode: '343',
  });

  t.is(res.status, 422);
});
