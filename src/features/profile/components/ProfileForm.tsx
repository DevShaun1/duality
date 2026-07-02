import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { profileSchema, type ProfileFormValues } from '../schemas/profileSchema';
import { Lock } from 'lucide-react';
import { devComponentAttrs } from '@/lib/devtools';

type ProfileFormProps = {
  defaultDisplayName?: string | null;
  signedInEmail?: string;
  onSaved?: () => void;
};

export default function ProfileForm({
  defaultDisplayName = '',
  signedInEmail = '',
  onSaved,
}: ProfileFormProps) {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" {...devComponentAttrs('ProfileForm')}>
      <div className="space-y-2">
        <Label htmlFor="displayName">Display name</Label>

        <Input
          id="displayName"
          placeholder="Enter the name Duality should use"
          {...register('displayName')}
        />

        <p className="text-xs text-muted-foreground">
          This is how Duality will address you in reflections.
        </p>

        {errors.displayName && (
          <p className="text-sm text-destructive">{errors.displayName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          Sign-in email
        </Label>

        <Input id="email" readOnly aria-readonly="true" value={signedInEmail} />

        <p className="text-xs text-muted-foreground">
          This is your registered email and can&apos;t be changed here.
        </p>
      </div>

      {updateProfileMutation.isError && (
        <p className="text-sm text-destructive">
          Something went wrong while saving your profile. Please try again.
        </p>
      )}

      <Button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save name'}
      </Button>
    </form>
  );
}
