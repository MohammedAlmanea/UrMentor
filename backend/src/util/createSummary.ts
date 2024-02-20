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
import { createVectors } from '../util/createVectors';
import type { Document } from 'langchain/document';
import { mcq, mcqSchema } from '../zod/mcqs.schema';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { tts } from './tts';


export const createSummary = async (
  resourceId: string,
  rawDocs: Document[]
) => {
  try {
    const Splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 10000,
      chunkOverlap: 250,
    });

    const docsChunks = await Splitter.splitDocuments(rawDocs);
    const template = `Can you provide a comprehensive summary of the given text? The summary should cover all the key points and main ideas presented in the original text, while also condensing the information into a concise and easy-to-understand format. Ensure that the summary includes relevant details and examples that support the main ideas, while avoiding any unnecessary information like who made the text or repetition. The summary must be made for students looking for a summary about the main ideas in simple and easy to read format like bullet points when needed. Here is the text:

     {text} 
     
     Concise Summary:
     `;

      const SUMMARY_PROMPT = new PromptTemplate({
        inputVariables: ['text'],
        template: template,
        outputParser: new StringOutputParser
      });

    const model = new OpenAI({
      temperature: 0.2,
      modelName: 'gpt-4-turbo-preview',
    });

    const chain = loadSummarizationChain(model, {
      type: 'stuff',
      verbose: true,
      prompt: SUMMARY_PROMPT
    });

    const response = await chain.invoke({
      input_documents: docsChunks,
    });
    console.log(response);


    await prisma.summary.create({
      data: {
        content: response.text,
        resourceId: resourceId
      }
    })
  
    return;
  } catch (error) {
    console.log(error);
    return;
  }
};
