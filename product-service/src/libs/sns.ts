import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { SNSError } from 'src/errors';

export const sendSnsMessage = async (subject: string, message: string) => {
    try {
        const sns = new SNSClient({ region: 'us-east-1' });
        const params = {
          Subject: subject,
          Message: message,
          TopicArn: process.env.CATALOG_ITEMS_TOPIC_ARN,
        };
        console.log('publishing', params)
        const publishCommand = new PublishCommand(params);
        return await sns.send(publishCommand);
    } catch (error) {
        throw new SNSError(error.message);
    }
}
