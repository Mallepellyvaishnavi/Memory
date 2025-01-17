import React, { useState, useEffect } from "react";
import "./App.css";

const generateCards = () => {
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
  const cards = [...numbers, ...numbers]; // Double the numbers
  return cards.sort(() => Math.random() - 0.5); // Shuffle the cards
};

const App = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]); // Indices of flipped cards
  const [matchedCards, setMatchedCards] = useState([]); // Matched cards
  const [currentPlayer, setCurrentPlayer] = useState(1); // Player 1 or 2
  const [scores, setScores] = useState({ 1: 0, 2: 0 }); // Scores for players
  const [timeLeft, setTimeLeft] = useState(20); // Time left for the current turn
  const [timeoutMessage, setTimeoutMessage] = useState(""); // Timeout message
  const [gameOver, setGameOver] = useState(false); // Game completion status
  const [gameStarted, setGameStarted] = useState(false); // Game start status

  useEffect(() => {
    if (!gameStarted) return;

    // Timer Effect
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          // Time ran out
          setTimeoutMessage(`Time Out! Player ${currentPlayer}'s turn is over.`);
          switchTurn(); // Switch turn
          return 20; // Reset timer for the next player
        }
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount or re-render
  }, [currentPlayer, gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    // Check for game completion
    if (matchedCards.length === cards.length && cards.length > 0) {
      setGameOver(true);
    }
  }, [matchedCards, cards.length, gameStarted]);

  const switchTurn = () => {
    setFlippedCards([]); // Reset flipped cards
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1); // Switch to the other player
    setTimeout(() => setTimeoutMessage(""), 2000); // Clear timeout message after 2 seconds
  };

  const handleCardClick = (index) => {
    if (!gameStarted || gameOver) return;

    // Play sound
    const audio = new Audio("/sound.wav"); // Sound file in the public folder
    audio.play();

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
          switchTurn(); // Switch to the next player
        }, 1000);
      }
    }

    // Reset the timer for the current player
    setTimeLeft(20);
  };

  const restartGame = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setMatchedCards([]);
    setScores({ 1: 0, 2: 0 });
    setCurrentPlayer(1);
    setTimeLeft(20);
    setTimeoutMessage("");
    setGameOver(false);
    setGameStarted(false);
  };

  const startGame = () => {
    setCards(generateCards());
    setGameStarted(true);
    setFlippedCards([]);
    setMatchedCards([]);
    setScores({ 1: 0, 2: 0 });
    setCurrentPlayer(1);
    setTimeLeft(20);
    setTimeoutMessage("");
    setGameOver(false);
  };

  return (
    <div className="App">
      <h4>Two-Player Memory Game</h4>
      {!gameStarted ? (
        <div className="start-screen">
          <button onClick={startGame}>Start Game</button>
        </div>
      ) : gameOver ? (
        <div className="game-over">
          <h2>Game Over!</h2>
          {scores[1] === scores[2] ? (
            <p>It's a Tie!</p>
          ) : (
            <p>Player {scores[1] > scores[2] ? 1 : 2} Wins!</p>
          )}
          <button onClick={restartGame}>Restart</button>
        </div>
      ) : (
        <>
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
          <h3>Current Turn: Player {currentPlayer}</h3>
          <h2>Time Left: {timeLeft} seconds</h2>
          {timeoutMessage && <p className="timeout-message">{timeoutMessage}</p>}
          <button onClick={restartGame} className="replay-button">Replay</button>
        </>
      )}
    </div>
  );
};

export default App;
