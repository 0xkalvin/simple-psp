const cuid = require('cuid');
const initializeSQS = require('../../queue');
const logger = require('../../lib/logger');

const payableQueue = (initializeSQS) => {
  const {
    sqs,
    config: { endpoint, payablesQueueName },
  } = initializeSQS();

  const queueUrl = `${endpoint}/${payablesQueueName}`;

  const push = async (payablePayload) => {
    const params = {
      MessageBody: JSON.stringify(payablePayload),
      QueueUrl: queueUrl,
      MessageGroupId: cuid(),
    };

    const response = await sqs.sendMessage(params).promise();

    logger.info({
      event: 'payable-payload-successfully-enqueued',
      message_id: response.MessageId,
    });

    return response;
  };

  const receiveAndDeleteMessage = async () => {
    const receiveParams = {
      AttributeNames: [
        'SentTimestamp',
      ],
      MaxNumberOfMessages: 1,
      MessageAttributeNames: [
        'All',
      ],
      QueueUrl: queueUrl,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 0,
    };

    const response = await sqs.receiveMessage(receiveParams).promise();

    if (response.Messages && response.Messages.length > 0) {
      logger.info({
        event: 'payable-received-from-queue',
        metadata: response,
      });

      const receiptHandle = response.Messages[0].ReceiptHandle;

      const deleteParams = {
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      };

      await sqs.deleteMessage(deleteParams).promise();

      logger.info({
        event: 'payable-deleted-from-queue',
      });

      return response;
    }

    return null;
  };

  return {
    push,
    receiveAndDeleteMessage,
  };
};

module.exports = payableQueue(initializeSQS);
