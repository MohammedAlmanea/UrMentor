import express from 'express';
import { uploadFile } from '../controllers/upload.controller';

const router = express.Router();

router.post('/upload', uploadFile);

export default router;
