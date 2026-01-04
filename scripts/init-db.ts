/**
 * Database Initialization Script
 *
 * Run this script once to create the waitlist table:
 * npx tsx scripts/init-db.ts
 *
 * Make sure DATABASE_URL is set in your environment.
 */

import { neon } from '@neondatabase/serverless';

async function initDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.log('\nSet it with:');
    console.log('export DATABASE_URL="postgresql://..."');
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  console.log('🔄 Creating waitlist table...');

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
      unsubscribed_at TIMESTAMP,

      -- Progressive profiling fields (for future use)
      user_current_role VARCHAR(100),
      years_experience VARCHAR(20),
      career_interest VARCHAR(100),
      questionnaire_completed_at TIMESTAMP
    )
  `;

  console.log('✅ Waitlist table created');

  console.log('🔄 Creating indexes...');

  await sql`CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist (email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist (status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist (created_at DESC)`;

  console.log('✅ Indexes created');

  console.log('\n🎉 Database initialization complete!');
  console.log('\nNext steps:');
  console.log('1. Add RESEND_API_KEY to your .env.local');
  console.log('2. Run npm run dev to test the waitlist form');
}

initDatabase().catch(console.error);
