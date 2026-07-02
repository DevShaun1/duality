import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { devComponentAttrs } from '@/lib/devtools';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setAuthError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setAuthError(error.message);
      return;
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setAuthError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...devComponentAttrs('LoginForm')}>
      <FieldGroup>
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-900 hover:text-slate-100"
        >
          <FcGoogle className="h-4 w-4" />
          Continue with Google
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-xs text-slate-500">or sign in with email</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        <Field>
          <FieldLabel htmlFor="email" className="text-slate-100">
            Email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className="border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus-visible:ring-teal-500"
            {...register('email')}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password" className="text-slate-100">
              Password
            </FieldLabel>
            <Link to="/forgot-password" className="text-sm text-teal-400 hover:text-teal-300">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            className="border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus-visible:ring-teal-500"
            {...register('password')}
          />
          {errors.password && <FieldError>{errors.password.message}</FieldError>}
        </Field>

        {authError && (
          <p className="rounded-md border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-300">
            {authError}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-teal-600 text-white hover:bg-teal-500"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>

        <p className="text-center text-sm text-slate-400">
          Don't yet have an account?{' '}
          <Link to="/signup" className="text-teal-400 hover:text-teal-300">
            Sign up
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}
