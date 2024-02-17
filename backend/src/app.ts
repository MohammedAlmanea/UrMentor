import express from 'express';
import { connectDB } from './config/db';
import { passportSetup } from './config/passportSetup';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from 'passport';
import helmet from 'helmet';
import cors from 'cors';
import authRouter from './routers/auth.router';
import uploadRouter from './routers/upload.router';
import resourceRouter from './routers/resource.router';
import flashcardsRouter from './routers/flashcard.router';
import chatRouter from './routers/chat.router'
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const PORT = 5600;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET as string,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
//   })
// );

app.use(passport.initialize());
// app.use(passport.session());
app.use(cookieParser());
app.use('/auth', authRouter);
app.use('/api', uploadRouter);
app.use('/api', resourceRouter);
app.use('/api', flashcardsRouter);
app.use('/api', chatRouter);

connectDB();
passportSetup();

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
