import { Request, Response } from 'express';
import { upload } from '../config/multer';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import dotenv from 'dotenv';
import { prisma } from '../config/db';
import { clearUploadsDirectory } from '../util/clearUploads';
import { createVectors } from '../util/createVectors';
import { createFlashcards } from '../util/createFlashcards';
import { createMQCs } from '../util/createQuizzes';
import { createSummary } from '../util/createSummary';
dotenv.config();

export const uploadFile = async (req: Request, res: Response) => {
  upload(req, res, async (err: any) => {
    if (err) {
      res.status(500).json({ message: err });
    } else {
      if (req.file == undefined) {
        res.status(400).json({ message: 'No file selected!' });
      } else {
        console.log(req.file);

        // Access user information from req.user
        type userJWTPayload = {
          id: string;
          iat: number;
        };
        const user = req.user as userJWTPayload;
        console.log('User:', user);
        if (user) {

          const resource = await prisma.resource.create({
            data: {
              title: req.file.originalname,
              userId: user.id,
            },
          });

          const loader = new DirectoryLoader('./uploads', {
            '.pdf': (path) => new PDFLoader(path),
          });
          const docs = await loader.load();
      
          console.log(`Creating vetors...`);
          
          createVectors(docs, resource.id);
          console.log(`Creating Flashcards...`);

          await createFlashcards(resource.id, docs);
          console.log(`Creating MCQs...`);

          await createMQCs(resource.id, docs);
          console.log(`Creating Summary...`);

          await createSummary(resource.id,docs)
          await clearUploadsDirectory();
        } else {
          console.log('Error in Uplaod file because of req.user');
          res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({
          message: 'File uploaded successfully!',
        });
      }
    }
  });
};
