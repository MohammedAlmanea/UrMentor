import { pinecone } from '../config/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';

import dotenv from 'dotenv';
dotenv.config();

export const deleteVectors = async (resourceId: string) => {
  try {
    const index = pinecone.Index(process.env.PINECONE_INDEX as string);


    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        namespace: resourceId,
      }
    );

    await vectorStore.delete({ deleteAll: true });
    console.log('Deleted vectores');
    
  } catch (error) {
    console.log(error);
  }
};
