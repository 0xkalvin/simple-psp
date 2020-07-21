const sequelize = require('../../src/database');

module.exports = () => Promise.all(Object.keys(sequelize.models).map((key) => sequelize.models[key].destroy({ truncate: true, force: true })));
