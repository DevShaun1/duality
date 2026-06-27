import type { ReactNode } from 'react';
import InsightBulletList from './InsightBulletList';

type InsightListProps = {
    title: string;
    items: string[];
    icon?: ReactNode;
    className?: string;
};

export default function InsightList({ title, items, icon, className }: InsightListProps) {
    if (items.length === 0) {
        return (
            <section className={className ?? 'space-y-3'}>
                <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                    {icon ? <span className="text-primary">{icon}</span> : null}
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground">No insights available yet.</p>
            </section>
        );
    }

    return (
        <section className={className ?? 'space-y-3'}>
            <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                {icon ? <span className="text-primary">{icon}</span> : null}
                {title}
            </h3>
            <InsightBulletList items={items} />
        </section>
    );
}