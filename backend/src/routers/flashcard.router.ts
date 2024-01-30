import express from 'express';
import { verifyToken } from '../middleware/jwt';
import { deleteFlashcard, getAllFlashcards } from '../controllers/flashcard.controller';


const router = express.Router();

router.get('/flashcards/:id',verifyToken ,getAllFlashcards);
router.delete('/flashcards/:id',verifyToken ,deleteFlashcard);

export default router;
