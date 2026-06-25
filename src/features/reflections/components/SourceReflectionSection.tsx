import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useReflectionById } from '@/features/reflections/hooks/useReflectionById';
import { Link } from 'react-router-dom';

export default function SourceReflectionSection({ reflectionId }: { reflectionId?: string }) {
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

                            <Link
                                to="/reflections"
                                className="inline-flex h-7 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium transition-colors hover:bg-muted hover:text-foreground"
                            >
                                Open your reflections
                            </Link>
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