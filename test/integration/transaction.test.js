const test = require("ava");

const { req, res, next } = require("../helpers/handlers");
const { create } = require("../../src/resources/transaction");

test("Should create transaction successfully", async (t) => {

  const payload = {
    description: "Tyrannosaurus Rex",
    paymentMethod: "credit_card",
    amount: 10000000000,
    cardNumber: "5219981851495587",
    cardHolderName: "Elon Musk",
    cardExpirationDate: "10/10",
    cardVerificationCode: "343",
  };

  const { statusCode } = await create({ ...req, body: payload }, res, next);
  t.is(statusCode, 201);
  
});

test("Should not create transaction due to invalid paymentMethod", async (t) => {

    const payload = {
      description: "Tyrannosaurus Rex",
      paymentMethod: "credit",
      amount: 10000000000,
      cardNumber: "5219981851495587",
      cardHolderName: "Elon Musk",
      cardExpirationDate: "10/10",
      cardVerificationCode: "343",
    };
  
    const { statusCode } = await create({ ...req, body: payload }, res, next);
    t.is(statusCode, 422);
    
  });