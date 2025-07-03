
import { useState, useEffect, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

const SnakeGame = () => {
  const BOARD_SIZE = 20;
  const INITIAL_SNAKE = [{ x: 10, y: 10 }];
  const INITIAL_DIRECTION = { x: 0, y: -1 };
  const INITIAL_FOOD = { x: 15, y: 15 };

  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(INITIAL_FOOD);
    setGameOver(false);
    setScore(0);
    setIsPlaying(false);
  };

  const startGame = () => {
    resetGame();
    setIsPlaying(true);
  };

  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPlaying, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      e.preventDefault();
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  const gameContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#1a1a1a',
    fontFamily: 'Arial, sans-serif'
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '30px',
    color: 'white'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
    color: '#00ff00'
  };

  const scoreStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    margin: 0,
    color: '#ffff00'
  };

  const gameAreaStyle: React.CSSProperties = {
    position: 'relative'
  };

  const boardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${BOARD_SIZE}, 20px)`,
    gap: '1px',
    padding: '10px',
    backgroundColor: '#333',
    border: '3px solid #00ff00',
    borderRadius: '8px'
  };

  const cellStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    backgroundColor: '#000'
  };

  const snakeHeadStyle: React.CSSProperties = {
    ...cellStyle,
    backgroundColor: '#00ff00',
    borderRadius: '3px'
  };

  const snakeBodyStyle: React.CSSProperties = {
    ...cellStyle,
    backgroundColor: '#008800',
    borderRadius: '2px'
  };

  const foodStyle: React.CSSProperties = {
    ...cellStyle,
    backgroundColor: '#ff0000',
    borderRadius: '50%'
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px'
  };

  const gameOverStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '20px',
    color: 'white'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    backgroundColor: '#00ff00',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  };

  const instructionsStyle: React.CSSProperties = {
    color: '#ccc',
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '0.9rem'
  };

  return (
    <div style={gameContainerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Jogo da Cobrinha</h2>
        <p style={scoreStyle}>Pontuação: {score}</p>
      </div>

      <div style={gameAreaStyle}>
        <div style={boardStyle}>
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
            const x = index % BOARD_SIZE;
            const y = Math.floor(index / BOARD_SIZE);
            const isSnake = snake.some(segment => segment.x === x && segment.y === y);
            const isHead = snake[0]?.x === x && snake[0]?.y === y;
            const isFood = food.x === x && food.y === y;

            let cellStyleToUse = cellStyle;
            if (isSnake) {
              cellStyleToUse = isHead ? snakeHeadStyle : snakeBodyStyle;
            } else if (isFood) {
              cellStyleToUse = foodStyle;
            }

            return (
              <div
                key={index}
                style={cellStyleToUse}
              />
            );
          })}
        </div>

        {(!isPlaying || gameOver) && (
          <div style={overlayStyle}>
            {gameOver && (
              <div style={gameOverStyle}>
                <h3 style={{ fontSize: '2rem', color: '#ff0000', margin: '0 0 10px 0' }}>Fim de Jogo!</h3>
                <p style={{ margin: 0 }}>Pontuação Final: {score}</p>
              </div>
            )}
            <button
              onClick={startGame}
              style={buttonStyle}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#00cc00'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00ff00'}
            >
              {gameOver ? 'Jogar Novamente' : 'Iniciar Jogo'}
            </button>
          </div>
        )}
      </div>

      <p style={instructionsStyle}>
        Use as setas do teclado para controlar a cobra • Coma a comida vermelha para crescer
      </p>
    </div>
  );
};

export default SnakeGame;
