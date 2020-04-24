const BaseError = require('./base');


class NotFoundError extends BaseError {
    constructor(message){
        super(message);
        this.statusCode = 404;
        this.type = 'not-found';
    }
}


module.exports = NotFoundError;