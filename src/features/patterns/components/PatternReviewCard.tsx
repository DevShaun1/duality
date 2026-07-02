import { Compass, Heart, Layers3, Lightbulb, Sprout } from 'lucide-react';
import type { ReactNode } from 'react';

import InsightIntro from '@/components/insights/InsightIntro';
import InsightPills from '@/components/insights/InsightReadingList';
import SectionTitle from '@/components/common/SectionTitle';
import type { PatternReview } from '../types/patternReview';
import { devComponentAttrs } from '@/lib/devtools';

type PatternReviewCardProps = {
  review: PatternReview;
};

type InsightSectionProps = {
  title: string;
  icon: ReactNode;
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
      <SectionTitle icon={icon} className="text-sm">
        {title}
      </SectionTitle>

      <div className={contentClassName}>{children}</div>
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
        <InsightSection title="Recurring Themes" icon={<Layers3 className="h-4 w-4" />}>
          <InsightPills items={review.recurring_themes} />
        </InsightSection>

        <InsightSection title="Possible Assumptions" icon={<Lightbulb className="h-4 w-4" />}>
          <InsightPills items={review.recurring_assumptions} />
        </InsightSection>
      </div>

      <InsightSection title="Recurring Emotional Patterns" icon={<Heart className="h-4 w-4" />}>
        <InsightList items={review.emotional_patterns} />
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
