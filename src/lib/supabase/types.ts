export type Category =
  | "ai-fundamentals"
  | "prompt-engineering"
  | "technical-skills"
  | "strategy-leadership"
  | "ethics-governance"
  | "career-development"
  | "tools-workflows"
  | "case-studies";

export type Level = "beginner" | "intermediate" | "expert";

export type Format =
  | "article"
  | "video"
  | "course"
  | "podcast"
  | "book"
  | "tool"
  | "newsletter"
  | "community";

export type ContentType =
  | "evergreen"
  | "model-dependent"
  | "time-sensitive"
  | "periodically-updated";

export type AccessType = "free" | "paid" | "freemium";

export type ResourceStatus = "active" | "archived" | "rejected" | "under-review";

export type SubmissionStatus = "pending" | "reviewed" | "accepted" | "rejected";

export interface Resource {
  id: string;
  title: string;
  slug: string;
  url: string;
  category: Category;
  level: Level;
  format: Format;
  content_type: ContentType;
  access_type: AccessType;
  summary: string;
  author: string | null;
  source: string | null;
  publication_date: string | null;
  status: ResourceStatus;
  confidence: number;
  date_evaluated: string;
  last_verified: string;
  next_review: string | null;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  url: string;
  submitted_by_email: string | null;
  context: string | null;
  status: SubmissionStatus;
  created_at: string;
}

export interface CategoryInfo {
  slug: string;
  name: string;
  description: string | null;
  display_order: number;
}

export interface Database {
  public: {
    Tables: {
      resources: {
        Row: Resource;
        Insert: Omit<Resource, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Resource, "id">>;
      };
      submissions: {
        Row: Submission;
        Insert: Omit<Submission, "id" | "created_at">;
        Update: Partial<Omit<Submission, "id">>;
      };
      categories: {
        Row: CategoryInfo;
        Insert: CategoryInfo;
        Update: Partial<CategoryInfo>;
      };
    };
  };
}
