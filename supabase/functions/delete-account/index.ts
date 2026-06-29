import { createClient } from '@supabase/supabase-js';

type DeleteAccountPayload = {
  confirmation?: string;
};

type ReflectionIdRow = {
  id: string;
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error(
    'Missing SUPABASE_URL, SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY environment variables'
  );
}

if (supabaseServiceRoleKey === supabaseAnonKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is misconfigured and matches SUPABASE_ANON_KEY');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const authorizationHeader = req.headers.get('Authorization');

    if (!authorizationHeader) {
      return jsonResponse({ error: 'Authorization header is required' }, 401);
    }

    const payload = (await req.json()) as DeleteAccountPayload;

    if (payload.confirmation !== 'DELETE') {
      return jsonResponse({ error: 'confirmation must be DELETE' }, 400);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authorizationHeader,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${supabaseServiceRoleKey}`,
        },
      },
    });

    const { data: reflectionRows, error: reflectionRowsError } = await adminClient
      .from('reflections')
      .select('id')
      .eq('user_id', user.id)
      .returns<ReflectionIdRow[]>();

    if (reflectionRowsError) {
      return jsonResponse(
        { error: `[delete-account/reflections-select] ${reflectionRowsError.message}` },
        400
      );
    }

    const reflectionIds = (reflectionRows ?? []).map((row) => row.id);

    if (reflectionIds.length > 0) {
      const { error: insightDeleteError } = await adminClient
        .from('reflection_insights')
        .delete()
        .in('reflection_id', reflectionIds);

      if (insightDeleteError) {
        return jsonResponse(
          { error: `[delete-account/reflection-insights-delete] ${insightDeleteError.message}` },
          400
        );
      }
    }

    const { error: patternReviewsDeleteError } = await adminClient
      .from('pattern_reviews')
      .delete()
      .eq('user_id', user.id);

    if (patternReviewsDeleteError) {
      return jsonResponse(
        { error: `[delete-account/pattern-reviews-delete] ${patternReviewsDeleteError.message}` },
        400
      );
    }

    const { error: reflectionsDeleteError } = await adminClient
      .from('reflections')
      .delete()
      .eq('user_id', user.id);

    if (reflectionsDeleteError) {
      return jsonResponse(
        { error: `[delete-account/reflections-delete] ${reflectionsDeleteError.message}` },
        400
      );
    }

    const { error: profileDeleteError } = await adminClient
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileDeleteError) {
      return jsonResponse(
        { error: `[delete-account/profiles-delete] ${profileDeleteError.message}` },
        400
      );
    }

    const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(user.id);

    if (deleteAuthError) {
      return jsonResponse(
        { error: `[delete-account/auth-delete] ${deleteAuthError.message}` },
        400
      );
    }

    return jsonResponse({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return jsonResponse({ error: errorMessage }, 500);
  }
});
