import { pgTable, text, timestamp, uuid, numeric } from 'drizzle-orm/pg-core';


// Updated users table to match Supabase schema
// drizzle orm schema
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  github_id: text('github_id').notNull().unique(),
  name: text('name').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_login: timestamp('last_login').defaultNow()
});

export const metricsTable = pgTable('metrics', {
  id: text('id').primaryKey().default('gen_random_uuid()'),
  pod_name: text('pod_name').notNull(),
  container_name: text('container_name').notNull(),
  namespace: text('namespace').notNull(),
  cpu_usage: numeric('cpu_usage').notNull(),
  timestamp: timestamp('timestamp').notNull(),
});