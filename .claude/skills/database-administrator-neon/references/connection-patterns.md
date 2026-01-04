# Neon Connection Patterns

Deep dive into connection types, drivers, and optimization for serverless environments.

## Connection Types

### Pooled vs Direct Connections

| Feature | Pooled (`-pooler`) | Direct |
|---------|-------------------|--------|
| Max concurrent | 10,000 | ~100-500 (compute-dependent) |
| Connection mode | Transaction | Session |
| Prepared statements | Supported (protocol-level) | Full support |
| Session state | Reset between transactions | Persisted |
| Use cases | App queries, serverless | Migrations, admin ops |
| Latency | Slightly higher (PgBouncer hop) | Lower |

### When to Use Each

**Use Pooled Connections:**
- Application queries from serverless functions
- High-concurrency workloads
- Stateless request handlers
- Server Components and Server Actions

**Use Direct Connections:**
- Database migrations
- Schema changes (DDL)
- Logical replication
- Administrative operations (VACUUM, ANALYZE)
- Operations requiring session state

## Driver Selection

### Neon Serverless Driver

**HTTP Mode** (`neon()`)

Best for: Single queries, parallel operations, lowest latency

```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Simple query
const users = await sql`SELECT * FROM users`;

// Parameterized (SQL injection safe)
const user = await sql`SELECT * FROM users WHERE id = ${userId}`;

// Parallel queries (HTTP excels here)
const [users, posts, comments] = await Promise.all([
  sql`SELECT * FROM users LIMIT 10`,
  sql`SELECT * FROM posts LIMIT 10`,
  sql`SELECT * FROM comments LIMIT 10`,
]);
```

**WebSocket Mode** (`Pool`/`Client`)

Best for: Transactions, sessions, node-postgres compatibility

```typescript
import { neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';

// Required for Node.js < 22
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Transaction example
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO orders (user_id, total) VALUES ($1, $2)', [userId, total]);
  await client.query('UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2', [qty, productId]);
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
}
```

### TCP Drivers (pg, postgres.js)

For long-running Node.js servers:

```typescript
// Using node-postgres (pg)
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Using postgres.js
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, {
  max: 20,
  idle_timeout: 30,
  connect_timeout: 10,
});
```

## Connection String Anatomy

```
postgresql://user:password@ep-cool-name-123456-pooler.us-east-2.aws.neon.tech:5432/dbname?sslmode=require&channel_binding=require
│            │    │        │                    │       │                     │    │      │
│            │    │        │                    │       │                     │    │      └─ Parameters
│            │    │        │                    │       │                     │    └─ Database name
│            │    │        │                    │       │                     └─ Port (5432)
│            │    │        │                    │       └─ Region
│            │    │        │                    └─ "-pooler" suffix = pooled connection
│            │    │        └─ Endpoint ID (ep-*)
│            │    └─ Password
│            └─ Username/Role
└─ Protocol
```

**Key parameters:**
- `sslmode=require`: Required for Neon
- `channel_binding=require`: MITM protection (recommended)
- `options=project%3D{project_id}`: Legacy SNI workaround

## Serverless Considerations

### Cold Starts

When compute is suspended (scale-to-zero), first connection triggers cold start:

| Compute Size | Cold Start Time |
|--------------|-----------------|
| 0.25 CU | ~500ms - 2s |
| 1 CU | ~300ms - 1s |
| 4+ CU | ~200ms - 500ms |

**Mitigation strategies:**

1. **Disable scale-to-zero for production:**
   ```
   Console → Compute → Set minimum size > 0
   ```

2. **Connection warming:**
   ```typescript
   // Run periodically to keep compute active
   await sql`SELECT 1`;
   ```

3. **Use pooled connections:**
   PgBouncer absorbs cold start from client perspective.

### Connection Limits

**PgBouncer (Pooled):**
- 10,000 concurrent connections
- Shared across all roles and databases
- Transaction-mode pooling

**Direct (Postgres):**

