import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ eyebrow, title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="label-caps mb-2 text-brass">{eyebrow}</p>
        )}
        <h1 className="font-serif text-[32px] leading-tight text-ink sm:text-[38px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-[15px] text-muted">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
