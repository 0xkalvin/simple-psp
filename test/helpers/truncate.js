
const sequelize = require('../../src/database');

module.exports = () => {
  return Promise.all(Object.keys(sequelize.models).map((key) => {
    return sequelize.models[key].destroy({truncate: true, force: true});
  }));
};
