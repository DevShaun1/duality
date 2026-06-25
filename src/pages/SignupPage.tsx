import { AuthLayout } from '@/components/layout/AuthLayout';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { SignupForm } from '@/features/auth/components/SignupForm';
import logo from '@/assets/logo.png';

export default function SignupPage() {
  return (
    <AuthLayout>
      <div className="mb-8 flex flex-col items-center text-center">
        <img
          src={logo}
          alt="Duality Logo"
          className="mb-5 ml-5 flex justify-center"
          width={200}
        />
        <p className="text-sm uppercase tracking-[0.3em] text-teal-400">Duality</p>
        <h1 className="mt-3 text-3xl font-semibold">Discover the other side of your story</h1>
        <p className="mt-3 text-sm text-slate-400">Sign up to start your daily reflection.</p>
      </div>

      <AuthCard
        title="Create your account"
        description="Start your reflection journey with Duality."
      >
        <SignupForm />
      </AuthCard>
    </AuthLayout>
  );
}
