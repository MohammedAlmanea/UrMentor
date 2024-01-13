import express from 'express';
import passport from 'passport';

const router = express.Router();


// auth logout
router.get('/logout', (req, res) => {
    // req.logout();
    res.redirect('/');
});

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    // redirect to frontend page
    // res.redirect('http://localhost:3000/')
    res.redirect('/profile');
});


export default router;