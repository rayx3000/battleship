import Player from './logic/Player.js';
import ComputerPlayer from './logic/ComputerPlayer.js';
import Ship from './logic/Ship.js';
import { renderBoard, addAttackListener, updateCell, updateShipsAlive } from './dom.js';

let player1;
let player2;
let currentPlayer;
let gameOver = false;
let gameMode;

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
    const player1Won = player2.gameboard.allShipsSunk();
    const player2Won = player1.gameboard.allShipsSunk();

    updateShipsAlive(player1, player2);

    if (player1Won || player2Won) {
        gameOver = true;
        let winnerMessage;
        if (gameMode === 'pvc') {
            winnerMessage = player1Won ? 'You win!' : 'Computer wins!';
        } else {
            winnerMessage = player1Won ? 'Player 1 wins!' : 'Player 2 wins!';
        }
        const turnHeader = document.querySelector('.game-turn h3');
        turnHeader.textContent = winnerMessage;
        
        document.getElementById('play-again-btn').style.display = 'block';
        
        const opponentBoardId = (currentPlayer === player1) ? 'player2-board' : 'player-board';
        const opponentBoard = document.getElementById(opponentBoardId);
        if (opponentBoard) {
            const newBoard = opponentBoard.cloneNode(true);
            opponentBoard.parentNode.replaceChild(newBoard, opponentBoard);
        }
    }
}

const switchTurn = () => {
    currentPlayer = (currentPlayer === player1) ? player2 : player1;
    const turnHeader = document.querySelector('.game-turn h3');
    if (gameMode === 'pvc') {
        turnHeader.textContent = (currentPlayer === player1) ? "Player's Turn" : "Computer's Turn";
    } else {
        turnHeader.textContent = (currentPlayer === player1) ? "Player 1's Turn" : "Player 2's Turn";
        if (currentPlayer === player1) {
            renderBoard(player1.gameboard, 'player-board', true);
            renderBoard(player2.gameboard, 'player2-board', false);
        } else {
            renderBoard(player1.gameboard, 'player-board', false);
            renderBoard(player2.gameboard, 'player2-board', true);
        }
    }
}

const gameLoopPvp = (row, col) => {
    if (gameOver) return;

    try {
        const pRow = parseInt(row);
        const pCol = parseInt(col);

        const opponent = (currentPlayer === player1) ? player2 : player1;
        const opponentBoardId = (currentPlayer === player1) ? 'player2-board' : 'player-board';

        currentPlayer.attack(opponent.gameboard, pRow, pCol);
        updateCell(opponent.gameboard, opponentBoardId, pRow, pCol);
        checkWinner();

        if (!gameOver) {
            switchTurn();
            const nextOpponentBoardId = (currentPlayer === player1) ? 'player2-board' : 'player-board';
            addAttackListener(gameLoopPvp, nextOpponentBoardId);
        }
    } catch (error) {
        console.warn(error.message);
    }
}

const gameLoopPvc = (row, col) => {
    if (gameOver) return;

    try {
        const pRow = parseInt(row);
        const pCol = parseInt(col);
        player1.attack(player2.gameboard, pRow, pCol);
        updateCell(player2.gameboard, 'player2-board', pRow, pCol);
        checkWinner();

        if (gameOver) return;

        document.querySelector('.game-turn h3').textContent = "Computer's Turn";

        setTimeout(() => {
            if (gameOver) return;
            const attackResult = player2.randomAttack(player1.gameboard);
            updateCell(player1.gameboard, 'player-board', attackResult.row, attackResult.col);
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
    document.querySelector('.player2-board').classList.remove('hidden');
    document.getElementById('randomize-ships-btn').style.display = 'none';
    document.getElementById('start-game-btn').style.display = 'none';
    const turnHeader = document.querySelector('.game-turn h3');
    turnHeader.style.display = 'block';

    if (gameMode === 'pvc') {
        turnHeader.textContent = "Player's Turn";
        addAttackListener(gameLoopPvc, 'player2-board');
    } else {
        turnHeader.textContent = "Player 1's Turn";
        renderBoard(player1.gameboard, 'player-board', true);
        renderBoard(player2.gameboard, 'player2-board', false);
        addAttackListener(gameLoopPvp, 'player2-board');
    }
};

const initGame = (mode) => {
    gameMode = mode;
    gameOver = false;
    
    player1 = Player('Player 1');
    if (gameMode === 'pvc') {
        player2 = ComputerPlayer();
    } else { // pvp
        player2 = Player('Player 2');
    }
    currentPlayer = player1;

    document.querySelector('.player2-board').classList.add('hidden');
    document.querySelector('.game-turn h3').style.display = 'none';
    document.getElementById('play-again-btn').style.display = 'none';
    document.getElementById('randomize-ships-btn').style.display = 'block';
    
    randomlyPlaceShips(player1.gameboard);
    randomlyPlaceShips(player2.gameboard);

    renderBoard(player1.gameboard, 'player-board', true);
    renderBoard(player2.gameboard, 'player2-board', true); // show ships for placement phase
    
    updateShipsAlive(player1, player2);

    document.getElementById('start-game-btn').style.display = 'block';
};

const addControlListeners = (mode) => {
    const randomizeBtn = document.getElementById('randomize-ships-btn');
    const newRandomizeBtn = randomizeBtn.cloneNode(true);
    randomizeBtn.parentNode.replaceChild(newRandomizeBtn, randomizeBtn);
    newRandomizeBtn.addEventListener('click', () => {
        if (gameOver) return;
        randomlyPlaceShips(player1.gameboard);
        renderBoard(player1.gameboard, 'player-board', true);
    });

    const startBtn = document.getElementById('start-game-btn');
    const newStartBtn = startBtn.cloneNode(true);
    startBtn.parentNode.replaceChild(newStartBtn, startBtn);
    newStartBtn.addEventListener('click', startGame);

    const playAgainBtn = document.getElementById('play-again-btn');
    const newPlayAgainBtn = playAgainBtn.cloneNode(true);
    playAgainBtn.parentNode.replaceChild(newPlayAgainBtn, playAgainBtn);
    newPlayAgainBtn.addEventListener('click', () => {
        if(mode === 'pvc') {
            document.getElementById('player2-name').textContent = 'Computer';
        } else {
            document.getElementById('player1-name').textContent = 'Player 1';
            document.getElementById('player2-name').textContent = 'Player 2';
        }
        initGame(mode);
    });
};

export { initGame, addControlListeners };