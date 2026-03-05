import { cn } from "@/lib/utils";

type BadgeProps = {
  variant?: "default" | "category" | "level" | "format";
  className?: string;
  children: React.ReactNode;
};

const variants = {
  default:  "bg-primary-100 text-primary-700",
  category: "bg-accent-100 text-accent-800",
  level:    "bg-primary-100 text-primary-600 border border-primary-200",
  format:   "bg-transparent text-primary-500 border border-primary-200",
};

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 font-mono text-[0.625rem] font-medium tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
