import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

type Quiz = {
  question: string;
  wrongAnswers: string[];
  correctAnswer: string;
  userAnswer: string;
};

export const Quiz: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<boolean[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(
          `http://localhost:5600/api/quiz/${resourceId}`,
          {
            credentials: 'include',
            method: 'GET',
          }
        );
        const quizzes = await response.json();
        console.log(`quizzes ==> ${quizzes}`);
        const newQuizzes = quizzes.map((quiz):Quiz => {
          return {
            question: quiz.question,
            wrongAnswers: quiz.wrongAnswers,
            correctAnswer:quiz.correctAnswer,
            userAnswer:''
          }
        })
        setQuizzes(newQuizzes);
      } catch (err) {
        console.log(err);
      }
    };
    fetchQuizzes();
  }, [resourceId]);

  const handleAnswer = (answer: string, currentQuiz: Quiz ) => {
    setQuizzes(
      quizzes.map((q)=> {
        if(q.question === currentQuiz.question)
        {
        return {...q, userAnswer:answer}
        } else return q
      })
    )
    const isCorrect = quizzes[currentQuestionIndex].correctAnswer === answer;
    setUserAnswers([...userAnswers, isCorrect]);

    if (currentQuestionIndex < quizzes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const renderQuestion = () => {
    if (quizComplete) {
      const correctAnswers = userAnswers.filter((answer) => answer).length;
      return (
        <div className='pt-30'>
          <h2 className="text-lg font-bold">Quiz Complete!</h2>
          <p>{`You got ${correctAnswers} out of ${quizzes.length} questions right.`}</p>
          {quizzes.map((q) => (
            <>
            <div>Correct Answer for {q.question} is {q.correctAnswer}</div>
            <div>User's Answer {q.userAnswer} </div>
            </>
          ))}
        </div>
      );
    }

    const currentQuiz = quizzes[currentQuestionIndex];
    const answers = [
      ...currentQuiz.wrongAnswers,
      currentQuiz.correctAnswer,
    ].sort(() => Math.random() - 0.5);

    return (
      <div className='pt-30'>
        <h2 className="text-lg font-bold">{currentQuiz.question}</h2>
        <div className="flex flex-col">
          {answers.map((answer, index) => (
            <button
              key={index}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => handleAnswer(answer,currentQuiz)}
            >
              {answer}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {quizzes.length > 0 ? renderQuestion() : <p>Loading quizzes...</p>}
    </div>
  );
};
