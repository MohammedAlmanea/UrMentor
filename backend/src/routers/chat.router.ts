import express from 'express';
import { verifyToken } from '../middleware/jwt';
import { chat } from '../controllers/chat.controller';

const router = express.Router();


router.post('/chat/:resourceId', verifyToken, chat);

export default router;
