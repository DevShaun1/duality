import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import SectionTitle from '@/components/common/SectionTitle';
import { devComponentAttrs } from '@/lib/devtools';

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
  return (
    <section className={clsx(className ?? 'space-y-2')} {...devComponentAttrs('InsightSection')}>
      <SectionTitle icon={icon} className={titleClassName}>
        {title}
      </SectionTitle>
      <div className={contentClassName}>{children}</div>
    </section>
  );
}
