import { z } from 'zod';

export const mcqSchema = z.object({
    question: z.string().describe('The question'),
    wrongAnswers: z.array(z.string().describe('The wrong answer to the question')),
    correctAnswer: z.string().describe('The correct answer to the question'),
  });



export type mcq = z.infer<typeof mcqSchema>;
