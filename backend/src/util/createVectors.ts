import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { pinecone } from '../config/pinecone';
import type { Document } from 'langchain/document';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';

import dotenv from 'dotenv';
dotenv.config();

export const createVectors = async (
  rawDocs: Document[],
  resourceId: string
) => {
  try {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(process.env.PINECONE_INDEX as string);
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: resourceId,
    });
  } catch (error) {
    console.log(error);
  }
};
