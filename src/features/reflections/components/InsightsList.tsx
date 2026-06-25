import type { ReactNode } from 'react';

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
            <ul className="space-y-2 text-sm leading-7 text-foreground">
                {items.map((item) => (
                    <li key={item} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" aria-hidden="true" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}