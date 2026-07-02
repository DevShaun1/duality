import { devComponentAttrs } from '@/lib/devtools';
type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100" {...devComponentAttrs('AuthLayout')}>
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
