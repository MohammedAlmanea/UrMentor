import Box from '@mui/material/Box';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bgGradient } from '../../theme/css';
import { alpha, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

type Quiz = {
  question: string;
  wrongAnswers: string[];
  correctAnswer: string;
  // userAnswer: string;
};

export const Quiz: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<boolean[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const theme = useTheme();

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
        // const newQuizzes = quizzes.map((quiz):Quiz => {
        //   return {
        //     question: quiz.question,
        //     wrongAnswers: quiz.wrongAnswers,
        //     correctAnswer:quiz.correctAnswer,
        //     userAnswer:''
        //   }
        // })
        // setQuizzes(newQuizzes);
        setQuizzes(quizzes);
      } catch (err) {
        console.log(err);
      }
    };
    fetchQuizzes();
  }, [resourceId]);

  const handleAnswer = (
    answer: string
    //  currentQuiz: Quiz
  ) => {
    // setQuizzes(
    //   quizzes.map((q) => {
    //     if (q.question === currentQuiz.question) {
    //       return { ...q, userAnswer: answer };
    //     } else return q;
    //   })
    // );
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
      const results = quizzes.map((quiz, index) => {
        const isCorrect = userAnswers[index];
        return {
          question: quiz.question,
          correctAnswer: quiz.correctAnswer,
          scoreIndicator: isCorrect ? '1/1' : '0/1',
        };
      });

      const correctAnswersCount = results.filter(
        (result) => result.scoreIndicator === '1/1'
      ).length;
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 1,
            width: 1, 
          }}
        >
          <Box
            sx={{
              width: 1000, 
              height: 1, 
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '16px', 
              boxShadow: 24,
              padding: 5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{ fontWeight: 'bold', textAlign: 'center' }}
              >
                Quiz Complete!
              </Typography>
              <Typography
                sx={{ mb: 4, textAlign: 'center', fontSize: 20 }}
                display={'flex'}
                justifyContent={'center'}
                noWrap
              >
                You got
                <Box mx={1} fontWeight={'bold'} color={'green'}>
                  {correctAnswersCount}
                </Box>
                out of
                <Box mx={1} fontWeight={'bold'}>
                  {quizzes.length}
                </Box>
                questions right.
              </Typography>
              <Grid container spacing={2} className="mt-4">
                {results.map((result, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card variant="outlined">
                      <Box position="relative">
                        {/* This is the grade */}
                        <Box
                          position="absolute"
                          top={2}
                          right={2}
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            p: 1,
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="caption">
                            {result.scoreIndicator}
                          </Typography>
                        </Box>

                        <CardContent
                          sx={{
                            borderColor:
                              result.scoreIndicator === '1/1' ? 'green' : 'red',
                            borderWidth: 2,
                            borderRadius: '15px',
                          }}
                        >
                          <Typography
                            component="p"
                            sx={{ fontSize: 14, fontWeight: 'bold' }}
                          >
                            {result.question}
                          </Typography>
                          <Typography
                            component="p"
                            color="text.secondary"
                            sx={{ fontSize: 12, fontWeight: 'bold' }}
                          >
                            Correct Answer: {result.correctAnswer}
                          </Typography>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      );
    }

    const currentQuiz = quizzes[currentQuestionIndex];
    const answers = [
      ...currentQuiz.wrongAnswers,
      currentQuiz.correctAnswer,
    ].sort(() => Math.random() - 0.5);

    return (
      <Box
        sx={{
          minWidth:{
            sm: 600,
            md: 800,
          },
          maxHeight: '70vh',
          bgcolor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          boxShadow: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth:500,
            padding: {
              xs: 2,
              sm:1,
              md: 1,
              lg: 1,
            },
          }}
        >
          <Typography mb={1} fontSize={20}>
                {currentQuestionIndex + 1} of {quizzes.length}
          </Typography>

            <Typography
            variant="h3"
              sx={{
                mb: 5,
              }}
            >
              {currentQuiz.question}
            </Typography>

          <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} width={1}>
              {answers.map((answer, index) => (
                <Button
                  key={index}
                  variant="contained"
                  color="primary"
                  sx={{
                    mb: 2,
                  width:1,
                  }}
                  onClick={() => handleAnswer(answer)}
                >
                  {answer}
                </Button>
              ))}
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.6),
          imgUrl: '/background/overlay_2.jpg',
        }),
        paddingTop: 15,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // height: 1,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
        {quizzes.length > 0 ? renderQuestion() : <p>Loading quizzes...</p>}
    </Box>
  );
};
