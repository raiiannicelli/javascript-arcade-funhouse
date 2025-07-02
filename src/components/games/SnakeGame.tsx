
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

      // Check wall collision
      if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-white mb-2">Snake Game</h2>
        <p className="text-2xl text-green-400">Score: {score}</p>
      </div>

      <div className="relative">
        <div 
          className="grid gap-0 border-4 border-green-400 bg-black p-2 rounded-lg shadow-2xl"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
            width: `${BOARD_SIZE * 20}px`,
            height: `${BOARD_SIZE * 20}px`
          }}
        >
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
            const x = index % BOARD_SIZE;
            const y = Math.floor(index / BOARD_SIZE);
            const isSnake = snake.some(segment => segment.x === x && segment.y === y);
            const isHead = snake[0]?.x === x && snake[0]?.y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={index}
                className={`w-5 h-5 ${
                  isSnake
                    ? isHead
                      ? 'bg-green-400 rounded-sm shadow-lg'
                      : 'bg-green-600 rounded-sm'
                    : isFood
                    ? 'bg-red-500 rounded-full animate-pulse'
                    : 'bg-gray-800'
                }`}
              />
            );
          })}
        </div>

        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg">
            {gameOver && (
              <div className="text-center mb-4">
                <h3 className="text-3xl font-bold text-red-400 mb-2">Game Over!</h3>
                <p className="text-white">Final Score: {score}</p>
              </div>
            )}
            <button
              onClick={startGame}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
            >
              {gameOver ? 'Play Again' : 'Start Game'}
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-400 mt-4 text-center">
        Use arrow keys to control the snake • Eat the red food to grow
      </p>
    </div>
  );
};

export default SnakeGame;
