import { supabase } from '../utils/supabase.js';
import { generateEmbedding } from '../services/aiService.js';
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


export const searchNotes = async (c) => {
    try {
        const { query } = await c.req.json(); // User ne kya search kiya (e.g. "Dessert")

        // 1. Search query ko Vector mein badlo
        const queryEmbedding = await generateEmbedding(query);

        // 2. Supabase Function (match_notes) ko call karo
        const { data, error } = await supabase.rpc('match_notes', {
            query_embedding: queryEmbedding,
            match_threshold: 0.4, // 30% se zyada match hone wale dikhao
            match_count: 5,       // Top 5 matches dikhao
        });

        if (error) throw error;

        // 3. Results wapas bhejo
        return c.json({ success: true, data });
    } catch (err) {
        return c.json({ success: false, error: err.message }, 500);
    }
};