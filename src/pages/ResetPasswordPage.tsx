import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { supabase } from '@/lib/supabase';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(8, 'Please confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setAuthError(
          'Your password reset link is invalid or has expired. Please request a new one.'
        );
      }

      setIsReady(true);
    });
  }, []);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setAuthError(null);

    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    setIsPasswordUpdated(true);

    setTimeout(() => {
      navigate('/reflect', { replace: true });
    }, 1500);
  };

  if (!isReady) {
    return <p className="p-6">Preparing password reset...</p>;
  }

  return (
    <PageContainer>
      <div className="mx-auto max-w-md">
        <PageHeader
          title="Create a new password"
          description="Enter a new password for your Duality account."
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 rounded-lg border bg-card p-6 shadow-sm"
        >
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {authError && <p className="text-sm text-destructive">{authError}</p>}

          {isPasswordUpdated && (
            <p className="rounded-md border border-teal-500/30 bg-teal-500/10 p-3 text-sm text-teal-300">
              Your password has been updated. Redirecting you now...
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || Boolean(authError) || isPasswordUpdated}
            className="w-full"
          >
            {isSubmitting ? 'Updating password...' : 'Update password'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Need a new reset link?{' '}
            <Link to="/forgot-password" className="text-teal-400 hover:text-teal-300">
              Request one here
            </Link>
          </p>
        </form>
      </div>
    </PageContainer>
  );
}
