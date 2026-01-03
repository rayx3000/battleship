import Player from './Player.js';

const ComputerPlayer = () => {
  const player = Player('Computer');
  const attackCoords = new Set();
  let targetQueue = [];

  const randomAttack = (enemyGameboard) => {
    let row, col;
    let coord;

    if (targetQueue.length > 0) {
        const nextTarget = targetQueue.shift();
        row = nextTarget.row;
        col = nextTarget.col;
        coord = `${row},${col}`;
    } else {
        do {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
            coord = `${row},${col}`;
        } while (attackCoords.has(coord));
    }
    
    if (attackCoords.has(coord)) {
        // This can happen if a target was already in the queue,
        // and it was also randomly selected.
        // Or if multiple hits generate the same target.
        // In this case, just get another target.
        return randomAttack(enemyGameboard);
    }

    const isHit = player.attack(enemyGameboard, row, col);
    attackCoords.add(coord);

    if (isHit) {
      const cellContent = enemyGameboard.getBoard()[row][col];
      if (cellContent && cellContent.ship.isSunk()) {
        // Ship sunk, clear the queue and go back to hunt mode
        targetQueue = [];
      } else {
        // Hit, but not sunk. Add neighbors to the queue.
        const targets = [];
        if (row > 0) targets.push({ row: row - 1, col });
        if (row < 9) targets.push({ row: row + 1, col });
        if (col > 0) targets.push({ row, col: col - 1 });
        if (col < 9) targets.push({ row, col: col + 1 });
        
        // Add valid new targets to the front of the queue
        targetQueue.unshift(...targets.filter(t => !attackCoords.has(`${t.row},${t.col}`)));
      }
    }

    return { row, col, isHit };
  };

  return {
    ...player,
    randomAttack,
  };
};

export default ComputerPlayer;
