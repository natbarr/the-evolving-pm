# Submission Notifications

## Overview
Add real-time notifications when users submit resources, delivered to platforms where the site owner already works.

## Problem
With the current JSON file approach, submissions accumulate silently. The site owner must remember to check the file periodically, which can delay review and make submitters feel ignored.

## Current State
- Submissions are written to a local JSON file
- User receives email confirmation
- No notification to site owner

## Proposed Solutions

### Option A: GitHub Issue Integration

**How it works:** Each submission creates a GitHub issue in the backend assessment repository.

**Pros:**
- Submissions land where assessment work happens
- Built-in tracking (open/closed status)
- Can use GitHub labels for triage
- Free, no additional service needed

**Cons:**
- Requires GitHub API token setup
- Public repo = public submissions (unless using private repo)

**Implementation:**
```typescript
// POST to GitHub API
await fetch('https://api.github.com/repos/OWNER/REPO/issues', {
  method: 'POST',
  headers: {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: `Resource Submission: ${url}`,
    body: `**URL:** ${url}\n**Submitted by:** ${email || 'Anonymous'}\n**Context:** ${context || 'None provided'}`,
    labels: ['submission', 'pending-review']
  })
});
```

**Environment variables:**
- `GITHUB_TOKEN` - Personal access token with `repo` scope
- `GITHUB_REPO` - Repository in `owner/repo` format

---

### Option B: Slack Webhook

**How it works:** Each submission posts a message to a Slack channel.

**Pros:**
- Instant notification where you already communicate
- Can react/thread to discuss submissions
- Simple webhook setup (no OAuth)

**Cons:**
- Messages can get buried in busy channels
- No built-in status tracking
- Requires Slack workspace

**Implementation:**
```typescript
await fetch(process.env.SLACK_WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: `New resource submission`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New Resource Submission*\n<${url}|${url}>`
        }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*From:*\n${email || 'Anonymous'}` },
          { type: 'mrkdwn', text: `*Context:*\n${context || 'None'}` }
        ]
      }
    ]
  })
});
```

**Environment variables:**
- `SLACK_WEBHOOK_URL` - Incoming webhook URL from Slack app

---

### Option C: Discord Webhook

**How it works:** Each submission posts a message to a Discord channel.

**Pros:**
- Similar to Slack but may fit personal/community workflow better
- Simple webhook setup
- Free

**Cons:**
- Same limitations as Slack (no status tracking)
- Less common for professional workflows

**Implementation:**
```typescript
await fetch(process.env.DISCORD_WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    embeds: [{
      title: 'New Resource Submission',
      url: url,
      fields: [
        { name: 'URL', value: url },
        { name: 'Submitted by', value: email || 'Anonymous' },
        { name: 'Context', value: context || 'None provided' }
      ],
      color: 5814783 // Blue color
    }]
  })
});
```

**Environment variables:**
- `DISCORD_WEBHOOK_URL` - Webhook URL from Discord channel settings

---

## Recommendation

**GitHub Issues** is the best fit if the backend assessment process lives in a GitHub repository - submissions become trackable work items in the same place.

**Slack** is better for immediate awareness if you're already monitoring a Slack workspace throughout the day.

## Estimated Effort
- GitHub Issues: 1-2 hours
- Slack webhook: 30 minutes
- Discord webhook: 30 minutes

## Dependencies
- For GitHub: Personal access token with appropriate permissions
- For Slack/Discord: Webhook URL from respective platform
