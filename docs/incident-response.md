# Incident Response

This document provides guidance for responding to production incidents.

## Severity Levels

### Critical (P1)
- Site completely down
- Data breach or security incident
- Data loss or corruption
- **Response time:** Immediate

### High (P2)
- Major feature broken (e.g., resources won't load)
- High error rate (>5% of requests)
- Performance severely degraded
- **Response time:** Within 1 hour

### Medium (P3)
- Minor feature broken
- Intermittent errors
- UI/UX issues affecting usability
- **Response time:** Within 24 hours

### Low (P4)
- Cosmetic issues
- Minor bugs with workarounds
- **Response time:** Next scheduled work session

## Incident Response Steps

### 1. Detect
Sources of incident detection:
- Sentry alerts
- Vercel deployment failures
- User reports
- Manual monitoring

### 2. Assess
Quickly determine:
- What is broken?
- How many users affected?
- What is the severity level?
- When did it start?

### 3. Mitigate
For P1/P2 incidents, prioritize restoring service:
- **Rollback** if the issue was caused by a recent deployment (see [rollback.md](./rollback.md))
- **Disable feature** if a specific feature is causing issues
- **Scale down** if a feature is causing downstream issues

### 4. Communicate
- Update any status page (if applicable)
- Notify stakeholders for P1/P2 incidents

### 5. Investigate
Once service is restored:
- Review Sentry for error details and stack traces
- Check Vercel logs for request/response data
- Review recent deployments and changes
- Check external service status (Supabase, Resend)

### 6. Resolve
- Identify root cause
- Implement and test fix
- Deploy fix (with extra verification)

### 7. Document
After resolution:
- Note what happened
- Document root cause
- Record what fixed it
- Identify preventive measures

## Common Issues and Responses

### Site Returns 500 Errors
1. Check Sentry for error details
2. Check Vercel deployment status
3. Verify environment variables are set
4. Check Supabase status/connectivity

### Resources Not Loading
1. Check Supabase status
2. Verify database connection (check Supabase dashboard)
3. Test API endpoint directly: `curl https://theevolvingpm.com/api/...`
4. Check for RLS policy issues

### Submit Form Not Working
1. Check Sentry for form submission errors
2. Verify Resend API key is valid
3. Check rate limiting isn't blocking legitimate requests
4. Test locally to isolate issue

### High Error Rate After Deployment
1. Immediately rollback via Vercel dashboard
2. Review changes in the problematic commit
3. Test fixes locally before redeploying

## Monitoring Locations

| Service | URL | What to Check |
|---------|-----|---------------|
| Vercel | vercel.com/dashboard | Deployments, logs, analytics |
| Sentry | sentry.io | Errors, performance, alerts |
| Supabase | supabase.com/dashboard | Database, auth, API health |

## Escalation

For issues beyond self-resolution:
- **Vercel issues:** support@vercel.com or Vercel Discord
- **Supabase issues:** support@supabase.io or Supabase Discord
- **Sentry issues:** support@sentry.io

## Post-Incident Review

For P1/P2 incidents, conduct a brief review:

1. **Timeline:** When detected, when mitigated, when resolved
2. **Impact:** Users affected, duration of impact
3. **Root cause:** What caused the incident
4. **Resolution:** How was it fixed
5. **Prevention:** What changes prevent recurrence

Keep these notes in a simple log for future reference.
