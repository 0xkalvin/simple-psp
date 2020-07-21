const test = require('ava');
const { res, req, next } = require('../../helpers/handlers');
const errorHandler = require('../../../src/middlewares/error-handler');

test('Should return 500 when receives an unknown error', async (t) => {
  const err = new Error();
  const { statusCode, body } = errorHandler(err, req, res, next);

  t.is(statusCode, 500);
  t.deepEqual(body.error.message, 'Internal server error');
});
