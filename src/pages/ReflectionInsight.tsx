import FullScreenLoader from '@/components/common/FullScreenLoader';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useReflectionInsight } from '@/features/reflections/hooks/useReflectionInsight';
import { useReflectionById } from '@/features/reflections/hooks/useReflectionById';
import InsightList from '@/features/reflections/components/InsightsList';
import { Link } from 'react-router-dom';

function SourceReflectionSection({ reflectionId }: { reflectionId?: string }) {
	const { data: sourceReflection, isLoading, error } = useReflectionById(reflectionId);

	if (!reflectionId) {
		return null;
	}

	return (
		<Accordion type="single" collapsible className="rounded-lg border bg-card text-card-foreground shadow-sm">
			<AccordionItem value="source-reflection" className="border-none px-5">
				<AccordionTrigger className="py-5 no-underline hover:no-underline">
					<span className="text-left">
						<span className="block text-xs uppercase tracking-wide text-muted-foreground">
							Source reflection
						</span>
						<span className="mt-1 block text-base font-semibold">Original journal entry</span>
					</span>
				</AccordionTrigger>
				<AccordionContent>
					<div className="space-y-3">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<p className="text-sm text-muted-foreground">
								Review the journal entry that produced this insight.
							</p>

							<Button asChild variant="outline" size="sm">
								<Link to="/history">Open history</Link>
							</Button>
						</div>

						{isLoading ? (
							<p className="text-sm text-muted-foreground">Loading source reflection...</p>
						) : error ? (
							<p className="text-sm text-destructive">Could not load source reflection: {error.message}</p>
						) : sourceReflection ? (
							<article className="space-y-4 rounded-md border border-border/60 bg-muted/20 p-4">
								<p className="text-sm text-muted-foreground">
									{new Date(sourceReflection.created_at).toLocaleDateString('en-ZA', {
										day: 'numeric',
										month: 'long',
										year: 'numeric',
									})}
								</p>

								<p className="whitespace-pre-wrap leading-7">
									{sourceReflection.journal_text || 'No reflection text saved.'}
								</p>

								<div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
									<span>Sleep: {sourceReflection.sleep_hours ?? '—'}</span>
									<span>Energy: {sourceReflection.energy ?? '—'}</span>
									<span>Mood: {sourceReflection.mood ?? '—'}</span>
									<span>Stress: {sourceReflection.stress ?? '—'}</span>
									<span>Exercise: {sourceReflection.exercised ? 'Yes' : 'No'}</span>
								</div>
							</article>
						) : (
							<p className="text-sm text-muted-foreground">Source reflection not found.</p>
						)}
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}

export default function ReflectionInsight() {
	const { data: insight, isLoading, error } = useReflectionInsight();

	if (isLoading) {
		return <FullScreenLoader />;
	}

	return (
		<PageContainer>
			<PageHeader
				title="Reflection Insight"
				description="A distilled view of your latest reflection, including assumptions, themes, and alternative perspectives."
			/>

			{error ? (
				<p className="text-destructive">Could not load insight: {error.message}</p>
			) : !insight ? (
				<section className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
					<h2 className="text-lg font-semibold">No insight yet</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Submit a reflection first. Your insight will appear here once it has been generated.
					</p>
				</section>
			) : (
				<article className="space-y-6 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
					<div className="space-y-2">
						<p className="text-xs uppercase tracking-wide text-muted-foreground">Generated</p>
						<p className="text-sm text-muted-foreground">
							{new Date(insight.created_at).toLocaleDateString('en-ZA', {
								day: 'numeric',
								month: 'long',
								year: 'numeric',
							})}
						</p>
					</div>

					<section className="space-y-2">
						<h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Summary</h3>
						<p className="whitespace-pre-wrap leading-7">{insight.summary}</p>
					</section>

					<section className="space-y-2">
						<h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
							Emotional Tone
						</h3>
						<p className="leading-7">{insight.emotional_tone}</p>
					</section>

					<InsightList title="Themes" items={insight.themes ?? []} />
					<InsightList title="Possible Assumptions" items={insight.assumptions ?? []} />
					<InsightList
						title="Alternative Perspectives"
						items={insight.alternative_perspectives ?? []}
					/>

					<section className="rounded-md border border-primary/20 bg-primary/5 p-4">
						<h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
							Reflection Question
						</h3>
						<p className="mt-2 leading-7">{insight.reflection_question}</p>
					</section>

					<SourceReflectionSection reflectionId={insight.reflection_id} />
				</article>
			)}
		</PageContainer>
	);
}
