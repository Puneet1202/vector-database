import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { config } from './config/config.js';
import notes from './routes/notes.route.js';

const app = new Hono();





app.get('/', (c) => c.text('Hono Server is LIVE! 🚀'));

app.route("/api/notes", notes);



serve({
    fetch: app.fetch,
    port: config.port
});