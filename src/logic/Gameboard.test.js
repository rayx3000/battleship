import Gameboard from './Gameboard';
import Ship from './Ship';

describe('Gameboard', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = Gameboard();
  });

  test('should create a 10x10 gameboard', () => {
    expect(gameboard.getBoard().length).toBe(10);
    expect(gameboard.getBoard().every(row => row.length === 10)).toBe(true);
  });

  test('should place a ship at specific coordinates (horizontally)', () => {
    const ship = Ship(3);
    gameboard.placeShip(ship, 0, 0, false);
    const board = gameboard.getBoard();
    expect(board[0][0]).not.toBeNull();
    expect(board[0][1]).not.toBeNull();
    expect(board[0][2]).not.toBeNull();
    expect(board[0][3]).toBeNull();
  });

  test('should place a ship at specific coordinates (vertically)', () => {
    const ship = Ship(3);
    gameboard.placeShip(ship, 0, 0, true);
    const board = gameboard.getBoard();
    expect(board[0][0]).not.toBeNull();
    expect(board[1][0]).not.toBeNull();
    expect(board[2][0]).not.toBeNull();
    expect(board[3][0]).toBeNull();
  });

  test('should not place a ship if it goes out of bounds', () => {
    const ship = Ship(4);
    expect(gameboard.placeShip(ship, 0, 8, false)).toBe(false);
    expect(gameboard.placeShip(ship, 8, 0, true)).toBe(false);
  });

  test('should not place a ship if it overlaps with another ship', () => {
    const ship1 = Ship(3);
    const ship2 = Ship(3);
    gameboard.placeShip(ship1, 0, 0, false);
    expect(gameboard.placeShip(ship2, 0, 1, false)).toBe(false);
  });

  test('should receive an attack and hit a ship', () => {
    const ship = Ship(3);
    gameboard.placeShip(ship, 0, 0, false);
    expect(gameboard.receiveAttack(0, 0)).toBe(true);
    expect(ship.getHits()).toBe(1);
  });

  test('should receive an attack and miss', () => {
    expect(gameboard.receiveAttack(0, 0)).toBe(false);
    expect(gameboard.getMissedAttacks()).toContainEqual([0, 0]);
  });

  test('should not allow attacking the same coordinate twice', () => {
    gameboard.receiveAttack(0, 0);
    expect(() => gameboard.receiveAttack(0, 0)).toThrow('Coordinate already attacked');
  });
  
  test('should report that not all ships are sunk', () => {
    const ship = Ship(3);
    gameboard.placeShip(ship, 0, 0, false);
    gameboard.receiveAttack(0, 0);
    expect(gameboard.allShipsSunk()).toBe(false);
  });

  test('should report that all ships are sunk', () => {
    const ship = Ship(2);
    gameboard.placeShip(ship, 0, 0, false);
    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(0, 1);
    expect(gameboard.allShipsSunk()).toBe(true);
  });

  test('should reset the gameboard', () => {
    const ship = Ship(2);
    gameboard.placeShip(ship, 0, 0, false);
    gameboard.receiveAttack(5, 5); // Miss
    gameboard.reset();

    const board = gameboard.getBoard();
    const isBoardEmpty = board.every(row => row.every(cell => cell === null));
    expect(isBoardEmpty).toBe(true);

    expect(gameboard.getMissedAttacks().length).toBe(0);
    expect(gameboard.allShipsSunk()).toBe(true);
  });
});
