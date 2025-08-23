import React, { useState, useEffect, useCallback } from 'react';
import './Tetris.css';

const ROWS = 20;
const COLS = 10;

const SHAPES = {
  I: [[1, 1, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]],
  O: [[1, 1], [1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  T: [[0, 1, 0], [1, 1, 1]],
  Z: [[1, 1, 0], [0, 1, 1]],
};

const COLORS = {
  I: 'cyan',
  J: 'blue',
  L: 'orange',
  O: 'yellow',
  S: 'green',
  T: 'purple',
  Z: 'red',
};

const getRandomShape = () => {
  const shapes = 'IJLOSTZ';
  const randShape = shapes[Math.floor(Math.random() * shapes.length)];
  return {
    shape: SHAPES[randShape],
    color: COLORS[randShape],
  };
};

const Tetris = () => {
  const [board, setBoard] = useState(Array(ROWS).fill(Array(COLS).fill(0)));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const resetGame = useCallback(() => {
    setBoard(Array(ROWS).fill(Array(COLS).fill(0)));
    const { shape, color } = getRandomShape();
    setCurrentPiece({ shape, color });
    setPosition({ x: Math.floor(COLS / 2) - 1, y: 0 });
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const isValidMove = (piece, pos) => {
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (newX < 0 || newX >= COLS || newY >= ROWS || (board[newY] && board[newY][newX])) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const mergePieceToBoard = useCallback(() => {
    if (!currentPiece) return;

    const newBoard = board.map(row => [...row]);
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          newBoard[position.y + y][position.x + x] = currentPiece.color;
        }
      });
    });

    // Clear completed lines
    let linesCleared = 0;
    for (let y = newBoard.length - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        newBoard.splice(y, 1);
        linesCleared++;
      }
    }
    if (linesCleared > 0) {
        for(let i=0; i<linesCleared; i++) {
            newBoard.unshift(Array(COLS).fill(0));
        }
      setScore(prev => prev + linesCleared * 100);
    }


    setBoard(newBoard);

    const { shape, color } = getRandomShape();
    const newPosition = { x: Math.floor(COLS / 2) - 1, y: 0 };

    if (!isValidMove(shape, newPosition)) {
      setGameOver(true);
    } else {
      setCurrentPiece({ shape, color });
      setPosition(newPosition);
    }
  }, [board, currentPiece, position]);


  const move = useCallback((dir) => {
    if (gameOver) return;
    const newPosition = { ...position, x: position.x + dir };
    if (isValidMove(currentPiece.shape, newPosition)) {
      setPosition(newPosition);
    }
  }, [currentPiece, gameOver, position]);

  const drop = useCallback(() => {
    if (gameOver) return;
    const newPosition = { ...position, y: position.y + 1 };
    if (isValidMove(currentPiece.shape, newPosition)) {
      setPosition(newPosition);
    } else {
      mergePieceToBoard();
    }
  }, [currentPiece, gameOver, mergePieceToBoard, position]);

  const hardDrop = useCallback(() => {
    if (gameOver || !currentPiece) return;
    let newY = position.y;
    while (isValidMove(currentPiece.shape, { ...position, y: newY + 1 })) {
      newY++;
    }
    const newPosition = { ...position, y: newY };
    // Temporarily set the position for merge
    setPosition(newPosition);

    // Manually merge the piece at the new position
    const newBoard = board.map(row => [...row]);
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                newBoard[newPosition.y + y][newPosition.x + x] = currentPiece.color;
            }
        });
    });

    // Clear completed lines
    let linesCleared = 0;
    for (let y = newBoard.length - 1; y >= 0; y--) {
        if (newBoard[y].every(cell => cell !== 0)) {
            newBoard.splice(y, 1);
            linesCleared++;
        }
    }
    if (linesCleared > 0) {
        for(let i=0; i<linesCleared; i++) {
            newBoard.unshift(Array(COLS).fill(0));
        }
        setScore(prev => prev + linesCleared * 100);
    }

    setBoard(newBoard);

    // Get the next piece
    const { shape, color } = getRandomShape();
    const nextPosition = { x: Math.floor(COLS / 2) - 1, y: 0 };

    if (!isValidMove(shape, nextPosition)) {
        setGameOver(true);
    } else {
        setCurrentPiece({ shape, color });
        setPosition(nextPosition);
    }
}, [board, currentPiece, gameOver, position]);


  const rotate = useCallback(() => {
    if (gameOver || !currentPiece) return;
    const { shape } = currentPiece;
    const newShape = shape[0].map((_, colIndex) => shape.map(row => row[colIndex]).reverse());
    if (isValidMove(newShape, position)) {
      setCurrentPiece({ ...currentPiece, shape: newShape });
    }
  }, [currentPiece, gameOver, position]);


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowDown') drop();
      if (e.key === 'ArrowUp') rotate();
      if (e.code === 'Space') {
        e.preventDefault(); // a태그나 button태그가 아니기 때문에 필요없지만 다른 태그의 기본동작을 막기위해 습관적으로 추가
        hardDrop();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [move, drop, rotate, gameOver, hardDrop]);

  useEffect(() => {
    if (gameOver) return;
    const gameInterval = setInterval(drop, 500);
    return () => clearInterval(gameInterval);
  }, [drop, gameOver]);


  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if(boardY < ROWS && boardX < COLS) {
               displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        });
      });
    }

    return displayBoard.map((row, y) =>
      row.map((cell, x) => <div key={`${y}-${x}`} className={`cell ${cell ? 'filled' : ''}`} style={{ backgroundColor: cell || '#333' }}></div>)
    );
  };

  return (
    <div className="tetris-container">
        <h1>테트리스 게임</h1>
        <div className="tetris-board">
            {renderBoard()}
        </div>
        <div className="tetris-info">
            <p>Score: {score}</p>
            {gameOver && <div className="game-over">GAME OVER <button onClick={resetGame}>Play Again</button></div>}
        </div>
    </div>
  );
};

export default Tetris;
