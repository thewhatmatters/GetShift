# Neon + Next.js Environment Configuration Templates

## .env.local (Development)

Copy this to your project root as `.env.local`:

```bash
# =============================================================================
# NEON DATABASE CONFIGURATION
# =============================================================================

# Pooled connection - use for application queries
# Get from: Neon Console → Connect → Pooled connection
DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require"

# Direct connection - use for migrations only
# Get from: Neon Console → Connect → Direct connection
DATABASE_URL_UNPOOLED="postgresql://[user]:[password]@[endpoint].[region].aws.neon.tech/[dbname]?sslmode=require"

# =============================================================================
# OPTIONAL: READ REPLICA (for scaling read-heavy workloads)
# =============================================================================
# READ_REPLICA_URL="postgresql://[user]:[password]@[endpoint]-00-pooler.[region].aws.neon.tech/[dbname]?sslmode=require"

# =============================================================================
# NEON CLI/API (for branch management scripts)
# =============================================================================
# NEON_PROJECT_ID="your-project-id"
# NEON_API_KEY="your-api-key"
```

## .env.example (Template for team)

Commit this file to your repository:

```bash
# =============================================================================
# DATABASE - Neon Serverless Postgres
# =============================================================================
# Get connection strings from: https://console.neon.tech
#
# IMPORTANT: Use pooled connection (-pooler) for application queries
#            Use direct connection (no -pooler) for migrations

DATABASE_URL="postgresql://user:password@endpoint-pooler.region.aws.neon.tech/dbname?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://user:password@endpoint.region.aws.neon.tech/dbname?sslmode=require"

# Optional: Read replica for analytics/reporting
# READ_REPLICA_URL=""

# =============================================================================
# NEON CLI (optional - for automated branch management)
# =============================================================================
# NEON_PROJECT_ID=""
# NEON_API_KEY=""
```

## vercel.json (Vercel Environment Setup)

```json
{
  "env": {
    "DATABASE_URL": "@database-url",
    "DATABASE_URL_UNPOOLED": "@database-url-unpooled"
  },
  "build": {
    "env": {
      "DATABASE_URL_UNPOOLED": "@database-url-unpooled"
    }
  }
}
```

## Environment Variables by Context

| Variable | Development | Preview | Production |
|----------|-------------|---------|------------|
| `DATABASE_URL` | Local/dev branch | Preview branch (auto) | Production pooled |
| `DATABASE_URL_UNPOOLED` | Local/dev branch | Preview branch (auto) | Production direct |
| `READ_REPLICA_URL` | Not needed | Not needed | Read replica pooled |

## Connection String Checklist

✅ Includes `sslmode=require`
✅ Uses `-pooler` suffix for application queries
✅ No `-pooler` suffix for migrations
✅ Password URL-encoded (special chars: `@` → `%40`, `#` → `%23`)
✅ Channel binding enabled: `&channel_binding=require` (recommended)
