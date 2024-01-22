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


dotenv.config();
const app = express();
const PORT = 5600;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRouter);
app.use('/api', uploadRouter);

connectDB();
passportSetup();

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
