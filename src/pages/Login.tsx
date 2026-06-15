import LoginForm from '@/features/auth/components/LoginForm';
import { AuthCard } from '@/features/auth/components/AuthCard';

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-teal-400">
            Duality
          </p>
          <h1 className="mt-3 text-3xl font-semibold">
            Discover the other side of your story
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Sign in to continue your daily reflection.
          </p>
        </div>

        <AuthCard title="Welcome back" description="Enter your details to access your reflection space.">
          <LoginForm />
        </AuthCard>
      </div>
    </main>
  );
}