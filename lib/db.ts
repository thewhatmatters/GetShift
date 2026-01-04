import { neon } from '@neondatabase/serverless';

/**
 * Get a database connection.
 * Called lazily to avoid build-time errors when DATABASE_URL is not set.
 */
export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(process.env.DATABASE_URL);
}

// Initialize waitlist table (run once or use migrations)
export async function initWaitlistTable() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      source VARCHAR(50),
      status VARCHAR(20) DEFAULT 'pending',
      ip_address VARCHAR(45),
      user_agent TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      converted_at TIMESTAMP,
      converted_plan VARCHAR(50),
      unsubscribed_at TIMESTAMP
    )
  `;
}

// Add indexes for common queries
export async function createIndexes() {
  const sql = getDb();
  await sql`CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist (email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist (status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist (created_at DESC)`;
}
