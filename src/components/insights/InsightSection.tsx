import type { ReactNode } from 'react';
import { clsx } from 'clsx';

type InsightSectionProps = {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
};

export default function InsightSection({
  title,
  children,
  icon,
  className,
  titleClassName,
  contentClassName,
}: InsightSectionProps) {
  const baseTitleClassName = 'flex items-center gap-2 text-base font-semibold text-foreground';

  return (
    <section className={clsx(className ?? 'space-y-2')}>
      <h3 className={clsx(baseTitleClassName, titleClassName)}>
        {icon ? <span className="text-primary">{icon}</span> : null}
        {title}
      </h3>
      <div className={contentClassName}>{children}</div>
    </section>
  );
}
