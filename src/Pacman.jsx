import React, { useState, useEffect } from 'react';
import './Pacman.css';

const Pacman = () => {
  const [board, setBoard] = useState([]);
  const [pacman, setPacman] = useState({ x: 1, y: 1 });
  const [ghosts, setGhosts] = useState([{ x: 7, y: 5 }, { x: 7, y: 6 }]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const layout = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  useEffect(() => {
    setBoard(layout.map(row => [...row]));
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const handleKeyDown = (e) => {
      movePacman(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pacman, board, gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const gameInterval = setInterval(() => {
      moveGhosts();
    }, 1000);

    return () => clearInterval(gameInterval);
  }, [ghosts, board, gameOver]);

  useEffect(() => {
    checkCollisions();
  }, [pacman, ghosts]);

  const movePacman = (direction) => {
    let newPacman = { ...pacman };
    if (direction === 'ArrowUp') newPacman.y -= 1;
    if (direction === 'ArrowDown') newPacman.y += 1;
    if (direction === 'ArrowLeft') newPacman.x -= 1;
    if (direction === 'ArrowRight') newPacman.x += 1;

    if (board[newPacman.y] && board[newPacman.y][newPacman.x] !== 1) {
      if (board[newPacman.y][newPacman.x] === 0) {
        setScore(prevScore => prevScore + 10);
        const newBoard = [...board];
        newBoard[newPacman.y][newPacman.x] = 2; // Mark pellet as eaten
        setBoard(newBoard);
      }
      setPacman(newPacman);
    }
  };

  const moveGhosts = () => {
    const newGhosts = ghosts.map(ghost => {
      const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      const randomDirection = directions[Math.floor(Math.random() * directions.length)];
      const newGhost = {
        x: ghost.x + randomDirection[0],
        y: ghost.y + randomDirection[1],
      };

      if (board[newGhost.y] && board[newGhost.y][newGhost.x] !== 1) {
        return newGhost;
      }
      return ghost;
    });
    setGhosts(newGhosts);
  };

  const checkCollisions = () => {
    ghosts.forEach(ghost => {
      if (pacman.x === ghost.x && pacman.y === ghost.y) {
        setGameOver(true);
      }
    });
  };

  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <div key={rowIndex} className="pacman-row">
        {row.map((cell, cellIndex) => {
          const isPacman = pacman.x === cellIndex && pacman.y === rowIndex;
          const isGhost = ghosts.some(ghost => ghost.x === cellIndex && ghost.y === rowIndex);
          return (
            <div
              key={cellIndex}
              className={`pacman-cell ${cell === 1 ? 'wall' : (cell === 0 ? 'pellet' : 'eaten')}`}
            >
              {isPacman && <div className="pacman"></div>}
              {isGhost && <div className="ghost"></div>}
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="pacman-container">
      <h1>Pacman</h1>
      {gameOver ? (
        <div>
          <h2>Game Over</h2>
          <button onClick={() => window.location.reload()}>Restart</button>
        </div>
      ) : (
        <>
          <h2>Score: {score}</h2>
          <div className="pacman-board">{renderBoard()}</div>
        </>
      )}
    </div>
  );
};

export default Pacman;
