import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function CompletedReflectionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today’s reflection is complete</CardTitle>
        <CardDescription>
          You’ve already reflected today. Come back tomorrow to continue the pattern.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button asChild>
          <Link to="/history">View reflection history</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
