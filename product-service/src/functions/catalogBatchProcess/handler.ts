import { formatJSONResponse, formatErrorResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import * as services from './services';
import { SQSEvent } from 'aws-lambda';

const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    for (const { body } of event.Records) {
      const { name, description, price, count } = JSON.parse(body);
      await services.createProduct(name, description, price, count);
    }
    return formatJSONResponse({ message: 'Success' });
  } catch (error) {
    return formatErrorResponse(error);
  }
};

export const main = middyfy(catalogBatchProcess);
