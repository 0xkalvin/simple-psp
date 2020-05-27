const BaseError = require('./base');


class UnprocessableEntityError extends BaseError {
    constructor(payload = []){
        super('Invalid request body');
        this.statusCode = 422;
        this.type = 'invalid_request_body';
        this.details = this.normalizePayload(payload);
    }

    normalizePayload(payload){
        return payload.map(({ message, context }) => ({ message, context }))
    }
}


module.exports = UnprocessableEntityError;