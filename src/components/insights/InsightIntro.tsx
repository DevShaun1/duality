import { Sparkles } from 'lucide-react';

type InsightIntroProps = {
  generatedAt: string;
  title?: string;
  description?: string;
};

export default function InsightIntro({
  generatedAt,
  title = 'Read this with curiosity',
  description = 'Take your time with this. These insights are invitations to reflect, not conclusions about who you are.',
}: InsightIntroProps) {
  return (
    <header className="insight-reveal insight-reveal-soft">
      <div className="rounded-xl border border-dashed border-border/30 bg-background/20 p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />

            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          </div>

          <span className="shrink-0 text-sm text-muted-foreground">
            {new Date(generatedAt).toLocaleDateString('en-ZA', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        <p className="mt-5 text-base leading-8 text-foreground/95">{description}</p>
      </div>
    </header>
  );
}
