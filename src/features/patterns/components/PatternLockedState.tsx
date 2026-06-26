import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type PatternLockedStateProps = {
  completedCount: number;
};

export function PatternLockedState({ completedCount }: PatternLockedStateProps) {
  const target = 3;
  const remaining = Math.max(target - completedCount, 0);

  return (
    <section className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
      <h2 className="text-lg font-semibold">Discover Patterns</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Duality needs at least three reflections with insights before it can look for recurring
        patterns.
      </p>
      <p className="mt-3 text-sm text-foreground">You&apos;ve completed {completedCount} of 3.</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Complete {remaining} more reflection(s) to unlock your first pattern review.
      </p>
      <Button className="mt-4" asChild>
        <Link to="/reflect">Create today&apos;s reflection</Link>
      </Button>
    </section>
  );
}
