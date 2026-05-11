import { supabase } from './src/utils/supabase.js'; // Apna sahi path check kar lena
import { generateEmbedding } from './src/services/aiService.js';
import { countTokens, logUsage } from './src/services/tokenTracker.js';

console.log("🕵️  CDC Worker is Live... Monitoring your Database for Changes!");

const channel = supabase
  .channel('realtime-notes')
  .on(
    'postgres_changes',
    { 
      event: '*', // UPDATE: Ab ye Insert aur Update dono sunega
      schema: 'public', 
      table: 'notes' 
    },
    async (payload) => {
      // payload.new mein naya data hota hai
      const { id, content, is_processed } = payload.new;

      console.log(`\n🔥 Signal Received! Event: ${payload.eventType} | ID: ${id}`);

      // Logic: Sirf tabhi kaam karo jab is_processed FALSE ho
      if (is_processed === false) {
        console.log(`🤖 AI Dimaag Laga Raha Hai... Embedding content for ID: ${id}`);
        
        try {
          // 1. Ollama se naya vector mangwao
          const vector = await generateEmbedding(content);
          const inputTokens = countTokens(content); 
          logUsage("EMBEDDING_GENERATION", inputTokens, 0);

          // 2. Database ko update karo naye vector ke saath aur processed ko TRUE karo
          const { error } = await supabase
            .from('notes')
            .update({ 
              embedding: vector, 
              is_processed: true 
            })
            .eq('id', id);

          if (error) {
            console.error(`❌ Error updating record ${id}:`, error.message);
          } else {
            console.log(`✅ Success! Note ${id} is now Re-indexed and TRUE.`);
          }
          const tokens = countTokens(content);
            logUsage("DATA_INDEXING_EMBEDDING", tokens, 0);

        } catch (err) {
          console.error(`❌ AI Embedding Error for ID ${id}:`, err.message);
        }
      } else {
        // Agar pehle se TRUE hai toh ignore karo (loop rokne ke liye)
        console.log(`ℹ️  Note ${id} is already processed. Skipping...`);
      }
    }
  )
  .subscribe();

// Error handling for subscription
channel.on('error', (err) => {
  console.error("❌ Supabase Realtime Error:", err);
});