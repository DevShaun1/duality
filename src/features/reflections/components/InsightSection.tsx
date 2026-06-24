import type { ReactNode } from 'react';

type InsightSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
};

export default function InsightSection({
  title,
  children,
  className,
  titleClassName,
  contentClassName,
}: InsightSectionProps) {
  const baseTitleClassName = 'text-sm font-semibold uppercase tracking-wide text-muted-foreground';

  return (
    <section className={className ?? 'space-y-2'}>
      <h3 className={titleClassName ? `${baseTitleClassName} ${titleClassName}` : baseTitleClassName}>
        {title}
      </h3>
      <div className={contentClassName}>{children}</div>
    </section>
  );
}