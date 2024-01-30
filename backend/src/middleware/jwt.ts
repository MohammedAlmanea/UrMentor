import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.jwt;
    console.log(token);
    console.log(req.cookies);
    
    
    if (!token) {
      return res.status(403).json({ error: 'Access Denied' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = verified;
    next();
  } catch (err: any ) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
