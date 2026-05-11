import { supabase } from '../utils/supabase.js';

// Yahan aap 'SUPABASE' ya 'MONGODB' likh sakte ho
const CURRENT_DB = 'SUPABASE'; 

export const dbWrapper = {
    async insertMany(tableName, rows) {
        if (CURRENT_DB === 'SUPABASE') {
            const { data, error } = await supabase.from(tableName).insert(rows);
            if (error) throw error;
            return data;
        }
        // Future: Yahan MongoDB ka logic add ho jayega
    }
};