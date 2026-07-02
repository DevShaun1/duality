import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, Pencil, Sparkles } from 'lucide-react';
import { devComponentAttrs } from '@/lib/devtools';

type CompletedReflectionCardProps = {
  onEditReflection: () => void;
  reflectionId?: string;
  showPostSaveState?: boolean;
};

export default function CompletedReflectionCard({
  onEditReflection,
  reflectionId,
  showPostSaveState = false,
}: CompletedReflectionCardProps) {
  const insightDestination = reflectionId ? `/reflections/${reflectionId}` : '/reflections';

  if (showPostSaveState) {
    return (
      <Card {...devComponentAttrs('CompletedReflectionCard')}>
        <CardHeader className="space-y-2">
          <CardTitle>Your reflection has been saved.</CardTitle>
          <CardDescription>
            Now let's leave space for another perspective to emerge.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <Button asChild className="w-full sm:w-auto">
            <Link
              to={insightDestination}
              state={{
                autoGenerateInsight: true,
              }}
            >
              Generate today's insight
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button variant="outline" onClick={onEditReflection} className="w-full sm:w-auto gap-2">
            Update reflection
            <Pencil className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-primary" />
        <div>
          <CardTitle>Today's reflection is complete</CardTitle>
          <CardDescription>
            You've already reflected today. If new insights emerged during the day, you can update
            your reflection before tomorrow.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="h-px bg-border" />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex min-h-70 flex-col rounded-lg border bg-background/40 p-6">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Pencil className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Update reflection</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Make changes or add new thoughts from your day.
            </p>
            <div className="mt-auto pt-6">
              <Button onClick={onEditReflection} className="w-full gap-2">
                Update reflection
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex min-h-70 flex-col rounded-lg border bg-background/40 p-6">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">View insight</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Discover another perspective on your reflection.
            </p>
            <div className="mt-auto pt-6">
              <Button
                variant="outline"
                asChild
                className="w-full gap-2 border-primary/60 text-primary hover:bg-primary/10 hover:text-primary"
              >
                <Link to={insightDestination}>
                  View insight
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex min-h-70 flex-col rounded-lg border bg-background/40 p-6">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">View reflections</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Browse your past reflections and insights.
            </p>
            <div className="mt-auto pt-6">
              <Button
                variant="outline"
                asChild
                className="w-full gap-2 border-primary/60 text-primary hover:bg-primary/10 hover:text-primary"
              >
                <Link to="/reflections">
                  View reflections
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
