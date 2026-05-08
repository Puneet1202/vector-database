import { createClient } from '@supabase/supabase-js';
import { config } from '../config/config.js';

// Central config se settings utha rha hai
export const supabase = createClient(
    config.supabaseUrl,
    config.supabaseKey
); 