
import { useState } from 'react';

type Player = 'X' | 'O' | null;
type Board = Player[];

const TicTacToeGame = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
    [0, 4, 8], [2, 4, 6] // Diagonais
  ];

  const checkWinner = (board: Board): { winner: Player; line: number[] | null } => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: combination };
      }
    }
    return { winner: null, line: null };
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setGameOver(true);
    } else if (newBoard.every(cell => cell !== null)) {
      setGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
    setGameOver(false);
  };

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
    marginBottom: '40px',
    color: 'white'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0 0 20px 0',
    color: '#ff00ff'
  };

  const currentPlayerStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    margin: 0,
    color: '#ccc'
  };

  const gameOverTextStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
    color: '#ffff00'
  };

  const drawTextStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
    color: '#ccc'
  };

  const boardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '5px',
    padding: '20px',
    backgroundColor: '#333',
    borderRadius: '10px',
    border: '3px solid #ff00ff'
  };

  const cellBaseStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    backgroundColor: '#555',
    border: '2px solid #777',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderRadius: '5px'
  };

  const winningCellStyle: React.CSSProperties = {
    ...cellBaseStyle,
    backgroundColor: '#ffff00',
    color: '#000'
  };

  const xStyle: React.CSSProperties = {
    color: '#00aaff'
  };

  const oStyle: React.CSSProperties = {
    color: '#ff4444'
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: '30px',
    padding: '12px 24px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    backgroundColor: '#ff00ff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  };

  const instructionsStyle: React.CSSProperties = {
    marginTop: '30px',
    textAlign: 'center',
    color: '#ccc',
    fontSize: '0.9rem'
  };

  const playersStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '10px',
    fontSize: '1.2rem',
    fontWeight: 'bold'
  };

  const getPlayerColor = (player: Player) => {
    if (player === 'X') return xStyle;
    if (player === 'O') return oStyle;
    return {};
  };

  return (
    <div style={gameContainerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Jogo da Velha</h2>
        
        {!gameOver && (
          <p style={currentPlayerStyle}>
            Jogador Atual: <span style={getPlayerColor(currentPlayer)}>{currentPlayer}</span>
          </p>
        )}
        
        {winner && (
          <div>
            <p style={gameOverTextStyle}>
              🎉 Jogador {winner} Venceu! 🎉
            </p>
          </div>
        )}
        
        {gameOver && !winner && (
          <p style={drawTextStyle}>Empate!</p>
        )}
      </div>

      <div style={boardStyle}>
        {board.map((cell, index) => {
          const isWinningCell = winningLine?.includes(index);
          const cellStyle = isWinningCell ? winningCellStyle : cellBaseStyle;
          
          return (
            <div
              key={index}
              style={cellStyle}
              onClick={() => handleCellClick(index)}
              onMouseOver={(e) => {
                if (!cell && !gameOver) {
                  e.currentTarget.style.backgroundColor = '#666';
                }
              }}
              onMouseOut={(e) => {
                if (!isWinningCell) {
                  e.currentTarget.style.backgroundColor = '#555';
                }
              }}
            >
              <span style={getPlayerColor(cell)}>
                {cell}
              </span>
            </div>
          );
        })}
      </div>

      <button
        onClick={resetGame}
        style={buttonStyle}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#cc00cc'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff00ff'}
      >
        Novo Jogo
      </button>

      <div style={instructionsStyle}>
        <p>Clique em uma célula para fazer sua jogada</p>
        <div style={playersStyle}>
          <span style={xStyle}>X</span>
          <span style={{ color: '#888' }}>vs</span>
          <span style={oStyle}>O</span>
        </div>
      </div>
    </div>
  );
};

export default TicTacToeGame;
