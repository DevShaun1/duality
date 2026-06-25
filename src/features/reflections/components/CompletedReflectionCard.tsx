import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

type CompletedReflectionCardProps = {
  onEditReflection: () => void;
  reflectionId?: string;
};

export default function CompletedReflectionCard({
  onEditReflection,
  reflectionId,
}: CompletedReflectionCardProps) {
  const insightDestination = reflectionId ? `/reflections/${reflectionId}` : '/reflections';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today’s reflection is complete</CardTitle>
        <CardDescription>
          You’ve already reflected today. If new insights emerged during the day, you can update your reflection before tomorrow.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={onEditReflection}>
            Update today’s reflection
          </Button>

          <Button variant="secondary" asChild>
            <Link to={insightDestination}>Read your latest insight</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link to="/reflections">View your reflections</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
