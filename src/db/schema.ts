import {
  pgTable,
  text,
  timestamp,
  uuid,
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

const metricsTable = pgTable('metrics', {
  id: uuid('id').primaryKey().defaultRandom(), // Auto-generate UUID
  pod_name: text('pod_name').notNull(),
  namespace: text('namespace').notNull(),
  cpu_usage: doublePrecision('cpu_usage').notNull(),
  memory_usage: doublePrecision('memory_usage').notNull(), // Optional memory usage
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(), // Timestamp with timezone
  embedding: jsonb('embedding'), // JSONB for embeddings
});

export { users, metricsTable};
