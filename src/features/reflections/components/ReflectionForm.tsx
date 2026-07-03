import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { reflectionFormSchema, type ReflectionFormValues } from '../schemas/reflectionSchema';
import { useCreateReflection } from '../hooks/useCreateReflection';
import { useUpdateReflection } from '../hooks/useUpdateReflection';
import { SpeechToText } from '@/features/speech/components/SpeechToText';
import type { Reflection } from '../types/reflection';
import { getEnergyTone, getMoodTone, getSleepTone, getStressTone } from '../lib/ratingTones';
import { MetricHelpPopover } from './MetricHelpPopover';
import { devComponentAttrs } from '@/lib/devtools';
import NumberStepper from '@/components/common/NumberStepper';
import ReflectionActionsMenu from './ReflectionActionsMenu';

type ReflectionFormProps = {
  todaysReflection?: Reflection | null;
  onSaved: (savedReflectionId: string) => void | Promise<void>;
  onDeleted?: () => void;
};

export function ReflectionForm({ todaysReflection, onSaved, onDeleted }: ReflectionFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const stopRecordingRef = useRef<(() => void) | null>(null);
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  const {
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
        throw new Error("We weren't able to save your reflection. Please try again.");
      }

      await onSaved(savedReflection.id);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We weren't able to save your reflection. Please try again."
      );
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
    <Card {...devComponentAttrs('ReflectionForm')}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">
            {isEditing ? "Update today's check-in" : 'Check in with yourself'}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Start with a few quick signals, then write or speak about what stood out today.
          </p>
        </div>

        {isEditing && todaysReflection ? (
          <ReflectionActionsMenu
            reflectionId={todaysReflection.id}
            isEditable={isEditing}
            showEditAction={false}
            onDeleted={() => {
              onDeleted?.();
            }}
          />
        ) : null}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleReflectionSubmit} className="space-y-6">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Daily signals</h3>
              <p className="text-xs leading-5 text-muted-foreground">
                These help Duality notice patterns between how your day felt and what you reflect
                on.
              </p>
            </div>

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
                <NumberStepper
                  value={sleepHours ?? 7}
                  min={0}
                  max={12}
                  step={0.5}
                  suffix="hours"
                  onChange={(value) =>
                    setValue('sleepHours', value, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    })
                  }
                />
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
                {errors.energy && (
                  <p className="text-sm text-destructive">{errors.energy.message}</p>
                )}
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
                      anchors={[
                        '1 = Very relaxed',
                        '5 = Moderate pressure',
                        '10 = Highly stressed',
                      ]}
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
                {errors.stress && (
                  <p className="text-sm text-destructive">{errors.stress.message}</p>
                )}
              </div>
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

          <div className="space-y-3">
            <div>
              <Label htmlFor="reflection" className="text-sm font-semibold">
                Tell the story of your day
              </Label>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Write naturally, as though you&apos;re telling a trusted friend. You do not need to
                write perfectly.
              </p>
            </div>
            <SpeechToText
              textareaId="reflection"
              textareaName="journalText"
              onRecordingControlChange={handleRecordingControlChange}
              value={journalText}
              onChange={handleJournalTextChange}
              placeholder="What happened today, and what stood out to you?"
            />
            {errors.journalText && (
              <p className="text-sm text-destructive">{errors.journalText.message}</p>
            )}
            <Collapsible
              open={isPromptOpen}
              onOpenChange={setIsPromptOpen}
              className="rounded-lg border border-border/40 bg-background/20"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                <span>Need a prompt?</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform ${isPromptOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-3 pb-3">
                <ul className="list-disc space-y-1 pl-5 text-xs leading-5 text-muted-foreground">
                  <li>What challenged you today?</li>
                  <li>What went well?</li>
                  <li>How did you feel?</li>
                  <li>What has been on your mind?</li>
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? 'Saving...' : isEditing ? 'Update reflection' : 'Complete reflection'}
            </Button>
          </div>

          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}
