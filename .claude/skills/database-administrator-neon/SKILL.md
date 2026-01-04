---
name: neon-postgres-nextjs
description: Expert-level serverless Postgres with Neon for Next.js applications. Covers connection patterns (HTTP/WebSocket/pooled/direct), database branching workflows (dev/staging/prod, PR previews, anonymized data), schema migrations with Drizzle and Prisma, performance optimization (cold starts, connection pooling, read replicas), autoscaling configuration, and instant restore capabilities. Use when building, scaling, or optimizing Next.js applications with Neon serverless Postgres, setting up branching workflows, configuring connection pooling, implementing migrations, or troubleshooting serverless database performance.
---

# Neon Serverless Postgres for Next.js

This skill provides expert-level guidance for building Next.js applications with Neon serverless Postgres. Assumes familiarity with Postgres and focuses on Neon-specific patterns and serverless optimizations.

## Quick Reference

### Connection String Anatomy

```
postgresql://user:pass@ep-cool-name-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
           │    │                    │         │
           │    │                    │         └─ "-pooler" = pooled connection (up to 10K concurrent)
           │    │                    └─ Endpoint ID (ep-*)
           │    └─ Password
           └─ Role/Username
```

### Driver Selection Decision Tree

```
Serverless environment (Vercel Edge, Cloudflare Workers)?
├─ Yes → @neondatabase/serverless
│        ├─ Single queries, parallel ops → neon() HTTP driver
│        └─ Transactions, sessions → Pool/Client WebSocket
└─ No (Node.js server, long-running)
         ├─ Need node-postgres compatibility → pg with pooled connection
         └─ Modern stack → postgres.js or Drizzle native
```

### Environment Variables Pattern

```bash
# .env.local
DATABASE_URL="postgresql://...@ep-xxx-pooler.../db?sslmode=require"      # Pooled (app queries)
DATABASE_URL_UNPOOLED="postgresql://...@ep-xxx.../db?sslmode=require"    # Direct (migrations)
```

## Connection Patterns

### Neon Serverless Driver (Recommended for Next.js)

**HTTP Driver** - Optimal for stateless queries in Server Components/Actions:

```typescript
// lib/db.ts
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Server Component usage
export async function getUsers() {
  return sql`SELECT * FROM users WHERE active = true`;
}

// Parameterized queries (SQL injection safe)
export async function getUserById(id: string) {
  return sql`SELECT * FROM users WHERE id = ${id}`;
}
```

**WebSocket Driver** - Required for transactions and sessions:

```typescript
// lib/db-ws.ts
import { neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';

// Required for Node.js < 22
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function transferFunds(from: string, to: string, amount: number) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, from]);
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, to]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
```

### Pooled vs Direct Connections

| Aspect | Pooled (`-pooler`) | Direct (unpooled) |
|--------|-------------------|-------------------|
| Max connections | 10,000 | ~100 (compute-dependent) |
| Use case | Application queries | Migrations, admin ops |
| Transactions | Transaction-mode only | Full session support |
| Prepared statements | Supported (PgBouncer 1.22+) | Full support |

**When to use direct connections:**
- Running migrations (Drizzle, Prisma)
- Administrative operations (VACUUM, REINDEX)
- Logical replication setup
- Session-level settings (SET commands)

## Next.js Integration Patterns

### Server Components (App Router)

```typescript
// app/users/page.tsx
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function UsersPage() {
  const users = await sql`SELECT id, name, email FROM users LIMIT 50`;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Server Actions

```typescript
// app/actions.ts
'use server';

import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

const sql = neon(process.env.DATABASE_URL!);

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  
  await sql`INSERT INTO users (name, email) VALUES (${name}, ${email})`;
  revalidatePath('/users');
}
```

### Route Handlers

```typescript
// app/api/users/route.ts
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  const users = await sql`SELECT * FROM users`;
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { name, email } = await request.json();
  const [user] = await sql`
    INSERT INTO users (name, email) 
    VALUES (${name}, ${email}) 
    RETURNING *
  `;
  return NextResponse.json(user, { status: 201 });
}
```

### Edge Runtime

```typescript
// app/api/edge/route.ts
import { neon } from '@neondatabase/serverless';

export const runtime = 'edge';

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  const [result] = await sql`SELECT NOW() as time`;
  return Response.json({ time: result.time });
}
```

## ORM Integration

### Drizzle ORM Setup

See [references/drizzle-setup.md](references/drizzle-setup.md) for complete Drizzle configuration including schema patterns, migration workflows, and advanced features like read replicas.

**Quick setup:**

```typescript
// db/index.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

### Prisma Setup

See [references/prisma-setup.md](references/prisma-setup.md) for Prisma configuration with Neon including the serverless adapter and connection pooling.

