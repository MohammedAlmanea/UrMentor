import express, { Request, Response } from 'express';
import passport, { session } from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '@prisma/client';
import { verifyToken } from '../middleware/jwt';

dotenv.config();

const router = express.Router();

// auth logout
router.get('/logout', (req: Request, res: Response) => {
  try {
    res.cookie('jwt', '', { maxAge: 0, httpOnly: true });
    res.status(200).json('Logout is complete the token is removed');
  } catch (error) {
    console.log(error);
  }
});

router.get('/verify', verifyToken, (req, res) => {
  res.status(200).send('Token is valid');
});

// auth with google+
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get(
  '/google/redirect',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/',
    session: false,
  }),
  (req: Request, res: Response) => {
    // redirect to frontend page
    // res.redirect('http://localhost:3000/')
    if (req.user) {
      const user = req.user as User;
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
      console.log('jwt token created');

      res.cookie('jwt', token, {
        httpOnly: true,
        // secure: true
      });
      console.log(user);
      console.log(token);

      //   res.redirect('/profile');
      res.redirect('http://localhost:5173/dashboard');
    }
  }
);

export default router;
