import FullScreenLoader from '@/components/common/FullScreenLoader';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import SourceReflectionSection from '@/features/reflections/components/SourceReflectionSection';
import InsightSection from '@/features/reflections/components/InsightSection';
import InsightList from '@/features/reflections/components/InsightsList';
import {
	CircleHelp,
	Compass,
	Heart,
	Layers3,
	Lightbulb,
	Sparkles,
} from 'lucide-react';

import { useReflectionInsight } from '@/features/reflections/hooks/useReflectionInsight';

export default function ReflectionInsight() {
	const { data: insight, isLoading, error } = useReflectionInsight();

	if (isLoading) {
		return <FullScreenLoader />;
	}

	return (
		<PageContainer>
			<PageHeader
				title="Another Perspective"
				description="A gentle read of your latest reflection, helping you notice patterns with more clarity and self-compassion."
			/>

			{error ? (
				<p className="text-destructive">Could not load insight: {error.message}</p>
			) : !insight ? (
				<section className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
					<h2 className="text-lg font-semibold">No insight yet</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Write a reflection first. We will share another perspective here once it is ready.
					</p>
				</section>
			) : (
				<article className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/95 p-6 text-card-foreground shadow-[0_20px_70px_rgba(0,0,0,0.35)] md:p-8">
					<div className="pointer-events-none absolute inset-0" aria-hidden="true">
						<div className="insight-ambient absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
						<div className="insight-ambient insight-ambient-delayed absolute bottom-0 right-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
					</div>

					<div className="relative space-y-6 md:space-y-7">
						<header className="insight-reveal insight-reveal-soft">
							<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
								<InsightSection
									title="Read this with curiosity"
									icon={<Sparkles className="h-4 w-4" />}
									className="rounded-xl border border-dashed border-border/30 bg-background/20 p-5"
									contentClassName="mt-2 whitespace-pre-wrap text-base leading-8 text-foreground/95"
								>
									Take your time with this. These insights are invitations to reflect, not conclusions about who you are.
								</InsightSection>

								<p className="shrink-0 rounded-full border border-border/80 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground/80 md:mt-1">
									Generated{' '}
									{new Date(insight.created_at).toLocaleDateString('en-ZA', {
										day: 'numeric',
										month: 'long',
										year: 'numeric',
									})}
								</p>
							</div>
						</header>

						<div
							className="insight-reveal"
							style={{ animationDelay: '80ms' }}
						>
							<InsightSection
								title="Summary"
								icon={<Sparkles className="h-4 w-4" />}
								className="rounded-xl border border-border/70 bg-background/35 p-5"
								contentClassName="mt-2 whitespace-pre-wrap text-base leading-8 text-foreground/95"
							>
								{insight.summary}
							</InsightSection>
						</div>

						<div
							className="insight-reveal grid gap-4 md:grid-cols-2"
							style={{ animationDelay: '140ms' }}
						>
							<InsightList
								title="Main Themes"
								icon={<Layers3 className="h-4 w-4" />}
								items={insight.themes ?? []}
								className="rounded-xl border border-border/70 bg-background/35 p-5"
							/>

							<InsightSection
								title="Emotional Tone"
								icon={<Heart className="h-4 w-4" />}
								className="rounded-xl border border-border/70 bg-background/35 p-5"
								contentClassName="mt-2 text-base leading-8"
							>
								{insight.emotional_tone}
							</InsightSection>
						</div>

						<div
							className="insight-reveal"
							style={{ animationDelay: '200ms' }}
						>
							<InsightList
								title="Possible Assumptions"
								icon={<Lightbulb className="h-4 w-4" />}
								items={insight.assumptions ?? []}
								className="rounded-xl border border-border/70 bg-background/35 p-5"
							/>
						</div>

						<div
							className="insight-reveal"
							style={{ animationDelay: '260ms' }}
						>
							<InsightList
								title="Alternative Perspectives"
								icon={<Compass className="h-4 w-4" />}
								items={insight.alternative_perspectives ?? []}
								className="rounded-xl border border-border/70 bg-background/35 p-5"
							/>
						</div>

						<div
							className="insight-reveal"
							style={{ animationDelay: '320ms' }}
						>
							<InsightSection
								title="A Question to Reflect On"
								icon={<CircleHelp className="h-4 w-4" />}
								className="rounded-xl border border-primary/25 bg-primary/10 p-5"
								contentClassName="mt-2 text-base leading-8"
							>
								{insight.reflection_question}
							</InsightSection>
						</div>

						<div
							className="insight-reveal"
							style={{ animationDelay: '380ms' }}
						>
							<SourceReflectionSection reflectionId={insight.reflection_id} />
						</div>
					</div>
				</article>
			)}
		</PageContainer>
	);
}
