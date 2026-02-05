# Deployment Runbook

This document describes the deployment process for The Evolving PM.

## Overview

- **Platform:** Vercel
- **Trigger:** Automatic on push to `main` branch
- **Preview:** Automatic for pull requests

## Standard Deployment

### Automatic Deployment

1. Push changes to `main` branch
2. Vercel automatically builds and deploys
3. Monitor deployment in Vercel dashboard

```bash
git push origin main
```

### Monitoring Deployment

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the `theevolvingpm` project
3. View "Deployments" tab for build status and logs

## Pre-Deployment Checklist

Before merging to main:

- [ ] All tests pass locally (`npm run test:run && npm run test:e2e`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Changes reviewed (if applicable)
- [ ] No secrets or sensitive data in commits

## Environment Variables

Production environment variables are configured in Vercel:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `INGEST_API_KEY` | API key for /api/ingest |
| `RESEND_API_KEY` | Resend email service key |
| `EMAIL_FROM` | Sender email address |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error tracking DSN |
| `NEXT_PUBLIC_SITE_URL` | Production URL |

### Updating Environment Variables

1. Go to Vercel → Project Settings → Environment Variables
2. Update the variable value
3. **Important:** Redeploy for changes to take effect

## Build Process

Vercel runs these steps automatically:

1. `npm install` - Install dependencies
2. `npm run build` - Build Next.js application
3. Deploy to edge network

Build typically completes in 1-2 minutes.

## Post-Deployment Verification

After deployment:

1. **Smoke test:** Visit https://theevolvingpm.com and verify pages load
2. **Check Sentry:** Verify no new errors in Sentry dashboard
3. **Test critical paths:**
   - Homepage loads
   - Resources page loads with data
   - Category pages work
   - Submit form renders

## Deployment Failures

If a deployment fails:

1. Check Vercel build logs for errors
2. Common issues:
   - TypeScript errors
   - Missing environment variables
   - Dependency issues
3. Fix the issue locally, verify with `npm run build`, then push again

## Manual Redeploy

To redeploy without code changes (e.g., after env var update):

1. Go to Vercel → Deployments
2. Find the latest deployment
3. Click "..." menu → "Redeploy"

Or via Vercel CLI:

```bash
vercel --prod
```
