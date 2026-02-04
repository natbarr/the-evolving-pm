# User Accounts

## Overview
Allow users to create accounts to save/bookmark resources, track their learning progress, and receive personalized recommendations.

## Problem
Currently all users have the same anonymous experience. There's no way to:
- Save resources for later
- Track what you've already read/completed
- Get personalized recommendations based on interests
- Build a learning path

## Proposed Solution
Implement user authentication via Supabase Auth, enabling bookmarking and basic progress tracking.

## User Stories
- As a user, I want to bookmark resources so I can find them again later
- As a user, I want to mark resources as "completed" so I can track my progress
- As a user, I want to see my saved resources in one place
- As a user, I want to sign in with my Google account (easy onboarding)

## Scope

### Phase 1: Authentication + Bookmarks (MVP)
- Sign up / sign in (email or Google OAuth)
- Bookmark/unbookmark resources
- "My Bookmarks" page listing saved resources
- Bookmark button on resource cards and detail pages
- Sign out functionality

### Phase 2: Progress Tracking (Future)
- Mark resources as "completed"
- "My Progress" page showing completed resources
- Visual indicator on completed resources
- Basic stats (X resources completed, Y bookmarked)

### Phase 3: Personalization (Future)
- Onboarding flow to select interests/level
- Personalized "Recommended for You" section
- Learning paths based on category + level

### Out of Scope
- User profiles visible to others
- Social features (sharing, comments)
- Email notifications
- Admin user management UI

## Technical Approach

### Authentication (Supabase Auth)
- Enable Email + Google OAuth providers in Supabase dashboard
- Use `@supabase/ssr` for server-side session handling
- Add auth context provider to app layout
- Protected routes redirect to sign-in

### Database Schema
```sql
-- User bookmarks
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- RLS: Users can only see/manage their own bookmarks
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast lookup
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
```

### Frontend Components
- `AuthProvider` - context for auth state
- `SignInButton` / `SignOutButton` - header actions
- `BookmarkButton` - toggle bookmark on resource
- `/sign-in` page - sign in form
- `/my-bookmarks` page - list of bookmarked resources

### API Routes
- Auth handled by Supabase client (no custom API needed)
- Bookmarks managed via Supabase client with RLS

## Success Metrics
- Account creation rate (% of visitors who sign up)
- Bookmark usage (avg bookmarks per user)
- Return user rate (% of signed-in sessions)
- Feature adoption (% of users who bookmark at least 1 resource)

## Privacy Considerations
- Minimal data collection (email only, or OAuth profile)
- Users can delete their account and all associated data
- No tracking of which resources users view (only explicit actions)
- Privacy policy update required

## Estimated Effort
- Supabase Auth setup: 1-2 hours
- Database schema + RLS: 1 hour
- Auth UI (sign in/out): 3-4 hours
- Bookmark functionality: 3-4 hours
- My Bookmarks page: 2-3 hours
- Testing: 2-3 hours

**Total Phase 1: ~15-20 hours**

## Dependencies
- Supabase Auth (already available in current Supabase project)
- Google OAuth credentials (need to set up in Google Cloud Console)

## Open Questions
- Require email verification?
- Allow account deletion via UI or support request only?
- Should bookmarks be private only, or optionally shareable?
- Gate any existing features behind auth, or keep everything public?
