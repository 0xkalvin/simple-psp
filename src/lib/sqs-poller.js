const { EventEmitter } = require('events');

const kQueueUrl = Symbol('kQueueUrl');
const kSQSClient = Symbol('kSQSClient');

const kMaxNumberOfMessages = Symbol('kMaxNumberOfMessages');
const kMessageAttributeNames = Symbol('kMessageAttributeNames');
const kPollingTimeout = Symbol('kPollingTimeout');
const kShutdownTimeout = Symbol('kShutdownTimeout');
const kVisibilityTimeout = Symbol('kVisibilityTimeout');
const kWaitTimeSeconds = Symbol('kWaitTimeSeconds');

const kEachMessage = Symbol('kEachMessage');
const kIsRunning = Symbol('kIsRunning');
const kNumberOfInFligthMessages = Symbol('kNumberOfInFligthMessages');

const kDeleteMessage = Symbol('kDeleteMessage');
const kPoll = Symbol('kPoll');
const kReceiveMessage = Symbol('kReceiveMessage');

class Poller extends EventEmitter {
  constructor(inputOptions) {
    super();

    const options = inputOptions || {};

    const {
      queueUrl,
      sqsClient,
      maxNumberOfMessages = null,
      messageAttributeNames = null,
      pollingTimeout = null,
      shutdownTimeout = null,
      visibilityTimeout = null,
      waitTimeSeconds = null,
    } = options;

    if (!queueUrl) {
      throw new Error('queueUrl is a required option');
    }

    if (!sqsClient) {
      throw new Error('sqsClient is a required option');
    }

    if (maxNumberOfMessages != null && !Number.isInteger(maxNumberOfMessages)) {
      throw new Error('invalid maxNumberOfMessages');
    }

    if (messageAttributeNames != null && !Array.isArray(messageAttributeNames)) {
      throw new Error('invalid messageAttributeNames');
    }

    if (pollingTimeout != null && !Number.isInteger(pollingTimeout)) {
      throw new Error('invalid pollingTimeout');
    }

    if (shutdownTimeout != null && !Number.isInteger(shutdownTimeout)) {
      throw new Error('invalid shutdownTimeout');
    }

    if (visibilityTimeout != null && !Number.isInteger(visibilityTimeout)) {
      throw new Error('invalid visibilityTimeout');
    }

    if (waitTimeSeconds != null && !Number.isInteger(waitTimeSeconds)) {
      throw new Error('invalid waitTimeSeconds');
    }

    this[kQueueUrl] = queueUrl;
    this[kSQSClient] = sqsClient;

    this[kMaxNumberOfMessages] = maxNumberOfMessages || 10;
    this[kMessageAttributeNames] = messageAttributeNames || ['All'];
    this[kPollingTimeout] = pollingTimeout || 0;
    this[kShutdownTimeout] = shutdownTimeout || 5000;
    this[kVisibilityTimeout] = visibilityTimeout || 20;
    this[kWaitTimeSeconds] = waitTimeSeconds || 10;

    this[kIsRunning] = false;
    this[kEachMessage] = null;
    this[kNumberOfInFligthMessages] = 0;
  }

  async [kReceiveMessage]() {
    const { Messages = [] } = await this[kSQSClient].receiveMessage({
      QueueUrl: this[kQueueUrl],
      MaxNumberOfMessages: this[kMaxNumberOfMessages],
      MessageAttributeNames: this[kMessageAttributeNames],
      VisibilityTimeout: this[kVisibilityTimeout],
      WaitTimeSeconds: this[kWaitTimeSeconds],
    }).promise();

    return Messages;
  }

  async [kDeleteMessage](receiptHandle) {
    await this[kSQSClient].deleteMessage({
      QueueUrl: this[kQueueUrl],
      ReceiptHandle: receiptHandle,
    }).promise();
  }

  async [kPoll]() {
    if (!this[kIsRunning]) {
      return;
    }

    try {
      const messages = await this[kReceiveMessage]();

      this[kNumberOfInFligthMessages] += messages.length;

      const promises = messages.map(async (message) => {
        await this[kEachMessage](message);

        await this[kDeleteMessage](message.ReceiptHandle);

        this[kNumberOfInFligthMessages] -= 1;
      });

      const promisesResult = await Promise.allSettled(promises);

      promisesResult.forEach((promise) => {
        if (promise.status === 'rejected') {
          this.emit('error', promise.reason);
        }
      });
    } catch (error) {
      this.emit('error', error);
    } finally {
      setTimeout(() => {
        this[kPoll]();
      }, this[kPollingTimeout]);
    }
  }

  start(inputOptions) {
    const options = inputOptions || {};

    const {
      eachMessage,
    } = options;

    if (!eachMessage) {
      throw new Error('eachMessage is a required option');
    }

    this[kIsRunning] = true;
    this[kEachMessage] = eachMessage;

    return this[kPoll]();
  }

  stop() {
    this[kIsRunning] = false;

    return Promise.race([
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, this[kShutdownTimeout]);
      }),
      new Promise((resolve) => {
        setInterval(() => {
          if (this[kNumberOfInFligthMessages] === 0) {
            resolve();
          }
        }, 1000);
      }),
    ]);
  }

  get numberOfInFligthMessages() {
    return this[kNumberOfInFligthMessages];
  }

  resume() {
    this[kIsRunning] = true;

    return this[kPoll]();
  }
}

module.exports = Poller;
