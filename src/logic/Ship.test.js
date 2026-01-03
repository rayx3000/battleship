import Ship from './Ship';

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = Ship(3);
  });

  test('should create a ship with the correct length', () => {
    expect(ship.length).toBe(3);
  });

  test('should have 0 hits initially', () => {
    expect(ship.getHits()).toBe(0);
  });

  test('should not be sunk initially', () => {
    expect(ship.isSunk()).toBe(false);
  });

  test('should increment hits when hit() is called', () => {
    ship.hit();
    expect(ship.getHits()).toBe(1);
  });

  test('should not be sunk after one hit', () => {
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  });

  test('should be sunk when hits equal length', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test('should not be able to hit a sunk ship', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.getHits()).toBe(3);
  });
});
