// FlashcardsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactCardFlip from 'react-card-flip';

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
      .catch((error) => console.error('Error fetching flashcards:', error)).finally(()=> {
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
            console.log(
              `THIS CARD WAS RESORTED BY MY BIG BRAIN WOWOWOWOW ${card}`
            );
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

      console.log(`Cards that should be moved to front -> ${moveToFront}`);
      console.log(`The rest of the cards ------> ${remainingCards}`);
      //  Reposition cards
      updatedFlashcards = [...moveToFront, ...remainingCards];
      console.log(
        `Merged cards should be sorted ${updatedFlashcards.forEach((item) =>
          console.log(item)
        )}`
      );

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
    <div>
      {currentCard ? (
        <>
          <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
            <div onClick={handleFlip} className="card front">
              <div className='h-32 bg-slate-200 flex justify-center items-center'>{currentCard.front}</div>
            </div>
            <div onClick={handleFlip} className="card back">
            <div className='h-32 bg-slate-200 flex justify-center items-center'>{currentCard.back}</div>
            </div>
          </ReactCardFlip>
          <div>
            {[0, 1, 2, 3, 4, 5].map((grade) => (
              <button key={grade} className={'bg-black m-4 text-white'} onClick={() => handleGrade(grade)}>
                Grade {grade}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div>No more cards to review!</div>
      )}
    </div>
  );
};

export default FlashcardsPage;
