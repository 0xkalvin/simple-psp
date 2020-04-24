const req = {
  query: {},
  params: {},
  body: {},
  method: '',
  path: '',
};

const res = {
  status: (code) => ({
    send: (data) => ({ body: data, statusCode: code }),
  }),
};

const next = () => () => {};


module.exports = {
    req,
    res,
    next,
}