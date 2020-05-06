const database = require('../../database');

const getAllPayables = async (page = 0, limit = 100) => {
    const { Payable } = database.models;

    return await Payable.findAll({
        offset: page * limit,
        limit,
        order: [
            ['createdAt', 'DESC']
        ]
    });
}

const buildPayable = transactionInstance => {
    const payablesRules = {
      credit: {
        status: "waiting_funds",
        fee: 5,
        daysUntilPayment: 30,
      },
      debit: {
        status: "paid",
        fee: 3,
        daysUntilPayment: 0,
      },
    };
    
    const discountFee = (amount, fee) => ((100 - fee) * amount) / 100;

    const setPaymentDate = (transactionDate, daysUntilPayment) => {
      const createdAtAsDate = new Date(transactionDate);
      return createdAtAsDate.setDate(
        createdAtAsDate.getDate() + daysUntilPayment
      );
    };

    const isCredit = transactionInstance.paymentMethod === "credit_card";

    const { status, fee, daysUntilPayment } = isCredit
      ? payablesRules.credit
      : payablesRules.debit;

    const payablePayload = {
      fee,
      status,
      transactionId: transactionInstance.id,
      receivableAmount: discountFee(transactionInstance.amount, fee),
      paymentDate: setPaymentDate(
        transactionInstance.createdAt,
        daysUntilPayment
      ),
    };

    return payablePayload;
}

module.exports = {
    buildPayable,
    getAllPayables,
}