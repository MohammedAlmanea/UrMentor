import { OpenAI } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { loadQAStuffChain } from 'langchain/chains';
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { z } from 'zod';
import { prisma } from '../config/db';
import type { Document } from 'langchain/document';
import { mcq, mcqSchema } from '../zod/mcqs.schema';

export const createMQCs = async (resourceId: string, rawDocs: Document[]) => {
  try {
    const Splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1300 });

    const docsChunks = await Splitter.splitDocuments(rawDocs);
    const system = `I want you to act as a professional multiple choice questions creator, able to create MCQs from the text I provide. Only write questions related to the context. Don't make the question too easy or too hard the purpose of the questions is to test the main knowledge of the context. Here is the context {context}. Try to make as much questions as you can without leaving the context or writing about not important sections. Also make sure to skip the chapter objectives if there is any. Output must be in JSON format {{"questions":[{{"question":"the question in markdown language","wrongAnswers":["wrong answers to the question in markdown language"], "correctAnswer":"correct answer to the question in markdown language"}}]}} `;

    const parser = StructuredOutputParser.fromZodSchema(
      z.object({
        questions: z.array(mcqSchema),
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

    const concatResponse: mcq[] = response.text.questions.concat(
      secondResponse.text.questions
    );
    const questions = concatResponse.map((q) => ({
      ...q,
      resourceId: resourceId,
    }));
    console.log(questions);

    await prisma.quiz.createMany({
      data: questions,
    });
    return;
  } catch (error) {
    console.log(error);
    return;
  }
};
