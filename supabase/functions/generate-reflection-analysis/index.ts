import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

type GenerateInsightPayload = {
  reflectionId: string;
  reflectionText: string;
  sleepHours: number;
  energy: number;
  mood: number;
  stress: number;
  exercised: boolean;
};

type AnalysisPayload = {
  summary: string;
  mainThemes: string[];
  emotionalTone: string;
  possibleAssumptions: string[];
  alternativeInterpretations: string[];
  reflectionQuestion: string;
};

type InsightRow = {
  id: string;
  reflection_id: string;
  created_at: string;
  updated_at: string;
  summary: string;
  emotional_tone: string;
  themes: string[];
  assumptions: string[];
  alternative_perspectives: string[];
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

function isAnalysisPayload(value: unknown): value is AnalysisPayload {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const analysis = value as Record<string, unknown>;

  return (
    typeof analysis.summary === 'string' &&
    Array.isArray(analysis.mainThemes) &&
    analysis.mainThemes.every((item) => typeof item === 'string') &&
    typeof analysis.emotionalTone === 'string' &&
    Array.isArray(analysis.possibleAssumptions) &&
    analysis.possibleAssumptions.every((item) => typeof item === 'string') &&
    Array.isArray(analysis.alternativeInterpretations) &&
    analysis.alternativeInterpretations.every((item) => typeof item === 'string') &&
    typeof analysis.reflectionQuestion === 'string'
  );
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

    const {
      reflectionId,
      reflectionText,
      sleepHours,
      energy,
      mood,
      stress,
      exercised,
    } = (await req.json()) as GenerateInsightPayload;

    if (!reflectionId || !reflectionText) {
      return jsonResponse({ error: 'reflectionId and reflectionText are required' }, 400);
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const { data: reflection, error: reflectionError } = await supabase
      .from('reflections')
      .select('id')
      .eq('id', reflectionId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (reflectionError) {
      return jsonResponse({ error: reflectionError.message }, 400);
    }

    if (!reflection) {
      return jsonResponse({ error: 'Reflection not found' }, 404);
    }

    const response = await openai.responses.create({
      model: Deno.env.get('OPENAI_MODEL') ?? 'gpt-4.1-mini',
      input: `
You are Duality, a calm AI reflection companion.

You help users explore another side of their story.

Duality is:
* Reflection
* Journalling
* Self-awareness
* Personal growth
* Exploring perspectives
* Identifying themes
* Identifying assumptions

Duality is NOT:
* General-purpose ChatGPT
* Search engine
* Coding assistant
* Therapist
* Doctor
* Lawyer
* Financial advisor

Boundaries:
- Do not diagnose.
- Do not give therapy, counselling, or medical advice.
- Do not claim certainty about the user's motives.
- Use gentle, tentative language.
- Focus on themes, assumptions, alternative perspectives, and self-awareness.
- Present all observations as possibilities rather than facts.

Tone and wording:
- Write directly to the user using "you" and "your".
- Avoid referring to the person as "the user".
- Use warm, reflective, non-clinical language.
- Use tentative phrasing such as "seems", "may", "might", "could", and "one possible interpretation".
- Do not over-explain.
- Keep the summary concise and personal.
- Prefer present-reflective wording over clinical analysis.

The summary should feel like a gentle reflection back to the user, not a report about them.
Use second person.

Structured data:
Sleep: ${sleepHours} hours
Energy: ${energy}/10
Mood: ${mood}/10
Stress: ${stress}/10
Exercise: ${exercised ? 'yes' : 'no'}

User reflection:
${reflectionText}

Do not wrap the JSON in markdown.
Do not include code fences.
Do not include backticks.
Do not include any explanation before or after the JSON.
The first character must be { and the last character must be }.
Return only valid JSON in this exact shape:
{
  "summary": "string",
  "mainThemes": ["string"],
  "emotionalTone": "string",
  "possibleAssumptions": ["string"],
  "alternativeInterpretations": ["string"],
  "reflectionQuestion": "string"
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

    if (!isAnalysisPayload(parsedResponse)) {
      return jsonResponse({ error: 'Model response did not match expected format' }, 502);
    }

    const analysis = parsedResponse;

    const insightPayload = {
      reflection_id: reflectionId,
      summary: analysis.summary,
      emotional_tone: analysis.emotionalTone,
      themes: analysis.mainThemes,
      assumptions: analysis.possibleAssumptions,
      alternative_perspectives: analysis.alternativeInterpretations,
      reflection_question: analysis.reflectionQuestion,
      updated_at: new Date().toISOString(),
    };

    const selectClause =
      'id, reflection_id, created_at, updated_at, summary, emotional_tone, themes, assumptions, alternative_perspectives, reflection_question';

    const { data: existingInsight, error: existingInsightError } = await supabase
      .from('reflection_insights')
      .select('id')
      .eq('reflection_id', reflectionId)
      .maybeSingle<{ id: string }>();

    if (existingInsightError) {
      return jsonResponse({ error: existingInsightError.message }, 400);
    }

    let insight: InsightRow | null = null;
    let insightError: { message: string } | null = null;

    if (existingInsight) {
      const result = await supabase
        .from('reflection_insights')
        .update(insightPayload)
        .eq('reflection_id', reflectionId)
        .select(selectClause)
        .single<InsightRow>();

      insight = result.data;
      insightError = result.error;
    } else {
      const result = await supabase
        .from('reflection_insights')
        .insert(insightPayload)
        .select(selectClause)
        .single<InsightRow>();

      insight = result.data;
      insightError = result.error;
    }

    if (insightError) {
      return jsonResponse({ error: insightError.message }, 400);
    }

    const { error: staleError } = await supabase
      .from('reflections')
      .update({ insight_stale: false })
      .eq('id', reflectionId);

    if (staleError) {
      return jsonResponse({ error: staleError.message }, 400);
    }

    return jsonResponse({
      insight,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return jsonResponse({ error: errorMessage }, 500);
  }
});
