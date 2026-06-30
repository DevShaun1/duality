import { useState } from 'react';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, UserCircle } from 'lucide-react';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useGetProfile } from '@/features/profile/hooks/useGetProfile';
import { signOutAndRedirect } from '@/features/auth/utils/signOutAndRedirect';
import logo from '@/assets/logo.png';

export default function TopNavigation() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const { data: profile } = useGetProfile();
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const displayName = profile?.display_name?.trim() || user?.email?.split('@')[0] || 'Profile';

  const handleSignOut = async () => {
    setIsMobileSheetOpen(false);
    await signOutAndRedirect(navigate);
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

  const mobileSheetLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
    }`;

  const mobileSheetSectionClass = 'flex flex-col gap-1';

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <NavLink
          to="/reflect"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-primary transition-colors hover:text-primary/90"
        >
          <img src={logo} alt="Duality" className="h-8 w-8" />
          <span>Duality</span>
        </NavLink>

        <nav aria-label="Primary navigation" className="hidden items-center gap-6 text-sm md:flex">
          <NavLink to="/reflect" className={navLinkClass}>
            Reflect
          </NavLink>
          <NavLink to="/reflections" className={navLinkClass}>
            Your Reflections
          </NavLink>
          <NavLink to="/discover-patterns" className={navLinkClass}>
            Discover Patterns
          </NavLink>
        </nav>

        <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              aria-label="Open mobile menu"
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="max-w-[70vw] p-0 sm:max-w-xs"
            aria-label="Mobile menu"
          >
            <SheetHeader className="border-b border-border/70 pr-14">
              <SheetTitle className="truncate">{displayName}</SheetTitle>
              <SheetDescription>Menu</SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-3 p-4">
              <nav aria-label="Mobile primary navigation" className={mobileSheetSectionClass}>
                <SheetClose asChild>
                  <NavLink to="/reflect" className={mobileSheetLinkClass}>
                    Reflect
                  </NavLink>
                </SheetClose>
                <SheetClose asChild>
                  <NavLink to="/reflections" className={mobileSheetLinkClass}>
                    Your Reflections
                  </NavLink>
                </SheetClose>
                <SheetClose asChild>
                  <NavLink to="/discover-patterns" className={mobileSheetLinkClass}>
                    Discover Patterns
                  </NavLink>
                </SheetClose>
              </nav>

              <Separator />

              <nav aria-label="Mobile account actions" className={mobileSheetSectionClass}>
                <SheetClose asChild>
                  <NavLink to="/profile" className={mobileSheetLinkClass}>
                    Profile
                  </NavLink>
                </SheetClose>
                <SheetClose asChild>
                  <NavLink to="/privacy" className={mobileSheetLinkClass}>
                    Privacy
                  </NavLink>
                </SheetClose>
              </nav>

              <Separator />

              <SheetClose asChild>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex min-h-11 items-center rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-destructive/10 hover:text-destructive"
                >
                  Sign out
                </button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open account menu"
                variant="ghost"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <UserCircle className="h-5 w-5" aria-hidden="true" />
                <span className="max-w-28 truncate">{displayName}</span>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/privacy')}>Privacy</DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-muted-foreground focus:text-destructive"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
