import { S3Client } from "@aws-sdk/client-s3";
import dotenv from 'dotenv'

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY as string;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY as string;
const BUCKET_REGION = process.env.BUCKET_REGION as string;

export const s3 = new S3Client({
    credentials: {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
    region: BUCKET_REGION,
  });