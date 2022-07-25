import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, formatErrorResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import * as services from './services';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const productId = event.pathParameters.productId;
    console.log('[getProductsById]', { productId });
    if (!productId) {
      throw new Error('Missing productId');
    }
    const product = await services.getProductsById(productId);
    return formatJSONResponse({ product });
  } catch (error) {
    return formatErrorResponse(error);
  }

};

export const main = middyfy(getProductsById);
