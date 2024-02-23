import { prisma } from '../config/db';
import { Profile } from 'passport-google-oauth20';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

export const createUser = async (profile: Profile) => {
  try {
    if (!profile) {
      console.log('There is a problem in createUser!');
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        email: profile.emails![0].value,
        name: profile.displayName,
        googleId: profile.id,
        imageURL: profile.photos![0].value,
      },
    });
    console.log(
      `Created User "${profile.displayName}" successfully in controller!!`
    );
    return newUser;
  } catch (error) {
    const prismaError = error as PrismaClientKnownRequestError;
    console.log(prismaError);
    return;
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    type userJWTPayload = {
      id: string;
      iat: number;
    };
    const userId = req.user as userJWTPayload;
    console.log('User:', userId);
    if (userId.id) {
      const user = await prisma.user.findUnique({
        where: { id: userId.id },
        select: {
          email: true,
          name: true,
          imageURL: true,
        },
      });
      console.log(user);
      
      res.status(200).json(user);
    } else {
      res.json({
        error: 'Error when getting user',
      });
    }
  } catch (error) {
    const prismaError = error as PrismaClientKnownRequestError;
    console.log(prismaError);
    console.log(`error -> ${error}`);
    return;
  }
};
