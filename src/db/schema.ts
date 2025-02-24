import {
  pgTable,
  text,
  timestamp,
  uuid,
  numeric,
  jsonb,
  doublePrecision,
} from 'drizzle-orm/pg-core';
// Existing metrics table

// Updated users table to match Supabase schema
const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  github_id: text('github_id').notNull().unique(),
  name: text('name').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_login: timestamp('last_login').defaultNow(),
});
// Auto-generate I

/*const metricsTable = pgTable('metrics', {
  id: text('id').primaryKey().default('gen_random_uuid()'), // Auto-generate ID
  pod_name: text('pod_name').notNull(),
  namespace: text('namespace').notNull(),
  cpu_usage: numeric('cpu_usage').notNull(),
  memory_usage: numeric('memory_usage'), // New column
  timestamp: timestamp('timestamp').notNull(),
  embedding: jsonb('embedding'), // New column for embeddings
});
*/
const metricsTable = pgTable('metrics', {
  id: uuid('id').primaryKey().defaultRandom(), // Auto-generate UUID
  pod_name: text('pod_name').notNull(),
  namespace: text('namespace').notNull(),
  cpu_usage: doublePrecision('cpu_usage').notNull(),
  memory_usage: doublePrecision('memory_usage').notNull(), // Optional memory usage
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(), // Timestamp with timezone
  embedding: jsonb('embedding'), // JSONB for embeddings
});

export { users, metricsTable };
