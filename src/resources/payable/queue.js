const initializeSQS = require('../../queue');
const logger = require('../../lib/logger');

const payableQueue = (initializeSQS) => {
  const { sqs: queue, config: { endpoint } } = initializeSQS();
  const queueUrl = `${endpoint}/queue/payables-queue`;

  const push = async (payable) => {
    const params = {
      MessageBody: JSON.stringify(payable),
      QueueUrl: queueUrl,
      MessageGroupId: `payable_${payable.id}`,
    };

    const response = await queue.sendMessage(params).promise();

    logger.info({
      payable_id: payable.id,
      message_id: response.MessageId,
      message: 'payable-successfully-enqueued',
    });

    return response;
  };

  return {
    push,
  };
};

module.exports = payableQueue(initializeSQS);
