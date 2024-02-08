import { Request, Response, query } from 'express';
import { upload } from '../config/multer';

// process
import { ChatOpenAI, OpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import {
  RecursiveCharacterTextSplitter,
  TokenTextSplitter,
} from 'langchain/text_splitter';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import {
  LLMChain,
  MapReduceDocumentsChain,
  RefineDocumentsChain,
  loadQAChain,
  loadQAMapReduceChain,
  loadQARefineChain,
  loadQAStuffChain,
  loadSummarizationChain,
} from 'langchain/chains';
import { PromptTemplate } from '@langchain/core/prompts';
import { StuffDocumentsChain } from 'langchain/chains';
import {
  JsonOutputFunctionsParser,
  StructuredOutputParser,
} from 'langchain/output_parsers';
import dotenv from 'dotenv';
import { z } from 'zod';
import { Flashcard, FlashcardSchema } from '../zod/flashcard.schema';
import { prisma } from '../config/db';
import { clearUploadsDirectory } from '../util/clearUploads';
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

        // TEMP
        // const { id } = req.params;
        // console.log(id);

        // Access user information from req.user
        type userJWTPayload = {
          id: string;
          iat: number;
        };
        const user = req.user as userJWTPayload;
        console.log('User:', user);
        if (user) {
          // await prisma.user.findFirst({
          //   where: {
          //     id: id,
          //   },
          // });
          const resource = await prisma.resource.create({
            data: {
              title: req.file.originalname,
              userId: user.id,
            },
          });

          await process(resource.id);
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

export const process = async (resourceId: string) => {
  try {
    const loader = new DirectoryLoader('./uploads', {
      '.pdf': (path) => new PDFLoader(path),
    });
    const docs = await loader.load();
    console.log('here 1');

    const Splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1300 });
    console.log('here 2');

    const docsChunks = await Splitter.splitDocuments(docs);
    const system = `I want you to act as a professional flashcards creator, able to create Anki cards from the text I provide.  Regarding the formulation of the card content, you stick to two principles: First, The material you learn must be formulated in as simple way as it is only possible. Simplicity does not have to imply losing information and skipping the difficult part but keep it concise question then short answer. Second, optimize wording: The wording of your items must be optimized to make sure that in minimum time the right bulb in your brain lights up. This will reduce error rates, increase specificity, reduce response time, and help your concentration. Here is the content you must create the flashcards from {context}. Try to make as much cards as you can without leaving the context or writing about not important sections. Also make sure to skip the chapter objectives if there is any. Output must be in JSON format {{"flashcards":[{{"front":"flashcard question","back":"answer to the question"}}]}} `;

    const parser = StructuredOutputParser.fromZodSchema(
      z.object({
        flashcards: z.array(FlashcardSchema),
      })
    );

    // const parser = StructuredOutputParser.fromZodSchema(
    //   z.object({
    //     flashcards:z.array(z.object({
    //       front:z.string().describe("The Question of this card"),
    //       back:z.string().describe("The answer to the question")
    //     }))
    //   })
    // );

    const SUMMARY_PROMPT = new PromptTemplate({
      inputVariables: ['context'],
      template: system,
      outputParser: parser,
    });

    const splitArray = <T>(arr: T[]): [T[], T[]] => [
      arr.slice(0, Math.ceil(arr.length / 2)),
      arr.slice(Math.ceil(arr.length / 2)),
    ];

    const [firstHalf, secondHalf] = splitArray(docsChunks);

    let model;
    if (firstHalf.length < 50) {
      model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo-1106' });
    } else {
      model = new OpenAI({ temperature: 0, modelName: 'gpt-4-turbo-preview' });
    }

    const chain = loadQAStuffChain(model, {
      prompt: SUMMARY_PROMPT,
      verbose: true,
    });
    const response = await chain.invoke({
      input_documents: firstHalf,
    });
    const secondResponse = await chain.invoke({
      input_documents: secondHalf,
    });

    const concatResponse: Flashcard[] = response.text.flashcards.concat(
      secondResponse.text.flashcards
    );
    const flashcards = concatResponse.map((flashcard) => ({
      ...flashcard,
      resourceId: resourceId,
    }));

    await prisma.flashcard.createMany({
      data: flashcards,
    });
    return;
  } catch (error) {
    console.log(error);
    return;
  }
};

// const addFlashCards = async();
