const database = require('../../database');
const { Payable } = database.models;

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
    }
};

const createPayable = async transactionPayload => {

    const discountFee = (amount, fee) => (100 - fee) * amount / 100;
    
    const setPaymentDate = (transactionDate, daysUntilPayment) => {
        const createdAtAsDate = new Date(transactionDate);
        return createdAtAsDate.setDate(createdAtAsDate.getDate() + daysUntilPayment);
    }

    const isCredit = transactionPayload.paymentMethod === "credit_card";

    const { status, fee, daysUntilPayment } = isCredit ? payablesRules.credit : payablesRules.debit;
    
    const payablePayload = {
        fee,
        status,
        transactionId: transactionPayload.id,
        receivableAmount: discountFee(transactionPayload.amount, fee),
        paymentDate: setPaymentDate(transactionPayload.createdAt, daysUntilPayment),
    };

    return await Payable.create(payablePayload);

}

const getAllPayables = async (page = 1, count = 10) => {
    return await Payable.findAll();
}

module.exports = {
    createPayable,
    getAllPayables,
}