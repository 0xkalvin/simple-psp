const BaseError = require('./base');


class BadRequestError extends BaseError {
    constructor(){
        super('Bad request');
        this.statusCode = 400;
        this.type = 'bad_request';
    }
}


module.exports = BadRequestError;