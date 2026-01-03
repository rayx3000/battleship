import Player from './Player';
import Gameboard from './Gameboard';

describe('Player', () => {
  let player;
  let enemyGameboard;

  beforeEach(() => {
    player = Player('Player 1');
    enemyGameboard = Gameboard();
  });

  test('should create a player with a name', () => {
    expect(player.name).toBe('Player 1');
  });

  test('should have a gameboard', () => {
    expect(player.gameboard).toBeDefined();
  });

  test('should be able to attack an enemy gameboard', () => {
    const spy = jest.spyOn(enemyGameboard, 'receiveAttack');
    player.attack(enemyGameboard, 0, 0);
    expect(spy).toHaveBeenCalledWith(0, 0);
  });
});
