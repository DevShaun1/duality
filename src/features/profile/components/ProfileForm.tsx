

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { profileSchema, type ProfileFormValues } from '../schemas/profileSchema';

type ProfileFormProps = {
  defaultDisplayName?: string | null;
  onSaved?: () => void;
};

export default function ProfileForm({ defaultDisplayName = '', onSaved }: ProfileFormProps) {
  const updateProfileMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: defaultDisplayName ?? '',
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    await updateProfileMutation.mutateAsync({
      displayName: values.displayName,
    });

    onSaved?.();
  }

  const isSaving = isSubmitting || updateProfileMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName">Display name</Label>

        <Input
          id="displayName"
          placeholder="Enter your display name"
          {...register('displayName')}
        />

        {errors.displayName && (
          <p className="text-sm text-destructive">{errors.displayName.message}</p>
        )}
      </div>

      {updateProfileMutation.isError && (
        <p className="text-sm text-destructive">
          Something went wrong while saving your profile. Please try again.
        </p>
      )}

      <Button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save profile'}
      </Button>
    </form>
  );
}