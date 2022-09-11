import { formatJSONResponse, formatErrorResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import * as services from './services';
import { SQSEvent } from 'aws-lambda';

const catalogBatchProcess = async (event: SQSEvent) => {
  console.log('[catalogBatchProcess]', JSON.stringify(event));
  try {
    for (const { body } of event.Records) {
      console.log(body)
      const { name, description, price, count } = JSON.parse(body);
      const result = await services.createProduct(name, price, description, count);
      console.log(result)
      if (result) {
        console.log('Sending email notification');
        services.sendEmailNotification(result);
        console.log('Email notification sent');
      }
    }
    return formatJSONResponse({ message: 'Success' });
  } catch (error) {
    return formatErrorResponse(error);
  }
};

export const main = middyfy(catalogBatchProcess);
