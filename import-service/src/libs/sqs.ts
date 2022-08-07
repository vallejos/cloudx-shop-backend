import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { SQSError } from '../errors';

export const sendToSQS = async (messageBody) => {
  try {
    const sqs = new SQSClient({ region: 'us-east-1' });    
    const sendMessageCmd = new SendMessageCommand({
        QueueUrl: process.env.CATALOG_ITEMS_QUEUE_URL,
        MessageBody: messageBody,
    });
    const sendMessageResult = await sqs.send(sendMessageCmd);
    return sendMessageResult;
  } catch (error) {
    throw new SQSError(error.message)
  }
}
