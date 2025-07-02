
import { useState } from 'react';

const Index = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: 'snake',
      name: 'Snake',
      description: 'Classic snake game - eat the food and grow!',
      color: '#00ff00',
      icon: '🐍'
    },
    {
      id: 'pong', 
      name: 'Pong',
      description: 'Classic arcade pong - beat the AI!',
      color: '#00ccff',
      icon: '🏓'
    },
    {
      id: 'tictactoe',
      name: 'Tic Tac Toe',
      description: 'Classic strategy game - get three in a row!',
      color: '#ff00ff',
      icon: '⭕'
    }
  ];

  const renderGame = () => {
    switch (selectedGame) {
      case 'snake':
        const SnakeGame = require('../components/games/SnakeGame').default;
        return <SnakeGame />;
      case 'pong':
        const PongGame = require('../components/games/PongGame').default;
        return <PongGame />;
      case 'tictactoe':
        const TicTacToeGame = require('../components/games/TicTacToeGame').default;
        return <TicTacToeGame />;
      default:
        return null;
    }
  };

  if (selectedGame) {
    const backButtonStyle: React.CSSProperties = {
      position: 'fixed',
      top: '20px',
      left: '20px',
      padding: '10px 20px',
      backgroundColor: '#333',
      color: 'white',
      border: '2px solid #666',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontFamily: 'Arial, sans-serif',
      transition: 'all 0.3s ease',
      zIndex: 1000
    };

    return (
      <div>
        <button 
          onClick={() => setSelectedGame(null)}
          style={backButtonStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#555';
            e.currentTarget.style.borderColor = '#888';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#333';
            e.currentTarget.style.borderColor = '#666';
          }}
        >
          ← Back to Games
        </button>
        {renderGame()}
      </div>
    );
  }

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#1a1a1a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    fontFamily: 'Arial, sans-serif'
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '60px',
    color: 'white'
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '4rem',
    marginBottom: '20px'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    margin: '0 0 15px 0',
    background: 'linear-gradient(45deg, #ff00ff, #00ffff, #ffff00)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '1.3rem',
    color: '#ccc',
    margin: 0
  };

  const gamesGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    maxWidth: '900px',
    width: '100%'
  };

  const gameCardStyle = (color: string): React.CSSProperties => ({
    padding: '30px',
    backgroundColor: '#2a2a2a',
    border: `3px solid ${color}`,
    borderRadius: '15px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: 'white'
  });

  const gameIconStyle: React.CSSProperties = {
    fontSize: '3rem',
    marginBottom: '15px',
    display: 'block'
  };

  const gameNameStyle: React.CSSProperties = {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    margin: '0 0 10px 0'
  };

  const gameDescStyle: React.CSSProperties = {
    fontSize: '0.95rem',
    color: '#bbb',
    margin: 0,
    lineHeight: '1.4'
  };

  const instructionsStyle: React.CSSProperties = {
    marginTop: '50px',
    textAlign: 'center',
    color: '#888',
    fontSize: '0.9rem'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={iconStyle}>🎮</div>
        <h1 style={titleStyle}>
          Retro Games
        </h1>
        <p style={subtitleStyle}>Choose your classic adventure</p>
      </div>

      <div style={gamesGridStyle}>
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => setSelectedGame(game.id)}
            style={gameCardStyle(game.color)}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = `0 10px 25px ${game.color}33`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={gameIconStyle}>{game.icon}</span>
            <h3 style={gameNameStyle}>{game.name}</h3>
            <p style={gameDescStyle}>{game.description}</p>
          </div>
        ))}
      </div>

      <div style={instructionsStyle}>
        <p>Use arrow keys and spacebar to play • Click cards to start</p>
      </div>
    </div>
  );
};

export default Index;
