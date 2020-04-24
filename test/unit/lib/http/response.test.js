const test = require("ava");
const { res, req } = require('../../../helpers/handlers');

const { 
    buildFailureResponse, 
    buildSuccessResponse, 
} = require("../../../../src/lib/http/response");

test("buildFailureResponse", async (t) => {
  const payload = [{ type: 'Internal Server Error' }];
  const { statusCode, body} = buildFailureResponse(req, res, 500, payload);  
  
  t.is(statusCode, 500);
  t.deepEqual(body.errors, payload);
});

test("buildSuccessResponse", async (t) => {
    const { statusCode, body} = buildSuccessResponse(res, 200, []);  
    
    t.is(statusCode, 200);
    t.is(body.length, 0);
  });
  
