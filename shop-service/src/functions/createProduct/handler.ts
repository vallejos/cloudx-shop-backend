import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, formatErrorResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import * as services from './services';

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const title = event.body.title;
    const price = event.body.price;
    const description = event.body.description;
    const count = event.body.count;
    console.log('[createProduct]', { title, price, description, count });
    if (!title || !price) {
      throw new Error('Missing title or price');
    }
    const { id } = await services.createProduct(title, price, description, count);
    const product = {
      id,
    }
    return formatJSONResponse({ product });
  } catch (error) {
    return formatErrorResponse(error);
  }

};

export const main = middyfy(createProduct);
