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

const addAttackListener = (callback) => {
    const computerBoard = document.getElementById('computer-board');
    computerBoard.addEventListener('click', (e) => {
        if (e.target.classList.contains('cell') && !e.target.classList.contains('hit') && !e.target.classList.contains('miss')) {
            const row = e.target.dataset.row;
            const col = e.target.dataset.col;
            callback(row, col);
        }
    });
};


export { renderBoard, addAttackListener, updateCell };
