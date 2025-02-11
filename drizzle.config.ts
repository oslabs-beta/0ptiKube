import type { Config } from 'drizzle-kit';

const config: Config = {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'db.ikdbpxklslitodszecux.supabase.co',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'tANLl7BQHp9rMFN0',
    database: process.env.DB_NAME || 'postgres',
    ssl: {
      rejectUnauthorized: false
    },
    port: 5432
  }
};

export default config;