**Quick setup (prisma/schema.prisma):**

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED")  // For migrations
}
```

## Branching Workflows

Neon branches are copy-on-write clones created in ~1 second regardless of database size. Each branch has isolated compute that scales to zero.

See [references/branching-workflows.md](references/branching-workflows.md) for complete branching patterns including:
- Development environments per developer
- PR preview databases
- Staging with anonymized data
- Point-in-time recovery

**Branch naming conventions:**

```
main                          # Production
├── dev/alice                 # Developer branches
├── dev/bob
├── preview/pr-123-feature-x  # PR preview branches
├── staging                   # Staging (reset weekly)
└── restore/2024-01-15-10am   # Point-in-time investigation
```

**Neon CLI quick reference:**

```bash
# Create branch from production
neon branches create --name dev/alice --parent main

# Get connection string for branch
neon connection-string dev/alice --pooled

# Reset branch to parent state
neon branches reset dev/alice --parent

# Delete branch
neon branches delete preview/pr-123-feature-x
```

## Performance Optimization

### Cold Start Mitigation

Neon computes scale to zero after inactivity (default 5 min). Cold starts add ~500ms-2s latency.

**Production strategies:**

```typescript
// Disable scale-to-zero for production (Neon Console or API)
// Set minimum compute size > 0

// For latency-sensitive endpoints, use connection warming
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Warm connection on app startup
export async function warmConnection() {
  await sql`SELECT 1`;
}
```

**When to keep scale-to-zero:**
- Development branches
- Preview environments
- Internal tools with tolerant latency
- Cost-sensitive non-production workloads

### Connection Pooling Configuration

PgBouncer `default_pool_size` scales with compute:

| Compute Size | max_connections | default_pool_size |
|--------------|-----------------|-------------------|
| 0.25 CU | 112 | ~100 |
| 1 CU | 225 | ~200 |
| 4 CU | 450 | ~400 |

**Application-side pooling (Prisma):**

```
DATABASE_URL="...?connection_limit=10&pool_timeout=15"
```

### Read Replicas

Neon read replicas share storage (no extra cost) with independent compute:

```typescript
// db/index.ts (Drizzle with replicas)
import { drizzle } from 'drizzle-orm/neon-serverless';
import { withReplicas } from 'drizzle-orm/pg-core';
import { Pool } from '@neondatabase/serverless';

const primaryDb = drizzle(new Pool({ connectionString: process.env.DATABASE_URL! }));
const readDb = drizzle(new Pool({ connectionString: process.env.READ_REPLICA_URL! }));

export const db = withReplicas(primaryDb, [readDb]);

// Reads automatically route to replica
// Writes automatically route to primary
```

**Use cases:**
- Analytics dashboards
- Report generation
- Background jobs
- Read-heavy API endpoints

## Schema Design for Serverless

### Indexing Strategy

```sql
-- Partial indexes for common filters (reduce index size)
CREATE INDEX idx_users_active ON users (email) WHERE active = true;

-- Covering indexes for read-heavy queries (avoid table lookup)
CREATE INDEX idx_orders_user_recent ON orders (user_id, created_at DESC) 
INCLUDE (status, total);

-- BRIN indexes for time-series data (much smaller than B-tree)
CREATE INDEX idx_events_time ON events USING BRIN (created_at);
```

### Connection-Efficient Patterns

```typescript
// Batch operations instead of loops
const userIds = ['id1', 'id2', 'id3'];

// ❌ N+1 queries
for (const id of userIds) {
  await sql`SELECT * FROM users WHERE id = ${id}`;
}

// ✅ Single query
const users = await sql`SELECT * FROM users WHERE id = ANY(${userIds})`;
```

## Migrations

### Migration Best Practices

1. **Always use direct (unpooled) connection for migrations**
2. **Run migrations before deployment, not at runtime**
3. **Use transactional migrations for safety**
4. **Test migrations against branch first**

**Drizzle migration workflow:**

```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Apply to development branch
DATABASE_URL=$DEV_DATABASE_URL npx drizzle-kit migrate

# Apply to production (CI/CD)
DATABASE_URL=$PROD_DATABASE_URL_UNPOOLED npx drizzle-kit migrate
```

**GitHub Actions example:**

```yaml
- name: Run migrations
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL_UNPOOLED }}
  run: npx drizzle-kit migrate
```

## Instant Restore & Recovery

Neon preserves history within your restore window (default: 24h paid, 1h free).

**Console:** Branch → "Restore" → Select timestamp

**CLI:**
```bash
# Create investigation branch from past point
neon branches create \
  --name restore/investigate-bug \
  --parent main \
  --time "2024-01-15T10:30:00Z"
```

**Use cases:**
- Recover from accidental data deletion
- Debug production issues with historical state
- Compare schema changes over time

## Security Checklist

- [ ] Use IP allow lists for production branches
- [ ] Mark production branch as "protected" (prevents deletion)
- [ ] Use separate roles with minimal privileges per environment
- [ ] Enable `channel_binding=require` in connection strings (MITM protection)
- [ ] Store credentials in environment variables, never in code
- [ ] Use anonymized branches when PII involved in dev/test

## Resources

- [Connection patterns reference](references/connection-patterns.md)
- [Drizzle ORM setup guide](references/drizzle-setup.md)
- [Prisma setup guide](references/prisma-setup.md)
- [Branching workflow patterns](references/branching-workflows.md)
- [Environment configuration templates](assets/env-templates/)
