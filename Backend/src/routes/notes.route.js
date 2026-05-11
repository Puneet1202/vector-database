import { Hono } from 'hono';
import { countTokens, logUsage } from '../services/tokenTracker.js';
import { 
  addNote, 
  searchNotes, // Hum iska use kar sakte hain
  updateNote, 
  deleteNote 
} from '../controllers/notesController.js';

const notes = new Hono();

// Search Route Fix
notes.post('/search', async (c) => {
    // Hono mein body aise nikaalte hain
    const body = await c.req.json();
    const { query } = body;

    if (!query) {
        return c.json({ success: false, error: "Query is required" }, 400);
    }

    // 1. Input tokens count karo
    const inputTokens = countTokens(query);

    // 2. Controller wala logic call karo (Jo aapne searchNotes mein likha hai)
    // NOTE: Agar aapka searchNotes function already database search karta hai, 
    // toh use hi call karna behtar hai.
    const searchResult = await searchNotes(c); 
    
    // searchNotes controller se data nikalne ke liye:
    const dbData = await searchResult.json();

    // 3. Output tokens count karo
    const outputTokens = countTokens(JSON.stringify(dbData.data));

    // 4. USAGE REPORT! (Ab pakka dikhega terminal par)
    logUsage("VECTOR_SEARCH", inputTokens, outputTokens);

    return c.json(dbData);
});

notes.post('/add', addNote);
notes.put('/:id', updateNote);
notes.delete('/:id', deleteNote);

export default notes;