import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import fs from 'fs';
import dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '../config/s3';
dotenv.config();

const BUCKET_NAME = process.env.BUCKET_NAME as string;

export const putFile = async (filePath: string) => {
  console.log(`Uploading file to S3...`);
  const fileContent = fs.readFileSync(filePath);
  const params = {
    Bucket: BUCKET_NAME,
    Key: uuid(),
    Body: fileContent,
    ContentType: 'audio/mp3',
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);
  return params.Key;
};

export const SignURL = async (key: string) => {
  console.log(`Signing a link...`);
  const getObjectParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  };

  const audioURL = await getSignedUrl(
    s3,
    new GetObjectCommand(getObjectParams),
    { expiresIn: 60 }
  );
  console.log(audioURL);
  return audioURL;
};

export const deleteS3 = async (key: string) => {
  console.log(`Deleting file from S3...`);
  const deleteObjectParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  };
  const deleteCommand = new DeleteObjectCommand(deleteObjectParams);
  await s3.send(deleteCommand);
  return;
};
