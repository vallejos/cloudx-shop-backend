import fetch from 'node-fetch';
import { CreateProductError } from 'src/errors';
import { sendSnsMessage } from '../../libs/sns';

export const createProduct = async (name: string, price: number, description?: string, count?: number) => {
  const url = 'https://tdxvfwtpad.execute-api.us-east-1.amazonaws.com/dev/products'
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      price,
      count,
    }),
  }
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    return json;
  } catch (error) {
    throw new CreateProductError(error.message);
  }
}

export const sendEmailNotification = async (result: any) => {
  try {
    const subject = 'Imported new row from csv.';
    const message = `New product added to DB. Result: ${JSON.stringify({result})}`;
    return sendSnsMessage(subject, message);
  } catch (error) {
    throw new Error(error.message)
  }
}
