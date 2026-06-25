import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useReflections } from '@/features/reflections/hooks/useReflections';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ReflectionsPage() {
  const navigate = useNavigate();
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
                {reflection.hasInsight ? (
                  <Link
                    to={`/reflections/${reflection.id}`}
                    className="group mt-4 inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/80 hover:underline"
                  >
                    <Compass className="h-4 w-4 transition-transform group-hover:rotate-6" />
                    <span className="font-medium">Read Another Perspective</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="group mt-4 inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/80 hover:underline"
                    onClick={() =>
                      navigate(`/reflections/${reflection.id}`, {
                        state: {
                          autoGenerateInsight: true,
                        },
                      })
                    }
                  >
                    <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" />
                    <span className="font-medium">Generate AI Insight</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
