
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
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
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

  const getCellClass = (index: number) => {
    let baseClass = "w-20 h-20 border-2 border-purple-400 bg-gray-800 hover:bg-gray-700 transition-all duration-200 flex items-center justify-center text-4xl font-bold cursor-pointer transform hover:scale-105";
    
    if (winningLine?.includes(index)) {
      baseClass += " bg-gradient-to-br from-yellow-400 to-orange-500 animate-pulse";
    }
    
    if (board[index]) {
      baseClass += " cursor-not-allowed";
    }

    return baseClass;
  };

  const getPlayerColor = (player: Player) => {
    if (player === 'X') return 'text-blue-400';
    if (player === 'O') return 'text-red-400';
    return '';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4">Tic Tac Toe</h2>
        
        {!gameOver && (
          <p className="text-2xl text-gray-300">
            Current Player: <span className={`font-bold ${getPlayerColor(currentPlayer)}`}>{currentPlayer}</span>
          </p>
        )}
        
        {winner && (
          <div className="animate-bounce">
            <p className="text-3xl font-bold text-yellow-400 mb-2">
              🎉 Player {winner} Wins! 🎉
            </p>
          </div>
        )}
        
        {gameOver && !winner && (
          <p className="text-2xl font-bold text-gray-400">It's a Draw!</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 p-4 bg-gray-900 rounded-2xl shadow-2xl border-4 border-purple-600">
        {board.map((cell, index) => (
          <div
            key={index}
            className={getCellClass(index)}
            onClick={() => handleCellClick(index)}
          >
            <span className={getPlayerColor(cell)}>
              {cell}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg"
      >
        New Game
      </button>

      <div className="mt-6 text-center">
        <p className="text-gray-400">Click on a cell to make your move</p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <span className="text-blue-400 font-bold">X</span>
          <span className="text-gray-500">vs</span>
          <span className="text-red-400 font-bold">O</span>
        </div>
      </div>
    </div>
  );
};

export default TicTacToeGame;
