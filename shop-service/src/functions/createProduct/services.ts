import { dbQuery } from '../../libs/pg';

export const createProduct = async (title: string, price: number, description: string = '', count: number = 0) => {
  try {
    const pQueryStr = 'INSERT INTO products (title, price, description) values ($1, $2, $3) returning id';
    const pQueryParams = [title, price, description];

    const pResults = await dbQuery(pQueryStr, pQueryParams);

    const sQueryStr = 'INSERT INTO stocks (product_id, count) values ($1, $2)';
    const sQueryParams = [pResults[0].id, count];

    const sResults = await dbQuery(sQueryStr, sQueryParams);

    return { products: pResults[0], stocks: sResults[0] };
  } catch (error) {
    throw error;
  }
}
