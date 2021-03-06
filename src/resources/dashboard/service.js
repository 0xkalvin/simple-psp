/* eslint-disable camelcase */
const { QueryTypes } = require('sequelize');
const database = require('../../database');

const { Transaction, Payable } = database.models;

const buildDashboard = async () => {
  const countTransactions = () => Transaction.sequelize.query(
    'SELECT payment_method, COUNT(*) as quantity, SUM(amount) as amount FROM transactions group by payment_method',
    { type: QueryTypes.SELECT },
  );

  const countPayables = () => Payable.sequelize.query(
    'SELECT status, COUNT(*) as quantity, SUM(receivable_amount) as amount FROM payables group by status',
    { type: QueryTypes.SELECT },
  );

  const normalizeTransactionsData = (rawData) => rawData.reduce((acc, item) => {
    const { payment_method, quantity, amount } = item;
    const { total_quantity, total_amount } = acc;

    return {
      ...acc,
      [payment_method]: { quantity: parseInt(quantity, 10), amount },
      total_quantity: total_quantity + parseInt(quantity, 10),
      total_amount: total_amount + amount,
    };
  }, { total_quantity: 0, total_amount: 0 });

  const normalizePayablesData = (rawData) => rawData.reduce((acc, item) => {
    const { status, quantity, amount } = item;
    const { total_quantity, total_amount } = acc;

    return {
      ...acc,
      [status]: { quantity: parseInt(quantity, 10), amount },
      total_quantity: total_quantity + parseInt(quantity, 10),
      total_amount: total_amount + amount,
    };
  }, { total_quantity: 0, total_amount: 0 });

  const [transactionsRawData, payablesRawData] = await Promise.all([
    countTransactions(),
    countPayables(),
  ]);

  return {
    transactions: normalizeTransactionsData(transactionsRawData),
    payables: normalizePayablesData(payablesRawData),
  };
};

module.exports = {
  buildDashboard,
};
