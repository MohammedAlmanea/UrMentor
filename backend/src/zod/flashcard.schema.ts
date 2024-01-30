import { z } from 'zod';

export const FlashcardSchema = z.object({
  front: z.string().describe("The Question of this card"),
  back: z.string().describe("The answer to the question")
});

export const updateFlashcardSchema = z.object({
  front: z.string(),
  back: z.string(),
  resourceId: z.string(),
  grade: z.number().min(0).max(5),
});

export type Flashcard = z.infer<typeof FlashcardSchema>;

