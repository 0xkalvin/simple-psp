
const { createSchema } = require('./schema');
const { buildSuccessResponse, buildFailureResponse } = require('../../lib/http/response');


const create = async (req, res, next) => {
    try {
        const { error, value: validPayload } = createSchema.validate(req.body);

        if(error){
            return buildFailureResponse(res, 422, error);
        }

        return buildSuccessResponse(res, 201, validPayload);

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