import { pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// Existing metrics table
export const metrics = pgTable('metrics', {
  id: serial('id').primaryKey(),
  pod_name: text('pod_name').notNull(),
  cpu_usage: text('cpu_usage').notNull(),
  memory_usage: text('memory_usage').notNull(),
  created_at: timestamp('created_at').defaultNow()
});

// Updated users table to match Supabase schema
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  github_id: text('github_id').notNull().unique(),
  name: text('name').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_login: timestamp('last_login').defaultNow()
});