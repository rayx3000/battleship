import Gameboard from './Gameboard.js';

const Player = (name) => {
  const gameboard = Gameboard();

  const attack = (enemyGameboard, row, col) => {
    return enemyGameboard.receiveAttack(row, col);
  };

  return {
    name,
    gameboard,
    attack,
  };
};

export default Player;