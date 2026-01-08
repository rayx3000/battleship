import Player from './logic/Player.js';
import ComputerPlayer from './logic/ComputerPlayer.js';
import Ship from './logic/Ship.js';
import { renderBoard, addAttackListener, updateCell, updateShipsAlive } from './dom.js';

const player = Player('Player');
const computer = ComputerPlayer();
let gameOver = false;

const SHIP_LENGTHS = [5, 4, 3, 3, 2];

function randomlyPlaceShips(gameboard) {
    gameboard.reset();
    for (const length of SHIP_LENGTHS) {
        const ship = Ship(length);
        let placed = false;
        while (!placed) {
            const row = Math.floor(Math.random() * 10);
            const col = Math.floor(Math.random() * 10);
            const isVertical = Math.random() < 0.5;
            placed = gameboard.placeShip(ship, row, col, isVertical);
        }
    }
}

const checkWinner = () => {
    const playerWon = computer.gameboard.allShipsSunk();
    const computerWon = player.gameboard.allShipsSunk();

    updateShipsAlive(player, computer);

    if (playerWon || computerWon) {
        gameOver = true;
        const winnerMessage = playerWon ? 'You win!' : 'Computer wins!';
        const turnHeader = document.querySelector('.game-turn h3');
        turnHeader.textContent = winnerMessage;
        
        document.getElementById('play-again-btn').style.display = 'block';
        
        const computerBoard = document.getElementById('computer-board');
        const newBoard = computerBoard.cloneNode(true);
        computerBoard.parentNode.replaceChild(newBoard, computerBoard);
    }
}

const gameLoop = (row, col) => {
    if (gameOver) return;

    try {
        const pRow = parseInt(row);
        const pCol = parseInt(col);
        player.attack(computer.gameboard, pRow, pCol);
        updateCell(computer.gameboard, 'computer-board', pRow, pCol);
        checkWinner();

        if (gameOver) return;

        document.querySelector('.game-turn h3').textContent = "Computer's Turn";

        setTimeout(() => {
            if (gameOver) return;
            const attackResult = computer.randomAttack(player.gameboard);
            updateCell(player.gameboard, 'player-board', attackResult.row, attackResult.col);
            checkWinner();
            if (!gameOver) {
                document.querySelector('.game-turn h3').textContent = "Player's Turn";
            }
        }, 1000);
    } catch (error) {
        console.warn(error.message);
    }
};

const startGame = () => {
    document.getElementById('randomize-ships-btn').style.display = 'none';
    document.getElementById('start-game-btn').style.display = 'none';
    const turnHeader = document.querySelector('.game-turn h3');
    turnHeader.textContent = "Player's Turn";
    turnHeader.style.display = 'block';

    addAttackListener(gameLoop);
};

const initGame = () => {
    gameOver = false;
    document.querySelector('.game-turn h3').style.display = 'none';
    document.getElementById('play-again-btn').style.display = 'none';
    document.getElementById('randomize-ships-btn').style.display = 'block';
    
    randomlyPlaceShips(player.gameboard);
    randomlyPlaceShips(computer.gameboard);

    renderBoard(player.gameboard, 'player-board', true);
    renderBoard(computer.gameboard, 'computer-board', false);
    
    updateShipsAlive(player, computer);

    document.getElementById('start-game-btn').style.display = 'block';
};

const addControlListeners = () => {
    document.getElementById('randomize-ships-btn').addEventListener('click', () => {
        if (gameOver) return;
        randomlyPlaceShips(player.gameboard);
        renderBoard(player.gameboard, 'player-board', true);
    });

    document.getElementById('start-game-btn').addEventListener('click', startGame);

    document.getElementById('play-again-btn').addEventListener('click', () => {
        initGame();
    });
};

export { initGame, addControlListeners };