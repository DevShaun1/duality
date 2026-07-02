import FullScreenLoader from '@/components/common/FullScreenLoader';
import InsightShell from '@/components/insights/InsightShell';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { PatternLockedState } from '@/features/patterns/components/PatternLockedState';
import { PatternReviewCard } from '@/features/patterns/components/PatternReviewCard';
import { useGeneratePatternReview } from '@/features/patterns/hooks/useGeneratePatternReview';
import { useLatestPatternReview } from '@/features/patterns/hooks/useLatestPatternReview';
import { useLatestReflectionInsightPairs } from '@/features/patterns/hooks/useLatestReflectionInsightPairs';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { devComponentAttrs } from '@/lib/devtools';

function areArraysEqual(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}

export default function DiscoverPatternsPage() {
  const {
    data: latestPairs,
    isLoading: isPairsLoading,
    error: latestPairsError,
  } = useLatestReflectionInsightPairs();
  const {
    data: latestReview,
    isLoading: isLatestReviewLoading,
    error: latestReviewError,
  } = useLatestPatternReview();
  const generatePatternReviewMutation = useGeneratePatternReview();
  const [generationError, setGenerationError] = useState<string | null>(null);

  const latestReflectionIds = useMemo(
    () => (latestPairs ?? []).map((pair) => pair.reflection.id),
    [latestPairs]
  );

  const hasMinimumReflections = latestReflectionIds.length === 3;
  const latestReviewMatchesCurrentSet = Boolean(
    latestReview && areArraysEqual(latestReview.reflection_ids, latestReflectionIds)
  );

  const canGenerate = hasMinimumReflections && !latestReviewMatchesCurrentSet;

  const isLoading = isPairsLoading || isLatestReviewLoading;

  const handleGenerateReview = async () => {
    if (!canGenerate) {
      return;
    }

    setGenerationError(null);

    try {
      await generatePatternReviewMutation.mutateAsync({ reflectionIds: latestReflectionIds });
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : 'We\'re having trouble looking across your reflections. Please try again.'
      );
    }
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <PageContainer {...devComponentAttrs('DiscoverPatternsPage')}>
      <PageHeader
        title="Discover Patterns"
        description="A wider look across your recent reflections, helping you notice recurring themes over time."
      />

      {latestPairsError ? (
        <p className="text-destructive">We weren't able to load your reflections: {latestPairsError.message}</p>
      ) : latestReviewError ? (
        <p className="text-destructive">
          We weren't able to load your pattern review: {latestReviewError.message}
        </p>
      ) : !hasMinimumReflections ? (
        <PatternLockedState completedCount={latestReflectionIds.length} />
      ) : (
        <section className="space-y-6">
          <InsightShell>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h2 className="text-lg font-semibold">Look across your latest reflections</h2>
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Duality has enough reflections to begin looking across your recent entries. These
                  patterns are invitations to reflect, not conclusions about who you are.
                </p>
              </div>

              <Button
                className="group shrink-0"
                onClick={handleGenerateReview}
                disabled={!canGenerate || generatePatternReviewMutation.isPending}
              >
                {generatePatternReviewMutation.isPending ? (
                  'Looking across your reflections...'
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Compass className="h-4 w-4 transition-transform group-hover:rotate-6" />
                    Look Across My Reflections
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </div>

            {latestReviewMatchesCurrentSet ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Your latest review already covers your newest three reflections. Complete another
                reflection with an insight to generate a fresh review.
              </p>
            ) : null}

            {generationError ? (
              <p className="mt-4 text-sm text-destructive">{generationError}</p>
            ) : null}
          </InsightShell>

          {latestReview ? (
            <InsightShell>
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="insight-ambient absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
                <div className="insight-ambient insight-ambient-delayed absolute bottom-0 right-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
              </div>

              <div className="relative">
                <PatternReviewCard review={latestReview} />
              </div>
            </InsightShell>
          ) : null}
        </section>
      )}
    </PageContainer>
  );
}
