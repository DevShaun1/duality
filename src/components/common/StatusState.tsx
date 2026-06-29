import type { ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type StatusStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function StatusState({ title, description, action }: StatusStateProps) {
  return (
    <Card className="border-border/60 bg-card/80 shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description ? (
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </CardHeader>

      {action ? <CardContent>{action}</CardContent> : null}
    </Card>
  );
}
