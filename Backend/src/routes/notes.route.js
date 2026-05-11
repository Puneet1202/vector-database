import { Hono } from 'hono'; // 'Router' ki jagah 'Hono' use karo
import { 
  addNote, 
  searchNotes, 
  updateNote, 
  deleteNote 
} from '../controllers/notesController.js';

const notes = new Hono(); // Naya Hono instance banaya

// Routes define karein
notes.post('/add', addNote);
notes.post('/search', searchNotes);
notes.put('/:id', updateNote);
notes.delete('/:id', deleteNote);

export default notes;