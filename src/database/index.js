const Sequelize = require('sequelize');
const config = require('./config');
const rawModels = require('./models');

const env = process.env.NODE_ENV || 'development';
const connection = new Sequelize(config[env]);


const initDatabase = () => {
  const initModels = (model) => ({
    instance: model.create(connection),
    model,
  });

  const associateModels = ({ instance, model }) => {
    if (model.associate) {
      model.associate(instance, connection.models);
    }
  };

  Object.values(rawModels)
    .map(initModels)
    .map(associateModels);

  return connection;
};

module.exports = initDatabase();
