import express from 'express';
import { uploadFile } from '../controllers/upload.controller';
import { verifyToken } from '../middleware/jwt';

const router = express.Router();

router.post('/upload', verifyToken, uploadFile);

export default router;
