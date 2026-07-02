import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NumberStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  disabled?: boolean;
  className?: string;
};

const roundToStepPrecision = (value: number, step: number) => {
  const decimalPlaces = step.toString().split('.')[1]?.length ?? 0;
  return Number(value.toFixed(decimalPlaces));
};

export default function NumberStepper({
  value,
  onChange,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  suffix,
  disabled = false,
  className,
}: NumberStepperProps) {
  const decrementValue = roundToStepPrecision(Math.max(min, value - step), step);
  const incrementValue = roundToStepPrecision(Math.min(max, value + step), step);
  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && value < max;

  const handleDecrement = () => {
    if (canDecrement) {
      onChange(decrementValue);
    }
  };

  const handleIncrement = () => {
    if (canIncrement) {
      onChange(incrementValue);
    }
  };

  return (
    <div
      className={cn(
        'flex min-h-12 items-center rounded-xl border border-input bg-background text-foreground shadow-sm',
        disabled && 'cursor-not-allowed opacity-60',
        className
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleDecrement}
        disabled={!canDecrement}
        aria-label="Decrease value"
        className="h-12 w-12 shrink-0 rounded-l-xl rounded-r-none border-r border-border/70 text-muted-foreground hover:bg-muted/60 hover:text-foreground disabled:pointer-events-none"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="flex flex-1 items-baseline justify-center gap-1 px-4 text-center">
        <span className="text-sm font-medium tabular-nums text-foreground">{value}</span>
        {suffix ? <span className="text-sm text-muted-foreground">{suffix}</span> : null}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleIncrement}
        disabled={!canIncrement}
        aria-label="Increase value"
        className="h-12 w-12 shrink-0 rounded-l-none rounded-r-xl border-l border-border/70 text-muted-foreground hover:bg-muted/60 hover:text-foreground disabled:pointer-events-none"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
