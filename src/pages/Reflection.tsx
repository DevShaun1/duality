import { useState } from 'react';
import CompletedReflectionCard from '@/features/reflections/components/CompletedReflectionCard';
import { ReflectionForm } from '@/features/reflections/components/ReflectionForm';
import FullScreenLoader from '@/components/common/FullScreenLoader';
import { useTodaysReflection } from '@/features/reflections/hooks/useTodaysReflection';

export default function Reflection() {
  const [isEditingTodaysReflection, setIsEditingTodaysReflection] = useState(false);
  const { data: todaysReflection, isLoading } = useTodaysReflection();
  const hasCompletedTodaysReflection = Boolean(todaysReflection);
  const shouldShowReflectionForm = !hasCompletedTodaysReflection || isEditingTodaysReflection;

  if (isLoading) return <FullScreenLoader />;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 space-y-2">
        {shouldShowReflectionForm ? (
          <div>
            <h1 className="mb-2 text-3xl font-semibold tracking-tight">
              {hasCompletedTodaysReflection ? 'Refine today’s reflection' : 'Today’s Reflection'}
            </h1>

            <p className="mb-6 text-muted-foreground">
              {hasCompletedTodaysReflection
                ? 'Your day may have shifted since you first reflected. Update anything that feels clearer now.'
                : 'Take a few moments to reflect on your day. Every story has another side.'}
            </p>

            <ReflectionForm
              todaysReflection={todaysReflection}
              onSaved={() => setIsEditingTodaysReflection(false)}
            />
          </div>
        ) : (
          <CompletedReflectionCard onEditReflection={() => setIsEditingTodaysReflection(true)} />
        )}
      </div>
    </main>
  );
}
