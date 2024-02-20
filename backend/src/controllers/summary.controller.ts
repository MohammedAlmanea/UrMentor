import { Request, Response } from 'express';
import { prisma } from '../config/db';
import dotenv from 'dotenv';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../config/s3';
import { tts } from '../util/tts';
import { SignURL } from '../util/s3Utils';
import { clearUploadsDirectory } from '../util/clearUploads';

dotenv.config();

export const getSummary = async (req: Request, res: Response) => {
  const resourceId = req.params.id;

  try {
    if (!resourceId) {
      return res.status(400).json({ error: 'Resource ID is required' });
    }
    console.log(resourceId);

    const data = await prisma.summary.findFirst({
      where: { resourceId: resourceId },
      select: {
        id: true,
        content: true,
        Key: true,
      },
    });

    let summary: { content: string; id: string; audioURL?: string } = {
      content: data?.content as string,
      id: data?.id as string,
    };

    if (data?.Key) {
      summary.audioURL = await SignURL(data.Key);
    }
    console.log(summary);

    res.status(200).json(summary);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve summary' });
  }
};

export const createTTS = async (req: Request, res: Response) => {
  const summaryId = req.params.id;

  try {
    if (!summaryId) {
      return res.status(400).json({ error: 'Summary ID is required' });
    }
    console.log(`Fetching summary form db...`);

    const data = await prisma.summary.findFirst({
      where: { id: summaryId },
    });
    if (!data) {
      res.status(404).json('Summary was not found');
    }

    console.log(`Converting Text to speech...`);
    const key = await tts(data?.content as string);

    await prisma.summary.update({
      where: {
        id: summaryId,
      },
      data: {
        ...data,
        Key: key,
      },
    });
    await clearUploadsDirectory();
    res.status(200).json('TTS Created');
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve summary' });
  }
};
