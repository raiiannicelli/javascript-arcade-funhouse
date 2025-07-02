
import { useState, useEffect, useCallback, useRef } from 'react';

const PongGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const animationRef = useRef<number>();

  const gameState = useRef({
    ball: { x: 400, y: 200, dx: 5, dy: 3, size: 8 },
    playerPaddle: { x: 20, y: 150, width: 10, height: 80, speed: 8 },
    aiPaddle: { x: 770, y: 150, width: 10, height: 80, speed: 6 },
    keys: { up: false, down: false }
  });

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 400;
  const WINNING_SCORE = 5;

  const resetBall = () => {
    gameState.current.ball = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: Math.random() > 0.5 ? 5 : -5,
      dy: (Math.random() - 0.5) * 6,
      size: 8
    };
  };

  const resetGame = () => {
    setScore({ player: 0, ai: 0 });
    setGameOver(false);
    resetBall();
    gameState.current.playerPaddle.y = 150;
    gameState.current.aiPaddle.y = 150;
  };

  const updateGame = useCallback(() => {
    const { ball, playerPaddle, aiPaddle, keys } = gameState.current;

    // Move player paddle
    if (keys.up && playerPaddle.y > 0) {
      playerPaddle.y -= playerPaddle.speed;
    }
    if (keys.down && playerPaddle.y < CANVAS_HEIGHT - playerPaddle.height) {
      playerPaddle.y += playerPaddle.speed;
    }

    // Move AI paddle
    const aiCenter = aiPaddle.y + aiPaddle.height / 2;
    if (aiCenter < ball.y - 35) {
      aiPaddle.y += aiPaddle.speed;
    } else if (aiCenter > ball.y + 35) {
      aiPaddle.y -= aiPaddle.speed;
    }

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top/bottom walls
    if (ball.y <= ball.size || ball.y >= CANVAS_HEIGHT - ball.size) {
      ball.dy = -ball.dy;
    }

    // Ball collision with paddles
    if (
      ball.x - ball.size <= playerPaddle.x + playerPaddle.width &&
      ball.y >= playerPaddle.y &&
      ball.y <= playerPaddle.y + playerPaddle.height &&
      ball.dx < 0
    ) {
      ball.dx = -ball.dx;
      ball.dy += (ball.y - (playerPaddle.y + playerPaddle.height / 2)) * 0.1;
    }

    if (
      ball.x + ball.size >= aiPaddle.x &&
      ball.y >= aiPaddle.y &&
      ball.y <= aiPaddle.y + aiPaddle.height &&
      ball.dx > 0
    ) {
      ball.dx = -ball.dx;
      ball.dy += (ball.y - (aiPaddle.y + aiPaddle.height / 2)) * 0.1;
    }

    // Score points
    if (ball.x < 0) {
      setScore(prev => {
        const newScore = { ...prev, ai: prev.ai + 1 };
        if (newScore.ai >= WINNING_SCORE) {
          setGameOver(true);
          setGameStarted(false);
        }
        return newScore;
      });
      resetBall();
    } else if (ball.x > CANVAS_WIDTH) {
      setScore(prev => {
        const newScore = { ...prev, player: prev.player + 1 };
        if (newScore.player >= WINNING_SCORE) {
          setGameOver(true);
          setGameStarted(false);
        }
        return newScore;
      });
      resetBall();
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const { ball, playerPaddle, aiPaddle } = gameState.current;

    // Draw center line
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
    
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

    // Draw ball
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();

    // Draw trail effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(ball.x - ball.dx, ball.y - ball.dy, ball.size * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const gameLoop = useCallback(() => {
    if (gameStarted && !gameOver) {
      updateGame();
      draw();
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameStarted, gameOver, updateGame, draw]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoop();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop, gameStarted, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      
      switch (e.key) {
        case 'ArrowUp':
          gameState.current.keys.up = true;
          break;
        case 'ArrowDown':
          gameState.current.keys.down = true;
          break;
        case 'w':
        case 'W':
          gameState.current.keys.up = true;
          break;
        case 's':
        case 'S':
          gameState.current.keys.down = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          gameState.current.keys.up = false;
          break;
        case 'ArrowDown':
          gameState.current.keys.down = false;
          break;
        case 'w':
        case 'W':
          gameState.current.keys.up = false;
          break;
        case 's':
        case 'S':
          gameState.current.keys.down = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startGame = () => {
    resetGame();
    setGameStarted(true);
  };

  useEffect(() => {
    draw();
  }, [draw]);

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
    margin: '0 0 20px 0',
    color: '#00ccff'
  };

  const scoreContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '40px',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  };

  const playerScoreStyle: React.CSSProperties = {
    color: '#00ff88'
  };

  const aiScoreStyle: React.CSSProperties = {
    color: '#ff4444'
  };

  const gameAreaStyle: React.CSSProperties = {
    position: 'relative'
  };

  const canvasStyle: React.CSSProperties = {
    border: '3px solid #00ccff',
    borderRadius: '8px',
    backgroundColor: '#000',
    cursor: 'none'
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
    backgroundColor: '#00ccff',
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
        <h2 style={titleStyle}>Pong</h2>
        <div style={scoreContainerStyle}>
          <span style={playerScoreStyle}>Jogador: {score.player}</span>
          <span style={aiScoreStyle}>IA: {score.ai}</span>
        </div>
      </div>

      <div style={gameAreaStyle}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={canvasStyle}
        />

        {(!gameStarted || gameOver) && (
          <div style={overlayStyle}>
            {gameOver && (
              <div style={gameOverStyle}>
                <h3 style={{ fontSize: '2rem', color: '#00ccff', margin: '0 0 10px 0' }}>
                  {score.player >= WINNING_SCORE ? 'Você Venceu!' : 'IA Venceu!'}
                </h3>
                <p style={{ margin: 0 }}>
                  Placar Final: {score.player} - {score.ai}
                </p>
              </div>
            )}
            <button
              onClick={startGame}
              style={buttonStyle}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0099cc'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00ccff'}
            >
              {gameOver ? 'Jogar Novamente' : 'Iniciar Jogo'}
            </button>
          </div>
        )}
      </div>

      <p style={instructionsStyle}>
        Use as setas do teclado ou W/S para controlar sua raquete • Primeiro a {WINNING_SCORE} pontos vence
      </p>
    </div>
  );
};

export default PongGame;
