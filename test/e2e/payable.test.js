const test = require('ava');
const request = require('supertest');

test.beforeEach(async (t) => {
  const app = require('../../src/transporters/rest/application');

  t.context.app = app;
});

test('should return 200 from payables endpoint', async (t) => {
  const { app } = t.context;

  const res = await request(app)
    .get('/payables')
    .send();

  t.is(res.status, 200);
  t.true(res.body instanceof Array);
});
