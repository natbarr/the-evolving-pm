import type { Icon } from "@phosphor-icons/react";
import {
  Article,
  Video,
  GraduationCap,
  Microphone,
  Books,
  Wrench,
  GithubLogo,
  EnvelopeSimple,
  Users,
  ListBullets,
} from "@phosphor-icons/react/dist/ssr";
import type { Category, Level, Format, ContentType } from "./supabase/types";

export const CATEGORIES: Record<Category, { name: string; description: string }> = {
  "ai-fundamentals": {
    name: "AI Fundamentals",
    description:
      "Core concepts of artificial intelligence, machine learning, and large language models that every PM should understand.",
  },
  "ai-product-strategy": {
    name: "AI Product Strategy",
    description:
      "Frameworks for building AI product strategy, achieving product-market fit, and navigating the unique challenges of AI products.",
  },
  "prompt-engineering": {
    name: "Prompt Engineering",
    description:
      "Techniques for crafting effective prompts to get the best results from AI systems.",
  },
  "technical-skills": {
    name: "Technical Skills",
    description:
      "Hands-on skills for working with AI tools, APIs, and development workflows.",
  },
  "business-economics": {
    name: "Business & Economics",
    description:
      "AI product pricing, cost optimization, unit economics, and building sustainable AI businesses.",
  },
  "go-to-market": {
    name: "Go-to-Market",
    description:
      "Distribution strategies, growth loops, and market entry tactics for AI products.",
  },
  "ethics-governance": {
    name: "Ethics & Governance",
    description:
      "Responsible AI practices, bias mitigation, privacy considerations, and regulatory compliance.",
  },
  "career": {
    name: "Career",
    description:
      "Growing your career as an AI-savvy product manager in a rapidly evolving landscape.",
  },
  "tools-workflows": {
    name: "Tools & Workflows",
    description:
      "Practical tools and workflows for integrating AI into your daily product management work.",
  },
  "case-studies": {
    name: "Case Studies",
    description:
      "Real-world examples of AI product launches, pivots, and lessons learned.",
  },
};

export const LEVELS: Record<Level, { name: string; description: string }> = {
  beginner: {
    name: "Beginner",
    description: "No prior AI knowledge required. Great starting point.",
  },
  intermediate: {
    name: "Intermediate",
    description: "Some familiarity with AI concepts expected.",
  },
  expert: {
    name: "Expert",
    description: "Deep dive for experienced practitioners.",
  },
};

export const FORMATS: Record<Format, { name: string; Icon: Icon }> = {
  article:    { name: "Article",    Icon: Article },
  video:      { name: "Video",      Icon: Video },
  course:     { name: "Course",     Icon: GraduationCap },
  podcast:    { name: "Podcast",    Icon: Microphone },
  book:       { name: "Book",       Icon: Books },
  tool:       { name: "Tool",       Icon: Wrench },
  repository: { name: "Repository", Icon: GithubLogo },
  newsletter: { name: "Newsletter", Icon: EnvelopeSimple },
  community:  { name: "Community",  Icon: Users },
  reference:  { name: "Reference",  Icon: ListBullets },
};

export const CONTENT_TYPE_REVIEW_DAYS: Record<ContentType, number> = {
  "conceptual": 180,
  "tool-specific": 90,
  "model-dependent": 120,
  "pricing": 180,
  "career": 180,
  "time-sensitive": 30,
};

export const SITE_CONFIG = {
  name: "The Evolving PM",
  description:
    "A curated resource library for Product Managers navigating AI's impact on their craft.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://theevolvingpm.com",
};

export const ITEMS_PER_PAGE = 15;
