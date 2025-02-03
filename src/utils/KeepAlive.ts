import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.keepalive' });

const pool = new Pool({
  host: process.env.PROD_DB_HOST,
  port: Number(process.env.PROD_DB_PORT),
  user: process.env.PROD_DB_USER,
  password: process.env.PROD_DB_PASS,
  database: process.env.PROD_DB_NAME,
});

async function keepAlive(): Promise<void> {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT 1;');
    console.log('DB is active:', res.rowCount > 0);
    client.release();
  } catch (err) {
    console.error('Error connecting to the DB:', err);
  }
}

keepAlive();
