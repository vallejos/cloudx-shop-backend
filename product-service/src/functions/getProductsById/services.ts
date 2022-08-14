import { dbQuery } from '../../libs/pg';

export const getProductsById = async (productId: string) => {
  try {
    const queryStr = 'SELECT p.*, s.count FROM products as p JOIN stocks as s ON p.id = s.product_id WHERE p.id = $1';
    const queryParams = [productId];
    const results = await dbQuery(queryStr, queryParams);
    return results;
  } catch (error) {
    throw error;
  }
}
