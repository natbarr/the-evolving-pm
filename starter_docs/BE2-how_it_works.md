# How It Works

A friendly guide to how we curate AI PM learning resources.

---

## What We're Building

This project is a curated collection of learning resources for product managers who want to specialize in AI. Our goal is simple: help you find the best resources without wading through the noise.

AI moves fast. New tools appear weekly, models get updated constantly, and yesterday's best practices can become outdated quickly. That's why we don't just collect resources—we actively maintain them, checking that what we recommend is still accurate and useful.

---

## The Journey of a Resource

Every resource in our collection goes through a lifecycle. Here's what that looks like:

### 1. Someone Finds Something Good

It starts when someone discovers a helpful article, course, video, or guide about AI product management. They drop it into our review queue (`resources/to_review/`), and that kicks off the evaluation process.

### 2. We Check If It's New

Before diving in, we check whether we've already evaluated this resource. No point doing the same work twice. If it's a duplicate, we note that and move on.

### 3. We Read It (Really Read It)

This isn't a quick skim. We fetch the content and assess whether it's actually useful for product managers learning about AI. Not everything makes the cut.

**What we're looking for:**
- Does it help PMs build AI product skills?
- Is there real substance, not just marketing fluff?
- Can a PM understand it without being a developer?

**What gets rejected:**
- Content that's too technical (requiring coding to understand)
- Articles that aren't really about AI PM work
- Marketing pieces disguised as educational content
- Resources we can't actually access

### 4. We Figure Out If It's Free

We prioritize free resources because we want learning to be accessible. But we also track paid resources separately—sometimes they're worth it.

**Our rule is simple:** if you need to pay to get the full value, it's paid. This includes:
- Courses with free intros but paywalled main content
- "Free trials" that require payment afterward
- Articles where the key sections are behind a paywall

### 5. We Classify It

Every resource gets tagged with:

**Category** — What topic does it cover?
- AI Fundamentals (core concepts)
- AI Product Strategy (PM-specific skills)
- Technical Skills (prompt engineering, prototyping)
- Business & Economics (pricing, costs, moats)
- Go-to-Market (distribution, launch)
- Career (landing AI PM roles)

**Level** — Who is it for?
- Beginner: New to AI, basic PM knowledge
- Intermediate: Some AI familiarity, experienced PM
- Expert: Significant AI product experience

**Format** — What kind of content is it?
- Article, Course, Video, Audio, Book, Repository, or Reference

**Content Type** — How quickly might it become outdated?
- Tool-Specific: 3-month review cycle
- Model-Dependent: 4-month review cycle
- Pricing/Career: 6-month review cycle
- Conceptual: 12-month review cycle

### 6. We Write a Summary

For each resource, we write a 2-3 paragraph summary explaining:
- What's the main idea?
- What will you actually learn?
- Why should a PM care?

No marketing language. Just honest descriptions of what you'll get.

### 7. It Goes Live

**Free resources** get added to:
- `summarized_resources.md` (detailed summaries)
- `resources.md` (categorized list)
- `learning_path.md` (if it fills a gap in our learning roadmap)

**Paid resources** only go to:
- `paid_resources.md`

### 8. We Set a Review Date

Based on the content type, we schedule when to check the resource again. A guide about a specific tool needs checking sooner than a piece about strategic frameworks.

---

## Keeping Things Fresh

Here's where we differ from most resource lists: we actively maintain what we recommend.

### Scheduled Reviews

Every resource has a "next review" date. When that date arrives, we check:

**Is it still accessible?**
- Does the URL work?
- Did it go behind a paywall?

**Is it still accurate?**
- Are the AI models mentioned still relevant?
- Are the tools and APIs still available?
- Are the pricing figures still close to reality?
- Do the screenshots match current interfaces?

**Is it still useful?**
- Does the advice align with current best practices?
- Is the author still credible in this space?

### What Happens When Issues Arise

Resources can move through different states:

**Active** → Everything checks out. Recommended.

**Flagged** → We found some concerns. It's still usable, but we're watching it closely and will review again soon.

**Legacy** → Parts are outdated. You can still learn from it, but use caution and verify information elsewhere.

**Archived** → No longer recommended. We keep it for historical reference but remove it from active lists.

A resource can also be restored if the author updates it or if we determine our concerns were overblown.

---

## How You Can Help

### Submitting Resources

Found something great? Add it to `resources/to_review/` with:
- The URL
- Any context about why you think it's valuable

That's it. We'll take it from there.

### What Makes a Good Submission

The best submissions are resources that:
- Teach something specific about AI product management
- Come from credible authors or organizations
- Provide actionable insights, not just theory
- Are accessible (preferably free)

### Reporting Issues

Notice a resource that's outdated or has broken links? Let us know. User reports help us catch problems between scheduled reviews.

---

## Why We Do It This Way

### Quality Over Quantity

We'd rather have 50 excellent resources than 500 mediocre ones. Every resource we include takes effort to maintain, so we're selective about what makes the cut.

### Transparency

All our decisions are logged. You can see why resources were rejected, when they were last reviewed, and what concerns (if any) have been flagged. Check `resources/evaluated_resources.md` for the full history.

### Accessibility First

Free resources go in the main collection. Paid resources are tracked separately. We want the learning path to be achievable without spending money.

### Honesty About Limitations

AI moves fast. We can't guarantee everything is perfect at all times. But we can promise we're actively checking and updating. When we're uncertain about a resource, we say so.

---

## Quick Reference

| If you want to... | Go here |
|-------------------|---------|
| Browse resources by category | `resources.md` |
| Follow a structured learning path | `learning_path.md` |
| Read detailed summaries | `summarized_resources.md` |
| See paid alternatives | `paid_resources.md` |
| Submit a new resource | `resources/to_review/` |
| Understand the technical details | `assessment_process.md` |

---

## Questions?

This guide covers the basics. For the complete technical specification (data models, decision trees, automation opportunities), see `assessment_process.md`.

For everything else, just ask.
