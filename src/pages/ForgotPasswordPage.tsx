import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { supabase } from '@/lib/supabase';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setAuthError(null);
    setIsEmailSent(false);

    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    setIsEmailSent(true);
  };

  return (
    <PageContainer>
      <div className="mx-auto max-w-md">
        <PageHeader
          title="Reset your password"
          description="Enter your email address and we'll send you a link to create a new password."
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 rounded-lg border bg-card p-6 shadow-sm"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          {authError && <p className="text-sm text-destructive">{authError}</p>}

          {isEmailSent && (
            <p className="rounded-md border border-teal-500/30 bg-teal-500/10 p-3 text-sm text-teal-300">
              If an account exists for that email, a password reset link has been sent.
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Remembered your password?{' '}
            <Link to="/login" className="text-teal-400 hover:text-teal-300">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </PageContainer>
  );
}
