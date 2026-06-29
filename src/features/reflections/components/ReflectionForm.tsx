import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { reflectionFormSchema, type ReflectionFormValues } from '../schemas/reflectionSchema';
import { useCreateReflection } from '../hooks/useCreateReflection';
import { useUpdateReflection } from '../hooks/useUpdateReflection';
import { SpeechToText } from '@/features/speech/SpeechToText';
import type { Reflection } from '../types/reflection';
import { getEnergyTone, getMoodTone, getSleepTone, getStressTone } from '../lib/ratingTones';
import { DeleteReflectionButton } from './DeleteReflectionButton';
import { MetricHelpPopover } from './MetricHelpPopover';

type ReflectionFormProps = {
  todaysReflection?: Reflection | null;
  onSaved: (savedReflectionId: string) => void;
  onDeleted?: () => void;
};

export function ReflectionForm({ todaysReflection, onSaved, onDeleted }: ReflectionFormProps) {
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
        throw new Error('We weren\'t able to save your reflection. Please try again.');
      }

      onSaved(savedReflection.id);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'We weren\'t able to save your reflection. Please try again.');
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
      <CardHeader className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">
          {isEditing ? 'Refine your reflection' : 'Write your reflection'}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Notice what stood out today, then leave space for another perspective to emerge.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleReflectionSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3 rounded-xl border border-border/40 bg-background/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="sleepHours">Sleep duration</Label>
                  <MetricHelpPopover
                    label="Sleep duration"
                    description="Enter roughly how many hours you slept last night. It does not need to be exact."
                    anchors={[
                      '< 6 hrs = Very short',
                      '6–6.9 hrs = A little short',
                      '7–9 hrs = Recommended range',
                      '> 9 hrs = Long sleep',
                    ]}
                  />
                </div>
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/30 bg-primary/10 text-xs font-medium text-primary"
                >
                  {sleepTone.label}
                </Badge>
              </div>
              <InputGroup>
                <InputGroupInput
                  id="sleepHours"
                  type="number"
                  step="0.5"
                  min="0"
                  max="12"
                  inputMode="decimal"
                  {...register('sleepHours', { valueAsNumber: true })}
                />
                <InputGroupAddon align="inline-end">hours</InputGroupAddon>
              </InputGroup>
              {errors.sleepHours && (
                <p className="text-sm text-destructive">{errors.sleepHours.message}</p>
              )}
            </div>

            <div className="space-y-3 rounded-xl border border-border/40 bg-background/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="energy">Energy level</Label>
                  <MetricHelpPopover
                    label="Energy level"
                    description="Think about your overall physical and mental energy throughout today."
                    anchors={[
                      '1 = Completely drained',
                      '5 = Fairly balanced',
                      '10 = Full of energy',
                    ]}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full border-primary/30 bg-primary/10 text-xs font-medium text-primary"
                  >
                    {energyTone.label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{energy ?? 5}/10</span>
                </div>
              </div>
              <Slider
                id="energy"
                min={1}
                max={10}
                step={1}
                value={[energy ?? 5]}
                onValueChange={([value]) => {
                  setValue('energy', value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                aria-label="Energy level rating"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>High</span>
              </div>
              {errors.energy && <p className="text-sm text-destructive">{errors.energy.message}</p>}
            </div>

            <div className="space-y-3 rounded-xl border border-border/40 bg-background/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="mood">Overall mood</Label>
                  <MetricHelpPopover
                    label="Overall mood"
                    description="Consider how positive, neutral, or low your mood felt across most of the day."
                    anchors={['1 = Very low', '5 = Neutral or mixed', '10 = Very positive']}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full border-primary/30 bg-primary/10 text-xs font-medium text-primary"
                  >
                    {moodTone.label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{mood ?? 5}/10</span>
                </div>
              </div>
              <Slider
                id="mood"
                min={1}
                max={10}
                step={1}
                value={[mood ?? 5]}
                onValueChange={([value]) => {
                  setValue('mood', value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                aria-label="Overall mood rating"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>Positive</span>
              </div>
              {errors.mood && <p className="text-sm text-destructive">{errors.mood.message}</p>}
            </div>

            <div className="space-y-3 rounded-xl border border-border/40 bg-background/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="stress">Stress level</Label>
                  <MetricHelpPopover
                    label="Stress level"
                    description="Consider how much pressure, tension, or overwhelm you felt during most of the day."
                    anchors={['1 = Very relaxed', '5 = Moderate pressure', '10 = Highly stressed']}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full border-primary/30 bg-primary/10 text-xs font-medium text-primary"
                  >
                    {stressTone.label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{stress ?? 5}/10</span>
                </div>
              </div>
              <Slider
                id="stress"
                min={1}
                max={10}
                step={1}
                value={[stress ?? 5]}
                onValueChange={([value]) => {
                  setValue('stress', value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                aria-label="Stress level rating"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Relaxed</span>
                <span>Stressed</span>
              </div>
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Reflection' : 'Reflect on Today'}
            </Button>

            {isEditing && todaysReflection ? (
              <DeleteReflectionButton
                reflectionId={todaysReflection.id}
                buttonVariant="destructive"
                buttonClassName="w-full sm:w-auto"
                onDeleted={onDeleted}
              />
            ) : null}
          </div>

          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}
