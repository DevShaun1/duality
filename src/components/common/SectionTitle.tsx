import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { devComponentAttrs } from '@/lib/devtools';

type SectionTitleProps = {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  iconClassName?: string;
};

export default function SectionTitle({
  icon,
  children,
  className,
  iconClassName,
}: SectionTitleProps) {
  return (
    <div className={cn('flex items-start gap-2', className)} {...devComponentAttrs('SectionTitle')}>
      {icon ? (
        <span className={cn('mt-1 shrink-0 text-primary', iconClassName)}>{icon}</span>
      ) : null}
      <h3 className="text-base font-semibold text-foreground">{children}</h3>
    </div>
  );
}
