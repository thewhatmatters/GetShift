# Neon Branching Workflows

Database branching enables Git-like workflows for your database. Branches are copy-on-write clones created in ~1 second regardless of database size.

## Core Concepts

### How Branches Work

- **Copy-on-Write**: Branches share underlying storage; only changes (deltas) consume additional space
- **Instant Creation**: ~1 second regardless of database size
- **Isolated Compute**: Each branch has independent autoscaling compute
- **Independent Credentials**: Child branches from protected parents get unique credentials

### Branch Hierarchy

```
main (Production)
├── staging                    # Long-lived staging branch
├── dev/alice                  # Developer branch
├── dev/bob                    # Developer branch
├── preview/pr-123-feature     # PR preview (ephemeral)
├── test/e2e-run-456          # Test run branch (ephemeral)
└── restore/2024-01-15-debug   # Point-in-time investigation
```

## Workflow Patterns

### 1. Developer Branches

Each engineer gets an isolated copy of production data.

**Setup:**

```bash
# Create developer branch
neon branches create \
  --name dev/alice \
  --parent main

# Get connection string
neon connection-string dev/alice --pooled
```

**Reset to latest production:**

```bash
# Sync with production (overwrites local changes)
neon branches reset dev/alice --parent
```

**Naming convention:** `dev/{developer-name}` or `dev/{feature-name}`

### 2. PR Preview Branches

Automatic database per pull request for testing migrations and features.

**GitHub Actions Workflow:**

```yaml
# .github/workflows/preview.yml
name: Preview Environment

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  create-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Create Neon Branch
        id: create-branch
        uses: neondatabase/create-branch-action@v5
        with:
          project_id: ${{ secrets.NEON_PROJECT_ID }}
          api_key: ${{ secrets.NEON_API_KEY }}
          branch_name: preview/pr-${{ github.event.pull_request.number }}
          parent: main
          
      - name: Run Migrations
        env:
          DATABASE_URL: ${{ steps.create-branch.outputs.db_url_with_pooler }}
        run: npx drizzle-kit migrate
        
      - name: Deploy Preview
        env:
          DATABASE_URL: ${{ steps.create-branch.outputs.db_url_with_pooler }}
        run: vercel deploy --env DATABASE_URL=$DATABASE_URL
        
      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🗄️ Preview database created: `preview/pr-${{ github.event.pull_request.number }}`'
            })

  cleanup-preview:
    runs-on: ubuntu-latest
    if: github.event.action == 'closed'
    steps:
      - name: Delete Neon Branch
        uses: neondatabase/delete-branch-action@v3
        with:
          project_id: ${{ secrets.NEON_PROJECT_ID }}
          api_key: ${{ secrets.NEON_API_KEY }}
          branch: preview/pr-${{ github.event.pull_request.number }}
```

**Naming convention:** `preview/pr-{number}-{short-description}`

### 3. Staging Environment

Long-lived staging branch that resets periodically.

**Manual reset (weekly):**

```bash
neon branches reset staging --parent main
```

**Automated weekly reset:**

```yaml
# .github/workflows/reset-staging.yml
name: Reset Staging

on:
  schedule:
    - cron: '0 0 * * 0'  # Every Sunday at midnight
  workflow_dispatch:      # Allow manual trigger

jobs:
  reset:
    runs-on: ubuntu-latest
    steps:
      - name: Reset Staging Branch
        run: |
          curl -X POST \
            "https://console.neon.tech/api/v2/projects/${{ secrets.NEON_PROJECT_ID }}/branches/staging/reset" \
            -H "Authorization: Bearer ${{ secrets.NEON_API_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"parent": "main"}'
```

### 4. Anonymized Branches (PII Protection)

When production contains sensitive data, create branches with masked PII.

**Console Setup:**

1. Go to Branch settings
2. Enable "Data anonymization"
3. Configure column masking rules:

```sql
-- Example masking rules
email → '[MASKED]@example.com'
phone → '+1-XXX-XXX-XXXX'
ssn → 'XXX-XX-XXXX'
name → fake_first_name() || ' ' || fake_last_name()
```

**Create anonymized branch:**

```bash
neon branches create \
  --name staging-anon \
  --parent main \
  --data-mode anonymized
```

**Workflow:**

```
main (Production with PII)
└── staging-anon (Anonymized)
    ├── dev/alice
    ├── dev/bob
    └── preview/pr-123
```

### 5. E2E Test Branches

Isolated database for each test run with deterministic data.

**Create from specific point:**

