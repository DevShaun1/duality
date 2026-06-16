import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { reflectionFormSchema } from '../schemas/reflectionSchema';

type ReflectionFormValues = z.infer<typeof reflectionFormSchema>;

export function ReflectionForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReflectionFormValues>({
    resolver: zodResolver(reflectionFormSchema),
    defaultValues: {
      sleepHours: 7,
      energy: 5,
      mood: 5,
      stress: 5,
      exercise: false,
      reflection: '',
    },
  });

  const exercised = watch('exercise');

  const onSubmit = (data: ReflectionFormValues) => {
    console.log(data);
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
                <p className="text-sm text-destructive">
                  {errors.sleepHours.message}
                </p>
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
              {errors.energy && (
                <p className="text-sm text-destructive">
                  {errors.energy.message}
                </p>
              )}
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
              {errors.mood && (
                <p className="text-sm text-destructive">
                  {errors.mood.message}
                </p>
              )}
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
              {errors.stress && (
                <p className="text-sm text-destructive">
                  {errors.stress.message}
                </p>
              )}
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
              {...register('reflection')}
            />
            {errors.reflection && (
              <p className="text-sm text-destructive">
                {errors.reflection.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? 'Reflecting...' : 'Reflect on Today'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}