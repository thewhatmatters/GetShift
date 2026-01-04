# Prisma Setup with Neon

Complete guide for configuring Prisma ORM with Neon serverless Postgres in Next.js.

## Installation

```bash
# Core packages
npm install prisma @prisma/client

# Initialize Prisma
npx prisma init

# Optional: Neon serverless adapter for edge/serverless
npm install @prisma/adapter-neon @neondatabase/serverless
```

## Configuration

### Schema Configuration (prisma/schema.prisma)

**Standard Setup (Prisma 5.10+):**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED")  // For migrations
}
```

**With Serverless Adapter (Edge/Serverless):**

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED")
}
```

### Environment Variables

```bash
# .env
# Pooled connection for queries (up to 10K concurrent)
DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/db?sslmode=require"

# Direct connection for migrations
DATABASE_URL_UNPOOLED="postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require"
```

## Client Setup

### Standard Client (Node.js Runtime)

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### Serverless Adapter (Edge Runtime)

```typescript
// lib/prisma-edge.ts
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const adapter = new PrismaNeon(sql);

export const prisma = new PrismaClient({ adapter });
```

**Usage in Edge Route:**

```typescript
// app/api/edge-route/route.ts
import { prisma } from '@/lib/prisma-edge';

export const runtime = 'edge';

export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}
```

## Schema Definition

### Basic Models

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())

  @@index([authorId])
  @@index([published])
}
```

### Enums and JSON

```prisma
enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

model Order {
  id        Int         @id @default(autoincrement())
  status    OrderStatus @default(PENDING)
  total     Decimal     @db.Decimal(10, 2)
  metadata  Json?
  createdAt DateTime    @default(now())
}
```

### Composite Indexes and Constraints

```prisma
model Subscription {
  id        String   @id @default(uuid())
  userId    String
  plan      String
  active    Boolean  @default(true)
  expiresAt DateTime?
  user      User     @relation(fields: [userId], references: [id])

  // Composite unique constraint
  @@unique([userId, active])
  
  // Composite index
  @@index([userId, active])
}
```

## Migrations

### Development Workflow

```bash
# Create and apply migration (development)
npx prisma migrate dev --name add_users_table

# Reset database (caution: destructive)
npx prisma migrate reset
```

### Production Deployment

```bash
# Apply pending migrations (production)
npx prisma migrate deploy

# Generate client after schema changes
npx prisma generate
```

### Migration Scripts

```json
{
  "scripts": {
    "db:migrate:dev": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  }
}
```

### CI/CD Migration

```yaml
# .github/workflows/deploy.yml
- name: Run Database Migrations
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL_UNPOOLED }}
  run: npx prisma migrate deploy
```

## Query Patterns

### Basic CRUD

```typescript
import { prisma } from '@/lib/prisma';

// Find many
const users = await prisma.user.findMany({
  where: { active: true },
  orderBy: { createdAt: 'desc' },
  take: 10,
});

// Find unique
const user = await prisma.user.findUnique({
  where: { id: userId },
});

// Find first
const firstAdmin = await prisma.user.findFirst({
  where: { role: 'ADMIN' },
});

// Create
const newUser = await prisma.user.create({
  data: {
    email: 'test@example.com',
    name: 'Test User',
  },
});

// Create many
await prisma.user.createMany({
  data: [
    { email: 'a@test.com' },
    { email: 'b@test.com' },
  ],
  skipDuplicates: true,
});

// Update
const updated = await prisma.user.update({
  where: { id: userId },
  data: { name: 'New Name' },
});

// Upsert
const upserted = await prisma.user.upsert({
  where: { email: 'test@example.com' },
  update: { name: 'Updated Name' },
  create: { email: 'test@example.com', name: 'New User' },
});

// Delete
await prisma.user.delete({
  where: { id: userId },
});
```

### Relations

```typescript
// Include relations
const userWithPosts = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    },
  },
});

// Select specific fields
const userEmails = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    _count: {
      select: { posts: true },
    },
  },
});

