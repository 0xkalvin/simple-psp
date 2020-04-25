const initializeSQS = require('../../queue')

const payableQueue = (initializeSQS) => {
    
    const { sqs: queue, config: { endpoint }} = initializeSQS();
    const queueUrl = `${endpoint}/queue/payables-queue`;

    const push = async (payable) => {
        const params = {
            MessageBody: JSON.stringify(payable),
            QueueUrl: queueUrl,
          };
        const response = await queue.sendMessage(params).promise();
        console.log(`Payable ${payable.id} successfully enqueued within message ${response.MessageId}`);
        return response;
    }

    return {
        push,
    }
}

module.exports = payableQueue(initializeSQS);