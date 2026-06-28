import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { reflectionFormSchema, type ReflectionFormValues } from '../schemas/reflectionSchema';
import { useCreateReflection } from '../hooks/useCreateReflection';
import { useUpdateReflection } from '../hooks/useUpdateReflection';
import { SpeechToText } from '@/features/speech/SpeechToText';
import type { Reflection } from '../types/reflection';
import { getEnergyTone, getMoodTone, getSleepTone, getStressTone } from '../lib/ratingTones';
import ReflectionMetricFeedback from './ReflectionMetricFeedback';

type ReflectionFormProps = {
  todaysReflection?: Reflection | null;
  onSaved: (savedReflectionId: string) => void;
};

export function ReflectionForm({ todaysReflection, onSaved }: ReflectionFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const stopRecordingRef = useRef<(() => void) | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ReflectionFormValues>({
    resolver: zodResolver(reflectionFormSchema),
    defaultValues: {
      sleepHours: todaysReflection?.sleep_hours ?? 7,
      energy: todaysReflection?.energy ?? 5,
      mood: todaysReflection?.mood ?? 5,
      stress: todaysReflection?.stress ?? 5,
      exercise: todaysReflection?.exercised ?? false,
      journalText: todaysReflection?.journal_text ?? '',
    },
  });

  const isEditing = Boolean(todaysReflection);

  const createReflectionMutation = useCreateReflection();
  const updateReflectionMutation = useUpdateReflection();

  const exercised = useWatch({ control, name: 'exercise' });
  const journalText = useWatch({ control, name: 'journalText' });

  const sleepHours = useWatch({ control, name: 'sleepHours' });
  const energy = useWatch({ control, name: 'energy' });
  const mood = useWatch({ control, name: 'mood' });
  const stress = useWatch({ control, name: 'stress' });

  const sleepTone = getSleepTone(sleepHours ?? 7);
  const energyTone = getEnergyTone(energy ?? 5);
  const moodTone = getMoodTone(mood ?? 5);
  const stressTone = getStressTone(stress ?? 5);

  const handleRecordingControlChange = useCallback(
    ({ isListening, stopRecording }: { isListening: boolean; stopRecording: () => void }) => {
      setIsListening((currentIsListening) =>
        currentIsListening === isListening ? currentIsListening : isListening
      );
      stopRecordingRef.current = stopRecording;
    },
    []
  );

  const handleJournalTextChange = useCallback(
    (value: string) => {
      setValue('journalText', value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const onSubmit = async (data: ReflectionFormValues) => {
    setSubmitError(null);

    // Stop recording if the user submits the form while recording is in progress
    if (isListening) {
      stopRecordingRef.current?.();
    }

    try {
      const savedReflection = todaysReflection
        ? await updateReflectionMutation.mutateAsync({
            reflectionId: todaysReflection.id,
            values: data,
          })
        : await createReflectionMutation.mutateAsync(data);

      if (!savedReflection) {
        throw new Error('Could not save reflection');
      }

      onSaved(savedReflection.id);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not save reflection');
    }
  };

  // Stop recording if the component unmounts while recording is in progress
  useEffect(() => {
    return () => {
      if (isListening) {
        stopRecordingRef.current?.();
      }
    };
  }, [isListening]);

  // React Hook Form returns an event handler here. It does not call `onSubmit` during render,
  // but the refs lint rule cannot infer that and flags the `stopRecordingRef` access inside `onSubmit`.
  // eslint-disable-next-line react-hooks/refs
  const handleReflectionSubmit = handleSubmit(onSubmit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Reflection</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleReflectionSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sleepHours">Sleep duration</Label>
              <Input
                id="sleepHours"
                type="number"
                step="0.5"
                min="0"
                max="24"
                {...register('sleepHours', { valueAsNumber: true })}
              />
              <ReflectionMetricFeedback
                label={sleepTone.label}
                value={`${sleepHours ?? 7} hours`}
                description={sleepTone.description}
              />
              {errors.sleepHours && (
                <p className="text-sm text-destructive">{errors.sleepHours.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="energy">Energy</Label>
              <Input
                id="energy"
                type="number"
                min="1"
                max="10"
                {...register('energy', { valueAsNumber: true })}
              />
              <ReflectionMetricFeedback
                label={energyTone.label}
                value={`${energy ?? 5}/10`}
                description={energyTone.description}
              />
              {errors.energy && <p className="text-sm text-destructive">{errors.energy.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood">Mood</Label>
              <Input
                id="mood"
                type="number"
                min="1"
                max="10"
                {...register('mood', { valueAsNumber: true })}
              />
              <ReflectionMetricFeedback
                label={moodTone.label}
                value={`${mood ?? 5}/10`}
                description={moodTone.description}
              />
              {errors.mood && <p className="text-sm text-destructive">{errors.mood.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stress">Stress</Label>
              <Input
                id="stress"
                type="number"
                min="1"
                max="10"
                {...register('stress', { valueAsNumber: true })}
              />
              <ReflectionMetricFeedback
                label={stressTone.label}
                value={`${stress ?? 5}/10`}
                description={stressTone.description}
              />
              {errors.stress && <p className="text-sm text-destructive">{errors.stress.message}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="exercise"
              checked={exercised}
              onCheckedChange={(checked) =>
                setValue('exercise', checked === true, {
                  shouldValidate: true,
                })
              }
            />

            <Label htmlFor="exercise">I exercised today</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reflection">Reflection</Label>
            <SpeechToText
              textareaId="reflection"
              textareaName="journalText"
              onRecordingControlChange={handleRecordingControlChange}
              value={journalText}
              onChange={handleJournalTextChange}
              placeholder="How has your day been?"
            />
            {errors.journalText && (
              <p className="text-sm text-destructive">{errors.journalText.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Reflection' : 'Reflect on Today'}
          </Button>

          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}
