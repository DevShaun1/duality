type ReflectionMetricFeedbackProps = {
  label: string;
  value: string;
  description: string;
};

export default function ReflectionMetricFeedback({
  label,
  value,
  description,
}: ReflectionMetricFeedbackProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-primary">{label}</span>
        <span className="text-muted-foreground">{value}</span>
      </div>

      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
