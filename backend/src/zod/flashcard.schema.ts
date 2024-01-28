import { z } from 'zod';

export const FlashcardSchema = z.object({
  front: z.string().describe("The Question of this card"),
  back: z.string().describe("The answer to the question")
});

export type Flashcard = z.infer<typeof FlashcardSchema>;
