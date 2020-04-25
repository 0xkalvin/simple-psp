
const buildSuccessResponse = (res, status, data = {}) => {
    return res.status(status).send(data);
}

const buildFailureResponse = (req, res, error) => {
    
    const { statusCode, type, message, payload = [] } = error;

    const failureResponse = {
        error: { type, message, payload },
        url: req.path,
        method: req.method
    };
    return res.status(statusCode).send(failureResponse);
}




module.exports = {
    buildFailureResponse,
    buildSuccessResponse,
}