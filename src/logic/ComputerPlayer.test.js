import ComputerPlayer from './ComputerPlayer';
import Gameboard from './Gameboard';

describe('ComputerPlayer', () => {
  let computer;
  let enemyGameboard;

  beforeEach(() => {
    computer = ComputerPlayer();
    enemyGameboard = Gameboard();
  });

  test('should create a computer player with a default name', () => {
    expect(computer.name).toBe('Computer');
  });

  test('should have a gameboard', () => {
    expect(computer.gameboard).toBeDefined();
  });

  test('should be able to make a random attack', () => {
    const spy = jest.spyOn(enemyGameboard, 'receiveAttack');
    computer.randomAttack(enemyGameboard);
    expect(spy).toHaveBeenCalled();
  });

  test('should not attack the same coordinate twice', () => {
    const attacks = new Set();
    for (let i = 0; i < 100; i++) {
      const { row, col } = computer.randomAttack(enemyGameboard);
      const coord = `${row},${col}`;
      expect(attacks.has(coord)).toBe(false);
      attacks.add(coord);
    }
  });
});
