const {
  pathOr,
  pipe,
} = require('ramda');
const cuid = require('cuid');
const initializeSQS = require('../../queue');
const logger = require('../../lib/logger');

const {
  SQS_CONCURRECY,
} = process.env;

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
      message: 'Successfully enqueued payable payload',
      event: 'payable_payload_enqueued',
      message_id: response.MessageId,
    });

    return response;
  };

  const process = async (handler) => {
    const receiveMessages = async () => {
      const receiveParams = {
        AttributeNames: [
          'SentTimestamp',
        ],
        MaxNumberOfMessages: parseInt(SQS_CONCURRECY, 10),
        MessageAttributeNames: [
          'All',
        ],
        QueueUrl: queueUrl,
        VisibilityTimeout: 20,
        WaitTimeSeconds: 0,
      };

      const rawMessages = await sqs.receiveMessage(receiveParams).promise();

      const messages = pathOr([], ['Messages'], rawMessages);

      return messages;
    };

    const parseMessage = (rawMessage) => {
      try {
        const parsedMessage = JSON.parse(rawMessage.Body);

        return parsedMessage;
      } catch (error) {
        return rawMessage.Body;
      }
    };

    const processMessage = pipe(
      parseMessage,
      handler,
    );

    const deleteMessage = (message) => {
      const deleteParams = {
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      };

      return sqs.deleteMessage(deleteParams).promise();
    };

    try {
      const messages = await receiveMessages();

      await Promise.all(messages.map(processMessage));

      await Promise.all(messages.map(deleteMessage));
    } catch (error) {
      logger.error({
        message: 'Failed to process messages from SQS queue',
        event: 'messages_processing',
      });

      throw error;
    }
  };

  return {
    push,
    process,
  };
};

module.exports = payableQueue(initializeSQS);
