import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { supermemo, SuperMemoItem, SuperMemoGrade } from 'supermemo';

// Get all flashcards, sorted by interval in ascending order
export const getAllFlashcards = async (req: Request, res: Response) => {
  const resourceId = req.params.id;

  try {
    if (!resourceId) {
      return res.status(400).json({ error: 'Resource ID is required' });
    }
    console.log(resourceId);

    const flashcards = await prisma.flashcard.findMany({
      where: { resourceId: resourceId }, // Filter by the provided resourceId
      select: {
        front: true,
        back: true,
        id: true,
      },
      orderBy: { interval: 'asc' },
    });

    res.json(flashcards);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve flashcards' });
  }
};

// Get a single flashcard by id
export const getFlashcard = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const flashcard = await prisma.flashcard.findUnique({
      where: { id },
    });
    if (flashcard) {
      res.json(flashcard);
    } else {
      res.status(404).json({ error: 'Flashcard not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve the flashcard' });
  }
};

// Create a new custom flashcard
export const createFlashcard = async (req: Request, res: Response) => {
  const { front, back, resourceId } = req.body;
  try {
    const newFlashcard = await prisma.flashcard.create({
      data: { front, back, resourceId },
    });
    res.status(201).json(newFlashcard);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create a new flashcard' });
  }
};

export const updateFlashcard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // const validatedData = updateFlashcardSchema.parse(req.body);
    // const { front, back, resourceId, grade } = validatedData;
    const { grade } = req.body;

    const flashcard = await prisma.flashcard.findUnique({
      where: { id },
    });

    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }

    // Prepare the SuperMemo item
    const item: SuperMemoItem = {
      interval: flashcard.interval,
      repetition: flashcard.repetition,
      efactor: flashcard.easiness,
    };

    // Apply the SuperMemo algorithm
    const updatedItem = supermemo(item, grade as SuperMemoGrade);

    const updatedFlashcard = await prisma.flashcard.update({
      where: { id },
      data: {
        front: flashcard.front,
        back: flashcard.back,
        resourceId: flashcard.resourceId,
        repetition: updatedItem.repetition,
        interval: updatedItem.interval,
        easiness: updatedItem.efactor,
      },
    });

    res.json(updatedFlashcard);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Failed to update the flashcard: ${error}` });
  }
};

// Delete a flashcard
export const deleteFlashcard = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.flashcard.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to delete the flashcard' });
  }
};
