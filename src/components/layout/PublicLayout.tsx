import { Navigate, Outlet } from 'react-router';

type PublicLayoutProps = {
  isLoggedIn: boolean;
};

export default function PublicLayout({ isLoggedIn }: PublicLayoutProps) {
  if (isLoggedIn) {
    return <Navigate to="/reflection" replace />;
  }

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <p className="text-lg font-semibold">Duality</p>
        </div>
      </header>

      <Outlet />
    </div>
  );
}