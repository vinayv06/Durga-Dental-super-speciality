import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://ilyrmcrzotewmmckkbku.supabase.co';

export const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_YG7PxcuOJgHW9hn7kgFdDw_Lmpri3CK';

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
