import { Hono } from 'hono';
import { addNote , searchNotes} from '../controllers/notesController.js';

const notes = new Hono();

notes.post('/add', addNote);


notes.post('/search', searchNotes);
export default notes;