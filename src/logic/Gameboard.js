import Ship from './Ship.js';

const Gameboard = () => {
  const board = Array(10).fill(null).map(() => Array(10).fill(null));
  const ships = [];
  const missedAttacks = [];
  const attackedCoords = new Set();

  const getBoard = () => board;

  const placeShip = (ship, row, col, isVertical) => {
    if (isVertical) {
      if (row + ship.length > 10) return false;
      for (let i = 0; i < ship.length; i++) {
        if (board[row + i][col]) return false;
      }
      for (let i = 0; i < ship.length; i++) {
        board[row + i][col] = { ship, index: i };
      }
    } else {
      if (col + ship.length > 10) return false;
      for (let i = 0; i < ship.length; i++) {
        if (board[row][col + i]) return false;
      }
      for (let i = 0; i < ship.length; i++) {
        board[row][col + i] = { ship, index: i };
      }
    }
    ships.push(ship);
    return true;
  };

  const receiveAttack = (row, col) => {
    const coord = `${row},${col}`;
    if (attackedCoords.has(coord)) {
      throw new Error('Coordinate already attacked');
    }
    attackedCoords.add(coord);

    if (board[row][col]) {
      const { ship } = board[row][col];
      ship.hit();
      return true;
    } else {
      missedAttacks.push([row, col]);
      return false;
    }
  };

  const getMissedAttacks = () => missedAttacks;

  const allShipsSunk = () => ships.every(ship => ship.isSunk());

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j] = null;
      }
    }
    ships.length = 0;
    missedAttacks.length = 0;
    attackedCoords.clear();
  };

  const getAttackedCoords = () => attackedCoords;

  return {
    getBoard,
    placeShip,
    receiveAttack,
    getMissedAttacks,
    allShipsSunk,
    reset,
    getAttackedCoords,
  };
};

export default Gameboard;