import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

const config: Config = {
  // Include multiple schemas by passing an array of paths
  schema: './src/db/schema.ts',
  // Add all schema paths here
  out: './drizzle', // Output path for migration files
  dialect: 'postgresql', // Database type
  dbCredentials: {
    host: process.env.DB_HOST || 'db.ikdbpxklslitodszecux.supabase.co',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'tANLl7BQHp9rMFN0',
    database: process.env.DB_NAME || 'postgres',
    connectionString: process.env.DATABASE_URL, // Pulling connection string from environment variables
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: true }
        : false, // Conditional SSL setup
    port: 5432,
  },
};

export default config;
