import { useState } from 'react';
import CompletedReflectionCard from '@/features/reflections/components/CompletedReflectionCard';
import { ReflectionForm } from '@/features/reflections/components/ReflectionForm';
import FullScreenLoader from '@/components/common/FullScreenLoader';
import { useTodaysReflection } from '@/features/reflections/hooks/useTodaysReflection';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useGetProfile } from '@/features/profile/hooks/useGetProfile';
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile';
import { useReflections } from '@/features/reflections/hooks/useReflections';
import { devComponentAttrs } from '@/lib/devtools';

export default function ReflectionPage() {
  const [isEditingTodaysReflection, setIsEditingTodaysReflection] = useState(false);
  const [hasDismissedIntro, setHasDismissedIntro] = useState(false);
  const [lastSavedReflectionId, setLastSavedReflectionId] = useState<string | null>(null);
  const [showPostSaveState, setShowPostSaveState] = useState(false);
  const { data: todaysReflection, isLoading } = useTodaysReflection();
  const { data: profile } = useGetProfile();
  const { data: reflections, isLoading: isLoadingReflections } = useReflections();
  const updateProfileMutation = useUpdateProfile();

  const hasAnyReflections = Boolean(todaysReflection) || (reflections?.length ?? 0) > 0;
  const shouldShowIntroAlert =
    !hasDismissedIntro &&
    !isLoadingReflections &&
    !hasAnyReflections &&
    profile?.has_seen_reflection_intro === false;

  const hasCompletedTodaysReflection = Boolean(todaysReflection || lastSavedReflectionId);
  const activeReflectionId = todaysReflection?.id ?? lastSavedReflectionId;
  const reflectionHeaderDescription = hasCompletedTodaysReflection
    ? 'Your day may have shifted since you first reflected. Update anything that feels clearer now.'
    : shouldShowIntroAlert
      ? 'Take a few moments to reflect on your day.'
      : 'Take a few moments to reflect on your day. Every story has another side.';
  const shouldShowReflectionForm = !hasCompletedTodaysReflection || isEditingTodaysReflection;

  if (isLoading) return <FullScreenLoader />;

  return (
    <PageContainer {...devComponentAttrs('ReflectionPage')}>
      <PageHeader
        title={hasCompletedTodaysReflection ? 'Refine today’s reflection' : 'Today’s Reflection'}
        description={reflectionHeaderDescription}
      />

      {shouldShowReflectionForm ? (
        <div className="space-y-4">
          {shouldShowIntroAlert ? (
            <Alert className="border-border/70 bg-card/70 shadow-sm">
              <AlertTitle className="text-lg font-semibold text-foreground">
                Welcome to Duality
              </AlertTitle>
              <AlertDescription className="space-y-3">
                <p className="text-foreground">Every story has another side.</p>
                <p>
                  There are no right or wrong answers. Simply write honestly about whatever feels
                  most important to you today.
                </p>
                <p>
                  After you save your reflection, Duality will help you explore another perspective.
                  As you reflect consistently, your history can help reveal recurring themes and
                  patterns over time.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-1"
                  onClick={() => {
                    setHasDismissedIntro(true);

                    if (profile?.has_seen_reflection_intro !== true) {
                      updateProfileMutation.mutate({
                        hasSeenReflectionIntro: true,
                      });
                    }
                  }}
                >
                  Got it
                </Button>
              </AlertDescription>
            </Alert>
          ) : null}

          <ReflectionForm
            todaysReflection={todaysReflection}
            onSaved={async (savedReflectionId) => {
              setIsEditingTodaysReflection(false);
              setLastSavedReflectionId(savedReflectionId);
              setShowPostSaveState(true);
              setHasDismissedIntro(true);

              if (profile?.has_seen_reflection_intro !== true) {
                try {
                  await updateProfileMutation.mutateAsync({
                    hasSeenReflectionIntro: true,
                  });
                } catch {
                  // Reflection save succeeded, so we avoid blocking the user on profile flag persistence.
                }
              }
            }}
            onDeleted={() => {
              setIsEditingTodaysReflection(false);
              setShowPostSaveState(false);
              setLastSavedReflectionId(null);
            }}
          />
        </div>
      ) : (
        <CompletedReflectionCard
          onEditReflection={() => {
            setIsEditingTodaysReflection(true);
            setShowPostSaveState(false);
          }}
          reflectionId={activeReflectionId ?? undefined}
          showPostSaveState={showPostSaveState}
        />
      )}
    </PageContainer>
  );
}
