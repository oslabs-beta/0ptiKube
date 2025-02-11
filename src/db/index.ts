import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Configure dotenv
config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Skip SSL entirely in development
  ...(process.env.NODE_ENV === 'production' 
    ? {
        ssl: {
          rejectUnauthorized: true,
        }
      } 
    : {})
});

// Add error handling for the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const db = drizzle(pool);

