import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { reflectionFormSchema, type ReflectionFormValues } from '../schemas/reflectionSchema';
import { useCreateReflection } from '../hooks/useCreateReflection';
import { useUpdateReflection } from '../hooks/useUpdateReflection';
import type { Reflection } from '../types/reflection';

type ReflectionFormProps = {
  todaysReflection?: Reflection | null;
  onSaved: () => void;
};

export function ReflectionForm({ todaysReflection, onSaved }: ReflectionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  const exercised = watch('exercise');

  const onSubmit = async (data: ReflectionFormValues) => {
    const result = todaysReflection
      ? await updateReflectionMutation.mutateAsync({
          reflectionId: todaysReflection.id,
          values: data,
        })
      : await createReflectionMutation.mutateAsync(data);

    if (result) onSaved();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Reflection</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sleepHours">Sleep hours</Label>
              <Input
                id="sleepHours"
                type="number"
                step="0.5"
                min="0"
                max="24"
                {...register('sleepHours', { valueAsNumber: true })}
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
            <Textarea
              id="reflection"
              rows={8}
              placeholder="How has your day been?"
              {...register('journalText')}
            />
            {errors.journalText && (
              <p className="text-sm text-destructive">{errors.journalText.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Reflection' : 'Reflect on Today'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
