
const buildSuccessResponse = (res, status, data = {}) => {
    return res.status(status).send(data);
}

const buildFailureResponse = (req, res, status, errors) => {
    if(process.env.NODE_ENV !== "test"){
        console.error(errors);
    }
    const payload = {
        errors,
        url: req.path,
        method: req.method
    };
    return res.status(status).send(payload);
}




module.exports = {
    buildFailureResponse,
    buildSuccessResponse,
}