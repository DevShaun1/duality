import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, UserCircle } from 'lucide-react';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/features/auth/AuthProvider';
import { useGetProfile } from '@/features/profile/hooks/useGetProfile';
import { supabase } from '@/lib/supabase';
import logo from '@/assets/logo.png';

export default function TopNavigation() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { data: profile } = useGetProfile();

  const displayName = profile?.display_name?.trim() || 'Profile';

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error.message);
      return;
    }

    navigate('/login', { replace: true });
  };
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative transition-colors duration-200 ${
      isActive
        ? 'text-primary font-semibold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-primary'
        : 'text-muted-foreground hover:text-foreground'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <NavLink
          to="/reflection"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-primary transition-colors hover:text-primary/90"
        >
          <img src={logo} alt="Duality" className="h-8 w-8" />
          <span>Duality</span>
        </NavLink>

        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/reflection" className={navLinkClass}>
            Reflect
          </NavLink>
          <NavLink to="/history" className={navLinkClass}>
            History
          </NavLink>
          <NavLink to="/weekly-review" className={navLinkClass}>
            Weekly Review
          </NavLink>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <UserCircle className="h-5 w-5" />
                <span className="max-w-28 truncate">{displayName}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>

              <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
