import { supabase } from "@/lib/supabase";
import type { Reflection } from "../types/reflection";

export async function getTodaysReflection(): Promise<Reflection | null> {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const { data, error } = await supabase
    .from('reflections')
    .select('*')
    .gte('created_at', startOfToday.toISOString())
    .lt('created_at', startOfTomorrow.toISOString())
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}