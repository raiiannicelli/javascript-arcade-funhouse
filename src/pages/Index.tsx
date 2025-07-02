
import { useState } from 'react';
import { Gamepad2, ArrowLeft } from 'lucide-react';
import SnakeGame from '../components/games/SnakeGame';
import PongGame from '../components/games/PongGame';
import TicTacToeGame from '../components/games/TicTacToeGame';

const Index = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: 'snake',
      name: 'Snake',
      description: 'Classic snake game - eat the food and grow!',
      color: 'from-green-400 to-emerald-600',
      icon: '🐍'
    },
    {
      id: 'pong', 
      name: 'Pong',
      description: 'Classic arcade pong - beat the AI!',
      color: 'from-blue-400 to-cyan-600',
      icon: '🏓'
    },
    {
      id: 'tictactoe',
      name: 'Tic Tac Toe',
      description: 'Classic strategy game - get three in a row!',
      color: 'from-purple-400 to-pink-600',
      icon: '⭕'
    }
  ];

  const renderGame = () => {
    switch (selectedGame) {
      case 'snake':
        return <SnakeGame />;
      case 'pong':
        return <PongGame />;
      case 'tictactoe':
        return <TicTacToeGame />;
      default:
        return null;
    }
  };

  if (selectedGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="p-4">
          <button 
            onClick={() => setSelectedGame(null)}
            className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Games
          </button>
        </div>
        {renderGame()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Gamepad2 className="text-6xl text-purple-400" size={60} />
        </div>
        <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Retro Games
        </h1>
        <p className="text-xl text-gray-300">Choose your classic adventure</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl w-full">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => setSelectedGame(game.id)}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
          >
            <div className={`bg-gradient-to-br ${game.color} p-8 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300`}>
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {game.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                <p className="text-white/80 text-sm">{game.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-400">Use arrow keys and spacebar to play • Click cards to start</p>
      </div>
    </div>
  );
};

export default Index;