| Compute Size | max_connections |
|--------------|-----------------|
| 0.25 CU | 112 |
| 0.5 CU | 225 |
| 1 CU | 450 |
| 2 CU | 901 |
| 4 CU | 1802 |

**Note:** 7 connections reserved for Neon superuser.

### Serverless Function Best Practices

```typescript
// ❌ Don't create connections outside handler
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function handler() {
  // Connection may be stale
  const result = await pool.query('SELECT 1');
}

// ✅ Create connection inside handler (for WebSocket)
export async function handler() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const result = await pool.query('SELECT 1');
    return result;
  } finally {
    await pool.end();
  }
}

// ✅ Or use HTTP driver (best for serverless)
import { neon } from '@neondatabase/serverless';

export async function handler() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql`SELECT 1`;
}
```

## Performance Optimization

### HTTP vs WebSocket Latency

| Metric | HTTP | WebSocket |
|--------|------|-----------|
| First query | ~50-100ms | ~150-250ms |
| Subsequent queries | ~50-100ms | ~10-30ms |
| Parallel queries | Excellent | Good |
| Transactions | ❌ Not supported | ✅ Supported |

**Choose HTTP when:**
- Single queries per request
- Parallel independent queries
- No transaction requirements

**Choose WebSocket when:**
- Multiple sequential queries
- Transaction support needed
- Session state required

### Connection Reuse

**Drizzle with connection caching:**

```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Create once at module level
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

// Reuse across requests
export async function getUser(id: string) {
  return db.select().from(users).where(eq(users.id, id));
}
```

**Prisma connection caching:**

```typescript
const globalForPrisma = globalThis as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### Query Batching

```typescript
// ❌ Multiple round trips
for (const id of userIds) {
  await sql`SELECT * FROM users WHERE id = ${id}`;
}

// ✅ Single query
const users = await sql`SELECT * FROM users WHERE id = ANY(${userIds})`;

// ✅ Batch insert
await sql`
  INSERT INTO users (email, name)
  SELECT * FROM unnest(${emails}::text[], ${names}::text[])
`;
```

## Timeout Configuration

### Connection Timeouts

```bash
# Connection string parameters
DATABASE_URL="...?connect_timeout=30&pool_timeout=15"
```

| Parameter | Description | Default |
|-----------|-------------|---------|
| `connect_timeout` | Time to establish connection | 10s |
| `pool_timeout` | Time to acquire from pool | 10s |
| `statement_timeout` | Max query execution time | None |
| `idle_in_transaction_session_timeout` | Idle transaction timeout | None |

### Setting Statement Timeout

```sql
-- Per session
SET statement_timeout = '30s';

-- Per transaction
BEGIN;
SET LOCAL statement_timeout = '60s';
-- queries...
COMMIT;
```

```typescript
// In connection string
const sql = neon(process.env.DATABASE_URL + '&options=-c%20statement_timeout%3D30000');
```

## SSL/TLS Configuration

Neon requires SSL. Connection strings include `sslmode=require`.

**Enhanced security:**
```bash
# Add channel binding protection
DATABASE_URL="...?sslmode=require&channel_binding=require"
```

**Certificate verification (advanced):**
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    // Optional: Pin specific CA
    ca: process.env.SSL_CA_CERT,
  },
});
```

## Troubleshooting

### "Too many connections"

```
Error: remaining connection slots are reserved for non-replication superuser connections
```

**Solutions:**
1. Use pooled connection string
2. Reduce application connection pool size
3. Increase compute size
4. Check for connection leaks

### "Connection terminated unexpectedly"

Common in serverless with long-running queries or idle connections.

**Solutions:**
1. Add `connect_timeout` parameter
2. Implement retry logic
3. Use keep-alive for WebSocket connections

### SNI Issues (Older Clients)

```
Error: endpoint ID is not specified
```

**Solution:** Add project ID to options:
```bash
DATABASE_URL="...?options=project%3D{project-id}"
```

### Connection Refused After Suspend

Compute may take time to wake from suspension.

**Solution:** Increase `connect_timeout`:
```bash
DATABASE_URL="...?connect_timeout=30"
```
