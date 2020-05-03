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

module.exports = {
    getAllPayables,
}