```bash
# Create from specific timestamp for deterministic tests
neon branches create \
  --name test/e2e-run-$RUN_ID \
  --parent main \
  --time "2024-01-15T00:00:00Z"
```

**GitHub Actions Integration:**

```yaml
# .github/workflows/e2e.yml
jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Create Test Branch
        id: create-branch
        uses: neondatabase/create-branch-action@v5
        with:
          project_id: ${{ secrets.NEON_PROJECT_ID }}
          api_key: ${{ secrets.NEON_API_KEY }}
          branch_name: test/e2e-${{ github.run_id }}
          parent: main
          
      - name: Run E2E Tests
        env:
          DATABASE_URL: ${{ steps.create-branch.outputs.db_url_with_pooler }}
        run: npm run test:e2e
        
      - name: Cleanup
        if: always()
        uses: neondatabase/delete-branch-action@v3
        with:
          project_id: ${{ secrets.NEON_PROJECT_ID }}
          api_key: ${{ secrets.NEON_API_KEY }}
          branch: test/e2e-${{ github.run_id }}
```

### 6. Point-in-Time Recovery

Create branch from any point within restore window.

**Investigate past state:**

```bash
# Create branch from 2 hours ago
neon branches create \
  --name restore/investigate-bug \
  --parent main \
  --time "2024-01-15T14:30:00Z"
```

**Use cases:**
- Investigate data issues
- Recover accidentally deleted data
- Debug production incidents
- Compare schema changes

**Restore window defaults:**
- Free tier: 1 hour
- Paid plans: 24 hours (configurable up to 30 days)

## Neon CLI Reference

### Branch Management

```bash
# List branches
neon branches list

# Create branch
neon branches create --name <name> --parent <parent>

# Create from point in time
neon branches create --name <name> --parent <parent> --time "2024-01-15T10:00:00Z"

# Create schema-only (no data)
neon branches create --name <name> --parent <parent> --data-mode schema-only

# Reset branch to parent state
neon branches reset <branch> --parent

# Delete branch
neon branches delete <branch>

# Get connection string
neon connection-string <branch>
neon connection-string <branch> --pooled
```

### Environment Variables

```bash
# Set default project
export NEON_PROJECT_ID=your-project-id
export NEON_API_KEY=your-api-key

# Or use config file
neon auth
```

## Vercel Integration

Neon's Vercel integration automatically creates preview branches.

**Setup:**

1. Install Neon integration from Vercel Integrations
2. Connect your Neon project
3. Enable "Create branch for preview deployments"

**Automatic behavior:**
- Creates branch on PR open
- Sets `DATABASE_URL` for preview deployment
- Deletes branch on PR close

**Environment variables set by integration:**
- `DATABASE_URL` (pooled)
- `DATABASE_URL_UNPOOLED` (direct)
- `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

## Best Practices

### Branch Naming

| Type | Convention | Example |
|------|------------|---------|
| Developer | `dev/{name}` | `dev/alice` |
| Feature | `dev/{feature}` | `dev/auth-refactor` |
| Preview | `preview/pr-{num}` | `preview/pr-123` |
| Staging | `staging` | `staging` |
| Test | `test/{type}-{id}` | `test/e2e-456` |
| Restore | `restore/{date}` | `restore/2024-01-15` |

### Cleanup Automation

```yaml
# .github/workflows/cleanup-branches.yml
name: Cleanup Old Branches

on:
  schedule:
    - cron: '0 0 * * *'  # Daily

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Delete old preview branches
        run: |
          # Get branches older than 7 days
          neon branches list --output json | \
          jq -r '.[] | select(.name | startswith("preview/")) | 
                 select(.created_at < (now - 604800 | todate)) | .name' | \
          xargs -I {} neon branches delete {}
```

### Protected Branches

Mark production as protected to:
- Prevent accidental deletion
- Generate unique credentials for child branches
- Enable additional safeguards

```bash
# Via Console: Project Settings → Branches → Mark as protected
```

### Cost Optimization

- Enable scale-to-zero for non-production branches
- Set aggressive auto-suspend (1 min) for preview/test branches
- Delete ephemeral branches promptly
- Use schema-only branches when data isn't needed

## Troubleshooting

### Branch Creation Fails

```
Error: Cannot create branch from parent with pending operations
```

**Solution:** Wait for pending operations to complete or use a different parent.

### Connection Issues After Reset

Credentials may change after reset. Re-fetch connection string:

```bash
neon connection-string <branch> --pooled
```

### Compute Not Starting

Check if compute is suspended:

```bash
neon compute list
neon compute start <compute-id>
```
