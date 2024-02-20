import express from 'express';
import { verifyToken } from '../middleware/jwt';
import { createTTS, getSummary } from '../controllers/summary.controller';

const router = express.Router();

router.get('/summary/:id', verifyToken, getSummary);
router.get('/tts/:id', verifyToken, createTTS);

export default router;
