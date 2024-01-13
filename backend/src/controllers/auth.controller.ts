import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { Profile } from 'passport-google-oauth20';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
      },
    });
    console.log(`Created User "${profile.displayName}" successfully!!`);
    return newUser;
  } catch (error) {
    const prismaError = error as PrismaClientKnownRequestError;
    console.log(prismaError);
    return;
  }
};
