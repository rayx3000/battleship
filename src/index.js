import './styles/general.css';
import './styles/header.css';
import './styles/main.css';
import './styles/main-menu.css';
import { initGame, addControlListeners } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    initGame();
    addControlListeners();
});


const gameMenuHTML = `
    <div class="game-modes">
        <button><span class="material-symbols-outlined">group</span><span>Player Vs Player</span></button>
        <button><span class="material-symbols-outlined">robot_2</span><span>Player Vs Computer</span></button>
    </div>
`

const gameHTML = `
    <div class="board-container">
                <div class="player-tag">
                    <div class="player1-icon">
                        <img width="80px" height="80px" src="assets/playericon1.png">
                    </div>
                    <div class="player1-details">
                        <h3 id="player1-name">Player</h3>
                        <p><span>Ships Alive: </span><span id="player1-ships">10</span></p>
                    </div>
                </div>
                <div class="board" id="player-board"></div>
                <div class="ship-dock">
                    <div class="ship" data-length="5" draggable="true"></div>
                    <div class="ship" data-length="4" draggable="true"></div>
                    <div class="ship" data-length="3" draggable="true"></div>
                    <div class="ship" data-length="3" draggable="true"></div>
                    <div class="ship" data-length="2" draggable="true"></div>
                </div>
            </div>
            <div class="game-turn">
                <button id="rotate-ship-btn">Rotate</button>
                <button id="randomize-ships-btn">Randomize Ships</button>
                <button id="start-game-btn" style="display: none;">Start Game</button>
                <h3>Player's Turn</h3>
                <button id="play-again-btn" style="display: none;">Play Again</button>
            </div>
            <div class="board-container">
                <div class="player-tag">
                    <div class="player2-icon">
                        <img width="80px" height="80px" src="assets/playericon2.png">
                    </div>
                    <div class="player2-details">
                        <h3 id="player2-name">Computer</h3>
                        <p><span>Ships Alive: </span><span id="player2-ships">10</span></p>
                    </div>
                </div>
                <div class="board" id="computer-board"></div>
            </div>
`