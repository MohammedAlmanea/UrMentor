import type { Document } from 'langchain/document';
import { OpenAIEmbeddings } from '@langchain/openai';
import { makeChain } from '../util/chain';
import { Request, Response } from 'express';
import { pinecone } from '../config/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import dotenv from 'dotenv';
dotenv.config();

export const chat = async (req: Request, res: Response) => {
  const { question, history } = req.body;
  const { resourceId } = req.params;

  console.log('question', question);
  console.log('history', history);

  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {
    const index = pinecone.Index(process.env.PINECONE_INDEX as string);

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        namespace: resourceId,
      }
    );

    
    let resolveWithDocuments: (value: Document[]) => void;
    const documentPromise = new Promise<Document[]>((resolve) => {
      resolveWithDocuments = resolve;
    });
    const retriever = vectorStore.asRetriever({
      k:7,
      callbacks: [
        {
          handleRetrieverEnd(documents) {
            resolveWithDocuments(documents);
          },
        },
      ],
    });


    const chain = makeChain(retriever);

    const pastMessages = history
      .map((message: { question: string; answer: string }) => {
        return [
          `Human: ${message.question}`,
          `Assistant: ${message.answer}`,
        ].join('\n');
      })
      .join('\n');
    console.log(pastMessages);

    const response = await chain.invoke({
      question: sanitizedQuestion,
      chat_history: pastMessages,
    });

    const sourceDocuments = await documentPromise;

    console.log('response', response);
    res.status(200).json({ text: response, sourceDocuments });
  } catch (error: any) {
    console.log('error', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
};
