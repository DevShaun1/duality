import { NavLink } from 'react-router-dom';
import { BookText, Layers, PenSquare, UserRound } from 'lucide-react';
import { devComponentAttrs } from '@/lib/devtools';

const links = [
  {
    to: '/reflect',
    label: 'Reflect',
    ariaLabel: 'Go to Reflect page',
    icon: PenSquare,
  },
  {
    to: '/reflections',
    label: 'Reflections',
    ariaLabel: 'Go to your reflections page',
    icon: BookText,
  },
  {
    to: '/discover-patterns',
    label: 'Patterns',
    ariaLabel: 'Go to Discover Patterns page',
    icon: Layers,
  },
  {
    to: '/profile',
    label: 'Profile',
    ariaLabel: 'Go to Profile page',
    icon: UserRound,
  },
];

export default function MobileBottomNavigation() {
  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90 md:hidden"
     {...devComponentAttrs('MobileBottomNavigation')}>
      <ul className="mx-auto grid max-w-3xl grid-cols-4 gap-1 px-2 pb-4 pt-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <li key={link.to}>
              <NavLink
                to={link.to}
                aria-label={link.ariaLabel}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center rounded-md px-1 py-2 text-[11px] font-medium transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="mt-1 leading-none">{link.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
