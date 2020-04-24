
const { buildFailureResponse } = require('../lib/http/response');

module.exports = (req, res) => {
    const payload = { error: `Method "${req.method}" is not allowed for resource "${req.path}"` };
    
    return buildFailureResponse(req, res, 405, [ payload ]);
}