import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { slugify, calculateNextReview } from "@/lib/utils";
import type { ContentType } from "@/lib/supabase/types";

const CategoryEnum = z.enum([
  "ai-fundamentals",
  "ai-product-strategy",
  "prompt-engineering",
  "technical-skills",
  "business-economics",
  "go-to-market",
  "ethics-governance",
  "career",
  "tools-workflows",
  "case-studies",
]);

const LevelEnum = z.enum(["beginner", "intermediate", "expert"]);

const FormatEnum = z.enum([
  "article",
  "video",
  "course",
  "podcast",
  "book",
  "tool",
  "repository",
  "newsletter",
  "community",
]);

const ContentTypeEnum = z.enum([
  "conceptual",
  "tool-specific",
  "model-dependent",
  "pricing",
  "career",
  "time-sensitive",
]);

const AccessTypeEnum = z.enum(["free", "paid", "freemium"]);

const StatusEnum = z.enum(["active", "archived", "rejected", "under-review"]);

const ResourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Invalid URL"),
  category: CategoryEnum,
  level: LevelEnum,
  format: FormatEnum,
  content_type: ContentTypeEnum,
  summary: z.string().min(1, "Summary is required"),
  status: StatusEnum,
  access_type: AccessTypeEnum.optional().default("free"),
  access_notes: z.string().optional(),
  confidence: z.number().int().min(1).max(5).optional().default(4),
  author: z.string().optional(),
  source: z.string().optional(),
  publication_date: z.string().optional(),
  last_verified: z.string().optional(),
  next_review: z.string().optional(),
});

// Support both flat format and metadata wrapper format
const IngestSchema = z.union([
  // Flat format: { evaluated_at, resources }
  z.object({
    evaluated_at: z.string(),
    resources: z.array(ResourceSchema).min(1, "At least one resource is required"),
  }),
  // Wrapper format: { metadata: { assessment_date }, resources }
  z.object({
    metadata: z.object({
      schema_version: z.string().optional(),
      assessment_date: z.string(),
      notes: z.string().optional(),
    }),
    resources: z.array(ResourceSchema).min(1, "At least one resource is required"),
    rejected: z.array(z.any()).optional(),
  }),
]);

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("X-API-Key");
  const expectedKey = process.env.INGEST_API_KEY;

  if (!expectedKey || apiKey !== expectedKey) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Invalid or missing API key" },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Bad Request", message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parseResult = IngestSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "Validation Error",
        message: "Invalid request body",
        details: parseResult.error.flatten(),
      },
      { status: 400 }
    );
  }

  const data = parseResult.data;

  // Extract evaluated_at from either format
  const evaluated_at = "metadata" in data
    ? data.metadata.assessment_date
    : data.evaluated_at;

  const resources = data.resources;
  const supabase = createServiceClient();

  const results: {
    url: string;
    status: "inserted" | "updated" | "error";
    slug?: string;
    error?: string;
  }[] = [];

  for (const resource of resources) {
    const slug = slugify(resource.title);

    // Use provided next_review or calculate from content_type
    const nextReview = resource.next_review ||
      calculateNextReview(resource.content_type as ContentType);

    const resourceData = {
      title: resource.title,
      slug,
      url: resource.url,
      category: resource.category,
      level: resource.level,
      format: resource.format,
      content_type: resource.content_type,
      access_type: resource.access_type,
      access_notes: resource.access_notes || null,
      summary: resource.summary,
      status: resource.status,
      confidence: resource.confidence,
      author: resource.author || null,
      source: resource.source || null,
      publication_date: resource.publication_date || null,
      date_evaluated: evaluated_at,
      last_verified: resource.last_verified || new Date().toISOString(),
      next_review: nextReview,
    };

    const { data: existing } = await supabase
      .from("resources")
      .select("id")
      .eq("url", resource.url)
      .single() as { data: { id: string } | null };

    if (existing) {
      const { error } = await supabase
        .from("resources")
        .update(resourceData as never)
        .eq("id", existing.id as string);

      if (error) {
        results.push({
          url: resource.url,
          status: "error",
          error: error.message,
        });
      } else {
        results.push({
          url: resource.url,
          status: "updated",
          slug,
        });
      }
    } else {
      const { error } = await supabase.from("resources").insert(resourceData as never);

      if (error) {
        if (error.code === "23505" && error.message.includes("slug")) {
          const uniqueSlug = `${slug}-${Date.now()}`;
          const { error: retryError } = await supabase
            .from("resources")
            .insert({ ...resourceData, slug: uniqueSlug } as never);

          if (retryError) {
            results.push({
              url: resource.url,
              status: "error",
              error: retryError.message,
            });
          } else {
            results.push({
              url: resource.url,
              status: "inserted",
              slug: uniqueSlug,
            });
          }
        } else {
          results.push({
            url: resource.url,
            status: "error",
            error: error.message,
          });
        }
      } else {
        results.push({
          url: resource.url,
          status: "inserted",
          slug,
        });
      }
    }
  }

  const inserted = results.filter((r) => r.status === "inserted").length;
  const updated = results.filter((r) => r.status === "updated").length;
  const errors = results.filter((r) => r.status === "error").length;

  return NextResponse.json({
    success: errors === 0,
    summary: {
      total: resources.length,
      inserted,
      updated,
      errors,
    },
    results,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
