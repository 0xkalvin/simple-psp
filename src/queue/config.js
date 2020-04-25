module.exports = {
  endpoint: process.env.SQS_ENDPOINT || "http://localhost:9324",
  region: process.env.SQS_REGION || "x",
  concurrency:  process.env.SQS_CONCURRENCY || 1,
  credentials: {
    accessKeyId: "x",
    secretAccessKey: "x",
  },
};
