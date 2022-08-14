import { dbQuery } from '../../libs/pg';

export const getProductsList = async () => {
  try {
    const queryStr = 'SELECT p.*, s.count FROM products as p JOIN stocks as s ON p.id = s.product_id';
    const results = await dbQuery(queryStr);
    return results;
  } catch (error) {
    throw error;
  }
}
