import { Funnel, Folder, MagnifyingGlass, Tray } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";

type IconType = "filter" | "folder" | "search" | "inbox";

type Action = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type EmptyStateProps = {
  icon: IconType;
  title: string;
  description: string;
  action?: Action;
  secondaryAction?: Action;
};

const iconMap: Record<IconType, React.ElementType> = {
  filter: Funnel,
  folder: Folder,
  search: MagnifyingGlass,
  inbox:  Tray,
};

function ActionButton({ action, variant = "primary" }: { action: Action; variant?: "primary" | "outline" }) {
  if (action.href) {
    return (
      <Button href={action.href} variant={variant}>
        {action.label}
      </Button>
    );
  }
  return (
    <Button onClick={action.onClick} variant={variant}>
      {action.label}
    </Button>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  const Icon = iconMap[icon];
  return (
    <div className="text-center py-16">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-primary-100 text-primary-400">
        <Icon size={28} weight="light" />
      </div>
      <h3 className="font-display text-lg font-medium text-primary-900 mb-2">{title}</h3>
      <p className="text-sm text-primary-500 max-w-md mx-auto mb-6 leading-relaxed">{description}</p>
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {action && <ActionButton action={action} />}
          {secondaryAction && <ActionButton action={secondaryAction} variant="outline" />}
        </div>
      )}
    </div>
  );
}
