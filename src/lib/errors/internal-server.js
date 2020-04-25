const BaseError = require('./base');


class InternalServerError extends BaseError {
    constructor(){
        super('Internal server error');
        this.statusCode = 500;
        this.type = 'internal_server_error';
    }
}


module.exports = InternalServerError;