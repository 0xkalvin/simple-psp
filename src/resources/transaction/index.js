const service = require('./service');
const { createSchema } = require('./schema');
const { buildSuccessResponse, buildFailureResponse } = require('../../lib/http/response');


const create = async (req, res, next) => {
    try {
        const { error, value: validPayload } = createSchema.validate(req.body);

        if(error){
            return buildFailureResponse(res, 422, error);
        }

        const response = await service.createTransaction(validPayload);

        return buildSuccessResponse(res, 201, response);

    } catch (err) {
        return next(err);
    }
}

const index = async (req, res, next) => {
    try {
        return buildSuccessResponse(res, 200, []);
    } catch (err) {
        return next(err);
    }
}
module.exports = {
    create,
    index,
}