import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { config } from './config/config.js';
import notes from './routes/notes.route.js';

import { performSearchWithReport } from './search.js';

const app = new Hono();

app.post('/api/search', async (c) => {
    try {
        const { query } = await c.req.json();

        // Yahan humne saara logic search.js se utha liya
        const results = await performSearchWithReport(query);

        return c.json({ success: true, results });
    } catch (err) {
        return c.json({ success: false, error: err.message });
    }
});
app.get('/', (c) => c.text('Hono Server is LIVE! 🚀'));

app.route("/api/notes", notes);



serve({
    fetch: app.fetch,
    port: config.port
});