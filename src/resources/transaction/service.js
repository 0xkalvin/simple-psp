const database = require('../../database');
const { Transaction } = database.models;
const payableService = require('../payable/service');

const createTransaction = async transactionPayload => {
    
    const getLastFourNumbers = cardNumber => cardNumber.substr(-4);

    const transaction =  await Transaction.create({
        ...transactionPayload,
        cardLastFourNumbers: getLastFourNumbers(transactionPayload.cardNumber),
    });

    await payableService.createPayable(transaction);

    return transaction;
}


module.exports = {
    createTransaction,
}