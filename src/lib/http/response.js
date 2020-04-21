
const buildSuccessResponse = (res, status, data = {}) => {
    return res.status(status).send(data);
}

const buildFailureResponse = (res, status = 500, err) => {
    console.error(err);
    return res.status(status).send(err);
}




module.exports = {
    buildFailureResponse,
    buildSuccessResponse,
}