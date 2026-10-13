import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'golf_admin',
  password: process.env.DB_PASSWORD || 'golf_password',
  database: process.env.DB_NAME || 'golf_club_db',
});