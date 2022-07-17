import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, formatErrorResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import * as services from './services';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const products = await services.getProductsList();
    return formatJSONResponse({ products });
  } catch (error) {
    return formatErrorResponse(error);
  }
};

export const main = middyfy(getProductsList);
