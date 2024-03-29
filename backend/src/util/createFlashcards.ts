import { OpenAI } from '@langchain/openai';
import {
  RecursiveCharacterTextSplitter,
} from 'langchain/text_splitter';
import {
  loadQAStuffChain,
} from 'langchain/chains';
import { PromptTemplate } from '@langchain/core/prompts';
import {
  StructuredOutputParser,
} from 'langchain/output_parsers';
import { z } from 'zod';
import { Flashcard, FlashcardSchema } from '../zod/flashcard.schema';
import { prisma } from '../config/db';
import type { Document } from 'langchain/document';


export const createFlashcards = async (resourceId: string, rawDocs: Document[]) => {
    try {

      const Splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1300 });
      const docsChunks = await Splitter.splitDocuments(rawDocs);
      const system = `I want you to act as a professional flashcards creator, able to create Anki cards from the text I provide.  Regarding the formulation of the card content, you stick to two principles: First, The material you learn must be formulated in as simple way as it is only possible. Simplicity does not have to imply losing information and skipping the difficult part but keep it concise question then short answer. Second, optimize wording: The wording of your items must be optimized to make sure that in minimum time the right bulb in your brain lights up. This will reduce error rates, increase specificity, reduce response time, and help your concentration. Here is the content you must create the flashcards from {context}. Try to make as much cards as you can without leaving the context or writing about not important sections. Also make sure to skip the chapter objectives if there is any. Output must be in JSON format {{"flashcards":[{{"front":"flashcard question in markdown language","back":"answer to the question in markdown language"}}]}} `;
  
      const parser = StructuredOutputParser.fromZodSchema(
        z.object({
          flashcards: z.array(FlashcardSchema),
        })
      );
    
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