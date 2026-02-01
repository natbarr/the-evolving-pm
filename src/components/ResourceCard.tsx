import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CATEGORIES, LEVELS, FORMATS } from "@/lib/constants";
import { truncate, getHostname } from "@/lib/utils";
import type { Resource } from "@/lib/supabase/types";

type ResourceCardProps = {
  resource: Resource;
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const category = CATEGORIES[resource.category];
  const level = LEVELS[resource.level];
  const format = FORMATS[resource.format];

  return (
    <Link href={`/resources/${resource.slug}`} className="group block h-full">
      <Card className="h-full flex flex-col group-hover:border-accent-300 transition-colors">
        <CardHeader className="flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="category">{category?.name || resource.category}</Badge>
            <Badge variant="level">{level?.name || resource.level}</Badge>
          </div>
          <CardTitle className="group-hover:text-accent-600 transition-colors line-clamp-2">
            {resource.title}
          </CardTitle>
          <CardDescription className="line-clamp-3 mt-2">
            {truncate(resource.summary, 150)}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center justify-between text-xs text-primary-500">
          <span className="flex items-center gap-1">
            <span>{format?.icon}</span>
            <span>{format?.name || resource.format}</span>
          </span>
          {resource.source && (
            <span className="truncate max-w-[150px]">
              {resource.source}
            </span>
          )}
          {!resource.source && resource.url && (
            <span className="truncate max-w-[150px]">
              {getHostname(resource.url)}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
