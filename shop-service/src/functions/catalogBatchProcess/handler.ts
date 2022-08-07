import { formatJSONResponse, formatErrorResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import * as services from './services';

const catalogBatchProcess = async (event) => {
  try {
    for (const { body } of event.Records) {
      const { name, description, price, count } = JSON.parse(body);
      await services.catalogBatchProcess(name, description, price, count);
    }
    return formatJSONResponse({ message: 'Success' });
  } catch (error) {
    return formatErrorResponse(error);
  }
};

export const main = middyfy(catalogBatchProcess);
