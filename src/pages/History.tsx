import { useReflections } from '@/features/reflections/hooks/useReflections';

export default function HistoryPage() {
  const { data: reflections, isLoading, error } = useReflections();

  if (isLoading) {
    return <p className="p-6">Loading reflections...</p>;
  }

  if (error) {
    return <p className="p-6 text-destructive">Could not load reflections: {error.message}</p>;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Reflection History</h1>
        <p className="text-muted-foreground">A record of your previous reflections.</p>
      </div>

      {reflections.length === 0 ? (
        <p className="text-muted-foreground">No reflections yet.</p>
      ) : (
        <div className="space-y-4">
          {reflections.map((reflection) => (
            <article
              key={reflection.id}
              className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm"
            >
              <p className="mb-3 text-sm text-muted-foreground">
                {new Date(reflection.created_at).toLocaleDateString('en-ZA', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>

              <p className="leading-7">{reflection.reflection}</p>

              <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span>Sleep: {reflection.sleep_hours ?? '—'}</span>
                <span>Energy: {reflection.energy ?? '—'}</span>
                <span>Mood: {reflection.mood ?? '—'}</span>
                <span>Stress: {reflection.stress ?? '—'}</span>
                <span>Exercise: {reflection.exercise ? 'Yes' : 'No'}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
