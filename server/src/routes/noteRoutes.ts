import { Router } from 'express';
import { body } from 'express-validator';
import { getNotes, getNote, createNote, updateNote, deleteNote, summarizeNote } from '../controllers/noteController';
import { authMiddleware } from '../middleware/auth';
import { RequestHandler } from 'express';

const router = Router();

// Validation middleware
const noteValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
];

// Apply auth middleware to all routes
router.use(authMiddleware as RequestHandler);

// Routes
router.get('/', getNotes as RequestHandler);
router.get('/:id', getNote as RequestHandler);
router.post('/', noteValidation, createNote as RequestHandler);
router.put('/:id', noteValidation, updateNote as RequestHandler);
router.delete('/:id', deleteNote as RequestHandler);
router.post('/:id/summarize', summarizeNote as RequestHandler);

export default router; 