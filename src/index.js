import './styles/general.css';
import './styles/header.css';
import './styles/main.css';
import './styles/main-menu.css';
import { initGame, addControlListeners } from './game.js';
import player1 from './assets/playericon1.png';
import player2 from './assets/playericon2.png';

const gameMenuHTML = `<div class="game-modes">
                <button id="player-vs-player"><span class="material-symbols-outlined">group</span><span>Player Vs Player</span></button>
                <button id="player-vs-computer"><span class="material-symbols-outlined">robot_2</span><span>Player Vs Computer</span></button>
            </div>`;

const gameHTML = `
    <div class="board-container player-board">
            <div class="player-tag">
                <div class="player1-icon">
                    <img width="80px" height="80px" src="${player1}">
                </div>
                <div class="player1-details">
                    <h3 id="player1-name">Player</h3>
                    <p><span>Ships Alive: </span><span id="player1-ships">5</span></p>
                </div>
            </div>
            <div class="board" id="player-board"></div>
        </div>
            <div class="game-turn">
                <button id="randomize-ships-btn">Randomize Ships</button>
                <button id="start-game-btn" class="hidden">Start Game</button>
                <h3>Player's Turn</h3>
                <button id="play-again-btn" class="hidden">Play Again</button>
            </div>
            <div class="board-container player2-board">
                <div class="player-tag">
                    <div class="player2-icon">
                        <img width="80px" height="80px" src="${player2}">
                    </div>
                    <div class="player2-details">
                        <h3 id="player2-name">Computer</h3>
                        <p><span>Ships Alive: </span><span id="player2-ships">5</span></p>
                    </div>
                </div>
                <div class="board" id="player2-board"></div>
            </div>
`;

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const gameOptionsBtn = document.getElementById('game-options-btn');
    const gameOptions = document.querySelector(".game-options");
    const goToMainMenu = document.getElementById("menu");
    const restartGame = document.getElementById("restart-game");

    let currentGameMode = null;

    const playerVsComputer = () => {
        main.innerHTML = gameHTML;
        document.getElementById('player2-name').textContent = 'Computer';
        initGame('pvc');
        addControlListeners('pvc');
        currentGameMode = 'pvc';
    };

    const playerVsPlayer =  () => {
        main.innerHTML = gameHTML;
        document.getElementById('player1-name').textContent = 'Player 1';
        document.getElementById('player2-name').textContent = 'Player 2';
        initGame('pvp');
        addControlListeners('pvp');
        currentGameMode = 'pvp';
    };
    

    document.addEventListener("click", (e) => {
        if(e.target.closest("#player-vs-computer")){
            playerVsComputer();
        }

        if(e.target.closest("#player-vs-player")){
            playerVsPlayer()
        }
    })

    gameOptionsBtn.addEventListener('click', () => gameOptions.showModal());
    document.getElementById("exit-option").addEventListener('click', () => gameOptions.close());

    goToMainMenu.addEventListener("click", () => {
        main.innerHTML = gameMenuHTML;
        gameOptionsBtn.classList.remove('visible-inline-block');
        header.classList.add('center-content');
        gameOptions.close();
        currentGameMode = null;
    });

    restartGame.addEventListener("click", () => {
        if (currentGameMode === 'pvc') {
            playerVsComputer();
        } else if (currentGameMode === 'pvp') {
            playerVsPlayer();
        }
        gameOptions.close();
    });
});