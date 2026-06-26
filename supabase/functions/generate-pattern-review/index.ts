import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

type GeneratePatternReviewPayload = {
    reflectionIds: string[];
};

type PatternReviewPayload = {
    overview: string;
    recurring_themes: string[];
    emotional_patterns: string[];
    recurring_assumptions: string[];
    signs_of_growth: string[];
    another_side: string;
    reflection_question: string;
};

type ReflectionRow = {
    id: string;
    user_id: string;
    reflection_date: string;
    created_at: string;
    sleep_hours: number;
    mood: number;
    energy: number;
    stress: number;
    exercised: boolean;
    journal_text: string;
    reflection_insights:
    | {
        id: string;
        summary: string;
        emotional_tone: string;
        themes: string[];
        assumptions: string[];
        alternative_perspectives: string[];
        reflection_question: string;
    }[]
    | {
        id: string;
        summary: string;
        emotional_tone: string;
        themes: string[];
        assumptions: string[];
        alternative_perspectives: string[];
        reflection_question: string;
    }
    | null;
};

type PatternReviewRow = {
    id: string;
    user_id: string;
    created_at: string;
    reflection_ids: string[];
    overview: string;
    recurring_themes: string[];
    emotional_patterns: string[];
    recurring_assumptions: string[];
    signs_of_growth: string[];
    another_side: string;
    reflection_question: string;
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
const openAiApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: unknown, status = 200) {
    return Response.json(body, {
        status,
        headers: corsHeaders,
    });
}

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
}

if (!openAiApiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
    apiKey: openAiApiKey,
});

function isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function hasUniqueItems(values: string[]): boolean {
    return new Set(values).size === values.length;
}

function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isPatternReviewPayload(value: unknown): value is PatternReviewPayload {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const payload = value as Record<string, unknown>;

    return (
        typeof payload.overview === 'string' &&
        isStringArray(payload.recurring_themes) &&
        isStringArray(payload.emotional_patterns) &&
        isStringArray(payload.recurring_assumptions) &&
        isStringArray(payload.signs_of_growth) &&
        typeof payload.another_side === 'string' &&
        typeof payload.reflection_question === 'string'
    );
}

