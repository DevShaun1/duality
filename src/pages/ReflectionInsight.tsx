import FullScreenLoader from '@/components/common/FullScreenLoader';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import SourceReflectionSection from '@/features/reflections/components/SourceReflectionSection';
import InsightSection from '@/features/reflections/components/InsightSection';
import InsightList from '@/features/reflections/components/InsightsList';

import { useReflectionInsight } from '@/features/reflections/hooks/useReflectionInsight';

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

					<InsightSection title="Summary" contentClassName="whitespace-pre-wrap leading-7">
						{insight.summary}
					</InsightSection>

					<InsightSection title="Emotional Tone" contentClassName="leading-7">
						{insight.emotional_tone}
					</InsightSection>

					<InsightList title="Themes" items={insight.themes ?? []} />
					<InsightList title="Possible Assumptions" items={insight.assumptions ?? []} />
					<InsightList
						title="Alternative Perspectives"
						items={insight.alternative_perspectives ?? []}
					/>

					<InsightSection
						title="Reflection Question"
						className="rounded-md border border-primary/20 bg-primary/5 p-4"
						contentClassName="mt-2 leading-7"
					>
						{insight.reflection_question}
					</InsightSection>

					<SourceReflectionSection reflectionId={insight.reflection_id} />
				</article>
			)}
		</PageContainer>
	);
}
