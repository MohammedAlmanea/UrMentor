import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { putFile } from './s3Utils';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const speechFile = path.resolve('./uploads/audio.mp3');

export const tts = async (text: string) => {
  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'echo',
    input: text,
  });
  console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
  return await putFile(speechFile)
};

