import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log("SUPABASE_URL:", SUPABASE_URL);
console.log("SUPABASE_KEY:", SUPABASE_KEY ? "OK" : "ERRO");


export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
