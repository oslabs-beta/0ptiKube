import { pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';


// Updated users table to match Supabase schema
// drizzle orm schema
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  github_id: text('github_id').notNull().unique(),
  name: text('name').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_login: timestamp('last_login').defaultNow()
});



