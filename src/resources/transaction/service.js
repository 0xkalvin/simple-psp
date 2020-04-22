const database = require('../../database');
const { Transaction } = database.models;

const getLastFourNumbers = cardNumber => cardNumber.substr(-4);

const createTransaction = async transactionPayload => {
    return await Transaction.create({
        ...transactionPayload,
        cardLastFourNumbers: getLastFourNumbers(transactionPayload.cardNumber),
    });
}


module.exports = {
    createTransaction,
}