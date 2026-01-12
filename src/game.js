import Player from './logic/Player.js';
import ComputerPlayer from './logic/ComputerPlayer.js';
import Ship from './logic/Ship.js';
import { renderBoard, addAttackListener, updateCell, updateShipsAlive, addDragAndDropListeners } from './dom.js';

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

function placeShipOnBoard(length, row, col, isVertical, shipId) {
    const activePlayer = placementTurn === 1 ? player1 : player2;
    const boardId = placementTurn === 1 ? 'player-board' : 'player2-board';

    const ship = Ship(parseInt(length));
    const placed = activePlayer.gameboard.placeShip(ship, row, col, isVertical);

    if (placed) {
        renderBoard(activePlayer.gameboard, boardId, true);
        const shipElement = document.getElementById(shipId);
        if (shipElement) {
            shipElement.classList.add('hidden'); // Or remove it
        }

        const allShipsPlaced = activePlayer.gameboard.getShips().length === SHIP_LENGTHS.length;
        if (allShipsPlaced) {
            if (gameMode === 'pvp') {
                document.getElementById('start-game-btn').disabled = false;
            }
        }
    }
}

function initManualPlacement() {
    const activePlayer = placementTurn === 1 ? player1 : player2;
    activePlayer.gameboard.reset();
    const boardId = placementTurn === 1 ? 'player-board' : 'player2-board';
    renderBoard(activePlayer.gameboard, boardId, true);
    addDragAndDropListeners(placeShipOnBoard);
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
        
        document.getElementById('play-again-btn').classList.remove('hidden');
        
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

let placementTurn;

const startGame = () => {
    document.getElementById('randomize-ships-btn').classList.add('hidden');
    document.getElementById('start-game-btn').classList.add('hidden');
    const turnHeader = document.querySelector('.game-turn h3');
    turnHeader.classList.remove('hidden');

    const gameOptionsBtn = document.getElementById('game-options-btn');
    gameOptionsBtn.classList.add('visible-inline-block');
    const header = document.querySelector('header');
    header.classList.remove('center-content');

    if (gameMode === 'pvc') {
        updateShipsAlive(player1, player2);
        renderBoard(player2.gameboard, 'player2-board', false);
        turnHeader.textContent = "Player's Turn";
        addAttackListener(gameLoopPvc, 'player2-board');
    } else { // pvp
        currentPlayer = player1;
        updateShipsAlive(player1, player2);
        document.querySelector('.player-board').classList.remove('hidden');
        document.querySelector('.player2-board').classList.remove('hidden');
        renderBoard(player1.gameboard, 'player-board', true);
        renderBoard(player2.gameboard, 'player2-board', false);
        document.querySelector('.game-turn h3').textContent = "Player 1's Turn";
        addAttackListener(gameLoopPvp, 'player2-board');
    }
};

const initGame = (mode) => {
    gameMode = mode;
    gameOver = false;
    
    player1 = Player('Player 1');

    if (gameMode === 'pvc') {
        randomlyPlaceShips(player1.gameboard);
        player2 = ComputerPlayer();
        randomlyPlaceShips(player2.gameboard);
        document.querySelector('.player2-board').classList.remove('hidden');
        updateShipsAlive(player1, player2);
    } else { // pvp
        player2 = Player('Player 2');
        placementTurn = 1;
        initManualPlacement();
        document.querySelector('.player2-board').classList.add('hidden');
        document.getElementById('start-game-btn').textContent = 'Next';
        document.getElementById('start-game-btn').disabled = true;
        document.getElementById('player1-ships').textContent = '5';
        document.getElementById('player2-ships').textContent = '5';
    }
    
    currentPlayer = player1;
    document.querySelector('.player-board').classList.remove('hidden');
    renderBoard(player1.gameboard, 'player-board', true);
    
    document.querySelector('.game-turn h3').classList.add('hidden');
    document.getElementById('play-again-btn').classList.add('hidden');
    document.getElementById('randomize-ships-btn').classList.remove('hidden');
    document.getElementById('start-game-btn').classList.remove('hidden');
};

const addControlListeners = (mode) => {
    const randomizeBtn = document.getElementById('randomize-ships-btn');
    const startBtn = document.getElementById('start-game-btn');
    const playAgainBtn = document.getElementById('play-again-btn');

    const newRandomizeBtn = randomizeBtn.cloneNode(true);
    randomizeBtn.parentNode.replaceChild(newRandomizeBtn, randomizeBtn);
    
    const newStartBtn = startBtn.cloneNode(true);
    startBtn.parentNode.replaceChild(newStartBtn, startBtn);

    const newPlayAgainBtn = playAgainBtn.cloneNode(true);
    playAgainBtn.parentNode.replaceChild(newPlayAgainBtn, playAgainBtn);
    
    newRandomizeBtn.addEventListener('click', () => {
        if (gameOver) return;
        if (mode === 'pvc' || placementTurn === 1) {
            randomlyPlaceShips(player1.gameboard);
            renderBoard(player1.gameboard, 'player-board', true);
        } else {
            randomlyPlaceShips(player2.gameboard);
            renderBoard(player2.gameboard, 'player2-board', true);
        }
        if (mode === 'pvp') {
            document.getElementById('start-game-btn').disabled = false;
        }
    });

    newStartBtn.addEventListener('click', () => {
        if (mode === 'pvc') {
            startGame();
        } else { // pvp flow
            if (placementTurn === 1) {
                placementTurn = 2;
                document.querySelector('.player-board').classList.add('hidden');
                
                const turnHeader = document.querySelector('.game-turn h3');
                turnHeader.textContent = 'Pass the device to Player 2';
                turnHeader.classList.remove('hidden');
                
                newStartBtn.textContent = 'Continue';
                newRandomizeBtn.classList.add('hidden');
            } else if (placementTurn === 2) {
                placementTurn = 3;
                initManualPlacement();
                
                document.querySelector('.player2-board').classList.remove('hidden');
                renderBoard(player2.gameboard, 'player2-board', true);

                document.querySelector('.game-turn h3').classList.add('hidden');
                
                newStartBtn.textContent = 'Start Game';
                newStartBtn.disabled = true;
                newRandomizeBtn.classList.remove('hidden');
            } else {
                startGame();
            }
        }
    });

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
