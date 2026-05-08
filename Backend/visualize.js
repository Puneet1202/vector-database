import sharp from 'sharp';
import { supabase } from './src/utils/supabase.js'; // 1. Supabase import zaroori hai

async function createHeatmapFromDB(noteId) {
    try {
        // 2. Database se real data uthana
        const { data, error } = await supabase
            .from('notes')
            .select('embedding')
            .eq('id', noteId)
            .single();

        if (error) throw error;
        
        // Supabase vector ko string format mein bhej sakta hai "[0.1, 0.2...]"
        // Hume use array mein convert karna hoga agar wo pehle se array nahi hai
        const embedding = typeof data.embedding === 'string' 
            ? JSON.parse(data.embedding) 
            : data.embedding;

        const size = 64; // 64x64 = 4096 dimensions
        const buffer = Buffer.alloc(size * size * 3);

        embedding.forEach((val, i) => {
            if (i >= 4096) return; // Safety check

            // Intensity logic: Jo number jitna positive hoga wo RED dikhega, 
            // jo negative hoga wo BLUE dikhega
            const intensity = Math.min(Math.max((val + 1) * 128, 0), 255);
            
            const pos = i * 3;
            buffer[pos] = intensity;           // Red (Positive impact)
            buffer[pos + 1] = 50;              // Green (Dim rakhna hai)
            buffer[pos + 2] = 255 - intensity; // Blue (Negative impact)
        });

        // 3. Image generate karna
        await sharp(buffer, { raw: { width: size, height: size, channels: 3 } })
            .resize(512, 512, { kernel: 'nearest' }) 
            .toFile(`note_${noteId}_heatmap.png`);

        console.log(`✅ Note ID ${noteId} ka heatmap ban gaya: note_${noteId}_heatmap.png`);

    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}

// 4. Run karo (ID change kar sakte ho check karne ke liye)
createHeatmapFromDB(4);