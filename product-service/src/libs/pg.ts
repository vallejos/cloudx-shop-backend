import * as pg from 'pg';
import { DBError } from '../errors';

export const dbQuery = async (query: string, params: any[] = []) => {
  try {
    const client = new pg.Client({
      host: process.env.DATABASE_URL,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DBNAME,
      port: +process.env.DATABASE_PORT,
      ssl: { rejectUnauthorized: false },
    })

    await client.connect()
    const result = await client.query(query, params)
    await client.end()

    return result.rows
  } catch (error) {
    throw new DBError(error.message)
  }
}
