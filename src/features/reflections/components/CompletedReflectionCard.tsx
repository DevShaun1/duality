import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

type CompletedReflectionCardProps = {
  onEditReflection: () => void;
};

export default function CompletedReflectionCard({
  onEditReflection,
}: CompletedReflectionCardProps) {
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

          <Button variant="outline" asChild>
            <Link to="/history">View reflection history</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
