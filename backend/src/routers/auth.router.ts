import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '@prisma/client';

dotenv.config();

const router = express.Router();

// auth logout
router.get('/logout', (req, res) => {
  // req.logout();
  res.redirect('/');
});

// auth with google+
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile','email'],
  })
);

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get(
  '/google/redirect',
  passport.authenticate('google' /*{failureRedirect: '/login'}*/),
  (req, res) => {
    // redirect to frontend page
    // res.redirect('http://localhost:3000/')
    if (req.user) {
      const user = req.user as User;
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
      console.log("jwt token created");
      
      res.cookie('jwt', token, {
        httpOnly: true,
        // secure: true
      });
      console.log(user);
      console.log(token);
      
    //   res.redirect('/profile');
     res.redirect('http://localhost:5173/')

    }
  }
);

export default router;
