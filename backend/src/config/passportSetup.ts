import passport from 'passport';
import googleStrategy, { Profile } from 'passport-google-oauth20';
import { prisma } from './db';
import { createUser } from '../controllers/auth.controller';
import dotenv from 'dotenv';
dotenv.config();

export const passportSetup = () => {
  passport.serializeUser((user: any, done) => {
    console.log("in Serialize User");
    
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("in DeSerialize User");

    const user = await prisma.user.findFirst({
      where: {
        // could cause an error **
        id: id as string,
      },
    });
    console.log(user);
    
    done(null, user);
  });

  passport.use(
    new googleStrategy.Strategy(
      {
        // options for google strategy
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: '/auth/google/redirect',
      },
      async (accessToken, refreshToken, profile: Profile, done) => {
        // check if user already exists in db
        const currentUser = await prisma.user.findFirst({
          where: {
            googleId: profile.id,
          },
        });
        if (currentUser) {
          // already have this user
          console.log(' Already have him => user is: ', currentUser);
          done(null, currentUser);
        } else {
          // if not, create user in db
          const newUser = await createUser(profile);
          done(null, newUser);
        }
      }
    )
  );
};
