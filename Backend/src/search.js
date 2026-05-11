import { supabase } from './utils/supabase.js';
import { generateEmbedding } from './services/aiService.js';
import { SEARCH_THRESHOLD, SEARCH_COUNT } from './config/config.js';

export const performSearchWithReport = async (query) => {
    console.log("🛠️ Step 1: Generating Vector for:", query); // Debug point 1
    try {
        // 1. Vector banao
        const vector = await generateEmbedding(query);
        console.log("✅ Step 2: Vector Generated!"); // Debug point 2

        // 2. Terminal Reporting (EXPLAIN ANALYZE)
        console.log("🛠️ Step 3: Fetching Report from Supabase..."); // Debug point 3
        const { data: report } = await supabase.rpc('get_search_report', {
            query_embedding: vector,
            match_threshold: SEARCH_THRESHOLD, // Kam rakha hai taaki results dikhein
            match_count: SEARCH_COUNT
        });

        console.log(`\n🔎 LIVE SEARCH: "${query}"`);
        console.log("📊 --- DATABASE EXECUTION PLAN ---");
        if (report) {
            report.forEach(row => console.log(row.query_plan));
        } else {
            console.log("⚠️ No report generated. Check if RPC exists.");
        }
        console.log("----------------------------------\n");

        // 3. Asli Data for Postman
        const { data: results } = await supabase.rpc('match_notes', {
            query_embedding: vector,
            match_threshold: SEARCH_THRESHOLD,
            match_count: SEARCH_COUNT
        });

        return results;
    } catch (error) {
        console.error("Search Error:", error.message);
        throw error;
    }
};