// Nested create
const userWithPost = await prisma.user.create({
  data: {
    email: 'author@example.com',
    posts: {
      create: {
        title: 'First Post',
        content: 'Hello World',
      },
    },
  },
  include: { posts: true },
});
```

### Aggregations

```typescript
// Count
const userCount = await prisma.user.count({
  where: { active: true },
});

// Aggregate
const stats = await prisma.order.aggregate({
  _avg: { total: true },
  _sum: { total: true },
  _count: true,
  where: { status: 'DELIVERED' },
});

// Group by
const postsByAuthor = await prisma.post.groupBy({
  by: ['authorId'],
  _count: { id: true },
  orderBy: { _count: { id: 'desc' } },
});
```

### Transactions

```typescript
// Sequential transaction
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: { email: 'new@test.com' } }),
  prisma.post.create({ data: { title: 'Post', authorId: existingUserId } }),
]);

// Interactive transaction
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'transactional@test.com' },
  });
  
  await tx.post.create({
    data: {
      title: 'First Post',
      authorId: user.id,
    },
  });
  
  return user;
});
```

### Raw Queries

```typescript
// Raw query
const users = await prisma.$queryRaw`
  SELECT * FROM "User" 
  WHERE email LIKE ${`%@example.com`}
`;

// Raw execute
await prisma.$executeRaw`
  UPDATE "User" 
  SET "updatedAt" = NOW() 
  WHERE id = ${userId}
`;
```

## Connection Management

### Connection Pooling with Prisma

```bash
# Connection string with pool settings
DATABASE_URL="postgresql://...?connection_limit=10&pool_timeout=15&connect_timeout=15"
```

**Parameters:**
- `connection_limit`: Max connections in Prisma pool (default: `num_physical_cpus * 2 + 1`)
- `pool_timeout`: Seconds to wait for pool connection (default: 10)
- `connect_timeout`: Seconds to wait for database connection (default: 5)

### Serverless Considerations

For serverless (Vercel, Netlify, AWS Lambda):

```typescript
// Recommended connection limit for serverless
// DATABASE_URL="...?connection_limit=1"

// Or use the Neon serverless adapter which handles this automatically
```

### Connection Timeouts

```bash
# Extended timeouts for cold starts
DATABASE_URL="...?connect_timeout=30&pool_timeout=30"
```

## Type Safety

### Generated Types

```typescript
import { User, Post, Prisma } from '@prisma/client';

// Full model type
type UserType = User;

// Input types
type CreateUserInput = Prisma.UserCreateInput;
type UpdateUserInput = Prisma.UserUpdateInput;

// Query result types
type UserWithPosts = Prisma.UserGetPayload<{
  include: { posts: true };
}>;
```

### Type-Safe Query Building

```typescript
// Dynamic where clause
function buildUserFilter(params: {
  email?: string;
  active?: boolean;
}): Prisma.UserWhereInput {
  return {
    ...(params.email && { email: { contains: params.email } }),
    ...(params.active !== undefined && { active: params.active }),
  };
}

const users = await prisma.user.findMany({
  where: buildUserFilter({ email: '@example.com', active: true }),
});
```

## Performance Tips

1. **Use `select` over `include`** when you don't need full relations
2. **Batch operations** with `createMany`/`updateMany` where possible
3. **Use `findFirst` + `take: 1`** instead of `findMany()[0]`
4. **Add database indexes** for frequently queried fields
5. **Use connection pooling** appropriately for your runtime
6. **Leverage `skipDuplicates`** in batch inserts
7. **Use raw queries** for complex aggregations

## Common Issues

### Cold Start Timeouts

```bash
# Increase timeouts
DATABASE_URL="...?connect_timeout=30"
```

### Too Many Connections

```bash
# Reduce connection limit for serverless
DATABASE_URL="...?connection_limit=1"

# Or use Neon serverless adapter
```

### Migration Failures with Pooled Connection

Always use `DATABASE_URL_UNPOOLED` for migrations:

```bash
DATABASE_URL=$DATABASE_URL_UNPOOLED npx prisma migrate deploy
```
