import express from 'express';
import { deleteResource, getResourcesByUser } from '../controllers/resource.controller';
import { verifyToken } from '../middleware/jwt';


const router = express.Router();

router.get('/resources',verifyToken ,getResourcesByUser);
router.delete('/resources/:resourceId',verifyToken ,deleteResource);

export default router;
