import { supabase } from './src/utils/supabase.js';
import { generateEmbedding } from './src/services/aiService.js';

console.log("🕵️ CDC Worker is Live... Monitoring your Database!");

// Database changes sunne ka function
const channel = supabase
    .channel('realtime-notes')
    .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notes' },
        async (payload) => {
            console.log("\n🔥 WAL Signal Received (Nayi Row Aayi!)");
            
            const { id, content, embedding } = payload.new;

            // Agar embedding khali hai, toh AI ko kaam par lagao
            if (!embedding) {
                console.log(`🤖 AI Dimaag Laga Raha Hai... ID: ${id}`);
                try {
                    const vector = await generateEmbedding(content);
                    
                    const { error } = await supabase
                        .from('notes')
                        .update({ embedding: vector })
                        .eq('id', id);

                    if (!error) {
                        console.log(`✅ Success: ID ${id} is now embedded! Check your dashboard.`);
                    }
                } catch (err) {
                    console.error("❌ Worker Error:", err.message);
                }
            }
        }
    )
    .subscribe();