function getInsightFromRow(row: ReflectionRow) {
    const rawInsight = row.reflection_insights;

    if (!rawInsight) {
        return null;
    }

    if (Array.isArray(rawInsight)) {
        return rawInsight[0] ?? null;
    }

    return rawInsight;
}

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const authorizationHeader = req.headers.get('Authorization');

        if (!authorizationHeader) {
            return jsonResponse({ error: 'Authorization header is required' }, 401);
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
                headers: {
                    Authorization: authorizationHeader,
                },
            },
        });

        const payload = (await req.json()) as GeneratePatternReviewPayload;
        const reflectionIds = payload.reflectionIds;

        if (!Array.isArray(reflectionIds)) {
            return jsonResponse({ error: 'reflectionIds must be an array' }, 400);
        }

        if (reflectionIds.length !== 3) {
            return jsonResponse({ error: 'reflectionIds must include exactly 3 ids' }, 400);
        }

        if (!reflectionIds.every((id) => typeof id === 'string' && isUuid(id))) {
            return jsonResponse({ error: 'reflectionIds must contain valid UUID strings' }, 400);
        }

        if (!hasUniqueItems(reflectionIds)) {
            return jsonResponse({ error: 'reflectionIds must contain unique ids' }, 400);
        }

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return jsonResponse({ error: 'Unauthorized' }, 401);
        }

        const { data: reflections, error: reflectionsError } = await supabase
            .from('reflections')
            .select(
                `
          id,
          user_id,
          reflection_date,
          created_at,
          sleep_hours,
          mood,
          energy,
          stress,
          exercised,
          journal_text,
          reflection_insights(
            id,
            summary,
            emotional_tone,
            themes,
            assumptions,
            alternative_perspectives,
            reflection_question
          )
        `
            )
            .eq('user_id', user.id)
            .in('id', reflectionIds)
            .returns<ReflectionRow[]>();

        if (reflectionsError) {
            return jsonResponse({ error: reflectionsError.message }, 400);
        }

        if (!reflections || reflections.length !== 3) {
            return jsonResponse({ error: 'All reflections must belong to the authenticated user' }, 400);
        }

        const reflectionsById = new Map(reflections.map((reflection) => [reflection.id, reflection]));
        const orderedReflections = reflectionIds.map((id) => reflectionsById.get(id)).filter(Boolean) as ReflectionRow[];

        if (orderedReflections.length !== 3) {
            return jsonResponse({ error: 'Could not resolve all requested reflections' }, 400);
        }

        const missingInsight = orderedReflections.some((row) => !getInsightFromRow(row));

        if (missingInsight) {
            return jsonResponse({ error: 'Each reflection must have a generated insight' }, 400);
        }

        const promptData = orderedReflections.map((row) => {
            const insight = getInsightFromRow(row);

            return {
                reflection_id: row.id,
                reflection_date: row.reflection_date,
                sleep_hours: row.sleep_hours,
                mood: row.mood,
                energy: row.energy,
                stress: row.stress,
                exercised: row.exercised,
                journal_text: row.journal_text,
                insight: insight
                    ? {
                        id: insight.id,
                        summary: insight.summary,
                        emotional_tone: insight.emotional_tone,
                        themes: insight.themes,
                        assumptions: insight.assumptions,
                        alternative_perspectives: insight.alternative_perspectives,
                        reflection_question: insight.reflection_question,
                    }
                    : null,
            };
        });

        const response = await openai.responses.create({
            model: Deno.env.get('OPENAI_MODEL') ?? 'gpt-4.1-mini',
            input: `
You are Duality, an AI reflection companion.

Your role is to help users discover the other side of their story by identifying recurring themes, emotional patterns, possible assumptions, and alternative perspectives across recent reflections.

You are not a therapist, clinician, counsellor, or mental health professional.

Do not diagnose, label, or make strong psychological claims.
Do not present assumptions as facts.
Do not tell the user what is true about them.

Use calm, grounded, tentative language.
Prefer phrases such as:
- "A recurring theme seems to be..."
- "One possible interpretation is..."
- "You may be assuming..."
- "Another perspective could be..."
- "This might be worth reflecting on..."

Avoid phrases such as:
- "You definitely..."
- "The truth is..."
- "This proves..."
- "You suffer from..."
- "You are clearly..."

Look across the following three recent reflections and their generated insights.

Identify recurring patterns that may help the user better understand the stories they are telling themselves.

Focus on:
- recurring themes
- emotional patterns
- possible recurring assumptions
- signs of growth or change
- one alternative perspective
- one reflection question

Keep the response concise, useful, and non-judgemental.
Do not overstate certainty.
Do not diagnose.

Reflections and insights:
${JSON.stringify(promptData, null, 2)}

Do not wrap the JSON in markdown.
Do not include code fences.
Do not include backticks.
Do not include any explanation before or after the JSON.
The first character must be { and the last character must be }.
Return only valid JSON in this exact shape:
{
  "overview": "A short overview of the broader pattern across these reflections.",
  "recurring_themes": [
    "Theme one",
    "Theme two"
  ],
  "emotional_patterns": [
    "Emotional pattern one",
    "Emotional pattern two"
  ],
  "recurring_assumptions": [
    "Possible assumption one",
    "Possible assumption two"
  ],
  "signs_of_growth": [
    "Growth area or positive shift one"
  ],
  "another_side": "One alternative perspective that helps the user see the recent reflections differently.",
  "reflection_question": "One reflective question for the user to sit with."
}
      `,
        });

        function parseModelJson(outputText: string): unknown {
            const cleanedOutput = outputText
                .trim()
                .replace(/^```json\s*/i, '')
                .replace(/^```\s*/i, '')
                .replace(/```$/i, '')
                .trim();

            return JSON.parse(cleanedOutput);
        }
        const parsedResponse = parseModelJson(response.output_text);

        if (!isPatternReviewPayload(parsedResponse)) {
            return jsonResponse({ error: 'Model response did not match expected format' }, 502);
        }

        const reviewPayload = {
            user_id: user.id,
            reflection_ids: reflectionIds,
            overview: parsedResponse.overview,
            recurring_themes: parsedResponse.recurring_themes,
            emotional_patterns: parsedResponse.emotional_patterns,
            recurring_assumptions: parsedResponse.recurring_assumptions,
            signs_of_growth: parsedResponse.signs_of_growth,
            another_side: parsedResponse.another_side,
            reflection_question: parsedResponse.reflection_question,
        };

        const { data: review, error: reviewError } = await supabase
            .from('pattern_reviews')
            .insert(reviewPayload)
            .select(
                `
          id,
          user_id,
          created_at,
          reflection_ids,
          overview,
          recurring_themes,
          emotional_patterns,
          recurring_assumptions,
          signs_of_growth,
          another_side,
          reflection_question
        `
            )
            .single<PatternReviewRow>();

        if (reviewError) {
            return jsonResponse({ error: reviewError.message }, 400);
        }

        return jsonResponse({ review });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return jsonResponse({ error: errorMessage }, 500);
    }
});
