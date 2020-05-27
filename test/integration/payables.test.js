const test = require('ava');

const {req, res, next} = require('../helpers/handlers');
const {index} = require('../../src/resources/payable');

test('Should return a list of payables with status 200', async (t) => {
  const {statusCode} = await index(req, res, next);

  t.is(statusCode, 200);
});

