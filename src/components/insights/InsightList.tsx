import type { ReactNode } from 'react';
import InsightBulletList from './InsightBulletList';
import SectionTitle from '@/components/common/SectionTitle';
import { devComponentAttrs } from '@/lib/devtools';

type InsightListProps = {
  title: string;
  items: string[];
  icon?: ReactNode;
  className?: string;
};

export default function InsightList({ title, items, icon, className }: InsightListProps) {
  if (items.length === 0) {
    return (
      <section className={className ?? 'space-y-3'} {...devComponentAttrs('InsightList')}>
        <SectionTitle icon={icon}>{title}</SectionTitle>
        <p className="text-sm text-muted-foreground">No insights available yet.</p>
      </section>
    );
  }

  return (
    <section className={className ?? 'space-y-3'}>
      <SectionTitle icon={icon}>{title}</SectionTitle>
      <InsightBulletList items={items} />
    </section>
  );
}
