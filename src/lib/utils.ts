import type { ContentType } from "./supabase/types";
import { CONTENT_TYPE_REVIEW_DAYS } from "./constants";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function calculateNextReview(
  contentType: ContentType,
  fromDate: Date = new Date()
): string {
  const days = CONTENT_TYPE_REVIEW_DAYS[contentType];
  const nextReview = new Date(fromDate);
  nextReview.setDate(nextReview.getDate() + days);
  return nextReview.toISOString().split("T")[0];
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return "Unknown date";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function getHostname(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
