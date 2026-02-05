# Rollback Procedure

This document describes how to rollback a deployment when issues are discovered.

## Quick Rollback via Vercel Dashboard

**Fastest method - use this for urgent issues:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → `theevolvingpm` project
2. Click "Deployments" tab
3. Find the last known good deployment
4. Click "..." menu → "Promote to Production"

This instantly routes traffic to the previous deployment.

## Rollback via Git Revert

**Use this when you want to also fix the codebase:**

1. Identify the problematic commit:
   ```bash
   git log --oneline -10
   ```

2. Revert the commit:
   ```bash
   git revert <commit-hash>
   ```

3. Push the revert:
   ```bash
   git push origin main
   ```

This creates a new commit that undoes the changes and triggers a new deployment.

## Rollback Multiple Commits

If multiple commits need to be reverted:

```bash
# Revert commits from newest to oldest
git revert <newest-commit-hash>
git revert <older-commit-hash>
git push origin main
```

Or revert a range:

```bash
git revert <oldest-commit-hash>^..<newest-commit-hash>
git push origin main
```

## When to Rollback

Rollback immediately if:

- Site is completely down
- Critical functionality broken (resources won't load, etc.)
- Security vulnerability discovered
- Data corruption occurring

Consider rollback if:

- Significant performance degradation
- High error rate in Sentry
- Major UI/UX regression

## Post-Rollback Steps

After rolling back:

1. **Verify:** Confirm the site is working correctly
2. **Communicate:** Notify relevant stakeholders if needed
3. **Investigate:** Determine root cause of the issue
4. **Fix forward:** Create a proper fix, test thoroughly, then redeploy

## Database Considerations

**Important:** Code rollbacks do NOT rollback database changes.

If database migrations were part of the problematic deployment:

1. Assess whether the schema change can coexist with old code
2. If not, manually revert database changes in Supabase
3. Document any manual database changes made

## Vercel Instant Rollback Retention

Vercel keeps previous deployments available for instant rollback. The exact retention depends on your plan, but recent deployments are always available.

## Emergency Contacts

- Vercel Status: https://www.vercel-status.com/
- Supabase Status: https://status.supabase.com/
- Sentry Status: https://status.sentry.io/
