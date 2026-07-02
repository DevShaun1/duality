import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { devComponentAttrs } from '@/lib/devtools';

type PatternLockedStateProps = {
  completedCount: number;
};

export function PatternLockedState({ completedCount }: PatternLockedStateProps) {
  const target = 3;
  const remaining = Math.max(target - completedCount, 0);

  return (
    <section className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm" {...devComponentAttrs('PatternLockedState')}>
      <h2 className="text-lg font-semibold">Discover Patterns</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        You&apos;ll unlock pattern discovery once you&apos;ve completed three reflections with insights.
      </p>
      <p className="mt-3 text-sm text-foreground">You&apos;ve completed {completedCount} of 3.</p>
      <p className="mt-1 text-sm text-muted-foreground">
        When you&apos;ve reflected {remaining} more {remaining === 1 ? 'time' : 'times'}, Duality will be able to look for patterns across your entries.
      </p>
      <Button className="mt-4" asChild>
        <Link to="/reflect">Create today&apos;s reflection</Link>
      </Button>
    </section>
  );
}
