import { cn } from '@/lib/utils';

type InsightBulletListProps = {
  items: string[];
  className?: string;
  itemClassName?: string;
  bulletClassName?: string;
};

export default function InsightBulletList({
  items,
  className,
  itemClassName,
  bulletClassName,
}: InsightBulletListProps) {
  return (
    <ul className={cn('space-y-2 text-sm leading-7 text-foreground', className)}>
      {items.map((item) => (
        <li key={item} className={cn('flex items-start gap-2', itemClassName)}>
          <span
            className={cn('ms-1 mt-2.75 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80', bulletClassName)}
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}