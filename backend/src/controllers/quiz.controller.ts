import { Request, Response } from 'express';
import { prisma } from '../config/db';



export const getAllQuizzes = async (req: Request, res: Response) => {
  const resourceId = req.params.id;

  try {
    if (!resourceId) {
      return res.status(400).json({ error: 'Resource ID is required' });
    }
    console.log(resourceId);

    const quizzes = await prisma.quiz.findMany({
      where: { resourceId: resourceId },
      select: {
        question: true,
        correctAnswer: true,
        wrongAnswers: true,
      },
    });

    res.status(200).json(quizzes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve quizzes' });
  }
};


