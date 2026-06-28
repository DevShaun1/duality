import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CircleHelp } from 'lucide-react';

type MetricHelpProps = {
  label: string;
  description: string;
  anchors: string[];
};

export function MetricHelpPopover({ label, description, anchors }: MetricHelpProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-5 w-5 rounded-full text-muted-foreground hover:text-foreground"
          aria-label={`How to rate ${label}`}
        >
          <CircleHelp className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 space-y-3 text-sm">
        <div className="space-y-1">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <ul className="space-y-1 text-muted-foreground">
          {anchors.map((anchor) => (
            <li key={anchor}>{anchor}</li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
