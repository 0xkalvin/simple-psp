const test = require('ava');
const {res, req} = require('../../../helpers/handlers');
const {InternalServerError} = require('../../../../src/lib/errors');
const {
  buildFailureResponse,
  buildSuccessResponse,
} = require('../../../../src/lib/http/response');


test('buildFailureResponse', async (t) => {
  const {statusCode, body} = buildFailureResponse(req, res, new InternalServerError());

  t.is(statusCode, 500);
  t.is(body.error.type, 'internal_server_error');
});

test('buildSuccessResponse', async (t) => {
  const {statusCode, body} = buildSuccessResponse(res, 200, []);

  t.is(statusCode, 200);
  t.is(body.length, 0);
});

