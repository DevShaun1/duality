import { useState } from 'react';
import CompletedReflectionCard from '@/features/reflections/components/CompletedReflectionCard';
import { ReflectionForm } from '@/features/reflections/components/ReflectionForm';
import FullScreenLoader from '@/components/common/FullScreenLoader';
import { useTodaysReflection } from '@/features/reflections/hooks/useTodaysReflection';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';

export default function Reflection() {
  const [isEditingTodaysReflection, setIsEditingTodaysReflection] = useState(false);
  const { data: todaysReflection, isLoading } = useTodaysReflection();
  const hasCompletedTodaysReflection = Boolean(todaysReflection);
  const shouldShowReflectionForm = !hasCompletedTodaysReflection || isEditingTodaysReflection;

  if (isLoading) return <FullScreenLoader />;

  return (
    <PageContainer>
      <PageHeader
        title={hasCompletedTodaysReflection ? 'Refine today’s reflection' : 'Today’s Reflection'}
        description={
          hasCompletedTodaysReflection
            ? 'Your day may have shifted since you first reflected. Update anything that feels clearer now.'
            : 'Take a few moments to reflect on your day. Every story has another side.'
        }
      />

      {shouldShowReflectionForm ? (
        <ReflectionForm
          todaysReflection={todaysReflection}
          onSaved={() => setIsEditingTodaysReflection(false)}
        />
      ) : (
        <CompletedReflectionCard onEditReflection={() => setIsEditingTodaysReflection(true)} />
      )}
    </PageContainer>
  );
}
