import type { Config } from 'drizzle-kit';
import * as fs from 'fs';

const connectionUrl = process.env.DATABASE_URl!;

const sslCertPath = process.env.SSL_CERT_PATH;

const config: Config = {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionUrl,
    ssl:
      process.env.NODE_ENV === 'production' && sslCertPath
        ? {
            rejectUnauthorized: true,
            ca: fs.existsSync(sslCertPath)
              ? fs.readFileSync(sslCertPath).toString()
              : undefined,
          }
        : false,
  },
};

export default config;
