import React, { useState } from "react";
import "./App.css";

const generateCards = () => {
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
  const cards = [...numbers, ...numbers]; // Double the numbers
  return cards.sort(() => Math.random() - 0.5); // Shuffle the cards
};

const App = () => {
  const [cards, setCards] = useState(generateCards());
  const [flippedCards, setFlippedCards] = useState([]); // Indices of flipped cards
  const [matchedCards, setMatchedCards] = useState([]); // Matched cards
  const [currentPlayer, setCurrentPlayer] = useState(1); // Player 1 or 2
  const [scores, setScores] = useState({ 1: 0, 2: 0 }); // Scores for players

  const handleCardClick = (index) => {
    // Ignore clicks on already matched or flipped cards
    if (matchedCards.includes(index) || flippedCards.includes(index)) return;

    // Flip the card
    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    // Check if two cards are flipped
    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;
      if (cards[firstIndex] === cards[secondIndex]) {
        // Match found
        setMatchedCards([...matchedCards, firstIndex, secondIndex]);
        setScores({
          ...scores,
          [currentPlayer]: scores[currentPlayer] + 1,
        });
        setFlippedCards([]); // Reset flipped cards for next turn
      } else {
        // No match, switch turn after a short delay
        setTimeout(() => {
          setFlippedCards([]);
          setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        }, 1000);
      }
    }
  };

  return (
    <div className="App">
      <h1>Two-Player Memory Game</h1>
      <div className="scores">
        <p>Player 1: {scores[1]}</p>
        <p>Player 2: {scores[2]}</p>
      </div>
      <div className="board">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card ${
              flippedCards.includes(index) || matchedCards.includes(index)
                ? "flipped"
                : ""
            }`}
            onClick={() => handleCardClick(index)}
          >
            {(flippedCards.includes(index) || matchedCards.includes(index)) &&
              card}
          </div>
        ))}
      </div>
      <p>Current Turn: Player {currentPlayer}</p>
    </div>
  );
};

export default App;

// Add the following CSS to App.css
/*
.App {
  text-align: center;
}

.board {
  display: grid;
  grid-template-columns: repeat(5, 100px);
  gap: 10px;
  justify-content: center;
  margin: 20px auto;
}

.card {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
}

.card.flipped {
  background-color: #4caf50;
  color: white;
  cursor: default;
}

.scores {
  display: flex;
  justify-content: space-around;
  margin: 20px;
}
*/
