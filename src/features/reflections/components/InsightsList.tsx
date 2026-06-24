type InsightListProps = {
    title: string;
    items: string[];
}

export default function InsightList({ title, items }: InsightListProps) {
    if (items.length === 0) {
        return (
            <section className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">No insights available yet.</p>
            </section>
        );
    }

    return (
        <section className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-foreground">
                {items.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </section>
    );
}