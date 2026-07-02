import type { ReactNode } from 'react';
import { devComponentAttrs } from '@/lib/devtools';

type InsightShellProps = {
  children: ReactNode;
  className?: string;
};

export default function InsightShell({ children, className = 'space-y-6' }: InsightShellProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/95 p-6 text-card-foreground shadow-[0_20px_70px_rgba(0,0,0,0.35)] md:p-8" {...devComponentAttrs('InsightShell')}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="insight-ambient absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="insight-ambient insight-ambient-delayed absolute bottom-0 right-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className={`relative ${className}`}>{children}</div>
    </article>
  );
}
