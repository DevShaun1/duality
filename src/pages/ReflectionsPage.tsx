import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useReflections } from '@/features/reflections/hooks/useReflections';
import { Link } from 'react-router-dom';

export default function ReflectionsPage() {
  const { data: reflections, isLoading, error } = useReflections();
  const reflectionList = reflections ?? [];

  if (isLoading) {
    return <p className="p-6">Loading reflections...</p>;
  }

  if (error) {
    return <p className="p-6 text-destructive">Could not load reflections: {error.message}</p>;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Your Reflections"
        description="A gentle record of what you've noticed over time."
      />

      {reflectionList.length === 0 ? (
        <p className="text-muted-foreground">No reflections yet.</p>
      ) : (
        <div className="space-y-4">
          {reflectionList.map((reflection) => (
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

              <p className="whitespace-pre-wrap leading-7">
                {reflection.journal_text || 'No reflection text saved.'}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span>Sleep: {reflection.sleep_hours ?? '—'}</span>
                <span>Energy: {reflection.energy ?? '—'}</span>
                <span>Mood: {reflection.mood ?? '—'}</span>
                <span>Stress: {reflection.stress ?? '—'}</span>
                <span>Exercise: {reflection.exercised ? 'Yes' : 'No'}</span>
              </div>

              <div className="mt-4">
                <Link
                  to={`/reflections/${reflection.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                   {reflection.hasInsight ? 'View AI insight' : 'Generate AI insight'}
                </Link>
              </div>

              {reflection.insight ? (
                <section className="mt-5 rounded-md border border-border/70 bg-muted/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Insight</p>
                  {reflection.insight_stale ? (
                    <p className="mt-2 text-sm text-amber-600">
                      This reflection was edited after this insight was generated.
                    </p>
                  ) : null}
                  <p className="mt-2 whitespace-pre-wrap leading-7">{reflection.insight.summary}</p>
                </section>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
