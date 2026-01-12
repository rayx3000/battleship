import { JSDOM } from 'jsdom';
import { startGame } from '../game';

describe('UI updates on game start', () => {
  let dom;
  let document;
  let header;
  let gameOptionsBtn;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <header class="center-content">
            <h1>Test</h1>
            <button id="game-options-btn" style="display: none;"></button>
          </header>
          <div id="randomize-ships-btn"></div>
          <div id="start-game-btn"></div>
          <div class="game-turn"><h3></h3></div>
          <div id="player1-ships"></div>
          <div id="player2-ships"></div>
          <div id="player2-board"></div>
        </body>
      </html>
    `);
    document = dom.window.document;
    global.document = document;
    header = document.querySelector('header');
    gameOptionsBtn = document.getElementById('game-options-btn');
  });

  test('should show game options button and un-center header when game starts', () => {
    // Manually set up the game state needed for startGame to run
    const player1 = { gameboard: { getShips: () => [], allShipsSunk: () => false }, name: 'Player 1' };
    const player2 = { gameboard: { getShips: () => [], allShipsSunk: () => false }, name: 'Player 2' };

    // Mock necessary functions and objects
    const mockRenderBoard = jest.fn();
    const mockAddAttackListener = jest.fn();
    const mockUpdateShipsAlive = jest.fn();
    
    // Set up a basic game state
    startGame(player1, player2, 'pvc', mockRenderBoard, mockAddAttackListener, mockUpdateShipsAlive);

    expect(gameOptionsBtn.classList.contains('visible-inline-block')).toBe(true);
    expect(header.classList.contains('center-content')).toBe(false);
  });
});
