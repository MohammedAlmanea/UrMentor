import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { deleteVectors } from '../util/deleteVectors';

export const getResourcesByUser = async (req: Request, res: Response) => {
  try {
    type userJWTPayload = {
      id: string;
      iat: number;
    };
    const user = req.user as userJWTPayload;
    console.log('User:', user);
    if (user) {
      const resources = await prisma.resource.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          title: true,
        },
      });
      res.json(resources);
    } else {
      console.log('Error in getResourcesByUser because of req.user');
      res.status(500).json({ error: 'Internal server error' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteResource = async (req: Request, res: Response) => {
  const { resourceId } = req.params;
  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.resource.delete({
        where: { id: resourceId },
      });

      // After the resource is deleted from the database, delete the vectors
      await deleteVectors(resourceId);
    });
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
