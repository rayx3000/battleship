const renderBoard = (gameboard, boardElementId, isPlayer) => {
  const boardElement = document.getElementById(boardElementId);
  boardElement.innerHTML = '';
  const board = gameboard.getBoard();
  const attackedCoords = gameboard.getAttackedCoords();

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = i;
      cell.dataset.col = j;
      const coord = `${i},${j}`;
      const cellContent = board[i][j];

      if (attackedCoords.has(coord)) {
        if (cellContent) {
          cell.classList.add('hit');
        } else {
          cell.classList.add('miss');
        }
      }
      
      if (isPlayer && cellContent) {
        cell.classList.add('ship');
      }

      boardElement.appendChild(cell);
    }
  }
};

const updateCell = (gameboard, boardElementId, row, col) => {
    const boardElement = document.getElementById(boardElementId);
    const cell = boardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const coord = `${row},${col}`;
    const cellContent = gameboard.getBoard()[row][col];
    const attackedCoords = gameboard.getAttackedCoords();

    if (attackedCoords.has(coord)) {
        if (cellContent) {
            cell.classList.add('hit');
        } else {
            cell.classList.add('miss');
        }
    }
};

const addAttackListener = (callback, boardId) => {
    const board = document.getElementById(boardId);
    if (!board) return;

    // Clone and replace to remove old listeners
    const newBoard = board.cloneNode(true);
    board.parentNode.replaceChild(newBoard, board);

    newBoard.addEventListener('click', (e) => {
        if (e.target.classList.contains('cell') && !e.target.classList.contains('hit') && !e.target.classList.contains('miss')) {
            const row = e.target.dataset.row;
            const col = e.target.dataset.col;
            callback(row, col, boardId);
        }
    });
};

const updateShipsAlive = (player1, player2) => {
    const player1ShipsAlive = player1.gameboard.getShips().filter(ship => !ship.isSunk()).length;
    const player2ShipsAlive = player2.gameboard.getShips().filter(ship => !ship.isSunk()).length;

    document.getElementById('player1-ships').textContent = player1ShipsAlive;
    document.getElementById('player2-ships').textContent = player2ShipsAlive;
};


export { renderBoard, addAttackListener, updateCell, updateShipsAlive, addDragAndDropListeners };

function addDragAndDropListeners(placeShipCallback) {
  const ships = document.querySelectorAll('.ship-dock .ship');
  const boardCells = document.querySelectorAll('#player-board .cell');

  ships.forEach(ship => {
    ship.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify({
        length: ship.dataset.length,
        isVertical: false,
        id: ship.id
      }));
      setTimeout(() => {
        ship.classList.add('dragging');
      }, 0);
    });

    ship.addEventListener('dragend', () => {
      ship.classList.remove('dragging');
    });
  });

  boardCells.forEach(cell => {
    cell.addEventListener('dragover', (e) => {
      if (!cell.classList.contains('ship')) {
        e.preventDefault(); // Allow dropping
      }
    });

    cell.addEventListener('drop', (e) => {
      e.preventDefault();
      const shipData = JSON.parse(e.dataTransfer.getData('text/plain'));
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);

      placeShipCallback(shipData.length, row, col, shipData.isVertical, shipData.id);
    });
  });
}
