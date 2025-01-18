import React, { useState, useEffect } from "react";
import "./App.css";

const generateCards = () => {
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
  const cards = [...numbers, ...numbers]; 
  return cards.sort(() => Math.random() - 0.5);
};

const App = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]); 
  const [matchedCards, setMatchedCards] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1); 
  const [scores, setScores] = useState({ 1: 0, 2: 0 }); 
  const [timeLeft, setTimeLeft] = useState(20); 
  const [timeoutMessage, setTimeoutMessage] = useState("");
  const [gameOver, setGameOver] = useState(false); 
  const [gameStarted, setGameStarted] = useState(false);

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
          switchTurn(); 
          return 20; 
        }
      });
    }, 1000);

    return () => clearInterval(timer); 
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
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1); 
    setTimeout(() => setTimeoutMessage(""), 2000); 
  };

  const handleCardClick = (index) => {
    if (!gameStarted || gameOver) return;

    // Play sound
    const audio = new Audio("/sound.wav"); 
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
        setFlippedCards([]); 
      } else {
      
        setTimeout(() => {
          setFlippedCards([]);
          switchTurn(); 
        }, 1000);
      }
    }

    
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
