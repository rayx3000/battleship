import './styles/general.css';
import './styles/header.css';
import './styles/main.css';

function hello(){
    return "hello!";
}

const greet = hello();
console.log(greet);

const gameOptionsBtn = document.getElementById("game-options-btn");
const gameOptions = document.querySelector(".game-options");
const exitOption = document.getElementById("exit-option");

gameOptionsBtn.addEventListener("click",  () => gameOptions.showModal());
exitOption.addEventListener("click", () => gameOptions.close());

const boards = document.querySelectorAll(".board");

function createBoardGrid(){
    boards.forEach(board => {
        const boardGrids = 10**2;
        board.style.gridTemplateColumns = `repeat(${Math.sqrt(boardGrids)}, 1fr)`;
        board.style.gridTemplateRows = `repeat(${Math.sqrt(boardGrids)}, 1fr)`;
        for(let i = 0; i < boardGrids; i++){
            const tile = document.createElement("div");
            tile.classList.add("tile");
            board.appendChild(tile);
        }
    });
}

createBoardGrid();