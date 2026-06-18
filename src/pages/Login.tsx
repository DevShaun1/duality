import { AuthLayout } from '@/components/layout/AuthLayout';
import { AuthCard } from '@/features/auth/components/AuthCard';
import LoginForm from '@/features/auth/components/LoginForm';
import logo from '@/assets/logo.png';

export default function Login() {
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

        <p className="mt-3 text-sm text-slate-400">Sign in to continue your daily reflection.</p>
      </div>

      <AuthCard
        title="Welcome back"
        description="Enter your details to access your reflection space."
      >
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
}
