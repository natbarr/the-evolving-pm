import type { MetadataRoute } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import { CATEGORIES, SITE_CONFIG } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = Object.keys(CATEGORIES).map(
    (slug) => ({
      url: `${baseUrl}/categories/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  let resourcePages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createServiceClient();
    const { data: resources } = await supabase
      .from("resources")
      .select("slug, updated_at")
      .eq("status", "active") as { data: { slug: string; updated_at: string }[] | null };

    if (resources) {
      resourcePages = resources.map((resource) => ({
        url: `${baseUrl}/resources/${resource.slug}`,
        lastModified: new Date(resource.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Error generating sitemap for resources:", error);
  }

  return [...staticPages, ...categoryPages, ...resourcePages];
}
