import { createClient } from '@supabase/supabase-js';

// 環境変数からSupabase URLとAPIキーを取得
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("supabaseUrl and supabaseAnonKey are required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
