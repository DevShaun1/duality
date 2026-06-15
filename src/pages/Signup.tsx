import { AuthCard } from "@/features/auth/components/AuthCard";
import { SignupForm } from "@/features/auth/components/SignupForm";

export default function Signup() {
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
                Sign up to start your daily reflection.
              </p>
            </div>
    
            <AuthCard title="Create your account" description="Start your reflection journey with Duality.">
              <SignupForm />
            </AuthCard>
          </div>
        </main>
      );
}