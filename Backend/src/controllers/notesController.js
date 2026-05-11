import { supabase } from '../utils/supabase.js';
import { generateEmbedding } from '../services/aiService.js';
import { SEARCH_THRESHOLD, SEARCH_COUNT } from '../config/config.js';
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
/*

export const searchNotes = async (c) => {
    try {
        const { query } = await c.req.json(); // User ne kya search kiya (e.g. "Dessert")

        // 1. Search query ko Vector mein badlo
        const queryEmbedding = await generateEmbedding(query);

        // 2. Supabase Function (match_notes) ko call karo
        const { data, error } = await supabase.rpc('match_notes', {
            query_embedding: queryEmbedding,
            match_threshold: 0.4, // 30% se zyada match hone wale dikhao
            match_count: SEARCH_COUNT,       // Top 5 matches dikhao
        });

        if (error) throw error;

        // 3. Results wapas bhejo
        return c.json({ success: true, data });
    } catch (err) {
        return c.json({ success: false, error: err.message }, 500);
    }
};

*/





export const searchNotes = async (c) => {
  try {
    const { query } = await c.req.json();
    console.log(`\n🔎 Postman Query: "${query}"`);

    // 1. Vector banao (Ollama 768 dimensions generate karega)
    const queryEmbedding = await generateEmbedding(query);

    // 2. LIVE REPORT (Technical Saboot: Index Scan dekhne ke liye)
    const { data: report } = await supabase.rpc('get_search_report', {
      query_embedding: queryEmbedding,
      match_threshold: SEARCH_THRESHOLD,
      match_count: SEARCH_COUNT
    });

    if (report) {
      console.log("📊 --- DATABASE SCAN REPORT ---");
      report.forEach(row => console.log(row.query_plan));
      console.log("-------------------------------\n");
    }

    // 3. Asli Results (Database se data nikalna)
    const { data: results, error } = await supabase.rpc('match_notes', {
      query_embedding: queryEmbedding,
      match_threshold: SEARCH_THRESHOLD,
      match_count: SEARCH_COUNT,
    });

    if (error) throw error;

    // 4. TERMINAL LOGS: Match Percentage check karne ke liye
    console.log(`✨ Found ${results?.length || 0} relevant notes:`);
    if (results && results.length > 0) {
      results.forEach((item, index) => {
        const score = (item.similarity * 100).toFixed(2);
        console.log(`${index + 1}. [${score}% Match] | ${item.content.substring(0, 60)}...`);
      });
    } else {
      console.log("⚠️  0 results found. Try lowering SEARCH_THRESHOLD in config.js or add better data.");
    }
    console.log("-------------------------------------------\n");

    return c.json({ success: true, data: results });

  } catch (err) {
    console.error("❌ Search Controller Error:", err.message);
    return c.json({ success: false, error: err.message }, 500);
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