import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Note, { INote } from '../models/Note';
import { summarizeText } from '../services/aiService';

// Get all notes for a user
export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find({ userId: req.user!.uid })
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Get Notes Error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

// Get a single note
export const getNote = async (req: Request, res: Response) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user!.uid
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Get Note Error:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
};

// Create a new note
export const createNote = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const note = new Note({
      userId: req.user!.uid,
      title,
      content
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error('Create Note Error:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
};

// Update a note
export const updateNote = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.uid },
      { title, content },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Update Note Error:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
};

// Delete a note
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!.uid
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete Note Error:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

// Summarize a note
export const summarizeNote = async (req: Request, res: Response) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user!.uid
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (!note.content || note.content.trim().length === 0) {
      return res.status(400).json({ error: 'Note content is empty' });
    }

    console.log('Attempting to summarize note:', {
      noteId: note._id,
      contentLength: note.content.length
    });

    const summary = await summarizeText(note.content);
    
    console.log('Successfully summarized note:', {
      noteId: note._id,
      summaryLength: summary.length
    });

    res.json({ summary });
  } catch (error: any) {
    console.error('Summarize Note Error:', {
      error: error.message,
      stack: error.stack,
      noteId: req.params.id
    });

    if (error.message.includes('GEMINI_API_KEY is not configured')) {
      return res.status(500).json({ error: 'Summarization service is not properly configured' });
    }

    if (error.message.includes('Invalid Gemini API key')) {
      return res.status(401).json({ error: 'Summarization service authentication failed' });
    }

    if (error.message.includes('rate limit')) {
      return res.status(429).json({ error: 'Too many summarization requests. Please try again later.' });
    }

    if (error.message.includes('Model not found')) {
      return res.status(500).json({ error: 'Summarization service configuration error. Please contact support.' });
    }

    if (error.message.includes('timeout')) {
      return res.status(504).json({ error: 'Summarization request timed out. Please try again.' });
    }

    if (error.message.includes('Network error')) {
      return res.status(503).json({ error: 'Unable to reach summarization service. Please try again later.' });
    }

    res.status(500).json({ 
      error: 'Failed to summarize note. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 