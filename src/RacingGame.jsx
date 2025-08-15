import React, { useState, useEffect, useRef } from 'react';
import './RacingGame.css';

const RacingGame = () => {
  const [carPosition, setCarPosition] = useState(50);
  const [obstacles, setObstacles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [carDirection, setCarDirection] = useState('');
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  const handleKeyDown = (e) => {
    if (gameOver) return;

    if (e.key === 'ArrowLeft') {
      setCarPosition((prev) => Math.max(prev - 5, 0));
      setCarDirection('left');
    } else if (e.key === 'ArrowRight') {
      setCarPosition((prev) => Math.min(prev + 5, 100));
      setCarDirection('right');
    }
  };

  const handleKeyUp = () => {
    setCarDirection('');
  };

  const startGame = () => {
    setGameOver(false);
    setCarPosition(50);
    setObstacles([]);
    setTime(0);
    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  useEffect(() => {
    startGame();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const gameInterval = setInterval(() => {
      if (gameOver) {
        clearInterval(gameInterval);
        clearInterval(timerRef.current);
        return;
      }

      // Move obstacles
      setObstacles((prev) =>
        prev
          .map((obstacle) => ({ ...obstacle, top: obstacle.top + 5 }))
          .filter((obstacle) => obstacle.top < 100)
      );

      // Add new obstacles
      if (Math.random() < 0.2) {
        setObstacles((prev) => [
          ...prev,
          { left: Math.random() * 100, top: 0 },
        ]);
      }

      // Check for collisions
      obstacles.forEach((obstacle) => {
        if (
          obstacle.top > 80 &&
          obstacle.top < 95 &&
          Math.abs(obstacle.left - carPosition) < 10
        ) {
          setGameOver(true);
        }
      });
    }, 100);

    return () => clearInterval(gameInterval);
  }, [gameOver, obstacles, carPosition]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver]);

  return (
    <div className="game-container">
      <div className="time">Time: {time}s</div>
      <div className="road">
        <div className={`car ${carDirection}`} style={{ left: `${carPosition}%` }} />
        {obstacles.map((obstacle, index) => (
          <div
            key={index}
            className="obstacle"
            style={{ left: `${obstacle.left}%`, top: `${obstacle.top}%` }}
          />
        ))}
      </div>
      {gameOver && (
        <div className="game-over">
          <h2>Game Over</h2>
          <p>Your time: {time}s</p>
          <button onClick={startGame}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default RacingGame;
