import { Compass, Heart, Layers3, Lightbulb, Sprout, CircleHelp } from 'lucide-react';
import type { ReactNode } from 'react';

import InsightIntro from '@/components/insights/InsightIntro';
import InsightPills from '@/components/insights/InsightReadingList';
import SectionTitle from '@/components/common/SectionTitle';
import type { PatternReview } from '../types/patternReview';
import { devComponentAttrs } from '@/lib/devtools';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type PatternReviewCardProps = {
  review: PatternReview;
};

type InsightSectionProps = {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

function InsightSection({
  title,
  icon,
  children,
  className = 'rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm',
  contentClassName = 'mt-3',
}: InsightSectionProps) {
  return (
    <section className={className} {...devComponentAttrs('InsightSection')}>
      {title && icon ? (
        <SectionTitle icon={icon} className="text-sm">
          {title}
        </SectionTitle>
      ) : null}

      <div className={title && icon ? contentClassName : undefined}>{children}</div>
    </section>
  );
}

function InsightList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No details available yet.</p>;
  }

  return (
    <ul className="space-y-2" {...devComponentAttrs('InsightList')}>
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-6 text-foreground/90">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InsightInfoPopover({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={label}
        >
          <CircleHelp className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="max-w-xs border-border/70 bg-popover text-popover-foreground"
      >
        <p className="text-sm leading-6 text-muted-foreground">{children}</p>
      </PopoverContent>
    </Popover>
  );
}

export function PatternReviewCard({ review }: PatternReviewCardProps) {
  return (
    <article className="space-y-6" {...devComponentAttrs('PatternReviewCard')}>
      <InsightIntro
        generatedAt={review.created_at}
        description="These patterns are invitations to reflect, not conclusions about who you are. They are here to help you notice the stories you may be returning to over time."
      />

      <InsightSection
        title="Looking Across Your Reflections"
        icon={<Compass className="h-4 w-4" />}
        contentClassName="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground/95"
      >
        {review.overview}
      </InsightSection>

      <InsightSection
        title="Another Side to Consider"
        icon={<Lightbulb className="h-4 w-4" />}
        className="rounded-xl border border-primary/25 bg-primary/10 p-5 text-card-foreground shadow-sm"
        contentClassName="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground/95"
      >
        {review.another_side}
      </InsightSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <InsightSection
          className="rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm"
          contentClassName="mt-3"
        >
          <div className="flex items-center gap-1.5">
            <SectionTitle icon={<Layers3 className="h-4 w-4" />} className="text-sm">
              Recurring Themes
            </SectionTitle>
            <InsightInfoPopover label="Learn more about recurring themes">
              These are themes Duality noticed across your recent reflections. They are not labels
              or conclusions, but gentle signals about what has been showing up repeatedly.
            </InsightInfoPopover>
          </div>
          <div className="mt-3">
            <InsightPills items={review.recurring_themes} />
          </div>
        </InsightSection>

        <InsightSection
          className="rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm"
          contentClassName="mt-3"
        >
          <div className="flex items-center gap-1.5">
            <SectionTitle icon={<Lightbulb className="h-4 w-4" />} className="text-sm">
              Possible Assumptions
            </SectionTitle>
            <InsightInfoPopover label="Learn more about possible assumptions">
              These are possible beliefs or interpretations that may be repeating across your
              reflections. They are not facts—they are prompts to ask what you may be taking for
              granted.
            </InsightInfoPopover>
          </div>
          <div className="mt-3">
            <InsightPills items={review.recurring_assumptions} />
          </div>
        </InsightSection>
      </div>

      <InsightSection
        className="rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm"
        contentClassName="mt-3"
      >
        <div className="flex items-center gap-1.5">
          <SectionTitle icon={<Heart className="h-4 w-4" />} className="text-sm">
            Recurring Emotional Patterns
          </SectionTitle>
          <InsightInfoPopover label="Learn more about recurring emotional patterns">
            These are emotional tones or shifts that appeared across multiple reflections. They may
            help you notice how certain days, situations, or assumptions affect how you feel.
          </InsightInfoPopover>
        </div>
        <div className="mt-3">
          <InsightList items={review.emotional_patterns} />
        </div>
      </InsightSection>

      <InsightSection
        title="Signs of Growth"
        icon={<Sprout className="h-4 w-4" />}
        className="rounded-xl border border-border/70 bg-background/30 p-5 text-card-foreground shadow-sm"
      >
        <InsightList items={review.signs_of_growth} />
      </InsightSection>

      <InsightSection
        title="A Question to Carry Forward"
        icon={<Compass className="h-4 w-4" />}
        className="rounded-xl border border-primary/25 bg-primary/10 p-5 text-card-foreground shadow-sm"
        contentClassName="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground/95"
      >
        {review.reflection_question}
      </InsightSection>
    </article>
  );
}
