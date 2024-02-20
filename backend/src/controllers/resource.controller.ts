import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { deleteVectors } from '../util/deleteVectors';
import { deleteS3 } from '../util/s3Utils';

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
      const resource = await prisma.resource.delete({
        where: { id: resourceId },
        include: {
          summaries: {
            select: {
              Key: true,
            },
          },
        },
      });

      // After the resource is deleted from the database, delete the vectors
      await deleteVectors(resourceId);
      if (
        resource.summaries[0].Key !== undefined &&
        resource.summaries[0].Key !== null
      )
        await deleteS3(resource.summaries[0].Key as string);
    });
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
