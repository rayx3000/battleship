import './styles/general.css';
import './styles/header.css';
import './styles/main.css';
import { initGame, addControlListeners } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    initGame();
    addControlListeners();
});
