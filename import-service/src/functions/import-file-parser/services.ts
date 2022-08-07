import { sendToSQS } from '../../libs/sqs';

export const importProduct = async (name: string, price: number, description?: string, count?: number) => {
    try {
        const messageBody = JSON.stringify({
            name,
            price,
            description,
            count,
        });
        return sendToSQS(messageBody);
    } catch (error) {
        throw new Error(error.message)
    }
}
