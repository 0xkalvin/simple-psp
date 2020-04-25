

class BaseError extends Error {
    constructor(message, statusCode, type, payload = []){
        super(message);
        this.statusCode = statusCode;
        this.type = type;
        this.payload = payload;
    }
}


module.exports = BaseError;