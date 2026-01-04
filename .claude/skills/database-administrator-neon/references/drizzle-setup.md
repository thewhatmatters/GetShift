# Drizzle ORM Setup with Neon

Complete guide for configuring Drizzle ORM with Neon serverless Postgres in Next.js.

## Installation

```bash
# Core packages
npm install drizzle-orm @neondatabase/serverless

# Development tools
npm install -D drizzle-kit dotenv

# Optional: WebSocket support for Node.js < 22
npm install ws
npm install -D @types/ws
```

## Project Structure

```
project/
├── db/
│   ├── index.ts          # Database client export
│   ├── schema.ts         # Table definitions
│   └── migrations/       # Generated SQL migrations
├── drizzle.config.ts     # Drizzle Kit configuration
└── .env.local            # Environment variables
```

## Configuration

### drizzle.config.ts

```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // Use unpooled for migrations
    url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
```

### Environment Variables

```bash
# .env.local
DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/db?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require"

# For read replicas (optional)
READ_REPLICA_URL="postgresql://user:pass@ep-xxx-00-pooler.region.aws.neon.tech/db?sslmode=require"
```

## Database Client Setup

### HTTP Driver (Server Components, Server Actions)

Best for stateless queries with lowest latency:

```typescript
// db/index.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
```

### WebSocket Driver (Transactions, Sessions)

Required when you need transactions or session state:

```typescript
// db/index.ts
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from './schema';

// Required for Node.js < 22
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

export const db = drizzle(pool, { schema });
```

### With Read Replicas

Automatically routes reads to replica, writes to primary:

```typescript
// db/index.ts
import { drizzle } from 'drizzle-orm/neon-serverless';
import { withReplicas } from 'drizzle-orm/pg-core';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';

const primaryPool = new Pool({ connectionString: process.env.DATABASE_URL! });
const replicaPool = new Pool({ connectionString: process.env.READ_REPLICA_URL! });

const primaryDb = drizzle(primaryPool, { schema });
const replicaDb = drizzle(replicaPool, { schema });

export const db = withReplicas(primaryDb, [replicaDb]);

// Usage - reads go to replica automatically
const users = await db.select().from(schema.users);

// Force read from primary when needed
const freshUser = await db.$primary.select().from(schema.users).where(eq(schema.users.id, id));
```

## Schema Definition

### Basic Tables

```typescript
// db/schema.ts
import { 
  pgTable, 
  uuid, 
  varchar, 
  text, 
  timestamp, 
  boolean, 
  integer,
  serial,
  index,
  uniqueIndex 
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
}));

// Posts table with foreign key
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  published: boolean('published').default(false),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  authorIdx: index('posts_author_idx').on(table.authorId),
  publishedIdx: index('posts_published_idx').on(table.published).where(eq(table.published, true)),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
```

### Enums and Custom Types

```typescript
import { pgEnum, jsonb, decimal } from 'drizzle-orm/pg-core';

// Enum type
export const orderStatusEnum = pgEnum('order_status', [
  'pending', 
  'processing', 
  'shipped', 
  'delivered', 
  'cancelled'
]);

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  status: orderStatusEnum('status').default('pending').notNull(),
  metadata: jsonb('metadata').$type<{ notes?: string; tags?: string[] }>(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
});
```

### Partial Indexes and Constraints

```typescript
import { sql } from 'drizzle-orm';

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  plan: varchar('plan', { length: 50 }).notNull(),
  active: boolean('active').default(true),
  expiresAt: timestamp('expires_at'),
}, (table) => ({
  // Partial index - only index active subscriptions
  activeUserIdx: index('subs_active_user_idx')
    .on(table.userId)
    .where(sql`${table.active} = true`),
  
  // Unique constraint on active subscriptions per user
  uniqueActiveSub: uniqueIndex('subs_unique_active')
    .on(table.userId)
    .where(sql`${table.active} = true`),
}));
```

## Migrations

### Generate Migrations

```bash
# Generate SQL from schema changes
npx drizzle-kit generate

# Output: db/migrations/0001_xxx.sql
```

### Apply Migrations

```bash
# Apply pending migrations
npx drizzle-kit migrate

# Alternative: Push schema directly (dev only, no migration files)
npx drizzle-kit push
```

### Migration Scripts in package.json

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

### CI/CD Migration

```yaml
# .github/workflows/deploy.yml
- name: Run Database Migrations
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL_UNPOOLED }}
  run: npx drizzle-kit migrate
```

## Query Patterns

### Basic CRUD

```typescript
import { db } from '@/db';
import { users, posts } from '@/db/schema';
import { eq, desc, and, or, like, inArray, sql } from 'drizzle-orm';

// Select
const allUsers = await db.select().from(users);

// Select with where
const activeUsers = await db
  .select()
  .from(users)
  .where(eq(users.active, true));

// Select specific columns
const userEmails = await db
  .select({ email: users.email })
  .from(users);

// Insert
const [newUser] = await db
  .insert(users)
  .values({ email: 'test@example.com', name: 'Test' })
  .returning();

// Insert many
await db.insert(users).values([
  { email: 'a@test.com' },
  { email: 'b@test.com' },
]);

// Update
await db
  .update(users)
  .set({ name: 'Updated Name' })
  .where(eq(users.id, userId));

// Delete
await db.delete(users).where(eq(users.id, userId));
```

### Complex Queries

```typescript
// Joins
const postsWithAuthors = await db
  .select({
    post: posts,
    authorName: users.name,
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .where(eq(posts.published, true));

// Aggregations
const postCounts = await db
  .select({
    authorId: posts.authorId,
    count: sql<number>`count(*)::int`,
  })
  .from(posts)
  .groupBy(posts.authorId);

// Subqueries
const usersWithPosts = await db
  .select()
  .from(users)
  .where(
    inArray(
      users.id,
      db.select({ id: posts.authorId }).from(posts)
    )
  );
```

### Relational Queries (Query API)

```typescript
// With relations defined, use query API for nested results
const usersWithPosts = await db.query.users.findMany({
  with: {
    posts: {
      where: eq(posts.published, true),
      orderBy: desc(posts.createdAt),
      limit: 5,
    },
  },
});

// Result type:
// { id, email, name, posts: [{ id, title, ... }] }[]
```

### Transactions

```typescript
// Requires WebSocket driver
await db.transaction(async (tx) => {
  const [user] = await tx
    .insert(users)
    .values({ email: 'new@test.com' })
    .returning();
    
  await tx.insert(posts).values({
    title: 'First Post',
    authorId: user.id,
  });
});
```

## Type Inference

```typescript
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { users, posts } from './schema';

// Infer types from schema
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

// Use in functions
async function createUser(data: NewUser): Promise<User> {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}
```

## Zod Integration

```typescript
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from './schema';
import { z } from 'zod';

// Auto-generate Zod schemas from Drizzle schema
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  name: z.string().min(2).max(100),
});

export const selectUserSchema = createSelectSchema(users);

// Use in Server Actions
export async function createUser(formData: FormData) {
  const parsed = insertUserSchema.parse({
    email: formData.get('email'),
    name: formData.get('name'),
  });
  
  await db.insert(users).values(parsed);
}
```

## Performance Tips

1. **Use prepared statements** for repeated queries
2. **Batch inserts** instead of individual inserts in loops
3. **Select only needed columns** to reduce data transfer
4. **Use covering indexes** for frequently accessed column combinations
5. **Leverage read replicas** for analytics/reporting queries
6. **Use `sql` template** for complex expressions to avoid over-fetching
