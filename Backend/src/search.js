import { supabase } from './utils/supabase.js';
import { generateEmbedding } from './services/aiService.js';
import { config } from './config/config.js';
// Token counting ke liye imports (confirm kar lena path sahi hai)
import { countTokens, logUsage } from './services/tokenTracker.js'; 

export const performSearchWithReport = async (query, collection_name = 'default') => {
    console.log("🛠️ Step 1: Generating Vector for:", query);
    try {
        // 1. Vector banao
        const vector = await generateEmbedding(query);
        console.log("✅ Step 2: Vector Generated!");

        // --- DYNAMIC LOGIC ---
        // Config se collection ke hisaab se threshold uthao
        const currentThreshold = config.thresholds[collection_name] || config.thresholds.default;
        const currentCount = config.searchCount;

        // 2. Terminal Reporting (EXPLAIN ANALYZE)
        console.log("🛠️ Step 3: Fetching Report from Supabase...");
        const { data: report } = await supabase.rpc('get_search_report', {
            query_embedding: vector,
            match_threshold: currentThreshold, 
            match_count: currentCount
        });

        console.log(`\n🔎 LIVE SEARCH: "${query}"`);
        console.log(`📂 Collection: ${collection_name} | Threshold: ${currentThreshold}`);
        console.log("📊 --- DATABASE EXECUTION PLAN ---");
        if (report && report.length > 0) {
            report.forEach(row => console.log(row.query_plan));
        } else {
            console.log("⚠️ No report generated. Check if RPC 'get_search_report' exists.");
        }
        console.log("----------------------------------\n");

        // 3. Asli Data for Postman
        const { data: results, error } = await supabase.rpc('match_notes', {
            query_embedding: vector,
            match_threshold: currentThreshold,
            match_count: currentCount,
            collection_filter: collection_name // Agar aapka RPC collection support karta hai
        });

        if (error) throw error;

        // 4. Token Counting & Logging (For Puneet Kumar)
        const promptTokens = countTokens(query);
        // Hum pure JSON results ka token count kar rahe hain as output
        const responseTokens = countTokens(JSON.stringify(results)); 

        await logUsage("VECTOR_SEARCH", promptTokens, responseTokens, "puneet_kumar");

        return results;

    } catch (error) {
        console.error("❌ Search Error:", error.message);
        throw error;
    }
};