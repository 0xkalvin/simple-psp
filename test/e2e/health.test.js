const test = require('ava');
const request = require('supertest');

test.beforeEach(async (t) => {
  const app = require('../../src/server/app');

  t.context.app = app;
});

test('should return 200 from health endpoint', async (t) => {
  const { app } = t.context;

  const res = await request(app)
    .get('/health')
    .send();

  t.is(res.status, 200);
});
