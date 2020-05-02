const service = require('./service');
const { createSchema } = require('./schema');
const { buildSuccessResponse, buildFailureResponse } = require('../../lib/http/response');
const { UnprocessableEntityError  } = require('../../lib/errors');


const create = async (req, res, next) => {
    try {
        const { error, value: validPayload } = createSchema.validate(req.body);

        if(error){
            return buildFailureResponse(req, res, new UnprocessableEntityError(error.details));
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

const show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const transaction = await service.showTransaction(id);
        return buildSuccessResponse(res, 200, transaction);
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    create,
    index,
    show,
}