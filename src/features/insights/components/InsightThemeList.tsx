type InsightThemeListProps = {
  themes: string[];
};

export default function InsightThemeList({ themes }: InsightThemeListProps) {
  if (themes.length === 0) {
    return <p className="mt-3 text-sm text-muted-foreground">No insights available yet.</p>;
  }

  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {themes.map((theme) => (
        <li
          key={theme}
          className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-foreground/90"
        >
          {theme}
        </li>
      ))}
    </ul>
  );
}