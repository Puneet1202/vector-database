import { supabase } from '../utils/supabase.js';
import { generateEmbedding } from '../services/aiService.js';
import { config } from '../config/config.js'; 
import { countTokens, logUsage } from '../services/tokenTracker.js';
export const addNote = async (c) => {
  try {
    const { content } = await c.req.json(); // Frontend se data lena
    // 2. AI ka kaam (Text se Vector banwao)
    // Yahan 'embedding' mein wo 4096 numbers aa jayenge
    const embedding = await generateEmbedding(content);
    console.log("Embedding Length:", embedding.length); // Yahan 4096 dikhega

    // Supabase mein normal insert
    const { data, error } = await supabase
      .from('notes')
      .insert([{ content: content, embedding: embedding }])
      .select();

    if (error) throw error;

    return c.json({ success: true, data }, 201);
  } catch (err) {
    console.error("Controller Error:", err.message);
    return c.json({ success: false, error: err.message }, 500);
  }
};

// search notes universal
export const searchNotes = async (c) => {
    try {
        const { query } = await c.req.json();

        if (!query) return c.json({ error: "Query is required" }, 400);

        console.log(`\n--- 🚀 STARTING AUTOMATIC SEARCH PROCESS ---`);
        console.log(`🔎 User Query: "${query}"`);

        // 1. Vector Generation
        const embedding = await generateEmbedding(query);
        console.log(`✅ Vector Generated! Dimensions: ${embedding.length}`);

        // --- DYNAMIC THRESHOLD LOGIC ---
        // Config se sabse chota threshold nikaalte hain taaki DB se maximum potential data mile
        const minThreshold = Math.min(...Object.values(config.thresholds));

        // 2. Fetch Database Execution Plan (EXPLAIN ANALYZE)
        const { data: report } = await supabase.rpc('get_search_report', {
            query_embedding: embedding,
            match_threshold: minThreshold, 
            match_count: config.searchCount
        });

        console.log("📊 --- DATABASE SCAN & EXECUTION PLAN ---");
        if (report) {
            report.forEach(row => console.log(`| ${row.query_plan}`));
        } else {
            console.log("⚠️ Execution plan not available.");
        }

        // 3. Actual Data Fetching (Universal Search)
        const { data: rawData, error } = await supabase.rpc('match_notes_universal', {
            query_embedding: embedding,
            match_threshold: minThreshold,
            match_count: config.searchCount
        });

        if (error) throw error;

        // --- SMART FILTERING STEP ---
        // Har result ko uski apni category ke threshold se check karte hain
        const finalResults = rawData.filter(item => {
            const requiredThreshold = config.thresholds[item.collection_name] || config.thresholds.default;
            return item.similarity >= requiredThreshold;
        });

        // 4. Detailed Results Logging (Updated to show Filtering details)
        console.log(`✨ Found ${rawData?.length || 0} raw matches | ✅ ${finalResults.length} passed Smart Filter:`);
        
        if (finalResults.length > 0) {
            finalResults.forEach((item, index) => {
                const reqT = config.thresholds[item.collection_name] || config.thresholds.default;
                console.log(`${index + 1}. [${(item.similarity * 100).toFixed(2)}% Match] | ID: ${item.id} | Collection: ${item.collection_name} (Threshold: ${reqT})`);
                console.log(`   Content Snippet: ${item.content.substring(0, 120)}...`);
            });
        } else {
            console.log("⚠️ No matches passed the category-specific thresholds.");
        }

        // 5. Token Reporting
        const inputTokens = countTokens(query);
        const outputTokens = countTokens(JSON.stringify(finalResults || []));
        
        console.log("\n--- 📊 FINAL TOKEN USAGE ---");
        console.log(`🔹 Action: UNIVERSAL_SMART_SEARCH`);
        console.log(`📥 Input: ${inputTokens} | 📤 Output: ${outputTokens}`);
        console.log(`💰 Total: ${inputTokens + outputTokens} Tokens`);
        console.log(`-------------------------------------------\n`);

        await logUsage("UNIVERSAL_SEARCH", inputTokens, outputTokens, "puneet_kumar");

        // Response mein sirf filtered (sahi) data bhej rahe hain
        return c.json({ 
            success: true, 
            count: finalResults.length,
            results: finalResults 
        }, 200);

    } catch (error) {
        console.error("❌ Search Error:", error.message);
        return c.json({ error: error.message }, 500);
    }
};


// 1. UPDATE NOTE
export const updateNote = async (c) => {
  try {
    const id = c.req.param('id');
    const { content } = await c.req.json();

    const { data, error } = await supabase
      .from('notes')
      .update({ 
        content: content, 
        is_processed: false // ZAROORI: Taki worker naya vector banaye
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return c.json({ success: true, message: "Note updated! Worker will re-index it.", data });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};




// 2. DELETE NOTE
export const deleteNote = async (c) => {
  try {
    const id = c.req.param('id');

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return c.json({ success: true, message: "Note deleted successfully!" });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
};