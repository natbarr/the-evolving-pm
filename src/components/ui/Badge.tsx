import { cn } from "@/lib/utils";

type BadgeProps = {
  variant?: "default" | "category" | "level" | "format";
  className?: string;
  children: React.ReactNode;
};

const variants = {
  default: "bg-primary-100 text-primary-700",
  category: "bg-accent-100 text-accent-800",
  level: "bg-primary-100 text-primary-700",
  format: "bg-primary-50 text-primary-600",
};

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
