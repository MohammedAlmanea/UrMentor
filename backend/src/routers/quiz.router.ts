import express from 'express';
import { verifyToken } from '../middleware/jwt';
import { getAllQuizzes } from '../controllers/quiz.controller';

const router = express.Router();

router.get('/quiz/:id', verifyToken, getAllQuizzes);

export default router;
