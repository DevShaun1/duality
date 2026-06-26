type InsightReadingListProps = {
  items: string[];
};

export default function InsightReadingList({ items }: InsightReadingListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No details available yet.</p>;
  }

  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li
          key={item}
          className="border-b border-border/40 pb-2.5 text-sm leading-6 text-foreground/90 last:border-b-0 last:pb-0"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
