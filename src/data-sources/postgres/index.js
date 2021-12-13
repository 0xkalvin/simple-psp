const Sequelize = require('sequelize');

const config = require('../../config/postgres');
const rawModels = require('./models');

const { NODE_ENV } = process.env;

const pool = new Sequelize(config[NODE_ENV]);

const initModels = (model) => ({
  instance: model.create(pool),
  model,
});

const associateModels = ({ instance, model }) => {
  if (model.associate) {
    model.associate(instance, pool.models);
  }
};

Object.values(rawModels)
  .map(initModels)
  .map(associateModels);

function checkConnection() {
  return pool.authenticate();
}

function closeConnection() {
  return pool.close();
}

module.exports = {
  pool,
  checkConnection,
  closeConnection,
};
