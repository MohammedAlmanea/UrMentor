import { z } from 'zod';

export const botResponseSchema = z.object({
  answer: z.string().describe('The Answer to the question'),
});



export type botResponse = z.infer<typeof botResponseSchema>;
