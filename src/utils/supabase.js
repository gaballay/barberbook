import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://olzwjoklyyzzqivawqqt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_BvR9SCxTH8wIm5X0hqrYqA_7TXw5LEE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
