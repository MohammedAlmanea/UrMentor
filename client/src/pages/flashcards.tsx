// FlashcardsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactCardFlip from 'react-card-flip';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import { bgGradient } from './../theme/css';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';

type Flashcard = {
  id: string;
  front: string;
  back: string;
  position: number;
};

const FlashcardsPage: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const theme = useTheme();

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { x: 20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
    },
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:5600/api/flashcards/${resourceId}`, {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        const initializedFlashcards = data.map((card: Flashcard) => ({
          ...card,
          position: 1, // Default position for all cards
        }));
        console.log(initializedFlashcards);

        setFlashcards(initializedFlashcards);
      })
      .catch((error) => console.error('Error fetching flashcards:', error))
      .finally(() => {
        setIsLoading(false);
      });
  }, [resourceId]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleGrade = async (grade: number) => {
    if (currentIndex < flashcards.length) {
      const cardId = flashcards[currentIndex].id;
      await fetch(`http://localhost:5600/api/flashcards/grade/${cardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ grade: grade }),
        credentials: 'include',
      });
      let updatedFlashcards = [...flashcards];

      // Define the mapping from grade to position adjustment
      const gradeToPositionMap = { 0: 2, 1: 3, 2: 4, 3: 8 };

      if (grade >= 4) {
        // Remove the card if graded 4 or 5
        updatedFlashcards.splice(currentIndex, 1);
      } else {
        // Adjust the position for the current card based on its grade
        const adjustment = gradeToPositionMap[grade];
        if (adjustment) {
          updatedFlashcards[currentIndex].position = adjustment + 2;
          const [gradedCard] = updatedFlashcards.splice(currentIndex, 1);
          updatedFlashcards.push(gradedCard);
        }
      }

      const moveToFront: Flashcard[] = [];
      const remainingCards: Flashcard[] = [];

      updatedFlashcards.forEach((card) => {
        if (card.position > 1) {
          card.position -= 1;
          console.log(card);
          if (card.position === 1) {
            // This card now needs to be moved to the front in the next step
            moveToFront.push(card);
          } else {
            // Still waiting, keep it in the list
            remainingCards.push(card);
          }
        } else {
          // Card position is already 1 or less, no need to decrement or move
          remainingCards.push(card);
        }
      });
      //  Reposition cards
      updatedFlashcards = [...moveToFront, ...remainingCards];

      setFlashcards(updatedFlashcards);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  const currentCard = flashcards.length > 0 ? flashcards[0] : null;
  if (isLoading) {
    return <div>Loading flashcards...</div>;
  }
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
      }}
      display={'flex'}
      justifyContent={'center'}

      // height={}
    >
        <Stack
        display={'flex'}
          alignItems="center"
          justifyContent="center"
          width={800}
          maxHeight={600}
          sx={{
            boxShadow: 24,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            p: { xs: 2, sm: 4, md: 8 },
            borderRadius: 2,
          }}
        >
          {currentCard ? (
            <>
          <motion.div variants={container} initial="hidden" animate="visible">
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              
            }}>
              <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                <Card
                  onClick={handleFlip}
                  sx={{
                    minHeight: 300,
                    boxShadow: 24,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 3,
                    fontSize: 23,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    flexWrap: 'wrap',
                    width: { xs: 350, md: 400 },
                  }}
                >
                  <motion.div key={currentCard.front} variants={item}>
                    {currentCard.front}
                  </motion.div>
                </Card>
                <Card
                  onClick={handleFlip}
                  sx={{
                    minHeight: 300,
                    boxShadow: 24,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 3,
                    fontSize: 23,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    width: { xs: 350, md: 400 },
                    // flexWrap: 'wrap',
                  }}
                >
                  <motion.div key={currentCard.front} variants={item}>
                    {currentCard.back}
                  </motion.div>
                </Card>
              </ReactCardFlip>
              </Box>
              <Stack
                direction={'row'}
                spacing={2}
                my={6}
                flexWrap={'wrap'}
                useFlexGap
                alignItems="center"
                justifyContent="center"
              >
                <motion.div variants={item}>
                  <Button
                    onClick={() => handleGrade(0)}
                    sx={{
                      backgroundColor: alpha('#8B0000', 0.6),
                      boxShadow: 24,
                      //   color: 'white',
                      ':hover': {
                        backgroundColor: alpha('#8B0000', 0.9),
                      },
                    }}
                  >
                    <Typography color={'white'} fontWeight={'bold'}>
                      Very Hard
                    </Typography>
                  </Button>
                </motion.div>
                <motion.div variants={item}>
                  <Button
                    onClick={() => handleGrade(1)}
                    sx={{
                      backgroundColor: alpha('#FF0000', 0.6),
                      ':hover': {
                        backgroundColor: alpha('#FF0000', 0.9),
                      },
                      boxShadow: 24,
                      color: 'white',
                    }}
                  >
                    <Typography color={'white'} fontWeight={'bold'}>
                      Hard
                    </Typography>
                  </Button>
                </motion.div>
                <motion.div variants={item}>
                  <Button
                    onClick={() => handleGrade(2)}
                    sx={{
                      backgroundColor: alpha('#FFA500', 0.6),
                      ':hover': {
                        backgroundColor: alpha('#FFA500', 0.9),
                      },
                      boxShadow: 24,
                      color: 'white',
                    }}
                  >
                    <Typography color={'white'} fontWeight={'bold'}>
                      Somewhat Hard
                    </Typography>
                  </Button>
                </motion.div>
                <motion.div variants={item}>
                  <Button
                    onClick={() => handleGrade(3)}
                    sx={{
                      backgroundColor: alpha('#f7e302', 0.6),
                      ':hover': {
                        backgroundColor: alpha('#FFFF00', 0.9),
                      },
                      boxShadow: 24,
                      color: 'white',
                    }}
                  >
                    <Typography color={'white'} fontWeight={'bold'}>
                      Medium
                    </Typography>
                  </Button>
                </motion.div>
                <motion.div variants={item}>
                  <Button
                    onClick={() => handleGrade(4)}
                    sx={{
                      backgroundColor: alpha('#90EE90', 0.6),
                      ':hover': {
                        backgroundColor: alpha('#90EE90', 0.9),
                      },
                      boxShadow: 24,
                      color: 'white',
                    }}
                  >
                    <Typography color={'white'} fontWeight={'bold'}>
                      Easy
                    </Typography>
                  </Button>
                </motion.div>
                <motion.div variants={item}>
                  <Button
                    onClick={() => handleGrade(5)}
                    sx={{
                      backgroundColor: alpha('#006400', 0.6),
                      ':hover': {
                        backgroundColor: alpha('#006400', 0.9),
                      },
                      boxShadow: 24,
                      color: 'white',
                    }}
                  >
                    <Typography color={'white'} fontWeight={'bold'}>
                      Very Easy
                    </Typography>
                  </Button>
                </motion.div>
              </Stack>
            </motion.div>
            </>
          ) : (
            <Card
              onClick={handleFlip}
              sx={{
                minHeight: 300,
                boxShadow: 24,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
                fontSize: 23,
                fontWeight: 'bold',
                textAlign: 'center',
                width: { xs: 350, md: 400 },
                // flexWrap: 'wrap',
              }}
            >
              No more Cards to review
            </Card>
          )}
        </Stack>
    </Box>
  );
};

export default FlashcardsPage;
